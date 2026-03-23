# Pitfalls Research

**Domain:** Interactive cost calculator / comparison dashboard — standalone HTML/JS, no framework
**Researched:** 2026-03-23
**Confidence:** HIGH (formula-level pitfalls from domain doc + verified JS patterns from official sources)

---

## Critical Pitfalls

### Pitfall 1: Formula Drift — Calculator Output Diverges from Research Document

**What goes wrong:**
The formulas in sections 7.1–7.5 of the research document are multi-term, interdependent, and use named factors (GeneralizationFactor, PortingFactor, DivergenceFactor, DoubleMaintenance-Factor(year)). When implementing without a strict mapping, developers tend to flatten or simplify the formula at implementation time — dropping the time-varying `Double_Maintenance_Factor(year) = 1.8 + (0.05 × year)`, hardcoding factors that should be adjustable, or mis-scoping which cost is a one-time vs. recurring item.

**Why it happens:**
The formulas have 5–8 operands each. Without an explicit data model defined before touching the UI, developers implement "roughly correct" math inline in event handlers, adjusting it by feel until output looks plausible.

**How to avoid:**
Define a pure `model.js` (or equivalent named section in a single-file app) with all formulas as pure functions before writing any DOM code. Each function receives an explicit parameter object; no globals, no DOM reads inside the calculation. Write the numerical examples from the research doc as assertions or inline tests you can execute in the browser console to verify correctness before connecting inputs.

**Warning signs:**
- Output at year=1 doesn't match the worked example in section 7.1 (52,000 € cumulative shared cost with the default values).
- Graph lines are smooth when they should show a kink at year 0 (setup cost is one-time, not amortized).
- Break-even point shifts when you change a factor that has no logical connection to it.

**Phase to address:** Formula foundation phase — must be validated against the worked numerical examples from the research doc before any UI work begins.

---

### Pitfall 2: Global Mutable State Without a Clear Owner

**What goes wrong:**
In vanilla JS without a framework, state tends to scatter. The team count ends up in one `let`, salary data in DOM input values, the time horizon in a slider attribute, and calculated results cached on a chart instance. When any input changes, it's unclear what needs to recalculate and in what order. Bugs appear as stale values: changing the seniority mix recalculates costs but the break-even marker doesn't update because it reads the old cached result.

**Why it happens:**
Vanilla JS offers no reactive binding. Developers wire up one-off `addEventListener` calls as features are added, each reading from wherever state was stored at the time. Over 3–4 features this becomes tangled.

**How to avoid:**
Define a single `state` object at module level (or IIFE top level in single-file). All input handlers write to `state` only — never read from DOM, never call chart methods directly. A single `render(state)` function reads from `state` and updates all outputs (chart, table, break-even annotation). This is the observable-state pattern at its simplest and is well-suited to a single-file app.

**Warning signs:**
- An input change requires touching more than one event handler.
- You find yourself doing `document.getElementById('...').value` inside a calculation function.
- The chart and the summary table show different numbers for the same metric.

**Phase to address:** State architecture phase — establish the `state → render` pipeline before wiring any inputs.

---

### Pitfall 3: Floating-Point Errors in Cost Outputs

**What goes wrong:**
All cost figures are in euros. JavaScript's IEEE 754 doubles produce `0.1 + 0.2 === 0.30000000000000004`. For a cost tool, this means totals like "33,774.0000000003 €/year" and small rounding discrepancies between the table and the chart tooltip. More seriously, break-even calculations involving many compounding multiplications can accumulate enough error to shift the break-even year by ±1 in edge cases.

**Why it happens:**
Developers treat the calculator as a "math demo" where rounding is cosmetic. In practice the research doc's formulas chain 4–6 multiplications (e.g., `Nb_Devs × Hourly_Cost × Dev_Hours × GeneralizationFactor`), each potentially introducing drift.

**How to avoid:**
All intermediate calculations should work in integer euro-cents (multiply by 100 at input, divide at display). Alternatively, use `Math.round(value * 100) / 100` at every formula output boundary. For display, always use `toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })` — never raw `.toFixed(2)` which still suffers the same float issues.

**Warning signs:**
- Any displayed value ends in more than 2 decimal places.
- The sum of per-year cost components does not equal the cumulative total modulo rounding.
- Break-even year differs by 1 depending on whether you approach it from year N-1 or year N+1 in the loop.

**Phase to address:** Formula foundation phase — establish a rounding/display utility before any values are rendered.

---

### Pitfall 4: Break-Even May Not Exist — Unhandled No-Intersection Case

**What goes wrong:**
The break-even point is the year at which cumulative shared cost drops below cumulative duplicated cost. Under some parameter combinations (high coordination cost, very low divergence rate, short time horizon) the lines never cross within the configured horizon. The app crashes, displays NaN, or renders a broken annotation.

**Why it happens:**
Developers implement "find where duplicated > shared" assuming it always happens. In a 1-year horizon with a large generalization factor, shared costs can remain higher than duplicated costs for the entire period.

**How to avoid:**
The break-even search must return a nullable result (`null | number`). The UI must explicitly handle the null case with a clear message: "At current parameters, the shared approach does not reach break-even within the {N}-year horizon." This is also a useful signal to the user — it communicates model meaning, not a bug.

**Warning signs:**
- The break-even annotation always appears, even when cost curves don't visually cross.
- Console shows `NaN` or `Infinity` in break-even output for edge inputs.
- The annotation lands outside the chart's visible area.

**Phase to address:** Formula foundation phase (null-safe break-even calculation) + visualization phase (no-intersection UI state).

---

### Pitfall 5: Input Interdependencies Silently Produce Nonsensical Results

**What goes wrong:**
The calculator has many interdependent inputs: story points require velocity to produce hours; hours × hourly rate produces cost; hourly rate is derived from salary + employer contribution factor (1.42–1.45) ÷ 1607 hours. If a user enters 0 story points, or sets velocity to 0, or sets hourly cost to 0, downstream formulas return 0, Infinity, or NaN — often without any visible error.

**Why it happens:**
Input validation is added last (or not at all) because developers test with "realistic" values throughout development. Edge cases like velocity=0 don't arise naturally in development.

**How to avoid:**
Define explicit valid ranges for each input before building the form:
- Story points: 1–10,000
- Velocity: 1–200 (sp/sprint), never 0
- Salary: 1–500,000 €
- Time horizon: 1–10 years
- Generalization factor: 1.0–2.0

Guard every division operation: `velocity > 0 ? hours / velocity : 0`. Display inline validation messages on the inputs themselves, not console errors.

**Warning signs:**
- Any formula path containing division by a user-controlled value lacks a guard.
- Setting velocity slider to minimum produces chart with Infinity on the Y axis.
- Changing team composition to zero devs doesn't show a validation message.

**Phase to address:** Input/form phase — validation ranges established before any formula consumes input values.

---

### Pitfall 6: Chart Instance Memory Leak on Rerender

**What goes wrong:**
Chart.js (or any canvas-based library) maintains an internal registry of chart instances. If the canvas is re-created or `new Chart()` is called again on the same canvas element without destroying the previous instance, Chart.js throws a warning and overlays two invisible chart instances. After multiple parameter changes, the page slows noticeably as events accumulate on stale instances.

**Why it happens:**
The `render(state)` function naively calls `new Chart(canvas, config)` on every state change. This is the most common "it worked in the demo" bug for Chart.js usage in vanilla JS.

**How to avoid:**
Store the chart instance outside the render loop. On each render, call `chart.data.datasets[0].data = newData; chart.update()` rather than recreating. If the chart must be destroyed (e.g., type changes), always call `chart.destroy()` before creating a new instance. Wrap instance creation in a guard: `if (chartInstance) chartInstance.destroy();`.

**Warning signs:**
- Browser console shows "Canvas is already in use. Chart with ID N must be destroyed before the canvas can be reused."
- Page slows after 10–20 parameter changes.
- Chart tooltip shows duplicate data points.

**Phase to address:** Visualization phase — establish chart lifecycle management before connecting inputs.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline formula in event handler | Faster first pass | Formula logic entangled with DOM; can't unit test without browser | Never — extract to pure functions from day 1 |
| Read input values directly from DOM in calculations | Saves a state object | Breaks `render(state)` pattern; calc results depend on DOM order | Never — always pass explicit parameter objects |
| `chart.destroy()` + `new Chart()` on every render | Simple rerender logic | Memory leak, performance degradation after multiple changes | Only during initial prototyping, before connecting live inputs |
| Single flat `state` object for everything | Simple to start | Team config + feature config + calculation results in one bag; unrelated fields pollute change detection | Acceptable for MVP if namespaced: `state.team`, `state.feature`, `state.results` |
| Hardcoded default factors (1.3 generalization, 0.65 porting) | Fewer inputs to wire | User can't override; breaks requirement "Variables... are adjustable" | Never for this project — requirements explicitly demand adjustability |

---

## Integration Gotchas

This project has no external service integrations. The only "integrations" are browser APIs.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Chart.js via CDN | Pinning to `@latest` in script tag means future Chart.js breaking changes silently break the app | Pin to a specific version: `chart.js@4.4.x` |
| `localStorage` for state persistence | Storing the entire `state` object causes stale data if the schema changes between versions | Store only user-entered values (not calculated results); add a schema version key |
| Browser `print` / screenshot for export | Charts drawn on canvas do not appear in `window.print()` if CSS `display:none` is applied to non-print elements | Ensure canvas elements are included in print stylesheet; test `@media print` explicitly |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Recalculating all formulas on every keypress in a text input | Input lag, chart stutters while typing salary values | Debounce text inputs (300–500ms delay); sliders can update live | Noticeable from ~10 team members with complex multi-year projections |
| Generating all 10 years of data points on every render even when horizon=1 | Negligible — formulas are O(n) where n≤10 | Not a real concern at this scale; skip optimization | Never for this app's scale |
| Chart tooltip recalculating totals from raw data arrays | Tooltip shows wrong precision or lags | Precompute display values; store them alongside data points | Not a concern at 10 data points |

---

## Security Mistakes

This is a fully client-side, no-auth, no-server app. Security surface is minimal.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Using `innerHTML` to render user-provided team member names | XSS if the app is ever embedded in a page where names come from URL params or shared state | Use `textContent` for any user-entered strings; `innerHTML` only for trusted static HTML |
| Sharing the HTML file via URL with parameters encoding salary data | Salary data visible in URL, browser history, server logs if hosted | Use `#` fragment params (not `?` query params) if sharing state via URL; document this limitation |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Showing raw formula parameters (GeneralizationFactor=1.3) without context labels | Engineering leads understand; managers in stakeholder presentations do not | Label every adjustable factor with a plain-language explanation: "Generalization overhead (20–40% extra work to make code reusable)" |
| Y-axis starting at non-zero in cost curves | Graph visually exaggerates the gap between shared and duplicated costs | Always start Y-axis at 0 for cumulative cost graphs; this is a comparison tool used for decision-making |
| Break-even marker placed on the graph without a callout | Viewer misses the most important output of the tool | Annotate break-even prominently: large marker, text label "Break-even: Year 3", highlighted in the summary table |
| No loading/stable state between param changes | If debounce is active, chart briefly shows stale data while user is still typing | Show a subtle "Calculating…" state or disable the break-even annotation while inputs are dirty |
| Showing 10 years of data by default before user has set inputs | Graph with default placeholder values trains users to ignore it | Start collapsed or with a prompt; only show graph after required inputs (team + feature size) are filled |
| Table and graph showing same data redundantly without differentiation | Wastes screen space; users read one or the other | Table = per-year detail breakdown by cost category; Graph = cumulative curves with break-even. They serve different purposes — make this clear with section headers. |

---

## "Looks Done But Isn't" Checklist

- [ ] **Break-even calculation:** Does the app correctly show "no break-even" when curves don't cross within the time horizon? Test with GeneralizationFactor=2.0 and horizon=1 year.
- [ ] **Factor adjustability:** Every named factor from sections 7.1–7.5 of the research doc (GeneralizationFactor, PortingFactor, DoubleMaintenance base, DivergenceRate, MaintenanceRate) must be user-adjustable — not just displayed.
- [ ] **Story points ↔ hours conversion:** Changing velocity correctly updates all downstream cost calculations, not just the displayed hours field.
- [ ] **Per-member vs. team cost:** Verify that adding a second developer doubles the team cost, not the hourly rate.
- [ ] **Cumulative vs. annual display:** The graph must show cumulative cost (Σ years), not annual cost; the table shows annual breakdown. Verify by checking that graph year 3 = table year 1 + year 2 + year 3.
- [ ] **French salary defaults:** All four seniority levels (Junior, Mid, Senior, Lead) are pre-filled with the loaded hourly costs from section 1.3 of the research doc (32–68 €/h), not gross salary — since the formulas use hourly employer cost.
- [ ] **Time horizon slider:** At horizon=1, only Year 0 and Year 1 data points exist; break-even cannot be Year 0.5. Verify no interpolation artifacts.
- [ ] **Chart instance cleanup:** Open browser devtools, change parameters 20 times; confirm no "Canvas already in use" warnings and no memory growth.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Formula drift discovered after UI is built | HIGH | Extract all calculations to pure functions; run against research doc worked examples; fix formula, then reconnect UI |
| Scattered global state across DOM + variables | HIGH | Introduce explicit `state` object; audit every event handler to write to state only; replace all DOM reads in calc functions |
| Chart.js instance leak | LOW | Add `if (chartInstance) chartInstance.destroy()` before creation; takes ~30 min |
| Floating-point display errors | LOW | Add rounding utility, apply at all display call sites; ~1–2 hours |
| Missing no-break-even case | MEDIUM | Add null return to break-even function; add UI branch for null case; test with edge parameters |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Formula drift | Formula foundation (Phase 1) | Run worked examples from research doc sections 7.1–7.5 against pure functions in browser console |
| Global mutable state | State architecture (Phase 1) | All calc functions accept a plain object; no DOM reads inside them |
| Floating-point errors | Formula foundation (Phase 1) | All displayed values match expected output to 2 decimal places using rounding utility |
| No-break-even unhandled | Formula foundation (Phase 1) + Visualization (Phase 2) | Test with 1-year horizon and high generalization factor; confirm graceful "no break-even" message |
| Input interdependencies / division by zero | Input/form phase (Phase 2) | Systematically set each numeric input to 0 or minimum; confirm no NaN/Infinity in output |
| Chart instance memory leak | Visualization (Phase 2) | Open devtools memory profiler; change parameters 30 times; confirm heap stable |
| Adjustable factors not wired | Input/form phase (Phase 2) | Cross-check every named factor in research doc 7.1–7.5 against UI controls |
| UX label clarity for presentations | Polish/presentation phase (Phase 3) | Walk through dashboard with a non-technical stakeholder; verify break-even is understood without explanation |

---

## Sources

- Research document: `/docs/feature-cost-shared-vs-duplicated.md` (sections 7.1–7.5 — formula definitions and worked numerical examples)
- [How to Handle Monetary Values in JavaScript — frontstuff.io](https://frontstuff.io/how-to-handle-monetary-values-in-javascript)
- [Handle Money in JavaScript: Financial Precision Without Losing a Cent — DEV Community](https://dev.to/benjamin_renoux/financial-precision-in-javascript-handle-money-without-losing-a-cent-1chc)
- [currency.js documentation](https://currency.js.org/)
- [State Management in Vanilla JS: 2026 Trends — Medium](https://medium.com/@chirag.dave/state-management-in-vanilla-js-2026-trends-f9baed7599de)
- [Back to Basics: Mastering State Management in Vanilla JavaScript — Medium](https://medium.com/@asierr/back-to-basics-mastering-state-management-in-vanilla-javascript-e3be7377ac46)
- [Bad Data Visualization Examples to Avoid in 2025 — OWOX](https://www.owox.com/blog/articles/bad-data-visualization-examples)
- [Effective Dashboard Design Principles for 2025 — UXPin](https://www.uxpin.com/studio/blog/dashboard-design-principles/)
- [Chart.js documentation — instance lifecycle / destroy()](https://www.chartjs.org/docs/latest/developers/api.html)

---
*Pitfalls research for: Feature Cost Calculator — interactive comparison dashboard, standalone HTML/JS*
*Researched: 2026-03-23*
