import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Check, CircleArrowDown, Pause, Play } from 'lucide-react-native';

import { Artwork, ProgressBar } from '@/components/ui';
import { episodeById, showById, type Show } from '@/data/podcasts';
import { useLibrary } from '@/store/library';
import { useEpisodeProgress, usePlayer } from '@/store/player';
import { colors, radius, type } from '@/theme';
import { formatDaysAgo, formatDuration, formatRemaining } from '@/utils/format';

export function ShowCard({ show, size = 148 }: { show: Show; size?: number }) {
  return (
    <Pressable
      onPress={() => router.push(`/show/${show.id}`)}
      accessibilityRole="button"
      accessibilityLabel={show.title}
      style={({ pressed }) => [{ width: size, gap: 8 }, pressed && { opacity: 0.7 }]}
    >
      <Artwork uri={show.image} size={size} rounded={radius.lg} />
      <View style={{ gap: 2 }}>
        <Text style={type.headline} numberOfLines={1}>
          {show.title}
        </Text>
        <Text style={type.caption} numberOfLines={1}>
          {show.author}
        </Text>
      </View>
    </Pressable>
  );
}

export function EpisodePlayButton({ episodeId, size = 40 }: { episodeId: string; size?: number }) {
  const { currentId, isPlaying, play, pause } = usePlayer();
  const episode = episodeById[episodeId];
  const active = currentId === episodeId && isPlaying;
  const Icon = active ? Pause : Play;
  return (
    <Pressable
      onPress={() => (active ? pause() : play(episodeId))}
      accessibilityRole="button"
      accessibilityLabel={`${active ? 'Pause' : 'Play'} ${episode.title}`}
      hitSlop={8}
      style={({ pressed }) => [
        styles.playButton,
        { width: size, height: size, borderRadius: size / 2 },
        active && { backgroundColor: colors.primary },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Icon size={size * 0.42} color="#fff" fill="#fff" style={active ? undefined : { marginLeft: 2 }} />
    </Pressable>
  );
}

export function EpisodeMeta({ episodeId }: { episodeId: string }) {
  const episode = episodeById[episodeId];
  const { downloads } = useLibrary();
  const progress = useEpisodeProgress(episodeId);
  const download = downloads[episodeId];

  return (
    <View style={styles.metaRow}>
      {progress.isCompleted ? (
        <View style={styles.metaRow}>
          <Check size={14} color={colors.success} strokeWidth={3} />
          <Text style={[type.caption, { color: colors.success }]}>Played</Text>
        </View>
      ) : progress.isStarted ? (
        <>
          <ProgressBar fraction={progress.fraction} style={{ width: 44 }} />
          <Text style={[type.caption, { color: colors.primaryText }]}>{formatRemaining(progress.remaining)}</Text>
        </>
      ) : (
        <Text style={type.caption}>{formatDuration(episode.duration)}</Text>
      )}
      {download !== undefined && (
        <View style={styles.metaRow} accessibilityLabel={download >= 1 ? 'Downloaded' : 'Downloading'}>
          <CircleArrowDown size={14} color={download >= 1 ? colors.primary : colors.textTertiary} />
          {download < 1 && <Text style={type.caption}>{Math.round(download * 100)}%</Text>}
        </View>
      )}
    </View>
  );
}

export function EpisodeRow({ episodeId, showArtwork = true }: { episodeId: string; showArtwork?: boolean }) {
  const episode = episodeById[episodeId];
  const show = showById[episode.showId];

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => router.push(`/episode/${episode.id}`)}
        accessibilityRole="button"
        accessibilityLabel={`Episode ${episode.title}`}
        style={({ pressed }) => [styles.rowMain, pressed && { opacity: 0.6 }]}
      >
        {showArtwork && <Artwork uri={show.image} size={64} rounded={radius.md} />}
        <View style={styles.rowBody}>
          <Text style={styles.rowEyebrow} numberOfLines={1}>
            {showArtwork ? `${show.title} · ` : ''}
            {formatDaysAgo(episode.publishedDaysAgo).toUpperCase()}
          </Text>
          <Text style={styles.rowTitle} numberOfLines={2}>
            {episode.title}
          </Text>
          <EpisodeMeta episodeId={episodeId} />
        </View>
      </Pressable>
      <EpisodePlayButton episodeId={episodeId} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  rowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  rowEyebrow: {
    ...type.micro,
    letterSpacing: 0.4,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playButton: {
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
