# Phase 4: Scaffold, Engine, and Standalone Cost - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can configure a team (seniority grid with headcount), size a feature (story points or direct hours), select a time horizon, and see the standalone feature cost calculated from research-backed French salary defaults. This phase also builds the **full formula engine** (shared, duplicated, break-even, divergence) verified against research doc worked examples — but only the standalone cost UI is wired up. The comparison view, chart, and advanced controls come in Phase 5.

</domain>

<decisions>
## Implementation Decisions

### Page Layout
- **D-01:** Two-column layout — inputs (team, sizing, time horizon) on the left, cost output on the right
- **D-02:** Cost output column is sticky — stays visible while scrolling inputs
- **D-03:** No header/nav bar — jump straight into the calculator content
- **D-04:** Responsive: columns stack vertically below ~768px breakpoint (inputs on top, cost below)

### Team Composition
- **D-05:** Fixed 4-row seniority grid (Junior/Mid/Senior/Lead) with headcount field per row — no individual names
- **D-06:** Salary baseline is French loaded cost: Junior 32€/h, Mid 40€/h, Senior 51€/h, Lead 67€/h
- **D-07:** Hourly cost per seniority is editable — user can override the default €/h value
- **D-08:** Headcount=0 means that seniority level is not used (fulfills TEAM-04 "remove" requirement)
- **D-09:** Team average hourly cost displays in real-time below the grid

### Feature Sizing
- **D-10:** Tab-switch UX for Story Points vs Direct Hours — only one mode visible at a time
- **D-11:** Story Points tab: SP field, velocity (SP/sprint) field, sprint duration dropdown (1-4 weeks)
- **D-12:** Direct Hours tab supports hours or days with a toggle (×7h/day conversion)
- **D-13:** Estimated development hours derived from inputs shown below the active tab

### Time Horizon
- **D-14:** Preset buttons for time horizon: 1, 3, 5, 10 years — one active at a time, no slider

### Cost Output
- **D-15:** Summary card with prominent total cost number at top, then breakdown table below
- **D-16:** Breakdown table columns: Category, Hours, Cost (€), Percentage
- **D-17:** Standalone view shows only relevant categories: initial dev + maintenance. Coordination, bugs (propagation), and sync are comparison-specific — introduced in Phase 5.
- **D-18:** All outputs recalculate in real-time as inputs change — no "Calculate" button

### Formula Engine
- **D-19:** Full engine built in Phase 4 — all formula functions (shared cost, duplicated cost, break-even, divergence) as a pure TypeScript module
- **D-20:** Unit tests verified against research doc worked examples (sections 7.1-7.5) BEFORE any UI is built — engine-before-UI discipline
- **D-21:** Separate pure functions per formula (calcSharedCost, calcDuplicatedCost, calcBreakEven, etc.) — composable, testable, clear mapping to research doc sections

### Claude's Discretion
- Component granularity and React state management approach
- shadcn/ui component selection for each input type
- File/folder structure within the React project

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Cost Model & Formulas
- `docs/feature-cost-shared-vs-duplicated.md` §1.2 — Story point estimation model and velocity reference data
- `docs/feature-cost-shared-vs-duplicated.md` §1.3 — French developer salary data (loaded costs, 1607h/year, seniority tiers)
- `docs/feature-cost-shared-vs-duplicated.md` §7.1 — Total cost formula for shared code approach
- `docs/feature-cost-shared-vs-duplicated.md` §7.2 — Total cost formula for duplicated code approach
- `docs/feature-cost-shared-vs-duplicated.md` §7.3 — Break-even calculation
- `docs/feature-cost-shared-vs-duplicated.md` §7.4 — Scale factor formula
- `docs/feature-cost-shared-vs-duplicated.md` §7.5 — Divergence over time model

### Stack & Patterns
- `CLAUDE.md` — Technology stack (React + Vite + TypeScript + shadcn/ui + Tailwind CSS + Recharts), constraints, conventions

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing code — greenfield React project (no src/ directory yet)

### Established Patterns
- Stack defined in CLAUDE.md: React 19 + Vite + TypeScript + shadcn/ui + Tailwind CSS 4 + Recharts
- Engine-before-UI discipline carried from Phase 1 context and STATE.md decisions

### Integration Points
- Formula engine module will be consumed by Phase 5 comparison UI and Recharts visualization
- Team/sizing/time horizon state will be shared with Phase 5 chart and advanced controls
- Standalone cost breakdown table structure will extend to include comparison columns in Phase 5

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

*Phase: 04-scaffold-engine-and-standalone-cost*
*Context gathered: 2026-03-23*
