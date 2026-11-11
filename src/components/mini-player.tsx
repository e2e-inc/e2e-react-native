import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useSegments } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pause, Play, RotateCw } from 'lucide-react-native';

import { Artwork, IconButton, ProgressBar } from '@/components/ui';
import { episodeById, showById } from '@/data/podcasts';
import { useLibrary } from '@/store/library';
import { useEpisodeProgress, usePlayer } from '@/store/player';
import { ANDROID_TAB_BAR_HEIGHT, colors, MINI_PLAYER_HEIGHT, radius } from '@/theme';

const HIDDEN_ON = ['player', 'queue'];

/** Mini player for the iOS tab bar's bottom accessory, drawn on the system's Liquid Glass. */
export function MiniPlayerAccessory() {
  const { currentId } = usePlayer();
  const placement = NativeTabs.BottomAccessory.usePlacement();
  if (!currentId) return null;
  return <MiniPlayerContent episodeId={currentId} compact={placement === 'inline'} />;
}

/**
 * Floating mini player for screens without the iOS bottom accessory:
 * every pushed screen, and the tab screens on Android.
 */
export function MiniPlayer() {
  const { currentId } = usePlayer();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const first = segments[0] as string | undefined;
  const inTabs = first === '(tabs)';
  if (!currentId || (first && HIDDEN_ON.includes(first))) return null;
  if (inTabs && Platform.OS === 'ios') return null;

  const bottom = insets.bottom + (inTabs ? ANDROID_TAB_BAR_HEIGHT : 0) + 8;
  return (
    <View style={[styles.floating, { bottom }]} pointerEvents="box-none">
      <View style={styles.card}>
        {Platform.OS === 'ios' && <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />}
        <MiniPlayerContent episodeId={currentId} compact={false} />
        <MiniPlayerProgress episodeId={currentId} />
      </View>
    </View>
  );
}

function MiniPlayerContent({ episodeId, compact }: { episodeId: string; compact: boolean }) {
  const { isPlaying, toggle, skip } = usePlayer();
  const { settings } = useLibrary();
  const episode = episodeById[episodeId];
  const show = showById[episode.showId];

  return (
    <View style={[styles.content, compact && styles.contentCompact]}>
      <Pressable
        onPress={() => router.push('/player')}
        accessibilityRole="button"
        accessibilityLabel={`Now playing: ${episode.title}`}
        testID="mini-player"
        style={styles.open}
      >
        <Artwork uri={show.image} size={compact ? 28 : 40} rounded={compact ? 6 : radius.sm} />
        <View style={styles.text}>
          <Text style={styles.title} numberOfLines={1}>
            {episode.title}
          </Text>
          {!compact && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {show.title}
            </Text>
          )}
        </View>
      </Pressable>
      <IconButton
        icon={isPlaying ? Pause : Play}
        label={isPlaying ? 'Pause' : 'Play'}
        onPress={toggle}
        size={compact ? 18 : 22}
        testID="mini-player-toggle"
      />
      {!compact && (
        <IconButton
          icon={RotateCw}
          label={`Skip forward ${settings.skipForward} seconds`}
          onPress={() => skip(settings.skipForward)}
          size={20}
        />
      )}
    </View>
  );
}

function MiniPlayerProgress({ episodeId }: { episodeId: string }) {
  const { fraction } = useEpisodeProgress(episodeId);
  return <ProgressBar fraction={fraction} height={2} style={styles.progress} />;
}

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    left: 10,
    right: 10,
  },
  card: {
    height: MINI_PLAYER_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'ios' ? 'rgba(28, 28, 36, 0.85)' : colors.surfaceHighlight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 6,
    gap: 6,
  },
  contentCompact: {
    paddingLeft: 8,
    paddingRight: 2,
  },
  open: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  progress: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
    backgroundColor: 'transparent',
  },
});
