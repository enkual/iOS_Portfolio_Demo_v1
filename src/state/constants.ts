import { Holding, ClosedLot } from './types';

// Ported byte-for-byte from the .dc.html Component logic so mock data stays
// stable/reproducible between the prototype and this app.
export const N = 504;
export const RF = 0.042 / 252;
export const TD = 252;

export const SEED_HOLDINGS: Holding[] = [
  { sym: 'NVDA', shares: 40, cost: 118.2, date: '2024-06-14', beta: 1.72, vol: 0.03, drift: 0.0018, dps: 0.04 },
  { sym: 'AAPL', shares: 60, cost: 189.4, date: '2023-11-02', beta: 1.08, vol: 0.013, drift: 0.0006, dps: 1.04 },
  { sym: 'MSFT', shares: 35, cost: 372.1, date: '2024-01-18', beta: 0.96, vol: 0.012, drift: 0.0007, dps: 3.32 },
  { sym: 'JPM', shares: 50, cost: 168.75, date: '2024-03-05', beta: 1.04, vol: 0.011, drift: 0.0006, dps: 5.0 },
  { sym: 'COST', shares: 12, cost: 712.3, date: '2024-05-21', beta: 0.71, vol: 0.01, drift: 0.0007, dps: 4.64 },
  { sym: 'XOM', shares: 90, cost: 104.6, date: '2023-09-12', beta: 0.62, vol: 0.012, drift: 0.0002, dps: 3.96 },
  { sym: 'UNH', shares: 20, cost: 512.0, date: '2024-02-08', beta: 0.54, vol: 0.014, drift: -0.0003, dps: 8.4 },
  { sym: 'TLT', shares: 150, cost: 92.4, date: '2024-04-30', beta: -0.22, vol: 0.007, drift: -0.0001, dps: 3.72 },
];

export const CLOSED_SEED: ClosedLot[] = [
  { sym: 'SMCI', shares: 25, cost: 41.8, exit: 63.55, date: '2024-08-09', exitDate: '2025-02-14' },
  { sym: 'PYPL', shares: 70, cost: 74.1, exit: 61.2, date: '2024-01-22', exitDate: '2025-06-03' },
  { sym: 'LLY', shares: 8, cost: 604.0, exit: 812.4, date: '2023-10-16', exitDate: '2026-01-28' },
];

export const BENCHMARKS: Record<string, number> = { 'S&P 500': 1.0, 'Russell 2000': 1.14, 'Nasdaq 100': 1.26 };
export const SHORT: Record<string, string> = { 'S&P 500': 'SPX', 'Russell 2000': 'RUT', 'Nasdaq 100': 'NDX' };
export const PERIODS: Record<string, number> = { '3M': 63, '6M': 126, '1Y': 252, '2Y': 503 };
export const PERIOD_LONG: Record<string, string> = { '3M': '3 months', '6M': '6 months', '1Y': '1 year', '2Y': '2 years' };
export const HORIZONS: Record<string, number> = { '1d': 1, '5d': 5, '10d': 10, '21d': 21 };

export type Bucket = 'self' | 'hedge' | 'low' | 'mod' | 'high';

/** Bucket thresholds mirror the Streamlit app's correlation legend. */
export function bucketOf(r: number, diag: boolean): Bucket {
  if (diag) return 'self';
  if (r <= -0.2) return 'hedge';
  if (r < 0.2) return 'low';
  if (r < 0.5) return 'mod';
  return 'high';
}

export const TODAY_ISO = '2026-08-28';
