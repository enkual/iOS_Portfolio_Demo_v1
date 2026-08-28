import React from 'react';
import { ScrollView, View } from 'react-native';

import { useStore } from '../state/store';
import { DashboardHeader } from '../components/Headers';
import { AccountPanel } from '../components/AccountPanel';
import { GridHero, LedgerHero, PosterHero } from '../components/Hero';
import { TileRow } from '../components/Tiles';
import { GrowthCard } from '../components/GrowthCard';
import { SectionHeader } from '../components/SectionHeader';
import { ColumnHeaderRow } from '../components/ColumnHeaderRow';
import { HoldingRow } from '../components/HoldingRow';
import { ShowAllRow } from '../components/ShowAllRow';
import { FooterNote } from '../components/FooterNote';

export function PortfolioScreen() {
  const { state, derived: d, actions } = useStore();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <DashboardHeader
        onAddLot={actions.openSheet}
        accountOpen={state.accountOpen}
        onToggleAccount={actions.toggleAccount}
        unreadCount={d.unreadCount}
      />
      {state.accountOpen ? (
        <AccountPanel inbox={d.inbox} onOpenMailbox={actions.openMailbox} onOpenSettings={actions.openSettings} />
      ) : null}

      {state.treatment === 'poster' ? <PosterHero d={d} /> : state.treatment === 'grid' ? <GridHero d={d} /> : <LedgerHero d={d} />}

      <TileRow items={d.bookTiles} />

      <GrowthCard
        d={d}
        onSelectBench={actions.setBenchmark}
        customBench={state.customBench}
        onChangeCustomBench={actions.setCustomBench}
        onApplyCustomBench={actions.applyCustomBench}
        onSelectRange={actions.setRange}
      />

      <View style={{ borderBottomWidth: 2, borderBottomColor: '#201e1d' }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 10 }}>
          <SectionHeader title="Holdings" meta={`Top 5 of ${d.holdingCount}`} />
        </View>
        <ColumnHeaderRow left="Ticker / lot" right="Value / P&L" />
        {d.topRows.map((row) => (
          <HoldingRow key={row.sym} row={row} />
        ))}
        <ShowAllRow label={`Show all ${d.holdingCount} holdings`} onPress={actions.goHoldings} />
      </View>

      <FooterNote>
        Prototype data. Production reads daily adjusted closes from Yahoo Finance for every holding and the selected benchmark, as the
        Streamlit app does.
      </FooterNote>
    </ScrollView>
  );
}
