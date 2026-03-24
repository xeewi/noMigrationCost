---
phase: 12-standalone-organizational-costs
plan: "01"
subsystem: testing
tags: [typescript, vitest, engine, formulas, tdd]

requires:
  - phase: prior phases
    provides: calcStandaloneCost baseline with initialDevCost + maintenanceCost only

provides:
  - StandaloneOutputs extended with 4 annual org cost fields
  - calcStandaloneCost returns versioning, support, coordination, onboarding costs
  - 6-row breakdown (was 2 rows) covering all cost categories
  - Reference value verified: totalStandaloneCost = 173822 with 0 consuming codebases

affects: [12-standalone-organizational-costs, ui phases consuming StandaloneOutputs]

tech-stack:
  added: []
  patterns:
    - "Org cost constants mirror calcSharedCost pattern — same formula blocks, different caller"
    - "Total computed before percentages to avoid circular dependency"
    - "TDD: failing tests committed first (RED), then implementation (GREEN)"

key-files:
  created: []
  modified:
    - src/engine/types.ts
    - src/engine/formulas.ts
    - src/engine/__tests__/formulas.test.ts

key-decisions:
  - "Plan arithmetic had a typo: stated 234472 for nbConsumingCodebases=2 but correct value is 234662 (6084+2340+25350+20280+12900=66954; 33800+66954*3=234662); fixed test assertion to match verified formula"
  - "Coordination row in breakdown has hours=0 when nbConsumingCodebases=0, which is correct and expected"

patterns-established:
  - "Standalone org costs mirror calcSharedCost: same constants, same computation order"

requirements-completed: [ORG-ENGINE, ORG-BREAKDOWN]

duration: 16min
completed: 2026-03-24
---

# Phase 12 Plan 01: Standalone Organizational Costs Engine Summary

**calcStandaloneCost extended with 4 organizational cost components (versioning, support, coordination, onboarding) and 6-row breakdown; reference value totalStandaloneCost=173822 verified with nbConsumingCodebases=0**

## Performance

- **Duration:** ~16 min
- **Started:** 2026-03-24T21:17:30Z
- **Completed:** 2026-03-24T21:33:22Z
- **Tasks:** 1 (TDD: RED commit + GREEN commit)
- **Files modified:** 3

## Accomplishments

- Extended `StandaloneOutputs` interface with `annualVersioningCost`, `annualSupportCost`, `annualCoordinationCost`, `annualOnboardingCost` fields
- Updated `calcStandaloneCost` to compute all 4 org cost components using existing module-level constants
- Expanded breakdown from 2 rows to 6 rows with verified hours and percentages
- All 47 tests in `formulas.test.ts` pass; TypeScript compiles without errors

## Task Commits

Each task was committed atomically:

1. **RED — failing tests** - `90799e2` (test)
2. **GREEN — implementation** - `5c81cb5` (feat)

_Note: TDD tasks have two commits (test → feat)_

## Files Created/Modified

- `src/engine/types.ts` — Added 4 new fields to `StandaloneOutputs` interface
- `src/engine/formulas.ts` — Extended `calcStandaloneCost` with org cost block, 6-row breakdown, updated return object and JSDoc
- `src/engine/__tests__/formulas.test.ts` — Updated 2 existing assertions, added 9 new tests for org cost components

## Decisions Made

- **Plan arithmetic typo fixed:** The plan stated `totalStandaloneCost = 234472` for `nbConsumingCodebases=2`, but the correct arithmetic is 33800 + (6084+2340+25350+20280+12900)*3 = 33800 + 66954*3 = 33800 + 200862 = 234662. Test assertion corrected to 234662.
- **Coordination hours=0 when nbConsumingCodebases=0:** This is correct behavior — the test confirms `annualCoordinationCost` is 0 and the breakdown row has `hours: 0`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected totalStandaloneCost reference value for nbConsumingCodebases=2**
- **Found during:** Task 1 (GREEN phase, running tests)
- **Issue:** Plan states totalStandaloneCost=234472 for baseInputs (nbConsumingCodebases=2), but correct arithmetic is 234662. The formula was correct; the plan's stated expected value had an arithmetic error.
- **Fix:** Updated test assertion from `toBeCloseTo(234472, 0)` to `toBeCloseTo(234662, 0)` to match the verified formula
- **Files modified:** `src/engine/__tests__/formulas.test.ts`
- **Verification:** Node.js calculation confirmed 234662; all tests pass
- **Committed in:** 5c81cb5 (GREEN implementation commit)

---

**Total deviations:** 1 auto-fixed (arithmetic correction in test assertion)
**Impact on plan:** The 173822 reference value (nbConsumingCodebases=0) matches the plan exactly. The 234662 correction was a typo in the plan — the formula logic is unchanged.

## Issues Encountered

- Parallel worktree test files (`agent-a8df9f90/` and `agent-aa9f15b3/`) cause Vitest to pick up old test versions during parallel execution, producing 4 spurious failures. These are from other agents' unmodified test files and are not failures in the main repo — `src/engine/__tests__/formulas.test.ts` passes all 47 tests.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `StandaloneOutputs` extended and verified — plan 12-02 can consume the new fields for UI breakdown display
- All existing tests remain green — no regression
- TypeScript compiles cleanly — no type errors downstream

---
*Phase: 12-standalone-organizational-costs*
*Completed: 2026-03-24*

## Self-Check: PASSED

- FOUND: src/engine/types.ts
- FOUND: src/engine/formulas.ts
- FOUND: src/engine/__tests__/formulas.test.ts
- FOUND: .planning/phases/12-standalone-organizational-costs/12-01-SUMMARY.md
- FOUND: commit 90799e2 (RED test commit)
- FOUND: commit 5c81cb5 (GREEN implementation commit)
