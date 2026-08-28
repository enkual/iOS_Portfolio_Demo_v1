// Deterministic RNG + statistics helpers, ported byte-for-byte from the .dc.html
// so simulated series are stable and reproducible between runs.

/** mulberry32-style PRNG. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box-Muller gaussian sample from a [0,1) uniform generator. */
export function gauss(r: () => number): number {
  const u = 1 - r();
  const v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** FNV-1a-style string hash, used to derive a per-symbol seed and synthetic factor loadings. */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mean(a: number[]): number {
  let s = 0;
  for (const x of a) s += x;
  return s / a.length;
}

export function std(a: number[]): number {
  const m = mean(a);
  let s = 0;
  for (const x of a) s += (x - m) * (x - m);
  return Math.sqrt(s / (a.length - 1));
}

export function cov(a: number[], b: number[]): number {
  const ma = mean(a);
  const mb = mean(b);
  let s = 0;
  for (let i = 0; i < a.length; i++) s += (a[i] - ma) * (b[i] - mb);
  return s / (a.length - 1);
}

export function corr(a: number[], b: number[]): number {
  return cov(a, b) / (std(a) * std(b));
}
