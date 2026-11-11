import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useToast } from '@/components/toast';
import { Button } from '@/components/ui';
import { useLibrary } from '@/store/library';
import { colors, radius, type } from '@/theme';

export default function NewPlaylistSheet() {
  const { episodeId } = useLocalSearchParams<{ episodeId?: string }>();
  const { createPlaylist, toggleInPlaylist } = useLibrary();
  const toast = useToast();
  const [name, setName] = useState('');
  const trimmed = name.trim();

  const create = () => {
    if (!trimmed) return;
    const playlist = createPlaylist(trimmed);
    if (episodeId) toggleInPlaylist(playlist.id, episodeId);
    router.back();
    if (!episodeId) toast.show(`Created “${trimmed}”`);
  };

  return (
    <View style={styles.sheet}>
      <Text style={type.title} accessibilityRole="header">
        New playlist
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Playlist name"
        placeholderTextColor={colors.textTertiary}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={create}
        style={styles.input}
        selectionColor={colors.primary}
        accessibilityLabel="Playlist name"
        maxLength={40}
      />
      <Button label="Create playlist" onPress={create} style={!trimmed && { opacity: 0.4 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    padding: 24,
    gap: 16,
    backgroundColor: colors.surface,
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceRaised,
    color: colors.text,
    fontSize: 17,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
