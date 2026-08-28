import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '../theme/tokens';
import { font } from '../theme/typography';

export function FooterNote({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[styles.wrap, style]}>
      <Text style={font(500, 9.5, { color: colors.neutral500, lineHeight: 1.5 })}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 26 },
});
