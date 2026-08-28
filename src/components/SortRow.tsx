import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, dividers } from '../theme/tokens';
import { font } from '../theme/typography';
import { SegmentedRow } from './Chip';
import { Opt } from '../state/derive';

export function SortRow<K extends string>({ options, onSelect }: { options: Opt<K>[]; onSelect: (k: K) => void }) {
  return (
    <View style={styles.row}>
      <Text style={font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.14, uppercase: true })}>Sort</Text>
      <SegmentedRow options={options} onSelect={onSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: dividers.d4,
  },
});
