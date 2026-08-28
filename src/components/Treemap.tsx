import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { font } from '../theme/typography';
import { TreemapRow } from '../state/derive';

/** Treemap-style grid of dividend tiles: green-shaded by yield intensity for payers, flat red
 * for non-payers, sized by the selected metric (income or yield) with a floor size so
 * non-payers stay visible. */
export function Treemap({ rows }: { rows: TreemapRow[] }) {
  return (
    <View style={styles.wrap}>
      {rows.map((row, i) => (
        <View key={i} style={[styles.row, { height: row.height }]}>
          {row.tiles.map((t, j) => (
            <View key={j} style={[styles.tile, { flexGrow: t.flex, flexBasis: 0, backgroundColor: t.bg }]}>
              <Text style={font(700, 12, { color: t.fg, letterSpacingEm: 0.01 })}>{t.sym}</Text>
              <Text style={[font(600, 9.5, { color: t.fg }), styles.sub]}>{t.sub}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 12, gap: 3 },
  row: { flexDirection: 'row', gap: 3 },
  tile: { minWidth: 0, paddingVertical: 8, paddingHorizontal: 9, justifyContent: 'space-between', overflow: 'hidden' },
  sub: { opacity: 0.9 },
});
