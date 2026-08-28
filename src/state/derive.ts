// The single "derive everything the UI needs" function, mirroring the source's
// Component.renderVals() section-for-section (see the comments referencing the
// .dc.html line ranges). Formulas are ported exactly; only the *shape* of the
// output differs from the source -- colors/styling are expressed as tones or
// enums here and resolved to hex by components, not baked in as bg/fg strings,
// except for the correlation matrix and dividend-treemap heat colors, which are
// themselves continuous, data-driven colors (the source computes them the same
// way) rather than a styling choice.

import { AppState, ClosedLot, DivSort, Holding, HoldingsSort } from './types';
import { MarketEngine } from './market';
import { mean, std, cov, corr } from './rng';
import { money, money2, pct, signed } from './format';
import { dualPath, mixColor, pathFor, yFor } from './chartMath';
import {
  BENCHMARKS,
  Bucket,
  HORIZONS,
  N,
  PERIODS,
  PERIOD_LONG,
  RF,
  SHORT,
  TD,
  bucketOf,
} from './constants';
import { Tone, toneOf } from '../theme/tokens';

// ---------------------------------------------------------------------------
// Small shared shapes
// ---------------------------------------------------------------------------

export interface Opt<K = string> {
  key: K;
  label: string;
  active: boolean;
}

function mkOpts<K extends string>(keys: K[], current: K, labelFor?: (k: K) => string): Opt<K>[] {
  return keys.map((k) => ({ key: k, label: labelFor ? labelFor(k) : k, active: k === current }));
}

function toneCompare(a: number, b: number): Tone {
  return a >= b ? 'pos' : 'neg';
}

export type AlertDot = 'red' | 'accentDark' | 'green';

export interface HoldingRow {
  sym: string;
  weightPct: number;
  weightLabel: string;
  barPct: number;
  lotLabel: string;
  valueLabel: string;
  plLabel: string;
  tone: Tone;
  plAbs: number;
}

export interface ClosedRow {
  idx: number; // index into state.closed, for delete/adjust actions
  sym: string;
  exitLabel: string;
  lotLabel: string;
  plLabel: string;
  plPctLabel: string;
  tone: Tone;
}

export interface CorrCell {
  value: string;
  bucket: Bucket;
}
export interface CorrRow {
  label: string;
  cells: CorrCell[];
}

export interface BetaRow {
  sym: string;
  weightLabel: string;
  betaLabel: string;
  contribLabel: string;
  contribTone: 'ink' | 'green';
}

export interface VarTile {
  label: string;
  value: string;
  tone: 'accentDark' | 'green';
}

export interface RollChart {
  title: string;
  explain: string;
  path: string;
  refY: number;
  current: string;
  tone: Tone;
  lo: string;
  hi: string;
  refLabel: string;
}

export interface DistRow {
  label: string;
  p: string;
  b: string;
  pTone: Tone;
}

export interface HistBar {
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface HistTick {
  x: number;
  label: string;
}

export interface TreemapTile {
  sym: string;
  sub: string;
  bg: string;
  fg: string;
  flex: number;
}
export interface TreemapRow {
  height: number;
  tiles: TreemapTile[];
}

export interface DivRow {
  sym: string;
  pays: boolean;
  weightLabel: string;
  dps: string;
  yieldLabel: string;
  incomeLabel: string;
  barPct: number;
}

export interface AlertNote {
  title: string;
  body: string;
  value: string;
  dot: AlertDot;
}

export interface InboxItem {
  subject: string;
  preview: string;
  when: string;
  tone: 'ink' | 'accentDark' | 'neutral';
  unread: boolean;
}

// ---------------------------------------------------------------------------
// Derived
// ---------------------------------------------------------------------------

export interface Derived {
  // -- nav / header --------------------------------------------------------
  alertCount: number;
  hasAlerts: boolean;
  notes: AlertNote[];
  unreadCount: number;
  hasUnread: boolean;
  inbox: InboxItem[];

  // -- hero / dashboard -----------------------------------------------------
  asOf: string;
  totalValue: string;
  dayChangeLabel: string;
  dayTone: Tone;
  totalPL: string;
  totalPLPct: string;
  plTone: Tone;
  unrealPL: string;
  unrealTone: Tone;
  realizedPL: string;
  realTone: Tone;
  realizedNote: string;
  spread: string;
  spreadTone: Tone;
  benchmark: string;
  benchShort: string;
  posterTone: 'up' | 'down' | 'neutral';
  heroTiles: { label: string; value: string; tone: Tone }[];
  bookTiles: { label: string; value: string; note: string; tone: Tone }[];

  // -- growth vs benchmark chart ---------------------------------------------
  benchOpts: Opt[];
  rangeOpts: Opt[];
  periodLabel: string;
  rangeLabel: string;
  portPath: string;
  benchPath: string;
  chartStart: string;
  chartEnd: string;
  portTotalRet: string;
  benchTotalRet: string;

  // -- holdings ---------------------------------------------------------------
  holdingCount: number;
  topRows: HoldingRow[];
  allRowsSorted: HoldingRow[];
  sortOpts: Opt<HoldingsSort>[];

  // -- closed positions ---------------------------------------------------------
  closedCount: number;
  closedRows: ClosedRow[];

  // -- analysis header / risk tiles --------------------------------------------
  windowOpts: Opt<number>[];
  horizonOpts: Opt[];
  riskTiles: { label: string; value: string; note: string; tone: Tone }[];
  weightedBeta: string;

  // -- return distribution ------------------------------------------------------
  distSigma: string;
  distSkew: string;
  histPort: HistBar[];
  histBench: HistBar[];
  normalPath: string;
  histTicks: HistTick[];
  zeroX: number;
  binOpts: Opt<number>[];
  distRows: DistRow[];

  // -- rolling charts -------------------------------------------------------------
  rollCharts: RollChart[];

  // -- correlation matrix -----------------------------------------------------------
  corrLabels: string[];
  corrRows: CorrRow[];
  corrGutter: number;
  corrCellH: number;
  corrCellFs: number;
  corrLabelFs: number;
  corrStats: { label: string; value: string }[];

  // -- beta by holding ----------------------------------------------------------------
  betaRows: BetaRow[];

  // -- VaR ----------------------------------------------------------------------------------
  varTiles: VarTile[];

  // -- dividends --------------------------------------------------------------------------------
  divTiles: { label: string; value: string; note: string; tone: 'ink' | 'accentDark' }[];
  sizeOpts: { key: 'Annual income' | 'Dividend yield'; label: string; active: boolean }[];
  sizeByLower: string;
  treemapRows: TreemapRow[];
  divCount: number;
  divIncomeTotal: string;
  divPayers: string;
  topYieldRows: DivRow[];
  divRowsSorted: DivRow[];
  divSortOpts: Opt<DivSort>[];

  // -- add/sell sheet -------------------------------------------------------------------------------
  sellOpts: Opt[];
  sellHint: string;
  basisTone: Tone;
  costBasis: string;
  sellRealized: number | null;

  // -- adjust sheet -----------------------------------------------------------------------------------
  adjSym: string;
  adjRealized: string;
  adjTone: Tone;
}

export function deriveAll(st: AppState, market: MarketEngine): Derived {
  const treatment = st.treatment || 'ledger';
  const hold = st.holdings;
  const bench = st.benchmark;
  const benchShort = SHORT[bench] || bench;
  const bs = market.benchSeries(bench);

  const ser = hold.map((h) => market.series(h));
  const values: number[] = [];
  for (let i = 0; i < N; i++) {
    let v = 0;
    for (let j = 0; j < hold.length; j++) v += hold[j].shares * ser[j].px[i];
    values.push(v);
  }
  const total = values[N - 1];
  const prev = values[N - 2];
  const dayAbs = total - prev;
  const dayPct = (dayAbs / prev) * 100;
  const basis = hold.reduce((a, h) => a + h.shares * h.cost, 0);
  const unreal = total - basis;
  const realized = st.closed.reduce((a, c) => a + c.shares * (c.exit - c.cost), 0);
  const closedBasis = st.closed.reduce((a, c) => a + c.shares * c.cost, 0);
  const pl = unreal + realized;
  const plPct = (pl / (basis + closedBasis)) * 100;

  const pret: number[] = [];
  for (let i = 1; i < N; i++) pret.push(values[i] / values[i - 1] - 1);
  const bret = bs.ret.slice(1);

  const rangeDays = PERIODS[st.range];
  const pr = pret.slice(pret.length - rangeDays);
  const br = bret.slice(bret.length - rangeDays);

  const pY = values[N - 1] / values[N - 1 - 252] - 1;
  const bY = bs.lvl[N - 1] / bs.lvl[N - 1 - 252] - 1;
  const spreadV = (pY - bY) * 100;

  const sharpeAll = ((mean(pr) - RF) / std(pr)) * Math.sqrt(TD);
  const betaAll = cov(pr, br) / cov(br, br);
  const alphaAll = (mean(pr) - RF - betaAll * (mean(br) - RF)) * TD * 100;

  const W = st.win;
  const rollS: number[] = [];
  const rollB: number[] = [];
  const rollA: number[] = [];
  for (let i = W; i <= pret.length; i++) {
    const p = pret.slice(i - W, i);
    const b = bret.slice(i - W, i);
    const sd = std(p);
    rollS.push(sd > 0 ? ((mean(p) - RF) / sd) * Math.sqrt(TD) : 0);
    const be = cov(p, b) / cov(b, b);
    rollB.push(be);
    rollA.push((mean(p) - RF - be * (mean(b) - RF)) * TD * 100);
  }

  const slice = values.slice(N - rangeDays);
  const bslice = bs.lvl.slice(N - rangeDays);
  const normP = slice.map((v) => (v / slice[0]) * 100);
  const normB = bslice.map((v) => (v / bslice[0]) * 100);
  const { pathA: portPath, pathB: benchPath } = dualPath(normP, normB, 362, 132, 6);

  const today = new Date('2026-08-28T00:00:00');
  const dateAt = (back: number) =>
    new Date(today.getTime() - back * 86400000 * 1.42).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

  // ---- holdings rows -------------------------------------------------
  const rowsRaw = hold.map((h, i) => {
    const v = h.shares * ser[i].px[N - 1];
    const c = h.shares * h.cost;
    const w = (v / total) * 100;
    const plAbs = v - c;
    return {
      sym: h.sym,
      w,
      plAbs,
      mv: v,
      weightPct: w,
      weightLabel: w.toFixed(1) + '%',
      barPct: Math.max(2, Math.min(100, w * 2.4)),
      lotLabel: h.shares + ' sh @ ' + money2(h.cost) + ' · ' + h.date,
      valueLabel: money(v),
      plLabel: signed(v - c) + ' · ' + pct(((v - c) / c) * 100, 1),
      tone: toneOf(plAbs),
    };
  });
  const byWeight = rowsRaw.slice().sort((a, b) => b.w - a.w);
  const sorted =
    st.sort === 'pl'
      ? rowsRaw.slice().sort((a, b) => b.plAbs - a.plAbs)
      : st.sort === 'az'
        ? rowsRaw.slice().sort((a, b) => a.sym.localeCompare(b.sym))
        : byWeight;

  // ---- correlation ---------------------------------------------------
  const n = hold.length;
  const gutter = n > 9 ? 22 : 28;
  const cellW = (362 - gutter) / n;
  const cret = ser.map((s) => s.ret.slice(s.ret.length - rangeDays));
  const tri: number[] = [];
  let wsum = 0;
  let wr = 0;
  const corrRows: CorrRow[] = hold.map((a, i) => ({
    label: a.sym,
    cells: hold.map((b, j) => {
      const c = i === j ? 1 : corr(cret[i], cret[j]);
      if (j > i) {
        tri.push(c);
        const ww = rowsRaw[i].w * rowsRaw[j].w;
        wsum += ww;
        wr += ww * c;
      }
      const k = bucketOf(c, i === j);
      return { value: c.toFixed(2).replace('0.', '.').replace('-', '−'), bucket: k };
    }),
  }));

  // ---- beta by holding -----------------------------------------------
  const betaRowsRaw = hold
    .map((h, i) => {
      const b = cov(cret[i], br) / cov(br, br);
      const w = rowsRaw[i].w / 100;
      return { sym: h.sym, w, b, contribV: w * b };
    })
    .sort((a, b) => b.contribV - a.contribV);
  const weightedBeta = betaRowsRaw.reduce((a, r) => a + r.contribV, 0);

  // ---- VaR ------------------------------------------------------------
  const hdays = HORIZONS[st.horizon];
  const sigP = std(pr) * Math.sqrt(hdays);
  const varP = 1.645 * sigP * total;
  const hRet: number[] = [];
  for (let i = hdays; i < pr.length; i++) {
    let s = 0;
    for (let k = i - hdays; k < i; k++) s += pr[k];
    hRet.push(s);
  }
  hRet.sort((a, b) => a - b);
  const q = hRet[Math.max(0, Math.floor(0.05 * hRet.length))];
  const hVar = -q * total;
  const tail = hRet.slice(0, Math.max(1, Math.floor(0.05 * hRet.length)));
  const es = -mean(tail) * total;
  const undivSigSum = hold.reduce((a, h, i) => a + (rowsRaw[i].w / 100) * std(cret[i]) * Math.sqrt(hdays), 0);
  const divBenefit = 1.645 * (undivSigSum - sigP) * total;

  // ---- dividends -------------------------------------------------------
  const divAll = hold
    .map((h, i) => {
      const px = ser[i].px[N - 1];
      const inc = (h.dps || 0) * h.shares;
      return { sym: h.sym, dps: h.dps || 0, y: px > 0 ? (h.dps || 0) / px : 0, inc, mv: rowsRaw[i].mv, pays: (h.dps || 0) > 0 };
    })
    .sort((a, b) => b.inc - a.inc);
  const totalIncome = divAll.reduce((a, d) => a + d.inc, 0);
  const payers = divAll.filter((d) => d.pays).length;
  const nonPayWeight = (divAll.filter((d) => !d.pays).reduce((a, d) => a + d.mv, 0) / total) * 100;
  const yields = divAll.filter((d) => d.pays).map((d) => d.y);
  const ylo = yields.length ? Math.min(...yields) : 0;
  const yhi = yields.length ? Math.max(...yields) : 1;
  const shade = (y: number) => {
    const f = yhi > ylo ? (y - ylo) / (yhi - ylo) : 0.5;
    return mixColor('#26540c', '#f8f4f4', (28 + f * 62) / 100);
  };
  const sizeVal = (d: (typeof divAll)[number]) => (st.sizeBy === 'Annual income' ? d.inc : d.y);
  const maxSize = Math.max(...divAll.map(sizeVal), 1e-9);
  const tiles = divAll.map((d) => {
    const raw = sizeVal(d);
    const v = d.pays ? Math.max(raw, 0.06 * maxSize) : 0.06 * maxSize;
    return {
      sym: d.sym,
      v,
      sub: st.sizeBy === 'Annual income' ? money(d.inc) : (d.y * 100).toFixed(2) + '%',
      bg: d.pays ? shade(d.y) : '#f7d9d3',
      fg: d.pays && (d.y - ylo) / ((yhi - ylo) || 1) > 0.5 ? '#f8f4f4' : d.pays ? '#1f3d2b' : '#7a2e24',
    };
  });
  const maxMv = Math.max(...divAll.map((d) => d.mv), 1e-9);
  const divRow = (d: (typeof divAll)[number]): DivRow => ({
    sym: d.sym,
    pays: d.pays,
    weightLabel: ((d.mv / total) * 100).toFixed(1) + '%',
    dps: d.pays ? d.dps.toFixed(2) : '—',
    yieldLabel: d.pays ? (d.y * 100).toFixed(2) + '%' : '—',
    incomeLabel: d.pays ? money(d.inc) : '—',
    barPct: Math.max(2, (d.mv / maxMv) * 100),
  });
  const divSorted =
    st.divSort === 'income'
      ? divAll.slice().sort((a, b) => b.inc - a.inc)
      : st.divSort === 'weight'
        ? divAll.slice().sort((a, b) => b.mv - a.mv)
        : st.divSort === 'az'
          ? divAll.slice().sort((a, b) => a.sym.localeCompare(b.sym))
          : divAll.slice().sort((a, b) => b.y - a.y);

  const treemapRows: TreemapRow[] = [];
  const perRow = tiles.length > 6 ? 3 : 2;
  const grand = tiles.reduce((a, t) => a + t.v, 0) || 1;
  for (let i = 0; i < tiles.length; i += perRow) {
    const group = tiles.slice(i, i + perRow);
    const share = group.reduce((a, t) => a + t.v, 0) / grand;
    treemapRows.push({
      height: Math.max(46, Math.round(share * 230)),
      tiles: group.map((t) => ({ sym: t.sym, sub: t.sub, bg: t.bg, fg: t.fg, flex: Math.max(0.6, t.v / (group[0].v || 1)) })),
    });
  }

  // ---- sell sheet preview ---------------------------------------------
  const sellIdx = hold.findIndex((h) => h.sym === st.sell.sym);
  const sellHold: Holding | null = sellIdx >= 0 ? hold[sellIdx] : null;
  const sellMark = sellHold ? ser[sellIdx].px[N - 1] : 0;
  const sqty = parseFloat(st.sell.shares);
  const spx = parseFloat(st.sell.price);
  const sellRealized = sellHold && sqty > 0 && spx > 0 ? sqty * (spx - sellHold.cost) : null;

  // ---- alerts -----------------------------------------------------------
  const annVol = std(pr) * Math.sqrt(TD) * 100;
  const maxPairR = tri.length ? Math.max(...tri) : 0;
  const topWeight = byWeight.length ? byWeight[0] : null;
  const dd = (() => {
    let peak = values[N - rangeDays];
    let worst = 0;
    for (let i = N - rangeDays; i < N; i++) {
      if (values[i] > peak) peak = values[i];
      worst = Math.min(worst, values[i] / peak - 1);
    }
    return worst * 100;
  })();

  const notes: AlertNote[] = [];
  if (annVol > 14)
    notes.push({
      title: 'Portfolio volatility is high',
      body: 'Annualised σ over ' + PERIOD_LONG[st.range] + ' sits above the 14% comfort band.',
      value: annVol.toFixed(1) + '%',
      dot: 'red',
    });
  if (maxPairR > 0.5)
    notes.push({
      title: 'Correlation between assets is high',
      body: tri.filter((x) => x > 0.5).length + ' of ' + tri.length + ' pairs above 0.50 — diversification is thinning.',
      value: maxPairR.toFixed(2),
      dot: 'red',
    });
  if (Math.abs(betaAll - 1) > 0.15)
    notes.push({
      title: betaAll > 1 ? 'Beta above the index' : 'Beta below the index',
      body: 'The book tracks ' + bench + ' at ' + betaAll.toFixed(2) + '× — sizing is off a market-neutral stance.',
      value: betaAll.toFixed(2),
      dot: betaAll > 1 ? 'accentDark' : 'green',
    });
  if (topWeight && topWeight.w > 20)
    notes.push({
      title: 'Concentration in ' + topWeight.sym,
      body: 'Single position carries more than a fifth of the book.',
      value: topWeight.weightLabel,
      dot: 'accentDark',
    });
  if (dd < -12)
    notes.push({
      title: 'Drawdown deepening',
      body: 'Peak-to-trough decline over ' + PERIOD_LONG[st.range] + ' has passed 12%.',
      value: dd.toFixed(1) + '%',
      dot: 'red',
    });
  if (sharpeAll < 0.5)
    notes.push({
      title: 'Sharpe below target',
      body: 'Risk-adjusted return is under the 1.00 bar most allocators use.',
      value: sharpeAll.toFixed(2),
      dot: 'accentDark',
    });

  const alertCount = notes.length;
  const inbox: InboxItem[] = [
    { subject: 'Dividend posted · JPM', preview: money(250) + ' credited to Growth', when: '2h', tone: 'ink', unread: true },
  ];
  if (alertCount > 0) inbox.push({ subject: 'Analysis alerts', preview: notes[0].title, when: '1d', tone: 'accentDark', unread: true });
  inbox.push({ subject: 'Statement ready', preview: 'August portfolio statement · PDF', when: '3d', tone: 'neutral', unread: false });

  // ---- return distribution --------------------------------------------
  const distStats = (s: number[]) => {
    const m = mean(s);
    const sd = std(s);
    const nn = s.length;
    let s3 = 0;
    let s4 = 0;
    for (const x of s) {
      const z = (x - m) / sd;
      s3 += z * z * z;
      s4 += z * z * z * z;
    }
    const srt = s.slice().sort((a, b) => a - b);
    const v95 = srt[Math.max(0, Math.floor(0.05 * nn))];
    const tl = srt.filter((x) => x <= v95);
    return {
      obs: nn,
      annRet: (Math.pow(1 + m, TD) - 1) * 100,
      annVol: sd * Math.sqrt(TD) * 100,
      skew: s3 / nn,
      exKurt: s4 / nn - 3,
      var95: v95 * 100,
      cvar95: (tl.length ? mean(tl) : v95) * 100,
      worst: srt[0] * 100,
      best: srt[nn - 1] * 100,
    };
  };
  const dP = distStats(pr);
  const dB = distStats(br);

  const BINS = st.bins;
  const allR = pr.concat(br);
  const rlo = Math.min(...allR);
  const rhi = Math.max(...allR);
  const bw = (rhi - rlo) / BINS;
  const histOf = (s: number[]) => {
    const c = new Array(BINS).fill(0);
    for (const x of s) c[Math.min(BINS - 1, Math.max(0, Math.floor((x - rlo) / bw)))]++;
    return c.map((v) => v / (s.length * bw));
  };
  const hP = histOf(pr);
  const hB = histOf(br);
  const dmax = Math.max(Math.max(...hP), Math.max(...hB)) || 1;
  const CW = 362 / BINS;
  const CH = 132;
  const bars = (h: number[]): HistBar[] =>
    h.map((d, i) => {
      const hh = (d / dmax) * (CH - 6);
      return { x: i * CW, w: Math.max(0.6, CW - 0.6), y: CH - hh, h: hh };
    });
  const xOf = (r: number) => ((r - rlo) / (rhi - rlo)) * 362;
  const mP = mean(pr);
  const sP = std(pr);
  let normalPath = '';
  for (let i = 0; i <= 80; i++) {
    const r = rlo + (i / 80) * (rhi - rlo);
    const d = Math.exp(-0.5 * Math.pow((r - mP) / sP, 2)) / (sP * Math.sqrt(2 * Math.PI));
    normalPath += (i ? 'L' : 'M') + xOf(r).toFixed(1) + ' ' + (CH - (d / dmax) * (CH - 6)).toFixed(1);
  }
  const tickVals = [-2, -1, 0, 1, 2].filter((t) => t / 100 >= rlo && t / 100 <= rhi);
  const histTicks: HistTick[] = tickVals.map((t) => ({ x: xOf(t / 100), label: (t > 0 ? '+' : '') + t + '%' }));

  const aS = parseFloat(st.adj.shares);
  const aC = parseFloat(st.adj.cost);
  const aE = parseFloat(st.adj.exit);
  const adjR = aS > 0 && aC > 0 && aE > 0 ? aS * (aE - aC) : null;

  const mk = (title: string, vals: number[], ref: number, refLabel: string, fmt: (v: number) => string, explain: string): RollChart => ({
    title,
    explain,
    refLabel,
    path: pathFor(vals, 362, 84, 6),
    refY: yFor(ref, vals.concat([ref]), 84, 6),
    current: fmt(vals[vals.length - 1]),
    tone: toneCompare(vals[vals.length - 1], ref),
    lo: fmt(Math.min(...vals)),
    hi: fmt(Math.max(...vals)),
  });

  return {
    alertCount,
    hasAlerts: alertCount > 0,
    notes,
    unreadCount: inbox.filter((m) => m.unread).length,
    hasUnread: inbox.some((m) => m.unread),
    inbox,

    asOf: 'Aug 28, 2026',
    totalValue: money(total + realized),
    dayChangeLabel: signed(dayAbs) + ' · ' + pct(dayPct),
    dayTone: toneOf(dayAbs),
    totalPL: signed(pl),
    totalPLPct: pct(plPct),
    plTone: toneOf(pl),
    unrealPL: signed(unreal),
    unrealTone: toneOf(unreal),
    realizedPL: signed(realized),
    realTone: toneOf(realized),
    realizedNote: 'incl. ' + signed(realized) + ' realised',
    spread: pct(spreadV),
    spreadTone: toneOf(spreadV),
    benchmark: bench,
    benchShort,
    posterTone: Math.abs(dayPct) < 0.05 ? 'neutral' : dayAbs > 0 ? 'up' : 'down',
    heroTiles: [
      { label: 'Day', value: pct(dayPct), tone: toneOf(dayPct) },
      { label: 'Total P/L', value: signed(pl), tone: toneOf(pl) },
      { label: 'vs ' + benchShort, value: pct(spreadV), tone: toneOf(spreadV) },
    ],
    bookTiles: [
      { label: 'Market value', value: money(total), note: 'open positions', tone: 'pos' },
      { label: 'Cost basis', value: money(basis), note: 'incl. commissions', tone: 'pos' },
      { label: 'Unrealised P&L', value: signed(unreal), note: pct((unreal / basis) * 100, 1), tone: toneOf(unreal) },
    ],

    benchOpts: [
      ...Object.keys(BENCHMARKS).map((k) => ({ key: k, label: k, active: k === bench })),
      ...(BENCHMARKS[bench] === undefined ? [{ key: bench, label: bench, active: true }] : []),
    ],
    rangeOpts: mkOpts(Object.keys(PERIODS), st.range),
    periodLabel: PERIOD_LONG[st.range],
    rangeLabel: 'indexed to 100 · ' + st.range,
    portPath,
    benchPath,
    chartStart: dateAt(rangeDays),
    chartEnd: 'Aug 27',
    portTotalRet: pct(normP[normP.length - 1] - 100, 1),
    benchTotalRet: pct(normB[normB.length - 1] - 100, 1),

    holdingCount: hold.length,
    topRows: byWeight.slice(0, 5),
    allRowsSorted: sorted,
    sortOpts: (
      [
        { key: 'weight', label: 'Weight' },
        { key: 'pl', label: 'P/L' },
        { key: 'az', label: 'A–Z' },
      ] as const
    ).map((o) => ({ ...o, active: o.key === st.sort })),

    closedCount: st.closed.length,
    closedRows: st.closed
      .map((c, i) => ({ c, i }))
      .reverse()
      .map(({ c, i }) => {
        const r = c.shares * (c.exit - c.cost);
        return {
          idx: i,
          sym: c.sym,
          exitLabel: c.exitDate,
          lotLabel: c.shares + ' sh · ' + money2(c.cost) + ' → ' + money2(c.exit),
          plLabel: signed(r),
          plPctLabel: pct(((c.exit - c.cost) / c.cost) * 100, 1),
          tone: toneOf(r),
        };
      }),

    windowOpts: [30, 60, 90].map((w) => ({ key: w, label: w + 'D', active: w === st.win })),
    horizonOpts: mkOpts(Object.keys(HORIZONS), st.horizon),
    riskTiles: [
      { label: 'Sharpe', value: sharpeAll.toFixed(2), note: 'annualised, ' + PERIOD_LONG[st.range], tone: toneOf(sharpeAll - 1) },
      { label: 'β vs ' + benchShort, value: betaAll.toFixed(2), note: betaAll > 1 ? 'amplifies the index' : 'dampens the index', tone: 'pos' },
      { label: "Jensen's α", value: pct(alphaAll, 1), note: 'annualised, CAPM excess', tone: toneOf(alphaAll) },
    ],
    weightedBeta: weightedBeta.toFixed(2),

    distSigma: dP.annVol.toFixed(1) + '%',
    distSkew: dP.skew.toFixed(2),
    histPort: bars(hP),
    histBench: bars(hB),
    normalPath,
    histTicks,
    zeroX: xOf(0),
    binOpts: [25, 45, 65].map((b) => ({ key: b, label: String(b), active: b === st.bins })),
    distRows: [
      { label: 'Observations', p: String(dP.obs), b: String(dB.obs), pTone: 'pos' },
      { label: 'Ann. return', p: pct(dP.annRet, 1), b: pct(dB.annRet, 1), pTone: toneOf(dP.annRet) },
      { label: 'Ann. volatility', p: dP.annVol.toFixed(1) + '%', b: dB.annVol.toFixed(1) + '%', pTone: 'pos' },
      { label: 'Skew', p: dP.skew.toFixed(2), b: dB.skew.toFixed(2), pTone: 'pos' },
      { label: 'Excess kurtosis', p: dP.exKurt.toFixed(2), b: dB.exKurt.toFixed(2), pTone: dP.exKurt > 1 ? 'neg' : 'pos' },
      { label: 'VaR 95% (1d)', p: dP.var95.toFixed(2) + '%', b: dB.var95.toFixed(2) + '%', pTone: 'neg' },
      { label: 'CVaR 95% (1d)', p: dP.cvar95.toFixed(2) + '%', b: dB.cvar95.toFixed(2) + '%', pTone: 'neg' },
      { label: 'Worst day', p: dP.worst.toFixed(2) + '%', b: dB.worst.toFixed(2) + '%', pTone: 'neg' },
      { label: 'Best day', p: '+' + dP.best.toFixed(2) + '%', b: '+' + dB.best.toFixed(2) + '%', pTone: 'pos' },
    ],

    rollCharts: [
      mk('Rolling Sharpe', rollS, 1, '1.00 target', (v) => v.toFixed(2), 'Annualised excess return per unit of volatility over a ' + W + '-day window.'),
      mk('Rolling Beta', rollB, 1, '1.00 = index', (v) => v.toFixed(2), 'Sensitivity of the book to ' + bench + ' on a ' + W + '-day rolling regression.'),
      mk("Rolling Jensen's Alpha", rollA, 0, '0.0% neutral', (v) => pct(v, 1), 'Return beyond what beta exposure to ' + bench + ' alone would have earned.'),
    ],

    corrLabels: hold.map((h) => h.sym),
    corrRows,
    corrGutter: gutter,
    corrCellH: Math.max(20, Math.min(30, cellW * 0.82)),
    corrCellFs: cellW >= 34 ? 8.5 : cellW >= 27 ? 7.5 : cellW >= 22 ? 6.8 : 6,
    corrLabelFs: cellW >= 30 ? 8.5 : cellW >= 24 ? 7.2 : 6.2,
    corrStats: [
      { label: 'Weighted avg r', value: (wsum ? wr / wsum : 0).toFixed(3) },
      { label: 'Simple avg r', value: (tri.length ? mean(tri) : 0).toFixed(3) },
      { label: 'Pairs above 0.50', value: tri.filter((x) => x > 0.5).length + ' / ' + tri.length },
    ],

    betaRows: betaRowsRaw.map((r) => ({
      sym: r.sym,
      weightLabel: (r.w * 100).toFixed(1) + '%',
      betaLabel: r.b.toFixed(2),
      contribLabel: r.contribV.toFixed(3),
      contribTone: r.contribV >= 0 ? 'ink' : 'green',
    })),

    varTiles: [
      { label: 'VaR 95% · ' + st.horizon, value: money(varP), tone: 'accentDark' },
      { label: 'Historical VaR', value: money(hVar), tone: 'accentDark' },
      { label: 'Expected shortfall', value: money(es), tone: 'accentDark' },
      { label: 'Diversification benefit', value: money(divBenefit), tone: 'green' },
    ],

    divTiles: [
      { label: 'Annual dividend income', value: money(totalIncome), note: 'trailing twelve months', tone: 'ink' },
      { label: 'Portfolio yield', value: (total ? (totalIncome / total) * 100 : 0).toFixed(2) + '%', note: 'income ÷ market value', tone: 'ink' },
      { label: 'Payers', value: payers + ' / ' + divAll.length, note: 'names paying a dividend', tone: 'ink' },
      { label: 'Non-paying weight', value: nonPayWeight.toFixed(1) + '%', note: 'share of book with no income', tone: nonPayWeight > 40 ? 'accentDark' : 'ink' },
    ],
    sizeOpts: (['Annual income', 'Dividend yield'] as const).map((k) => ({
      key: k,
      label: k === 'Annual income' ? 'Income' : 'Yield',
      active: k === st.sizeBy,
    })),
    sizeByLower: st.sizeBy.toLowerCase(),
    treemapRows,
    divCount: divAll.length,
    divIncomeTotal: money(totalIncome),
    divPayers: payers + ' / ' + divAll.length,
    topYieldRows: divAll
      .slice()
      .sort((a, b) => b.y - a.y)
      .slice(0, 5)
      .map(divRow),
    divRowsSorted: divSorted.map(divRow),
    divSortOpts: (
      [
        { key: 'yield', label: 'Yield' },
        { key: 'income', label: 'Income' },
        { key: 'weight', label: 'Weight' },
        { key: 'az', label: 'A–Z' },
      ] as const
    ).map((o) => ({ ...o, active: o.key === st.divSort })),

    sellOpts: hold.map((h) => ({ key: h.sym, label: h.sym, active: h.sym === st.sell.sym })),
    sellHint: sellHold
      ? sellHold.shares + ' sh held @ ' + money2(sellHold.cost) + ' cost · mark ' + money2(sellMark)
      : 'Select a ticker above.',
    basisTone: st.mode === 'buy' ? 'pos' : toneOf(sellRealized === null ? 0 : sellRealized),
    costBasis:
      st.mode === 'sell'
        ? sellRealized === null
          ? '—'
          : signed(sellRealized)
        : parseFloat(st.f.shares) > 0 && parseFloat(st.f.price) > 0
          ? money2(parseFloat(st.f.shares) * parseFloat(st.f.price) + (parseFloat(st.f.fee) || 0))
          : '—',
    sellRealized,

    adjSym: st.adjustIdx !== null && st.closed[st.adjustIdx] ? st.closed[st.adjustIdx].sym : '',
    adjRealized: adjR === null ? '—' : signed(adjR),
    adjTone: toneOf(adjR === null ? 0 : adjR),
  };
}
