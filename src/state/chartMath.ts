// SVG path/coordinate math, ported from the .dc.html's path()/yFor()/combo() helpers.
// These produce plain data (path strings, pixel coordinates) consumed by the
// react-native-svg chart components -- not styling.

export function pathFor(vals: number[], w: number, h: number, pad: number): string {
  if (!vals.length) return '';
  let lo = Math.min(...vals);
  let hi = Math.max(...vals);
  if (hi - lo < 1e-9) {
    hi += 1;
    lo -= 1;
  }
  const n = vals.length;
  const sx = w / (n - 1);
  const sh = h - pad * 2;
  let d = '';
  for (let i = 0; i < n; i++) {
    d += (i ? 'L' : 'M') + (i * sx).toFixed(1) + ' ' + (pad + (1 - (vals[i] - lo) / (hi - lo)) * sh).toFixed(1);
  }
  return d;
}

export function yFor(v: number, vals: number[], h: number, pad: number): number {
  let lo = Math.min(...vals);
  let hi = Math.max(...vals);
  if (hi - lo < 1e-9) {
    hi += 1;
    lo -= 1;
  }
  return pad + (1 - (v - lo) / (hi - lo)) * (h - pad * 2);
}

/** Two series indexed to a shared min/max so they share one y-scale -- mirrors combo(). */
export function dualPath(a: number[], b: number[], w: number, h: number, pad: number): { pathA: string; pathB: string } {
  const both = a.concat(b);
  const lo = Math.min(...both);
  const hi = Math.max(...both);
  const scale = (arr: number[]) => {
    let d = '';
    const n = arr.length;
    const sx = w / (n - 1);
    const sh = h - pad * 2;
    for (let i = 0; i < n; i++) {
      d += (i ? 'L' : 'M') + (i * sx).toFixed(1) + ' ' + (pad + (1 - (arr[i] - lo) / (hi - lo)) * sh).toFixed(1);
    }
    return d;
  };
  return { pathA: scale(a), pathB: scale(b) };
}

/** Linear interpolation between two hex colors, approximating CSS color-mix(in srgb, ...). */
export function mixColor(hexA: string, hexB: string, fracA: number): string {
  const pa = parseHex(hexA);
  const pb = parseHex(hexB);
  const f = Math.max(0, Math.min(1, fracA));
  const r = Math.round(pa.r * f + pb.r * (1 - f));
  const g = Math.round(pa.g * f + pb.g * (1 - f));
  const b = Math.round(pa.b * f + pb.b * (1 - f));
  return `rgb(${r}, ${g}, ${b})`;
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}
