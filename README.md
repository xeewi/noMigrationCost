<div align="center">

# 💸 noMigrationCost

### Feature Cost Calculator — *shared code vs duplicated code*

**Make the hidden long-term cost of code duplication visible, in euros.**

[![Deploy](https://github.com/xeewi/noMigrationCost/actions/workflows/deploy.yml/badge.svg)](https://github.com/xeewi/noMigrationCost/actions/workflows/deploy.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-components-000000)

[**Live demo →**](https://xeewi.github.io/noMigrationCost/)

</div>

---

## Why?

Two teams maintain two near-identical applications in two repositories. Every
feature gets built twice, every bug gets fixed twice, and the copies slowly
drift apart. Migrating to a shared library looks expensive up front — but
*not* migrating has a cost too, it's just spread over years and nobody sees it.

**noMigrationCost** puts a number on it. Describe your team and your feature,
pick a time horizon, and the calculator shows the real cost of each approach,
year by year, and when sharing starts paying for itself.

## ✨ Features

- **Standalone cost estimate** — what one feature costs to build once and
  keep alive over the horizon.
- **Shared vs duplicated comparison** — cumulative cost curves for both
  approaches over 1, 3, 5 or 10 years, with a **break-even point** read from
  the same curves (including "from day one" and "not within the horizon").
- **Team composition** — headcount per seniority level (Junior, Mid, Senior,
  Lead) with editable hourly rates based on the French market.
- **Two sizing modes** — story points (with velocity and sprint length) or
  direct hours / days.
- **Multiple consuming codebases** — see how the gap widens as more apps
  copy the same feature.
- **New or existing library** — an existing library drops the setup and
  running costs.
- **Assumptions** — tune every model assumption, each labelled
  *Measured* or *Assumption* with its source.
- **Shareable links** — the whole state lives in the URL hash: copy the link,
  send it, the other person sees exactly your scenario.
- **Built-in documentation** — the full research behind every formula,
  readable inside the app, with sources.

## 🧮 How the model works

All formulas are pure TypeScript functions in
[`src/engine/formulas.ts`](src/engine/formulas.ts), each traceable to §7 of the
[research document](docs/feature-cost-shared-vs-duplicated.md).

Every cost is a multiple of **C0**, the cost of building the feature once for
one app (person-hours × the team's average loaded rate), except the library's
setup and running time, which are fixed hours. With N apps:

| Approach | Up-front cost | Yearly cost |
|---|---|---|
| **Shared code** | G·C0 + i·C0·(N−1) + library setup (280 h) | m·G·C0 + k·C0·(N−1) + library running (100 h) |
| **Duplicated code** | C0 + p·C0·(N−1) | m·C0 + m·C0·(N−1)·e(y), with e(y) = min(1.5, e0 + δ·(y−1)) |

Because every term is hours × rate, the hourly rate scales the gap but never
flips the verdict. Bugs are not priced separately: they are part of upkeep.

Defaults come from the software-engineering literature (COCOMO II, Krüger &
Berger FSE 2020, Ray & Kim FSE 2012…) and French labour-market data for 2026
(35 h/week, 7 h/day, 1,607 h/year):

| Parameter | Default | Evidence |
|---|---|---|
| G — extra work to make it reusable | `1.20` | Measured |
| p — effort to copy it into another app | `0.65` | Measured |
| i — effort to plug the library into another app | `0.20` | Measured |
| m — yearly upkeep of one copy | `0.20` | Measured (order of magnitude) |
| e0 — upkeep of each extra copy vs the first | `1.00` | Assumption |
| δ — yearly drift of the copies (capped at 1.5×) | `0.05` | Assumption |
| k — coordination and upgrades per extra app, per year | `0.04` | Assumption |
| Hourly rate — Junior / Mid / Senior / Lead | `32 / 40 / 50 / 62 €` | Loaded (salary + employer contributions), national |

At the defaults the case is close: for the example scenario (4-person team,
1,120 person-hours, 2 apps, 5 years, new library) the up-front costs tie and
sharing comes out about 11.5 k€ cheaper, entirely on recurring costs. See §7.5
of the research document for the full worked example and a sensitivity table.

## 🚀 Getting started

Requires **Node.js 20+**.

```bash
git clone git@github.com:xeewi/noMigrationCost.git
cd noMigrationCost
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173/noMigrationCost/`).

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the formula engine tests (Vitest) |

## 🗂️ Project structure

```
src/
├── engine/          # Pure cost model — formulas, types, defaults, tests
├── components/      # Calculator UI (team, sizing, horizon, chart, docs page…)
│   └── ui/          # shadcn/ui primitives
├── hooks/           # Hash routing, active docs section
├── lib/             # URL state encoding / decoding
└── App.tsx          # State, derived results, layout
docs/
├── feature-cost-shared-vs-duplicated.md   # Research behind the model (EN)
├── FR/                                    # French version + slides
└── *.pptx, Presentation / Video notes     # Stakeholder material
```

## 📚 Documentation

- [Research: Feature Cost — Shared vs Duplicated Code](docs/feature-cost-shared-vs-duplicated.md) (EN)
- [Coût d'une feature : partagé vs dupliqué](docs/FR/cout-feature-partage-vs-duplication.md) (FR)
- Presentation decks: [EN](docs/Feature-Cost-Shared-vs-Duplicated.pptx) · [FR](docs/FR/Cout-Feature-Partage-vs-Duplication.pptx)

## 🌐 Deployment

The app is a fully static build. Every push to `main` is built and deployed to
**GitHub Pages** by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To host it elsewhere, run `npm run build` and serve `dist/`. If it's not served
under `/noMigrationCost/`, change `base` in [`vite.config.ts`](vite.config.ts).

## 🛠️ Tech stack

[React 19](https://react.dev) · [TypeScript](https://www.typescriptlang.org) ·
[Vite](https://vite.dev) · [Tailwind CSS 4](https://tailwindcss.com) ·
[shadcn/ui](https://ui.shadcn.com) · [Recharts](https://recharts.org) ·
[Vitest](https://vitest.dev)

---

<div align="center">

Made by [Guillaume Gautier](https://github.com/xeewi)

</div>
