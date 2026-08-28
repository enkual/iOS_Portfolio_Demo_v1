import { colors, Tone, toneColor } from './tokens';
import { AlertDot } from '../state/derive';
import { Bucket } from '../state/constants';

export { toneColor };
export type { Tone };

export function alertDotColor(d: AlertDot): string {
  if (d === 'red') return colors.accent;
  if (d === 'accentDark') return colors.accentDark;
  return colors.posterGreen;
}

export const bucketColors: Record<Bucket, { bg: string; fg: string }> = {
  self: { bg: colors.bucketSelfBg, fg: colors.bucketSelfFg },
  hedge: { bg: colors.bucketHedgeBg, fg: colors.bucketHedgeFg },
  low: { bg: colors.bucketLowBg, fg: colors.bucketLowFg },
  mod: { bg: colors.bucketModBg, fg: colors.bucketModFg },
  high: { bg: colors.bucketHighBg, fg: colors.bucketHighFg },
};

export function varTileColor(t: 'accentDark' | 'green'): string {
  return t === 'accentDark' ? colors.accentDark : colors.posterGreen;
}

export function betaContribColor(t: 'ink' | 'green'): string {
  return t === 'ink' ? colors.ink : colors.posterGreen;
}

export function divTileColor(t: 'ink' | 'accentDark'): string {
  return t === 'ink' ? colors.ink : colors.accentDark;
}

export function inboxColor(t: 'ink' | 'accentDark' | 'neutral'): string {
  if (t === 'ink') return colors.ink;
  if (t === 'accentDark') return colors.accentDark;
  return colors.neutral700;
}
