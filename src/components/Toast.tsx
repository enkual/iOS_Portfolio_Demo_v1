import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/tokens';
import { font } from '../theme/typography';

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <View style={styles.wrap} pointerEvents="none">
      <Text style={font(600, 11, { color: colors.bg, lineHeight: 1.3, letterSpacingEm: 0.02 })}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 96,
    backgroundColor: colors.ink,
    paddingVertical: 12,
    paddingHorizontal: 14,
    zIndex: 80,
  },
});
