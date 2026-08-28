import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useStore } from '../state/store';
import { colors, dividers } from '../theme/tokens';
import { font } from '../theme/typography';
import { divTileColor } from '../theme/colorFor';
import { TitleHeader } from '../components/Headers';
import { TileRow } from '../components/Tiles';
import { SegmentedRow } from '../components/Chip';
import { Treemap } from '../components/Treemap';
import { SectionHeader } from '../components/SectionHeader';
import { TopYieldRow } from '../components/DivRowView';
import { ShowAllRow } from '../components/ShowAllRow';
import { FooterNote } from '../components/FooterNote';

export function DividendsScreen() {
  const { derived: d, actions } = useStore();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <TitleHeader kicker="Trailing twelve months" title="DIVIDENDS" />

      <TileRow
        columns={2}
        items={d.divTiles.map((t) => ({ label: t.label, value: t.value, note: t.note, color: divTileColor(t.tone) }))}
      />

      <View style={styles.tileAreaCard}>
        <View style={styles.tileAreaRow}>
          <Text style={font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.14, uppercase: true })}>Tile area</Text>
          <SegmentedRow options={d.sizeOpts} onSelect={actions.setSizeBy} size="sm" />
        </View>
        <Treemap rows={d.treemapRows} />
        <Text style={[font(500, 10, { color: colors.neutral600, lineHeight: 1.5 }), styles.tileAreaNote]}>
          Tile area = {d.sizeByLower}. Green intensity tracks yield; non-payers keep a floor tile in red so they stay visible.
        </Text>
      </View>

      <View style={styles.topYieldHead}>
        <SectionHeader title="Top yields" meta={`Top 5 of ${d.divCount}`} />
      </View>
      <View style={styles.colHeadRow}>
        <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true }), styles.colTicker]}>Ticker</Text>
        <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true }), styles.colFixed, { width: 58 }]}>
          Weight
        </Text>
        <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true }), styles.colFixed, { width: 54 }]}>
          Yield
        </Text>
        <Text style={[font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true }), styles.colFixed, { width: 76 }]}>
          Income
        </Text>
      </View>
      {d.topYieldRows.map((row) => (
        <TopYieldRow key={row.sym} row={row} />
      ))}
      <ShowAllRow label={`Show all ${d.divCount} positions`} onPress={actions.goDivAll} />

      <FooterNote style={styles.topBorder}>
        Bars show each name's weight in the book, scaled against the largest position. Yields are trailing twelve months of actual
        payments divided by the current price — not the broker's stated yield field, which is often stale.
      </FooterNote>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tileAreaCard: { paddingVertical: 16, paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: dividers.d4 },
  tileAreaRow: { flexDirection: 'row', alignItems: 'center', gap: 9, flexWrap: 'wrap' },
  tileAreaNote: { marginTop: 10 },
  topYieldHead: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 },
  colHeadRow: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: dividers.d4 },
  colTicker: { flex: 1 },
  colFixed: { textAlign: 'right' },
  topBorder: { borderTopWidth: 2, borderTopColor: colors.ink },
});
