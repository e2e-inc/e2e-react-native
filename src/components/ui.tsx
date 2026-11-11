import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { router, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react-native';

import { usePlayer } from '@/store/player';
import { colors, MINI_PLAYER_HEIGHT, radius, type } from '@/theme';

export function useIsTabRoute() {
  const segments = useSegments();
  return segments[0] === '(tabs)';
}

/**
 * Top padding for a screen's main scroll view. On iOS, native tabs inset a tab's
 * first scroll view below the status bar automatically.
 */
export function useTopInset() {
  const insets = useSafeAreaInsets();
  const inTabs = useIsTabRoute();
  return inTabs && Platform.OS === 'ios' ? 8 : insets.top + 8;
}

/**
 * Bottom padding that keeps content clear of the mini player. On iOS, native tabs
 * inset a tab's first scroll view above the tab bar and its mini player accessory;
 * on Android they keep content above the tab bar, and the mini player floats over it.
 */
export function useBottomInset() {
  const insets = useSafeAreaInsets();
  const inTabs = useIsTabRoute();
  const { currentId } = usePlayer();
  const miniPlayer = currentId ? MINI_PLAYER_HEIGHT + 12 : 0;
  if (inTabs) return Platform.OS === 'ios' ? 24 : miniPlayer + 24;
  return insets.bottom + miniPlayer + 24;
}

export function Artwork({
  uri,
  size,
  rounded = radius.md,
  style,
}: {
  uri: string;
  size: number;
  rounded?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ width: size, height: size, borderRadius: rounded }, styles.artwork, style]}>
      <Image source={uri} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
    </View>
  );
}

export function IconButton({
  icon: Icon,
  label,
  onPress,
  size = 22,
  color = colors.text,
  variant = 'plain',
  active = false,
  disabled = false,
  testID,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  size?: number;
  color?: string;
  variant?: 'plain' | 'filled' | 'primary';
  active?: boolean;
  disabled?: boolean;
  testID?: string;
}) {
  const dimension = size + 18;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      aria-selected={active}
      aria-disabled={disabled}
      disabled={disabled}
      testID={testID}
      hitSlop={6}
      style={({ pressed }) => [
        styles.iconButton,
        { width: dimension, height: dimension, borderRadius: dimension / 2 },
        variant === 'filled' && styles.iconButtonFilled,
        variant === 'primary' && styles.iconButtonPrimary,
        pressed && { opacity: 0.6 },
        disabled && { opacity: 0.35 },
      ]}
    >
      <Icon size={size} color={active ? colors.primary : color} strokeWidth={2} />
    </Pressable>
  );
}

export function Button({
  label,
  onPress,
  icon: Icon,
  variant = 'primary',
  compact = false,
  style,
  testID,
  accessibilityLabel,
}: {
  label: string;
  accessibilityLabel?: string;
  onPress: () => void;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'ghost';
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const textColor = variant === 'primary' ? '#fff' : variant === 'secondary' ? colors.text : colors.primaryText;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        compact && styles.buttonCompact,
        variant === 'primary' && { backgroundColor: pressed ? colors.primaryPressed : colors.primary },
        variant === 'secondary' && { backgroundColor: pressed ? colors.surfaceHighlight : colors.surfaceRaised },
        variant === 'ghost' && { backgroundColor: pressed ? colors.primarySoft : 'transparent' },
        style,
      ]}
    >
      {Icon && <Icon size={compact ? 16 : 18} color={textColor} strokeWidth={2.4} />}
      <Text style={[styles.buttonText, compact && { fontSize: 14 }, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      aria-selected={selected}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={type.section} accessibilityRole="header">
        {title}
      </Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} accessibilityRole="button" accessibilityLabel={`See all ${title}`} hitSlop={8} style={styles.seeAll}>
          <Text style={styles.seeAllText}>See all</Text>
          <ChevronRight size={16} color={colors.primaryText} />
        </Pressable>
      )}
    </View>
  );
}

export function ProgressBar({ fraction, height = 3, style }: { fraction: number; height?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.progressTrack, { height, borderRadius: height }, style]}>
      <View style={[styles.progressFill, { width: `${Math.round(fraction * 100)}%`, borderRadius: height }]} />
    </View>
  );
}

export function TopBar({ title, right, transparent = false }: { title?: string; right?: ReactNode; transparent?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.topBar, { paddingTop: insets.top + 4 }, !transparent && { backgroundColor: colors.background }]}>
      <IconButton icon={ChevronLeft} label="Back" onPress={() => router.back()} variant={transparent ? 'filled' : 'plain'} size={24} />
      <Text style={styles.topBarTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.topBarRight}>{right}</View>
    </View>
  );
}

export function EmptyState({ icon: Icon, title, message }: { icon: LucideIcon; title: string; message: string }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Icon size={28} color={colors.primary} />
      </View>
      <Text style={type.headline}>{title}</Text>
      <Text style={[type.body, { textAlign: 'center' }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  artwork: {
    overflow: 'hidden',
    backgroundColor: colors.surfaceRaised,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonFilled: {
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  iconButtonPrimary: {
    backgroundColor: colors.primary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
  },
  buttonCompact: {
    height: 38,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  chip: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    color: colors.primaryText,
    fontSize: 14,
    fontWeight: '600',
  },
  progressTrack: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 6,
    gap: 4,
  },
  topBarTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  topBarRight: {
    minWidth: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  empty: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 40,
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
});
