# Phase 1: Inputs and Standalone Cost - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can configure a team, size a feature, set a time horizon, and see the total standalone cost calculated from research-backed French salary defaults. This phase builds the formula engine and all input UI — no comparison view, no chart, no URL sharing.

</domain>

<decisions>
## Implementation Decisions

### Team Composition
- **D-01:** Fixed 4-slot grid for team input — one row per seniority level (Junior/Mid/Senior/Lead) with a headcount field per row, no individual names
- **D-02:** Salary baseline is loaded cost (employer cost): Junior 32€/h, Mid 40€/h, Senior 51€/h, Lead 67€/h — based on gross × 1.42 / 1607h
- **D-03:** Hourly cost per seniority is editable — user can override the default €/h value in each row
- **D-04:** Team average hourly cost displays in real-time below the grid

### Feature Sizing
- **D-05:** Tab-switch UX for Story Points vs Direct Hours — only one mode visible at a time
- **D-06:** Story Points tab shows: SP field, velocity (SP/sprint) field, sprint duration dropdown (1-4 weeks)
- **D-07:** Direct Hours tab supports hours or days with a toggle (×7h/day conversion)
- **D-08:** Estimated development hours derived from inputs shown below the active tab

### Time Horizon
- **D-09:** Preset buttons for time horizon: 1, 3, 5, 10 years — one active at a time, no slider

### Cost Output
- **D-10:** Summary card with prominent total cost number at top, then breakdown table below
- **D-11:** Breakdown table columns: Category, Hours, Cost (€), Percentage — rows: initial dev, maintenance, coordination, bugs, sync
- **D-12:** All outputs recalculate in real-time as inputs change — no "Calculate" button (leverages Alpine.js reactivity)

### Page & Structure
- **D-13:** Light theme by default (Pico CSS light mode) — optimized for projector presentations
- **D-14:** Split file structure: index.html (markup), app.js (Alpine components + logic), data.js (salary constants, research defaults), styles.css (Pico overrides)

### Claude's Discretion
- **D-15:** Page layout arrangement (top-down vs two-column) — Claude decides based on Pico CSS strengths and Phase 2 chart integration needs

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Cost Model & Formulas
- `docs/feature-cost-shared-vs-duplicated.md` §1.2 — Story point estimation model and velocity reference data
- `docs/feature-cost-shared-vs-duplicated.md` §1.3 — French developer salary data (loaded costs, 1607h/year, seniority tiers)
- `docs/feature-cost-shared-vs-duplicated.md` §7.1 — Total cost formula for shared code approach (formula engine foundation)
- `docs/feature-cost-shared-vs-duplicated.md` §7.2 — Total cost formula for duplicated code approach (formula engine foundation)

### Stack & Patterns
- `CLAUDE.md` — Technology stack (Alpine.js 3.15.8, Chart.js 4.5.1, Pico CSS 2.1.1), CDN load order, file structure patterns

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing code — greenfield project

### Established Patterns
- Stack defined in CLAUDE.md: Alpine.js for reactivity, Pico CSS for semantic styling, Chart.js for charts (Phase 2)
- File structure pattern: index.html + app.js + data.js + styles.css
- CDN-only dependencies, no build step, no ES Module imports (file:// protocol compatibility)

### Integration Points
- data.js will export salary constants and formula defaults that app.js consumes
- Formula engine functions in app.js will be reused by Phase 2 (comparison calculations)
- Time horizon selection state will be shared with Phase 2 chart

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

*Phase: 01-inputs-and-standalone-cost*
*Context gathered: 2026-03-23*
