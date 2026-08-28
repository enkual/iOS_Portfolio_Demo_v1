import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, dividers } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { toneColor } from '../theme/colorFor';
import { SegmentedRow } from './Chip';
import { Histogram } from './Histogram';
import { Derived } from '../state/derive';

interface Props {
  d: Derived;
  showNormal: boolean;
  onToggleNormal: () => void;
  onSelectBins: (b: number) => void;
  distOpen: boolean;
  onToggleDist: () => void;
}

export function DistributionCard({ d, showNormal, onToggleNormal, onSelectBins, distOpen, onToggleDist }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headRow}>
        <Text style={font(800, 13, { color: colors.ink, letterSpacingEm: 0.02, uppercase: true })}>Return distribution</Text>
        <Text style={[font(600, 10, { color: colors.neutral600 }), tabularNums]}>
          σ {d.distSigma} · skew {d.distSkew}
        </Text>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: '#0F6A0D8C' }]} />
          <Text style={font(600, 10, { color: colors.ink })}>Portfolio</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: 'rgba(32,30,29,0.42)' }]} />
          <Text style={font(600, 10, { color: colors.ink })}>{d.benchShort}</Text>
        </View>
      </View>

      <View style={styles.chartWrap}>
        <Histogram
          histPort={d.histPort}
          histBench={d.histBench}
          normalPath={d.normalPath}
          showNormal={showNormal}
          zeroX={d.zeroX}
          histTicks={d.histTicks}
        />
      </View>
      <Text style={font(600, 8.5, { color: colors.neutral500, letterSpacingEm: 0.14, uppercase: true })}>Daily return (%)</Text>

      <View style={styles.controlsRow}>
        <Pressable onPress={onToggleNormal} style={[styles.normalBtn, { backgroundColor: showNormal ? colors.ink : 'transparent' }]}>
          <Text style={font(600, 9.5, { color: showNormal ? colors.bg : colors.ink })}>Normal fit</Text>
        </Pressable>
        <Text style={font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.14, uppercase: true })}>Bins</Text>
        <SegmentedRow options={d.binOpts} onSelect={onSelectBins} size="sm" />
      </View>

      <Pressable onPress={onToggleDist} style={styles.toggleRow}>
        <Text style={font(700, 10.5, { color: colors.chartGreen, letterSpacingEm: 0.12, uppercase: true })}>
          {distOpen ? 'Hide distribution stats' : 'Show distribution stats'}
        </Text>
        <Text style={font(700, 12, { color: colors.chartGreen })}>{distOpen ? '▲' : '▼'}</Text>
      </Pressable>

      {distOpen ? (
        <View>
          <View style={styles.statsHeadRow}>
            <View style={styles.statsLabelCol} />
            <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true }), styles.statsCol]}>
              Portfolio
            </Text>
            <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true }), styles.statsCol]}>
              {d.benchShort}
            </Text>
          </View>
          {d.distRows.map((r) => (
            <View key={r.label} style={styles.statsRow}>
              <Text style={[font(500, 11, { color: colors.neutral700 }), styles.statsLabelCol]}>{r.label}</Text>
              <Text style={[font(700, 11.5, { color: toneColor(r.pTone) }), tabularNums, styles.statsCol]}>{r.p}</Text>
              <Text style={[font(600, 11.5, { color: colors.neutral700 }), tabularNums, styles.statsCol]}>{r.b}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <Text style={[font(500, 10, { color: colors.neutral600, lineHeight: 1.5 }), styles.footer]}>
        Bars are observed daily returns; σ and returns are annualised. Excess kurtosis above 0 means fatter tails than a normal — the fit
        overlay makes the gap visible.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 18, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: colors.ink },
  headRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  legendRow: { flexDirection: 'row', gap: 14, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 12, height: 12 },
  chartWrap: { marginTop: 10 },
  controlsRow: { flexDirection: 'row', gap: 10, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' },
  normalBtn: { borderWidth: 1.5, borderColor: colors.ink, paddingVertical: 6, paddingHorizontal: 10 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: dividers.d4,
    paddingVertical: 12,
  },
  statsHeadRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: dividers.d4, paddingVertical: 8 },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: dividers.d18, paddingVertical: 8 },
  statsLabelCol: { flex: 1 },
  statsCol: { width: 72, textAlign: 'right' },
  footer: { marginTop: 10 },
});
