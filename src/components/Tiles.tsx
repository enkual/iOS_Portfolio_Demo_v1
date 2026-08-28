import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, dividers } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { toneColor, Tone } from '../theme/colorFor';

export interface MetricTileData {
  label: string;
  value: string;
  note?: string;
  tone?: Tone;
  color?: string; // escape hatch for non-tone colors (e.g. divTiles' accentDark)
}

/** A row (or, with `columns`, a wrapping grid) of equal-width metric tiles with hairline
 * dividers, matching the repeated grid-template-columns pattern used for book/hero/risk/
 * dividend tile rows. `cellTopBorder` mirrors the source's inconsistency between sections:
 * book/dividend tiles get a border-top per cell, totals-strip/risk tiles don't. */
export function TileRow({
  items,
  bordered = true,
  cellTopBorder = true,
  columns,
}: {
  items: MetricTileData[];
  bordered?: boolean;
  cellTopBorder?: boolean;
  columns?: number;
}) {
  const cols = columns || items.length;
  return (
    <View style={[styles.row, styles.wrap, bordered && styles.rowBorder]}>
      {items.map((m, i) => (
        <View
          key={m.label}
          style={[
            styles.tile,
            { width: `${100 / cols}%` },
            cellTopBorder && styles.tileTopBorder,
            i % cols !== 0 && styles.tileBorder,
          ]}
        >
          <Text style={font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true })}>{m.label}</Text>
          <Text style={[font(700, 16, { color: m.color || (m.tone ? toneColor(m.tone) : colors.ink) }), tabularNums, styles.tileValue]}>
            {m.value}
          </Text>
          {m.note ? <Text style={[font(500, 9.5, { color: colors.neutral600 }), styles.tileNote]}>{m.note}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  wrap: { flexWrap: 'wrap' },
  rowBorder: { borderBottomWidth: 2, borderBottomColor: colors.ink },
  tile: { paddingVertical: 12, paddingHorizontal: 12 },
  tileTopBorder: { borderTopWidth: 1, borderTopColor: dividers.d25 },
  tileBorder: { borderLeftWidth: 1, borderLeftColor: dividers.d25 },
  tileValue: { marginTop: 5 },
  tileNote: { marginTop: 3 },
});
