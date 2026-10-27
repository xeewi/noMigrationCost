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

- **Standalone cost estimate** — what one feature really costs, including
  organizational overhead (PM, design, QA, onboarding), not just dev hours.
- **Shared vs duplicated comparison** — cumulative cost curves for both
  approaches over 1, 3, 5 or 10 years, with a **break-even point**.
- **Team composition** — headcount per seniority level (Junior, Mid, Senior,
  Lead) with editable hourly rates based on the French market.
- **Two sizing modes** — story points (with velocity and sprint length) or
  direct hours / days.
- **Multiple consuming codebases** — see how the gap widens as more apps
  copy the same feature.
- **Advanced parameters** — tune every model constant (generalization factor,
  porting factor, divergence rate, maintenance rates, bug duplication factor).
- **Shareable links** — the whole state lives in the URL hash: copy the link,
  send it, the other person sees exactly your scenario.
- **Built-in documentation** — the full research behind every formula,
  readable inside the app, with sources.

## 🧮 How the model works

All formulas are pure TypeScript functions in
[`src/engine/formulas.ts`](src/engine/formulas.ts), each traceable to §7 of the
[research document](docs/feature-cost-shared-vs-duplicated.md).

| Approach | Up-front cost | Recurring cost |
|---|---|---|
| **Shared code** | Feature × *generalization factor* + library setup | Maintenance, versioning, consumer support, cross-team coordination |
| **Duplicated code** | Feature + porting to each extra codebase × *porting factor* | Maintenance ×N, sync of evolving features, duplicated bug fixes, growing divergence |

Default parameters come from industry research (COCOMO II, IEEE studies) and
French labor market data (35 h/week, 7 h/day):

| Parameter | Default |
|---|---|
| Generalization factor (shared) | `1.3` |
| Porting factor (duplicated) | `0.65` |
| Divergence rate / year | `20 %` |
| Annual maintenance — shared | `18 %` |
| Annual maintenance — duplicated | `22 %` |
| Bug duplication factor | `2.0` |
| Hourly rate — Junior / Mid / Senior / Lead | `32 / 40 / 51 / 67 €` |

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
