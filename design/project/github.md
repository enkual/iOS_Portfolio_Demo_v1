repo: enkual/portfolioAppTest1.0
branch: main
path: app.py

## Last sync

date: 2026-08-28T09:50:00Z

### Updated in this project

- Split the phone app into Portfolio / Analysis / Dividends via a bottom tab bar, mirroring the Streamlit section order.
- Adopted the repo's option sets: benchmarks (S&P 500, Russell 2000, Nasdaq 100), periods (3M/6M/1Y/2Y), rolling beta windows (30/60/90), VaR horizons (1/5/10/21d).
- Added a Dividends screen — TTM income, portfolio yield, payers, non-paying weight, income/yield treemap and detail table.
- Correlation heatmap now uses the repo's bucket thresholds (hedge ≤ −0.20, low, moderate, high ≥ 0.50) plus weighted/simple average r and pairs-above-0.50.

## Screen map

| Screen | Repo source |
| --- | --- |
| Portfolio tab (market value, cost basis, unrealised P&L) | app.py:1289–1420 |
| Add / sell lot sheet | app.py:1151–1196 (position_dialog, add_position) |
| Analysis · rolling beta + beta by holding | app.py:500–595, 1492–1570 |
| Analysis · correlation matrix + stats | app.py:24–72, 1197–1288, 1844–1900 |
| Analysis · VaR tiles | app.py:955–1093, 1633–1840 |
| Dividends tab | app.py:596–716, 1572–1631 |

## Gaps (in repo, not yet in the design)

- Return-distribution histogram with normal overlay and its guide (app.py:405–500, 762–860, 1424–1490)
- Correlation network with hierarchical clusters (app.py:856–957, 1903–1942)
- Rolling pairwise correlation section (app.py:131–233, 1943–2020)
- Reallocation scenario overlay and notification bell (app.py:1094–1150, 1660–1800)
- Positions file upload/parse and template download (app.py:234–382)

## Gaps (in the design, not yet in the repo)

- Selling / closed positions and realised P&L
- Rolling Sharpe and rolling Jensen's alpha series
- Total value defined as market value + realised P&L
