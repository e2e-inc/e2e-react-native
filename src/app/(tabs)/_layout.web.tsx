import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import { CircleUserRound, House, LibraryBig, Search, type LucideIcon } from 'lucide-react-native';

import { colors, TAB_BAR_HEIGHT } from '@/theme';

/** Web has no system tab bar, so native tabs are replaced by headless tabs with a bottom bar. */
export default function TabLayout() {
  return (
    <Tabs style={styles.tabs}>
      <TabSlot style={styles.slot} />
      <TabList role="tablist" aria-label="Main" style={styles.tabList}>
        <TabTrigger name="index" href="/" asChild>
          <TabButton icon={House} label="Home" />
        </TabTrigger>
        <TabTrigger name="library" href="/library" asChild>
          <TabButton icon={LibraryBig} label="Library" />
        </TabTrigger>
        <TabTrigger name="profile" href="/profile" asChild>
          <TabButton icon={CircleUserRound} label="Profile" />
        </TabTrigger>
        <TabTrigger name="search" href="/search" asChild>
          <TabButton icon={Search} label="Search" />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

function TabButton({
  icon: Icon,
  label,
  isFocused,
  ...props
}: PressableProps & { icon: LucideIcon; label: string; isFocused?: boolean }) {
  const color = isFocused ? colors.primary : colors.textTertiary;
  return (
    <Pressable {...props} role="tab" aria-label={label} aria-selected={isFocused} style={styles.tab}>
      <Icon size={24} color={color} strokeWidth={2} />
      <Text style={[styles.label, { color: isFocused ? colors.text : colors.textTertiary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // The slot grows to its content by default; keep it to the space above the tab bar so screens scroll.
  slot: {
    flex: 1,
    minHeight: 0,
  },
  tabList: {
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
