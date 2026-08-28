import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, radius } from '../theme/tokens';
import { font } from '../theme/typography';

interface BaseProps {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Filled accent-red pill, e.g. "+ Add lot". */
export function PillButton({ label, onPress, style }: BaseProps) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, style]}>
      <Text style={font(700, 10, { color: colors.white, letterSpacingEm: 0.08, uppercase: true })}>{label}</Text>
    </Pressable>
  );
}

/** Full-width filled primary action inside sheets ("Add to portfolio", "Confirm sale", "Save changes"). */
export function PrimaryButton({ label, onPress, style }: BaseProps) {
  return (
    <Pressable onPress={onPress} style={[styles.primary, style]}>
      <Text style={font(700, 12, { color: colors.white, letterSpacingEm: 0.1, uppercase: true })}>{label}</Text>
    </Pressable>
  );
}

/** Full-width outlined secondary action ("Upload positions file", "Delete this lot"). */
export function SecondaryButton({ label, onPress, style }: BaseProps) {
  return (
    <Pressable onPress={onPress} style={[styles.secondary, style]}>
      <Text style={font(600, 11, { color: colors.ink, letterSpacingEm: 0.1, uppercase: true })}>{label}</Text>
    </Pressable>
  );
}

/** Small outlined rect button (e.g. "Sell" on a holding row, "Close" on sheet header). */
export function OutlineButton({ label, onPress, style, textColor }: BaseProps & { textColor?: string }) {
  return (
    <Pressable onPress={onPress} style={[styles.outline, style]}>
      <Text style={font(600, 9, { color: textColor || colors.ink, letterSpacingEm: 0.1, uppercase: true })}>{label}</Text>
    </Pressable>
  );
}

/** Text-only accent link ("Show all N holdings", "+ Advanced"). */
export function GhostLink({ label, onPress, style }: BaseProps) {
  return (
    <Pressable onPress={onPress} style={style}>
      <Text style={font(600, 10, { color: colors.accentDark, letterSpacingEm: 0.1, uppercase: true })}>{label}</Text>
    </Pressable>
  );
}

/** Circular icon-only button (avatar, notification bell). Icon is a render-prop so it can be
 * tinted to match the active/inactive state -- RN SVG has no `currentColor`. */
export function CircleIconButton({
  onPress,
  active,
  children,
  style,
}: {
  onPress: () => void;
  active: boolean;
  children: (color: string) => React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.circle, { backgroundColor: active ? colors.ink : 'transparent' }, style]}>
      {children(active ? colors.bg : colors.ink)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  secondary: {
    borderWidth: 2,
    borderColor: colors.ink,
    backgroundColor: 'transparent',
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: 'rgba(32,30,29,0.5)',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: radius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
