---
phase: 04-scaffold-engine-and-standalone-cost
plan: "03"
subsystem: ui
tags: [react, shadcn, ui-components, calculator, standalone-cost]
dependency_graph:
  requires: ["04-01", "04-02"]
  provides: [standalone-cost-ui, team-composition-ui, feature-sizing-ui, time-horizon-ui, cost-output-ui]
  affects: []
tech_stack:
  added: []
  patterns: [controlled-components, useMemo-for-derived-state, two-column-sticky-layout, empty-state-detection]
key_files:
  created:
    - src/components/TeamComposition.tsx
    - src/components/FeatureSizing.tsx
    - src/components/TimeHorizon.tsx
    - src/components/CostOutput.tsx
  modified:
    - src/App.tsx
    - src/engine/formulas.ts
decisions:
  - "Used two Button elements for hours/days toggle in FeatureSizing instead of Toggle primitive — Toggle works as a single press button, two-state unit switch is clearer with paired Buttons"
  - "CostOutput receives emptyReason prop (zero-team vs zero-hours) from App.tsx to show contextual empty state messages"
  - "TableFooter component used for total row to get distinct background styling from shadcn"
metrics:
  duration: 155s
  completed: "2026-03-23T19:24:03Z"
  tasks_completed: 2
  tasks_total: 3
  files_created: 4
  files_modified: 2
---

# Phase 04 Plan 03: UI Components and Calculator Wiring Summary

**One-liner:** Full standalone cost calculator UI with shadcn components wired to the formula engine via useMemo in a two-column sticky layout.

## Tasks Completed

| # | Task | Commit | Status |
|---|------|--------|--------|
| 1 | Build TeamComposition, FeatureSizing, TimeHorizon | aa6ff8c | Complete |
| 2 | Build CostOutput and wire App.tsx | 0146509 | Complete |
| 3 | Visual and functional verification | — | CHECKPOINT — awaiting human verify |

## What Was Built

### TeamComposition.tsx
Four-row seniority grid (Junior, Mid, Senior, Lead) with headcount and hourly rate inputs. French defaults pre-filled from SENIORITY_DEFAULTS (32/40/51/67 €/h). Headcount=0 excludes the row from team average. Real-time team average displayed below grid with em-dash when zero.

### FeatureSizing.tsx
Two-tab layout (Story Points / Direct Hours) using shadcn Tabs. Story Points tab: SP field, velocity field, sprint duration Select (1-4 weeks). Direct Hours tab: numeric input with Hours/Days button pair toggle. Estimated development hours shown below in primary color when non-zero.

### TimeHorizon.tsx
Four preset buttons (1 yr / 3 yrs / 5 yrs / 10 yrs) with `variant="default"` for active and `variant="outline"` for inactive. Default 5 years. "Projection horizon" label per Copywriting Contract.

### CostOutput.tsx
Summary card with total standalone cost at 32px/600 weight. Separator between summary and breakdown table. Breakdown rows from engine's `output.breakdown` array with `<Badge variant="secondary">` for percentage column. Total row in TableFooter. Empty states: contextual message based on whether team or sizing is zero.

### App.tsx
All state as useState (raw inputs). All derived values as useMemo (teamAvgRate, devHours, emptyReason, costOutput). Two-column layout: `flex-[55]` inputs left, `flex-[45]` output right with `md:sticky md:top-6 md:self-start`. Responsive stacking at md breakpoint. No header/nav per D-03. No Calculate button per D-18.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Pre-existing TypeScript errors in formulas.ts**
- **Found during:** Task 1 build verification
- **Issue:** `yearlyBreakdown` arrays typed as `any[]` (implicit) causing TS7022 errors; unused `portingFactor` destructure in `calcBreakEven` causing TS6133
- **Fix:** Added `YearCost[]` type annotation to both arrays; removed `portingFactor` from destructure
- **Files modified:** `src/engine/formulas.ts`
- **Commit:** aa6ff8c

**2. [Rule 1 - Bug] Select onValueChange null guard**
- **Found during:** Task 1 build verification
- **Issue:** base-ui Select's `onValueChange` receives `string | null` but our handler typed `string`
- **Fix:** Added null guard `if (v !== null)` before calling `onSprintWeeksChange`
- **Files modified:** `src/components/FeatureSizing.tsx`
- **Commit:** aa6ff8c

### Design Deviations

**1. Hours/Days toggle implemented as two Buttons instead of Toggle primitive**
- **Reason:** The shadcn Toggle component works as a single press/unpress button. For a mutually exclusive Hours/Days selection, two paired Button elements with `variant="default"` (active) and `variant="outline"` (inactive) provides clearer visual feedback and simpler controlled-state management.
- **Impact:** Functionally equivalent; visually consistent with TimeHorizon button group pattern.

## Known Stubs

None — all data is wired to the real formula engine. No hardcoded placeholders in rendered output.

## Self-Check: PASSED

Files verified:
- `src/components/TeamComposition.tsx` exists: YES
- `src/components/FeatureSizing.tsx` exists: YES
- `src/components/TimeHorizon.tsx` exists: YES
- `src/components/CostOutput.tsx` exists: YES
- `src/App.tsx` modified: YES
- Commit aa6ff8c exists: YES (Task 1)
- Commit 0146509 exists: YES (Task 2)
- `npm run build` exits 0: YES
- `npx vitest run` 36 pass, 0 fail: YES
