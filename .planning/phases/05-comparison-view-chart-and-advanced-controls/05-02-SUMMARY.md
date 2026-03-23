---
phase: 05-comparison-view-chart-and-advanced-controls
plan: 02
subsystem: ui, state
tags: [react, shadcn, slider, popover, collapsible, advanced-params, state-management]

# Dependency graph
requires:
  - phase: 05-01
    provides: "Slider, Popover, Collapsible components; ENGINE_DEFAULTS; EngineInputs with optional maintenanceRateShared"
provides:
  - "ConsumingTeams card: number input min=2/max=10 for nbConsumingCodebases"
  - "AdvancedParameters collapsible panel: 6 slider+input rows with citation popovers, Modified badge, Reset button"
  - "App.tsx: advancedParams state, isAdvancedModified, resetAdvancedParams, sharedEngineInputs, duplicatedEngineInputs"
  - "App.tsx: sharedCostOutput, duplicatedCostOutput, breakEvenResult ready for Plan 03"
affects:
  - 05-03-cost-chart-and-advanced-controls

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "base-ui Slider onValueChange receives single number (not number[]) — matches @base-ui/react/slider Root.Props generic"
    - "AdvancedParameters ParamRow uses local inputStr state + useEffect sync for free-form typing with blur-clamp pattern"
    - "isAdvancedModified uses 0.001 epsilon for floating-point comparison to avoid false positives from slider step rounding"

key-files:
  created:
    - src/components/ConsumingTeams.tsx
    - src/components/AdvancedParameters.tsx
  modified:
    - src/App.tsx

key-decisions:
  - "base-ui Slider onValueChange signature is (value: number) not number[] — plan assumed shadcn radix API, actual API differs; adapted implementation accordingly"
  - "AdvancedParamsState interface exported from AdvancedParameters.tsx so App.tsx can import the type directly"
  - "sharedCostOutput, duplicatedCostOutput, breakEvenResult computed in App.tsx now (not Plan 03) since state is available — Plan 03 only needs to render them"

# Metrics
duration: 3min
completed: 2026-03-23
---

# Phase 05 Plan 02: ConsumingTeams Card and AdvancedParameters Panel Summary

**ConsumingTeams card with 2-10 range input and AdvancedParameters collapsible panel with 6 slider+input rows, citation popovers, Modified badge, and Reset button — all formula constants lifted from hardcoded ENGINE_DEFAULTS to App.tsx state with two separate EngineInputs objects for shared vs duplicated engine paths**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-23T22:21:39Z
- **Completed:** 2026-03-23T22:24:16Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- ConsumingTeams card follows TimeHorizon card pattern, with type="number" input clamped to 2-10 on blur
- AdvancedParameters renders a Collapsible wrapper with ChevronDown trigger, "Modified" Badge when any value differs from defaults, and a "Reset to defaults" Button
- Six ParamRow instances each with Slider + Input paired binding, useEffect-synced local inputStr for free-form typing, and Info icon + Popover citation from research doc
- App.tsx state now owns all 6 formula constants (generalizationFactor, portingFactor, divergenceRate, maintenanceRateShared, maintenanceRateDuplicated, bugDuplicationFactor) and nbConsumingCodebases
- Two separate EngineInputs objects: sharedEngineInputs (maintenanceRate = shared rate) and duplicatedEngineInputs (maintenanceRate = duplicated rate)
- costOutput (standalone) updated to use sharedEngineInputs instead of hardcoded ENGINE_DEFAULTS
- sharedCostOutput, duplicatedCostOutput, breakEvenResult computed and ready for Plan 03 rendering
- md:sticky removed from output column per D-05

## Task Commits

Each task was committed atomically:

1. **Task 1: Build ConsumingTeams card and AdvancedParameters collapsible panel** - `98e6a41` (feat)
2. **Task 2: Lift formula constants to App.tsx state, wire new components** - `28b4d2c` (feat)

## Files Created/Modified

- `src/components/ConsumingTeams.tsx` - Card with number input min=2/max=10, label, helper text
- `src/components/AdvancedParameters.tsx` - Collapsible panel with 6 ParamRow instances, Popover citations, Modified badge, Reset button; exports AdvancedParamsState type
- `src/App.tsx` - advancedParams + nbConsumingCodebases state; isAdvancedModified; resetAdvancedParams; sharedEngineInputs; duplicatedEngineInputs; sharedCostOutput; duplicatedCostOutput; breakEvenResult; ConsumingTeams + AdvancedParameters wired in JSX; sticky removed

## Decisions Made

- base-ui Slider onValueChange receives `(value: number)` not `(values: number[])` — the plan's description of the API was based on shadcn's Radix wrapper, but this project uses base-ui. Adapted the ParamRow handleSliderChange accordingly.
- AdvancedParamsState exported from AdvancedParameters.tsx so App.tsx can import the type and avoid duplication
- Comparison engine outputs (sharedCostOutput, duplicatedCostOutput, breakEvenResult) computed in App.tsx now rather than deferring to Plan 03, since the state is available — Plan 03 only needs to consume them for rendering

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] base-ui Slider onValueChange signature mismatch**
- **Found during:** Task 1
- **Issue:** Plan specified `onValueChange={([v]) => ...}` destructuring a number[], but base-ui Slider's Root.Props has `onValueChange?: (value: number, ...) => void` — single number, not array
- **Fix:** Used `onValueChange={handleSliderChange}` receiving `(newValue: number)` directly
- **Files modified:** src/components/AdvancedParameters.tsx
- **Commit:** 98e6a41

## Known Stubs

None — all data is wired to real state. AdvancedParameters reads from `params` prop (passed from App.tsx state). ConsumingTeams reads from `value` prop. All engine outputs flow from real calculations.

## Self-Check: PASSED

- FOUND: src/components/ConsumingTeams.tsx
- FOUND: src/components/AdvancedParameters.tsx
- FOUND: src/App.tsx (modified with advancedParams, sharedEngineInputs, etc.)
- FOUND commit 98e6a41 (feat: ConsumingTeams and AdvancedParameters components)
- FOUND commit 28b4d2c (feat: App.tsx state lift and wiring)
- TypeScript: 0 errors
- Vite build: success (462KB bundle)
- Vitest: 84 tests pass

---
*Phase: 05-comparison-view-chart-and-advanced-controls*
*Completed: 2026-03-23*
