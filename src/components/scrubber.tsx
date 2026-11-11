import { useRef, useState } from 'react';
import { StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';

import { colors } from '@/theme';
import { formatClock } from '@/utils/format';

export function Scrubber({
  position,
  duration,
  onSeek,
  step = 15,
}: {
  position: number;
  duration: number;
  onSeek: (seconds: number) => void;
  step?: number;
}) {
  const trackWidth = useRef(1);
  const [dragFraction, setDragFraction] = useState<number | null>(null);

  const fractionAt = (event: GestureResponderEvent) => {
    return Math.max(0, Math.min(1, event.nativeEvent.locationX / trackWidth.current));
  };

  const fraction = dragFraction ?? Math.min(1, position / duration);
  const shown = fraction * duration;

  return (
    <View>
      <View
        style={styles.hitArea}
        onLayout={(event) => {
          trackWidth.current = Math.max(1, event.nativeEvent.layout.width);
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={(event) => setDragFraction(fractionAt(event))}
        onResponderMove={(event) => setDragFraction(fractionAt(event))}
        onResponderRelease={(event) => {
          onSeek(fractionAt(event) * duration);
          setDragFraction(null);
        }}
        onResponderTerminate={() => setDragFraction(null)}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Playback position"
        accessibilityValue={{ text: `${formatClock(shown)} of ${formatClock(duration)}` }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(event) =>
          onSeek(position + (event.nativeEvent.actionName === 'increment' ? step : -step))
        }
        testID="scrubber"
      >
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${fraction * 100}%` }]} />
        </View>
        <View
          pointerEvents="none"
          style={[styles.thumb, { left: `${fraction * 100}%` }, dragFraction !== null && styles.thumbActive]}
        />
      </View>
      <View style={styles.labels}>
        <Text style={styles.time} testID="elapsed-time">
          {formatClock(shown)}
        </Text>
        <Text style={styles.time} testID="remaining-time">
          -{formatClock(duration - shown)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    height: 28,
    justifyContent: 'center',
  },
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  thumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    marginLeft: -7,
    borderRadius: 7,
    backgroundColor: '#fff',
  },
  thumbActive: {
    width: 22,
    height: 22,
    marginLeft: -11,
    borderRadius: 11,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  time: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
