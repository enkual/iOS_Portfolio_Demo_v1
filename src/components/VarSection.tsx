import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, dividers } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { varTileColor } from '../theme/colorFor';
import { LabeledRow } from './LabeledRow';
import { SegmentedRow } from './Chip';
import { Opt, VarTile } from '../state/derive';

export function VarSection({ horizonOpts, onSelectHorizon, tiles }: { horizonOpts: Opt[]; onSelectHorizon: (k: string) => void; tiles: VarTile[] }) {
  return (
    <View style={styles.card}>
      <Text style={font(800, 13, { color: colors.ink, letterSpacingEm: 0.02, uppercase: true })}>Value at risk</Text>
      <View style={styles.horizonRow}>
        <LabeledRow label="Horizon">
          <SegmentedRow options={horizonOpts} onSelect={onSelectHorizon} size="sm" />
        </LabeledRow>
      </View>
      <View style={styles.grid}>
        {tiles.map((t) => (
          <View key={t.label} style={styles.tile}>
            <Text style={font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.1, uppercase: true })}>{t.label}</Text>
            <Text style={[font(700, 16, { color: varTileColor(t.tone) }), tabularNums, styles.tileValue]}>{t.value}</Text>
          </View>
        ))}
      </View>
      <Text style={[font(500, 10, { color: colors.neutral600, lineHeight: 1.5 }), styles.footer]}>
        95% confidence, parametric and historical. Diversification benefit is the VaR saved versus holding the same names with no
        correlation structure.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 18, paddingHorizontal: 20, paddingBottom: 18, borderBottomWidth: 2, borderBottomColor: colors.ink },
  horizonRow: { marginTop: 11 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, borderTopWidth: 1, borderTopColor: dividers.d4 },
  tile: { width: '50%', paddingVertical: 11, paddingRight: 12, borderBottomWidth: 1, borderBottomColor: dividers.d18 },
  tileValue: { marginTop: 5 },
  footer: { marginTop: 10 },
});
