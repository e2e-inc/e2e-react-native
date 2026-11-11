import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useIsTabRoute } from '@/components/ui';

/** Fades tab content out under the status bar, since tab screens have no header. */
export function StatusBarScrim() {
  const insets = useSafeAreaInsets();
  const inTabs = useIsTabRoute();
  if (!inTabs) return null;
  return (
    <LinearGradient
      pointerEvents="none"
      colors={['rgba(0,0,0,0.95)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}
      locations={[0, 0.6, 1]}
      style={[styles.scrim, { height: insets.top + 16 }]}
    />
  );
}

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
