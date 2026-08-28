import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, dividers } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { alertDotColor } from '../theme/colorFor';
import { AlertNote } from '../state/derive';

/** Notification dropdown below the Analysis header bell -- the fired alert rules with live values. */
export function AlertsPanel({ notes, count }: { notes: AlertNote[]; count: number }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Text style={font(800, 12, { color: colors.ink, letterSpacingEm: 0.1, uppercase: true })}>Alerts</Text>
        <Text style={font(600, 9, { color: colors.neutral600, letterSpacingEm: 0.12, uppercase: true })}>{count} active</Text>
      </View>
      {notes.map((n, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: alertDotColor(n.dot) }]} />
          <View style={styles.textCol}>
            <Text style={font(700, 11.5, { color: colors.ink, lineHeight: 1.25 })}>{n.title}</Text>
            <Text style={[font(500, 10.5, { color: colors.neutral700, lineHeight: 1.4 }), styles.body]}>{n.body}</Text>
          </View>
          <Text style={[font(700, 12, { color: alertDotColor(n.dot) }), tabularNums, styles.value]}>{n.value}</Text>
        </View>
      ))}
      <Text style={[font(500, 9.5, { color: colors.neutral500, lineHeight: 1.5 }), styles.footer]}>
        Thresholds are placeholders — alert rules get wired to the live book later.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: 2, borderBottomColor: colors.ink, backgroundColor: colors.surface },
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  row: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingVertical: 10, borderTopWidth: 1, borderTopColor: dividers.d18, alignItems: 'flex-start' },
  dot: { width: 11, height: 11, marginTop: 4 },
  textCol: { flexShrink: 1 },
  body: { marginTop: 3 },
  value: { marginLeft: 'auto' },
  footer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14 },
});
