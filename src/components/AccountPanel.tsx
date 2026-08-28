import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, dividers } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { inboxColor } from '../theme/colorFor';
import { OutlineButton } from './Button';
import { InboxItem } from '../state/derive';

const USER = {
  initials: 'EK',
  name: 'Elias Kaufmann',
  handle: '@enkual',
  plan: 'Pro',
  email: 'elias.kaufmann@proton.me',
  stats: [
    { label: 'Member since', value: 'Sep 2023' },
    { label: 'Linked accounts', value: '2 brokers' },
  ],
};

/** Inline account panel that expands below the header when the avatar is tapped -- not a modal. */
export function AccountPanel({ inbox, onOpenMailbox, onOpenSettings }: { inbox: InboxItem[]; onOpenMailbox: () => void; onOpenSettings: () => void }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <View style={styles.avatar}>
          <Text style={font(800, 18, { color: colors.bg, letterSpacingEm: 0.04 })}>{USER.initials}</Text>
        </View>
        <View style={styles.headText}>
          <Text style={font(800, 17, { color: colors.ink, letterSpacingEm: -0.01 })}>{USER.name}</Text>
          <Text style={[font(600, 10, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true }), styles.metaLine]}>
            {USER.handle} · {USER.plan}
          </Text>
          <Text style={[font(500, 11, { color: colors.neutral700, lineHeight: 1.3 }), styles.metaLine]} numberOfLines={1}>
            {USER.email}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        {USER.stats.map((s, i) => (
          <View key={s.label} style={[styles.statCell, i > 0 && styles.statCellBorder]}>
            <Text style={font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true })}>{s.label}</Text>
            <Text style={[font(700, 14, { color: colors.ink }), tabularNums, styles.statValue]}>{s.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.inboxWrap}>
        {inbox.map((m, i) => (
          <View key={i} style={styles.inboxRow}>
            <View style={styles.inboxText}>
              <Text style={font(700, 11.5, { color: inboxColor(m.tone) })} numberOfLines={1}>
                {m.subject}
              </Text>
              <Text style={[font(500, 10, { color: colors.neutral700 }), styles.inboxPreview]} numberOfLines={1}>
                {m.preview}
              </Text>
            </View>
            <Text style={font(600, 9, { color: colors.neutral500, letterSpacingEm: 0.1, uppercase: true })}>{m.when}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionsRow}>
        <OutlineButton label="Open mailbox" onPress={onOpenMailbox} style={styles.actionBtn} />
        <OutlineButton
          label="Account settings"
          onPress={onOpenSettings}
          style={[styles.actionBtn, styles.actionBtnMuted]}
          textColor={colors.neutral700}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: 2, borderBottomColor: colors.ink, backgroundColor: colors.surface },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 14 },
  avatar: { width: 52, height: 52, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  headText: { flexShrink: 1 },
  metaLine: { marginTop: 4 },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: dividers.d25 },
  statCell: { flex: 1, paddingVertical: 10, paddingHorizontal: 12 },
  statCellBorder: { borderLeftWidth: 1, borderLeftColor: dividers.d25 },
  statValue: { marginTop: 4 },
  inboxWrap: { borderTopWidth: 1, borderTopColor: dividers.d25 },
  inboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: dividers.d18,
  },
  inboxText: { flexShrink: 1 },
  inboxPreview: { marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 12 },
  actionBtnMuted: { borderColor: 'rgba(32,30,29,0.4)' },
});
