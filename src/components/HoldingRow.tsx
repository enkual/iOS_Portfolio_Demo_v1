import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, dividers } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { toneColor } from '../theme/colorFor';
import { HoldingRow as HoldingRowData } from '../state/derive';
import { OutlineButton } from './Button';

/** A single holding row (ticker/weight, lot description, value, P/L). Used as-is on the
 * dashboard's top-5 list, and with a weight bar + Sell button on the All Holdings screen. */
export function HoldingRow({ row, showBar, onSell }: { row: HoldingRowData; showBar?: boolean; onSell?: () => void }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <View style={styles.left}>
          <View style={styles.symRow}>
            <Text style={font(700, 14, { color: colors.ink, letterSpacingEm: 0.01 })}>{row.sym}</Text>
            <Text style={font(500, 10, { color: colors.neutral600 })}>{row.weightLabel}</Text>
          </View>
          <Text style={[font(500, 10, { color: colors.neutral700 }), tabularNums, styles.lot]}>{row.lotLabel}</Text>
        </View>
        <View style={styles.right}>
          <Text style={[font(700, 13, { color: colors.ink }), tabularNums]}>{row.valueLabel}</Text>
          <Text style={[font(600, 10.5, { color: toneColor(row.tone) }), tabularNums, styles.pl]}>{row.plLabel}</Text>
        </View>
      </View>
      {showBar ? (
        <View style={styles.barRow}>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${row.barPct}%` }]} />
          </View>
          {onSell ? <OutlineButton label="Sell" onPress={onSell} /> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 11, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: dividers.d18 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  left: { flexShrink: 1 },
  symRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  lot: { marginTop: 3 },
  right: { alignItems: 'flex-end' },
  pl: { marginTop: 3 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  barTrack: { flex: 1, height: 4, backgroundColor: colors.surface },
  barFill: { height: 4, backgroundColor: colors.accent },
});
