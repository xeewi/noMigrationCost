---
phase: 05-comparison-view-chart-and-advanced-controls
plan: 01
subsystem: engine, ui
tags: [shadcn, engine, formulas, typescript, vitest, recharts, chart-utils]

# Dependency graph
requires:
  - phase: 04-scaffold-engine-and-standalone-cost
    provides: "Engine formula functions (calcDuplicatedCost, calcBreakEven, types, YearCost)"
provides:
  - "DuplicatedCostOutputs extended with totalBugsCost and totalSyncCost sub-totals"
  - "EngineInputs extended with optional maintenanceRateShared for user-controlled break-even"
  - "formatEuroAbbrev utility for compact K/M currency display"
  - "MonthCostPoint interface and buildMonthlyChartData for Recharts chart data"
  - "shadcn Slider, Popover, Collapsible components installed"
affects:
  - 05-02-comparison-breakdown-table
  - 05-03-cost-chart-and-advanced-controls

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Vitest tests run from worktree directory (node_modules/.bin/vitest) to resolve @/ alias correctly"
    - "calcBreakEven uses ?? operator for nullable override pattern — inputs.field ?? ENGINE_DEFAULTS.field"
    - "buildMonthlyChartData uses linear interpolation between yearly YearCost boundaries"

key-files:
  created:
    - src/components/ui/slider.tsx
    - src/components/ui/popover.tsx
    - src/components/ui/collapsible.tsx
  modified:
    - src/engine/types.ts
    - src/engine/formulas.ts
    - src/engine/__tests__/formulas.test.ts
    - src/lib/utils.ts

key-decisions:
  - "calcBreakEven reads maintenanceRateShared from inputs with ?? fallback to ENGINE_DEFAULTS — preserves backward compatibility while enabling Phase 5 user-controlled parameter"
  - "buildMonthlyChartData iterates from yi=1 (first year) so month 1..N*12 — year 0 is the setup cost anchor point"
  - "Worktree vitest runs must use the worktree-local path to avoid resolving @/ alias against main repo src/"

patterns-established:
  - "TDD: RED commit (failing tests) then GREEN commit (implementation passing)"
  - "Sub-total fields accumulated in loop with let totalX = 0 before loop, totalX += yearX inside loop"

requirements-completed: [COST-06, COST-07, COST-08]

# Metrics
duration: 4min
completed: 2026-03-23
---

# Phase 05 Plan 01: Engine Extensions and shadcn Component Install Summary

**Engine extended with DuplicatedCostOutputs sub-totals (totalBugsCost, totalSyncCost), flexible calcBreakEven maintenanceRateShared, chart interpolation utilities (formatEuroAbbrev, buildMonthlyChartData), and three shadcn primitives (Slider, Popover, Collapsible) installed**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-23T22:10:10Z
- **Completed:** 2026-03-23T22:18:18Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- DuplicatedCostOutputs now returns totalBugsCost and totalSyncCost enabling the comparison breakdown table in Plan 02
- calcBreakEven accepts optional maintenanceRateShared from inputs (falls back to ENGINE_DEFAULTS), enabling user-controlled sensitivity in Plan 03 advanced parameters
- formatEuroAbbrev formats amounts as euro-500, euro-42K, euro-1.5M for compact chart axis labels
- buildMonthlyChartData linearly interpolates yearly YearCost arrays into month-by-month MonthCostPoint[] for the Recharts chart
- Three shadcn UI primitives installed: Slider (parameter sliders), Popover (citation tooltips), Collapsible (advanced parameters accordion)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install shadcn Slider, Popover, Collapsible** - `975b57e` (feat)
2. **Task 2: RED — failing tests for sub-totals and flexible maintenanceRateShared** - `test commit` (test)
3. **Task 2: GREEN — implement engine extensions** - `e356bd6` (feat)
4. **Task 3: Add formatEuroAbbrev, MonthCostPoint, buildMonthlyChartData** - `360906e` (feat)

_Note: Task 2 uses TDD with separate RED (test) and GREEN (implementation) commits._

## Files Created/Modified

- `src/components/ui/slider.tsx` - shadcn Slider using @base-ui/react/slider
- `src/components/ui/popover.tsx` - shadcn Popover with Trigger/Content/Title/Description exports
- `src/components/ui/collapsible.tsx` - shadcn Collapsible with Trigger/Content exports
- `src/engine/types.ts` - Added totalBugsCost/totalSyncCost to DuplicatedCostOutputs; optional maintenanceRateShared to EngineInputs
- `src/engine/formulas.ts` - calcDuplicatedCost accumulates sub-totals; calcBreakEven reads sharedRate from inputs
- `src/engine/__tests__/formulas.test.ts` - 8 new tests for sub-totals and flexible maintenanceRateShared (42 total, all pass)
- `src/lib/utils.ts` - Added formatEuroAbbrev, MonthCostPoint interface, buildMonthlyChartData

## Decisions Made

- calcBreakEven uses `inputs.maintenanceRateShared ?? ENGINE_DEFAULTS.maintenanceRateShared` — the ?? operator is the cleanest way to express "user override with default fallback" without breaking existing callers that don't supply the field
- buildMonthlyChartData starts iteration at `yi = 1` (skips year 0 anchor) so output months are 1..N*12, consistent with the break-even calculation's month-based result
- shadcn components copied from main repo installation into worktree (shadcn CLI runs against the main repo working tree, not the worktree)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Vitest run from main repo directory (`cd /Users/brucecoaster/code/noMigrationCost`) picked up main repo's unmodified source files via the `@/` alias. Fixed by running `node_modules/.bin/vitest run` from within the worktree directory, which correctly resolves `@/` to the worktree's `src/`.
- shadcn CLI installed components into the main repo working tree (correct behavior). Copied resulting files manually into the worktree's `src/components/ui/` to have them tracked on this branch.

## Known Stubs

None — all implementations are fully functional. No placeholder data or TODO stubs.

## Next Phase Readiness

- Plan 02 (comparison breakdown table) can now import totalBugsCost and totalSyncCost from calcDuplicatedCost
- Plan 03 (cost chart and advanced controls) can now import formatEuroAbbrev, buildMonthlyChartData, MonthCostPoint from utils.ts, and all three shadcn primitives are ready
- calcBreakEven is ready to accept maintenanceRateShared from Plan 03's advanced parameter sliders

## Self-Check: PASSED

- FOUND: src/components/ui/slider.tsx
- FOUND: src/components/ui/popover.tsx
- FOUND: src/components/ui/collapsible.tsx
- FOUND: src/lib/utils.ts (with formatEuroAbbrev, MonthCostPoint, buildMonthlyChartData)
- FOUND: src/engine/types.ts (with totalBugsCost, totalSyncCost, maintenanceRateShared)
- FOUND: src/engine/formulas.ts (with sub-total accumulation and flexible sharedRate)
- FOUND commit 975b57e (feat: install shadcn components)
- FOUND commit e356bd6 (feat: engine extensions)
- FOUND commit 360906e (feat: utils additions)
- All 42 tests pass, TypeScript clean

---
*Phase: 05-comparison-view-chart-and-advanced-controls*
*Completed: 2026-03-23*
