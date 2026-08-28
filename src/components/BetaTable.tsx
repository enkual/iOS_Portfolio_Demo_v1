import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, dividers } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { betaContribColor } from '../theme/colorFor';
import { SectionHeader } from './SectionHeader';
import { BetaRow } from '../state/derive';

export function BetaTable({ rows, weightedBeta }: { rows: BetaRow[]; weightedBeta: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.headWrap}>
        <SectionHeader title="Beta by holding" subtitle={`Contribution = weight × beta, and the column sums to the portfolio's weighted beta of ${weightedBeta}.`} />
      </View>
      <View style={styles.colHeadRow}>
        <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true }), styles.tickerCol]}>Ticker</Text>
        <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true }), styles.fixedCol, { width: 62 }]}>
          Weight
        </Text>
        <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true }), styles.fixedCol, { width: 62 }]}>
          β
        </Text>
        <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true }), styles.fixedCol, { width: 74 }]}>
          Contrib.
        </Text>
      </View>
      {rows.map((r) => (
        <View key={r.sym} style={styles.row}>
          <Text style={[font(700, 12.5, { color: colors.ink }), styles.tickerCol]}>{r.sym}</Text>
          <Text style={[font(500, 11.5, { color: colors.neutral700 }), tabularNums, styles.fixedCol, { width: 62 }]}>{r.weightLabel}</Text>
          <Text style={[font(600, 11.5, { color: colors.ink }), tabularNums, styles.fixedCol, { width: 62 }]}>{r.betaLabel}</Text>
          <Text style={[font(700, 11.5, { color: betaContribColor(r.contribTone) }), tabularNums, styles.fixedCol, { width: 74 }]}>
            {r.contribLabel}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderBottomWidth: 2, borderBottomColor: colors.ink },
  headWrap: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 },
  colHeadRow: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: dividers.d4 },
  tickerCol: { flex: 1 },
  fixedCol: { textAlign: 'right' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: dividers.d18 },
});
