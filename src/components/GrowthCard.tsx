import React from 'react';
import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native';

import { colors, dividers } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { ChipRow, SegmentedRow } from './Chip';
import { GrowthChart } from './GrowthChart';
import { Derived } from '../state/derive';

interface Props {
  d: Derived;
  onSelectBench: (k: string) => void;
  customBench: string;
  onChangeCustomBench: (v: string) => void;
  onApplyCustomBench: () => void;
  onSelectRange: (k: string) => void;
}

/** "Growth vs benchmark" card: benchmark chips + custom ticker field, indexed line chart,
 * date range labels, a return legend, and the period selector. */
export function GrowthCard({ d, onSelectBench, customBench, onChangeCustomBench, onApplyCustomBench, onSelectRange }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headRow}>
        <Text style={font(800, 13, { color: colors.ink, letterSpacingEm: 0.02, uppercase: true })}>Growth vs benchmark</Text>
        <Text style={[font(600, 10, { color: colors.neutral600 }), tabularNums]}>{d.rangeLabel}</Text>
      </View>

      <View style={styles.benchRow}>
        <ChipRow options={d.benchOpts} onSelect={onSelectBench} />
        <View style={styles.customField}>
          <TextInput
            value={customBench}
            onChangeText={onChangeCustomBench}
            placeholder="TICKER"
            autoCapitalize="characters"
            placeholderTextColor={colors.neutral500}
            style={[font(600, 10, { color: colors.ink, letterSpacingEm: 0.06 }), styles.customInput]}
          />
          <Pressable onPress={onApplyCustomBench} style={styles.setBtn}>
            <Text style={font(600, 10, { color: colors.accentDark })}>SET</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.chartWrap}>
        <GrowthChart portPath={d.portPath} benchPath={d.benchPath} />
      </View>

      <View style={styles.dateRow}>
        <Text style={[font(500, 9.5, { color: colors.neutral600 }), tabularNums]}>{d.chartStart}</Text>
        <Text style={[font(500, 9.5, { color: colors.neutral600 }), tabularNums]}>{d.chartEnd}</Text>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={styles.legendPort} />
          <Text style={font(600, 10, { color: colors.ink })}>Portfolio {d.portTotalRet}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendBench} />
          <Text style={font(600, 10, { color: colors.ink })}>
            {d.benchShort} {d.benchTotalRet}
          </Text>
        </View>
      </View>

      <View style={styles.rangeWrap}>
        <SegmentedRow options={d.rangeOpts} onSelect={onSelectRange} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 18, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: colors.ink },
  headRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  benchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  customField: { flexDirection: 'row', borderWidth: 1.5, borderColor: dividers.d4 },
  customInput: { width: 62, paddingVertical: 6, paddingHorizontal: 8 },
  setBtn: { borderLeftWidth: 1.5, borderLeftColor: dividers.d4, paddingVertical: 6, paddingHorizontal: 9, justifyContent: 'center' },
  chartWrap: { marginTop: 14 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 },
  legendRow: { flexDirection: 'row', gap: 16, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendPort: { width: 16, height: 3, backgroundColor: colors.accent },
  legendBench: { width: 16, height: 0, borderTopWidth: 2, borderTopColor: colors.ink, borderStyle: 'dashed' },
  rangeWrap: { marginTop: 14 },
});
