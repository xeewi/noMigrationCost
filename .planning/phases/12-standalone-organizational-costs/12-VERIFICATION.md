---
phase: 12-standalone-organizational-costs
verified: 2026-03-24T22:00:00Z
status: passed
score: 7/7 must-haves verified
re_verification: false
---

# Phase 12: Standalone Organizational Costs Verification Report

**Phase Goal:** Enrich the Standalone cost model with organizational costs (support, versioning, onboarding, coordination) that currently only appear in Shared/Duplicated paths. A feature built by a single team still incurs these costs — the current Standalone mode underestimates by ~5× because it only counts dev + maintenance.
**Verified:** 2026-03-24T22:00:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #  | Truth                                                                             | Status     | Evidence                                                                         |
|----|-----------------------------------------------------------------------------------|------------|----------------------------------------------------------------------------------|
| 1  | Standalone cost includes versioning, support, coordination, and onboarding        | VERIFIED   | `calcStandaloneCost` computes all 4 components; StandaloneOutputs has 4 new fields |
| 2  | Coordination cost is 0 when nbConsumingCodebases is 0                             | VERIFIED   | Formula: `nbConsumingCodebases * COORDINATION_HOURS_PER_WEEK_PER_TEAM * ...`; test asserts `annualCoordinationCost === 0` |
| 3  | Breakdown has 6 rows with hours and percentages summing to 100                    | VERIFIED   | 6 named rows in breakdown array; test `'breakdown percentages sum to 100'` asserts `toBeCloseTo(100, 1)` |
| 4  | totalStandaloneCost for reference inputs (nbConsumingCodebases=0) equals 173822   | VERIFIED   | Test `'totalStandaloneCost with 0 consuming codebases = 173822'` asserts `toBeCloseTo(173822, 0)` |
| 5  | Footer hours total sums all breakdown rows, not just dev hours                    | VERIFIED   | `CostOutput.tsx` line 100: `output.breakdown.reduce((sum, row) => sum + row.hours, 0)` |
| 6  | Documentation explains standalone costs now include organizational costs          | VERIFIED   | Section 7.1.1 added to `docs/feature-cost-shared-vs-duplicated.md` with full explanation |
| 7  | Documentation shows corrected standalone total of 173,822 EUR for reference example | VERIFIED | Section 7.1.1 table row and prose both state 173,822 EUR; comparison to 52,052 EUR stated explicitly |

**Score:** 7/7 truths verified

---

### Required Artifacts

| Artifact                                        | Expected                                       | Status     | Details                                                                                         |
|-------------------------------------------------|------------------------------------------------|------------|-------------------------------------------------------------------------------------------------|
| `src/engine/types.ts`                           | StandaloneOutputs with 4 new cost fields       | VERIFIED   | Lines 55-58: `annualVersioningCost`, `annualSupportCost`, `annualCoordinationCost`, `annualOnboardingCost` all present |
| `src/engine/formulas.ts`                        | calcStandaloneCost with organizational costs   | VERIFIED   | Lines 144-224: full implementation with org cost block, 6-row breakdown, updated return object  |
| `src/engine/__tests__/formulas.test.ts`         | Tests for all 4 organizational cost components | VERIFIED   | Lines 178-227: 9 new tests covering versioning (2340), support (25350), coordination (20280), onboarding (12900), totalStandaloneCost=173822, 6-row breakdown, hours values |
| `src/components/CostOutput.tsx`                 | Footer hours from all breakdown rows           | VERIFIED   | Line 100: `breakdown.reduce((sum, row) => sum + row.hours, 0)`; `initialDevHours` absent from footer |
| `docs/feature-cost-shared-vs-duplicated.md`     | Updated with standalone organizational costs   | VERIFIED   | Section 7.1.1 present with component table, reference totals, and note about previous underestimate |

---

### Key Link Verification

| From                                         | To                             | Via                           | Status   | Details                                                                                          |
|----------------------------------------------|--------------------------------|-------------------------------|----------|--------------------------------------------------------------------------------------------------|
| `src/engine/formulas.ts`                     | `src/engine/types.ts`          | StandaloneOutputs return type | VERIFIED | Line 23: `import type { ..., StandaloneOutputs, ... }` and return type annotation present        |
| `src/engine/__tests__/formulas.test.ts`      | `src/engine/formulas.ts`       | calcStandaloneCost import     | VERIFIED | Line 12: `calcStandaloneCost` imported from `@/engine/formulas`; 14 test cases call it           |
| `src/components/CostOutput.tsx`              | `src/engine/types.ts`          | StandaloneOutputs import      | VERIFIED | Line 28: `import type { StandaloneOutputs } from '@/engine/types'`; used as prop type on line 31 |

---

### Data-Flow Trace (Level 4)

`CostOutput.tsx` is a pure display component — it receives `StandaloneOutputs` as a prop and renders it. Data flow is from the parent (`App.tsx`) which calls `calcStandaloneCost(engineInputs)`. The component renders `output.totalStandaloneCost`, `output.breakdown` (all 6 rows), and the reduce-computed footer total. No state is initialized empty and left unfilled; all data enters through the prop at render time.

| Artifact                    | Data Variable          | Source                                             | Produces Real Data | Status   |
|-----------------------------|------------------------|----------------------------------------------------|--------------------|----------|
| `src/components/CostOutput.tsx` | `output.breakdown` | `calcStandaloneCost` result passed via prop from `App.tsx` | Yes — 6 computed rows with real arithmetic | FLOWING |
| `src/components/CostOutput.tsx` | `output.totalStandaloneCost` | `calcStandaloneCost` return value | Yes — formula-computed, verified against 173822 reference | FLOWING |

---

### Behavioral Spot-Checks

| Behavior                                  | Command                                                    | Result              | Status |
|-------------------------------------------|------------------------------------------------------------|---------------------|--------|
| All formula tests pass                    | `npx vitest run src/engine/__tests__/formulas.test.ts`    | PASS (47) FAIL (0)  | PASS   |
| TypeScript compiles without errors        | `npx tsc --noEmit`                                        | Exit 0              | PASS   |
| 173822 reference value asserted in tests  | grep in formulas.test.ts                                  | Match at line 214   | PASS   |
| Footer uses breakdown.reduce              | grep in CostOutput.tsx                                    | Match at line 100   | PASS   |
| Documentation contains 173               | grep in docs file                                         | Match at line 490   | PASS   |

---

### Requirements Coverage

| Requirement  | Source Plan | Description                                                              | Status    | Evidence                                                                         |
|--------------|-------------|--------------------------------------------------------------------------|-----------|----------------------------------------------------------------------------------|
| ORG-ENGINE   | 12-01-PLAN  | calcStandaloneCost extended with organizational cost computations        | SATISFIED | formulas.ts lines 161-167: all 4 cost variables computed; return includes them   |
| ORG-BREAKDOWN| 12-01-PLAN  | StandaloneOutputs extended; breakdown has 6 rows with hours+percentages  | SATISFIED | types.ts lines 55-58: 4 new fields; formulas.ts breakdown array: 6 rows         |
| ORG-UI       | 12-02-PLAN  | CostOutput footer hours total sums all breakdown rows                    | SATISFIED | CostOutput.tsx line 100: `breakdown.reduce((sum, row) => sum + row.hours, 0)`   |
| ORG-DOCS     | 12-02-PLAN  | Documentation updated with standalone organizational cost explanation    | SATISFIED | Section 7.1.1 in docs/feature-cost-shared-vs-duplicated.md covers all components |

All 4 requirements from ROADMAP phase 12 are satisfied. No orphaned requirements detected.

**Note on REQUIREMENTS.md:** The project has no active REQUIREMENTS.md (archived to `milestones/v1.2-REQUIREMENTS.md` after v1.2). Requirements for phase 12 are tracked exclusively via ROADMAP.md (`ORG-ENGINE`, `ORG-BREAKDOWN`, `ORG-UI`, `ORG-DOCS`) and the PLAN frontmatter fields. This is consistent with the project's current workflow.

**Note on CONTEXT.md decisions D-01 through D-12:** All decisions are implemented:
- D-01 through D-04: All four cost categories present (verified in formulas.ts)
- D-05 through D-07: Each category has its own row with hours column populated (verified in breakdown array)
- D-08 through D-09: `calcStandaloneCost` modified, `StandaloneOutputs` extended (both verified)
- D-10: No new parameters added — `nbConsumingCodebases` reused (verified — EngineInputs unchanged)
- D-11 through D-12: Tests updated and engine-before-UI order maintained (verified via commit order: 90799e2 RED, 5c81cb5 GREEN, eaf7846 UI fix)

---

### Anti-Patterns Found

No blockers or warnings found.

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | — | — | — | — |

Scanned files: `src/engine/types.ts`, `src/engine/formulas.ts`, `src/engine/__tests__/formulas.test.ts`, `src/components/CostOutput.tsx`, `docs/feature-cost-shared-vs-duplicated.md`.

No TODO/FIXME/placeholder comments, no empty implementations, no stub return values, no hardcoded-empty props found in phase-modified files.

One notable design choice that is NOT a stub: The `Annual Maintenance` breakdown row has `hours: 0` by design (D-07 notes hours are "not directly tracked" for maintenance). This is intentional and the em-dash render path in CostOutput.tsx handles it correctly.

---

### Human Verification Required

None. All phase deliverables are programmatically verifiable:
- Engine correctness is covered by 47 passing unit tests with pinned reference values
- UI rendering is deterministic (maps over breakdown array, no conditional logic beyond null check)
- Documentation content was directly read and cross-checked against RESEARCH.md verified numbers

---

### Gaps Summary

No gaps. All 7 observable truths verified, all 4 requirements satisfied, all artifacts exist and are substantive, wired, and data-flowing. TypeScript compiles cleanly. 47 tests pass including all 9 new organizational cost tests. The one deviation from plan (arithmetic correction: 234472 → 234662 for nbConsumingCodebases=2) was a typo in the plan's expected value, not a formula error — the formula is correct and the fix was documented in the SUMMARY.

---

_Verified: 2026-03-24T22:00:00Z_
_Verifier: Claude (gsd-verifier)_
