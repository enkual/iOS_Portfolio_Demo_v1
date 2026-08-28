import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../theme/tokens';
import { font } from '../theme/typography';

interface Props {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'characters';
  half?: boolean;
  small?: boolean;
}

/** Underlined labeled input, matching the source's field pattern used throughout the sheets. */
export function Field({ label, value, onChangeText, placeholder, keyboardType, autoCapitalize, half, small }: Props) {
  return (
    <View style={half ? styles.half : styles.full}>
      <Text style={font(600, 9, { color: colors.neutral600, letterSpacingEm: 0.14, uppercase: true })}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral500}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[
          font(600, small ? 14 : 16, { color: colors.ink }),
          small ? styles.inputSmall : styles.input,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  full: { width: '100%' },
  half: { width: '48%' },
  input: { marginTop: 6, borderBottomWidth: 2, borderBottomColor: colors.ink, paddingVertical: 8 },
  inputSmall: { marginTop: 6, borderBottomWidth: 1.5, borderBottomColor: 'rgba(32,30,29,0.4)', paddingVertical: 7 },
});
