import { Pressable, View } from 'react-native';
import { Star } from 'lucide-react-native';

import { colors } from '@/theme';

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }} accessibilityLabel={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={size}
          color={colors.star}
          fill={rating >= value - 0.25 ? colors.star : 'transparent'}
          strokeWidth={2}
        />
      ))}
    </View>
  );
}

export function StarInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => onChange(star)}
          accessibilityRole="button"
          accessibilityLabel={`${star} star${star === 1 ? '' : 's'}`}
          aria-selected={value === star}
          hitSlop={4}
        >
          <Star size={36} color={colors.star} fill={value >= star ? colors.star : 'transparent'} strokeWidth={1.8} />
        </Pressable>
      ))}
    </View>
  );
}
