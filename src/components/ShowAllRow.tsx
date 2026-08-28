import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/tokens';
import { font } from '../theme/typography';

export function ShowAllRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={font(700, 11, { color: colors.accentDark, letterSpacingEm: 0.12, uppercase: true })}>{label}</Text>
      <Text style={font(700, 13, { color: colors.accentDark })}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingVertical: 14, paddingHorizontal: 20 },
});
