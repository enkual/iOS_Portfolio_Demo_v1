import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { colors, dividers } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { toneColor } from '../theme/colorFor';
import { ClosedRow } from '../state/derive';

const THRESHOLD = 70;
const CLAMP = 140;

/** Closed-position row: swipe left past 70px to delete, right past 70px to open the adjust
 * sheet -- mirrors the source's onPointerDown/Move/Up swipe logic with the same thresholds. */
export function SwipeableRow({ row, onDelete, onAdjust }: { row: ClosedRow; onDelete: () => void; onAdjust: () => void }) {
  const dx = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      dx.value = Math.max(-CLAMP, Math.min(CLAMP, e.translationX));
    })
    .onEnd(() => {
      if (dx.value <= -THRESHOLD) {
        dx.value = withTiming(-400, { duration: 180 });
        runOnJS(onDelete)();
      } else if (dx.value >= THRESHOLD) {
        dx.value = withSpring(0, { damping: 18, stiffness: 220 });
        runOnJS(onAdjust)();
      } else {
        dx.value = withSpring(0, { damping: 18, stiffness: 220 });
      }
    });

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: dx.value }] }));

  return (
    <View style={styles.wrap}>
      <View style={styles.panels} pointerEvents="none">
        <View style={[styles.panel, styles.adjustPanel]}>
          <Text style={font(700, 10, { color: colors.bg, letterSpacingEm: 0.12, uppercase: true })}>Adjust</Text>
        </View>
        <View style={[styles.panel, styles.deletePanel]}>
          <Text style={font(700, 10, { color: colors.white, letterSpacingEm: 0.12, uppercase: true })}>Delete</Text>
        </View>
      </View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.row, style]}>
          <View style={styles.left}>
            <View style={styles.symRow}>
              <Text style={font(700, 14, { color: colors.neutral700, letterSpacingEm: 0.01 })}>{row.sym}</Text>
              <Text style={font(600, 8.5, { color: colors.neutral500, letterSpacingEm: 0.12, uppercase: true })}>
                Closed {row.exitLabel}
              </Text>
            </View>
            <Text style={[font(500, 10, { color: colors.neutral700 }), tabularNums, styles.lot]}>{row.lotLabel}</Text>
          </View>
          <View style={styles.right}>
            <Text style={[font(700, 13, { color: toneColor(row.tone) }), tabularNums]}>{row.plLabel}</Text>
            <Text style={[font(600, 10.5, { color: colors.neutral600 }), tabularNums, styles.plPct]}>{row.plPctLabel}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', overflow: 'hidden', borderBottomWidth: 1, borderBottomColor: dividers.d18 },
  panels: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-between' },
  panel: { height: '100%', justifyContent: 'center', paddingHorizontal: 18 },
  adjustPanel: { backgroundColor: colors.ink },
  deletePanel: { backgroundColor: colors.accent },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 20,
    backgroundColor: colors.bg,
  },
  left: { flexShrink: 1 },
  symRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  lot: { marginTop: 3 },
  right: { alignItems: 'flex-end' },
  plPct: { marginTop: 3 },
});
