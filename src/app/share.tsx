import { useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Switch, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Link2, Mail, MessageCircle, Send, Share as ShareIcon, type LucideIcon } from 'lucide-react-native';

import { useToast } from '@/components/toast';
import { Artwork } from '@/components/ui';
import { episodeById, friends, showById } from '@/data/podcasts';
import { useLibrary } from '@/store/library';
import { colors, radius, type } from '@/theme';
import { formatClock } from '@/utils/format';

export default function ShareSheet() {
  const { episodeId, showId, at } = useLocalSearchParams<{ episodeId?: string; showId?: string; at?: string }>();
  const toast = useToast();
  const { settings } = useLibrary();
  const episode = episodeId ? episodeById[episodeId] : undefined;
  const show = episode ? showById[episode.showId] : showId ? showById[showId] : undefined;
  const timestamp = Number(at ?? 0);
  const canTimestamp = Boolean(episode) && timestamp > 0;
  const [withTimestamp, setWithTimestamp] = useState(canTimestamp && settings.shareWithTimestamp);
  const [sentTo, setSentTo] = useState<string[]>([]);

  if (!show) return null;

  const path = episode ? `episode/${episode.id}` : `show/${show.id}`;
  const url = `https://podcasts.example.com/${path}${withTimestamp ? `?t=${timestamp}` : ''}`;
  const title = episode ? episode.title : show.title;
  const message = episode
    ? `Listen to “${episode.title}” from ${show.title}${withTimestamp ? ` (starting at ${formatClock(timestamp)})` : ''}: ${url}`
    : `Check out ${show.title} by ${show.author}: ${url}`;

  const finish = (label: string) => {
    router.back();
    toast.show(label);
  };

  return (
    <ScrollView style={styles.sheet} contentContainerStyle={{ padding: 24, gap: 20 }}>
      <Text style={type.title} accessibilityRole="header" testID="share-title">
        Share {episode ? 'episode' : 'show'}
      </Text>

      <View style={styles.preview} testID="share-preview">
        <Artwork uri={show.image} size={64} rounded={radius.md} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={type.headline} numberOfLines={2}>
            {title}
          </Text>
          <Text style={type.caption} numberOfLines={1}>
            {episode ? show.title : show.author}
          </Text>
          <Text style={styles.url} numberOfLines={1}>
            {url.replace('https://', '')}
          </Text>
        </View>
      </View>

      {canTimestamp && (
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={type.headline}>Start at {formatClock(timestamp)}</Text>
            <Text style={type.caption}>Friends jump straight to this moment</Text>
          </View>
          <Switch
            value={withTimestamp}
            onValueChange={setWithTimestamp}
            trackColor={{ true: colors.primary, false: colors.surfaceHighlight }}
            accessibilityLabel={`Start at ${formatClock(timestamp)}`}
          />
        </View>
      )}

      <View style={{ gap: 12 }}>
        <Text style={type.micro}>SEND TO FRIENDS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
          {friends.map((friend) => {
            const sent = sentTo.includes(friend.id);
            return (
              <Pressable
                key={friend.id}
                onPress={() => {
                  setSentTo((list) => (list.includes(friend.id) ? list : [...list, friend.id]));
                  toast.show(`Sent to ${friend.name}`);
                }}
                accessibilityRole="button"
                accessibilityLabel={sent ? `Sent to ${friend.name}` : `Send to ${friend.name}`}
                style={styles.friend}
              >
                <View>
                  <Image source={friend.avatar} style={[styles.avatar, sent && styles.avatarSent]} />
                  {sent && (
                    <View style={styles.sentBadge}>
                      <Send size={10} color="#fff" />
                    </View>
                  )}
                </View>
                <Text style={type.caption}>{friend.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.targets}>
        <Target icon={MessageCircle} label="Messages" onPress={() => finish('Shared to Messages')} />
        <Target icon={Mail} label="Mail" onPress={() => finish('Shared via Mail')} />
        <Target icon={Link2} label="Copy link" onPress={() => finish('Link copied')} />
        <Target
          icon={ShareIcon}
          label="More"
          onPress={async () => {
            const result = await Share.share({ message, url });
            if (result.action === Share.sharedAction) finish('Shared');
          }}
        />
      </View>
    </ScrollView>
  );
}

function Target({ icon: Icon, label, onPress }: { icon: LucideIcon; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={styles.target}>
      <View style={styles.targetIcon}>
        <Icon size={22} color={colors.text} />
      </View>
      <Text style={type.caption}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceRaised,
  },
  url: {
    color: colors.primaryText,
    fontSize: 12,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  friend: {
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarSent: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  sentBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  targets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  target: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  targetIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
