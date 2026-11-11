import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import {
  ChevronRight,
  CircleArrowDown,
  Heart,
  History,
  ListMusic,
  ListPlus,
  Podcast,
  Plus,
} from 'lucide-react-native';

import { EpisodeRow } from '@/components/podcast';
import { Artwork, Button, Chip, EmptyState, IconButton, useBottomInset, useTopInset } from '@/components/ui';
import { episodeById, showById } from '@/data/podcasts';
import { useLibrary } from '@/store/library';
import { usePlayer } from '@/store/player';
import { colors, radius, type } from '@/theme';

const segments = ['Shows', 'Saved', 'Downloads', 'Playlists', 'History'] as const;
type Segment = (typeof segments)[number];

export default function LibraryScreen() {
  const top = useTopInset();
  const bottom = useBottomInset();
  const { width } = useWindowDimensions();
  const [segment, setSegment] = useState<Segment>('Shows');
  const { following, liked, downloads, playlists } = useLibrary();
  const { queue, history, clearHistory } = usePlayer();
  const tileSize = Math.floor((width - 40 - 2 * 14) / 3);
  const downloadIds = Object.keys(downloads);
  const downloadedMb = downloadIds.reduce((sum, id) => sum + Math.round(episodeById[id].duration / 60), 0);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[type.hero, { flex: 1 }]} accessibilityRole="header">
          Library
        </Text>
        <IconButton icon={ListPlus} label="New playlist" onPress={() => router.push('/new-playlist')} variant="filled" />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segments}>
        {segments.map((item) => (
          <Chip key={item} label={item} selected={segment === item} onPress={() => setSegment(item)} />
        ))}
      </ScrollView>

      <Pressable
        onPress={() => router.push('/queue')}
        accessibilityRole="button"
        accessibilityLabel="Up Next"
        style={styles.queueCard}
      >
        <View style={styles.queueIcon}>
          <ListMusic size={22} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={type.headline}>Up Next</Text>
          <Text style={type.caption}>
            {queue.length === 0 ? 'Your queue is empty' : `${queue.length} episode${queue.length === 1 ? '' : 's'} queued`}
          </Text>
        </View>
        <ChevronRight size={20} color={colors.textTertiary} />
      </Pressable>

      {segment === 'Shows' &&
        (following.length === 0 ? (
          <EmptyState icon={Podcast} title="No shows yet" message="Follow shows to see them here and get their new episodes." />
        ) : (
          <View style={styles.grid}>
            {following.map((id) => {
              const show = showById[id];
              return (
                <Pressable
                  key={id}
                  onPress={() => router.push(`/show/${id}`)}
                  accessibilityRole="button"
                  accessibilityLabel={show.title}
                  style={{ width: tileSize, gap: 6 }}
                >
                  <Artwork uri={show.image} size={tileSize} rounded={radius.md} />
                  <Text style={styles.tileTitle} numberOfLines={1}>
                    {show.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}

      {segment === 'Saved' &&
        (liked.length === 0 ? (
          <EmptyState icon={Heart} title="Nothing saved" message="Tap the heart on any episode to save it for later." />
        ) : (
          liked.map((id) => <EpisodeRow key={id} episodeId={id} />)
        ))}

      {segment === 'Downloads' &&
        (downloadIds.length === 0 ? (
          <EmptyState icon={CircleArrowDown} title="No downloads" message="Download episodes to listen offline." />
        ) : (
          <>
            <Text style={[type.caption, styles.note]}>
              {downloadIds.length} episode{downloadIds.length === 1 ? '' : 's'} · {downloadedMb} MB on this device
            </Text>
            {downloadIds.map((id) => (
              <EpisodeRow key={id} episodeId={id} />
            ))}
          </>
        ))}

      {segment === 'Playlists' && (
        <View style={{ paddingHorizontal: 20, gap: 12, marginTop: 8 }}>
          {playlists.map((playlist) => {
            const cover = playlist.episodeIds[0] ? showById[episodeById[playlist.episodeIds[0]].showId].image : null;
            return (
              <Pressable
                key={playlist.id}
                onPress={() => router.push(`/playlist/${playlist.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`Playlist ${playlist.name}`}
                style={styles.playlistRow}
              >
                {cover ? (
                  <Artwork uri={cover} size={56} rounded={radius.md} />
                ) : (
                  <View style={styles.playlistPlaceholder}>
                    <ListMusic size={22} color={colors.primary} />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={type.headline}>{playlist.name}</Text>
                  <Text style={type.caption}>
                    {playlist.episodeIds.length} episode{playlist.episodeIds.length === 1 ? '' : 's'}
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textTertiary} />
              </Pressable>
            );
          })}
          <Button label="Create a playlist" icon={Plus} variant="secondary" onPress={() => router.push('/new-playlist')} />
        </View>
      )}

      {segment === 'History' &&
        (history.length === 0 ? (
          <EmptyState icon={History} title="No history yet" message="Episodes you play will show up here." />
        ) : (
          <>
            <View style={styles.historyHeader}>
              <Text style={type.caption}>Recently played</Text>
              <Button label="Clear history" variant="ghost" compact onPress={clearHistory} />
            </View>
            {history.map((id) => (
              <EpisodeRow key={id} episodeId={id} />
            ))}
          </>
        ))}
    </ScrollView>
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
    marginBottom: 16,
  },
  segments: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 16,
  },
  queueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceRaised,
  },
  queueIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 14,
    rowGap: 20,
  },
  tileTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  note: {
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  playlistPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});
