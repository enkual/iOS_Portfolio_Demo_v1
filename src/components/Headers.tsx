import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/tokens';
import { font } from '../theme/typography';
import { CircleIconButton, GhostLink, PillButton } from './Button';
import { BellIcon, UserIcon } from './Icons';
import { CountBadge } from './Badge';

/** Portfolio-dashboard header: "+ Add lot" pill left, avatar button (with unread badge) right. */
export function DashboardHeader({
  onAddLot,
  accountOpen,
  onToggleAccount,
  unreadCount,
}: {
  onAddLot: () => void;
  accountOpen: boolean;
  onToggleAccount: () => void;
  unreadCount: number;
}) {
  return (
    <View style={styles.dashRow}>
      <PillButton label="+ Add lot" onPress={onAddLot} />
      <CircleIconButton onPress={onToggleAccount} active={accountOpen}>
        {(color) => (
          <View>
            <UserIcon color={color} />
            <CountBadge count={unreadCount} />
          </View>
        )}
      </CircleIconButton>
    </View>
  );
}

/** Back-link + big title header used on All Holdings / All Positions, with an optional right action. */
export function BackHeader({
  backLabel,
  title,
  onBack,
  rightLabel,
  onRight,
}: {
  backLabel: string;
  title: string;
  onBack: () => void;
  rightLabel?: string;
  onRight?: () => void;
}) {
  return (
    <View style={styles.backRow}>
      <View>
        <GhostLink label={backLabel} onPress={onBack} />
        <Text style={[font(800, 20, { color: colors.ink, letterSpacingEm: -0.01 }), styles.backTitle]}>{title}</Text>
      </View>
      {rightLabel && onRight ? <PillButton label={rightLabel} onPress={onRight} style={styles.smallPill} /> : null}
    </View>
  );
}

/** Plain title header, no actions (Dividends main screen). */
export function TitleHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <View style={styles.titleRow}>
      <Text style={font(600, 9, { color: colors.neutral600, letterSpacingEm: 0.18, uppercase: true })}>{kicker}</Text>
      <Text style={[font(800, 20, { color: colors.ink, letterSpacingEm: -0.01 }), styles.titleMargin]}>{title}</Text>
    </View>
  );
}

/** Analysis header: bell (with alert-count badge) top-right, period/benchmark kicker + title left. */
export function AnalysisHeader({
  periodLabel,
  benchmark,
  notesOpen,
  onToggleNotes,
  alertCount,
}: {
  periodLabel: string;
  benchmark: string;
  notesOpen: boolean;
  onToggleNotes: () => void;
  alertCount: number;
}) {
  return (
    <View style={styles.analysisRow}>
      <View>
        <Text style={font(600, 9, { color: colors.neutral600, letterSpacingEm: 0.18, uppercase: true })}>
          {periodLabel} · vs {benchmark}
        </Text>
        <Text style={[font(700, 20, { color: colors.ink, letterSpacingEm: -0.01 }), styles.titleMargin]}>PORTFOLIO ANALYSIS</Text>
      </View>
      <CircleIconButton onPress={onToggleNotes} active={notesOpen}>
        {(color) => (
          <View>
            <BellIcon color={color} />
            <CountBadge count={alertCount} />
          </View>
        )}
      </CircleIconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  dashRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
  },
  backTitle: { marginTop: 4 },
  titleRow: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: colors.ink },
  titleMargin: { marginTop: 4 },
  analysisRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
  },
  smallPill: { paddingVertical: 7, paddingHorizontal: 12 },
});
