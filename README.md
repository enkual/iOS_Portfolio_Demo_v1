# iOS Portfolio Demo

A React Native (Expo, TypeScript) portfolio-management app: dashboard, holdings (with buy/sell + swipe-to-adjust closed positions), risk analysis (correlation matrix, rolling Sharpe/Beta/Jensen's alpha, VaR, return distribution), and dividends.

Implemented from a Claude Design handoff — the original prototype, chat transcript, and design system are kept under [`design/`](./design) for reference.

## Run it

```
npm install
npx expo start
```

Then open in iOS Simulator, Android emulator, Expo Go, or the web preview.

## Structure

- `src/state/` — deterministic mock-data engine (seeded RNG) and the derived-values layer (Sharpe, Beta, Jensen's alpha, VaR, correlation, return-distribution stats).
- `src/theme/` — Modernist design tokens (color, type, Archivo font loading).
- `src/components/` — shared UI (charts, tiles, chips, sheets, swipeable rows).
- `src/screens/` — Portfolio, All Holdings, Analysis, Dividends, All Positions.
- `src/sheets/` — Add/Sell lot and Adjust-closed-lot bottom sheets.
- `design/` — the original Claude Design handoff bundle (`HANDOFF.md`, `chats/`, `project/`) this app was built from.

Data is simulated/mock (seeded, reproducible) rather than live market data — see `design/HANDOFF.md` and `design/chats/chat1.md` for the full design history and decisions.
