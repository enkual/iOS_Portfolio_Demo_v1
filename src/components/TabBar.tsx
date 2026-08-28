import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '../theme/tokens';
import { font } from '../theme/typography';
import { CountBadge } from './Badge';
import { AnalysisTabIcon, DividendsTabIcon, PortfolioTabIcon } from './Icons';
import { Tab } from '../state/types';

interface TabDef {
  key: Tab;
  label: string;
  Icon: typeof PortfolioTabIcon;
}

const TABS: TabDef[] = [
  { key: 'portfolio', label: 'Portfolio', Icon: PortfolioTabIcon },
  { key: 'analysis', label: 'Analysis', Icon: AnalysisTabIcon },
  { key: 'dividends', label: 'Dividends', Icon: DividendsTabIcon },
];

/** Floating dark bottom tab bar, inset from the screen edges, with a red count badge on
 * Analysis showing the number of currently-firing alert rules. */
export function TabBar({ active, alertCount, onSelect }: { active: Tab; alertCount: number; onSelect: (t: Tab) => void }) {
  return (
    <View style={styles.bar}>
      {TABS.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <Pressable key={key} onPress={() => onSelect(key)} style={[styles.tab, { backgroundColor: isActive ? colors.tabActiveBg : 'transparent' }]}>
            <Icon color={isActive ? colors.bg : colors.tabInactiveFg} />
            <Text style={font(700, 10, { color: isActive ? colors.bg : colors.tabInactiveFg, letterSpacingEm: 0.1, uppercase: true })}>
              {label}
            </Text>
            {key === 'analysis' ? <CountBadge count={alertCount} style={styles.analysisBadge} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.tabBarBg,
    padding: 8,
    gap: 2,
    borderRadius: radius.tabBar,
    shadowColor: 'rgba(32,30,29,0.28)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  tab: {
    flex: 1,
    position: 'relative',
    paddingTop: 9,
    paddingBottom: 8,
    paddingHorizontal: 6,
    borderRadius: radius.tabBlock,
    alignItems: 'center',
    gap: 5,
  },
  analysisBadge: { top: 0, right: 6 },
});
