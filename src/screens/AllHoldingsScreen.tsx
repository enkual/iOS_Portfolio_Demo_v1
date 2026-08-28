import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useStore } from '../state/store';
import { colors } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { toneColor } from '../theme/colorFor';
import { BackHeader } from '../components/Headers';
import { TileRow } from '../components/Tiles';
import { SortRow } from '../components/SortRow';
import { ColumnHeaderRow } from '../components/ColumnHeaderRow';
import { HoldingRow } from '../components/HoldingRow';
import { SwipeableRow } from '../components/SwipeableRow';
import { FooterNote } from '../components/FooterNote';

export function AllHoldingsScreen() {
  const { derived: d, actions } = useStore();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <BackHeader backLabel="< Portfolio" title="ALL HOLDINGS" onBack={actions.goPortfolio} rightLabel="+ Add lot" onRight={actions.openSheet} />

      <TileRow
        cellTopBorder={false}
        items={[
          { label: 'Open / closed', value: `${d.holdingCount} · ${d.closedCount}`, tone: 'pos' },
          { label: 'Unrealised', value: d.unrealPL, tone: d.unrealTone },
          { label: 'Realised', value: d.realizedPL, tone: d.realTone },
        ]}
      />

      <SortRow options={d.sortOpts} onSelect={actions.setSort} />
      <ColumnHeaderRow left="Ticker / lot" right="Value / P&L" />

      {d.allRowsSorted.map((row) => (
        <HoldingRow key={row.sym} row={row} showBar onSell={() => actions.openSellFor(row.sym)} />
      ))}

      <View style={styles.closedHeadRow}>
        <Text style={font(800, 13, { color: colors.ink, letterSpacingEm: 0.02, uppercase: true })}>Closed positions</Text>
        <Text style={[font(700, 13, { color: toneColor(d.realTone) }), tabularNums]}>{d.realizedPL}</Text>
      </View>

      {d.closedRows.map((row) => (
        <SwipeableRow key={row.idx} row={row} onDelete={() => actions.deleteClosed(row.idx)} onAdjust={() => actions.openAdjust(row.idx)} />
      ))}

      <FooterNote>Swipe a closed lot left to delete it, right to adjust the exit.</FooterNote>
      <FooterNote style={styles.lastFooter}>Bars show portfolio weight. Realised gains and losses from closed lots carry into total P/L.</FooterNote>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  closedHeadRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
  },
  lastFooter: { paddingTop: 0 },
});
