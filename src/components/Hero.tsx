import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, dividers } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { toneColor } from '../theme/colorFor';
import { Derived } from '../state/derive';

/** Default dashboard hero treatment: value + day change, then a two-column P/L vs benchmark strip. */
export function LedgerHero({ d }: { d: Derived }) {
  return (
    <View style={styles.ledgerWrap}>
      <Text style={font(600, 9, { color: colors.neutral600, letterSpacingEm: 0.18, uppercase: true })}>Total value · {d.asOf}</Text>
      <View style={styles.ledgerValueRow}>
        <Text style={[font(800, 40, { color: colors.ink, letterSpacingEm: -0.035 }), tabularNums]}>{d.totalValue}</Text>
        <Text style={[font(700, 15, { color: toneColor(d.dayTone) }), tabularNums]}>{d.dayChangeLabel}</Text>
      </View>
      <View style={styles.ledgerSplit}>
        <View style={styles.ledgerCol}>
          <Text style={font(600, 9, { color: colors.neutral600, letterSpacingEm: 0.14, uppercase: true })}>Total P/L</Text>
          <Text style={[font(700, 17, { color: toneColor(d.plTone) }), tabularNums, styles.ledgerColValue]}>{d.totalPL}</Text>
          <Text style={[font(500, 11, { color: colors.neutral700 }), tabularNums]}>
            {d.totalPLPct} · {d.realizedNote}
          </Text>
        </View>
        <View style={[styles.ledgerCol, styles.ledgerColRight]}>
          <Text style={font(600, 9, { color: colors.neutral600, letterSpacingEm: 0.14, uppercase: true })}>vs {d.benchShort}</Text>
          <Text style={[font(700, 17, { color: toneColor(d.spreadTone) }), tabularNums, styles.ledgerColValue]}>{d.spread}</Text>
          <Text style={font(500, 11, { color: colors.neutral700 })}>excess return, 1Y</Text>
        </View>
      </View>
    </View>
  );
}

/** Poster treatment: full-bleed background that flips color by trading-day direction. */
export function PosterHero({ d }: { d: Derived }) {
  const bg = d.posterTone === 'up' ? colors.posterGreen : d.posterTone === 'down' ? colors.accent : colors.surface;
  const fg = d.posterTone === 'neutral' ? colors.ink : colors.white;
  return (
    <View style={[styles.posterWrap, { backgroundColor: bg }]}>
      <Text style={font(600, 9, { color: fg, letterSpacingEm: 0.18, uppercase: true })}>Total value · {d.asOf}</Text>
      <Text style={[font(800, 46, { color: fg, letterSpacingEm: -0.035 }), tabularNums, styles.posterValue]}>{d.totalValue}</Text>
      <View style={styles.posterRow}>
        <View>
          <Text style={font(600, 9, { color: fg, letterSpacingEm: 0.14, uppercase: true })}>Today</Text>
          <Text style={[font(700, 16, { color: fg }), tabularNums, styles.posterCellValue]}>{d.dayChangeLabel}</Text>
        </View>
        <View>
          <Text style={font(600, 9, { color: fg, letterSpacingEm: 0.14, uppercase: true })}>Total P/L</Text>
          <Text style={[font(700, 16, { color: fg }), tabularNums, styles.posterCellValue]}>
            {d.totalPL} · {d.totalPLPct}
          </Text>
        </View>
        <View>
          <Text style={font(600, 9, { color: fg, letterSpacingEm: 0.14, uppercase: true })}>vs {d.benchShort}</Text>
          <Text style={[font(700, 16, { color: fg }), tabularNums, styles.posterCellValue]}>{d.spread}</Text>
        </View>
      </View>
    </View>
  );
}

/** Grid treatment: value banner over a 3-tile Day / Total P/L / vs benchmark strip. */
export function GridHero({ d }: { d: Derived }) {
  return (
    <View style={styles.gridWrap}>
      <View style={styles.gridBanner}>
        <Text style={font(600, 9, { color: colors.neutral600, letterSpacingEm: 0.18, uppercase: true })}>Total value · {d.asOf}</Text>
        <Text style={[font(800, 38, { color: colors.ink, letterSpacingEm: -0.035 }), tabularNums, styles.gridValue]}>{d.totalValue}</Text>
      </View>
      <View style={styles.gridTiles}>
        {d.heroTiles.map((t, i) => (
          <View key={t.label} style={[styles.gridTile, i > 0 && styles.gridTileBorder]}>
            <Text style={font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true })}>{t.label}</Text>
            <Text style={[font(700, 15, { color: toneColor(t.tone) }), tabularNums, styles.gridTileValue]}>{t.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ledgerWrap: { paddingVertical: 16, paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: dividers.d4 },
  ledgerValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 6 },
  ledgerSplit: { flexDirection: 'row', marginTop: 14, borderTopWidth: 1, borderTopColor: dividers.d25 },
  ledgerCol: { flex: 1, paddingTop: 10, paddingRight: 10 },
  ledgerColRight: { paddingLeft: 14, paddingRight: 0, borderLeftWidth: 1, borderLeftColor: dividers.d25 },
  ledgerColValue: { marginTop: 5 },

  posterWrap: { paddingVertical: 20, paddingHorizontal: 20, paddingBottom: 18 },
  posterValue: { marginTop: 8 },
  posterRow: { flexDirection: 'row', gap: 18, marginTop: 12 },
  posterCellValue: { marginTop: 4 },

  gridWrap: { borderBottomWidth: 2, borderBottomColor: colors.ink },
  gridBanner: { paddingVertical: 16, paddingHorizontal: 20, paddingBottom: 14, backgroundColor: colors.surface },
  gridValue: { marginTop: 6 },
  gridTiles: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: dividers.d4 },
  gridTile: { flex: 1, paddingVertical: 11, paddingHorizontal: 12 },
  gridTileBorder: { borderLeftWidth: 1, borderLeftColor: dividers.d25 },
  gridTileValue: { marginTop: 5 },
});
