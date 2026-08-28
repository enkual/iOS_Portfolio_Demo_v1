import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useStore } from '../state/store';
import { colors, dividers } from '../theme/tokens';
import { font, tabularNums } from '../theme/typography';
import { toneColor } from '../theme/colorFor';
import { SheetShell } from '../components/SheetShell';
import { Field } from '../components/Field';
import { ChipRow } from '../components/Chip';
import { PrimaryButton, SecondaryButton, GhostLink } from '../components/Button';

export function AddSellSheet() {
  const { state, derived: d, actions } = useStore();
  const isBuy = state.mode === 'buy';

  return (
    <SheetShell kicker={isBuy ? 'New position' : 'Close a position'} title={isBuy ? 'Add a lot' : 'Sell shares'} onClose={actions.closeSheet}>
      <View style={styles.modeRow}>
        <Pressable
          onPress={() => actions.setMode('buy')}
          style={[styles.modeBtn, { backgroundColor: isBuy ? colors.ink : 'transparent' }]}
        >
          <Text style={font(700, 11, { color: isBuy ? colors.bg : colors.ink, letterSpacingEm: 0.12, uppercase: true })}>Buy / add lot</Text>
        </Pressable>
        <Pressable
          onPress={() => actions.setMode('sell')}
          style={[styles.modeBtn, styles.modeBtnBorder, { backgroundColor: !isBuy ? colors.ink : 'transparent' }]}
        >
          <Text style={font(700, 11, { color: !isBuy ? colors.bg : colors.ink, letterSpacingEm: 0.12, uppercase: true })}>Sell / close</Text>
        </Pressable>
      </View>

      {!isBuy ? (
        <View style={styles.section}>
          <Text style={font(600, 9, { color: colors.neutral600, letterSpacingEm: 0.14, uppercase: true })}>Position to close</Text>
          <View style={styles.sellChips}>
            <ChipRow options={d.sellOpts} onSelect={actions.setSellSym} />
          </View>
          <Text style={[font(500, 10, { color: colors.neutral700 }), tabularNums, styles.sellHint]}>{d.sellHint}</Text>

          <View style={styles.fieldGrid}>
            <View style={styles.half}>
              <Field label="Shares to sell" value={state.sell.shares} onChangeText={actions.setSellShares} placeholder="0" keyboardType="decimal-pad" />
              <GhostLink label="Sell entire position" onPress={actions.sellAll} style={styles.sellAllLink} />
            </View>
            <View style={styles.half}>
              <Field label="Sell price" value={state.sell.price} onChangeText={actions.setSellPrice} placeholder="0.00" keyboardType="decimal-pad" />
            </View>
            <View style={styles.full}>
              <Field label="Trade date" value={state.sell.date} onChangeText={actions.setSellDate} placeholder="YYYY-MM-DD" />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <View style={styles.fieldGrid}>
            <View style={styles.full}>
              <Field label="Ticker" value={state.f.ticker} onChangeText={actions.setTicker} placeholder="e.g. AVGO" autoCapitalize="characters" />
            </View>
            <View style={styles.half}>
              <Field label="Quantity" value={state.f.shares} onChangeText={actions.setShares} placeholder="0" keyboardType="decimal-pad" />
            </View>
            <View style={styles.half}>
              <Field label="Buy price" value={state.f.price} onChangeText={actions.setPrice} placeholder="0.00" keyboardType="decimal-pad" />
            </View>
            <View style={styles.full}>
              <Field label="Trade date" value={state.f.date} onChangeText={actions.setDate} placeholder="YYYY-MM-DD" />
            </View>
          </View>

          <GhostLink
            label={state.advOpen ? '– Hide advanced fields' : '+ Advanced: commission, account, note'}
            onPress={actions.toggleAdv}
            style={styles.advLink}
          />

          {state.advOpen ? (
            <View style={styles.fieldGrid}>
              <View style={styles.half}>
                <Field label="Commission" value={state.f.fee} onChangeText={actions.setFee} placeholder="0.00" keyboardType="decimal-pad" small />
              </View>
              <View style={styles.half}>
                <Field label="Account" value={state.f.account} onChangeText={actions.setAccount} placeholder="Growth" small />
              </View>
              <View style={styles.full}>
                <Field label="Note" value={state.f.note} onChangeText={actions.setNote} placeholder="e.g. initial tranche" small />
              </View>
            </View>
          ) : null}
        </View>
      )}

      <View style={styles.basisRow}>
        <Text style={font(600, 9, { color: colors.neutral600, letterSpacingEm: 0.14, uppercase: true })}>
          {isBuy ? 'Cost basis' : 'Realised P/L on sale'}
        </Text>
        <Text style={[font(800, 22, { color: toneColor(d.basisTone) }), tabularNums]}>{d.costBasis}</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label={isBuy ? 'Add to portfolio' : 'Confirm sale'} onPress={isBuy ? actions.addHolding : actions.sellHolding} />
        {isBuy ? <SecondaryButton label="Upload positions file" onPress={actions.importCsv} /> : null}
      </View>
    </SheetShell>
  );
}

const styles = StyleSheet.create({
  modeRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: dividers.d4 },
  modeBtn: { flex: 1, paddingVertical: 11, paddingHorizontal: 12, alignItems: 'flex-start' },
  modeBtnBorder: { borderLeftWidth: 1, borderLeftColor: dividers.d25 },
  section: { paddingHorizontal: 20, paddingTop: 16 },
  sellChips: { marginTop: 9 },
  sellHint: { marginTop: 9 },
  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 14 },
  half: { width: '46%', flexGrow: 1 },
  full: { width: '100%' },
  sellAllLink: { marginTop: 6 },
  advLink: { marginTop: 14 },
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
