import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Check,
  CircleArrowDown,
  CircleCheck,
  FileQuestion,
  Heart,
  ListChecks,
  ListEnd,
  ListMusic,
  Pause,
  Play,
  Share2,
  type LucideIcon,
} from 'lucide-react-native';

import { EpisodeMeta } from '@/components/podcast';
import { useToast } from '@/components/toast';
import { Artwork, Button, EmptyState, IconButton, TopBar, useBottomInset } from '@/components/ui';
import { episodeById, showById } from '@/data/podcasts';
import { useLibrary } from '@/store/library';
import { useEpisodeProgress, usePlayer } from '@/store/player';
import { colors, radius, type } from '@/theme';
import { formatClock, formatDaysAgo, formatDuration, formatRemaining } from '@/utils/format';

export default function EpisodeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const episode = episodeById[id];
  const bottom = useBottomInset();
  const toast = useToast();
  const library = useLibrary();
  const player = usePlayer();
  const progress = useEpisodeProgress(episode?.id ?? '');

  if (!episode) {
    return (
      <View style={styles.screen}>
        <TopBar />
        <EmptyState icon={FileQuestion} title="Episode not found" message="This episode may have been removed." />
      </View>
    );
  }

  const show = showById[episode.showId];
  const isCurrent = player.currentId === episode.id;
  const isPlaying = isCurrent && player.isPlaying;
  const liked = library.isLiked(episode.id);
  const download = library.downloads[episode.id];
  const queued = player.queue.includes(episode.id);

  const playLabel = isPlaying
    ? 'Pause'
    : progress.isStarted
      ? `Resume · ${formatRemaining(progress.remaining)}`
      : progress.isCompleted
        ? 'Play again'
        : `Play · ${formatDuration(episode.duration)}`;

  const playChapter = (start: number) => player.play(episode.id, start);

  return (
    <View style={styles.screen}>
      <TopBar
        right={
          <IconButton
            icon={Share2}
            label="Share episode"
            onPress={() => router.push({ pathname: '/share', params: { episodeId: episode.id } })}
          />
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: bottom }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Artwork uri={show.image} size={128} rounded={radius.lg} />
          <View style={{ flex: 1, gap: 6 }}>
            <Pressable onPress={() => router.push(`/show/${show.id}`)} accessibilityRole="link" accessibilityLabel={`Go to ${show.title}`}>
              <Text style={styles.showLink}>{show.title}</Text>
            </Pressable>
            <Text style={type.caption}>
              Episode {episode.number} · {formatDaysAgo(episode.publishedDaysAgo)}
            </Text>
            <EpisodeMeta episodeId={episode.id} />
          </View>
        </View>

        <Text style={[type.title, styles.title]} accessibilityRole="header">
          {episode.title}
        </Text>

        <View style={styles.playRow}>
          <Button
            label={playLabel}
            icon={isPlaying ? Pause : Play}
            onPress={() => (isPlaying ? player.pause() : player.play(episode.id))}
            style={{ flex: 1 }}
            testID="episode-play"
          />
        </View>

        <View style={styles.actions}>
          <Action
            icon={Heart}
            label={liked ? 'Saved' : 'Save'}
            active={liked}
            fill={liked}
            onPress={() => {
              library.toggleLike(episode.id);
              toast.show(liked ? 'Removed from Saved' : 'Saved to your library');
            }}
          />
          <Action
            icon={download === undefined ? CircleArrowDown : download >= 1 ? CircleCheck : CircleArrowDown}
            label={download === undefined ? 'Download' : download >= 1 ? 'Downloaded' : `${Math.round(download * 100)}%`}
            active={download !== undefined}
            onPress={() => {
              if (download === undefined) {
                library.startDownload(episode.id);
                toast.show('Downloading episode');
              } else {
                library.removeDownload(episode.id);
                toast.show('Download removed');
              }
            }}
          />
          <Action
            icon={queued ? ListChecks : ListEnd}
            label={queued ? 'Queued' : 'Up Next'}
            active={queued}
            onPress={() => {
              if (queued) {
                player.removeFromQueue(episode.id);
                toast.show('Removed from Up Next');
              } else {
                player.addToQueue(episode.id);
                toast.show('Added to Up Next');
              }
            }}
          />
          <Action
            icon={ListMusic}
            label="Playlist"
            onPress={() => router.push({ pathname: '/add-to-playlist', params: { episodeId: episode.id } })}
          />
          <Action
            icon={Share2}
            label="Share"
            onPress={() => router.push({ pathname: '/share', params: { episodeId: episode.id } })}
          />
        </View>

        <Pressable
          onPress={() => (progress.isCompleted ? player.markUnplayed(episode.id) : player.markPlayed(episode.id))}
          accessibilityRole="button"
          accessibilityLabel={progress.isCompleted ? 'Mark as unplayed' : 'Mark as played'}
          style={styles.markPlayed}
        >
          <Check size={16} color={colors.textSecondary} />
          <Text style={type.caption}>{progress.isCompleted ? 'Mark as unplayed' : 'Mark as played'}</Text>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ABOUT THIS EPISODE</Text>
          <Text style={type.body}>{episode.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CHAPTERS</Text>
          {episode.chapters.map((chapter, index) => (
            <Pressable
              key={chapter.title}
              onPress={() => playChapter(chapter.start)}
              accessibilityRole="button"
              accessibilityLabel={`Play chapter ${chapter.title}`}
              style={styles.chapter}
            >
              <Text style={styles.chapterIndex}>{index + 1}</Text>
              <Text style={[type.headline, { flex: 1 }]}>{chapter.title}</Text>
              <Text style={styles.chapterTime}>{formatClock(chapter.start)}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Action({
  icon: Icon,
  label,
  onPress,
  active = false,
  fill = false,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  active?: boolean;
  fill?: boolean;
}) {
  const color = active ? colors.primary : colors.text;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [styles.action, pressed && { opacity: 0.6 }]}
    >
      <View style={[styles.actionIcon, active && { backgroundColor: colors.primarySoft }]}>
        <Icon size={22} color={color} fill={fill ? color : 'transparent'} />
      </View>
      <Text style={[styles.actionLabel, active && { color: colors.primaryText }]}>{label}</Text>
    </Pressable>
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
    gap: 16,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  showLink: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: '700',
  },
  title: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  playRow: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginTop: 20,
  },
  action: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  markPlayed: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    marginTop: 20,
    padding: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 10,
  },
  sectionLabel: {
    ...type.micro,
  },
  chapter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  chapterIndex: {
    width: 20,
    color: colors.textTertiary,
    fontWeight: '700',
  },
  chapterTime: {
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
    fontWeight: '600',
  },
});
