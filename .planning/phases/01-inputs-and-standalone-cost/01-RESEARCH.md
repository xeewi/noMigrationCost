# Phase 1: Inputs and Standalone Cost — Research

**Researched:** 2026-03-23
**Domain:** Vanilla HTML/CSS/JS calculator with Alpine.js reactivity, Pico CSS, cost formula engine
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Fixed 4-slot grid for team input — one row per seniority level (Junior/Mid/Senior/Lead) with a headcount field per row, no individual names
- **D-02:** Salary baseline is loaded cost (employer cost): Junior 32€/h, Mid 40€/h, Senior 51€/h, Lead 67€/h — based on gross × 1.42 / 1607h
- **D-03:** Hourly cost per seniority is editable — user can override the default €/h value in each row
- **D-04:** Team average hourly cost displays in real-time below the grid
- **D-05:** Tab-switch UX for Story Points vs Direct Hours — only one mode visible at a time
- **D-06:** Story Points tab shows: SP field, velocity (SP/sprint) field, sprint duration dropdown (1-4 weeks)
- **D-07:** Direct Hours tab supports hours or days with a toggle (×7h/day conversion)
- **D-08:** Estimated development hours derived from inputs shown below the active tab
- **D-09:** Preset buttons for time horizon: 1, 3, 5, 10 years — one active at a time, no slider
- **D-10:** Summary card with prominent total cost number at top, then breakdown table below
- **D-11:** Breakdown table columns: Category, Hours, Cost (€), Percentage — rows: initial dev, maintenance, coordination, bugs, sync
- **D-12:** All outputs recalculate in real-time as inputs change — no "Calculate" button (leverages Alpine.js reactivity)
- **D-13:** Light theme by default (Pico CSS light mode) — optimized for projector presentations
- **D-14:** Split file structure: index.html (markup), app.js (Alpine components + logic), data.js (salary constants, research defaults), styles.css (Pico overrides)

### Claude's Discretion

- **D-15:** Page layout arrangement (top-down vs two-column) — Claude decides based on Pico CSS strengths and Phase 2 chart integration needs

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TEAM-01 | User can add team members with a name and seniority level (Junior/Mid/Senior/Lead) | D-01 fixed 4-row grid; Alpine `x-data` headcount state per row |
| TEAM-02 | User sees French loaded-cost salary defaults auto-filled based on seniority selection | D-02 defaults in data.js; Alpine initializes from constants |
| TEAM-03 | User can override the default hourly cost for any individual team member | D-03 editable €/h field; Alpine `x-model` binding |
| TEAM-04 | User can remove team members from the team | Implemented by setting headcount to 0 (fixed grid, no row deletion) |
| TEAM-05 | User can see the team's average loaded hourly cost update in real-time | Alpine computed getter; D-04 |
| SIZE-01 | User can define a feature size in story points | D-05/D-06 SP tab panel |
| SIZE-02 | User can define a feature size in direct hours or days | D-05/D-07 Direct Hours tab panel |
| SIZE-03 | User can set team velocity (story points per sprint) | D-06 velocity field in SP tab |
| SIZE-04 | User can set sprint duration (1-4 weeks) | D-06 sprint duration `<select>` |
| SIZE-05 | User can see estimated development hours derived from inputs | D-08 derived hours display below active tab |
| TIME-01 | User can select a projection horizon from preset values (1, 3, 5, 10 years) | D-09 four preset buttons |
| TIME-02 | User can see cost projections update when changing the time horizon | Alpine reactivity; cost formula uses `years` state |
| COST-01 | User can see the total cost of a feature for their team (standalone calculation) | D-10 summary card with total; formula from §7.1 standalone variant |
| COST-02 | User can see a cost breakdown table with categories: initial dev, maintenance, coordination, bugs, sync | D-11 breakdown table; 5 formula components mapped from §7.1/7.2 |
</phase_requirements>

---

## Summary

Phase 1 builds the formula engine and all input UI for standalone feature cost estimation. The technical challenge is not the stack — Alpine.js, Pico CSS, and vanilla JS are all straightforward — but getting the formula engine right before building the UI on top of it. The research doc (docs/feature-cost-shared-vs-duplicated.md) provides complete formula definitions in §7.1 and §7.2 that must be mapped to named JavaScript functions before any markup is written.

The UI design contract (01-UI-SPEC.md) is approved and prescribes exact component structure, color values, copy, and interaction behavior. The planner does not need to make layout decisions — all of that is locked. The executor's job is to implement what the spec says, using Alpine.js `x-data` / `x-model` / `x-show` / computed getters to wire reactive state to the HTML structure.

The critical constraint from STATE.md is the "engine-before-UI" build discipline: formula functions must be verified in the browser console against the worked examples in §7.1/7.2 before any UI construction. This is the correct order for this phase.

**Primary recommendation:** Build in this order — (1) data.js constants, (2) formula functions in app.js verified against worked examples, (3) HTML structure following UI-SPEC, (4) Alpine wiring, (5) styles.css overrides.

---

## Project Constraints (from CLAUDE.md)

These directives are mandatory and override general recommendations:

- **No build step.** Single file or minimal files (index.html + app.js + data.js + styles.css). Must work opened directly via `file://` protocol.
- **No ES Module imports.** `file://` protocol blocks ES Module cross-file imports in Chrome without a server. All scripts are `<script src="...">` tags, not `import`/`export`.
- **No framework build tools.** No Vite, Webpack, Rollup, Parcel, or any bundler.
- **CDN only** for all dependencies. jsDelivr is the preferred CDN.
- **No jQuery.** Native DOM APIs + Alpine.js covers all needs.
- **No React / Vue / Svelte.** All require a build step for production use.
- **No Tailwind Play CDN.** Explicitly marked "not for production" by Tailwind docs.
- **No Highcharts.** Commercial license required for business use.
- **No ECharts full bundle.** ~900 KB minified — unjustifiable for 2 chart types.
- **Alpine.js 3.15.8** via CDN (loaded with `defer` attribute).
- **Chart.js 4.5.1** via CDN (Chart.js not needed in Phase 1 — deferred to Phase 2).
- **Pico CSS 2.1.1** via CDN.
- **GSD workflow enforcement:** Use `/gsd:execute-phase` as the entry point. No direct repo edits outside a GSD workflow.

---

## Standard Stack

### Core (Phase 1 only — Chart.js deferred to Phase 2)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Alpine.js | 3.15.8 | Reactive state — `x-data`, `x-model`, `x-show`, `x-bind`, computed getters | HTML-attribute-driven reactivity, zero build step, 7.1 KB gzipped, CDN-loadable with `defer`. Handles all input binding and real-time recalculation without JSX or a component model. |
| Pico CSS | 2.1.1 | Base styling — forms, tables, buttons, cards, layout | Styles semantic HTML tags directly (`<table>`, `<input>`, `<button>`, `<article>`). Single CDN link, ~8 KB gzipped. Professional default for presentations. |
| Vanilla JS | Browser-native | Formula engine, utility functions | No overhead. All formula functions are pure math — no library needed. |

### CDN Load Order (mandatory — from CLAUDE.md)

```html
<!-- 1. Pico CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2.1.1/css/pico.min.css">

<!-- 2. Alpine.js (MUST have defer — loads after DOM is parsed) -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.15.8/dist/cdn.min.js"></script>
```

Chart.js and chartjs-plugin-annotation are NOT loaded in Phase 1.

### File Structure (locked — D-14)

```
index.html    — markup only (Alpine bindings, Pico semantic HTML)
app.js        — Alpine component definitions + formula functions
data.js       — salary constants, COCOMO factors, default values
styles.css    — Pico CSS overrides (color, layout, tab indicator)
```

**Script loading order in index.html:**

```html
<script src="data.js"></script>    <!-- constants available globally -->
<script src="app.js"></script>     <!-- Alpine component uses SALARY_DEFAULTS etc -->
<!-- Alpine CDN script with defer loads last, after DOM + app scripts -->
```

### Alternatives Considered (all rejected per CLAUDE.md)

| Recommended | Alternative | Why Rejected |
|-------------|-------------|--------------|
| Alpine.js | Vue 3 CDN build | Virtual DOM overhead overkill for static HTML with reactive slots |
| Alpine.js | VanJS | Requires fully JS-generated DOM; project has static HTML structure |
| Alpine.js | Pure Proxy + EventTarget | 50-100 lines of manual reactive plumbing; Alpine removes this for free at 7 KB |
| Pico CSS | Bootstrap 5 | ~150 KB CSS; requires utility class markup; heavier than needed |
| Pico CSS | Tailwind Play CDN | Explicitly "not for production" per Tailwind docs |

---

## Architecture Patterns

### Recommended Project Structure

```
noMigrationCost/
├── index.html      # Markup: header, two-column layout, all component HTML
├── app.js          # Alpine x-data component(s), formula functions
├── data.js         # SALARY_DEFAULTS, FORMULA_DEFAULTS constants
└── styles.css      # Pico overrides: layout grid, tab indicator, button group
```

### Pattern 1: data.js — Constants Module (no exports)

**What:** All salary defaults and formula constants declared as plain global `const` objects. No `export` keyword — files loaded via `<script src>` share the global `window` scope.

**When to use:** Any time a hardcoded value comes from the research doc. Keeps formula logic in app.js clean.

```javascript
// data.js
// Source: docs/feature-cost-shared-vs-duplicated.md §1.3
// Loaded cost = gross × 1.42 / 1607h/year
const SALARY_DEFAULTS = {
  junior: 32,   // €/h
  mid:    40,   // €/h
  senior: 51,   // €/h
  lead:   67    // €/h
};

// Source: docs/feature-cost-shared-vs-duplicated.md §7.1, §7.2
const FORMULA_DEFAULTS = {
  maintenanceRateShared:    0.18,  // 15-25% range; shared code lower bound
  maintenanceRateDuplicated: 0.22, // 20-30% range
  generalizationFactor:     1.3,   // 1.2-1.4 range; default 1.3
  portingFactor:            0.65,  // 0.5-0.8 range
  divergenceRate:           0.20,  // 15-30% per year
  bugDuplicationFactor:     2.0,   // 1.5-3.0; average team, informal tracking
  hoursPerDay:              7,     // French legal standard
  hoursPerYear:             1607   // French legal 35h/week annual basis
};
```

### Pattern 2: Alpine Single-Component Pattern

**What:** One `x-data` object on the root container (or `<body>`) holds all reactive state. Computed values are JavaScript getters (`get`) inside the `x-data` initialization function.

**When to use:** This is the correct Alpine pattern for a single-page calculator — no sub-components needed, no `$store` required (that's for multi-component state sharing, which Phase 1 doesn't need).

```javascript
// app.js
// Source: Alpine.js v3 docs — x-data with getter pattern
function appState() {
  return {
    // Team state
    team: [
      { seniority: 'Junior', headcount: 0, hourlyRate: SALARY_DEFAULTS.junior },
      { seniority: 'Mid',    headcount: 0, hourlyRate: SALARY_DEFAULTS.mid    },
      { seniority: 'Senior', headcount: 0, hourlyRate: SALARY_DEFAULTS.senior },
      { seniority: 'Lead',   headcount: 0, hourlyRate: SALARY_DEFAULTS.lead   }
    ],

    // Feature sizing state
    sizingMode: 'sp',        // 'sp' | 'hours'
    storyPoints: 0,
    velocity: 30,            // SP/sprint default (reference: §1.2 — 30-50 SP/sprint)
    sprintWeeks: 2,          // weeks
    directHours: 0,
    directDays: 0,
    directUnit: 'hours',     // 'hours' | 'days'

    // Time horizon
    horizonYears: 3,         // default to 3 years

    // Computed: team average hourly cost
    get teamAverageRate() {
      const totalHeadcount = this.team.reduce((s, r) => s + r.headcount, 0);
      if (totalHeadcount === 0) return 0;
      const weightedSum = this.team.reduce((s, r) => s + r.headcount * r.hourlyRate, 0);
      return weightedSum / totalHeadcount;
    },

    // Computed: estimated development hours
    get devHours() {
      if (this.sizingMode === 'sp') {
        if (this.velocity === 0) return 0;
        // SP ÷ velocity × sprint_weeks × hoursPerDay × 5 (work days/week)
        return (this.storyPoints / this.velocity) * this.sprintWeeks * 5 * FORMULA_DEFAULTS.hoursPerDay;
      } else {
        if (this.directUnit === 'days') return this.directDays * FORMULA_DEFAULTS.hoursPerDay;
        return this.directHours;
      }
    },

    // Formula outputs computed from devHours + teamAverageRate + horizonYears
    get standaloneCost() {
      return computeStandaloneCost(this.devHours, this.teamAverageRate, this.horizonYears);
    },

    get costBreakdown() {
      return computeBreakdown(this.devHours, this.teamAverageRate, this.horizonYears);
    }
  };
}
```

### Pattern 3: Formula Functions as Pure Functions in app.js

**What:** All formula logic lives in named pure functions, separate from the Alpine state object. Functions take explicit arguments — no reference to Alpine internals. This makes them testable in the browser console directly.

**When to use:** Always. The STATE.md blocker explicitly requires "formula functions verified in console against worked examples before any UI construction."

```javascript
// app.js — pure formula functions, declared before appState()
// Source: docs/feature-cost-shared-vs-duplicated.md §7.1

/**
 * Standalone cost: uses the shared-code formula but for a single team's
 * perspective (no porting factor, no duplication). This is Phase 1 scope.
 *
 * Phase 1 standalone = Initial Dev Cost + cumulative maintenance over N years
 * Using the simplified form:
 *   Initial_Dev_Cost = teamAvgRate × devHours  (no generalizationFactor in standalone view)
 *   Annual_Maintenance = Initial_Dev_Cost × maintenanceRateShared
 *   Total = Initial_Dev_Cost + Annual_Maintenance × years
 */
function computeStandaloneCost(devHours, hourlyRate, years) {
  if (devHours === 0 || hourlyRate === 0) return 0;
  const initialDev = devHours * hourlyRate;
  const annualMaintenance = initialDev * FORMULA_DEFAULTS.maintenanceRateShared;
  return initialDev + (annualMaintenance * years);
}

/**
 * Returns breakdown rows matching D-11 columns.
 * Categories: initial dev, maintenance (cumulative), coordination, bugs, sync.
 *
 * For Phase 1 standalone view:
 *  - coordination / bugs / sync are $0 (these represent duplication overhead,
 *    only relevant in Phase 2 comparison)
 *  OR: show them as baseline single-copy costs so the table is non-trivially populated.
 *
 * Resolution: Show initial dev + maintenance only in Phase 1 standalone.
 * Coordination/bugs/sync rows present but 0 — makes Phase 2 additive, not structural.
 */
function computeBreakdown(devHours, hourlyRate, years) {
  const initialDev = devHours * hourlyRate;
  const maintenanceCost = initialDev * FORMULA_DEFAULTS.maintenanceRateShared * years;
  const total = initialDev + maintenanceCost;
  return [
    { category: 'Initial Development', hours: devHours,          cost: initialDev,     pct: total > 0 ? initialDev / total : 0 },
    { category: 'Maintenance',         hours: devHours * FORMULA_DEFAULTS.maintenanceRateShared * years, cost: maintenanceCost, pct: total > 0 ? maintenanceCost / total : 0 },
    { category: 'Coordination',        hours: 0, cost: 0, pct: 0 },
    { category: 'Bug Fixing',          hours: 0, cost: 0, pct: 0 },
    { category: 'Sync Overhead',       hours: 0, cost: 0, pct: 0 }
  ];
}
```

**Note on coordination/bugs/sync rows in Phase 1:** The breakdown table spec (D-11) lists all 5 rows. For standalone cost, these three represent duplication-specific costs and are zero in a single-team view. Show them as 0 so the Phase 2 plan can fill them in without restructuring the table.

### Pattern 4: Alpine Tab Visibility with x-show

**What:** Tab panels use `x-show` (not `x-if`) so both panels exist in the DOM at all times. `x-show` toggles `display: none` without re-rendering.

**When to use:** Always for tab panels — `x-if` destroys and recreates the DOM node, losing input state when switching tabs.

```html
<!-- Source: Alpine.js v3 docs — x-show vs x-if -->
<div x-show="sizingMode === 'sp'">
  <!-- Story Points panel -->
</div>
<div x-show="sizingMode === 'hours'">
  <!-- Direct Hours panel -->
</div>
```

### Pattern 5: Pico CSS Semantic HTML Components

**What:** Pico CSS styles HTML elements by tag name. Use semantic elements to get styling for free — no utility classes needed.

```html
<!-- Card -->
<article>...</article>

<!-- Table (Pico styles thead, tbody, tr, td automatically) -->
<table>
  <thead><tr><th>...</th></tr></thead>
  <tbody>
    <tr x-for="row in team">
      <td x-text="row.seniority"></td>
      <td><input type="number" x-model.number="row.headcount" min="0"></td>
      <td><input type="number" x-model.number="row.hourlyRate" min="0"></td>
      <td x-text="(row.headcount * row.hourlyRate).toFixed(0) + ' €/h'"></td>
    </tr>
  </tbody>
</table>

<!-- Button group -->
<div role="group" aria-label="Time horizon">
  <button @click="horizonYears = 1" :aria-pressed="horizonYears === 1">1 yr</button>
  <button @click="horizonYears = 3" :aria-pressed="horizonYears === 3">3 yrs</button>
  <button @click="horizonYears = 5" :aria-pressed="horizonYears === 5">5 yrs</button>
  <button @click="horizonYears = 10" :aria-pressed="horizonYears === 10">10 yrs</button>
</div>
```

### Pattern 6: Two-Column CSS Grid Layout (locked by UI-SPEC)

**What:** CSS Grid for the main layout. Left column fixed 420px, right column fills remaining space.

```css
/* styles.css */
.app-layout {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 32px;             /* xl spacing token */
  align-items: start;
}

@media (max-width: 960px) {
  .app-layout {
    grid-template-columns: 1fr;
  }
}
```

### Anti-Patterns to Avoid

- **ES Module `import`/`export`:** Breaks on `file://` protocol. Use global `const` in separate `<script src>` files instead.
- **Alpine `x-if` for tabs:** Destroys DOM on tab switch, losing input values. Use `x-show` for toggleable panels.
- **Inline formula logic in Alpine template expressions:** Move all math into named functions in app.js. Template expressions should be one-liners: `x-text="formatEur(standaloneCost)"`.
- **Mixing `x-model` with `type="number"` without `.number` modifier:** Alpine `x-model` binds strings by default. Always use `x-model.number` for numeric inputs or the formula receives string concatenation instead of addition.
- **Building the UI before verifying formulas:** Per STATE.md constraint — console-verify formulas against §7.1 examples before wiring any inputs.
- **Global Alpine `$store` for single-component state:** `$store` is for sharing state across multiple independent Alpine components. With one `x-data` object, use getters — simpler and no magic.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reactive state binding | Custom event listeners + DOM updates | Alpine.js `x-model` / `x-data` getters | Alpine handles the observer pattern, batching, and DOM sync without boilerplate |
| CSS reset and form/table styling | Custom CSS from scratch | Pico CSS 2.1.1 (CDN) | Pico styles `<table>`, `<input>`, `<button>`, `<article>` natively — no class markup needed |
| Number formatting (€XX,XXX) | Custom regex / string manipulation | `Number.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })` | Handles thousands separator, decimal separator, currency symbol placement for French locale correctly |
| Tab visibility toggle | CSS class toggling with JS | Alpine `x-show="sizingMode === 'sp'"` | One attribute, no JS event listener code needed |
| Button active-state styling | JS class toggling | Alpine `:class="{ active: horizonYears === 1 }"` or `:aria-pressed` | Declarative, no imperative DOM manipulation |

**Key insight:** In a no-build, CDN-only context, every line of custom infrastructure code is a maintenance liability. The stack is chosen precisely to eliminate this category of hand-rolled plumbing.

---

## Formula Mapping (Phase 1 Scope)

This section traces each formula from the research doc to the function signatures the executor will write. Mandatory per STATE.md blocker.

### Story Points to Development Hours (§1.2)

```
Formula: Dev_Hours = (SP / Velocity) × Sprint_Duration_Hours
Where: Sprint_Duration_Hours = Sprint_Weeks × 5 days × 7h/day

Example: 40 SP / 30 SP/sprint × (2 weeks × 5 × 7h) = 40/30 × 70 = 93.3h
```

**Function signature:** `spToHours(storyPoints, velocity, sprintWeeks)` → number

### Standalone Cost (Phase 1 simplification of §7.1)

Phase 1 shows standalone cost for a single team — no generalization factor (that's for shared-code Phase 2), no porting factor (that's for duplicated-code Phase 2), no coordination/bug overhead (duplication-only concepts). The standalone formula is:

```
Initial_Dev_Cost = teamAvgRate × devHours
Annual_Maintenance = Initial_Dev_Cost × maintenanceRateShared (0.18)
Total_Standalone = Initial_Dev_Cost + Annual_Maintenance × Nb_Years
```

**Worked example verification (from §7.1 data, stripped to standalone):**
- devHours = 400, hourlyRate = 65€/h, years = 3
- Initial: 400 × 65 = 26,000€
- Annual maintenance: 26,000 × 0.18 = 4,680€
- Total over 3 years: 26,000 + (4,680 × 3) = 40,040€

**Function signature:** `computeStandaloneCost(devHours, hourlyRate, years)` → number

### Team Average Hourly Rate

```
teamAvg = Σ(headcount_i × hourlyRate_i) / Σ(headcount_i)
```

Zero division guard: return 0 when total headcount is 0.

**Implemented as Alpine getter:** `get teamAverageRate()`

### Currency Formatting

```javascript
// French locale: 1234.5 → "1 234,50 €"
function formatEur(value) {
  return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}
```

---

## Common Pitfalls

### Pitfall 1: Alpine Must Load After Scripts That Define Its Data

**What goes wrong:** If Alpine CDN loads before `data.js` and `app.js`, the `SALARY_DEFAULTS` constant is undefined when Alpine initializes, and `appState()` throws a ReferenceError.

**Why it happens:** Alpine with `defer` initializes after DOM parsing but may run before synchronous `<script src>` tags if those tags are placed after the CDN link.

**How to avoid:** Place `<script src="data.js">` and `<script src="app.js">` in `<head>` (synchronous, before body) OR in `<body>` before the Alpine CDN tag. The Alpine CDN `<script defer>` tag should be the last `<script>` in `<head>`.

**Correct order:**
```html
<head>
  <script src="data.js"></script>
  <script src="app.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.15.8/dist/cdn.min.js"></script>
</head>
```

**Warning signs:** Console shows `ReferenceError: SALARY_DEFAULTS is not defined` on page load.

### Pitfall 2: x-model Without .number Modifier Corrupts Math

**What goes wrong:** `<input type="number" x-model="storyPoints">` binds as a string. `storyPoints / velocity` becomes `"40" / 30 = NaN` or `"40" + 10 = "4010"`.

**Why it happens:** HTML `<input>` always yields string values from `.value`. Alpine's `x-model` uses the raw string unless instructed otherwise.

**How to avoid:** Always use `x-model.number` for number inputs.

**Warning signs:** Computed values show `NaN` or suspiciously large numbers in cost output.

### Pitfall 3: CSS Grid Breaks on Narrow Screens Without Media Query

**What goes wrong:** At 420px left column + 32px gap, screens under ~600px force horizontal scroll.

**Why it happens:** The layout uses a fixed-width left column. This is intentional for desktop/projector, but without a media query the tool is unusable on mobile.

**How to avoid:** Include the media query (max-width: 960px → single column). Per REQUIREMENTS.md, mobile is "responsive as bonus only" — but a broken layout is worse than no media query.

### Pitfall 4: Pico v2 Dark Mode Automatic Activation

**What goes wrong:** Pico CSS v2 automatically applies dark mode via `@media (prefers-color-scheme: dark)`. On a machine with system dark mode, the "projector light theme" (D-13) breaks.

**Why it happens:** Pico v2 uses CSS custom properties and the media query. Without explicit opt-out, system preference overrides the design.

**How to avoid:** Add `data-theme="light"` to the `<html>` element to lock Pico to light mode regardless of system preference.

```html
<html lang="en" data-theme="light">
```

**Warning signs:** Light theme shows correctly on one machine but renders dark on another.

### Pitfall 5: Velocity = 0 Division

**What goes wrong:** SP mode with velocity = 0 produces `Infinity` or `NaN` in derived hours calculation.

**Why it happens:** Formula divides by velocity: `SP / velocity`.

**How to avoid:** Guard: `if (velocity <= 0) return 0;` at the top of `spToHours`. Alpine will show "0 h" as the empty state rather than `Infinity`.

### Pitfall 6: Formula Functions Not Verifiable in Console Without a Server

**What goes wrong:** The `file://` protocol restriction means `import` won't work, but `data.js` and `app.js` loaded as global `<script src>` tags are accessible in DevTools console as global variables. Formula functions declared with `function` keyword are hoisted and available globally.

**How to avoid:** Declare formula functions with `function` keyword (not `const fn = () =>`), which hoists them to global scope and makes them callable in the DevTools console for manual verification.

**Verification procedure:**
```javascript
// In DevTools console after opening index.html:
computeStandaloneCost(400, 65, 3)  // Should return 40040
spToHours(40, 30, 2)              // Should return 93.33...
```

---

## Code Examples

### Verified: Alpine x-data Initialization Pattern

```html
<!-- index.html -->
<!-- Source: Alpine.js v3 official docs — https://alpinejs.dev/start-here -->
<div x-data="appState()">
  <!-- All reactive bindings go here -->
</div>
```

```javascript
// app.js
function appState() {
  return {
    // state + getters
  };
}
```

### Verified: Alpine x-for on Static Array (team rows)

```html
<!-- Alpine.js v3 docs — x-for -->
<tbody>
  <template x-for="(row, index) in team" :key="row.seniority">
    <tr>
      <td x-text="row.seniority"></td>
      <td><input type="number" x-model.number="team[index].headcount" min="0"></td>
      <td><input type="number" x-model.number="team[index].hourlyRate" min="0" step="0.5"></td>
      <td x-text="(team[index].headcount * team[index].hourlyRate).toFixed(0) + ' €/h'"></td>
    </tr>
  </template>
</tbody>
```

**Note:** Use `team[index].property` (not `row.property`) for mutation inside `x-for`. `row` is a copy in Alpine v3; mutating it does not update reactive state.

### Verified: Pico CSS Dark Mode Lock

```html
<!-- Source: Pico CSS v2 docs — https://picocss.com/docs/color-schemes -->
<html lang="en" data-theme="light">
```

### Verified: Number Locale Formatting (French)

```javascript
// Browser-native — no library needed
// "€26 000" (fr-FR uses space as thousands separator)
function formatEur(value) {
  if (!value || isNaN(value)) return '—';
  return value.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  });
}
```

### Verified: Tab Indicator CSS (active tab underline in accent color)

```css
/* styles.css */
.tab-btn {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #6c757d;
  font-weight: 400;
  cursor: pointer;
  padding: 8px 16px;
}
.tab-btn.active {
  border-bottom-color: #0172ad;
  color: inherit;
  font-weight: 600;
}
```

```html
<!-- Dynamic class binding -->
<button class="tab-btn" :class="{ active: sizingMode === 'sp' }" @click="sizingMode = 'sp'">
  Story Points
</button>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Alpine.js v2 (Magic.js era) | Alpine.js v3 (stable since 2021, v3.15.8 Feb 2025) | 2021 | v3 breaking changes: no `x-spread`, `$el` works differently; use v3 CDN URL |
| Pico CSS v1 | Pico CSS v2 (March 2025) | 2025 | v2 dropped IE support, added CSS custom property theming, `data-theme` attribute; v1 used `class="container"` — v2 is similar but `<main>` is the preferred container |
| jQuery DOM manipulation | Alpine.js + native DOM APIs | 2020+ | jQuery is 30-90 KB for functionality that native APIs + Alpine cover completely |

**Deprecated/outdated:**
- Alpine.js v1/v2 CDN URLs: Do not use `cdn.jsdelivr.net/npm/alpinejs@2.x` — use `@3.15.8`.
- Pico CSS v1 `class="container"` pattern: v2 uses `<main class="container">` for semantic centering. Works the same but v1 class names differ slightly.

---

## Open Questions

1. **Coordination/Bugs/Sync rows at zero — should they show at all?**
   - What we know: D-11 specifies 5 rows. In standalone mode these are 0.
   - What's unclear: Does showing 0-cost rows confuse users ("why is coordination €0?") or correctly preview Phase 2 structure?
   - Recommendation: Show all 5 rows with 0 values and a footnote "Applies to shared vs duplicated comparison (Phase 2)". Avoids structural refactor in Phase 2 and educates users on what those cost categories represent.

2. **SP-to-hours formula precision: work days vs sprint hours**
   - What we know: §1.2 gives the formula as `(SP / velocity) × sprint_duration`. Sprint duration in hours = `sprint_weeks × 5 days × 7h/day`.
   - What's unclear: The 7h/day is from French legal standard (35h/week). Some teams use 8h/day. The default for velocity (30 SP/sprint) assumes a 2-week sprint.
   - Recommendation: Expose `hoursPerDay` as a constant in `FORMULA_DEFAULTS` (default 7) rather than hard-coding it. This makes Phase 2 adjustable inputs trivial to add.

3. **Empty state copy placement**
   - What we know: UI-SPEC specifies "Add team members and set a feature size to see cost estimates." shown inside the summary card when total is 0.
   - What's unclear: Should the breakdown table also be hidden, or show zero rows?
   - Recommendation: Hide the breakdown table entirely when `standaloneCost === 0` using `x-show`. Show only the empty state message in the summary card.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 1 is code/config-only with no external services. All dependencies are CDN-loaded (Alpine.js, Pico CSS). No CLI tools, databases, or runtimes required beyond a browser.

---

## Sources

### Primary (HIGH confidence)
- `docs/feature-cost-shared-vs-duplicated.md` §1.2 — Story point estimation formula (SP-to-hours)
- `docs/feature-cost-shared-vs-duplicated.md` §1.3 — French loaded cost table (Junior 32€/h, Mid 40€/h, Senior 51€/h, Lead 67€/h confirmed)
- `docs/feature-cost-shared-vs-duplicated.md` §7.1 — Shared cost formula components (Initial_Dev_Cost, Annual_Maintenance_Cost, Coordination, Onboarding)
- `docs/feature-cost-shared-vs-duplicated.md` §7.2 — Duplicated cost formula components (Porting_Factor, Double_Maintenance_Factor, Sync_Cost, Bug_Cost)
- `CLAUDE.md` — Technology stack, CDN URLs, file structure, forbidden patterns — authoritative project config
- `.planning/phases/01-inputs-and-standalone-cost/01-CONTEXT.md` — All locked decisions D-01 through D-15
- `.planning/phases/01-inputs-and-standalone-cost/01-UI-SPEC.md` — Exact component specifications, color values, copy, accessibility requirements
- Alpine.js v3 official docs (https://alpinejs.dev) — `x-data`, `x-model`, `x-show`, `x-for`, getter pattern — HIGH confidence
- Pico CSS v2 official docs (https://picocss.com/docs) — `data-theme="light"`, semantic element styling — HIGH confidence

### Secondary (MEDIUM confidence)
- Browser MDN — `Number.toLocaleString` with `fr-FR` locale and `style: 'currency'` options — standard API, browser-native
- `.planning/STATE.md` — Engine-before-UI build discipline constraint, formula mapping required before coding

### Tertiary (LOW confidence)
- None — all claims verified from project documentation or official library docs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — locked in CLAUDE.md with specific versions, verified against Alpine.js and Pico CSS official docs
- Architecture: HIGH — derived directly from locked decisions D-01 through D-14 and approved UI-SPEC
- Formula engine: HIGH — all formulas sourced directly from docs/feature-cost-shared-vs-duplicated.md with worked examples
- Pitfalls: HIGH — Alpine.js gotchas (x-model.number, x-for mutation) from official docs; Pico dark mode from v2 docs

**Research date:** 2026-03-23
**Valid until:** 2026-06-23 (90 days — stack is stable; Alpine v3, Pico v2, CDN URLs are not changing)
