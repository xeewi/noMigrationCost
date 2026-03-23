# Phase 5: Comparison View, Chart, and Advanced Controls - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can compare shared code vs duplicated code total costs over time on a presentation-ready Recharts area chart, with a break-even annotation (or clear no-break-even message), a side-by-side breakdown table, and full control over all research-backed formula constants via an advanced parameters panel. The existing standalone cost view is preserved as its own tab.

</domain>

<decisions>
## Implementation Decisions

### Layout & Navigation
- **D-01:** Tabbed output — two tabs in the right column: "Standalone" and "Comparison". Uses shadcn Tabs component.
- **D-02:** Comparison tab is the default active tab on page load (core value prop).
- **D-03:** Standalone tab preserves the existing CostOutput behavior unchanged.
- **D-04:** Standalone total shown as a small badge/reference on the Comparison tab so users don't lose that context.
- **D-05:** Neither column is sticky — both scroll with the page (removes the Phase 4 sticky behavior).

### Comparison Tab Content (top to bottom)
- **D-06:** Two summary cards side-by-side: "Shared Path" total and "Duplicated Path" total, with the delta/savings highlighted.
- **D-07:** Break-even callout between summary cards and chart — success-styled when break-even exists ("Break-even at X months — you save €Y over Z years"), warning-styled when no break-even ("No break-even within Z years — shared code costs more in this scenario. Try increasing teams or time horizon.").
- **D-08:** Chart comes first (hero element for presentations), breakdown table below.
- **D-09:** Side-by-side breakdown table: Category | Shared (Hours, €) | Duplicated (Hours, €). Single table, not stacked. Extends existing table pattern.

### Chart Design
- **D-10:** Recharts Area chart with filled areas and transparency — makes the gap between approaches visually obvious.
- **D-11:** Colors: green for shared path, red for duplicated path. High contrast, intuitive (green = cheaper path).
- **D-12:** Break-even annotated with a vertical dashed line + text label using Recharts ReferenceLine. Omitted when no break-even exists.
- **D-13:** X-axis: monthly granularity (engine yearly data interpolated to monthly for smoother curves and precise break-even positioning).
- **D-14:** Y-axis: abbreviated euro format (€42K). Tooltip on hover shows exact values.
- **D-15:** Inline legend inside chart area showing "Shared Path" / "Duplicated Path" with color swatches.
- **D-16:** Interactive hover tooltips showing month, Shared cost, Duplicated cost, and the difference.
- **D-17:** Fixed chart height ~300-400px. Width fills the column via Recharts ResponsiveContainer.

### Advanced Parameters
- **D-18:** Collapsible section in the left column, below Time Horizon. Collapsed by default with "Advanced Parameters" disclosure header.
- **D-19:** Each parameter: slider + editable number input side-by-side. Slider shows the valid range, number input shows current value.
- **D-20:** Info icon [?] next to each parameter label — click/hover shows popover with research citation source.
- **D-21:** "Reset to defaults" button at the section level. Resets all formula constants to research-backed values.
- **D-22:** "Modified" badge visible on the Advanced Parameters header when any value differs from defaults.
- **D-23:** Parameters in the Advanced section: generalization factor (1.0-2.0, default 1.3), porting factor (0.3-1.0, default 0.65), divergence rate (0.05-0.50, default 0.20), maintenance rate shared (0.10-0.30, default 0.18), maintenance rate duplicated (0.15-0.40, default 0.22), bug duplication factor (1.0-3.0, default 2.0).

### Number of Consuming Teams
- **D-24:** "Number of consuming teams" (ADV-07) is placed in the main inputs area, below Time Horizon, as its own small card — NOT in the Advanced Parameters section. It's a core scenario parameter, not a formula constant.

### Claude's Discretion
- Component granularity and internal state management approach
- Specific shadcn/ui component choices for the slider (shadcn Slider or custom)
- Exact popover/tooltip implementation for citations
- Responsive breakpoint behavior for the comparison tab
- How to interpolate yearly engine data to monthly for the chart

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Cost Model & Formulas
- `docs/feature-cost-shared-vs-duplicated.md` §7.1 — Total cost formula for shared code approach (drives Shared Path card + curve)
- `docs/feature-cost-shared-vs-duplicated.md` §7.2 — Total cost formula for duplicated code approach (drives Duplicated Path card + curve)
- `docs/feature-cost-shared-vs-duplicated.md` §7.3 — Break-even calculation (drives break-even annotation + alert)
- `docs/feature-cost-shared-vs-duplicated.md` §7.5 — Divergence over time model (drives non-linear duplicated cost growth)
- `docs/feature-cost-shared-vs-duplicated.md` §1.3 — French developer salary data and source citations for tooltips

### Engine (already built in Phase 4)
- `src/engine/formulas.ts` — All cost functions: `calcSharedCost`, `calcDuplicatedCost`, `calcBreakEven` returning `SharedCostOutputs`, `DuplicatedCostOutputs`, `BreakEvenResult` with `YearCost[]` arrays
- `src/engine/types.ts` — `EngineInputs`, `ENGINE_DEFAULTS`, all output types

### Existing UI (Phase 4 output)
- `src/App.tsx` — Two-column layout, state management, existing standalone wiring
- `src/components/CostOutput.tsx` — Standalone cost display (preserved as Standalone tab)
- `src/components/TeamComposition.tsx` — Team input component
- `src/components/FeatureSizing.tsx` — Feature sizing component
- `src/components/TimeHorizon.tsx` — Time horizon preset buttons

### Stack & Patterns
- `CLAUDE.md` — Technology stack (React + Vite + TypeScript + shadcn/ui + Tailwind CSS + Recharts)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/engine/formulas.ts` — All cost calculation functions ready to use. Returns yearly breakdowns as `YearCost[]` arrays.
- `src/components/CostOutput.tsx` — Becomes the Standalone tab content as-is.
- `src/components/ui/card.tsx` — Card component for summary cards.
- `src/components/ui/table.tsx` — Table component for breakdown table.
- `src/components/ui/tabs.tsx` — Tabs component for Standalone/Comparison navigation.
- `src/components/ui/badge.tsx` — Badge component for "Modified" indicator and standalone total reference.
- `src/components/ui/toggle.tsx` — May be useful for collapsible section.

### Established Patterns
- State lifted to App.tsx with `useState` for raw inputs and `useMemo` for derived calculations
- Engine functions are pure — take `EngineInputs`, return structured outputs
- Two-column flex layout with `flex-[55]` / `flex-[45]` split
- shadcn/ui Card wrapping each input section

### Integration Points
- App.tsx state will expand to include advanced parameters (currently hardcoded from `ENGINE_DEFAULTS`)
- New components: ComparisonView (or ComparisonTab), CostChart, AdvancedParameters, ConsumingTeams
- CostOutput.tsx preserved, wrapped inside a Tab panel
- Recharts enters the codebase for the first time in this phase

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-comparison-view-chart-and-advanced-controls*
*Context gathered: 2026-03-23*
