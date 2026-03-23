# Phase 4: Scaffold, Engine, and Standalone Cost - Research

**Researched:** 2026-03-23
**Domain:** React + Vite scaffold, TypeScript formula engine, shadcn/ui component wiring
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Two-column layout — inputs (team, sizing, time horizon) on the left, cost output on the right
- **D-02:** Cost output column is sticky — stays visible while scrolling inputs
- **D-03:** No header/nav bar — jump straight into the calculator content
- **D-04:** Responsive: columns stack vertically below ~768px breakpoint (inputs on top, cost below)
- **D-05:** Fixed 4-row seniority grid (Junior/Mid/Senior/Lead) with headcount field per row — no individual names
- **D-06:** Salary baseline is French loaded cost: Junior 32€/h, Mid 40€/h, Senior 51€/h, Lead 67€/h
- **D-07:** Hourly cost per seniority is editable — user can override the default €/h value
- **D-08:** Headcount=0 means that seniority level is not used (fulfills TEAM-04 "remove" requirement)
- **D-09:** Team average hourly cost displays in real-time below the grid
- **D-10:** Tab-switch UX for Story Points vs Direct Hours — only one mode visible at a time
- **D-11:** Story Points tab: SP field, velocity (SP/sprint) field, sprint duration dropdown (1-4 weeks)
- **D-12:** Direct Hours tab supports hours or days with a toggle (×7h/day conversion)
- **D-13:** Estimated development hours derived from inputs shown below the active tab
- **D-14:** Preset buttons for time horizon: 1, 3, 5, 10 years — one active at a time, no slider
- **D-15:** Summary card with prominent total cost number at top, then breakdown table below
- **D-16:** Breakdown table columns: Category, Hours, Cost (€), Percentage
- **D-17:** Standalone view shows only initial dev + maintenance rows (coordination/bugs/sync are Phase 5)
- **D-18:** All outputs recalculate in real-time as inputs change — no "Calculate" button
- **D-19:** Full engine built in Phase 4 — all formula functions (shared cost, duplicated cost, break-even, divergence) as a pure TypeScript module
- **D-20:** Unit tests verified against research doc worked examples (sections 7.1-7.5) BEFORE any UI is built — engine-before-UI discipline
- **D-21:** Separate pure functions per formula (calcSharedCost, calcDuplicatedCost, calcBreakEven, etc.) — composable, testable, clear mapping to research doc sections

### Claude's Discretion

- Component granularity and React state management approach
- shadcn/ui component selection for each input type
- File/folder structure within the React project

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TEAM-01 | User can add team members with a name and seniority level (Junior/Mid/Senior/Lead) | Fixed 4-row seniority grid pattern; headcount input per row |
| TEAM-02 | User sees French loaded-cost salary defaults auto-filled based on seniority selection | Defaults: Junior 32, Mid 40, Senior 51, Lead 67 €/h from §1.3 |
| TEAM-03 | User can override the default hourly cost for any individual team member | Controlled `<Input>` with default value; replaces default on change |
| TEAM-04 | User can remove team members from the team | Headcount=0 excludes row from average; no delete button needed (D-08) |
| TEAM-05 | User can see the team's average loaded hourly cost update in real-time | Derived value from `useMemo` over seniority rows where headcount > 0 |
| SIZE-01 | User can define a feature size in story points | shadcn `<Tabs>` with SP tab; numeric `<Input>` for SP count |
| SIZE-02 | User can define a feature size in direct hours or days as an alternative | Direct Hours tab with hours/days toggle (`<Toggle>`) |
| SIZE-03 | User can set team velocity (SP/sprint) to convert SP to hours | Numeric `<Input>` for velocity field in SP tab |
| SIZE-04 | User can set sprint duration (1-4 weeks) for the SP-to-hours conversion | `<Select>` dropdown with options 1, 2, 3, 4 weeks |
| SIZE-05 | User can see the estimated development hours derived from inputs | Read-only computed value shown in accent color below active tab |
| TIME-01 | User can select a projection horizon from preset values (1, 3, 5, 10 years) | Four `<Button>` elements; active button uses `variant="default"` |
| TIME-02 | User can see cost projections update when changing the time horizon | Horizon feeds into engine; all outputs derived reactively |
| COST-01 | User can see the total cost of a feature for their team (standalone calculation) | Summary `<Card>` with total displayed as `€{amount}` with thousand separators |
| COST-02 | User can see a cost breakdown table with categories | `<Table>` with rows: Initial Development, Annual Maintenance (×N years), Total |

</phase_requirements>

---

## Summary

Phase 4 is a greenfield React scaffold with two parallel workstreams: (1) the pure TypeScript formula engine verified by unit tests, and (2) the UI shell wired to that engine. The formula engine is the most critical and must be built first (D-20). All formulas are documented in `docs/feature-cost-shared-vs-duplicated.md` sections 7.1-7.5 with numeric worked examples that serve as unit test oracles.

The UI is a two-column layout using shadcn/ui components on top of a Vite + React 19 + TypeScript + Tailwind CSS 4 scaffold. The shadcn CLI handles component installation into the project, so the scaffold step must initialize shadcn before any components can be used. All state flows unidirectionally from user inputs through the engine to the output panel, with no "Calculate" button — everything is reactive.

For Phase 4, the standalone cost formula is a subset of the full engine: `Initial_Dev_Cost + Σ(Annual_Maintenance_Cost × Year)`. The full engine (shared, duplicated, break-even, divergence) is built in Phase 4 but only the standalone calculation is wired to the UI — Phase 5 will wire comparison view and charts.

**Primary recommendation:** Scaffold with `npm create vite@latest`, initialize shadcn with `npx shadcn@latest init`, build and test the engine module with Vitest, then build UI components composing shadcn primitives.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | Component framework | Project constraint (CLAUDE.md) |
| TypeScript | 6.0.2 | Type safety | Project constraint (CLAUDE.md) |
| Vite | 8.0.2 | Build tool + dev server | Project constraint (CLAUDE.md) |
| Tailwind CSS | 4.2.2 | Utility-first styling | Project constraint (CLAUDE.md) |
| shadcn/ui (CLI) | 4.1.0 | Component library wrapping Radix | Project constraint (CLAUDE.md) |
| Recharts | 3.8.0 | Charting (Phase 5 — install now for engine shape) | Project constraint (CLAUDE.md) |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.1.1 | Conditional className composition | Inside every component alongside tailwind-merge |
| tailwind-merge | 3.5.0 | Merge Tailwind class conflicts | Always pair with clsx via `cn()` utility |
| class-variance-authority | 0.7.1 | Variant-based component styling | Already used internally by shadcn components |
| lucide-react | 1.0.1 | Icons (bundled with shadcn) | Any icon need in the UI |
| Vitest | 4.1.1 | Unit test runner | Formula engine tests (D-20); same config as Vite |
| @testing-library/react | 16.3.2 | React component testing | If component tests are needed post-engine |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| shadcn/ui | Mantine, MUI | shadcn is locked by CLAUDE.md |
| Vitest | Jest | Vitest shares Vite config — no separate babel setup; zero-friction choice |
| Tailwind CSS 4 | Tailwind CSS 3 | Tailwind 4 is breaking change (PostCSS plugin replaced by Vite plugin, CSS-first config). Do NOT mix v3 docs with v4. |
| `npm create vite@latest` | manual scaffold | Template handles tsconfig, vite.config, entry points correctly |

**Installation:**
```bash
# Step 1: Scaffold
npm create vite@latest . -- --template react-ts

# Step 2: Dependencies
npm install recharts lucide-react clsx tailwind-merge

# Step 3: Tailwind CSS 4 (Vite plugin, not PostCSS)
npm install tailwindcss @tailwindcss/vite

# Step 4: shadcn init (interactive — choose default theme, CSS variables)
npx shadcn@latest init

# Step 5: Add shadcn components used in Phase 4
npx shadcn@latest add card table input select tabs button toggle badge separator

# Step 6: Test runner
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

**Version verification:** All versions above confirmed against npm registry on 2026-03-23.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── engine/              # Pure TypeScript formula functions — no React imports
│   ├── formulas.ts      # calcSharedCost, calcDuplicatedCost, calcBreakEven, calcDivergence
│   ├── types.ts         # EngineInputs, EngineOutputs, SeniorityRow, SizingMode
│   └── __tests__/
│       └── formulas.test.ts  # Vitest unit tests against §7.1-7.5 worked examples
├── components/
│   ├── TeamComposition.tsx   # Fixed 4-row seniority grid
│   ├── FeatureSizing.tsx     # Tab-switch: SP vs Direct Hours
│   ├── TimeHorizon.tsx       # 4 preset buttons
│   ├── CostOutput.tsx        # Summary card + breakdown table
│   └── ui/                  # shadcn generated components (do not edit)
├── lib/
│   └── utils.ts             # cn() utility (generated by shadcn), formatEuro()
├── App.tsx                  # Two-column layout root
├── main.tsx                 # React DOM render
└── index.css                # Tailwind CSS 4 directives
```

### Pattern 1: Pure Engine Module (engine-before-UI discipline)

**What:** All formula logic lives in `src/engine/formulas.ts` as plain TypeScript functions with no React dependencies. The engine takes a single `EngineInputs` object and returns `EngineOutputs`. UI components only call engine functions — they never compute costs themselves.

**When to use:** Always. Engine functions must be testable in isolation (D-20).

**Example:**
```typescript
// src/engine/types.ts
export interface SeniorityRow {
  label: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  headcount: number;
  hourlyRate: number; // €/h, user-overridable default
}

export interface EngineInputs {
  team: SeniorityRow[];
  devHours: number;           // derived from SP or direct hours
  horizonYears: number;       // 1 | 3 | 5 | 10
  maintenanceRate: number;    // default 0.18 for shared, 0.22 for duplicated
  generalizationFactor: number; // default 1.3
  portingFactor: number;      // default 0.65
  divergenceRate: number;     // default 0.20
  bugDuplicationFactor: number; // default 2.0
  nbConsumingCodebases: number; // default 2
}

export interface StandaloneOutputs {
  teamAvgHourlyRate: number;
  initialDevCost: number;
  annualMaintenanceCost: number;
  totalMaintenanceCost: number; // annualMaintenanceCost × horizonYears
  totalStandaloneCost: number;
  breakdown: BreakdownRow[];
}

export interface BreakdownRow {
  category: string;
  hours: number;
  cost: number;
  percentage: number;
}
```

### Pattern 2: Derived State via useMemo

**What:** All computed values (team average rate, dev hours from SP, cost outputs) are computed with `useMemo` inside the root `App` component or a custom hook. Components receive only their slice of input state and setters — they never hold derived state locally.

**When to use:** Any value computed from other state. Never store a derived value in `useState`.

**Example:**
```typescript
// App.tsx pattern
const teamAvgRate = useMemo(() => {
  const active = team.filter(r => r.headcount > 0);
  if (active.length === 0) return 0;
  const totalCost = active.reduce((sum, r) => sum + r.headcount * r.hourlyRate, 0);
  const totalHeads = active.reduce((sum, r) => sum + r.headcount, 0);
  return totalCost / totalHeads;
}, [team]);

const devHours = useMemo(() => {
  if (sizingMode === 'sp') {
    const sprintsNeeded = storyPoints / velocity;
    const hoursPerSprint = sprintWeeks * 35; // 35h/week French legal basis
    return sprintsNeeded * hoursPerSprint;
  }
  return directHoursMode === 'days' ? directHoursValue * 7 : directHoursValue;
}, [sizingMode, storyPoints, velocity, sprintWeeks, directHoursValue, directHoursMode]);
```

### Pattern 3: shadcn Component Composition

**What:** shadcn components are installed into `src/components/ui/` by the CLI. Section-level components (`TeamComposition`, `FeatureSizing`, etc.) import from `@/components/ui/` and compose them. The `cn()` utility (generated by shadcn init) merges Tailwind classes safely.

**When to use:** For every UI element. Never write raw `<div>` grids when a shadcn Card/Table/Input exists.

**Example: Seniority Row**
```typescript
// Inside TeamComposition.tsx
import { Input } from "@/components/ui/input";

const SENIORITY_DEFAULTS = [
  { label: 'Junior', hourlyRate: 32 },
  { label: 'Mid',    hourlyRate: 40 },
  { label: 'Senior', hourlyRate: 51 },
  { label: 'Lead',   hourlyRate: 67 },
];

// Each row renders:
<TableRow key={row.label}>
  <TableCell className="font-medium">{row.label}</TableCell>
  <TableCell>
    <Input
      type="number"
      min={0}
      value={row.headcount}
      onChange={e => onHeadcountChange(row.label, Number(e.target.value))}
      className="w-20"
      aria-label={`${row.label} headcount`}
    />
  </TableCell>
  <TableCell>
    <Input
      type="number"
      min={0}
      value={row.hourlyRate}
      onChange={e => onRateChange(row.label, Number(e.target.value))}
      className="w-24"
      aria-label={`${row.label} hourly rate`}
    />
  </TableCell>
</TableRow>
```

### Pattern 4: Tailwind CSS 4 Configuration

**What:** Tailwind CSS 4 uses a Vite plugin instead of PostCSS, and CSS-first configuration instead of `tailwind.config.js`. shadcn init handles this correctly when run after Tailwind 4 is installed.

**When to use:** Always follow this pattern — mixing Tailwind 3 docs with Tailwind 4 installs is the #1 pitfall.

**Example (vite.config.ts):**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: { "@": "/src" },
  },
})
```

**Example (src/index.css):**
```css
@import "tailwindcss";
/* shadcn theme variables injected below by shadcn init */
```

### Pattern 5: Thousand Separator Formatting for Euro Amounts

**What:** The UI-SPEC specifies `€124 800` format (French convention: space as thousands separator). Use `Intl.NumberFormat` — do not hand-roll number formatting.

**Example:**
```typescript
// src/lib/utils.ts — add alongside cn()
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
  // Returns "124 800 €" — adjust display prefix/suffix as needed
}
```

### Anti-Patterns to Avoid

- **Computing costs inside components:** All math belongs in `src/engine/formulas.ts`. Components only display results.
- **Using `useState` for derived values:** Team average, dev hours, costs — all `useMemo`. State is only raw inputs.
- **Editing files in `src/components/ui/`:** These are owned by shadcn CLI. Customization belongs in wrapper components.
- **Importing from `tailwind.config.js`:** Tailwind 4 has no config file. Theme customization is CSS-only.
- **Using `npx shadcn-ui@latest`:** Deprecated. The current CLI package is `shadcn` (not `shadcn-ui`). Always use `npx shadcn@latest`.
- **Storing `devHours` in state when it's derived from SP inputs:** This creates stale state bugs.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible tabs | Custom div + click handler | shadcn `<Tabs>` (Radix primitive) | Keyboard navigation, aria-selected, focus trap free |
| Toggle between two values | Custom boolean toggle button | shadcn `<Toggle>` | Radix-backed, pressed state, accessible |
| Dropdown select | Custom `<select>` styled | shadcn `<Select>` | Cross-browser consistent, keyboard, a11y |
| Number formatting | `amount.toFixed(0).replace(...)` | `Intl.NumberFormat('fr-FR', ...)` | French space separator, currency symbol, locale-aware rounding |
| Class merging | Manual string concatenation | `cn()` (clsx + tailwind-merge) | Handles Tailwind class conflicts that break styles |
| Icon SVGs | Inline SVG code | `lucide-react` imports | Tree-shakeable, already installed with shadcn |

**Key insight:** shadcn provides exactly the component set Phase 4 needs (Card, Table, Input, Select, Tabs, Button, Toggle, Badge, Separator) — every input widget in the UI-SPEC has a direct shadcn match. There is no gap requiring custom primitive work.

---

## Formula Engine Reference

This section maps research doc formulas to TypeScript function signatures. The planner MUST include an engine-build wave before any UI wave.

### Standalone Cost Formula (Phase 4 UI)

From `docs/feature-cost-shared-vs-duplicated.md` §7.1 — simplified for standalone (no lib setup, no coordination, no onboarding in Phase 4 view):

```
Initial_Dev_Cost = devHours × teamAvgHourlyRate × generalizationFactor
Annual_Maintenance_Cost = Initial_Dev_Cost × maintenanceRate
Total_Standalone_Cost = Initial_Dev_Cost + (Annual_Maintenance_Cost × horizonYears)
```

**Phase 4 cost breakdown rows (D-17):**
- Row 1: Initial Development — `Initial_Dev_Cost`
- Row 2: Annual Maintenance (×N years) — `Annual_Maintenance_Cost × horizonYears`
- Row Total: `Total_Standalone_Cost`

### Full Engine Signatures (Phase 4 build, Phase 5 wire)

```typescript
// All functions in src/engine/formulas.ts
export function calcTeamAvgRate(team: SeniorityRow[]): number
export function calcDevHours(sizing: SizingInputs): number
export function calcStandaloneCost(inputs: EngineInputs): StandaloneOutputs
export function calcSharedCost(inputs: EngineInputs): SharedCostOutputs    // §7.1
export function calcDuplicatedCost(inputs: EngineInputs): DupCostOutputs  // §7.2
export function calcBreakEven(inputs: EngineInputs): BreakEvenResult       // §7.3
export function calcScaleFactor(inputs: EngineInputs, n: number): number   // §7.4
export function calcDivergence(inputs: EngineInputs, t: number): number    // §7.5
```

### Worked Example Unit Test Oracles (from §7.1-7.2)

These exact numbers from the research doc must pass as unit tests (D-20):

**Shared cost example (§7.1):**
- devHours=400, hourlyRate=65, generalizationFactor=1.3 → Initial_Dev_Cost=33,800 €
- maintenanceRate=0.18 → Annual_Maintenance_Cost≈6,084 €

**Duplicated cost example (§7.2):**
- baseDev=26,000, portingFactor=0.65 → Duplicated_Dev_Cost=42,900 €
- maintenanceRate=0.22, year=1 → Annual_Dup_Maintenance=10,296 €

**Break-even example (§7.3):**
- Generalization_Overhead=7,800, Lib_Setup=18,200, Monthly_Savings=3,092, Monthly_Coordination=1,690
- Result ≈ 18.5 months

**Divergence example (§7.5):**
- Base_Sync_Cost=8,500, divergenceRate=0.20, t=1 → ≈10,382 €

---

## Common Pitfalls

### Pitfall 1: Tailwind CSS 4 vs v3 Documentation Confusion

**What goes wrong:** Developer installs Tailwind 4 but follows Tailwind 3 docs. PostCSS config (`tailwind.config.js`, `postcss.config.js`) does not apply. Classes silently fail to generate. `@tailwind base/components/utilities` directives are v3 syntax.

**Why it happens:** Most online tutorials and Stack Overflow answers target Tailwind 3. Tailwind 4 switched to a Vite plugin architecture and CSS-first config.

**How to avoid:** Use `@tailwindcss/vite` Vite plugin (not PostCSS). Use `@import "tailwindcss"` in CSS (not `@tailwind` directives). Never create `tailwind.config.js` — configure in CSS with `@theme`.

**Warning signs:** Classes render but no styles applied; `bg-background` not working; shadcn theme colors absent.

### Pitfall 2: Using `npx shadcn-ui@latest` (deprecated CLI)

**What goes wrong:** `shadcn-ui` is the old package name. The new CLI is `shadcn`. Using the old package installs components incompatible with current shadcn conventions and may fail silently on React 19.

**How to avoid:** Always `npx shadcn@latest init` and `npx shadcn@latest add [component]`.

### Pitfall 3: Stale Derived State (useState for computed values)

**What goes wrong:** If `devHours` or `totalCost` are stored in `useState` and updated in `useEffect`, they can be one render behind the inputs that triggered them. Users see flickering or temporarily wrong values.

**How to avoid:** Use `useMemo` for all derived values. Only raw user inputs (team rows, SP value, horizon selection) live in `useState`.

### Pitfall 4: shadcn `<Select>` Controlled Value Type

**What goes wrong:** shadcn's `<Select>` passes a `string` to `onValueChange`, but sprint duration is a `number`. Passing `value={sprintWeeks}` (number) to `<SelectValue>` causes a type mismatch and the selected item may not display correctly.

**How to avoid:** Store sprint weeks as `string` in state, or convert explicitly: `onValueChange={(v) => setSprintWeeks(Number(v))}` and `value={String(sprintWeeks)}`.

### Pitfall 5: Division by Zero in Team Average

**What goes wrong:** When all headcounts are 0, calculating team average divides by zero and renders `NaN €/h`.

**How to avoid:** Guard in `calcTeamAvgRate`: if total headcount is 0, return 0. In UI, show the "zero team" empty state (see UI-SPEC States Reference) instead of the cost panel.

### Pitfall 6: French Hours-per-Week Convention

**What goes wrong:** Using 40h/week (US standard) instead of 35h/week (French legal basis) produces wrong dev hour derivations from sprint duration.

**How to avoid:** Sprint duration conversion: `sprintWeeks × 35h`. The research doc §1.3 explicitly states 1,607h/year (35h × 46 working weeks). Use 35h as the constant.

### Pitfall 7: `@` Path Alias Not Configured for Vitest

**What goes wrong:** The `@/engine/formulas` import path works in Vite but fails in Vitest unless the alias is also declared in `vitest.config.ts` (or `vite.config.ts` with `test` block).

**How to avoid:** Declare `resolve.alias` in `vite.config.ts` under `defineConfig` — Vitest inherits it when using `/// <reference types="vitest" />` in the config file.

---

## Code Examples

### Vitest Config (integrated with Vite)

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": "/src" },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

### Engine Unit Test Pattern

```typescript
// src/engine/__tests__/formulas.test.ts
import { describe, it, expect } from 'vitest';
import { calcSharedCost, calcDuplicatedCost, calcBreakEven } from '../formulas';

describe('calcSharedCost §7.1', () => {
  it('initial dev cost with generalization factor', () => {
    // Worked example from §7.1: 400h × 65€ × 1.3 = 33,800€
    const result = calcSharedCost({
      devHours: 400,
      teamAvgHourlyRate: 65,
      generalizationFactor: 1.3,
      maintenanceRate: 0.18,
      horizonYears: 3,
      // ...other inputs at defaults
    });
    expect(result.initialDevCost).toBeCloseTo(33800, 0);
  });
});
```

### Euro Formatting — French Locale

```typescript
// src/lib/utils.ts
export function formatEuro(amount: number): string {
  if (!isFinite(amount) || isNaN(amount)) return '—';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
  // Produces: "124 800 €"
}
```

### shadcn Tabs for SP vs Direct Hours

```typescript
// FeatureSizing.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="story-points" onValueChange={setSizingMode}>
  <TabsList>
    <TabsTrigger value="story-points">Story Points</TabsTrigger>
    <TabsTrigger value="direct-hours">Direct Hours</TabsTrigger>
  </TabsList>
  <TabsContent value="story-points">
    {/* SP + velocity + sprint duration */}
  </TabsContent>
  <TabsContent value="direct-hours">
    {/* hours/days input + toggle */}
  </TabsContent>
</Tabs>
```

### Time Horizon Button Group

```typescript
// TimeHorizon.tsx
const HORIZONS = [1, 3, 5, 10] as const;

{HORIZONS.map(y => (
  <Button
    key={y}
    variant={horizonYears === y ? "default" : "outline"}
    onClick={() => setHorizonYears(y)}
  >
    {y} yr{y > 1 ? 's' : ''}
  </Button>
))}
```

### Two-Column Sticky Layout

```typescript
// App.tsx
<div className="max-w-[1280px] mx-auto px-6">
  <div className="flex gap-8 md:flex-row flex-col">
    {/* Inputs: 55% */}
    <div className="flex-[55] space-y-6">
      <TeamComposition ... />
      <FeatureSizing ... />
      <TimeHorizon ... />
    </div>
    {/* Output: 45%, sticky */}
    <div className="flex-[45] md:sticky md:top-6 md:self-start">
      <CostOutput ... />
    </div>
  </div>
</div>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `npx shadcn-ui@latest` | `npx shadcn@latest` | 2024 | Old package deprecated; use new one |
| Tailwind CSS 3 with PostCSS | Tailwind CSS 4 with Vite plugin | Tailwind 4.0 (Q1 2025) | No `tailwind.config.js`; CSS-first config |
| `@tailwind base/components/utilities` directives | `@import "tailwindcss"` single line | Tailwind 4.0 | Old directives don't exist in v4 |
| React 18 `createRoot` patterns | React 19 — same API, no action needed | React 19 (2024) | No migration required for this scaffold |
| Jest for Vite projects | Vitest | 2022–present | Zero babel overhead, shares Vite config |

**Deprecated/outdated:**
- `shadcn-ui` npm package: replaced by `shadcn`
- `tailwind.config.js`: does not exist in Tailwind 4; configure via CSS `@theme`
- `postcss.config.js` for Tailwind: not needed with `@tailwindcss/vite`

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite dev server, npm | ✓ | 22.16.0 | — |
| npm | Package installation | ✓ | 11.6.2 | — |
| Git | Version control | ✓ | (system) | — |
| Browser | UI testing | ✓ | System browser | — |

No missing dependencies. This is a pure frontend project requiring only Node.js and npm.

---

## Open Questions

1. **Tailwind 4 + shadcn version compatibility at init time**
   - What we know: shadcn CLI 4.1.0 supports Tailwind 4 as of recent releases
   - What's unclear: Whether `npx shadcn@latest init` auto-detects Tailwind 4 and skips PostCSS setup
   - Recommendation: Run `npx shadcn@latest init` after installing `@tailwindcss/vite`; if it adds a postcss.config, delete it and rely on the Vite plugin

2. **State management granularity — prop drilling vs context**
   - What we know: Phase 4 has one page, ~4 input sections feeding one output panel; React context adds boilerplate
   - What's unclear: Whether deep component nesting will make prop drilling awkward
   - Recommendation: Start with prop drilling from `App.tsx`; extract to context only if more than 3 prop-passing levels appear

3. **Default active time horizon**
   - What we know: UI-SPEC specifies "5 yrs" as default active (not stated in CONTEXT.md decisions)
   - What's unclear: Confirmed vs provisional decision
   - Recommendation: Treat 5 years as default; it is documented in UI-SPEC Interaction Contract

---

## Project Constraints (from CLAUDE.md)

All directives from `CLAUDE.md` that planning must not contradict:

| Constraint | Directive |
|------------|-----------|
| Tech stack locked | React 19 + Vite + TypeScript + shadcn/ui + Tailwind CSS + Recharts only |
| No D3.js directly | Use Recharts API exclusively |
| No Highcharts | Commercial license issue |
| No CSS-in-JS | styled-components, emotion forbidden; Tailwind only |
| No jQuery | Unnecessary with React |
| Data source | All reference data embedded in app from research doc — no external API calls |
| Deployment | Static build output — no server-side rendering, no Node.js runtime in production |
| GSD workflow | No direct repo edits outside GSD workflow; use `/gsd:execute-phase` for phase work |

---

## Sources

### Primary (HIGH confidence)

- `docs/feature-cost-shared-vs-duplicated.md` §1.2, §1.3, §7.1-7.5 — all formulas, salary defaults, worked examples
- `CLAUDE.md` — tech stack constraints (React 19, Vite, shadcn/ui, Tailwind CSS, Recharts)
- `04-CONTEXT.md` — all locked decisions D-01 through D-21
- `04-UI-SPEC.md` — component inventory, interaction contract, copywriting contract, layout spec
- npm registry — verified package versions for React 19.2.4, Vite 8.0.2, Tailwind 4.2.2, shadcn 4.1.0, Vitest 4.1.1

### Secondary (MEDIUM confidence)

- Tailwind CSS 4 migration notes — Vite plugin replaces PostCSS; `@import "tailwindcss"` replaces directives
- shadcn CLI rename from `shadcn-ui` to `shadcn` — current package name confirmed via npm view

### Tertiary (LOW confidence)

- shadcn init auto-detection of Tailwind 4 (not tested on this machine) — flag for validation in scaffold wave

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions confirmed against npm registry 2026-03-23
- Architecture: HIGH — patterns derived from locked CONTEXT.md decisions and research doc formulas
- Formula engine: HIGH — worked examples in §7.1-7.5 serve as ground truth; no inference required
- Tailwind 4 specifics: MEDIUM — architecture confirmed; shadcn integration behavior flagged as open question
- Pitfalls: MEDIUM-HIGH — sourced from known breaking changes between Tailwind 3/4 and shadcn package rename

**Research date:** 2026-03-23
**Valid until:** 2026-04-22 (30 days; stable stack)
