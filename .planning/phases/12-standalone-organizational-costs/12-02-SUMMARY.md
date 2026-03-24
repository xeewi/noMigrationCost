---
phase: 12-standalone-organizational-costs
plan: "02"
subsystem: ui-components, documentation
tags: [cost-output, footer, standalone, docs, organizational-costs]
dependency_graph:
  requires: ["12-01"]
  provides: ["correct-footer-hours-total", "standalone-org-cost-docs"]
  affects: ["src/components/CostOutput.tsx", "docs/feature-cost-shared-vs-duplicated.md"]
tech_stack:
  added: []
  patterns: ["breakdown.reduce for derived totals", "section 7.1.1 standalone cost model"]
key_files:
  created: []
  modified:
    - src/components/CostOutput.tsx
    - docs/feature-cost-shared-vs-duplicated.md
key_decisions:
  - "[Phase 12-02]: Footer hours total computed from breakdown.reduce sum — not initialDevHours — so all org cost rows (versioning, support, coordination, onboarding) are included"
  - "[Phase 12-02]: Documentation section 7.1.1 added between 7.1 and 7.2 — standalone org cost model with 173,822 EUR reference total"
metrics:
  duration: ~5 min
  completed: "2026-03-24T21:42:21Z"
  tasks: 2
  files_modified: 2
---

# Phase 12 Plan 02: Fix Footer Hours Total and Update Docs Summary

**One-liner:** Fixed CostOutput footer to sum all breakdown row hours via reduce, and added section 7.1.1 documenting standalone organizational costs with 173,822 EUR reference total.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Fix CostOutput footer hours total to sum all breakdown rows | eaf7846 | src/components/CostOutput.tsx |
| 2 | Update documentation to reflect standalone organizational costs | 72071e9 | docs/feature-cost-shared-vs-duplicated.md |

## What Was Built

### Task 1 — CostOutput Footer Fix

The `TableFooter` hours cell previously displayed `Math.round(output.initialDevHours)`, which only counted initial dev hours. After Plan 01 added organizational cost rows (Versioning, Consumer Support, Coordination, Onboarding) to the breakdown table, the footer no longer matched the visible row totals.

**Fix:** Replaced `output.initialDevHours` with `output.breakdown.reduce((sum, row) => sum + row.hours, 0)` so the footer dynamically sums all breakdown row hours.

### Task 2 — Documentation Update

Added section **7.1.1 Standalone Cost Model** between 7.1 (Shared Code Approach) and 7.2 (Duplicated Code Approach) in `docs/feature-cost-shared-vs-duplicated.md`. The new section explains:

- Versioning: 12 releases/year x 3h = 36h/year (2,340 €/year at 65 €/h)
- Consumer Support: 7.5h/week x 52 weeks = 390h/year (25,350 €/year)
- Onboarding: 3 new devs/year x (60h training + 20h mentoring) = 12,900 €/year
- Coordination: 0 for standalone (scales with consuming codebases)
- Reference example 3-year total: **173,822 EUR** vs previous dev+maintenance estimate of 52,052 EUR

The existing section 7.1 shared cost formula was not modified.

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- `npx tsc --noEmit`: exit 0
- `npx vitest run`: 42 tests pass, 0 failures
- `grep "breakdown.reduce" src/components/CostOutput.tsx`: match found
- `grep "173" docs/feature-cost-shared-vs-duplicated.md`: 2 matches found
- `grep "standalone" docs/feature-cost-shared-vs-duplicated.md`: 4 matches found

## Known Stubs

None.

## Self-Check: PASSED

- eaf7846 confirmed in git log
- 72071e9 confirmed in git log
- src/components/CostOutput.tsx exists and contains `breakdown.reduce`
- docs/feature-cost-shared-vs-duplicated.md exists and contains "173,822"
