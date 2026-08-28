import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { AppState, DivSort, HoldingsSort, Mode, Page, SizeBy, Tab, Treatment } from './types';
import { CLOSED_SEED, SEED_HOLDINGS, TODAY_ISO } from './constants';
import { MarketEngine } from './market';
import { deriveAll, Derived } from './derive';
import { money2, signed } from './format';
import { hash } from './rng';

const initialState: AppState = {
  holdings: SEED_HOLDINGS,
  closed: CLOSED_SEED,

  benchmark: 'S&P 500',
  customBench: '',
  range: '1Y',
  win: 60,
  horizon: '1d',
  bins: 45,
  showNormal: false,
  distOpen: false,

  sizeBy: 'Annual income',
  divSort: 'yield',

  tab: 'portfolio',
  page: 'main',

  accountOpen: false,
  notesOpen: false,

  adjustIdx: null,
  adj: { shares: '', cost: '', exit: '', date: '' },

  sort: 'weight',
  treatment: 'ledger',

  sheetOpen: false,
  advOpen: false,
  toast: null,
  mode: 'buy',

  sell: { sym: 'NVDA', shares: '', price: '', date: TODAY_ISO },
  f: { ticker: '', shares: '', price: '', date: TODAY_ISO, fee: '', account: 'Growth', note: '' },
};

export interface Actions {
  goTab: (t: Tab) => void;
  goHoldings: () => void;
  goPortfolio: () => void;
  goDivAll: () => void;
  goDividends: () => void;
  setPage: (p: Page) => void;

  toggleAccount: () => void;
  toggleNotes: () => void;
  openMailbox: () => void;
  openSettings: () => void;

  setBenchmark: (k: string) => void;
  setCustomBench: (v: string) => void;
  applyCustomBench: () => void;
  setRange: (k: string) => void;
  setWindow: (w: number) => void;
  setHorizon: (k: string) => void;
  setBins: (b: number) => void;
  toggleNormal: () => void;
  toggleDist: () => void;
  setSort: (k: HoldingsSort) => void;
  setSizeBy: (k: SizeBy) => void;
  setDivSort: (k: DivSort) => void;
  setTreatment: (t: Treatment) => void;

  openSheet: () => void;
  closeSheet: () => void;
  toggleAdv: () => void;
  openImport: () => void;
  importCsv: () => void;
  setMode: (m: Mode) => void;

  openSellFor: (sym: string) => void;
  setSellSym: (sym: string) => void;
  setSellShares: (v: string) => void;
  setSellPrice: (v: string) => void;
  setSellDate: (v: string) => void;
  sellAll: () => void;
  sellHolding: () => void;

  setTicker: (v: string) => void;
  setShares: (v: string) => void;
  setPrice: (v: string) => void;
  setDate: (v: string) => void;
  setFee: (v: string) => void;
  setAccount: (v: string) => void;
  setNote: (v: string) => void;
  addHolding: () => void;

  deleteClosed: (idx: number) => void;
  openAdjust: (idx: number) => void;
  closeAdjust: () => void;
  setAdjShares: (v: string) => void;
  setAdjCost: (v: string) => void;
  setAdjExit: (v: string) => void;
  setAdjDate: (v: string) => void;
  saveAdjust: () => void;
  deleteAdjust: () => void;
}

interface StoreValue {
  state: AppState;
  derived: Derived;
  actions: Actions;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const marketRef = useRef<MarketEngine | null>(null);
  if (!marketRef.current) marketRef.current = new MarketEngine();
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback((msg: string) => {
    setState((s) => ({ ...s, toast: msg }));
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setState((s) => ({ ...s, toast: null })), 2400);
  }, []);

  const patch = useCallback((p: Partial<AppState>) => setState((s) => ({ ...s, ...p })), []);
  const patchF = useCallback((p: Partial<AppState['f']>) => setState((s) => ({ ...s, f: { ...s.f, ...p } })), []);
  const patchSell = useCallback((p: Partial<AppState['sell']>) => setState((s) => ({ ...s, sell: { ...s.sell, ...p } })), []);
  const patchAdj = useCallback((p: Partial<AppState['adj']>) => setState((s) => ({ ...s, adj: { ...s.adj, ...p } })), []);

  const actions: Actions = useMemo(
    () => ({
      goTab: (t) => patch({ tab: t, page: 'main' }),
      goHoldings: () => patch({ page: 'holdings' }),
      goPortfolio: () => patch({ page: 'main' }),
      goDivAll: () => patch({ page: 'all' }),
      goDividends: () => patch({ page: 'main' }),
      setPage: (p) => patch({ page: p }),

      toggleAccount: () => setState((s) => ({ ...s, accountOpen: !s.accountOpen })),
      toggleNotes: () => setState((s) => ({ ...s, notesOpen: !s.notesOpen })),
      openMailbox: () => flash('Mailbox opened.'),
      openSettings: () => flash('Account settings opened.'),

      setBenchmark: (k) => patch({ benchmark: k }),
      setCustomBench: (v) => patch({ customBench: v.toUpperCase() }),
      applyCustomBench: () =>
        setState((s) => {
          const t = s.customBench.trim().toUpperCase();
          if (!t) {
            flash('Type a benchmark ticker first.');
            return s;
          }
          flash('Benchmark set to ' + t + ' — pulled from Yahoo Finance.');
          return { ...s, benchmark: t, customBench: '' };
        }),
      setRange: (k) => patch({ range: k }),
      setWindow: (w) => patch({ win: w }),
      setHorizon: (k) => patch({ horizon: k }),
      setBins: (b) => patch({ bins: b }),
      toggleNormal: () => setState((s) => ({ ...s, showNormal: !s.showNormal })),
      toggleDist: () => setState((s) => ({ ...s, distOpen: !s.distOpen })),
      setSort: (k) => patch({ sort: k }),
      setSizeBy: (k) => patch({ sizeBy: k }),
      setDivSort: (k) => patch({ divSort: k }),
      setTreatment: (t) => patch({ treatment: t }),

      openSheet: () => patch({ sheetOpen: true, mode: 'buy' }),
      closeSheet: () => patch({ sheetOpen: false }),
      toggleAdv: () => setState((s) => ({ ...s, advOpen: !s.advOpen })),
      openImport: () => patch({ sheetOpen: true, mode: 'buy', advOpen: false }),
      importCsv: () => flash('Positions file parsed — 3 lots staged for review.'),
      setMode: (m) => patch({ mode: m }),

      openSellFor: (sym) =>
        setState((s) => {
          const h = s.holdings.find((x) => x.sym === sym);
          const mark = h ? marketRef.current!.series(h).px[marketRef.current!.series(h).px.length - 1] : 0;
          return { ...s, sheetOpen: true, mode: 'sell', advOpen: false, sell: { sym, shares: '', price: mark.toFixed(2), date: s.sell.date } };
        }),
      setSellSym: (sym) => patchSell({ sym }),
      setSellShares: (v) => patchSell({ shares: v }),
      setSellPrice: (v) => patchSell({ price: v }),
      setSellDate: (v) => patchSell({ date: v }),
      sellAll: () =>
        setState((s) => {
          const h = s.holdings.find((x) => x.sym === s.sell.sym);
          if (!h) {
            flash('Select a ticker first.');
            return s;
          }
          const mark = marketRef.current!.series(h).px[marketRef.current!.series(h).px.length - 1];
          return { ...s, sell: { ...s.sell, shares: String(h.shares), price: mark.toFixed(2) } };
        }),
      sellHolding: () =>
        setState((s) => {
          const h = s.holdings.find((x) => x.sym === s.sell.sym);
          if (!h) {
            flash('Pick a position to close.');
            return s;
          }
          const qty = parseFloat(s.sell.shares);
          const px = parseFloat(s.sell.price);
          if (!(qty > 0) || !(px > 0)) {
            flash('Enter share count and sell price.');
            return s;
          }
          if (qty > h.shares) {
            flash('Only ' + h.shares + ' shares of ' + h.sym + ' held.');
            return s;
          }
          const realized = qty * (px - h.cost);
          flash(h.sym + ' · ' + qty + ' sh sold @ ' + money2(px) + ' — realised ' + signed(realized) + '.');
          return {
            ...s,
            holdings:
              qty >= h.shares
                ? s.holdings.filter((x) => x.sym !== h.sym)
                : s.holdings.map((x) => (x.sym === h.sym ? { ...x, shares: x.shares - qty } : x)),
            closed: s.closed.concat([{ sym: h.sym, shares: qty, cost: h.cost, exit: px, date: h.date, exitDate: s.sell.date }]),
            sheetOpen: false,
            sell: { sym: '', shares: '', price: '', date: s.sell.date },
          };
        }),

      setTicker: (v) => patchF({ ticker: v.toUpperCase() }),
      setShares: (v) => patchF({ shares: v }),
      setPrice: (v) => patchF({ price: v }),
      setDate: (v) => patchF({ date: v }),
      setFee: (v) => patchF({ fee: v }),
      setAccount: (v) => patchF({ account: v }),
      setNote: (v) => patchF({ note: v }),
      addHolding: () =>
        setState((s) => {
          const f = s.f;
          const sym = (f.ticker || '').trim().toUpperCase();
          const shares = parseFloat(f.shares);
          const price = parseFloat(f.price);
          if (!sym) {
            flash('Ticker is required.');
            return s;
          }
          if (!(shares > 0) || !(price > 0)) {
            flash('Enter a quantity and buy price.');
            return s;
          }
          const hs = hash(sym);
          const nh = {
            sym,
            shares,
            cost: price,
            date: f.date,
            beta: 0.5 + (hs % 130) / 100,
            vol: 0.008 + (hs % 22) / 1000,
            drift: -0.0002 + (hs % 19) / 10000,
            dps: hs % 7 === 0 ? 0 : (hs % 340) / 100,
          };
          flash(sym + ' · ' + shares + ' sh @ ' + money2(price) + ' added — metrics recomputed.');
          return {
            ...s,
            holdings: s.holdings.concat([nh]),
            sheetOpen: false,
            advOpen: false,
            f: { ticker: '', shares: '', price: '', date: TODAY_ISO, fee: '', account: f.account, note: '' },
          };
        }),

      deleteClosed: (idx) =>
        setState((s) => {
          const c = s.closed[idx];
          if (!c) return s;
          flash(c.sym + ' closed lot removed — realised P/L recalculated.');
          return { ...s, closed: s.closed.filter((_, i) => i !== idx), adjustIdx: null };
        }),
      openAdjust: (idx) =>
        setState((s) => {
          const c = s.closed[idx];
          if (!c) return s;
          return { ...s, adjustIdx: idx, adj: { shares: String(c.shares), cost: c.cost.toFixed(2), exit: c.exit.toFixed(2), date: c.exitDate } };
        }),
      closeAdjust: () => patch({ adjustIdx: null }),
      setAdjShares: (v) => patchAdj({ shares: v }),
      setAdjCost: (v) => patchAdj({ cost: v }),
      setAdjExit: (v) => patchAdj({ exit: v }),
      setAdjDate: (v) => patchAdj({ date: v }),
      saveAdjust: () =>
        setState((s) => {
          const idx = s.adjustIdx;
          const a = s.adj;
          const shares = parseFloat(a.shares);
          const cost = parseFloat(a.cost);
          const exit = parseFloat(a.exit);
          if (!(shares > 0) || !(cost > 0) || !(exit > 0)) {
            flash('Shares, buy price and exit price must all be positive.');
            return s;
          }
          flash('Closed lot updated — realised ' + signed(shares * (exit - cost)) + '.');
          return {
            ...s,
            closed: s.closed.map((c, i) => (i === idx ? { ...c, shares, cost, exit, exitDate: a.date } : c)),
            adjustIdx: null,
          };
        }),
      deleteAdjust: () =>
        setState((s) => {
          if (s.adjustIdx === null) return s;
          const c = s.closed[s.adjustIdx];
          if (!c) return s;
          flash(c.sym + ' closed lot removed — realised P/L recalculated.');
          return { ...s, closed: s.closed.filter((_, i) => i !== s.adjustIdx), adjustIdx: null };
        }),
    }),
    [flash, patch, patchF, patchSell, patchAdj]
  );

  const derived = useMemo(() => deriveAll(state, marketRef.current!), [state]);

  const value = useMemo<StoreValue>(() => ({ state, derived, actions }), [state, derived, actions]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
