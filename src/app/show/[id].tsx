import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowDownUp, Bell, BellOff, Check, MessageSquareText, Play, Plus, Share2 } from 'lucide-react-native';

import { EpisodeRow } from '@/components/podcast';
import { Stars } from '@/components/stars';
import { useToast } from '@/components/toast';
import { Button, Chip, EmptyState, IconButton, TopBar, useBottomInset } from '@/components/ui';
import { categoryById, episodesForShow, reviewsForShow, showById } from '@/data/podcasts';
import { useLibrary } from '@/store/library';
import { usePlayer } from '@/store/player';
import { colors, radius, type } from '@/theme';
import { formatCount, formatDaysAgo } from '@/utils/format';

export default function ShowScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const show = showById[id];
  const bottom = useBottomInset();
  const toast = useToast();
  const { isFollowing, toggleFollow, userReviews, mutedShows, toggleShowAlerts } = useLibrary();
  const { play } = usePlayer();
  const [tab, setTab] = useState<'Episodes' | 'Reviews'>('Episodes');
  const [newestFirst, setNewestFirst] = useState(true);
  const [expanded, setExpanded] = useState(false);

  if (!show) {
    return (
      <View style={styles.screen}>
        <TopBar />
        <EmptyState icon={MessageSquareText} title="Show not found" message="This show may have been removed." />
      </View>
    );
  }

  const following = isFollowing(show.id);
  const alertsOn = following && !mutedShows.includes(show.id);
  const episodes = episodesForShow(show.id);
  const sorted = newestFirst ? episodes : [...episodes].reverse();
  const myReview = userReviews[show.id];
  const reviews = [...(myReview ? [myReview] : []), ...reviewsForShow(show.id)];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottom }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={show.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.85)', '#000']}
            locations={[0, 0.3, 0.8, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroBody}>
            <Text style={styles.category}>{categoryById[show.categoryId].name.toUpperCase()}</Text>
            <Text style={type.hero} accessibilityRole="header">
              {show.title}
            </Text>
            <Text style={[type.headline, { color: colors.textSecondary }]}>{show.author}</Text>
          </View>
        </View>

        <View style={styles.meta}>
          <Stars rating={show.rating} />
          <Text style={type.caption}>
            {show.rating} ({formatCount(show.ratingCount)}) · {formatCount(show.followers + (following ? 1 : 0))} followers
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            label={following ? 'Following' : 'Follow'}
            icon={following ? Check : Plus}
            variant={following ? 'secondary' : 'primary'}
            onPress={() => {
              toggleFollow(show.id);
              toast.show(following ? `Unfollowed ${show.title}` : `Following ${show.title}`);
            }}
            style={{ flex: 1 }}
          />
          <Button
            label="Play latest"
            icon={Play}
            variant="secondary"
            onPress={() => play(episodes[0].id)}
            style={{ flex: 1 }}
          />
          <IconButton
            icon={alertsOn ? Bell : BellOff}
            label={alertsOn ? 'Turn off new episode alerts' : 'Turn on new episode alerts'}
            active={alertsOn}
            variant="filled"
            disabled={!following}
            onPress={() => {
              toggleShowAlerts(show.id);
              toast.show(alertsOn ? 'Alerts off for this show' : 'You’ll be notified of new episodes');
            }}
          />
        </View>

        <Pressable onPress={() => setExpanded((value) => !value)} style={styles.description} accessibilityRole="button" accessibilityLabel="Show description">
          <Text style={type.body} numberOfLines={expanded ? undefined : 3}>
            {show.description}
          </Text>
          <Text style={styles.more}>{expanded ? 'Less' : 'More'}</Text>
        </Pressable>

        <View style={styles.tabs}>
          <Chip label="Episodes" selected={tab === 'Episodes'} onPress={() => setTab('Episodes')} />
          <Chip label="Reviews" selected={tab === 'Reviews'} onPress={() => setTab('Reviews')} />
          {tab === 'Episodes' && (
            <Pressable
              onPress={() => setNewestFirst((value) => !value)}
              accessibilityRole="button"
              accessibilityLabel={newestFirst ? 'Sort oldest first' : 'Sort newest first'}
              style={styles.sort}
            >
              <ArrowDownUp size={16} color={colors.textSecondary} />
              <Text style={type.caption}>{newestFirst ? 'Newest' : 'Oldest'}</Text>
            </Pressable>
          )}
        </View>

        {tab === 'Episodes' && sorted.map((episode) => <EpisodeRow key={episode.id} episodeId={episode.id} showArtwork={false} />)}

        {tab === 'Reviews' && (
          <View style={{ paddingHorizontal: 20, gap: 12 }}>
            <View style={styles.ratingSummary}>
              <Text style={styles.ratingBig}>{show.rating.toFixed(1)}</Text>
              <View style={{ gap: 6, flex: 1 }}>
                <Stars rating={show.rating} size={18} />
                <Text style={type.caption}>{formatCount(show.ratingCount)} ratings</Text>
              </View>
              <Button
                label={myReview ? 'Edit review' : 'Write a review'}
                compact
                variant="ghost"
                onPress={() => router.push({ pathname: '/review', params: { showId: show.id } })}
              />
            </View>
            {reviews.map((review) => (
              <View key={review.id} style={styles.review} accessibilityLabel={`Review by ${review.author}`}>
                <View style={styles.reviewHeader}>
                  <Stars rating={review.rating} size={12} />
                  <Text style={[type.caption, { marginLeft: 'auto' }]}>
                    {review.author} · {formatDaysAgo(review.daysAgo)}
                  </Text>
                </View>
                <Text style={type.headline}>{review.title}</Text>
                <Text style={type.body}>{review.body}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.topBar}>
        <TopBar
          transparent
          right={
            <IconButton
              icon={Share2}
              label="Share show"
              variant="filled"
              onPress={() => router.push({ pathname: '/share', params: { showId: show.id } })}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  hero: {
    height: 420,
    justifyContent: 'flex-end',
  },
  heroBody: {
    paddingHorizontal: 20,
    gap: 4,
  },
  category: {
    color: colors.primaryText,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  description: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 4,
  },
  more: {
    color: colors.primaryText,
    fontWeight: '700',
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  sort: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 8,
  },
  ratingBig: {
    color: colors.text,
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
  },
  review: {
    padding: 16,
    gap: 6,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceRaised,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
