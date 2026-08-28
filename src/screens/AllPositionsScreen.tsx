import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useStore } from '../state/store';
import { colors, dividers } from '../theme/tokens';
import { font } from '../theme/typography';
import { BackHeader } from '../components/Headers';
import { TileRow } from '../components/Tiles';
import { SortRow } from '../components/SortRow';
import { AllPositionsRow } from '../components/DivRowView';
import { FooterNote } from '../components/FooterNote';

export function AllPositionsScreen() {
  const { derived: d, actions } = useStore();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <BackHeader backLabel="← Dividends" title="ALL POSITIONS" onBack={actions.goDividends} />

      <TileRow
        cellTopBorder={false}
        items={[
          { label: 'Annual income', value: d.divIncomeTotal, tone: 'pos' },
          { label: 'Payers', value: d.divPayers, tone: 'pos' },
        ]}
      />

      <SortRow options={d.divSortOpts} onSelect={actions.setDivSort} />

      <View style={styles.colHeadRow}>
        <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.1, uppercase: true }), styles.colTicker]}>Ticker</Text>
        <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.1, uppercase: true }), styles.colFixed, { width: 50 }]}>
          Wt
        </Text>
        <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.1, uppercase: true }), styles.colFixed, { width: 50 }]}>
          DPS
        </Text>
        <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.1, uppercase: true }), styles.colFixed, { width: 52 }]}>
          Yield
        </Text>
        <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.1, uppercase: true }), styles.colFixed, { width: 66 }]}>
          Income
        </Text>
      </View>

      {d.divRowsSorted.map((row) => (
        <AllPositionsRow key={row.sym} row={row} />
      ))}

      <FooterNote>Non-payers are listed in red with no DPS. Income = dividend per share × shares held.</FooterNote>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  colHeadRow: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: dividers.d4 },
  colTicker: { flex: 1 },
  colFixed: { textAlign: 'right' },
});
