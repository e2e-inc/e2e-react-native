import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { FolderSearch } from 'lucide-react-native';

import { EpisodeRow, ShowCard } from '@/components/podcast';
import { EmptyState, SectionHeader, TopBar, useBottomInset } from '@/components/ui';
import { categoryById, latestEpisode, shows } from '@/data/podcasts';
import { colors, type } from '@/theme';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = categoryById[id];
  const bottom = useBottomInset();

  if (!category) {
    return (
      <View style={styles.screen}>
        <TopBar />
        <EmptyState icon={FolderSearch} title="Category not found" message="Try browsing from Search instead." />
      </View>
    );
  }

  const inCategory = shows.filter((show) => show.categoryId === category.id);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottom }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={category.image} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient colors={[`${category.color}AA`, 'rgba(0,0,0,0.6)', '#000']} style={StyleSheet.absoluteFill} />
          <Text style={[type.hero, { paddingHorizontal: 20 }]} accessibilityRole="header">
            {category.name}
          </Text>
          <Text style={[type.caption, { paddingHorizontal: 20, marginTop: 4 }]}>
            {inCategory.length} show{inCategory.length === 1 ? '' : 's'}
          </Text>
        </View>

        <SectionHeader title="Top shows" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
          {inCategory.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </ScrollView>

        <View style={{ marginTop: 28 }}>
          <SectionHeader title="Latest episodes" />
          {inCategory.map((show) => (
            <EpisodeRow key={show.id} episodeId={latestEpisode(show.id).id} />
          ))}
        </View>
      </ScrollView>
      <View style={styles.topBar}>
        <TopBar transparent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    height: 260,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    marginBottom: 12,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
