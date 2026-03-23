---
phase: 01-inputs-and-standalone-cost
plan: 01
subsystem: data
tags: [alpine, vanilla-js, formula-engine, cost-model, french-salary]

# Dependency graph
requires: []
provides:
  - data.js with French loaded-cost salary defaults (Junior 32, Mid 40, Senior 51, Lead 67 €/h)
  - FORMULA_DEFAULTS with maintenance rates, generalization/porting/divergence parameters
  - SENIORITY_LEVELS array for fixed 4-slot team grid
  - Pure formula functions: spToHours, computeStandaloneCost, computeBreakdown, formatEur, formatPct, formatHours
  - Alpine appState() component with reactive team, sizing, horizon, and cost getters
affects:
  - 01-02 (UI wiring plan reads from app.js and data.js via global scope)
  - Phase 2 (comparison/chart plan extends computeBreakdown with Coordination/Bug Fixing/Sync rows)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "No ES module syntax — global const/function declarations, loaded via <script src>"
    - "function keyword for top-level formulas (hoisted, console-accessible)"
    - "Alpine appState() factory function returning reactive object with getters"
    - "Zero-guard pattern on all formula inputs (velocity <= 0, devHours === 0)"

key-files:
  created:
    - data.js
    - app.js
  modified: []

key-decisions:
  - "All constants declared with const (no let/var) — immutable by convention"
  - "Formula functions use function keyword (not arrow) for hoisting and browser-console testability"
  - "computeBreakdown Phase 1 stub: Coordination/Bug Fixing/Sync rows are zero — placeholder for Phase 2 duplicated-code model"
  - "appState getters use function() callbacks inside reduce() for IE-era compat, consistent with no-build constraint"

patterns-established:
  - "Pattern 1: data.js provides constants; app.js reads them via global scope — no import needed"
  - "Pattern 2: All top-level formula functions declared with function keyword for browser console access"
  - "Pattern 3: Alpine component is a single appState() factory, no x-data inline object literals"

requirements-completed: [TEAM-02, COST-01, COST-02]

# Metrics
duration: 2min
completed: 2026-03-23
---

# Phase 01 Plan 01: Data Layer and Formula Engine Summary

**Standalone cost formula engine: spToHours/computeStandaloneCost/computeBreakdown verified against docs §7.1 worked examples, with French salary constants and Alpine appState() component**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-23T16:32:44Z
- **Completed:** 2026-03-23T16:34:40Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- data.js: SALARY_DEFAULTS (4 seniority tiers), FORMULA_DEFAULTS (8 parameters from research doc), SENIORITY_LEVELS array
- app.js: 6 pure formula functions all verified against worked examples in browser-compatible Node.js test run
- app.js: Alpine appState() component with all reactive state properties and computed getters Plan 02 will wire to HTML

## Task Commits

Each task was committed atomically:

1. **Task 1: Create data.js with salary constants and formula defaults** - `e6183d4` (feat)
2. **Task 2: Create app.js with formula functions and Alpine appState component** - `25e0df1` (feat)

**Plan metadata:** (docs commit — this file)

## Files Created/Modified

- `/Users/brucecoaster/code/noMigrationCost/data.js` — SALARY_DEFAULTS, FORMULA_DEFAULTS, SENIORITY_LEVELS constants
- `/Users/brucecoaster/code/noMigrationCost/app.js` — spToHours, computeStandaloneCost, computeBreakdown, formatEur, formatPct, formatHours, appState()

## Decisions Made

- Used `function` keyword (not arrow functions) for all top-level formula functions so they hoist and are accessible in the browser console — aligns with "engine-before-UI" discipline in STATE.md
- computeBreakdown Phase 1 intentionally stubs Coordination, Bug Fixing, and Sync Overhead rows as zero — these are Phase 2 duplicated-code-model categories
- No `export` keyword anywhere — global scope sharing via `<script src>` is the correct pattern for file:// protocol

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Known Stubs

- `app.js` computeBreakdown: Coordination, Bug Fixing, and Sync Overhead rows always return `{ hours: 0, cost: 0, pct: 0 }` — intentional stubs documented in plan as "Phase 2 only". Plan 02 wires these to the UI as static zero rows; Phase 2 will add formula logic.

## Next Phase Readiness

- data.js and app.js are complete and formula-verified — Plan 02 can proceed directly to index.html markup and Alpine wiring
- All appState getters are reactive and ready for x-data binding
- Break-even "no break-even" UX blocker (STATE.md) applies to Phase 2, not Plan 02

## Self-Check: PASSED

- data.js exists: FOUND
- app.js exists: FOUND
- 01-01-SUMMARY.md exists: FOUND
- Commit e6183d4 exists: FOUND
- Commit 25e0df1 exists: FOUND
- Formula verification (Node.js): computeStandaloneCost(400,65,3)=40040, spToHours(40,30,2)≈93.33, computeBreakdown total=40040

---
*Phase: 01-inputs-and-standalone-cost*
*Completed: 2026-03-23*
