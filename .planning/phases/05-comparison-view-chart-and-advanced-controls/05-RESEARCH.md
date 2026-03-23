# Phase 5: Comparison View, Chart, and Advanced Controls — Research

**Researched:** 2026-03-23
**Domain:** React UI — Recharts AreaChart, shadcn collapsible/slider/popover, formula wiring, monthly interpolation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Layout & Navigation**
- D-01: Tabbed output — two tabs in the right column: "Standalone" and "Comparison". Uses shadcn Tabs component.
- D-02: Comparison tab is the default active tab on page load (core value prop).
- D-03: Standalone tab preserves the existing CostOutput behavior unchanged.
- D-04: Standalone total shown as a small badge/reference on the Comparison tab so users don't lose that context.
- D-05: Neither column is sticky — both scroll with the page (removes the Phase 4 sticky behavior).

**Comparison Tab Content (top to bottom)**
- D-06: Two summary cards side-by-side: "Shared Path" total and "Duplicated Path" total, with the delta/savings highlighted.
- D-07: Break-even callout between summary cards and chart — success-styled when break-even exists ("Break-even at X months — you save €Y over Z years"), warning-styled when no break-even.
- D-08: Chart comes first (hero element for presentations), breakdown table below.
- D-09: Side-by-side breakdown table: Category | Shared (Hours, €) | Duplicated (Hours, €). Single table, not stacked.

**Chart Design**
- D-10: Recharts Area chart with filled areas and transparency.
- D-11: Colors: green (#16a34a) for shared path, red (#dc2626) for duplicated path.
- D-12: Break-even annotated with a vertical dashed line + text label using Recharts ReferenceLine. Omitted when no break-even.
- D-13: X-axis: monthly granularity (engine yearly data interpolated to monthly).
- D-14: Y-axis: abbreviated euro format (€42K). Tooltip on hover shows exact values.
- D-15: Inline legend inside chart area.
- D-16: Interactive hover tooltips showing month, Shared cost, Duplicated cost, and the difference.
- D-17: Fixed chart height ~300-400px (320px per UI-SPEC). Width fills via ResponsiveContainer.

**Advanced Parameters**
- D-18: Collapsible section in the left column, below Time Horizon. Collapsed by default.
- D-19: Each parameter: slider + editable number input side-by-side.
- D-20: Info icon [?] next to each label — click/hover shows popover with research citation.
- D-21: "Reset to defaults" button at the section level.
- D-22: "Modified" badge on the Advanced Parameters header when any value differs from defaults.
- D-23: Six parameters: generalizationFactor (1.0-2.0, default 1.3), portingFactor (0.3-1.0, default 0.65), divergenceRate (0.05-0.50, default 0.20), maintenanceRateShared (0.10-0.30, default 0.18), maintenanceRateDuplicated (0.15-0.40, default 0.22), bugDuplicationFactor (1.0-3.0, default 2.0).

**Number of Consuming Teams**
- D-24: "Number of consuming teams" placed in the main inputs area, below Time Horizon, as its own small card. NOT in Advanced Parameters.

### Claude's Discretion
- Component granularity and internal state management approach
- Specific shadcn/ui component choices for the slider (shadcn Slider or custom)
- Exact popover/tooltip implementation for citations
- Responsive breakpoint behavior for the comparison tab
- How to interpolate yearly engine data to monthly for the chart

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| COST-03 | User can see side-by-side comparison of shared code vs duplicated code total costs | `calcSharedCost` + `calcDuplicatedCost` already return `totalCost`; wire both into ComparisonTab summary cards |
| COST-04 | User can see the break-even point (month) | `calcBreakEven` returns `{ exists: true, months: N }` — interpolate to monthly chart data |
| COST-05 | User can see a clear message when break-even does not exist | `calcBreakEven` returns `{ exists: false, months: null }` — D-07 warning callout |
| COST-06 | User can see divergence rate modeling showing non-linear cost growth for duplicated code | `yearlyBreakdown` from `calcDuplicatedCost` uses exponential divergence; interpolate to monthly for visible curve |
| COST-07 | User can see bug propagation cost as a separate line item | `calcDuplicatedCost` accumulates `yearBugs` each year; surface as "Bug propagation" in breakdown table |
| COST-08 | User can see coordination overhead as explicit cost line in shared code breakdown | `annualCoordinationCost` already computed in `calcSharedCost`; surface as "Coordination" in breakdown table |
| ADV-01 | User can adjust generalization factor (1.0-2.0, default 1.3) | Lift from ENGINE_DEFAULTS to App.tsx useState; pass through EngineInputs |
| ADV-02 | User can adjust porting factor (0.3-1.0, default 0.65) | Same pattern as ADV-01 |
| ADV-03 | User can adjust divergence rate (0.05-0.50, default 0.20) | Same pattern |
| ADV-04 | User can adjust maintenance rate for shared code (0.10-0.30, default 0.18) | Same pattern — currently hardcoded to ENGINE_DEFAULTS.maintenanceRateShared |
| ADV-05 | User can adjust maintenance rate for duplicated code (0.15-0.40, default 0.22) | Same pattern — currently passed as `maintenanceRate` in EngineInputs |
| ADV-06 | User can adjust bug duplication factor (1.0-3.0, default 2.0) | Same pattern — `bugDuplicationFactor` is already in EngineInputs but not yet driven by state |
| ADV-07 | User can adjust number of consuming codebases/teams (2-10, default 2) | Currently hardcoded to ENGINE_DEFAULTS.nbConsumingCodebases in App.tsx |
| ADV-08 | User can see all defaults are pre-filled from research-backed values with source references | Popover citations per D-20 — research doc section references documented below |
| VIZ-01 | User can see cumulative temporal cost curves for both approaches on a single chart | AreaChart with monthly data points from both `yearlyBreakdown` arrays |
| VIZ-02 | User can see break-even point highlighted on chart | ReferenceLine at break-even month from `calcBreakEven` |
| VIZ-03 | Chart has high-contrast, presentation-ready styling with labeled axes | Tailwind chart colors + XAxis/YAxis configuration in Recharts |
| VIZ-04 | User can see citation tooltips showing research source for each formula constant | Popover components per D-20 |
</phase_requirements>

---

## Summary

Phase 5 wires the already-built formula engine into a full comparison UI. The engine functions (`calcSharedCost`, `calcDuplicatedCost`, `calcBreakEven`) are complete and return `YearCost[]` arrays and totals. The primary work is: (1) lifting all six advanced parameters plus `nbConsumingCodebases` from hardcoded `ENGINE_DEFAULTS` into `App.tsx` state, (2) building a `ComparisonTab` component that displays summary cards, break-even callout, chart, and breakdown table, (3) building an `AdvancedParameters` collapsible component with slider+input pairs and citation popovers, and (4) interpolating yearly engine data to monthly granularity for the chart.

Three new shadcn components must be installed before any UI work begins: `Slider`, `Popover`, and `Collapsible`. Recharts 3.8.0 is already installed and all required chart components (`AreaChart`, `Area`, `XAxis`, `YAxis`, `Tooltip`, `ReferenceLine`, `Legend`, `ResponsiveContainer`) are confirmed present in the installed module.

The most non-obvious implementation detail is monthly data interpolation: the engine returns yearly cumulative arrays (Year 0, Year 1 ... Year N) but the chart needs month-level granularity for smooth curves and precise break-even positioning. Linear interpolation between yearly cumulative cost points, generating N×12 monthly data points, is the correct approach for these cost models.

**Primary recommendation:** Install the three missing shadcn components first, lift all formula constants to App.tsx state, then build components in dependency order: ConsumingTeams card → AdvancedParameters collapsible → interpolation utility → CostChart → ComparisonTab → App.tsx tab wrapper refactor.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| recharts | 3.8.0 (installed) | AreaChart, ReferenceLine, ResponsiveContainer | Already in package.json, confirmed working API |
| shadcn/ui Slider | via `npx shadcn add slider` | Parameter range input | Radix-based, accessible, consistent with design system |
| shadcn/ui Popover | via `npx shadcn add popover` | Citation tooltips on info icons | Radix-based, managed open state, accessible |
| shadcn/ui Collapsible | via `npx shadcn add collapsible` | Advanced Parameters disclosure | Radix-based, animated open/close |
| lucide-react | ^1.0.1 (installed) | Info, ChevronDown, ChevronUp, BarChart2 icons | Already installed via shadcn |

### Already Installed (no action needed)
| Component | File | Used For |
|-----------|------|---------|
| Tabs, TabsList, TabsTrigger, TabsContent | src/components/ui/tabs.tsx | Output column tab wrapper |
| Card, CardHeader, CardContent | src/components/ui/card.tsx | Summary cards, section wrappers |
| Badge | src/components/ui/badge.tsx | "Modified" badge, standalone reference |
| Table, TableHeader, TableRow, TableCell | src/components/ui/table.tsx | Side-by-side breakdown table |
| Button | src/components/ui/button.tsx | "Reset to defaults" |
| Input | src/components/ui/input.tsx | Editable number input beside sliders |

**Installation command for missing components:**
```bash
npx shadcn add slider popover collapsible
```

---

## Architecture Patterns

### Recommended Component Structure
```
src/
├── engine/
│   ├── formulas.ts          # UNCHANGED — all pure functions
│   └── types.ts             # UNCHANGED — all types + ENGINE_DEFAULTS
├── lib/
│   └── utils.ts             # ADD: formatEuroAbbrev (€42K format for Y-axis)
├── components/
│   ├── ui/                  # shadcn — add slider.tsx, popover.tsx, collapsible.tsx
│   ├── CostOutput.tsx       # UNCHANGED — becomes Standalone tab content
│   ├── TeamComposition.tsx  # UNCHANGED
│   ├── FeatureSizing.tsx    # UNCHANGED
│   ├── TimeHorizon.tsx      # UNCHANGED
│   ├── ConsumingTeams.tsx   # NEW — number input card for nbConsumingCodebases
│   ├── AdvancedParameters.tsx  # NEW — collapsible section with 6 slider+input rows
│   ├── CostChart.tsx        # NEW — Recharts AreaChart with monthly interpolation
│   └── ComparisonTab.tsx    # NEW — summary cards + break-even callout + chart + table
└── App.tsx                  # MODIFIED — lift advanced params to state, add tabs wrapper
```

### Pattern 1: Monthly Interpolation of YearCost[] Arrays

The engine returns yearly cumulative cost arrays. For the chart, linear interpolation generates monthly data points between year boundaries.

```typescript
// Interpolate YearCost[] to MonthCost[] for chart data
interface MonthCost {
  month: number;       // 1..horizonYears*12
  shared: number;
  duplicated: number;
}

function interpolateToMonthly(
  shared: YearCost[],
  duplicated: YearCost[],
): MonthCost[] {
  const result: MonthCost[] = [];
  // Year 0 = setup costs at month 0 (omit or include as month 0)
  for (let yi = 1; yi < shared.length; yi++) {
    const prevShared = shared[yi - 1].cumulativeCost;
    const currShared = shared[yi].cumulativeCost;
    const prevDup = duplicated[yi - 1].cumulativeCost;
    const currDup = duplicated[yi].cumulativeCost;
    for (let m = 1; m <= 12; m++) {
      const frac = m / 12;
      result.push({
        month: (yi - 1) * 12 + m,
        shared: prevShared + (currShared - prevShared) * frac,
        duplicated: prevDup + (currDup - prevDup) * frac,
      });
    }
  }
  return result;
}
```

**Confidence:** HIGH — linear interpolation between cumulative cost points is mathematically correct for constant-rate annual costs.

### Pattern 2: Recharts AreaChart with ReferenceLine

```tsx
// Source: Recharts 3.8.0 — confirmed exports via module inspection
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, ReferenceLine, Legend,
  CartesianGrid,
} from 'recharts';

<ResponsiveContainer width="100%" height={320}>
  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
    <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -4 }} />
    <YAxis tickFormatter={formatEuroAbbrev} />
    <Tooltip content={<CustomTooltip />} />
    <Legend verticalAlign="top" align="right" />
    {breakEven.exists && (
      <ReferenceLine
        x={Math.round(breakEven.months!)}
        stroke="var(--muted-foreground)"
        strokeDasharray="4 4"
        strokeWidth={1.5}
        label={{ value: 'Break-even', position: 'top', fontSize: 11 }}
      />
    )}
    <Area
      type="monotone"
      dataKey="shared"
      name="Shared Path"
      stroke="#16a34a"
      fill="#16a34a"
      fillOpacity={0.2}
      strokeWidth={2}
    />
    <Area
      type="monotone"
      dataKey="duplicated"
      name="Duplicated Path"
      stroke="#dc2626"
      fill="#dc2626"
      fillOpacity={0.2}
      strokeWidth={2}
    />
  </AreaChart>
</ResponsiveContainer>
```

### Pattern 3: Advanced Parameters State in App.tsx

App.tsx currently hardcodes all formula constants from `ENGINE_DEFAULTS`. Phase 5 lifts them to state:

```typescript
// New state in App.tsx
const [advancedParams, setAdvancedParams] = useState({
  generalizationFactor: ENGINE_DEFAULTS.generalizationFactor,
  portingFactor: ENGINE_DEFAULTS.portingFactor,
  divergenceRate: ENGINE_DEFAULTS.divergenceRate,
  maintenanceRateShared: ENGINE_DEFAULTS.maintenanceRateShared,
  maintenanceRateDuplicated: ENGINE_DEFAULTS.maintenanceRateDuplicated,
  bugDuplicationFactor: ENGINE_DEFAULTS.bugDuplicationFactor,
});
const [nbConsumingCodebases, setNbConsumingCodebases] = useState(
  ENGINE_DEFAULTS.nbConsumingCodebases
);

// isModified flag for "Modified" badge
const isAdvancedModified = useMemo(() =>
  advancedParams.generalizationFactor !== ENGINE_DEFAULTS.generalizationFactor ||
  advancedParams.portingFactor !== ENGINE_DEFAULTS.portingFactor ||
  // ... etc
, [advancedParams]);
```

**Key constraint from STATE.md:** `inputs.maintenanceRate` in `EngineInputs` is the DUPLICATED rate (0.22). The shared rate is accessed from `ENGINE_DEFAULTS.maintenanceRateShared` inside `calcBreakEven`. When lifting to state, `sharedMaintenance` and `duplicatedMaintenance` are separate state fields — `calcSharedCost` receives `maintenanceRateShared`, `calcDuplicatedCost` receives `maintenanceRateDuplicated` mapped to `maintenanceRate`.

### Pattern 4: Slider + Input Binding (per D-19)

```tsx
function ParamRow({ label, value, min, max, step, onChange, citation }) {
  const [inputStr, setInputStr] = useState(String(value));

  // Keep inputStr in sync when value changes externally (reset)
  useEffect(() => { setInputStr(String(value)); }, [value]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 w-40">
        <span className="text-sm">{label}</span>
        <Popover>
          <PopoverTrigger asChild>
            <button aria-label={`View citation for ${label}`}>
              <Info size={14} className="text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="text-xs w-64">{citation}</PopoverContent>
        </Popover>
      </div>
      <Slider
        min={min} max={max} step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="flex-1"
      />
      <Input
        type="number"
        value={inputStr}
        onChange={(e) => setInputStr(e.target.value)}
        onBlur={() => {
          const n = parseFloat(inputStr);
          if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
          setInputStr(String(value)); // reset display to clamped value
        }}
        className="w-18 text-right"
      />
    </div>
  );
}
```

### Pattern 5: Y-Axis Abbreviated Euro Formatter

The existing `formatEuro` uses full `Intl.NumberFormat` output (not suited for Y-axis ticks). A dedicated formatter is needed:

```typescript
// Add to src/lib/utils.ts
export function formatEuroAbbrev(amount: number): string {
  if (amount >= 1_000_000) return `€${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `€${Math.round(amount / 1_000)}K`;
  return `€${Math.round(amount)}`;
}
```

### Pattern 6: Side-by-Side Breakdown Table (D-09)

The breakdown table requires exposing per-category costs from both `SharedCostOutputs` and `DuplicatedCostOutputs`. The current output types provide aggregate totals but not fully structured per-category breakdowns. The breakdown rows must be constructed in the UI from the raw cost fields:

**Shared path rows:**
- Initial Development: `initialDevCost`
- Library Setup: `libSetupCost`
- Annual Maintenance (×N years): `annualMaintenanceCost × horizonYears`
- Coordination: `annualCoordinationCost × horizonYears`
- Onboarding: `annualOnboardingCost × horizonYears`

**Duplicated path rows:**
- Initial Development (×2 codebases): `duplicatedDevCost`
- Maintenance (growing): total from `yearlyBreakdown` delta minus initial
- Bug Propagation: `ADDITIONAL_BUGS_ANNUAL_COST × horizonYears` (currently a constant embedded in formulas.ts — exposed via computed breakdown)
- Sync/Divergence: remaining yearly costs

**Note:** `calcDuplicatedCost` does not return per-category yearly sub-totals — only cumulative `YearCost[]`. The breakdown table will need either (a) exposing sub-totals from the engine functions or (b) computing approximate per-category totals from available outputs. Approach (a) is cleaner: extend `DuplicatedCostOutputs` to include `totalBugsCost` and `totalSyncCost` as computed totals.

### Anti-Patterns to Avoid

- **Calling engine functions in component render bodies:** Use `useMemo` in App.tsx — engine functions are pure but potentially called on every keystroke. Always memoize with dependency arrays.
- **Putting tab state in App.tsx:** Tab switching (Standalone/Comparison) is purely presentational — local `useState` inside the output column wrapper is correct.
- **Using `recharts` default colors:** Explicitly pass `stroke` and `fill` with the locked hex values (#16a34a, #dc2626) — do not rely on Recharts' internal color cycle.
- **Passing `maintenanceRate` ambiguously:** `EngineInputs.maintenanceRate` is the DUPLICATED rate by engine convention (STATE.md decision). Always map `maintenanceRateDuplicated` → `maintenanceRate` when building `EngineInputs` for `calcDuplicatedCost`. Pass `maintenanceRateShared` directly where the engine needs it.
- **Fractional break-even months in ReferenceLine:** `calcBreakEven` returns a fractional month. Use `Math.round()` for the `ReferenceLine x` position so it snaps to an actual data point. Show the fractional value in the callout text.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible slider with keyboard support | Custom range input | shadcn Slider (Radix) | Radix handles ARIA, keyboard nav, thumb focus |
| Popover positioning | CSS position:absolute | shadcn Popover (Radix floating-ui) | Viewport collision, z-index stacking, focus trap |
| Collapsible animation | CSS height transition | shadcn Collapsible (Radix) | Handles open/close state, transition, a11y |
| Responsive chart width | Fixed-width SVG | Recharts ResponsiveContainer | Handles resize observer, prevents SVG overflow |
| Euro abbreviation for axis | Manual string format | `formatEuroAbbrev` utility (small helper) | Simple enough to write, no library needed |

---

## Common Pitfalls

### Pitfall 1: Recharts 3.x API vs 2.x Documentation
**What goes wrong:** Most tutorials and Stack Overflow answers reference Recharts 2.x. The installed version is 3.8.0. The public API for `AreaChart`, `Area`, `XAxis`, `YAxis`, `ReferenceLine` etc. is backward-compatible between 2.x and 3.x for the props used here.
**Why it happens:** Recharts 3.0 was released in late 2024 with some internal changes.
**How to avoid:** The confirmed exports from the installed module match all components in the UI-SPEC. Stick to the patterns in this document.
**Warning signs:** TypeScript errors on props that were valid in 2.x — check Recharts 3.x changelogs.

### Pitfall 2: Break-Even Month vs Chart Data Point Alignment
**What goes wrong:** `calcBreakEven` returns a continuous month value (e.g., 23.7). The monthly data array has integer indices 1..N×12. A `ReferenceLine` with `x={23.7}` will not align with any actual data point, potentially rendering off-position.
**Why it happens:** The break-even formula computes upfrontCost / netMonthlySavings as a real number.
**How to avoid:** Use `Math.round(breakEven.months)` for the `ReferenceLine x` prop. Display the raw fractional value in the callout text for precision.
**Warning signs:** ReferenceLine appearing between tick marks or not rendering.

### Pitfall 3: maintenanceRate Identity Confusion
**What goes wrong:** App.tsx currently passes `maintenanceRate: ENGINE_DEFAULTS.maintenanceRateShared` to `calcStandaloneCost`. For Phase 5, two separate rates exist. `calcSharedCost` and `calcDuplicatedCost` both accept `EngineInputs` but use `maintenanceRate` differently — the shared function uses it for base maintenance, the duplicated function uses it as the duplicated rate.
**Why it happens:** `EngineInputs` has a single `maintenanceRate` field (the duplicated rate by convention per STATE.md).
**How to avoid:** Build two separate `EngineInputs` objects in App.tsx `useMemo` blocks — one for shared (pass `maintenanceRateShared` as `maintenanceRate`), one for duplicated (pass `maintenanceRateDuplicated` as `maintenanceRate`). Do not reuse the same inputs object for both calculations.
**Warning signs:** Shared path costs changing when you adjust the duplicated maintenance rate slider.

### Pitfall 4: Slider Step Precision and Floating Point
**What goes wrong:** Slider value `0.20 + 0.01 = 0.21` in JavaScript floating-point arithmetic can produce `0.21000000000000002`. This will show as a spurious "Modified" badge even when the user hasn't changed anything.
**Why it happens:** Floating-point binary representation.
**How to avoid:** For the `isAdvancedModified` comparison, use `Math.abs(value - default) > 0.001` instead of `===`. For display in the Input field, use `value.toFixed(2)` (or the appropriate decimal places per parameter step).
**Warning signs:** "Modified" badge appearing immediately on page load.

### Pitfall 5: shadcn Slider Array Value API
**What goes wrong:** shadcn Slider `value` prop is an array (`number[]`), not a scalar `number`. Destructuring incorrectly causes TypeScript errors or silent failures.
**Why it happens:** Radix Slider supports multi-thumb (range) sliders.
**How to avoid:** Always pass `value={[numericValue]}` and destructure `onValueChange={([v]) => handleChange(v)}`.
**Warning signs:** TypeScript error "Type 'number' is not assignable to type 'number[]'".

### Pitfall 6: Y-Axis Label Overlap at Small Values
**What goes wrong:** If devHours = 0 or teamAvgRate = 0 (empty state), all data points are 0. The Y-axis renders 5 ticks all showing €0K, which looks broken.
**Why it happens:** Recharts renders the chart even for flat data.
**How to avoid:** Don't render CostChart when `teamAvgRate === 0 || devHours === 0` — show the ComparisonTab empty state instead (same condition as standalone empty state, per UI-SPEC).
**Warning signs:** Chart rendering with all-zero data.

---

## Code Examples

### Monthly Interpolation Utility
```typescript
// src/lib/utils.ts addition
export interface MonthCostPoint {
  month: number;
  shared: number;
  duplicated: number;
}

export function buildMonthlyChartData(
  sharedYearly: YearCost[],
  duplicatedYearly: YearCost[],
): MonthCostPoint[] {
  const points: MonthCostPoint[] = [];
  for (let yi = 1; yi < sharedYearly.length; yi++) {
    const s0 = sharedYearly[yi - 1].cumulativeCost;
    const s1 = sharedYearly[yi].cumulativeCost;
    const d0 = duplicatedYearly[yi - 1].cumulativeCost;
    const d1 = duplicatedYearly[yi].cumulativeCost;
    for (let m = 1; m <= 12; m++) {
      const frac = m / 12;
      points.push({
        month: (yi - 1) * 12 + m,
        shared: s0 + (s1 - s0) * frac,
        duplicated: d0 + (d1 - d0) * frac,
      });
    }
  }
  return points;
}
```

### formatEuroAbbrev for Y-axis ticks
```typescript
// src/lib/utils.ts addition
export function formatEuroAbbrev(amount: number): string {
  if (amount >= 1_000_000) return `€${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `€${Math.round(amount / 1_000)}K`;
  return `€${Math.round(amount)}`;
}
```

### Break-Even Callout Component Shape
```tsx
// Rendered inside ComparisonTab between summary cards and chart
function BreakEvenCallout({ breakEven, horizonYears, savings }: Props) {
  if (breakEven.exists) {
    return (
      <div className="rounded-md bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm">
        Break-even at {Math.round(breakEven.months!)} months — you save{' '}
        {formatEuro(savings)} over {horizonYears} years
      </div>
    );
  }
  return (
    <div className="rounded-md bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
      No break-even within {horizonYears} years — shared code costs more in this
      scenario. Try increasing the number of consuming teams or extending the time horizon.
    </div>
  );
}
```

### App.tsx EngineInputs Construction (two objects)
```typescript
// In App.tsx useMemo — build separate inputs for shared vs duplicated
const sharedEngineInputs: EngineInputs = useMemo(() => ({
  teamAvgHourlyRate: teamAvgRate,
  devHours,
  horizonYears,
  maintenanceRate: advancedParams.maintenanceRateShared,   // KEY: shared rate here
  generalizationFactor: advancedParams.generalizationFactor,
  portingFactor: advancedParams.portingFactor,
  divergenceRate: advancedParams.divergenceRate,
  bugDuplicationFactor: advancedParams.bugDuplicationFactor,
  nbConsumingCodebases,
}), [teamAvgRate, devHours, horizonYears, advancedParams, nbConsumingCodebases]);

const duplicatedEngineInputs: EngineInputs = useMemo(() => ({
  ...sharedEngineInputs,
  maintenanceRate: advancedParams.maintenanceRateDuplicated, // KEY: duplicated rate here
}), [sharedEngineInputs, advancedParams.maintenanceRateDuplicated]);
```

---

## Research-Backed Citation Text (for ADV-08 / D-20 Popovers)

| Parameter | Default | Range | Citation Text |
|-----------|---------|-------|---------------|
| Generalization factor | 1.3 | 1.0–2.0 | "Research doc §3.2: Shared code requires 20-40% more code than a specific implementation to be generic enough for multiple consumers. Default 1.3 reflects the conservative end of the +20% estimate." |
| Porting factor | 0.65 | 0.3–1.0 | "Research doc §4.1: Adapting a feature to a second codebase costs 50-80% of the initial effort. Default 0.65 is the midpoint of the 0.5–0.8 range from industry data." |
| Divergence rate | 0.20 | 0.05–0.50 | "Research doc §7.5: Duplicated code diverges exponentially over time. Default 0.20 (20% annual rate) reflects moderate active development. Higher = faster divergence." |
| Maintenance rate (shared) | 0.18 | 0.10–0.30 | "Research doc §7.1: Annual maintenance cost as % of initial dev cost. Industry average 15-25% (§2.1). Shared code default 18% accounts for generalized codebase overhead." |
| Maintenance rate (duplicated) | 0.22 | 0.15–0.40 | "Research doc §7.2: Duplicated code maintenance is higher due to double effort. Default 22% (vs 18% shared) reflects the 2x overhead on bug fixes and feature evolution (§4.2)." |
| Bug duplication factor | 2.0 | 1.0–3.0 | "Research doc §7.4 / IEEE study (§2.3): Up to 33% of bug fixes in cloned code contain propagated bugs. Default 2.0 models full doubling of bug fix cost across 2 codebases." |

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Engine constants hardcoded in App.tsx | All formula constants lifted to state with ENGINE_DEFAULTS as defaults | Advanced Parameters panel becomes live-updating |
| Single `EngineInputs` object for standalone | Two separate `EngineInputs` objects (shared + duplicated) | Prevents maintenanceRate identity confusion |
| Recharts 2.x patterns | Recharts 3.8.0 (backward-compatible API for used components) | No migration needed for `AreaChart`/`Area`/`ReferenceLine` props |

---

## Open Questions

1. **`calcDuplicatedCost` sub-total exposure for breakdown table**
   - What we know: The function returns `duplicatedDevCost`, `yearlyBreakdown`, and `totalCost`. Bug and sync sub-totals are accumulated inside the loop but not returned.
   - What's unclear: Should the engine be extended to return `totalBugsCost` and `totalSyncCost`, or should the UI compute approximate values from available data?
   - Recommendation: Extend `DuplicatedCostOutputs` in types.ts to include `totalBugsCost: number` and `totalSyncCost: number`, computed inside `calcDuplicatedCost`. This is cleaner than UI-layer approximation and keeps cost logic in the engine. This is a small engine change that requires a matching types.ts update.

2. **Break-even calculation when maintenanceRates are user-modified**
   - What we know: `calcBreakEven` currently reads `ENGINE_DEFAULTS.maintenanceRateShared` internally (hardcoded, per STATE.md decision). When the user modifies `maintenanceRateShared` via Advanced Parameters, the break-even will not reflect the change.
   - What's unclear: Should `calcBreakEven` be refactored to accept both rates from inputs?
   - Recommendation: Yes — pass `maintenanceRateShared` through `EngineInputs` (currently it's read from ENGINE_DEFAULTS inside the function). The `calcBreakEven` function should accept it from inputs. This is a small engine change but ensures break-even stays consistent with the rest of the comparison.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|---------|
| recharts | VIZ-01, VIZ-02, VIZ-03 | Yes | 3.8.0 | — |
| shadcn Slider | ADV-01 through ADV-07 | No — needs install | — | Install: `npx shadcn add slider` |
| shadcn Popover | ADV-08, VIZ-04 | No — needs install | — | Install: `npx shadcn add popover` |
| shadcn Collapsible | D-18 | No — needs install | — | Install: `npx shadcn add collapsible` |
| lucide-react | Info, ChevronDown icons | Yes | ^1.0.1 | — |

**Missing dependencies with no fallback:**
- `slider`, `popover`, `collapsible` shadcn components — must be installed before implementation begins (one command: `npx shadcn add slider popover collapsible`)

---

## Validation Architecture

> `nyquist_validation: false` in .planning/config.json — this section is SKIPPED.

---

## Sources

### Primary (HIGH confidence)
- `src/engine/formulas.ts` — Complete engine functions, verified by direct read
- `src/engine/types.ts` — `EngineInputs`, `ENGINE_DEFAULTS`, all output type interfaces, verified by direct read
- `src/App.tsx` — Current state management pattern and wiring, verified by direct read
- `src/components/CostOutput.tsx` — Existing table/card pattern for breakdown display
- `node_modules/recharts` — Version 3.8.0, exports confirmed via `require()` inspection
- `.planning/phases/05-comparison-view-chart-and-advanced-controls/05-CONTEXT.md` — All locked decisions
- `.planning/phases/05-comparison-view-chart-and-advanced-controls/05-UI-SPEC.md` — Visual/interaction contract, component inventory, copy contract
- `docs/feature-cost-shared-vs-duplicated.md` §1.3, §3.2, §3.3, §4.1, §4.2, §7.1-7.5 — Research-backed defaults and citation text

### Secondary (MEDIUM confidence)
- shadcn/ui component inventory in `src/components/ui/` — confirmed by directory listing (9 components: badge, button, card, input, select, separator, table, tabs, toggle)
- `.planning/STATE.md` — `maintenanceRate` convention (duplicated rate in EngineInputs), sticky removal decision

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions confirmed from installed modules
- Architecture: HIGH — engine is complete, patterns follow established App.tsx conventions
- Pitfalls: HIGH — sourced from direct code reading (STATE.md decisions, type interfaces)
- Open questions: MEDIUM — engine extension needed (confirmed from source), impact is bounded

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (stable stack, 30-day validity)
