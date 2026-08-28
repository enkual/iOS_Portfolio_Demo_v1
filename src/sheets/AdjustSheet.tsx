import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useStore } from '../state/store';
import { colors, dividers } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { toneColor } from '../theme/colorFor';
import { SheetShell } from '../components/SheetShell';
import { Field } from '../components/Field';
import { PrimaryButton, SecondaryButton } from '../components/Button';

export function AdjustSheet() {
  const { state, derived: d, actions } = useStore();

  return (
    <SheetShell kicker="Closed lot" title={`Adjust ${d.adjSym}`} onClose={actions.closeAdjust}>
      <View style={styles.fieldGrid}>
        <View style={styles.half}>
          <Field label="Shares" value={state.adj.shares} onChangeText={actions.setAdjShares} keyboardType="decimal-pad" />
        </View>
        <View style={styles.half}>
          <Field label="Buy price" value={state.adj.cost} onChangeText={actions.setAdjCost} keyboardType="decimal-pad" />
        </View>
        <View style={styles.half}>
          <Field label="Exit price" value={state.adj.exit} onChangeText={actions.setAdjExit} keyboardType="decimal-pad" />
        </View>
        <View style={styles.half}>
          <Field label="Exit date" value={state.adj.date} onChangeText={actions.setAdjDate} placeholder="YYYY-MM-DD" />
        </View>
      </View>

      <View style={styles.basisRow}>
        <Text style={font(600, 9, { color: colors.neutral600, letterSpacingEm: 0.14, uppercase: true })}>Realised P/L</Text>
        <Text style={[font(800, 22, { color: toneColor(d.adjTone) }), tabularNums]}>{d.adjRealized}</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Save changes" onPress={actions.saveAdjust} />
        <SecondaryButton label="Delete this lot" onPress={actions.deleteAdjust} />
      </View>
    </SheetShell>
  );
}

const styles = StyleSheet.create({
  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, paddingHorizontal: 20, paddingTop: 16 },
  half: { width: '46%', flexGrow: 1 },
  basisRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 12,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: dividers.d4,
  },
  actions: { paddingHorizontal: 20, paddingBottom: 20, gap: 10 },
});
