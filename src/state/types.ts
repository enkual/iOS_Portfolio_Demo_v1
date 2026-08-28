export interface Holding {
  sym: string;
  shares: number;
  cost: number;
  date: string; // ISO trade date
  beta: number;
  vol: number;
  drift: number;
  dps: number; // trailing annual dividend per share
}

export interface ClosedLot {
  sym: string;
  shares: number;
  cost: number;
  exit: number;
  date: string; // original open date
  exitDate: string;
}

export type Treatment = 'ledger' | 'poster' | 'grid';
export type Tab = 'portfolio' | 'analysis' | 'dividends';
export type Page = 'main' | 'holdings' | 'all';
export type Mode = 'buy' | 'sell';
export type HoldingsSort = 'weight' | 'pl' | 'az';
export type DivSort = 'yield' | 'income' | 'weight' | 'az';
export type SizeBy = 'Annual income' | 'Dividend yield';

export interface BuyForm {
  ticker: string;
  shares: string;
  price: string;
  date: string;
  fee: string;
  account: string;
  note: string;
}

export interface SellForm {
  sym: string;
  shares: string;
  price: string;
  date: string;
}

export interface AdjustForm {
  shares: string;
  cost: string;
  exit: string;
  date: string;
}

export interface AppState {
  holdings: Holding[];
  closed: ClosedLot[];

  benchmark: string;
  customBench: string;
  range: string; // key of PERIODS
  win: number; // rolling window, one of 30/60/90
  horizon: string; // key of HORIZONS
  bins: number; // one of 25/45/65
  showNormal: boolean;
  distOpen: boolean;

  sizeBy: SizeBy;
  divSort: DivSort;

  tab: Tab;
  page: Page;

  accountOpen: boolean;
  notesOpen: boolean;

  adjustIdx: number | null;
  adj: AdjustForm;

  sort: HoldingsSort;
  treatment: Treatment;

  sheetOpen: boolean;
  advOpen: boolean;
  toast: string | null;
  mode: Mode;

  sell: SellForm;
  f: BuyForm;
}
