import { FlatList, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Check, Play, Plus } from 'lucide-react-native';

import { EpisodePlayButton, EpisodeRow, ShowCard } from '@/components/podcast';
import { Artwork, Button, Chip, IconButton, ProgressBar, SectionHeader, useBottomInset, useTopInset } from '@/components/ui';
import {
  categories,
  categoryById,
  currentUser,
  episodeById,
  featuredShowIds,
  friends,
  latestEpisode,
  showById,
  shows,
  trendingShowIds,
} from '@/data/podcasts';
import { useLibrary } from '@/store/library';
import { useEpisodeProgress, usePlayer, useProgress } from '@/store/player';
import { colors, radius, type } from '@/theme';
import { formatMinutesAgo, formatRemaining } from '@/utils/format';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const top = useTopInset();
  const bottom = useBottomInset();
  const { following, interests, isFollowing } = useLibrary();
  const { positions, completed } = useProgress();

  const continueListening = Object.keys(positions).filter(
    (id) => positions[id] > 0 && !completed.includes(id) && episodeById[id],
  );
  const newFromFollowing = following.map((showId) => latestEpisode(showId).id).slice(0, 4);
  const interest = interests.map((id) => categoryById[id]).find(Boolean);
  const recommended = shows.filter(
    (show) => !isFollowing(show.id) && (interests.length === 0 || interests.includes(show.categoryId)),
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      testID="home-screen"
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={type.caption}>{greeting()}</Text>
          <Text style={type.hero}>{currentUser.name.split(' ')[0]}</Text>
        </View>
        <Pressable onPress={() => router.navigate('/profile')} accessibilityRole="button" accessibilityLabel="Your profile">
          <Image source={currentUser.avatar} style={styles.avatar} />
        </Pressable>
      </View>

      <FeaturedCarousel />

      {continueListening.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Continue listening" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {continueListening.map((id) => (
              <ContinueCard key={id} episodeId={id} />
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <SectionHeader title="Browse categories" onSeeAll={() => router.navigate('/search')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              selected={false}
              onPress={() => router.push(`/category/${category.id}`)}
            />
          ))}
        </ScrollView>
      </View>

      {newFromFollowing.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="New from your shows" onSeeAll={() => router.navigate('/library')} />
          {newFromFollowing.map((id) => (
            <EpisodeRow key={id} episodeId={id} />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <SectionHeader title="Trending now" />
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          {trendingShowIds.slice(0, 5).map((id, index) => (
            <TrendingRow key={id} showId={id} rank={index + 1} />
          ))}
        </View>
      </View>

      {recommended.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title={interest ? `Because you like ${interest.name}` : 'Recommended for you'} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {recommended.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <SectionHeader title="Friends are listening" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {friends.map((friend) => {
            const episode = episodeById[friend.episodeId];
            const show = showById[episode.showId];
            return (
              <Pressable
                key={friend.id}
                onPress={() => router.push(`/episode/${episode.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`${friend.name} is listening to ${episode.title}`}
                style={styles.friendCard}
              >
                <View style={styles.friendHeader}>
                  <Image source={friend.avatar} style={styles.friendAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={type.headline}>{friend.name}</Text>
                    <Text style={type.caption}>{formatMinutesAgo(friend.minutesAgo)}</Text>
                  </View>
                </View>
                <View style={styles.friendEpisode}>
                  <Artwork uri={show.image} size={44} rounded={radius.sm} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.friendEpisodeTitle} numberOfLines={2}>
                      {episode.title}
                    </Text>
                    <Text style={type.caption} numberOfLines={1}>
                      {show.title}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

function FeaturedCarousel() {
  const { width } = useWindowDimensions();
  const { play } = usePlayer();
  const { isFollowing, toggleFollow } = useLibrary();
  const cardWidth = width - 40;

  return (
    <FlatList
      data={featuredShowIds}
      keyExtractor={(id) => id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={cardWidth + 12}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 20, gap: 12, marginTop: 20 }}
      renderItem={({ item }) => {
        const show = showById[item];
        const category = categoryById[show.categoryId];
        const following = isFollowing(show.id);
        return (
          <View style={[styles.featured, { width: cardWidth }]}>
            <Image source={show.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.95)']}
              locations={[0.2, 0.55, 1]}
              style={StyleSheet.absoluteFill}
            />
            <Pressable
              onPress={() => router.push(`/show/${show.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Featured: ${show.title}`}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.featuredBadge} pointerEvents="none">
              <Text style={styles.featuredBadgeText}>FEATURED · {category.name.toUpperCase()}</Text>
            </View>
            <View style={styles.featuredBody} pointerEvents="box-none">
              <View pointerEvents="none" style={{ gap: 8 }}>
                <Text style={styles.featuredTitle}>{show.title}</Text>
                <Text style={styles.featuredDescription} numberOfLines={2}>
                  {show.description}
                </Text>
              </View>
              <View style={styles.featuredActions}>
                <Button
                  label="Play latest"
                  accessibilityLabel={`Play latest ${show.title}`}
                  icon={Play}
                  compact
                  onPress={() => play(latestEpisode(show.id).id)}
                />
                <Button
                  label={following ? 'Following' : 'Follow'}
                  accessibilityLabel={following ? `Unfollow ${show.title}` : `Follow ${show.title}`}
                  icon={following ? Check : Plus}
                  compact
                  variant="secondary"
                  onPress={() => toggleFollow(show.id)}
                />
              </View>
            </View>
          </View>
        );
      }}
    />
  );
}

function ContinueCard({ episodeId }: { episodeId: string }) {
  const episode = episodeById[episodeId];
  const show = showById[episode.showId];
  const progress = useEpisodeProgress(episodeId);

  return (
    <View style={styles.continueCard}>
      <Pressable
        onPress={() => router.push(`/episode/${episodeId}`)}
        accessibilityRole="button"
        accessibilityLabel={`Continue ${episode.title}`}
      >
        <Image source={show.image} style={styles.continueImage} contentFit="cover" />
        <View style={{ padding: 12, gap: 6 }}>
          <Text style={styles.friendEpisodeTitle} numberOfLines={2}>
            {episode.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ProgressBar fraction={progress.fraction} style={{ flex: 1 }} />
            <Text style={[type.caption, { fontSize: 12 }]}>{formatRemaining(progress.remaining)}</Text>
          </View>
        </View>
      </Pressable>
      <View style={styles.continuePlay}>
        <EpisodePlayButton episodeId={episodeId} size={40} />
      </View>
    </View>
  );
}

function TrendingRow({ showId, rank }: { showId: string; rank: number }) {
  const show = showById[showId];
  const { isFollowing, toggleFollow } = useLibrary();
  const following = isFollowing(showId);

  return (
    <View style={styles.trendingRow}>
      <Pressable
        onPress={() => router.push(`/show/${showId}`)}
        accessibilityRole="button"
        accessibilityLabel={`Trending ${rank}: ${show.title}`}
        style={[styles.trendingRow, { flex: 1 }]}
      >
        <Text style={styles.rank}>{rank}</Text>
        <Artwork uri={show.image} size={56} rounded={radius.md} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={type.headline} numberOfLines={1}>
            {show.title}
          </Text>
          <Text style={type.caption} numberOfLines={1}>
            {categoryById[show.categoryId].name} · {show.author}
          </Text>
        </View>
      </Pressable>
      <IconButton
        icon={following ? Check : Plus}
        label={following ? `Unfollow ${show.title}` : `Follow ${show.title}`}
        onPress={() => toggleFollow(showId)}
        variant={following ? 'primary' : 'filled'}
        size={18}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  section: {
    marginTop: 32,
  },
  hList: {
    paddingHorizontal: 20,
    gap: 14,
  },
  chips: {
    paddingHorizontal: 20,
    gap: 8,
  },
  featured: {
    height: 360,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'flex-end',
  },
  featuredBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  featuredBody: {
    padding: 20,
    gap: 8,
  },
  featuredTitle: {
    ...type.hero,
    fontSize: 30,
  },
  featuredDescription: {
    ...type.body,
    color: 'rgba(255,255,255,0.78)',
  },
  featuredActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  continueCard: {
    width: 220,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceRaised,
    overflow: 'hidden',
  },
  continueImage: {
    width: 220,
    height: 124,
  },
  continuePlay: {
    position: 'absolute',
    right: 10,
    top: 74,
  },
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rank: {
    width: 22,
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  friendCard: {
    width: 240,
    padding: 14,
    gap: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceRaised,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  friendAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  friendEpisode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  friendEpisodeTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
  },
});
