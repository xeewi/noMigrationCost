---
phase: 04-scaffold-engine-and-standalone-cost
plan: 01
subsystem: scaffold
tags: [vite, react, tailwind, shadcn, vitest, typescript, engine-types]
dependency_graph:
  requires: []
  provides:
    - vite-react-typescript-scaffold
    - tailwind-css-4-configured
    - shadcn-ui-initialized
    - vitest-configured
    - engine-type-contracts
    - cn-formatEuro-utilities
  affects:
    - 04-02 (engine formulas depend on types.ts contracts)
    - 04-03 (UI depends on shadcn components and scaffold)
tech_stack:
  added:
    - react@19.0.0
    - vite@6.4.1
    - typescript@5.6.2
    - tailwindcss@4.2.2
    - "@tailwindcss/vite@4.2.2"
    - shadcn@4.1.0
    - recharts@3.8.0
    - lucide-react@1.0.1
    - clsx@2.1.1
    - tailwind-merge@3.5.0
    - vitest@4.1.1
    - "@testing-library/react@16.3.2"
    - jsdom@29.0.1
  patterns:
    - Tailwind CSS 4 Vite plugin (no PostCSS, no tailwind.config.js)
    - shadcn/ui zinc theme with CSS custom properties
    - Vitest co-located with Vite config (vitest/config defineConfig)
    - Path alias "@" -> "/src" configured in vite.config.ts and tsconfig.app.json
key_files:
  created:
    - package.json
    - index.html
    - vite.config.ts
    - tsconfig.json
    - tsconfig.app.json
    - tsconfig.node.json
    - src/main.tsx
    - src/App.tsx
    - src/index.css
    - src/vite-env.d.ts
    - src/lib/utils.ts
    - components.json
    - src/components/ui/card.tsx
    - src/components/ui/table.tsx
    - src/components/ui/input.tsx
    - src/components/ui/select.tsx
    - src/components/ui/tabs.tsx
    - src/components/ui/button.tsx
    - src/components/ui/toggle.tsx
    - src/components/ui/badge.tsx
    - src/components/ui/separator.tsx
    - src/engine/types.ts
    - src/engine/__tests__/smoke.test.ts
    - .gitignore
  modified: []
decisions:
  - "Used vitest/config defineConfig instead of vite defineConfig to resolve TypeScript error on test block"
  - "Added compilerOptions.paths to root tsconfig.json for shadcn CLI alias validation"
  - "Scaffolded manually (npm create vite cancelled on non-empty dir) — files equivalent to template output"
metrics:
  duration: 4m
  completed: "2026-03-23"
  tasks_completed: 3
  files_created: 23
---

# Phase 04 Plan 01: Scaffold, shadcn Init, Engine Types Summary

**One-liner:** Vite + React 19 + Tailwind CSS 4 scaffold with shadcn zinc theme, 9 UI components installed, engine type contracts defined, and Vitest confirmed working with @ alias.

## Tasks Completed

| # | Task | Commit | Status |
|---|------|--------|--------|
| 1 | Scaffold Vite + React project and install all dependencies | abb149e | Done |
| 2 | Initialize shadcn and add all Phase 4 UI components | 87b8116 | Done |
| 3 | Create engine type definitions and verify Vitest runs | 241552a | Done |

## What Was Built

**Task 1 — Vite scaffold:**
- Manually created all Vite + React TypeScript scaffold files (npm create vite cancelled on non-empty dir — see Deviations)
- Installed all dependencies: react, react-dom, recharts, lucide-react, clsx, tailwind-merge, tailwindcss, @tailwindcss/vite, vitest, @testing-library/react, jsdom
- Configured `vite.config.ts` with Tailwind 4 Vite plugin, `@` path alias, and Vitest test block
- Set `src/index.css` to `@import "tailwindcss"` (Tailwind 4 syntax, not v3 directives)

**Task 2 — shadcn initialization:**
- Ran `npx shadcn@latest init --defaults` — detected Vite + Tailwind 4, wrote `components.json`, installed button + utils.ts
- Added `formatEuro()` utility to `src/lib/utils.ts` for French locale currency formatting
- Installed 8 remaining components: card, table, input, select, tabs, toggle, badge, separator
- No `postcss.config.js` or `tailwind.config.js` generated (Tailwind 4 Vite plugin correctly detected)

**Task 3 — Engine type contracts:**
- Created `src/engine/types.ts` with all shared interfaces: SeniorityRow, SizingInputs, EngineInputs, StandaloneOutputs, SharedCostOutputs, DuplicatedCostOutputs, YearCost, BreakEvenResult
- Added constants: SENIORITY_DEFAULTS (32/40/51/67 €/h), HOURS_PER_WEEK=35, HOURS_PER_DAY=7, ENGINE_DEFAULTS
- Created smoke test confirming @ alias resolves in Vitest
- Vitest: 2/2 tests pass

## Verification Results

- `npm run build`: exits 0, 194.76 kB JS bundle
- `npx vitest run`: 2/2 tests pass
- All 9 shadcn components present in `src/components/ui/`
- No `tailwind.config.js` or `postcss.config.js` exists

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] npm create vite cancelled on non-empty directory**
- **Found during:** Task 1
- **Issue:** `npm create vite@latest . -- --template react-ts` exits immediately with "Operation cancelled" when directory is non-empty, even when responding with "y" or "Ignore" to the prompt. The interactive CLI does not accept stdin input in this environment.
- **Fix:** Manually created all scaffold files equivalent to what the template produces (package.json, index.html, tsconfig*.json, src/main.tsx, src/App.tsx, src/index.css, src/vite-env.d.ts). All file contents match the template output.
- **Files modified:** package.json, index.html, tsconfig.json, tsconfig.app.json, tsconfig.node.json, src/main.tsx, src/App.tsx, src/index.css, src/vite-env.d.ts
- **Commit:** abb149e

**2. [Rule 3 - Blocking] TypeScript error on test block in vite.config.ts**
- **Found during:** Task 1 (first build attempt)
- **Issue:** Using `defineConfig` from `vite` causes TS2769 because the `test` property is not in Vite's type. The plan's example code uses `vite` defineConfig which doesn't include Vitest types.
- **Fix:** Changed import to `defineConfig` from `vitest/config` which extends the Vite config type with Vitest-specific properties.
- **Files modified:** vite.config.ts
- **Commit:** abb149e (same task commit)

**3. [Rule 3 - Blocking] shadcn CLI failed to find path alias**
- **Found during:** Task 2 (first shadcn init attempt)
- **Issue:** shadcn CLI validates the `@/*` alias by looking in the root `tsconfig.json`, but the alias was only in `tsconfig.app.json` (a project reference). The CLI does not follow `references`.
- **Fix:** Added `compilerOptions.baseUrl` and `paths` to the root `tsconfig.json` so shadcn can validate the alias. The `tsconfig.app.json` retains its own alias config for TypeScript compilation.
- **Files modified:** tsconfig.json
- **Commit:** 87b8116

## Known Stubs

None. This is a scaffold plan — no data flows to UI rendering yet. App.tsx shows static placeholder text ("Scaffold ready.") which is intentional for this plan.

## Self-Check: PASSED

Files confirmed present:
- package.json: FOUND
- vite.config.ts: FOUND (contains tailwindcss(), "@": "/src", test block)
- src/lib/utils.ts: FOUND (contains cn(), formatEuro())
- src/components/ui/card.tsx: FOUND
- src/components/ui/table.tsx: FOUND
- src/components/ui/input.tsx: FOUND
- src/components/ui/select.tsx: FOUND
- src/components/ui/tabs.tsx: FOUND
- src/components/ui/button.tsx: FOUND
- src/components/ui/toggle.tsx: FOUND
- src/components/ui/badge.tsx: FOUND
- src/components/ui/separator.tsx: FOUND
- src/engine/types.ts: FOUND
- src/engine/__tests__/smoke.test.ts: FOUND

Commits confirmed:
- abb149e: FOUND (Task 1 - scaffold)
- 87b8116: FOUND (Task 2 - shadcn)
- 241552a: FOUND (Task 3 - engine types)
