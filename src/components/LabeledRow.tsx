import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/tokens';
import { font } from '../theme/typography';

/** "Benchmark  [S&P 500] [Russell 2000] ..." style labeled control row, used for the
 * benchmark/period/window/horizon selectors. */
export function LabeledRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.14, uppercase: true }), styles.label]}>{label}</Text>
      <View style={styles.controlWrap}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 9, flexWrap: 'wrap' },
  label: { width: 62 },
  controlWrap: { flexDirection: 'row', flexWrap: 'wrap', flexShrink: 1 },
});
