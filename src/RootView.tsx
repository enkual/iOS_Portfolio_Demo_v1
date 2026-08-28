import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStore } from './state/store';
import { colors } from './theme/tokens';
import { PortfolioScreen } from './screens/PortfolioScreen';
import { AllHoldingsScreen } from './screens/AllHoldingsScreen';
import { AnalysisScreen } from './screens/AnalysisScreen';
import { DividendsScreen } from './screens/DividendsScreen';
import { AllPositionsScreen } from './screens/AllPositionsScreen';
import { TabBar } from './components/TabBar';
import { Toast } from './components/Toast';
import { AddSellSheet } from './sheets/AddSellSheet';
import { AdjustSheet } from './sheets/AdjustSheet';

function CurrentScreen() {
  const { state } = useStore();
  if (state.tab === 'portfolio') {
    return state.page === 'holdings' ? <AllHoldingsScreen /> : <PortfolioScreen />;
  }
  if (state.tab === 'analysis') {
    return <AnalysisScreen />;
  }
  // dividends
  return state.page === 'all' ? <AllPositionsScreen /> : <DividendsScreen />;
}

export function RootView() {
  const { state, derived: d, actions } = useStore();

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <CurrentScreen />
      </View>

      <View style={styles.tabBarWrap} pointerEvents="box-none">
        <TabBar active={state.tab} alertCount={d.alertCount} onSelect={actions.goTab} />
      </View>

      <Toast message={state.toast} />

      {state.sheetOpen ? <AddSellSheet /> : null}
      {state.adjustIdx !== null ? <AdjustSheet /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1 },
  tabBarWrap: { paddingHorizontal: 14, paddingBottom: 10, paddingTop: 4 },
});
