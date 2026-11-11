import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { StarInput } from '@/components/stars';
import { useToast } from '@/components/toast';
import { Button } from '@/components/ui';
import { showById } from '@/data/podcasts';
import { useLibrary } from '@/store/library';
import { colors, radius, type } from '@/theme';

export default function ReviewSheet() {
  const { showId } = useLocalSearchParams<{ showId: string }>();
  const { userReviews, submitReview } = useLibrary();
  const toast = useToast();
  const existing = userReviews[showId];
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const show = showById[showId];
  if (!show) return null;

  const canSubmit = rating > 0 && title.trim().length > 0;

  return (
    <ScrollView style={styles.sheet} contentContainerStyle={{ padding: 24, gap: 16 }} keyboardShouldPersistTaps="handled">
      <Text style={type.title} accessibilityRole="header">
        Rate {show.title}
      </Text>
      <StarInput value={rating} onChange={setRating} />
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
        selectionColor={colors.primary}
        accessibilityLabel="Review title"
      />
      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="What did you think? (optional)"
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, styles.multiline]}
        multiline
        selectionColor={colors.primary}
        accessibilityLabel="Review"
        testID="review-body"
      />
      <Button
        label="Submit review"
        style={!canSubmit && { opacity: 0.4 }}
        onPress={() => {
          if (!canSubmit) return;
          submitReview(show.id, { rating, title: title.trim(), body: body.trim() });
          router.back();
          toast.show('Thanks for your review!');
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  input: {
    minHeight: 50,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surfaceRaised,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
});
