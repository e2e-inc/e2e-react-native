import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronDown,
  Heart,
  ListMusic,
  Moon,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Share2,
  type LucideIcon,
} from 'lucide-react-native';

import { Scrubber } from '@/components/scrubber';
import { useToast } from '@/components/toast';
import { Artwork, IconButton } from '@/components/ui';
import { episodeById, showById } from '@/data/podcasts';
import { useLibrary } from '@/store/library';
import { useEpisodeProgress, usePlayer } from '@/store/player';
import { colors, radius, type } from '@/theme';
import { formatClock, formatSpeed } from '@/utils/format';

const SPEEDS = [1, 1.25, 1.5, 1.75, 2, 0.75];

export default function PlayerScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const toast = useToast();
  const player = usePlayer();
  const { isLiked, toggleLike, settings } = useLibrary();
  const episodeId = player.currentId;
  const progress = useEpisodeProgress(episodeId ?? '');

  if (!episodeId) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={type.headline}>Nothing is playing</Text>
      </View>
    );
  }

  const episode = episodeById[episodeId];
  const show = showById[episode.showId];
  const liked = isLiked(episodeId);
  const artSize = Math.min(width - 64, 340);
  const chapter = [...episode.chapters].reverse().find((c) => progress.position >= c.start) ?? episode.chapters[0];
  const nextSpeed = SPEEDS[(SPEEDS.indexOf(player.speed) + 1) % SPEEDS.length];
  const sleepDescription =
    player.sleepTimer.kind === 'minutes'
      ? `${formatClock(player.sleepTimer.remaining)} left`
      : player.sleepTimer.kind === 'end'
        ? 'end of episode'
        : 'off';

  return (
    <View style={styles.screen} testID="player-screen">
      <Image source={show.image} style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={60} />
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.85)', '#000']}
        locations={[0, 0.45, 0.8]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <IconButton icon={ChevronDown} label="Close player" onPress={() => router.back()} size={28} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={type.micro}>NOW PLAYING</Text>
          <Text style={styles.headerShow} numberOfLines={1}>
            {show.title}
          </Text>
        </View>
        <IconButton
          icon={Share2}
          label="Share episode"
          onPress={() =>
            router.push({ pathname: '/share', params: { episodeId, at: String(Math.floor(progress.position)) } })
          }
        />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
        testID="player-scroll"
      >
        <View style={styles.artWrap}>
          <Artwork uri={show.image} size={artSize} rounded={radius.xl} style={styles.art} />
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={type.title} numberOfLines={2} testID="player-title">
                {episode.title}
              </Text>
              <Pressable
                onPress={() => {
                  router.back();
                  router.push(`/show/${show.id}`);
                }}
                accessibilityRole="link"
                accessibilityLabel={`Go to ${show.title}`}
              >
                <Text style={styles.showLink}>{show.title}</Text>
              </Pressable>
            </View>
            <IconButton
              icon={Heart}
              label={liked ? 'Remove from Saved' : 'Save episode'}
              active={liked}
              onPress={() => {
                toggleLike(episodeId);
                toast.show(liked ? 'Removed from Saved' : 'Saved to your library');
              }}
              size={26}
            />
          </View>

          <Scrubber
            position={progress.position}
            duration={episode.duration}
            onSeek={player.seek}
            step={settings.skipForward}
          />
          <Text style={styles.chapter} numberOfLines={1}>
            Chapter · {chapter.title}
          </Text>

          <View style={styles.controls}>
            <Pressable
              onPress={() => player.setSpeed(nextSpeed)}
              accessibilityRole="button"
              accessibilityLabel={`Playback speed ${formatSpeed(player.speed)}`}
              style={styles.speed}
              testID="speed-button"
            >
              <Text style={styles.speedText}>{formatSpeed(player.speed)}</Text>
            </Pressable>
            <SkipButton
              icon={RotateCcw}
              seconds={settings.skipBack}
              label={`Skip back ${settings.skipBack} seconds`}
              onPress={() => player.skip(-settings.skipBack)}
            />
            <Pressable
              onPress={player.toggle}
              accessibilityRole="button"
              accessibilityLabel={player.isPlaying ? 'Pause' : 'Play'}
              style={({ pressed }) => [styles.playButton, pressed && { transform: [{ scale: 0.96 }] }]}
              testID="player-toggle"
            >
              {player.isPlaying ? (
                <Pause size={34} color="#fff" fill="#fff" />
              ) : (
                <Play size={34} color="#fff" fill="#fff" style={{ marginLeft: 4 }} />
              )}
            </Pressable>
            <SkipButton
              icon={RotateCw}
              seconds={settings.skipForward}
              label={`Skip forward ${settings.skipForward} seconds`}
              onPress={() => player.skip(settings.skipForward)}
            />
            <Pressable
              onPress={() => router.push('/sleep-timer')}
              accessibilityRole="button"
              accessibilityLabel={`Sleep timer: ${sleepDescription}`}
              style={styles.speed}
            >
              <Moon
                size={20}
                color={player.sleepTimer.kind === 'off' ? colors.text : colors.primary}
                fill={player.sleepTimer.kind === 'off' ? 'transparent' : colors.primary}
              />
            </Pressable>
          </View>
          {player.sleepTimer.kind !== 'off' && (
            <Text style={styles.sleepNote}>Sleep timer · {sleepDescription}</Text>
          )}

          <Pressable
            onPress={() => router.push('/queue')}
            accessibilityRole="button"
            accessibilityLabel="Open Up Next"
            style={styles.upNext}
          >
            <ListMusic size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={type.micro}>UP NEXT</Text>
              <Text style={type.headline} numberOfLines={1}>
                {player.queue[0] ? episodeById[player.queue[0]].title : 'Your queue is empty'}
              </Text>
            </View>
            <Text style={type.caption}>{player.queue.length}</Text>
          </Pressable>

          <View style={{ gap: 4, marginTop: 8 }}>
            <Text style={[type.micro, { marginBottom: 6 }]}>CHAPTERS</Text>
            {episode.chapters.map((item) => {
              const active = item === chapter;
              return (
                <Pressable
                  key={item.title}
                  onPress={() => player.seek(item.start)}
                  accessibilityRole="button"
                  accessibilityLabel={`Jump to ${item.title}`}
                  accessibilityState={{ selected: active }}
                  style={[styles.chapterRow, active && styles.chapterRowActive]}
                >
                  <Text style={[type.headline, { flex: 1 }, active && { color: colors.primaryText }]}>{item.title}</Text>
                  <Text style={styles.chapterTime}>{formatClock(item.start)}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function SkipButton({
  icon: Icon,
  seconds,
  label,
  onPress,
}: {
  icon: LucideIcon;
  seconds: number;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => [styles.skip, pressed && { opacity: 0.6 }]}
    >
      <Icon size={40} color={colors.text} strokeWidth={1.6} />
      <Text style={styles.skipText}>{seconds}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  headerShow: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  artWrap: {
    alignItems: 'center',
    marginTop: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 12 },
  },
  art: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  body: {
    paddingHorizontal: 28,
    marginTop: 28,
    gap: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  showLink: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
  chapter: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: -6,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  speed: {
    minWidth: 52,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  speedText: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 14,
  },
  skip: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    position: 'absolute',
    color: colors.text,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  sleepNote: {
    color: colors.primaryText,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  upNext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginTop: 8,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radius.md,
  },
  chapterRowActive: {
    backgroundColor: colors.primarySoft,
  },
  chapterTime: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
