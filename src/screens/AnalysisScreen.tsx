import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useStore } from '../state/store';
import { dividers } from '../theme/tokens';
import { AnalysisHeader } from '../components/Headers';
import { AlertsPanel } from '../components/AlertsPanel';
import { LabeledRow } from '../components/LabeledRow';
import { ChipRow, SegmentedRow } from '../components/Chip';
import { TileRow } from '../components/Tiles';
import { DistributionCard } from '../components/DistributionCard';
import { RollingChartCard } from '../components/RollingChart';
import { CorrelationCard } from '../components/CorrelationCard';
import { BetaTable } from '../components/BetaTable';
import { VarSection } from '../components/VarSection';
import { FooterNote } from '../components/FooterNote';

export function AnalysisScreen() {
  const { state, derived: d, actions } = useStore();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <AnalysisHeader
        periodLabel={d.periodLabel}
        benchmark={d.benchmark}
        notesOpen={state.notesOpen}
        onToggleNotes={actions.toggleNotes}
        alertCount={d.alertCount}
      />
      {state.notesOpen ? <AlertsPanel notes={d.notes} count={d.alertCount} /> : null}

      <View style={styles.selectors}>
        <LabeledRow label="Benchmark">
          <ChipRow options={d.benchOpts} onSelect={actions.setBenchmark} size="sm" />
        </LabeledRow>
        <LabeledRow label="Period">
          <SegmentedRow options={d.rangeOpts} onSelect={actions.setRange} size="sm" />
        </LabeledRow>
        <LabeledRow label="Window">
          <SegmentedRow options={d.windowOpts} onSelect={actions.setWindow} size="sm" />
        </LabeledRow>
      </View>

      <TileRow cellTopBorder={false} items={d.riskTiles} />

      <DistributionCard
        d={d}
        showNormal={state.showNormal}
        onToggleNormal={actions.toggleNormal}
        onSelectBins={actions.setBins}
        distOpen={state.distOpen}
        onToggleDist={actions.toggleDist}
      />

      {d.rollCharts.map((rc) => (
        <RollingChartCard key={rc.title} rc={rc} />
      ))}

      <CorrelationCard d={d} />

      <BetaTable rows={d.betaRows} weightedBeta={d.weightedBeta} />

      <VarSection horizonOpts={d.horizonOpts} onSelectHorizon={actions.setHorizon} tiles={d.varTiles} />

      <FooterNote>
        Not yet ported from the Streamlit app: return-distribution histogram with normal overlay, correlation network with hierarchical
        clusters, rolling pairwise correlation, reallocation scenarios and the notification bell.
      </FooterNote>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  selectors: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: dividers.d4,
    gap: 11,
  },
});
