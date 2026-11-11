import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, ListMusic, Plus } from 'lucide-react-native';

import { Button } from '@/components/ui';
import { episodeById } from '@/data/podcasts';
import { useLibrary } from '@/store/library';
import { colors, radius, type } from '@/theme';

export default function AddToPlaylistSheet() {
  const { episodeId } = useLocalSearchParams<{ episodeId: string }>();
  const { playlists, toggleInPlaylist } = useLibrary();
  const episode = episodeById[episodeId];
  if (!episode) return null;

  return (
    <ScrollView style={styles.sheet} contentContainerStyle={{ padding: 24, gap: 8 }}>
      <Text style={type.title} accessibilityRole="header">
        Add to playlist
      </Text>
      <Text style={[type.caption, { marginBottom: 12 }]} numberOfLines={1}>
        {episode.title}
      </Text>
      {playlists.map((playlist) => {
        const included = playlist.episodeIds.includes(episode.id);
        return (
          <Pressable
            key={playlist.id}
            onPress={() => toggleInPlaylist(playlist.id, episode.id)}
            accessibilityRole="checkbox"
            accessibilityLabel={playlist.name}
            accessibilityState={{ checked: included }}
            style={[styles.row, included && styles.rowSelected]}
          >
            <View style={styles.icon}>
              <ListMusic size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={type.headline}>{playlist.name}</Text>
              <Text style={type.caption}>
                {playlist.episodeIds.length} episode{playlist.episodeIds.length === 1 ? '' : 's'}
              </Text>
            </View>
            <View style={[styles.check, included && styles.checkOn]}>{included && <Check size={16} color="#fff" strokeWidth={3} />}</View>
          </Pressable>
        );
      })}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
        <Button
          label="New playlist"
          icon={Plus}
          variant="secondary"
          style={{ flex: 1 }}
          onPress={() => router.push({ pathname: '/new-playlist', params: { episodeId: episode.id } })}
        />
        <Button label="Done" style={{ flex: 1 }} onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
  },
  rowSelected: {
    backgroundColor: colors.primarySoft,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
});
