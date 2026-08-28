import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, dividers } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { DivRow } from '../state/derive';

/** One row on the Dividends "Top yields" list: ticker/weight/yield/income + a weight-scaled bar. */
export function TopYieldRow({ row }: { row: DivRow }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.cols}>
        <Text style={[font(700, 12.5, { color: row.pays ? colors.ink : colors.nonPayerText }), styles.symCol]}>{row.sym}</Text>
        <Text style={[font(500, 11.5, { color: colors.neutral700 }), tabularNums, styles.rightFixed, { width: 58 }]}>{row.weightLabel}</Text>
        <Text style={[font(700, 11.5, { color: colors.ink }), tabularNums, styles.rightFixed, { width: 54 }]}>{row.yieldLabel}</Text>
        <Text style={[font(600, 11.5, { color: colors.neutral700 }), tabularNums, styles.rightFixed, { width: 76 }]}>{row.incomeLabel}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${row.barPct}%`, backgroundColor: row.pays ? colors.posterGreen : colors.nonPayerBar }]} />
      </View>
    </View>
  );
}

/** One row on the All Positions table: ticker/weight/DPS/yield/income, non-payers in red with em-dashes. */
export function AllPositionsRow({ row }: { row: DivRow }) {
  return (
    <View style={styles.tableRow}>
      <Text style={[font(700, 12.5, { color: row.pays ? colors.ink : colors.nonPayerText }), styles.symCol]}>{row.sym}</Text>
      <Text style={[font(500, 11, { color: colors.neutral700 }), tabularNums, styles.rightFixed, { width: 50 }]}>{row.weightLabel}</Text>
      <Text style={[font(500, 11, { color: colors.neutral700 }), tabularNums, styles.rightFixed, { width: 50 }]}>{row.dps}</Text>
      <Text style={[font(600, 11, { color: colors.ink }), tabularNums, styles.rightFixed, { width: 52 }]}>{row.yieldLabel}</Text>
      <Text style={[font(700, 11, { color: colors.ink }), tabularNums, styles.rightFixed, { width: 66 }]}>{row.incomeLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 9, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: dividers.d18 },
  cols: { flexDirection: 'row', alignItems: 'center' },
  symCol: { flex: 1, minWidth: 0 },
  rightFixed: { textAlign: 'right' },
  barTrack: { marginTop: 7, height: 4, backgroundColor: colors.surface },
  barFill: { height: 4 },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: dividers.d18,
  },
});
