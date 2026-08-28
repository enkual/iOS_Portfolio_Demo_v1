import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/tokens';
import { font } from '../theme/typography';
import { bucketColors } from '../theme/colorFor';
import { CorrRow } from '../state/derive';
import { Bucket } from '../state/constants';

interface Props {
  corrLabels: string[];
  corrRows: CorrRow[];
  corrGutter: number;
  corrCellH: number;
  corrCellFs: number;
  corrLabelFs: number;
}

const LEGEND: { bucket: Bucket; label: string }[] = [
  { bucket: 'hedge', label: 'Hedge ≤ −0.20' },
  { bucket: 'low', label: 'Low −0.20 to 0.20' },
  { bucket: 'mod', label: 'Moderate to 0.50' },
  { bucket: 'high', label: 'High ≥ 0.50' },
];

/** Square correlation heatmap that shrinks cell size and font size as holdings grow, matching
 * the source's exact cellW/corrCellFs/corrLabelFs/corrGutter breakpoints. */
export function CorrelationMatrix({ corrLabels, corrRows, corrGutter, corrCellH, corrCellFs, corrLabelFs }: Props) {
  return (
    <View>
      <View style={{ width: '100%' }}>
        <View style={styles.headRow}>
          <View style={{ width: corrGutter }} />
          {corrLabels.map((c) => (
            <Text key={c} style={[font(600, corrLabelFs, { color: colors.neutral600, align: 'center' }), styles.headLabel]} numberOfLines={1}>
              {c}
            </Text>
          ))}
        </View>
        {corrRows.map((row) => (
          <View key={row.label} style={styles.dataRow}>
            <Text style={[font(600, corrLabelFs, { color: colors.neutral600 }), { width: corrGutter }]} numberOfLines={1}>
              {row.label}
            </Text>
            {row.cells.map((cell, j) => {
              const c = bucketColors[cell.bucket];
              return (
                <View key={j} style={[styles.cell, { height: corrCellH, backgroundColor: c.bg }]}>
                  <Text style={font(600, corrCellFs, { color: c.fg })}>{cell.value}</Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.legendWrap}>
        {LEGEND.map((l) => (
          <View key={l.bucket} style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: bucketColors[l.bucket].bg }]} />
            <Text style={font(600, 9, { color: colors.neutral700 })}>{l.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headRow: { flexDirection: 'row' },
  headLabel: { flex: 1, minWidth: 0, paddingBottom: 5, overflow: 'hidden' },
  dataRow: { flexDirection: 'row', alignItems: 'center' },
  cell: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.bg },
  legendWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendSwatch: { width: 11, height: 11 },
});
