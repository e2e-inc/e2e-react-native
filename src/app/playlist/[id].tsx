import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ListMusic, Play, Trash2 } from 'lucide-react-native';

import { EpisodeRow } from '@/components/podcast';
import { useToast } from '@/components/toast';
import { Button, EmptyState, IconButton, TopBar, useBottomInset } from '@/components/ui';
import { episodeById } from '@/data/podcasts';
import { useLibrary } from '@/store/library';
import { usePlayer } from '@/store/player';
import { colors, type } from '@/theme';
import { formatDuration } from '@/utils/format';

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { playlists, deletePlaylist } = useLibrary();
  const { play, addToQueue } = usePlayer();
  const toast = useToast();
  const bottom = useBottomInset();
  const playlist = playlists.find((item) => item.id === id);

  if (!playlist) {
    return (
      <View style={styles.screen}>
        <TopBar />
        <EmptyState icon={ListMusic} title="Playlist not found" message="It may have been deleted." />
      </View>
    );
  }

  const total = playlist.episodeIds.reduce((sum, episodeId) => sum + episodeById[episodeId].duration, 0);

  const playAll = () => {
    const [first, ...rest] = playlist.episodeIds;
    if (!first) return;
    play(first);
    rest.forEach(addToQueue);
    toast.show(`Playing “${playlist.name}”`);
  };

  const confirmDelete = () =>
    Alert.alert('Delete playlist?', `“${playlist.name}” will be removed from your library.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          router.back();
          deletePlaylist(playlist.id);
          toast.show('Playlist deleted');
        },
      },
    ]);

  return (
    <View style={styles.screen}>
      <TopBar right={<IconButton icon={Trash2} label="Delete playlist" onPress={confirmDelete} color={colors.danger} />} />
      <ScrollView contentContainerStyle={{ paddingBottom: bottom }}>
        <View style={styles.header}>
          <View style={styles.cover}>
            <ListMusic size={44} color="#fff" />
          </View>
          <Text style={type.title} accessibilityRole="header">
            {playlist.name}
          </Text>
          <Text style={type.caption}>
            {playlist.episodeIds.length} episode{playlist.episodeIds.length === 1 ? '' : 's'}
            {total > 0 ? ` · ${formatDuration(total)}` : ''}
          </Text>
          {playlist.episodeIds.length > 0 && <Button label="Play all" icon={Play} onPress={playAll} style={{ marginTop: 8 }} />}
        </View>
        {playlist.episodeIds.length === 0 ? (
          <EmptyState icon={ListMusic} title="No episodes yet" message="Open any episode and tap Playlist to add it here." />
        ) : (
          playlist.episodeIds.map((episodeId) => <EpisodeRow key={episodeId} episodeId={episodeId} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cover: {
    width: 140,
    height: 140,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
});
