import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, dividers } from '../theme/tokens';
import { font } from '../theme/typography';

export function ColumnHeaderRow({ left, right }: { left: string; right: string }) {
  return (
    <View style={styles.row}>
      <Text style={font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.14, uppercase: true })}>{left}</Text>
      <Text style={font(600, 8.5, { color: colors.neutral600, letterSpacingEm: 0.14, uppercase: true })}>{right}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: dividers.d4,
  },
});
