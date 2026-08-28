import { N } from './constants';
import { gauss, hash, rng } from './rng';
import { BENCHMARKS } from './constants';
import { Holding } from './types';

export interface Series {
  ret: number[];
  px: number[];
}

export interface BenchSeries {
  ret: number[];
  lvl: number[];
}

/**
 * Deterministic mock-market engine, ported byte-for-byte from the .dc.html's
 * market()/series()/benchSeries() so simulated data is stable and reproducible.
 * Caches per-holding series the same way the source cached them on `this`.
 */
export class MarketEngine {
  private mkt: number[] | null = null;
  private cache = new Map<string, Series>();

  market(): number[] {
    if (this.mkt) return this.mkt;
    const r = rng(20260828);
    const m: number[] = [];
    for (let i = 0; i < N; i++) m.push(0.00042 + 0.0082 * gauss(r));
    this.mkt = m;
    return m;
  }

  series(h: Holding): Series {
    const key = h.sym + h.beta + h.vol + h.drift;
    const cached = this.cache.get(key);
    if (cached) return cached;
    const m = this.market();
    const r = rng(hash(h.sym));
    const ret: number[] = [];
    const px: number[] = [];
    let p = h.cost;
    for (let i = 0; i < N; i++) {
      const x = h.drift + h.beta * m[i] + h.vol * gauss(r);
      ret.push(x);
      p *= 1 + x;
      px.push(p);
    }
    const out: Series = { ret, px };
    this.cache.set(key, out);
    return out;
  }

  benchSeries(sym: string): BenchSeries {
    const k = BENCHMARKS[sym] !== undefined ? BENCHMARKS[sym] : 0.95 + (hash(sym) % 60) / 100;
    const m = this.market();
    const r = rng(hash('b' + sym));
    const ret: number[] = [];
    const lvl: number[] = [];
    let p = 100;
    for (let i = 0; i < N; i++) {
      const x = k * m[i] + 0.0022 * gauss(r);
      ret.push(x);
      p *= 1 + x;
      lvl.push(p);
    }
    return { ret, lvl };
  }
}
