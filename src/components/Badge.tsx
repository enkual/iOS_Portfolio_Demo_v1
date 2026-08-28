import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/tokens';
import { font } from '../theme/typography';

/** Small red count badge, used on the avatar, the Analysis bell, and the Analysis tab. */
export function CountBadge({ count, style }: { count: number; style?: object }) {
  if (count <= 0) return null;
  return (
    <View style={[styles.badge, style]}>
      <Text style={font(700, 9, { color: colors.white })}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
