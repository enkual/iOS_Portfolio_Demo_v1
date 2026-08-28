import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/tokens';
import { font } from '../theme/typography';

/** "HOLDINGS ................ Top 5 of 8" style section header used throughout. */
export function SectionHeader({ title, meta, subtitle }: { title: string; meta?: string; subtitle?: string }) {
  return (
    <View>
      <View style={styles.row}>
        <Text style={font(800, 13, { color: colors.ink, letterSpacingEm: 0.02, uppercase: true })}>{title}</Text>
        {meta ? <Text style={font(600, 10, { color: colors.neutral600 })}>{meta}</Text> : null}
      </View>
      {subtitle ? <Text style={[font(500, 10.5, { color: colors.neutral700, lineHeight: 1.4 }), styles.subtitle]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  subtitle: { marginTop: 5, maxWidth: 330 },
});
