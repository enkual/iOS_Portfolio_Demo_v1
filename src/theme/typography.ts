import { TextStyle } from 'react-native';

/** Archivo weights loaded via @expo-google-fonts/archivo -- see App.tsx useFonts call. */
export const FONT_FAMILY: Record<400 | 500 | 600 | 700 | 800 | 900, string> = {
  400: 'Archivo_400Regular',
  500: 'Archivo_500Medium',
  600: 'Archivo_600SemiBold',
  700: 'Archivo_700Bold',
  800: 'Archivo_800ExtraBold',
  900: 'Archivo_900Black',
};

type Weight = keyof typeof FONT_FAMILY;

interface FontOpts {
  color?: string;
  lineHeight?: number;
  /** letter-spacing expressed in em, converted to RN's absolute px. */
  letterSpacingEm?: number;
  uppercase?: boolean;
  align?: TextStyle['textAlign'];
}

/** Mirrors the source's inline `font: <weight> <size>px/<lh> 'Archivo'; letter-spacing: <x>em` shorthand. */
export function font(weight: Weight, size: number, opts: FontOpts = {}): TextStyle {
  const style: TextStyle = {
    fontFamily: FONT_FAMILY[weight],
    fontSize: size,
  };
  if (opts.lineHeight !== undefined) style.lineHeight = opts.lineHeight * size;
  if (opts.letterSpacingEm !== undefined) style.letterSpacing = opts.letterSpacingEm * size;
  if (opts.color !== undefined) style.color = opts.color;
  if (opts.uppercase) style.textTransform = 'uppercase';
  if (opts.align) style.textAlign = opts.align;
  return style;
}

/** RN's equivalent of font-variant-numeric: tabular-nums. Applied wherever the source used it
 * for money/percent columns so digits don't jitter in width. */
export const tabularNums: TextStyle = { fontVariant: ['tabular-nums'] };
