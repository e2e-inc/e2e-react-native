import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SearchIcon, SearchX, X } from 'lucide-react-native';

import { EpisodeRow, ShowCard } from '@/components/podcast';
import { EmptyState, SectionHeader, useBottomInset, useTopInset } from '@/components/ui';
import { categories, episodes, showById, shows } from '@/data/podcasts';
import { colors, radius, type } from '@/theme';

export default function SearchScreen() {
  const top = useTopInset();
  const bottom = useBottomInset();
  const [query, setQuery] = useState('');
  const term = query.trim().toLowerCase();

  const showResults = term
    ? shows.filter((show) => `${show.title} ${show.author}`.toLowerCase().includes(term))
    : [];
  const episodeResults = term
    ? episodes
        .filter((episode) => `${episode.title} ${showById[episode.showId].title}`.toLowerCase().includes(term))
        .slice(0, 12)
    : [];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
      contentInsetAdjustmentBehavior="automatic"
      stickyHeaderIndices={[1]}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      onTouchStart={Keyboard.dismiss}
    >
      <Text style={[type.hero, styles.heading]} accessibilityRole="header">
        Search
      </Text>
      <View style={styles.searchBar}>
        <View style={styles.searchBox} onTouchStart={(event) => event.stopPropagation()}>
          <SearchIcon size={20} color={colors.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Shows, episodes, people"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Search podcasts"
            testID="search-input"
            selectionColor={colors.primary}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} accessibilityRole="button" accessibilityLabel="Clear search" hitSlop={10}>
              <X size={18} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      <View>
        {!term && (
          <>
            <SectionHeader title="Browse all" />
            <View style={styles.grid}>
              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => router.push(`/category/${category.id}`)}
                  accessibilityRole="button"
                  accessibilityLabel={category.name}
                  style={({ pressed }) => [styles.tile, pressed && { opacity: 0.8 }]}
                >
                  <Image source={category.image} style={StyleSheet.absoluteFill} contentFit="cover" />
                  <LinearGradient
                    colors={[`${category.color}CC`, 'rgba(0,0,0,0.75)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={styles.tileText}>{category.name}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {term.length > 0 && showResults.length === 0 && episodeResults.length === 0 && (
          <EmptyState icon={SearchX} title="No results" message={`Nothing matches “${query.trim()}”. Try another show or topic.`} />
        )}

        {showResults.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <SectionHeader title="Shows" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
            >
              {showResults.map((show) => (
                <ShowCard key={show.id} show={show} size={132} />
              ))}
            </ScrollView>
          </View>
        )}

        {episodeResults.length > 0 && (
          <View>
            <SectionHeader title="Episodes" />
            {episodeResults.map((episode) => (
              <EpisodeRow key={episode.id} episodeId={episode.id} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heading: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  searchBar: {
    backgroundColor: colors.background,
    paddingTop: 8,
    paddingBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  tile: {
    width: '47.8%',
    height: 96,
    borderRadius: radius.lg,
    overflow: 'hidden',
    padding: 14,
    justifyContent: 'flex-end',
    backgroundColor: colors.surfaceRaised,
  },
  tileText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
});
