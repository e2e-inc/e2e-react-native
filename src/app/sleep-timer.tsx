import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';

import { useToast } from '@/components/toast';
import { usePlayer, type SleepTimer } from '@/store/player';
import { colors, radius, type } from '@/theme';

const options: { label: string; timer: SleepTimer }[] = [
  { label: 'Off', timer: { kind: 'off' } },
  { label: '5 minutes', timer: { kind: 'minutes', remaining: 300, total: 300 } },
  { label: '15 minutes', timer: { kind: 'minutes', remaining: 900, total: 900 } },
  { label: '30 minutes', timer: { kind: 'minutes', remaining: 1800, total: 1800 } },
  { label: '1 hour', timer: { kind: 'minutes', remaining: 3600, total: 3600 } },
  { label: 'End of episode', timer: { kind: 'end' } },
];

const isSame = (a: SleepTimer, b: SleepTimer) =>
  a.kind === b.kind && (a.kind !== 'minutes' || (b.kind === 'minutes' && a.total === b.total));

export default function SleepTimerSheet() {
  const { sleepTimer, setSleepTimer } = usePlayer();
  const toast = useToast();

  return (
    <View style={styles.sheet}>
      <Text style={type.title} accessibilityRole="header">
        Sleep timer
      </Text>
      <Text style={[type.caption, { marginBottom: 12 }]}>Playback pauses automatically when the timer ends.</Text>
      {options.map((option) => {
        const selected = isSame(option.timer, sleepTimer);
        return (
          <Pressable
            key={option.label}
            onPress={() => {
              setSleepTimer(option.timer);
              router.back();
              toast.show(option.timer.kind === 'off' ? 'Sleep timer off' : `Sleep timer: ${option.label.toLowerCase()}`);
            }}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={[type.headline, selected && { color: colors.primaryText }]}>{option.label}</Text>
            {selected && <Check size={20} color={colors.primary} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    padding: 24,
    gap: 4,
    backgroundColor: colors.surface,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 50,
    borderRadius: radius.md,
  },
  optionSelected: {
    backgroundColor: colors.primarySoft,
  },
});
