# Architecture Research

**Domain:** Standalone interactive calculator dashboard (HTML/CSS/JS, no framework, no build step)
**Researched:** 2026-03-23
**Confidence:** HIGH — well-established vanilla JS patterns for this exact problem class

## Standard Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────────┐
│                         HTML Shell                             │
│  (index.html — layout skeleton, CDN script tags, CSS link)     │
├────────────────────────────────────────────────────────────────┤
│                        UI Layer                                │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Input Panel │  │  Results     │  │  Chart Panel          │  │
│  │  (team, SP,  │  │  Summary     │  │  (cumulative cost     │  │
│  │  horizon,    │  │  (standalone │  │   curves, break-even  │  │
│  │  factors)    │  │   + compare) │  │   highlight)          │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬────────────┘  │
│         │                 │                      │              │
├─────────┴─────────────────┴──────────────────────┴──────────────┤
│                     Controller Layer                           │
│         (event listeners → validate → call engine)             │
├────────────────────────────────────────────────────────────────┤
│                    Calculation Engine                          │
│  ┌────────────────────┐  ┌─────────────────────────────────┐   │
│  │  StandaloneCalc    │  │  ComparisonCalc                 │   │
│  │  (story pts →      │  │  (shared cost vs dup cost,      │   │
│  │   effort → cost)   │  │   break-even year, divergence)  │   │
│  └────────────────────┘  └─────────────────────────────────┘   │
├────────────────────────────────────────────────────────────────┤
│                      State Store                               │
│  (plain JS object, single source of truth, mutated in place    │
│   then triggers re-render via custom events or direct calls)   │
├────────────────────────────────────────────────────────────────┤
│                   Reference Data Layer                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  constants.js / embedded <script>                        │   │
│  │  (French salary defaults, loaded cost multipliers,       │   │
│  │   maintenance ratios, divergence rates, COCOMO factors)  │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| HTML Shell | Layout skeleton, CDN includes (Chart.js), section anchors | All — structural container |
| Input Panel | Collect user inputs: team members + seniority, story points or hours, velocity, time horizon, adjustable factors | Controller (on change events) |
| State Store | Single plain JS object holding all input values and derived outputs; mutated by Controller, read by UI and Engine | Controller (write), Results Panel (read), Chart Panel (read) |
| Calculation Engine | Pure functions: StandaloneCalc (effort → cost) and ComparisonCalc (shared vs dup over N years, break-even) | State Store (read inputs), State Store (write outputs) |
| Results Summary | Render text/table outputs: standalone cost, per-year cost table, break-even highlight | State Store (read) |
| Chart Panel | Render Chart.js cumulative cost curves; update datasets on state change | State Store (read), Chart.js API |
| Controller | Wire DOM events to state mutations, call Engine, trigger re-render | Input Panel (listen), State Store (write), Engine (call), UI (update) |
| Reference Data | Static JS object of constants embedded at page load | Engine (read), Input Panel (read for defaults) |

## Recommended Project Structure

Two viable approaches for this project. Choose based on complexity tolerance.

### Option A: Single File (simplest, most shareable)

```
index.html
├── <link> css block (inline or <style> tag)
├── <script src="https://cdn.jsdelivr.net/npm/chart.js">
└── <script>
    ├── // --- REFERENCE DATA ---
    ├── // --- STATE STORE ---
    ├── // --- CALCULATION ENGINE ---
    ├── // --- CHART MANAGER ---
    ├── // --- RENDER FUNCTIONS ---
    ├── // --- EVENT WIRING ---
    └── // --- INIT ---
```

**When to use:** Strongly preferred for this project. Opens as a file:// in a browser, zero setup, trivially shareable. Comments serve as module boundaries.

### Option B: Multi-File (clearer separation, same constraints)

```
index.html            # Shell and layout
css/
└── style.css         # All styles
js/
├── data.js           # Reference constants (salaries, ratios, factors)
├── state.js          # State store and mutation helpers
├── engine.js         # Pure calculation functions
├── charts.js         # Chart.js wrapper and update logic
├── render.js         # DOM update functions
└── main.js           # Event wiring and init
```

**When to use:** If a single file exceeds ~600 lines and becomes hard to navigate. All files loaded as `<script>` tags in order — no bundler needed.

### Structure Rationale

- **Calculation engine separate from rendering:** Pure functions are testable in a browser console. Critical for a math-heavy app where numbers must be trusted.
- **Reference data separate from engine:** Allows salary/ratio updates without touching calculation logic. Stake-holders may request data adjustments.
- **State store as single source of truth:** Prevents UI and chart from diverging. One render cycle per user action.
- **No module imports (ES Modules `type="module"`):** ES Modules are blocked on `file://` protocol in Chromium/Firefox without a server. For a file:// app, use plain `<script>` tags in order. If served via any static host (even `python -m http.server`), ES Modules work fine — decide at project start.

## Architectural Patterns

### Pattern 1: Centralized State Object + Explicit Re-render

**What:** A single `APP_STATE` object is the only place data lives. Controller mutates it, then calls `render()`. No reactive magic.

**When to use:** Always for this project. Total input/output state fits in one small object. Reactive proxies add complexity with no benefit at this scale.

**Trade-offs:** Simple to debug (log the state object). Slightly more verbose than reactive patterns. Synchronous — fine for CPU-light calculations.

**Example:**
```javascript
const APP_STATE = {
  team: [
    { name: 'Alice', seniority: 'senior' }
  ],
  storyPoints: 20,
  velocity: 40,         // SP per sprint
  horizonYears: 3,
  portingFactor: 0.65,
  divergenceRate: 0.05,
  // outputs (written by engine)
  standalone: null,
  comparison: null
};

function onInputChange() {
  APP_STATE.storyPoints = parseInt(document.getElementById('sp').value);
  runEngine();
  render();
}
```

### Pattern 2: Pure Calculation Engine

**What:** All formulas live in stateless functions that take inputs and return outputs. No DOM access, no side effects.

**When to use:** Always — separation is critical for a numerics-heavy app. Allows console testing of formulas independently.

**Trade-offs:** Requires a thin controller layer to bridge DOM inputs and engine calls. Worth it.

**Example:**
```javascript
function calcStandaloneCost(storyPoints, velocity, sprintDurationH, team) {
  const hoursPerSP = sprintDurationH / velocity;
  const effortHours = storyPoints * hoursPerSP;
  const avgHourlyCost = avgHourlyRate(team);
  return effortHours * avgHourlyCost;
}

function calcBreakEven(sharedCosts, dupCosts) {
  for (let yr = 0; yr < sharedCosts.length; yr++) {
    if (sharedCosts[yr] <= dupCosts[yr]) return yr;
  }
  return null; // no break-even in horizon
}
```

### Pattern 3: Chart.js Instance Management

**What:** Create one Chart instance per canvas on init. On state change, mutate `chart.data.datasets[n].data` and call `chart.update()`. Never destroy/recreate.

**When to use:** Always with Chart.js for interactive dashboards. Destroy/recreate causes flicker and loses animation state.

**Trade-offs:** Requires holding chart instance references in a module-level variable. Minimal complexity.

**Example:**
```javascript
let costChart = null;

function initChart() {
  costChart = new Chart(document.getElementById('costCanvas'), {
    type: 'line',
    data: { labels: [], datasets: [
      { label: 'Shared Code', data: [], borderColor: '#4f46e5' },
      { label: 'Duplicated',  data: [], borderColor: '#ef4444' }
    ]},
    options: { ... }
  });
}

function updateChart(yearLabels, sharedData, dupData) {
  costChart.data.labels = yearLabels;
  costChart.data.datasets[0].data = sharedData;
  costChart.data.datasets[1].data = dupData;
  costChart.update();
}
```

## Data Flow

### Input Change Flow

```
User changes input (slider, text field, select)
    ↓
DOM event listener (input/change)
    ↓
Controller: read value → validate → mutate APP_STATE
    ↓
Engine: calcStandaloneCost(APP_STATE) → APP_STATE.standalone
        calcComparisonCosts(APP_STATE) → APP_STATE.comparison
    ↓
render(): updateDOM(APP_STATE) + updateChart(APP_STATE)
```

### Initialization Flow

```
DOMContentLoaded
    ↓
loadReferenceData() → populate APP_STATE defaults (French salaries, factors)
    ↓
initChart() → create Chart.js instance on canvas
    ↓
wireEvents() → attach all input listeners
    ↓
render() → first render with defaults (so app is functional on load)
```

### State Management

```
APP_STATE (single object)
    ↑ mutated by        ↓ read by
  Controller         Engine → outputs written back to APP_STATE
                     render() → DOM updates
                     updateChart() → Chart.js updates
```

### Key Data Flows

1. **Team composition → hourly cost:** Team array (seniority levels + optional overrides) → `avgHourlyRate()` → weighted average → used by all cost formulas.
2. **Story points → effort → cost:** SP × (sprint hours / velocity) = effort hours × hourly rate = initial cost.
3. **Year N cumulative cost:** Loop 0..horizonYears, accumulate shared and dup costs per year → two arrays → passed to Chart.js + table render.
4. **Break-even detection:** Compare cumulative arrays element by element → first year where shared ≤ dup → annotated on chart.
5. **Factor adjustments → live recalculation:** Any slider change (divergence rate, porting factor, maintenance ratio) → re-run engine → re-render. No debouncing needed (calculations are microsecond-fast).

## Scaling Considerations

This is a single-user, fully client-side app. Traditional server scaling is irrelevant. "Scaling" here means: what breaks as complexity grows.

| Concern | Small scope (MVP) | If features expand |
|---------|-------------------|--------------------|
| Single file gets long | Fine up to ~500 lines | Split into multi-file Option B above |
| Many adjustable factors | All in one `APP_STATE` | Group into sub-objects (teamConfig, factorConfig) |
| Multiple comparison scenarios | Not in scope v1 | Would require array of scenarios — refactor State to `scenarios[]` |
| Chart performance | 10-year horizon = 10 data points — trivial | Chart.js handles thousands of points fine |
| Formula complexity | Pure functions, easy to extend | Add formula modules without touching UI |

## Anti-Patterns

### Anti-Pattern 1: Scatter State Across DOM

**What people do:** Read input values directly from the DOM every time a calculation is needed. No central state object.

**Why it's wrong:** Chart and table can diverge if DOM is read at different times. Impossible to debug what the app "currently thinks." Hard to add features like scenario comparison later.

**Do this instead:** Write to `APP_STATE` on every input change. Read only from `APP_STATE` in the engine and renderers.

### Anti-Pattern 2: Inline Calculation Logic in Event Handlers

**What people do:** Write formulas directly inside `onclick` or `oninput` handlers. Mix parsing, calculation, and DOM mutation in one function.

**Why it's wrong:** Can't test formulas independently. Identical logic duplicated for keyboard and click handlers. One-line change to a formula requires finding every handler.

**Do this instead:** Event handlers do three things only: read from DOM → write to state → call `render()`. All math lives in `engine.js` (or the engine section).

### Anti-Pattern 3: Destroy and Recreate Chart.js on Every Update

**What people do:** Call `chart.destroy()` then `new Chart(...)` whenever data changes.

**Why it's wrong:** Causes flash/flicker on every input change. Loses Chart.js animation interpolation. Slower.

**Do this instead:** Mutate `chart.data` in place and call `chart.update('active')`. Keep one chart instance per canvas for the app lifetime.

### Anti-Pattern 4: Magic Numbers Embedded in Formulas

**What people do:** Write `0.65` or `1607` directly inside calculation functions.

**Why it's wrong:** The research doc has 40+ reference values. When a stakeholder asks "why does it use 1607 hours?", the answer should be findable. When data updates (e.g., new French salary survey), changes require grep-and-replace across formulas.

**Do this instead:** Centralize all reference data in `REFERENCE_DATA` (or `data.js`). Functions receive these as parameters or read from the constants object. Every magic number has a comment citing the source from the research doc.

### Anti-Pattern 5: Using ES Module Imports for a file:// App

**What people do:** Add `type="module"` to scripts and use `import`/`export` for clean separation.

**Why it's wrong:** Browsers block ES Module loading on the `file://` protocol (CORS restriction). App will silently fail to load when opened directly from disk — the primary use case here.

**Do this instead:** Use plain `<script>` tags loaded in dependency order. If the project will always be served (even via `npx serve`), ES Modules are fine — decide upfront and document in the HTML comment.

## Integration Points

### External Libraries

| Library | Integration Pattern | Notes |
|---------|---------------------|-------|
| Chart.js | CDN `<script>` tag; `new Chart(canvas, config)` | Pin to a specific version (e.g., `chart.js@4.4.x`) in CDN URL to avoid surprise breaking changes |
| None other | All calculation is pure JS math | No date library, no formatting library needed for this domain |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Input Panel → State | Direct property assignment via Controller | No two-way binding — read DOM once per event, then ignore DOM |
| State → Engine | Function call: `engine.calc(APP_STATE)` returns result written back to state | Engine must never touch the DOM |
| State → Chart | `updateChart(APP_STATE.comparison)` called from render() | Chart module holds Chart.js instance reference |
| State → Results DOM | `renderResults(APP_STATE)` called from render() | All DOM writes isolated to render functions |
| Reference Data → Engine | Engine imports/reads from `REFERENCE_DATA` constants | Reference data is read-only; never mutated at runtime |

## Suggested Build Order

Dependencies flow in this direction. Build bottom-up.

1. **Reference Data** — No dependencies. Just a JS object of constants from the research doc. Can be verified by reading the object.
2. **Calculation Engine** — Depends on Reference Data. Pure functions only. Testable in browser console before any UI exists.
3. **HTML Shell + CSS** — Static layout. Team input section, factor sliders, results area, chart canvas. No JS logic yet.
4. **Chart Initialization** — Depends on HTML canvas and Chart.js CDN. Wire up empty chart instance.
5. **State Store + Controller** — Connect input fields to `APP_STATE`. Wire change events.
6. **Render Functions** — Read state, write to DOM. Call `updateChart()`. Complete the loop.
7. **Standalone Calculation View** — First working feature: input team + story points → see cost. Validates the engine.
8. **Comparison View** — Builds on standalone. Adds shared vs dup curves, break-even annotation. The core value of the app.
9. **Polish** — Factor slider defaults from Reference Data, visual break-even highlight, number formatting, responsive layout.

## Sources

- [CSS-Tricks: Build a state management system with vanilla JavaScript](https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/)
- [Medium: How I Built a Real-Time Dashboard from Scratch Using Vanilla JavaScript (No Frameworks!)](https://medium.com/@michaelpreston515/how-i-built-a-real-time-dashboard-from-scratch-using-vanilla-javascript-no-frameworks-f93f3dce98a9)
- [Chart.js Official Documentation](https://www.chartjs.org/docs/)
- [NamasteDev: State Management Strategies Without Frameworks](https://namastedev.com/blog/state-management-strategies-without-frameworks-vanilla-patterns-that-scale/)
- [embeddable.com: How to Build Dashboards with Chart.js](https://embeddable.com/blog/how-to-build-dashboards-with-chart-js)
- [Vibidsoft: State Management in Vanilla JS: 2026 Trends](https://www.vibidsoft.com/blog/state-management-in-vanilla-js-2026-trends/)

---
*Architecture research for: standalone HTML/JS cost calculator dashboard (no framework, no build step)*
*Researched: 2026-03-23*
