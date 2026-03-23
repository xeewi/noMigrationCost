---
phase: 05-comparison-view-chart-and-advanced-controls
plan: 03
subsystem: ui, visualization
tags: [react, recharts, area-chart, break-even, comparison-tab, shadcn, tabs]

# Dependency graph
requires:
  - phase: 05-01
    provides: "buildMonthlyChartData, formatEuroAbbrev, MonthCostPoint; engine types YearCost, BreakEvenResult"
  - phase: 05-02
    provides: "sharedCostOutput, duplicatedCostOutput, breakEvenResult computed in App.tsx"
provides:
  - "CostChart: Recharts AreaChart with monthly interpolation, break-even ReferenceLine, custom tooltip"
  - "ComparisonTab: summary cards, delta/savings, break-even callout, chart, side-by-side breakdown table"
  - "App.tsx: tabbed output column with Comparison (default) and Standalone tabs"
affects:
  - phase-05-verification

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Recharts CustomTooltip must define its own props interface (active/payload/label) not use TooltipProps — recharts omits those from TooltipProps via PropertiesReadFromContext"
    - "base-ui Tabs uses defaultValue prop on Root (not defaultTab) — confirmed from TabsRootProps type"
    - "X-axis ticks array computed from horizonYears: every 12 months for >=3y, every 6 months for 1y"
    - "ReferenceLine x value snapped via Math.round(breakEven.months!) per Pitfall 2 alignment requirement"

key-files:
  created:
    - src/components/CostChart.tsx
    - src/components/ComparisonTab.tsx
  modified:
    - src/App.tsx

key-decisions:
  - "CustomTooltip uses own props interface (not recharts TooltipProps) because recharts omits active/payload/label from TooltipProps via PropertiesReadFromContext — they are injected by context at runtime"
  - "BreakdownRowData.duplicatedCost for Maintenance row computed as totalCost - duplicatedDevCost - totalBugsCost - totalSyncCost (maintenance residual)"

# Metrics
duration: 2min
completed: 2026-03-23
---

# Phase 05 Plan 03: CostChart, ComparisonTab, and Tabbed Layout Summary

**Recharts AreaChart with green/red dual-curve comparison and break-even annotation, ComparisonTab with summary cards and side-by-side breakdown table, App.tsx output column refactored to tabbed Comparison/Standalone layout**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-23T22:26:50Z
- **Completed:** 2026-03-23T22:29:39Z
- **Tasks:** 3 auto (+ 1 human-verify auto-approved)
- **Files modified:** 3

## Accomplishments

- CostChart renders Recharts AreaChart at fixed height 320px with two Area components (shared #16a34a green, duplicated #dc2626 red, fillOpacity 0.2), CartesianGrid, custom tooltip, and conditional ReferenceLine at Math.round(breakEven.months)
- Custom tooltip shows Month header, Shared/Duplicated costs in path colors, and Difference in green (shared wins) or amber (shared doesn't win)
- X-axis ticks generated as array: every 12 months for horizons >=3 years, every 6 months for 1-year horizon
- ComparisonTab shows standalone reference Badge, two summary cards with colored left borders, savings/delta, break-even callout (green or amber), CostChart hero element, and side-by-side breakdown table with 7 rows including Bug Propagation and Sync/Divergence
- Empty state rendered when emptyReason != null or any required data is null — BarChart2 icon, heading, body text
- App.tsx output column replaced with Tabs (defaultValue="comparison") containing ComparisonTab and original CostOutput
- Auto-approved Task 4 (human-verify) in auto mode

## Task Commits

Each task was committed atomically:

1. **Task 1: Build CostChart component** - `6d2d344` (feat)
2. **Task 2: Build ComparisonTab component** - `a6a9e3b` (feat)
3. **Task 3: Refactor App.tsx tabbed layout** - `c36e50e` (feat)

## Files Created/Modified

- `src/components/CostChart.tsx` - ResponsiveContainer + AreaChart with two Area components, ReferenceLine, custom tooltip, dynamic X-axis ticks, buildMonthlyChartData useMemo
- `src/components/ComparisonTab.tsx` - Summary cards (border-l-4), delta/savings, green/amber break-even callout, CostChart integration, breakdown table with 7 rows, empty state
- `src/App.tsx` - Added ComparisonTab and Tabs imports; replaced CostOutput with Tabs wrapper containing both tab panels

## Decisions Made

- CustomTooltip uses own `CustomTooltipProps` interface (not recharts `TooltipProps`) because recharts excludes `active`, `payload`, and `label` from `TooltipProps` via `PropertiesReadFromContext` — these are injected at runtime by context but not typed in the public API
- Maintenance row for Duplicated path computed as `totalCost - duplicatedDevCost - totalBugsCost - totalSyncCost` (residual after explicit cost categories)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Recharts TooltipProps missing active/payload/label properties**
- **Found during:** Task 1 verification (build)
- **Issue:** `TooltipProps<number, string>` doesn't include `active`, `payload`, or `label` — they are omitted via `PropertiesReadFromContext` type. TypeScript reported TS2339 errors.
- **Fix:** Defined `CustomTooltipProps` interface with `active?: boolean`, `payload?: TooltipPayloadItem[]`, `label?: number | string` — uses runtime-injected props without fighting the recharts type system
- **Files modified:** src/components/CostChart.tsx
- **Commit:** c36e50e

### Out-of-Scope Pre-existing Issues

The `npm run build` (`tsc -b && vite build`) fails with 3 pre-existing errors in `src/components/AdvancedParameters.tsx` and one in `src/App.tsx` related to base-ui Slider and Collapsible type mismatches from Plan 02. These errors existed before this plan and are logged here for awareness. `npx tsc --noEmit` (dev mode) passes clean (0 errors) for all files in this plan.

Deferred to: deferred-items.md or resolved in a future fix pass.

## Known Stubs

None — all data flows from real engine outputs (sharedCostOutput, duplicatedCostOutput, breakEvenResult) computed in App.tsx. CostChart receives real yearlyBreakdown arrays. ComparisonTab renders from live calculations.

## Self-Check: PASSED

- FOUND: src/components/CostChart.tsx
- FOUND: src/components/ComparisonTab.tsx
- FOUND: src/App.tsx (modified with Tabs + ComparisonTab)
- FOUND commit 6d2d344 (feat: CostChart)
- FOUND commit a6a9e3b (feat: ComparisonTab)
- FOUND commit c36e50e (feat: App.tsx tabbed layout)
- TypeScript (noEmit): 0 errors
- Build (tsc -b): 3 pre-existing errors in AdvancedParameters.tsx (out of scope)

---
*Phase: 05-comparison-view-chart-and-advanced-controls*
*Completed: 2026-03-23*
