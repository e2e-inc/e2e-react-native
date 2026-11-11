import { NativeTabs } from 'expo-router/native-tabs';

import { MiniPlayerAccessory } from '@/components/mini-player';
import { usePlayer } from '@/store/player';
import { colors } from '@/theme';

export default function TabLayout() {
  const { currentId } = usePlayer();

  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      tintColor={colors.primary}
      iconColor={{ default: colors.textTertiary, selected: colors.primary }}
      labelStyle={{ default: { color: colors.textTertiary }, selected: { color: colors.text } }}
      backgroundColor={colors.background}
      indicatorColor={colors.primarySoft}
      rippleColor={colors.primarySoft}
      labelVisibilityMode="labeled"
    >
      {/* iOS only: the mini player sits on the Liquid Glass tab bar. Android shows a floating one instead. */}
      {currentId && (
        <NativeTabs.BottomAccessory>
          <MiniPlayerAccessory />
        </NativeTabs.BottomAccessory>
      )}
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="library">
        <NativeTabs.Trigger.Label>Library</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.stack.fill" md="video_library" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          md="account_circle"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
