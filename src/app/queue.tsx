import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, ChevronUp, ListMusic, X } from 'lucide-react-native';

import { Artwork, Button, EmptyState, IconButton, ProgressBar, TopBar } from '@/components/ui';
import { episodeById, showById } from '@/data/podcasts';
import { useEpisodeProgress, usePlayer } from '@/store/player';
import { colors, radius, type } from '@/theme';
import { formatDuration } from '@/utils/format';

export default function QueueScreen() {
  const insets = useSafeAreaInsets();
  const { currentId, queue, play, removeFromQueue, moveInQueue, clearQueue } = usePlayer();

  return (
    <View style={styles.screen}>
      <TopBar
        title="Up Next"
        right={queue.length > 0 ? <Button label="Clear" compact variant="ghost" onPress={clearQueue} /> : undefined}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {currentId && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>NOW PLAYING</Text>
            <NowPlaying episodeId={currentId} />
          </View>
        )}

        <Text style={styles.label}>QUEUE</Text>
        {queue.length === 0 ? (
          <EmptyState icon={ListMusic} title="Your queue is empty" message="Add episodes to Up Next and they’ll play automatically." />
        ) : (
          queue.map((id, index) => {
            const episode = episodeById[id];
            const show = showById[episode.showId];
            return (
              <View key={id} style={styles.row} accessibilityLabel={`Queued: ${episode.title}`}>
                <Pressable
                  onPress={() => play(id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Play ${episode.title}`}
                  style={styles.rowMain}
                >
                  <Artwork uri={show.image} size={52} rounded={radius.sm} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={type.headline} numberOfLines={1}>
                      {episode.title}
                    </Text>
                    <Text style={type.caption} numberOfLines={1}>
                      {show.title} · {formatDuration(episode.duration)}
                    </Text>
                  </View>
                </Pressable>
                <IconButton
                  icon={ChevronUp}
                  label={`Move ${episode.title} up`}
                  onPress={() => moveInQueue(id, -1)}
                  disabled={index === 0}
                  size={20}
                />
                <IconButton
                  icon={ChevronDown}
                  label={`Move ${episode.title} down`}
                  onPress={() => moveInQueue(id, 1)}
                  disabled={index === queue.length - 1}
                  size={20}
                />
                <IconButton
                  icon={X}
                  label={`Remove ${episode.title} from queue`}
                  onPress={() => removeFromQueue(id)}
                  color={colors.textSecondary}
                  size={20}
                />
              </View>
            );
          })
        )}
        <Button
          label="Find something to play"
          variant="secondary"
          style={{ marginHorizontal: 20, marginTop: 20 }}
          onPress={() => {
            router.dismissAll();
            router.navigate('/search');
          }}
        />
      </ScrollView>
    </View>
  );
}

function NowPlaying({ episodeId }: { episodeId: string }) {
  const { isPlaying } = usePlayer();
  const episode = episodeById[episodeId];
  const show = showById[episode.showId];
  const { fraction } = useEpisodeProgress(episodeId);
  return (
    <View style={[styles.row, styles.nowPlaying]}>
      <Artwork uri={show.image} size={52} rounded={radius.sm} />
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={type.headline} numberOfLines={1}>
          {episode.title}
        </Text>
        <Text style={[type.caption, { color: colors.primaryText }]}>{isPlaying ? 'Playing' : 'Paused'} · {show.title}</Text>
        <ProgressBar fraction={fraction} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  label: {
    ...type.micro,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  rowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nowPlaying: {
    gap: 12,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },
});
