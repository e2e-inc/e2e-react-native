import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ChevronRight, Headphones, Share2, SlidersHorizontal, type LucideIcon } from 'lucide-react-native';

import { Chip, SectionHeader, useBottomInset, useTopInset } from '@/components/ui';
import { categories, currentUser } from '@/data/podcasts';
import { useLibrary } from '@/store/library';
import { useProgress } from '@/store/player';
import { colors, radius, type } from '@/theme';

const week = [
  { day: 'M', minutes: 42 },
  { day: 'T', minutes: 65 },
  { day: 'W', minutes: 28 },
  { day: 'T', minutes: 80 },
  { day: 'F', minutes: 54 },
  { day: 'S', minutes: 96 },
  { day: 'S', minutes: 38 },
];

export default function ProfileScreen() {
  const top = useTopInset();
  const bottom = useBottomInset();
  const { following, interests, toggleInterest } = useLibrary();
  const { positions, completed } = useProgress();
  const listenedMinutes = Math.round(Object.values(positions).reduce((sum, seconds) => sum + seconds, 0) / 60);
  const hours = (128 + listenedMinutes / 60).toFixed(1);
  const maxMinutes = Math.max(...week.map((d) => d.minutes));

  const shareProfile = () =>
    Share.share({
      message: `Follow what I'm listening to on Podcasts: https://podcasts.example.com/${currentUser.handle.slice(1)}`,
    });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profile}>
        <Image source={currentUser.avatar} style={styles.avatar} />
        <Text style={type.title}>{currentUser.name}</Text>
        <Text style={type.caption}>{currentUser.handle}</Text>
      </View>

      <View style={styles.stats}>
        <Stat label="Hours listened" value={hours} />
        <Stat label="Episodes finished" value={String(completed.length + 47)} />
        <Stat label="Following" value={String(following.length)} />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Headphones size={18} color={colors.primary} />
          <Text style={type.headline}>This week</Text>
          <Text style={[type.caption, { marginLeft: 'auto' }]}>
            {Math.round(week.reduce((sum, d) => sum + d.minutes, 0) / 60)} hr total
          </Text>
        </View>
        <View style={styles.chart}>
          {week.map((d, i) => (
            <View key={i} style={styles.barColumn}>
              <View style={[styles.bar, { height: (d.minutes / maxMinutes) * 80 }, i === 5 && styles.barActive]} />
              <Text style={styles.barLabel}>{d.day}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 32 }}>
        <SectionHeader title="Your interests" />
        <Text style={[type.caption, { paddingHorizontal: 20, marginTop: -6, marginBottom: 14 }]}>
          We use these to tailor your recommendations on Home.
        </Text>
        <View style={styles.interests}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              selected={interests.includes(category.id)}
              onPress={() => toggleInterest(category.id)}
            />
          ))}
        </View>
      </View>

      <View style={[styles.card, { padding: 0, marginTop: 32 }]}>
        <Row icon={SlidersHorizontal} label="Playback & notifications" onPress={() => router.push('/settings')} />
        <View style={styles.divider} />
        <Row icon={Share2} label="Share your profile" onPress={shareProfile} />
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat} accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[type.caption, { fontSize: 12 }]}>{label}</Text>
    </View>
  );
}

function Row({ icon: Icon, label, onPress }: { icon: LucideIcon; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon size={18} color={colors.primary} />
      </View>
      <Text style={[type.headline, { flex: 1 }]}>{label}</Text>
      <ChevronRight size={20} color={colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profile: {
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 10,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  stat: {
    flex: 1,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceRaised,
    gap: 4,
  },
  statValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceRaised,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 110,
    marginTop: 16,
  },
  barColumn: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  bar: {
    width: 18,
    borderRadius: 6,
    backgroundColor: colors.surfaceHighlight,
  },
  barActive: {
    backgroundColor: colors.primary,
  },
  barLabel: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: '600',
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 62,
  },
});
