// Modernist design-system tokens, ported from
// project/_ds/modernist-2a768dbb-d642-4c8d-a79c-5829b8b2ede8/styles.css
// and the literal inline-style values used throughout Portfolio Manager.dc.html.
//
// Border radius is 0 everywhere in the system except where the source HTML
// explicitly overrides it (pills, circular buttons, tab bar) -- those exact
// px values are reproduced at their call sites rather than as a token here.

export const colors = {
  bg: '#f3f2f2',
  surface: '#eae9e9',
  ink: '#201e1d',
  accent: '#ec3013', // primary red
  accentDark: '#ae1800', // "red-700" -- links, negative tone, ghost actions
  accent2: '#e15b47',

  // Two distinct greens appear in the source -- they are NOT the same token.
  posterGreen: '#26540c', // poster hero bg on an up day, beta-negative-contribution, dividend bars/treemap
  chartGreen: '#0F6A0D', // rolling-chart lines, histogram portfolio bars, "distribution stats" toggle label

  neutral100: '#f8f4f4',
  neutral200: '#eae7e7',
  neutral300: '#d7d3d3',
  neutral400: '#bab6b6',
  neutral500: '#9b9797',
  neutral600: '#7d7979',
  neutral700: '#605d5d',
  neutral800: '#444141',
  neutral900: '#2d2b2b',

  // Correlation-matrix buckets (hedge <= -0.20, low < 0.20, moderate < 0.50, high >= 0.50)
  bucketSelfBg: '#d9d9d9',
  bucketSelfFg: '#605d5d',
  bucketHedgeBg: '#1c4a06',
  bucketHedgeFg: '#f8f4f4',
  bucketLowBg: '#cfe0c2',
  bucketLowFg: '#201e1d',
  bucketModBg: '#ff9783',
  bucketModFg: '#201e1d',
  bucketHighBg: '#ec3013',
  bucketHighFg: '#f8f4f4',

  // Dividends non-payer treatment
  nonPayerBg: '#f7d9d3',
  nonPayerText: '#7a2e24',
  nonPayerBar: '#e0b3aa',

  // Tab bar (floating, dark)
  tabBarBg: '#201e1d',
  tabActiveBg: '#3a3635',
  tabHoverBg: '#403c3b',
  tabInactiveFg: '#9b9797',

  white: '#ffffff',
} as const;

/** Divider / hairline colors -- rgba(32,30,29, alpha) at the alphas the source uses repeatedly. */
export const dividers = {
  d18: 'rgba(32,30,29,0.18)',
  d25: 'rgba(32,30,29,0.25)',
  d4: 'rgba(32,30,29,0.4)',
  d45: 'rgba(32,30,29,0.45)',
  d55: 'rgba(32,30,29,0.55)',
};

/** Semantic "tone" -- the source's tone() helper: ink for >=0, accentDark (red-700) for negative.
 * Deliberately NOT bright green for gains -- that is a design choice from the handoff. */
export type Tone = 'pos' | 'neg';
export function toneOf(x: number): Tone {
  return x >= 0 ? 'pos' : 'neg';
}
export function toneColor(t: Tone): string {
  return t === 'pos' ? colors.ink : colors.accentDark;
}

export const radius = {
  none: 0,
  pill: 40, // + Add lot button
  circle: 35, // avatar / bell buttons
  tabBar: 35, // floating tab bar container (per final "corners rounded" iteration)
  tabBlock: 25, // active tab block
};

export const spacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s6: 24,
  s8: 32,
};

/** Inner content width used by every fixed-width SVG in the source (402px phone - 20px*2 padding). */
export const CONTENT_WIDTH = 362;
