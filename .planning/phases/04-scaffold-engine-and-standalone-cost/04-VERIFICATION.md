---
phase: 04-scaffold-engine-and-standalone-cost
verified: 2026-03-23T20:05:32Z
status: human_needed
score: 14/14 must-haves verified (automated); 1 item requires human
re_verification: false
human_verification:
  - test: "Open the running app and verify the two-column layout, sticky output column, and real-time calculation"
    expected: "Two columns visible on desktop; cost output stays visible while scrolling inputs; all values update as inputs change with no Calculate button"
    why_human: "Visual layout, sticky scroll behavior, and real-time reactivity require a browser"
  - test: "Verify COST-02 partial coverage: the breakdown table shows only 'Initial Development' and 'Annual Maintenance' — not coordination, bugs, or sync"
    expected: "Stakeholder accepts that coordination/bugs/sync categories are intentionally deferred to Phase 5 (Decision D-17). If they expect all 5 categories now, COST-02 is only partially satisfied."
    why_human: "COST-02 in REQUIREMENTS.md lists 5 categories but D-17 explicitly defers 3 to Phase 5. Whether this constitutes satisfying COST-02 is a product decision, not a code question."
---

# Phase 04: Scaffold, Engine, and Standalone Cost — Verification Report

**Phase Goal:** Users can configure a team and size a feature to see its standalone cost calculated from research-backed defaults, running on the new React stack
**Verified:** 2026-03-23T20:05:32Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (from ROADMAP.md Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | User can add, configure, and remove team members with seniority levels and see French loaded-cost salary defaults auto-filled | ✓ VERIFIED | `TeamComposition.tsx`: fixed 4-row grid, SENIORITY_DEFAULTS pre-filled (32/40/51/67), headcount=0 excludes (D-08). No individual names per D-05 — this is the intentional design. |
| 2 | User can override any member's hourly cost and see the team average loaded hourly cost update in real-time | ✓ VERIFIED | `handleRateChange` in TeamComposition, `teamAvgRate = useMemo(() => calcTeamAvgRate(team), [team])` in App.tsx — change propagates immediately |
| 3 | User can define feature size in story points (with velocity and sprint duration) or direct hours, and see derived development hours | ✓ VERIFIED | `FeatureSizing.tsx`: Tabs with story-points and direct-hours TabsTriggers, Sprint duration Select (1-4 weeks), velocity Input, Hours/Days Button pair; `devHours` displayed below |
| 4 | User can select a time horizon (1, 3, 5, 10 years) and see cost projections update | ✓ VERIFIED | `TimeHorizon.tsx`: 4 Buttons [1,3,5,10], `variant="default"` for active; `horizonYears` feeds `calcStandaloneCost` via `costOutput = useMemo(...)` |
| 5 | User can see the total standalone feature cost and a breakdown table by category (initial dev, maintenance) | ✓ VERIFIED with note | `CostOutput.tsx`: `formatEuro(output.totalStandaloneCost)`, breakdown table renders `output.breakdown` rows with Badge percentages. Phase 4 delivers 2 rows (Initial Dev + Maintenance). Coordination/bugs/sync are deferred to Phase 5 per D-17. |

**Score:** 5/5 truths verified (automated code evidence). Human verification required for visual/interactive confirmation.

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `package.json` | Project dependencies | ✓ VERIFIED | Contains react@19, tailwindcss@4.2.2, @tailwindcss/vite, vitest@4.1.1, recharts |
| `vite.config.ts` | Vite + Tailwind 4 + Vitest config | ✓ VERIFIED | `tailwindcss()` in plugins, `alias: { "@": "/src" }`, `test: { environment: 'jsdom', globals: true }` |
| `src/lib/utils.ts` | cn() and formatEuro() | ✓ VERIFIED | Exports `cn` (clsx+twMerge) and `formatEuro` (Intl.NumberFormat fr-FR EUR) |
| `src/App.tsx` | Root component with engine wiring | ✓ VERIFIED | Imports `calcTeamAvgRate`, `calcDevHours`, `calcStandaloneCost`; all derived state via `useMemo`; two-column layout |
| `components.json` | shadcn configuration | ✓ VERIFIED | Present (referenced in SUMMARY-01, not re-read but confirmed by successful `npx shadcn@latest init`) |
| `src/components/ui/` (9 files) | All Phase 4 shadcn components | ✓ VERIFIED | badge, button, card, input, select, separator, table, tabs, toggle — all 9 present |
| `src/engine/types.ts` | All shared type contracts | ✓ VERIFIED | SeniorityRow, SizingInputs, EngineInputs, StandaloneOutputs, SharedCostOutputs, DuplicatedCostOutputs, BreakEvenResult, SENIORITY_DEFAULTS (32/40/51/67), HOURS_PER_WEEK=35, ENGINE_DEFAULTS |
| `src/engine/formulas.ts` | 8 exported formula functions | ✓ VERIFIED | All 8: calcTeamAvgRate, calcDevHours, calcStandaloneCost, calcSharedCost, calcDuplicatedCost, calcBreakEven, calcScaleFactor, calcDivergence. 404 lines. No React imports. |
| `src/engine/__tests__/formulas.test.ts` | Unit tests against research doc | ✓ VERIFIED | 366 lines, 36 tests across 8 describe blocks. All §7.1-7.5 worked examples covered. |
| `src/components/TeamComposition.tsx` | 4-row seniority grid | ✓ VERIFIED | Junior/Mid/Senior/Lead, headcount + rate Inputs, `Team average loaded hourly cost` display |
| `src/components/FeatureSizing.tsx` | SP vs Direct Hours tabs | ✓ VERIFIED | Tabs with TabsTrigger for story-points and direct-hours, Select for sprint duration, Hours/Days Button pair |
| `src/components/TimeHorizon.tsx` | 4 preset buttons | ✓ VERIFIED | [1,3,5,10] Buttons, variant logic, "Projection horizon" label |
| `src/components/CostOutput.tsx` | Summary card + breakdown table | ✓ VERIFIED | `formatEuro(output.totalStandaloneCost)`, Separator, breakdown Table, Badge for %, TableFooter total row, empty state messages |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/main.tsx` | `src/App.tsx` | React DOM createRoot | ✓ WIRED | Confirmed by working build (App renders) |
| `vite.config.ts` | `@tailwindcss/vite` | Plugin import | ✓ WIRED | `import tailwindcss from '@tailwindcss/vite'`, used in `plugins: [react(), tailwindcss()]` |
| `src/engine/formulas.ts` | `src/engine/types.ts` | type imports | ✓ WIRED | `import type { SeniorityRow, SizingInputs, EngineInputs, ... } from './types'` |
| `src/engine/__tests__/formulas.test.ts` | `src/engine/formulas.ts` | function imports | ✓ WIRED | `import { calcTeamAvgRate, calcDevHours, ... } from '@/engine/formulas'` |
| `src/App.tsx` | `src/engine/formulas.ts` | useMemo calls | ✓ WIRED | `import { calcTeamAvgRate, calcDevHours, calcStandaloneCost } from '@/engine/formulas'`; all three called in useMemo |
| `src/App.tsx` | `src/components/CostOutput.tsx` | props passing StandaloneOutputs | ✓ WIRED | `<CostOutput output={costOutput} emptyReason={emptyReason} />` |
| `src/components/CostOutput.tsx` | `src/lib/utils.ts` | formatEuro import | ✓ WIRED | `import { formatEuro } from '@/lib/utils'`; used on `output.totalStandaloneCost` and each `row.cost` |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| `CostOutput.tsx` | `output: StandaloneOutputs` | `calcStandaloneCost(...)` in App.tsx useMemo | Yes — formula computation from user inputs | ✓ FLOWING |
| `TeamComposition.tsx` | `teamAvgRate: number` | `calcTeamAvgRate(team)` in App.tsx useMemo | Yes — weighted average of team state | ✓ FLOWING |
| `FeatureSizing.tsx` | `devHours: number` | `calcDevHours({...})` in App.tsx useMemo | Yes — converted from user SP/direct inputs | ✓ FLOWING |
| `TimeHorizon.tsx` | `horizonYears: number` | `useState(5)` in App.tsx, prop-passed | Yes — user selection, feeds costOutput calculation | ✓ FLOWING |

No static fallback values reach rendering. `costOutput` returns `null` (not `{}` or `[]`) when team or hours are zero, which triggers the empty state branch — not a hollow prop.

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build produces output | `npm run build` | 0 exit, 399 kB JS bundle | ✓ PASS |
| All 36 formula tests pass | `npx vitest run` | PASS (36) FAIL (0) | ✓ PASS |
| 8 formula functions exported | `grep "^export function" formulas.ts` | calcTeamAvgRate, calcDevHours, calcStandaloneCost, calcSharedCost, calcDuplicatedCost, calcBreakEven, calcScaleFactor, calcDivergence | ✓ PASS |
| No React in engine | `grep "react\|useState" formulas.ts` | 0 matches | ✓ PASS |
| No tailwind.config.js | `ls tailwind.config.js` | NOT FOUND | ✓ PASS |
| No postcss.config.js | `ls postcss.config.js` | NOT FOUND | ✓ PASS |
| All 9 shadcn components present | `ls src/components/ui/` | 9 .tsx files | ✓ PASS |
| Two-column layout in App.tsx | Code review | `flex-[55]`/`flex-[45]`, `md:sticky md:top-6 md:self-start`, `md:flex-row flex-col` | ✓ PASS |
| Visual browser rendering | Requires browser | — | ? SKIP |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| TEAM-01 | 04-01, 04-03 | User can add team members with seniority level | ✓ SATISFIED | Fixed 4-row grid with Junior/Mid/Senior/Lead (D-05 intentional design — no individual names). Setting headcount adds that level. |
| TEAM-02 | 04-01, 04-03 | French loaded-cost salary defaults auto-filled | ✓ SATISFIED | SENIORITY_DEFAULTS (32/40/51/67) pre-filled from `types.ts` constants in TeamComposition |
| TEAM-03 | 04-03 | User can override default hourly cost | ✓ SATISFIED | `handleRateChange` in TeamComposition.tsx allows editing hourly rate per row |
| TEAM-04 | 04-03 | User can remove team members | ✓ SATISFIED | D-08: headcount=0 excludes the seniority level from all calculations (`calcTeamAvgRate` only includes rows with headcount > 0) |
| TEAM-05 | 04-01, 04-02, 04-03 | Team average loaded hourly cost updates in real-time | ✓ SATISFIED | `teamAvgRate = useMemo(() => calcTeamAvgRate(team), [team])` — updates on every team state change |
| SIZE-01 | 04-02, 04-03 | Feature size in story points | ✓ SATISFIED | Story Points tab in FeatureSizing.tsx with storyPoints Input |
| SIZE-02 | 04-02, 04-03 | Feature size in direct hours or days | ✓ SATISFIED | Direct Hours tab with hours/days Button toggle |
| SIZE-03 | 04-02, 04-03 | Team velocity (SP/sprint) input | ✓ SATISFIED | velocity Input in Story Points tab |
| SIZE-04 | 04-02, 04-03 | Sprint duration (1-4 weeks) | ✓ SATISFIED | Select with options "1 week" through "4 weeks" |
| SIZE-05 | 04-02, 04-03 | Estimated development hours displayed | ✓ SATISFIED | `devHours` displayed below active tab in FeatureSizing.tsx with em-dash when zero |
| TIME-01 | 04-03 | Preset time horizon values (1, 3, 5, 10 years) | ✓ SATISFIED | HORIZON_OPTIONS = [1, 3, 5, 10] as const in TimeHorizon.tsx |
| TIME-02 | 04-03 | Cost projections update on horizon change | ✓ SATISFIED | `costOutput = useMemo(..., [teamAvgRate, devHours, horizonYears])` — rerenders on horizonYears change |
| COST-01 | 04-03 | Total cost of feature (standalone calculation) | ✓ SATISFIED | `formatEuro(output.totalStandaloneCost)` prominently displayed in CostOutput.tsx |
| COST-02 | 04-03 | Breakdown table: initial dev, maintenance, coordination, bugs, sync | PARTIAL — see note | Phase 4 delivers "Initial Development" + "Annual Maintenance" rows. Coordination/bugs/sync are intentionally deferred to Phase 5 (D-17). The REQUIREMENTS.md text lists 5 categories but the CONTEXT.md decision D-17 explicitly splits this across phases. Human decision needed on whether to mark as satisfied or deferred. |

**COST-02 Note:** REQUIREMENTS.md lists "coordination, bugs, sync" as breakdown categories, but CONTEXT.md D-17 states: "Standalone view shows only relevant categories: initial dev + maintenance. Coordination, bugs (propagation), and sync are comparison-specific — introduced in Phase 5." The implementation correctly follows D-17. This is a requirements-vs-decisions tension. The requirement was written before the UI design decisions were made. Recommend updating COST-02 to split into COST-02a (standalone: initial dev + maintenance) and COST-02b (comparison: coordination, bugs, sync) — but this is a product/stakeholder decision.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/components/CostOutput.tsx` | 90 | `Math.round(output.initialDevHours)` in total row — shows initial dev hours only, not total hours (maintenance hours are 0 in standalone) | ℹ️ Info | Total row "Hours" column shows only initial dev hours, not a true total. Maintenance hours are 0 by design (not directly tracked), so this is technically correct but could confuse users expecting a meaningful total hours figure. No fix needed for Phase 4; may want to reconsider for Phase 5. |

No TODO/FIXME/placeholder comments found in any Phase 4 source files. No hardcoded empty arrays reaching rendering. No stub implementations.

---

### Human Verification Required

#### 1. Visual Layout and Sticky Behavior

**Test:** Run `npm run dev`, open http://localhost:5173, verify the two-column layout on desktop (inputs left ~55%, cost output right ~45%), scroll the inputs column, and confirm the cost output column stays visible.
**Expected:** Max-width 1280px centered, no header/nav, sticky cost output, responsive stacking below 768px.
**Why human:** CSS sticky behavior and visual proportions require a browser.

#### 2. Real-Time Calculation Confirmation

**Test:** Set Junior headcount=2, Senior headcount=1 (rates at defaults 32/51). Verify team average shows approximately 38.33 €/h. Enter SP=20, velocity=10, sprint=2 weeks. Verify derived hours=140. Switch to 5-year horizon. Verify total cost is non-zero and breakdown shows two rows with percentages summing to 100%.
**Expected:** All values update immediately without clicking a Calculate button.
**Why human:** Reactivity and DOM update timing require browser interaction.

#### 3. Empty State Messages

**Test:** With all headcounts at 0, verify "Add at least one team member to see cost estimates..." message appears. Set Junior headcount=1, set SP=0, verify "Enter a feature size to see cost estimates..." message appears.
**Expected:** Contextual empty state messages appear and disappear based on team/sizing state.
**Why human:** Conditional rendering requires browser interaction.

#### 4. COST-02 Stakeholder Acceptance

**Test:** Show the cost breakdown table to a stakeholder. It shows only "Initial Development" and "Annual Maintenance" rows.
**Expected:** Stakeholder accepts that coordination, bugs, and sync categories are Phase 5 scope (per D-17).
**Why human:** Product/requirements decision about whether COST-02 is satisfied or needs splitting.

---

### Gaps Summary

No automated gaps were found. The codebase fully implements what was planned:

- Vite + React 19 + TypeScript + Tailwind CSS 4 (Vite plugin) scaffold is complete and builds cleanly
- 9 shadcn/ui components installed
- Engine types, formula functions, and unit tests are all present and substantive
- All UI components exist, are wired to the engine, and receive real data
- The two-column layout with sticky output is implemented
- 36/36 unit tests pass; build produces a valid bundle

The only open item is a requirements tension: COST-02 in REQUIREMENTS.md mentions 5 breakdown categories, but CONTEXT.md D-17 intentionally defers 3 of them (coordination, bugs, sync) to Phase 5. This was a design decision made during planning, not an oversight in implementation. The implementation correctly follows D-17. Human review is needed to either accept the partial coverage of COST-02 or update the requirements to reflect the split.

---

_Verified: 2026-03-23T20:05:32Z_
_Verifier: Claude (gsd-verifier)_
