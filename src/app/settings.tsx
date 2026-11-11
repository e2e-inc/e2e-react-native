import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip, TopBar } from '@/components/ui';
import { useLibrary, type Settings } from '@/store/library';
import { usePlayer } from '@/store/player';
import { colors, radius, type } from '@/theme';
import { formatSpeed } from '@/utils/format';

const speeds = [0.75, 1, 1.25, 1.5, 2];
const backIntervals = [10, 15, 30];
const forwardIntervals = [15, 30, 45, 60];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { settings, updateSettings } = useLibrary();
  const { setSpeed } = usePlayer();

  const toggle = (key: keyof Settings) => (value: boolean) => updateSettings({ [key]: value });

  return (
    <View style={styles.screen}>
      <TopBar title="Settings" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 120, gap: 28, paddingTop: 12 }}>
        <Section title="PLAYBACK">
          <Picker label="Default speed">
            {speeds.map((speed) => (
              <Chip
                key={speed}
                label={formatSpeed(speed)}
                selected={settings.defaultSpeed === speed}
                onPress={() => {
                  updateSettings({ defaultSpeed: speed });
                  setSpeed(speed);
                }}
              />
            ))}
          </Picker>
          <Picker label="Skip back">
            {backIntervals.map((seconds) => (
              <Chip
                key={seconds}
                label={`${seconds}s`}
                selected={settings.skipBack === seconds}
                onPress={() => updateSettings({ skipBack: seconds })}
              />
            ))}
          </Picker>
          <Picker label="Skip forward">
            {forwardIntervals.map((seconds) => (
              <Chip
                key={seconds}
                label={`${seconds}s`}
                selected={settings.skipForward === seconds}
                onPress={() => updateSettings({ skipForward: seconds })}
              />
            ))}
          </Picker>
          <Toggle
            label="Continuous playback"
            hint="Play the next episode in Up Next automatically"
            value={settings.continuousPlayback}
            onChange={toggle('continuousPlayback')}
          />
        </Section>

        <Section title="DOWNLOADS">
          <Toggle
            label="Auto-download new episodes"
            hint="From shows you follow"
            value={settings.autoDownload}
            onChange={toggle('autoDownload')}
          />
          <Toggle label="Download on Wi-Fi only" value={settings.wifiOnly} onChange={toggle('wifiOnly')} />
        </Section>

        <Section title="NOTIFICATIONS & SHARING">
          <Toggle
            label="New episode alerts"
            hint="Get notified when followed shows publish"
            value={settings.newEpisodeAlerts}
            onChange={toggle('newEpisodeAlerts')}
          />
          <Toggle
            label="Share with timestamp"
            hint="Include your current position when sharing from the player"
            value={settings.shareWithTimestamp}
            onChange={toggle('shareWithTimestamp')}
          />
        </Section>

        <Text style={[type.caption, { textAlign: 'center', color: colors.textTertiary }]}>Podcasts demo · v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={[type.micro, { paddingHorizontal: 20 }]}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Picker({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.item} accessibilityLabel={label}>
      <Text style={type.headline}>{label}</Text>
      <View style={styles.pickerRow}>{children}</View>
    </View>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={[styles.item, styles.toggle]}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={type.headline}>{label}</Text>
        {hint && <Text style={type.caption}>{hint}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.primary, false: colors.surfaceHighlight }}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    marginHorizontal: 20,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceRaised,
    overflow: 'hidden',
  },
  item: {
    padding: 16,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
