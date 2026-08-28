// Money/percent formatting, ported from the .dc.html's MONEY/MONEY2/pct/signed helpers.
// Intl.NumberFormat is available in Hermes (RN's JS engine) with the standard
// intl data built in, matching the prototype's en-US USD formatting.

const MONEY_FMT = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const MONEY2_FMT = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function money(x: number): string {
  return MONEY_FMT.format(x);
}
export function money2(x: number): string {
  return MONEY2_FMT.format(x);
}

/** Real minus sign (−), not a hyphen, matching the source's pct()/signed() conventions. */
export function pct(x: number, d = 2): string {
  return (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(d) + '%';
}

export function signed(x: number): string {
  return (x >= 0 ? '+' : '−') + money(Math.abs(x));
}
