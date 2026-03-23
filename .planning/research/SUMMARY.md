# Project Research Summary

**Project:** noMigrationCost — Shared vs Duplicated Code Cost Calculator
**Domain:** Standalone interactive HTML/JS TCO comparison dashboard
**Researched:** 2026-03-23
**Confidence:** HIGH (stack and architecture), MEDIUM (features — novel niche with no direct competitor)

## Executive Summary

This is a standalone, no-build, single-file HTML/JS dashboard that quantifies the long-term cost of duplicating code across teams versus building shared code once. The target user is an engineering lead or architect who needs to persuade stakeholders using a credible, research-backed model. The research doc (`/docs/feature-cost-shared-vs-duplicated.md`) provides worked numerical examples and multi-term formulas (sections 7.1–7.5) that are the authoritative source for every calculation — all implementation decisions flow from that document. The tool has no direct competitor; the closest analogues (Azure TCO Calculator, Codacy tech-debt tools) lack the distinguishing features: divergence rate modeling, per-copy compounding cost, and coordination overhead as explicit line items.

The recommended approach is disciplined bottom-up construction: implement the calculation engine as pure, testable functions first, wire in a minimal state object and a single `render()` function, then layer the HTML inputs and Chart.js visualization on top. This order is mandatory because formula drift and scattered state are the two pitfalls with the highest recovery cost. The stack is intentionally minimal — Alpine.js for reactive input binding, Chart.js for cumulative cost curves, Pico CSS for semantic styling — all loaded via CDN with no build step, so the delivered artifact is a single file that opens in any browser with no setup.

The key risks are: (1) formula implementation that diverges from the research doc's worked examples, (2) scattered global state that causes chart and table to show different values, and (3) the break-even calculation failing silently for edge-case parameter combinations where costs never cross within the time horizon. All three risks are preventable by enforcing architecture discipline before any UI work begins.

## Key Findings

### Recommended Stack

The stack is deliberately minimal and build-free. CDN load order matters: Pico CSS first, Chart.js second, Alpine.js last with `defer` (Alpine initializes on DOMContentLoaded and must find `x-data` attributes already in the HTML). Chart.js must be loaded before Alpine so chart instances can be created inside Alpine `init()` hooks.

**Core technologies:**
- **Vanilla HTML/CSS/JS (browser-native):** Application shell — no toolchain, no deployment friction; double-clicking the file opens it
- **Alpine.js 3.15.8:** Reactive UI binding (sliders, form inputs, show/hide, computed values) — 7.1 KB gzipped, CDN-only, attribute-driven; handles 100% of the reactivity this app needs without a build step
- **Chart.js 4.5.1:** Cumulative cost curves and break-even visualization — 60 KB minified, canvas-based (no SVG DOM overhead), excellent animation defaults for temporal line charts
- **Pico CSS 2.1.1:** Base styling — styles semantic HTML tags directly, no classes needed for tables/inputs/buttons, 8 KB gzipped, presentation-ready defaults

**Important constraint:** Do not use ES Module imports (`type="module"`) if the file will be opened via `file://` — Chromium and Firefox block ES Modules on the file protocol. Use plain `<script>` tags in dependency order.

See: `.planning/research/STACK.md`

### Expected Features

No direct competitor exists for this specific comparison. The tool needs to match the UX expectations of general TCO calculators (Azure, AWS) while delivering insights none of them provide.

**Must have (table stakes):**
- Team composition input (member names, seniority, loaded hourly cost) — base unit for every downstream calculation
- Feature size input via story points + velocity, or direct hours — covers agile and non-agile teams
- Time horizon slider (1–10 years) — standard for all TCO tools
- Shared vs duplicated comparison with N-copy input — the core product value
- Break-even point as text callout and chart annotation — the single most decision-relevant output
- Temporal cumulative cost curves (dual lines, break-even marker) — required for stakeholder presentations
- Cost breakdown table by category (initial dev, maintenance, coordination, bugs, divergence) — required for credibility
- Research-backed defaults pre-filled for all formula constants — enables immediate use without configuration
- Overridable advanced inputs for all formula constants — explicitly required by the project spec

**Should have (differentiators — add before first external presentation):**
- Divergence rate modeling over time (non-linear cost growth for duplicated path) — unique insight unavailable in any TCO tool
- URL-encoded state for scenario sharing (no account, no database) — practical for presenting to multiple audiences
- Inline citation tooltips per formula constant — stakeholder credibility when numbers are challenged
- Per-copy compounding cost breakdown (N teams) — surfaces the "3× is not 3×" insight

**Defer (v2+):**
- Mobile-responsive layout — desktop presentations are the validated use case
- Additional locale salary datasets (UK, Germany, US) — validate French market first
- Historical scenario comparison (multiple saved configurations) — URL sharing covers the v1 need
- PDF export — browser Print-to-PDF is documented as sufficient for v1

**Anti-features to avoid:** User accounts, persistent storage, real-time collaboration, full COCOMO II, multi-language toggle.

See: `.planning/research/FEATURES.md`

### Architecture Approach

The architecture is a layered, single-source-of-truth pattern: one `APP_STATE` object is the only place data lives. Controllers write to it; the calculation engine reads from it and writes outputs back to it; a single `render(state)` function reads from it to update the DOM and chart. This prevents the chart and summary table from diverging, and makes the app debuggable by logging the state object. The calculation engine must be pure functions with no DOM access — this is non-negotiable for a numerics-heavy app where formula correctness must be verifiable against worked examples.

**Major components:**
1. **Reference Data** (`REFERENCE_DATA` constant) — French salary defaults, loaded-cost multipliers, divergence rates, COCOMO factors; read-only at runtime; every value cites its research doc section
2. **Calculation Engine** (pure functions) — `StandaloneCalc`: story points → effort → cost; `ComparisonCalc`: shared vs duplicated costs over N years, break-even detection returning `null | number`
3. **State Store** (`APP_STATE`) — single plain JS object; mutated only by Controller; read by Engine and render functions
4. **Controller** — DOM event handlers that write to state, call Engine, trigger render; no calculation logic
5. **HTML Shell + Pico CSS** — static layout skeleton; team input section, factor sliders, results area, chart canvas
6. **Chart Panel** — one Chart.js instance per canvas, held in a module-level variable; updated via `chart.data.datasets[n].data = newData; chart.update()` (never destroy/recreate on state change)
7. **Results Summary** — `renderResults(state)` reads state, writes to DOM; isolated from Engine

**Suggested build order (bottom-up, dependency-driven):**
Reference Data → Calculation Engine (test in console against worked examples) → HTML Shell → Chart Initialization → State Store + Controller → Render Functions → Standalone Cost View → Comparison + Break-even View → Polish

See: `.planning/research/ARCHITECTURE.md`

### Critical Pitfalls

1. **Formula drift from the research document** — The formulas in sections 7.1–7.5 are multi-term with time-varying coefficients (e.g., `Double_Maintenance_Factor(year) = 1.8 + 0.05 × year`). Implement all formulas as pure functions first, then validate each against the worked numerical examples in the research doc before touching the UI. If year=1 output does not match the doc's 52,000 € example, stop and fix the formula.

2. **Scattered global state** — In vanilla JS, state tends to accumulate in DOM values, component variables, and chart internals. Enforce the `APP_STATE` single-object pattern from day one. Every event handler writes to `APP_STATE` and calls `render()`; no DOM reads inside calculation functions. The warning sign is chart and table showing different values for the same metric.

3. **Floating-point errors in euro outputs** — Chain-multiplied formulas (e.g., `Nb_Devs × Hourly_Cost × Dev_Hours × GeneralizationFactor`) accumulate IEEE 754 drift. Apply `Math.round(value * 100) / 100` at every formula output boundary. Display using `toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })`. This can shift the break-even year by ±1 if not handled.

4. **Unhandled no-break-even case** — Under high generalization factor or short time horizon, cumulative costs never cross. The break-even function must return `null | number`. The UI must explicitly display "No break-even within [N]-year horizon" — this is a meaningful model output, not a bug. Test with `GeneralizationFactor=2.0` and `horizon=1`.

5. **Chart.js instance memory leak** — Calling `new Chart()` on every render without destroying the previous instance causes stale event accumulation and console warnings. Store the instance in a module-level variable; call `chart.data.datasets[n].data = newData; chart.update()` on state changes.

6. **Input interdependency division-by-zero** — `velocity=0` or `team size=0` produces `Infinity` or `NaN` that propagates silently through all downstream calculations. Every division by a user-controlled value needs an explicit guard (`velocity > 0 ? ... : 0`) with inline validation messages on the input.

See: `.planning/research/PITFALLS.md`

## Implications for Roadmap

The architecture research defines a clear build order with hard dependencies. Phases must follow this order — building the UI before validating the engine is the #1 recovery-cost pitfall identified in research.

### Phase 1: Formula Foundation and State Architecture

**Rationale:** The calculation engine and state object must exist and be verified before any UI is built. Recovery cost if formula drift is discovered after UI construction is HIGH. All downstream phases depend on a correct, tested engine. This phase has no external dependencies and requires no rendering — it is pure logic.

**Delivers:** Verified `REFERENCE_DATA` constants, pure calculation functions for all formulas in research doc sections 7.1–7.5, break-even function with null-safe return, rounding utility for euro display, `APP_STATE` schema, controller pattern established.

**Addresses features:** None visible yet — this phase is invisible to users but enables all subsequent phases.

**Avoids pitfalls:** Formula drift (pitfall 1), floating-point errors (pitfall 3), no-break-even unhandled case (pitfall 4), scattered global state (pitfall 2).

**Verification gate:** All worked numerical examples from research doc sections 7.1–7.5 pass in browser console. Break-even returns `null` for `GeneralizationFactor=2.0`, `horizon=1`.

### Phase 2: HTML Shell, Input Form, and Static Layout

**Rationale:** With a verified engine, the HTML structure and input form can be built knowing exactly what state fields are needed. This phase establishes the layout that all remaining phases build into. Pico CSS handles semantic styling without custom class work.

**Delivers:** Functional input form (team composition, story points or hours, velocity, time horizon slider, factor inputs), static layout skeleton, CDN links loaded in correct order, `APP_STATE` connected to input events, standalone cost calculation visible.

**Uses:** Alpine.js for reactive form binding, Pico CSS for layout, Controller pattern from Phase 1.

**Addresses features:** Team composition input, feature size input (SP + hours), time horizon slider, research-backed defaults pre-filled, standalone feature cost output (validates engine before comparison is added).

**Avoids pitfalls:** Input interdependency / division-by-zero (pitfall 6 — validation ranges established here).

### Phase 3: Comparison Engine and Chart Visualization

**Rationale:** The comparison view (shared vs duplicated curves) is the core product value and depends on both the verified engine (Phase 1) and the state/input infrastructure (Phase 2). The Chart.js instance lifecycle must be established before inputs are connected to avoid the memory leak pitfall.

**Delivers:** Dual cumulative cost curves (shared path vs duplicated path), break-even annotation on chart (or "no break-even" UI state), N-copy input for number of teams, cost breakdown table by category (initial dev, maintenance, coordination, bugs, divergence).

**Uses:** Chart.js 4.5.1, `updateChart()` pattern (mutate data in place, call `chart.update()`), `renderResults(state)` function.

**Addresses features:** Shared vs duplicated comparison, temporal cost curves, break-even point, cost breakdown table, divergence rate modeling.

**Avoids pitfalls:** Chart instance memory leak (pitfall 5 — instance stored in module-level variable, never recreated on render).

### Phase 4: Advanced Inputs, Overrides, and Presentation Polish

**Rationale:** Once the core calculation and visualization work, the differentiating features (overridable factors, divergence modeling controls, presentation-ready styling) are safe to add. These enhance the core without changing it. UX polish for stakeholder presentations belongs here.

**Delivers:** All named formula constants (GeneralizationFactor, PortingFactor, DoubleMaintenance base, DivergenceRate, MaintenanceRate) user-adjustable via sliders or inputs; plain-language labels on all factor inputs (not raw parameter names); break-even prominently annotated with text callout; Y-axis starting at 0; per-copy coordination overhead visible as cost line; text summary of model assumptions.

**Addresses features:** Overridable advanced inputs, divergence rate modeling (non-linear), coordination overhead as explicit cost line, generalization factor adjustment, annotation of research citations (tooltip per coefficient).

**Avoids pitfalls:** Hardcoded factors (technical debt pattern — factors must be adjustable per requirements), UX label clarity for presentations.

### Phase 5: Sharing and Export (v1.x)

**Rationale:** URL-encoded state and presentation-ready export are additive features that do not change the core model. They should be added after at least one real stakeholder use to confirm the browser Print-to-PDF path is insufficient.

**Delivers:** URL hash state encoding for scenario sharing (no server, no account), citation tooltips per formula constant, chart export guidance (SVG/PNG or browser print), validation that `#` fragment params (not `?` query params) are used to keep salary data out of server logs.

**Addresses features:** URL-encoded state / scenario sharing, citation annotations (tooltips), chart export.

### Phase Ordering Rationale

- **Engine before UI** is mandated by the PITFALLS research: formula drift discovered after the UI is built has HIGH recovery cost. Building engine first means the UI is assembled around a proven model.
- **Input form before chart** because Chart.js needs real state values to initialize with; connecting an empty chart to unvalidated inputs creates ambiguous bugs.
- **Core comparison before advanced factors** because advanced inputs are overrides of working defaults — they cannot be tested until the default-driven comparison works correctly.
- **Sharing/export last** because they are genuinely additive and do not block stakeholder use.

### Research Flags

Phases with standard, well-documented patterns (skip research-phase during planning):
- **Phase 2** — HTML form construction + Alpine.js reactive binding is well-documented in Alpine docs; no novel patterns
- **Phase 3** — Chart.js line chart + dataset update pattern is thoroughly documented in official docs and confirmed in architecture research
- **Phase 5** — URL hash encoding is a standard browser pattern; no research needed

Phases that may benefit from targeted research during planning:
- **Phase 1** — The formula implementation should be traced against `/docs/feature-cost-shared-vs-duplicated.md` sections 7.1–7.5 directly; the research doc is the primary source and must be read closely before coding begins. No external research needed, but a formula-mapping exercise (research doc → function signatures) is recommended as a pre-coding step.
- **Phase 4** — UX patterns for factor sliders in technical tools may benefit from a brief look at comparable calculators (HubSpot TCO, Commercetools) to confirm labeling conventions for non-technical stakeholders.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All library versions confirmed from official GitHub releases and jsDelivr; CDN load order confirmed from Alpine.js official install docs |
| Features | MEDIUM | Table stakes inferred from Azure TCO / Codacy analogues; differentiators derived from the project research doc and competitive gap analysis — novel domain, no direct competitor to benchmark against |
| Architecture | HIGH | Centralized state + pure engine + single render loop is a well-established pattern for vanilla JS dashboards; anti-patterns confirmed from Chart.js official docs and JS state management sources |
| Pitfalls | HIGH | Formula-level pitfalls derived directly from the project research doc worked examples (sections 7.1–7.5); Chart.js and floating-point pitfalls confirmed from official and community sources |

**Overall confidence:** HIGH for build approach and architecture; MEDIUM for feature prioritization beyond the MVP core (the tool's niche is novel and no direct competitor validation exists).

### Gaps to Address

- **Exact formula mapping:** The research doc (`/docs/feature-cost-shared-vs-duplicated.md`) sections 7.1–7.5 contain the authoritative formulas. A formula-to-function mapping exercise should be done as the first step of Phase 1, before writing any code — this is not a research gap but an implementation prerequisite.
- **French salary defaults:** The research doc section 1.3 provides loaded hourly costs for four seniority levels (32–68 €/h). These must be transcribed exactly into `REFERENCE_DATA` — not derived from gross salary. Verify during Phase 1.
- **Validation ranges for inputs:** Exact min/max values for story points, velocity, salary, time horizon, and factor sliders are documented in PITFALLS.md but should be confirmed against the research doc before Phase 2 form construction.
- **Break-even edge case behavior:** The UX for "no break-even within horizon" needs a design decision before Phase 3: inline chart message, summary table callout, or both. Decide before implementing the visualization.

## Sources

### Primary (HIGH confidence)
- `/docs/feature-cost-shared-vs-duplicated.md` — formula definitions, worked numerical examples, French salary data, COCOMO factors (sections 1.3, 7.1–7.5)
- Alpine.js GitHub releases + official install docs — v3.15.8 confirmed stable, CDN URL and defer requirement verified
- Chart.js GitHub releases + official API docs — v4.5.1 confirmed latest stable; instance lifecycle patterns verified
- Pico CSS GitHub releases — v2.1.1 confirmed latest

### Secondary (MEDIUM confidence)
- Azure TCO Calculator (feature UX reference, being deprecated Aug 2025) — table stakes feature expectations
- Codacy Technical Debt Calculator — cost breakdown table conventions
- HubSpot TCO Calculator — advanced input UX reference
- WebSearch: "vanilla JS reactive UI without framework no build step 2025" — Alpine.js as standard confirmed across multiple sources

### Tertiary (LOW confidence)
- ECharts v6.0.0 (July 2025 release, new major) — considered and rejected in favor of Chart.js for this use case; bundle size differential confirmed
- Vibidsoft / NamasteDev state management articles (2025/2026) — supporting evidence for centralized state pattern

---
*Research completed: 2026-03-23*
*Ready for roadmap: yes*
