import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, dividers } from '../theme/tokens';
import { font } from '../theme/typography';
import { Opt } from '../state/derive';

interface ChipRowProps<K extends string | number> {
  options: Opt<K>[];
  onSelect: (key: K) => void;
  size?: 'sm' | 'md';
}

/** Independently-bordered chip buttons with gaps between them (benchmark picker, mode-like pickers). */
export function ChipRow<K extends string | number>({ options, onSelect, size = 'md' }: ChipRowProps<K>) {
  return (
    <View style={styles.wrap}>
      {options.map((o) => (
        <Pressable
          key={String(o.key)}
          onPress={() => onSelect(o.key)}
          style={[styles.chip, { backgroundColor: o.active ? colors.ink : 'transparent' }]}
        >
          <Text style={font(600, size === 'sm' ? 9.5 : 10, { color: o.active ? colors.bg : colors.ink, letterSpacingEm: 0.04 })}>
            {o.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

interface SegmentedRowProps<K extends string | number> {
  options: Opt<K>[];
  onSelect: (key: K) => void;
  size?: 'sm' | 'md';
}

/** One bordered container, hairline separators between segments (period/window/sort/etc. controls). */
export function SegmentedRow<K extends string | number>({ options, onSelect, size = 'md' }: SegmentedRowProps<K>) {
  return (
    <View style={styles.segWrap}>
      {options.map((o, i) => (
        <Pressable
          key={String(o.key)}
          onPress={() => onSelect(o.key)}
          style={[
            styles.segBtn,
            i > 0 && styles.segBtnBorder,
            { backgroundColor: o.active ? colors.ink : 'transparent' },
          ]}
        >
          <Text style={font(600, size === 'sm' ? 9.5 : 10, { color: o.active ? colors.bg : colors.ink, letterSpacingEm: 0.06 })}>
            {o.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderWidth: 1.5, borderColor: colors.ink, paddingVertical: 6, paddingHorizontal: 9 },
  segWrap: { flexDirection: 'row', borderWidth: 1.5, borderColor: colors.ink, alignSelf: 'flex-start' },
  segBtn: { paddingVertical: 6, paddingHorizontal: 11 },
  segBtnBorder: { borderLeftWidth: 1, borderLeftColor: dividers.d4 },
});
