---
phase: 04-scaffold-engine-and-standalone-cost
plan: 02
subsystem: engine
tags: [tdd, formulas, pure-functions, cost-calculation]
dependency_graph:
  requires: ["04-01"]
  provides: ["src/engine/formulas.ts"]
  affects: ["04-03", "phase-05"]
tech_stack:
  added: []
  patterns: ["TDD red-green-refactor", "pure TypeScript functions", "toBeCloseTo precision matching"]
key_files:
  created:
    - src/engine/formulas.ts
    - src/engine/__tests__/formulas.test.ts
  modified: []
decisions:
  - "calcBreakEven uses ENGINE_DEFAULTS.maintenanceRateShared (0.18) for shared side, not inputs.maintenanceRate — inputs.maintenanceRate is the duplicated rate (0.22)"
  - "DOUBLE_MAINTENANCE_FACTOR_BASE increments from year-1 not year, so Year 1 = 1.80, Year 2 = 1.85"
  - "calcDivergence Year 2 test uses 12681 (not 12680) — 8500 * e^0.4 = 12680.51, rounded correctly"
  - "calcBreakEven savings formula excludes onboarding — matches §7.3 which only subtracts annualSharedMaintenance (33774) from duplicated costs"
metrics:
  duration: "4 minutes"
  completed: "2026-03-23"
  tasks: 3
  files: 2
---

# Phase 04 Plan 02: Formula Engine — All Cost Calculations Summary

**One-liner:** Pure TypeScript formula engine with 8 exported functions verified against §7.1-7.5 research doc worked examples via TDD.

## What Was Built

`src/engine/formulas.ts` — The complete formula engine as pure TypeScript functions. All numbers the user will see flow through these functions. Implementation verified against every worked example in the research doc sections 7.1-7.5.

### Exported Functions

| Function | Formula | Research Doc |
|----------|---------|--------------|
| `calcTeamAvgRate` | Weighted avg of headcount × rate | §1.3 |
| `calcDevHours` | SP mode: (SP/velocity) × weeks × 35h | §1.2 |
| `calcStandaloneCost` | initialDev + maintenance × years | §7 intro |
| `calcSharedCost` | initialDev + libSetup + annual recurring | §7.1 |
| `calcDuplicatedCost` | baseDev × (1 + portingFactor) + diverging costs | §7.2 |
| `calcBreakEven` | upfrontCost / netMonthlySavings | §7.3 |
| `calcScaleFactor` | duplicatedTotal / sharedTotal | §7.4 |
| `calcDivergence` | baseSyncCost × e^(rate × t) | §7.5 |

## Test Coverage

36 tests across 8 describe blocks. Every worked example from §7.1-7.5 has a corresponding test case:

- Year-by-year cumulative verification for shared (§7.1): Years 0-3 match exactly (52000, 118954, 185908, 252862)
- Year 1 duplicated cumulative (§7.2): 113780 ✓
- Break-even ≈18.5 months (§7.3) ✓
- Divergence at years 1-3 (§7.5): 10382, 12681, 15488 ✓

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Double maintenance factor incremented from year, not year-1**
- **Found during:** GREEN phase — year 1 maintenance test failing with 114066 vs 113780
- **Issue:** `DOUBLE_MAINTENANCE_FACTOR_BASE + INCREMENT * year` gives 1.85 for year 1, but research doc says 1.80 for year 1 (base value)
- **Fix:** Changed to `DOUBLE_MAINTENANCE_FACTOR_BASE + INCREMENT * (year - 1)` — year 1 = 1.80, year 2 = 1.85
- **Files modified:** `src/engine/formulas.ts`
- **Commit:** 89de3e3

**2. [Rule 1 - Bug] calcBreakEven used duplicated maintenance rate (0.22) for shared side**
- **Found during:** GREEN phase — break-even returning 20.16 months instead of 18.5
- **Issue:** `sharedBaseMaintenance = initialDevCost * maintenanceRate` used the duplicated rate (0.22) instead of the shared rate (0.18). Since `EngineInputs` has a single `maintenanceRate` field, the break-even comparison required explicit use of `ENGINE_DEFAULTS.maintenanceRateShared`
- **Fix:** Changed to `ENGINE_DEFAULTS.maintenanceRateShared` for the shared side calculation
- **Files modified:** `src/engine/formulas.ts`
- **Commit:** 89de3e3

**3. [Rule 1 - Precision] calcDivergence Year 2 test expected 12680, actual 12680.51**
- **Found during:** GREEN phase — `toBeCloseTo(12680, 0)` fails as 12680.51 is outside ±0.5
- **Issue:** 8500 × e^0.4 = 12680.509... Research doc shows rounded value 12,680 but precise calculation is 12680.51
- **Fix:** Updated test to `toBeCloseTo(12681, 0)` — the mathematically correct rounded value
- **Files modified:** `src/engine/__tests__/formulas.test.ts`
- **Commit:** 89de3e3

## Known Stubs

None — this is a pure formula engine with no UI rendering. All values are computed, not placeholdered.

## Self-Check: PASSED

Files exist:
- [x] `src/engine/formulas.ts` — 405 lines, 8 exported functions
- [x] `src/engine/__tests__/formulas.test.ts` — 365 lines, 36 tests

Commits exist:
- [x] `e08594f` — test(04-02): add failing tests for formula engine
- [x] `89de3e3` — feat(04-02): implement formula engine
- [x] `dda9d6e` — refactor(04-02): improve calcBreakEven JSDoc and maintenance rate clarity

All tests: 36/36 passed (`npx vitest run` exits 0).
No React imports in `src/engine/formulas.ts`.
