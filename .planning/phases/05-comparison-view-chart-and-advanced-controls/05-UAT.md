---
status: complete
phase: 05-comparison-view-chart-and-advanced-controls
source: [05-01-SUMMARY.md, 05-02-SUMMARY.md, 05-03-SUMMARY.md, 05-04-SUMMARY.md]
started: 2026-03-24T00:00:00Z
updated: 2026-03-24T00:10:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Tabbed Output Layout
expected: Output column shows two tabs: "Comparison" (selected by default) and "Standalone". Clicking between them switches the displayed content.
result: pass

### 2. Consuming Teams Input
expected: A "Consuming Teams" card with a number input. Accepts values 2-10. Typing a value outside that range gets clamped on blur (e.g., typing 1 becomes 2, typing 15 becomes 10).
result: issue
reported: "It should be able to go to 1"
severity: major

### 3. Advanced Parameters Collapsible Panel
expected: An "Advanced Parameters" section that expands/collapses when clicked. When expanded, shows 6 parameter rows, each with a slider and a number input.
result: pass

### 4. Advanced Parameters Modified Badge and Reset
expected: Changing any slider or input value from its default shows a "Modified" badge on the panel header. A "Reset to defaults" button appears and clicking it restores all values to defaults, removing the badge.
result: pass

### 5. Citation Popovers
expected: Each advanced parameter row has an info icon. Clicking it opens a popover with a research citation explaining where that parameter value comes from.
result: pass

### 6. Comparison Summary Cards
expected: ComparisonTab shows two summary cards with colored left borders — one for Shared cost (green) and one for Duplicated cost (red) — displaying total euro amounts.
result: pass

### 7. Break-Even Callout
expected: A callout shows when the shared approach becomes cheaper than duplicated (e.g., "Break-even at month X"). Green if within the time horizon, amber if break-even is not reached.
result: pass

### 8. Cost Chart with Dual Curves
expected: An area chart with two curves — green for shared cost, red for duplicated cost — plotted over months. A vertical reference line marks the break-even point. Axes show month labels and euro amounts.
result: pass

### 9. Chart Tooltip
expected: Hovering over the chart shows a tooltip with the month number, shared cost, duplicated cost, and the difference between them.
result: pass

### 10. Comparison Breakdown Table
expected: A side-by-side breakdown table showing cost categories (Initial Dev, Maintenance, Bug Propagation, Sync/Divergence, etc.) with Shared and Duplicated amounts for each row.
result: pass

### 11. Real-time Reactivity
expected: Changing any input (time horizon, team size, consuming teams count, or any advanced parameter slider) immediately recalculates and updates all outputs — summary cards, chart, breakdown table, break-even — without a submit button.
result: pass

### 12. Production Build
expected: Running `npm run build` completes successfully with zero errors and produces a dist/ folder.
result: pass

## Summary

total: 12
passed: 11
issues: 1
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "Consuming Teams input accepts values from 1 to 10"
  status: failed
  reason: "User reported: It should be able to go to 1"
  severity: major
  test: 2
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
