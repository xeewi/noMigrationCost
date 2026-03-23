---
phase: 05-comparison-view-chart-and-advanced-controls
verified: 2026-03-23T23:45:00Z
status: human_needed
score: 4/4 success criteria verified
re_verification: true
  previous_status: gaps_found
  previous_score: 2/4 (2 VERIFIED, 2 PARTIAL — production build broken)
  gaps_closed:
    - "App.tsx useState<2> literal-type inference — fixed with explicit useState<number> on line 51"
    - "AdvancedParameters.tsx Slider onValueChange type mismatch — fixed with inline (v) => onValueChange(Array.isArray(v) ? v[0] : v)"
    - "AdvancedParameters.tsx CollapsibleTrigger asChild prop not on base-ui type — removed asChild, children moved directly onto CollapsibleTrigger"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Run npm run dev, open http://localhost:5173, set Junior headcount=2 (rate 32), Senior headcount=1 (rate 51), story points=50, velocity=10, sprint=2 weeks, 5-year horizon. Verify Comparison tab is active by default."
    expected: "Two summary cards — Shared Path (green left border) and Duplicated Path (red left border) with euro totals. Savings line below cards. Green break-even callout showing break-even month. Area chart with green and red curves, dashed vertical break-even line. Breakdown table with 7 rows including Bug Propagation and Coordination."
    why_human: "Recharts chart rendering, color correctness (green #16a34a / red #dc2626), tooltip interaction, and overall layout require a browser."
  - test: "Click the Advanced Parameters collapsible header. Move the Generalization Factor slider to 1.5. Verify Modified badge appears. Click Reset to defaults. Verify Modified badge disappears and the slider returns to 1.3."
    expected: "Collapsible opens (ChevronDown rotates 180 degrees). Each row shows label + Info icon + slider + numeric input. Modified badge appears on trigger header when any value differs from default. Reset restores all values and badge disappears."
    why_human: "Slider drag interaction, collapsible animation, badge state, and input sync require browser interaction."
---

# Phase 5: Comparison View, Chart, and Advanced Controls — Verification Report

**Phase Goal:** Users can compare shared code vs duplicated code total costs over time on a presentation-ready chart, with full control over all research-backed formula constants
**Verified:** 2026-03-23T23:45:00Z
**Status:** human_needed
**Re-verification:** Yes — after gap closure (plan 05-04, commit 3478c3b)

## Goal Achievement

### Observable Truths (from ROADMAP.md Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | User can see dual cumulative cost curves on a single chart with labeled axes and presentation-ready styling | ✓ VERIFIED | CostChart.tsx fully implemented (118 lines, Recharts AreaChart, green #16a34a and red #dc2626 Areas, labeled X/Y axes, Legend). Wired via ComparisonTab → App.tsx. `npm run build` exits 0, dist/ produced. |
| 2 | User can see break-even point on chart with annotation, or clear no-break-even message | ✓ VERIFIED | CostChart.tsx: conditional ReferenceLine at Math.round(breakEven.months) with label "Break-even". ComparisonTab: green bg-green-50 callout "Break-even at X months" and amber bg-amber-50 "No break-even within N years" callout. Both wired to real breakEvenResult from App.tsx. |
| 3 | User can see divergence rate modeling with bug propagation and coordination as explicit breakdown line items | ✓ VERIFIED | ComparisonTab.tsx breakdown table: 7 rows including "Bug Propagation" (duplicatedCost.totalBugsCost) and "Coordination (Ny)" (sharedCost.annualCoordinationCost * horizonYears) and "Sync/Divergence" (duplicatedCost.totalSyncCost). Engine: calcDuplicatedCost accumulates totalBugsCost and totalSyncCost in loop. |
| 4 | User can adjust all formula constants with research-backed defaults and source citations pre-filled | ✓ VERIFIED | AdvancedParameters.tsx: 6 ParamRow instances with Slider + Input + Popover citation for all 6 parameters. ConsumingTeams.tsx: min=2/max=10 input. All defaults from ENGINE_DEFAULTS. Citations present with section symbols. Slider onValueChange and CollapsibleTrigger asChild fixed — tsc -b && vite build passes clean. |

**Score:** 4/4 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/engine/types.ts` | DuplicatedCostOutputs with totalBugsCost/totalSyncCost, optional maintenanceRateShared on EngineInputs | ✓ VERIFIED | Lines 61-67: totalBugsCost and totalSyncCost present. Line 31: maintenanceRateShared?: number. |
| `src/engine/formulas.ts` | calcDuplicatedCost returns sub-totals; calcBreakEven reads maintenanceRateShared from inputs | ✓ VERIFIED | Lines 269-307: totalBugsCost/totalSyncCost accumulated in loop and returned. Line 358: inputs.maintenanceRateShared ?? ENGINE_DEFAULTS.maintenanceRateShared. |
| `src/lib/utils.ts` | formatEuroAbbrev, buildMonthlyChartData, MonthCostPoint | ✓ VERIFIED | All three present. formatEuroAbbrev: K/M abbreviation. buildMonthlyChartData: linear interpolation. MonthCostPoint interface exported. YearCost imported from engine types. |
| `src/components/ui/slider.tsx` | shadcn Slider component | ✓ VERIFIED | 57 lines. base-ui SliderPrimitive.Root wrapper. Exports Slider. |
| `src/components/ui/popover.tsx` | shadcn Popover component | ✓ VERIFIED | 2.5K. Exports Popover, PopoverTrigger, PopoverContent. |
| `src/components/ui/collapsible.tsx` | shadcn Collapsible component | ✓ VERIFIED | 19 lines. base-ui CollapsiblePrimitive wrapper. Exports Collapsible, CollapsibleTrigger, CollapsibleContent. |
| `src/components/ConsumingTeams.tsx` | Small card, number input min=2/max=10 | ✓ VERIFIED | 58 lines. Card wrapper, Input type="number" min={2} max={10}, label "Number of consuming teams". |
| `src/components/AdvancedParameters.tsx` | Collapsible panel, 6 slider+input rows, citation popovers, Modified badge, Reset button | ✓ VERIFIED | 239 lines. All 6 parameters. Popover citations. Modified Badge. Reset button. Slider onValueChange fixed: inline `(v) => onValueChange(Array.isArray(v) ? v[0] : v)`. CollapsibleTrigger asChild removed. tsc -b passes. |
| `src/components/CostChart.tsx` | Recharts AreaChart, break-even ReferenceLine, custom tooltip | ✓ VERIFIED | 118 lines. ResponsiveContainer, AreaChart, two Areas, ReferenceLine, CustomTooltip, dynamic ticks. |
| `src/components/ComparisonTab.tsx` | Summary cards, break-even callout, chart, breakdown table | ✓ VERIFIED | 201 lines. All required elements present. |
| `src/App.tsx` | TabsContent wrapping ComparisonTab and CostOutput | ✓ VERIFIED | useState<number> explicit annotation on line 51 fixes Dispatch<SetStateAction<2>> inference. Tabs defaultValue="comparison", TabsContent value="comparison" with ComparisonTab, TabsContent value="standalone" with CostOutput. tsc -b passes. |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/engine/formulas.ts` | `src/engine/types.ts` | DuplicatedCostOutputs with totalBugsCost | ✓ WIRED | formulas.ts imports DuplicatedCostOutputs; returns totalBugsCost and totalSyncCost in calcDuplicatedCost return statement |
| `src/lib/utils.ts` | `src/engine/types.ts` | YearCost import for buildMonthlyChartData | ✓ WIRED | Line 3: `import type { YearCost } from '@/engine/types'`; used as parameter type in buildMonthlyChartData |
| `src/components/AdvancedParameters.tsx` | `src/App.tsx` | advancedParams state + setAdvancedParams callback | ✓ WIRED | App.tsx: `<AdvancedParameters params={advancedParams} onChange={setAdvancedParams} isModified={isAdvancedModified} onReset={resetAdvancedParams} />` |
| `src/components/ConsumingTeams.tsx` | `src/App.tsx` | nbConsumingCodebases + onChange callback | ✓ WIRED | App.tsx: `<ConsumingTeams value={nbConsumingCodebases} onChange={setNbConsumingCodebases} />`. useState<number> explicit annotation eliminates previous type error. |
| `src/App.tsx` | `src/engine/formulas.ts` | sharedEngineInputs/duplicatedEngineInputs → calcSharedCost/calcDuplicatedCost | ✓ WIRED | Two separate EngineInputs useMemos; calcSharedCost, calcDuplicatedCost, calcBreakEven all called. |
| `src/components/CostChart.tsx` | `src/lib/utils.ts` | buildMonthlyChartData and formatEuroAbbrev | ✓ WIRED | Line 13: import of buildMonthlyChartData, formatEuroAbbrev, formatEuro from utils; buildMonthlyChartData called in useMemo, formatEuroAbbrev used as YAxis tickFormatter |
| `src/components/ComparisonTab.tsx` | `src/components/CostChart.tsx` | CostChart component usage | ✓ WIRED | `import { CostChart }` at line 2; rendered with sharedYearly, duplicatedYearly, breakEven, horizonYears props |
| `src/App.tsx` | `src/components/ComparisonTab.tsx` | ComparisonTab inside TabsContent | ✓ WIRED | `import { ComparisonTab }` at line 8; rendered inside `<TabsContent value="comparison">` |
| `src/App.tsx` | `src/components/CostOutput.tsx` | CostOutput inside TabsContent for Standalone tab | ✓ WIRED | `<CostOutput output={costOutput} emptyReason={emptyReason} />` inside `<TabsContent value="standalone">` |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| `ComparisonTab.tsx` | sharedCost, duplicatedCost, breakEven | calcSharedCost/calcDuplicatedCost/calcBreakEven in App.tsx useMemo | Yes — computed from user-controlled state | ✓ FLOWING |
| `CostChart.tsx` | data (MonthCostPoint[]) | buildMonthlyChartData(sharedYearly, duplicatedYearly) via useMemo | Yes — interpolated from real engine yearlyBreakdown arrays | ✓ FLOWING |
| `AdvancedParameters.tsx` | params (AdvancedParamsState) | advancedParams state in App.tsx, prop-passed | Yes — initialized from ENGINE_DEFAULTS, updated by user slider/input | ✓ FLOWING |
| `ConsumingTeams.tsx` | value (number) | nbConsumingCodebases state in App.tsx (useState<number>) | Yes — feeds nbConsumingCodebases into sharedEngineInputs | ✓ FLOWING |

No hardcoded empty arrays or static return stubs. All null states are empty-state guards (emptyReason checks), not hollow data.

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| All 84 formula/engine tests pass | `npx vitest run` | PASS (84) FAIL (0) | ✓ PASS |
| Production build succeeds | `npm run build` | Exit 0 — dist/index.html + assets produced in 1.69s, zero TS errors | ✓ PASS |
| App.tsx useState<number> fix applied | `grep "useState<number>"` | Line 51: `useState<number>(ENGINE_DEFAULTS.nbConsumingCodebases)` | ✓ PASS |
| AdvancedParameters.tsx Slider fix applied | Source review | Line 161: `onValueChange={(v) => onValueChange(Array.isArray(v) ? v[0] : v)}` — no separate handleSliderChange function | ✓ PASS |
| AdvancedParameters.tsx CollapsibleTrigger asChild removed | Source review | Line 195: `<CollapsibleTrigger className="...">` — no asChild, no inner button wrapper | ✓ PASS |
| totalBugsCost in formulas.ts | grep | Lines 269, 291, 306 (declared, accumulated, returned) | ✓ PASS |
| calcBreakEven reads maintenanceRateShared from inputs | grep | Line 358: `inputs.maintenanceRateShared ?? ENGINE_DEFAULTS...` | ✓ PASS |
| formatEuroAbbrev exported from utils | grep | Line 27: `export function formatEuroAbbrev` | ✓ PASS |
| buildMonthlyChartData exported | grep | Line 52: `export function buildMonthlyChartData` | ✓ PASS |
| CostChart has height={320} | Source review | Line 77: `height={320}` | ✓ PASS |
| Tabs defaultValue="comparison" | Source review | App.tsx: `defaultValue="comparison"` | ✓ PASS |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| COST-03 | 05-03 | Side-by-side comparison of shared vs duplicated total costs | ✓ SATISFIED | ComparisonTab.tsx: grid grid-cols-2 summary cards showing formatEuro(sharedCost.totalCost) and formatEuro(duplicatedCost.totalCost) |
| COST-04 | 05-03 | Break-even point (month) when shared becomes cheaper | ✓ SATISFIED | ComparisonTab.tsx: "Break-even at {Math.round(breakEven.months!)} months" callout. CostChart.tsx: ReferenceLine at Math.round(breakEven.months). calcBreakEven in formulas.ts returns months. |
| COST-05 | 05-03 | Clear message when break-even does not exist | ✓ SATISFIED | ComparisonTab.tsx: amber bg-amber-50 callout "No break-even within {horizonYears} years" when breakEven.exists === false |
| COST-06 | 05-01 | Divergence rate modeling with non-linear growth for duplicated code | ✓ SATISFIED | formulas.ts calcDuplicatedCost: DOUBLE_MAINTENANCE_FACTOR_BASE + DOUBLE_MAINTENANCE_FACTOR_INCREMENT * (year-1) divergence model in loop; AdvancedParameters.tsx: divergenceRate slider 0.05-0.50 range |
| COST-07 | 05-01, 05-03 | Bug propagation cost as separate breakdown line item | ✓ SATISFIED | DuplicatedCostOutputs.totalBugsCost computed in calcDuplicatedCost. ComparisonTab.tsx breakdown table row: "Bug Propagation" renders duplicatedCost.totalBugsCost |
| COST-08 | 05-01, 05-03 | Coordination overhead as explicit cost line in shared breakdown | ✓ SATISFIED | SharedCostOutputs.annualCoordinationCost returned by calcSharedCost. ComparisonTab.tsx row: "Coordination (Ny)" renders sharedCost.annualCoordinationCost * horizonYears |
| ADV-01 | 05-02 | Adjust generalization factor (default 1.3, range 1.0-2.0) | ✓ SATISFIED | AdvancedParameters.tsx PARAM_CONFIGS[0]: generalizationFactor, min:1.0, max:2.0, step:0.05, default ENGINE_DEFAULTS.generalizationFactor=1.3 |
| ADV-02 | 05-02 | Adjust porting factor (default 0.65, range 0.3-1.0) | ✓ SATISFIED | PARAM_CONFIGS[1]: portingFactor, min:0.3, max:1.0, default 0.65 |
| ADV-03 | 05-02 | Adjust divergence rate (default 0.20, range 0.05-0.50) | ✓ SATISFIED | PARAM_CONFIGS[2]: divergenceRate, min:0.05, max:0.50, default 0.20 |
| ADV-04 | 05-02 | Adjust maintenance rate shared (default 0.18, range 0.10-0.30) | ✓ SATISFIED | PARAM_CONFIGS[3]: maintenanceRateShared, min:0.10, max:0.30, default 0.18 |
| ADV-05 | 05-02 | Adjust maintenance rate duplicated (default 0.22, range 0.15-0.40) | ✓ SATISFIED | PARAM_CONFIGS[4]: maintenanceRateDuplicated, min:0.15, max:0.40, default 0.22 |
| ADV-06 | 05-02 | Adjust bug duplication factor (default 2.0, range 1.0-3.0) | ✓ SATISFIED | PARAM_CONFIGS[5]: bugDuplicationFactor, min:1.0, max:3.0, step:0.1, default 2.0 |
| ADV-07 | 05-02 | Adjust number of consuming codebases/teams (default 2, range 2-10) | ✓ SATISFIED | ConsumingTeams.tsx: Input min={2} max={10} step={1}, handleBlur clamps to [2,10]. App.tsx: nbConsumingCodebases state (useState<number>) feeds sharedEngineInputs.nbConsumingCodebases. |
| ADV-08 | 05-02 | All defaults pre-filled from research-backed values with source references | ✓ SATISFIED | AdvancedParameters.tsx: all 6 params initialized from ENGINE_DEFAULTS. Each ParamRow has Info icon + Popover with section-symbol citation text. |
| VIZ-01 | 05-03 | Temporal cost curves (cumulative) for both approaches on single chart | ✓ SATISFIED | CostChart.tsx: two Area components on single AreaChart, data from buildMonthlyChartData (monthly interpolation of yearlyBreakdown). Both shared and duplicated series on same chart. |
| VIZ-02 | 05-03 | Break-even point highlighted on chart with annotation | ✓ SATISFIED | CostChart.tsx: conditional ReferenceLine when breakEven.exists, x=Math.round(breakEven.months!), label="Break-even", strokeDasharray="4 4" |
| VIZ-03 | 05-03 | Chart has high-contrast, presentation-ready styling with labeled axes | ✓ SATISFIED | CostChart.tsx: X-axis label "Month", YAxis tickFormatter=formatEuroAbbrev, CartesianGrid, Legend, fixed colors #16a34a/#dc2626, ResponsiveContainer width="100%" height={320}. |
| VIZ-04 | 05-02 | Citation tooltips showing research source for each formula constant | ✓ SATISFIED | AdvancedParameters.tsx: each ParamRow wraps Info icon in Popover with PopoverContent showing citation text. aria-label="View citation for {label}" on PopoverTrigger. |

All 18 requirements satisfied. Production build passes clean. All requirements mapped to Phase 5 in REQUIREMENTS.md are accounted for in plans 05-01 through 05-04. No orphaned requirements.

---

### Anti-Patterns Found

No blockers, warnings, or notable anti-patterns. All three previous build-blocking TypeScript errors are resolved:

- `src/App.tsx` line 51: `useState<number>` explicit annotation applied — no longer infers literal type `2`
- `src/components/AdvancedParameters.tsx` line 161: Slider `onValueChange` inline with `Array.isArray` guard — no named handler type mismatch
- `src/components/AdvancedParameters.tsx` line 195: `CollapsibleTrigger` renders without `asChild` — base-ui API used correctly

No TODO/FIXME/placeholder comments found. No hardcoded empty arrays reaching rendering. No stub implementations.

---

### Human Verification Required

#### 1. Full Comparison View End-to-End

**Test:** Run `npm run dev`, open http://localhost:5173. Set Junior headcount=2 (rate 32), Senior headcount=1 (rate 51). Set story points=50, velocity=10, sprint=2 weeks. Select 5-year horizon.
**Expected:** Comparison tab active by default. Two summary cards — "Shared Path" (green left border) and "Duplicated Path" (red left border) — with euro totals. Savings line below cards. Green break-even callout with "Break-even at X months". Area chart with green and red curves, dashed vertical break-even line. Breakdown table with 7 rows including "Bug Propagation" and "Coordination (5y)".
**Why human:** Recharts chart rendering, color correctness (green #16a34a / red #dc2626), tooltip interaction, and overall layout require a browser.

#### 2. Advanced Parameters Interaction

**Test:** Click the "Advanced Parameters" collapsible header. Move the Generalization Factor slider to 1.5. Verify "Modified" badge appears. Click "Reset to defaults". Verify Modified badge disappears and slider returns to 1.3.
**Expected:** Collapsible opens (ChevronDown rotates 180 degrees). Each row shows label + Info icon + slider + numeric input. Modified badge appears on trigger header when any value differs from default. Reset restores all values and badge disappears.
**Why human:** Slider drag interaction, collapsible animation, badge state, and input sync require browser interaction.

---

### Gaps Summary

No gaps remain. The three TypeScript build errors from the initial verification are all resolved by commit 3478c3b (plan 05-04). The production build now exits 0 with full dist/ output. All 84 engine tests continue to pass. All 18 requirements (COST-03 through COST-08, ADV-01 through ADV-08, VIZ-01 through VIZ-04) are satisfied by substantive, wired, data-flowing implementations.

The only outstanding items are 2 browser-only visual verifications that cannot be checked programmatically. The phase goal is achieved in code.

---

_Verified: 2026-03-23T23:45:00Z_
_Verifier: Claude (gsd-verifier)_
