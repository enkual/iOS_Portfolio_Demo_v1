import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, dividers } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { SectionHeader } from './SectionHeader';
import { CorrelationMatrix } from './CorrelationMatrix';
import { Derived } from '../state/derive';

export function CorrelationCard({ d }: { d: Derived }) {
  return (
    <View style={styles.card}>
      <SectionHeader title="Correlation matrix" subtitle={`Daily-return correlation over ${d.periodLabel}. Red cells move together; green cells diversify or hedge.`} />
      <View style={styles.matrixWrap}>
        <CorrelationMatrix
          corrLabels={d.corrLabels}
          corrRows={d.corrRows}
          corrGutter={d.corrGutter}
          corrCellH={d.corrCellH}
          corrCellFs={d.corrCellFs}
          corrLabelFs={d.corrLabelFs}
        />
      </View>
      <View style={styles.statsRow}>
        {d.corrStats.map((s) => (
          <View key={s.label} style={styles.statCell}>
            <Text style={font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.1, uppercase: true })}>{s.label}</Text>
            <Text style={[font(700, 15, { color: colors.ink }), tabularNums, styles.statValue]}>{s.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 18, paddingHorizontal: 20, paddingBottom: 18, borderBottomWidth: 2, borderBottomColor: colors.ink },
  matrixWrap: { marginTop: 12 },
  statsRow: { flexDirection: 'row', marginTop: 14, borderTopWidth: 1, borderTopColor: dividers.d4 },
  statCell: { flex: 1, paddingTop: 10, paddingRight: 10 },
  statValue: { marginTop: 5 },
});
