# Phase 12: Standalone Organizational Costs - Research

**Researched:** 2026-03-24
**Domain:** Formula engine extension (TypeScript), type system, Vitest unit tests, React breakdown table UI, Markdown documentation update
**Confidence:** HIGH

## Summary

Phase 12 extends `calcStandaloneCost` in `src/engine/formulas.ts` to include the four organizational cost categories (versioning, support, coordination, onboarding) that currently only exist in `calcSharedCost`. All required constants are already declared at module scope in `formulas.ts` — no new research on external libraries is needed. The work is entirely internal to the project's existing patterns.

The current Standalone model only accounts for initial development and baseline maintenance. The research doc (§7.1) makes clear these organizational costs apply to any maintained feature, not only shared ones: versioning, support, and onboarding exist regardless of sharing; coordination exists when `nbConsumingCodebases > 0`. At the default standalone input (0 consuming codebases), coordination is 0€, which is the correct and expected behavior per D-02.

The UI change is zero-risk: `CostOutput.tsx` already maps over `output.breakdown[]` — adding rows to the engine output automatically renders new rows without component-level changes beyond the hours total in the table footer (which currently shows `initialDevHours`, a value that remains correct since the new organizational rows carry their own hours).

**Primary recommendation:** Implement engine first, verify with Vitest, then update the breakdown array and `StandaloneOutputs` type, then update the docs page.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Include all four organizational cost categories: versioning, support, onboarding, and coordination
- **D-02:** Coordination cost scales with `nbConsumingCodebases` — when 0 (standalone default), coordination is 0€
- **D-03:** Support and versioning apply to any maintained feature — non-zero even for standalone
- **D-04:** Onboarding applies to any team maintaining code — new devs still need training
- **D-05:** Each organizational cost gets its own row in the breakdown table
- **D-06:** Breakdown rows: Initial Development, Annual Maintenance, Versioning, Consumer Support, Coordination, Onboarding — matching categories in `calcSharedCost`
- **D-07:** Hours column populated for each category (derived from formula constants)
- **D-08:** Modify `calcStandaloneCost` in `src/engine/formulas.ts` using same constants already defined
- **D-09:** `StandaloneOutputs` in `src/engine/types.ts` extended with individual cost fields: `annualVersioningCost`, `annualSupportCost`, `annualCoordinationCost`, `annualOnboardingCost`
- **D-10:** No new Advanced Parameters — `nbConsumingCodebases` slider already controls coordination scaling
- **D-11:** Update `src/engine/__tests__/formulas.test.ts` to verify standalone totals match expected values
- **D-12:** Engine-before-UI discipline: formula changes verified before `CostOutput.tsx` is updated

### Claude's Discretion

- Exact ordering of breakdown rows in the table
- Whether to add a subtotal row separating dev/maintenance from organizational costs
- Any helper text or tooltip explaining what organizational costs represent

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

## Standard Stack

No new dependencies. This phase uses the project's existing stack exclusively.

| Layer | File | Role |
|-------|------|------|
| Engine | `src/engine/formulas.ts` | `calcStandaloneCost` — primary change target |
| Types | `src/engine/types.ts` | `StandaloneOutputs` interface — extend with 4 new fields |
| Tests | `src/engine/__tests__/formulas.test.ts` | Vitest suite — update existing + add new cases |
| UI | `src/components/CostOutput.tsx` | Breakdown table — no structural change needed |
| Docs | `docs/feature-cost-shared-vs-duplicated.md` | Update standalone cost description |

**No `npm install` required.**

## Architecture Patterns

### Engine Pattern: Mirror `calcSharedCost` structure

The four organizational cost sub-computations in `calcSharedCost` use module-level constants that are already accessible to `calcStandaloneCost`. The pattern is to copy the computation block verbatim, then include the costs in `totalStandaloneCost` and expose them as individual fields on the return object.

```typescript
// Source: src/engine/formulas.ts (existing calcSharedCost — lines 207-219)

// Annual versioning cost
const versioningCost = VERSIONING_RELEASES_PER_YEAR * VERSIONING_HOURS_PER_RELEASE * rate;

// Annual support cost
const supportCost = SUPPORT_HOURS_PER_WEEK * WEEKS_PER_YEAR * rate;

// Annual coordination cost (0 when nbConsumingCodebases = 0)
const annualCoordinationCost =
  nbConsumingCodebases * COORDINATION_HOURS_PER_WEEK_PER_TEAM * WEEKS_PER_YEAR * rate;

// Annual onboarding cost
const midRate = rate * ONBOARDING_TRAINING_RATE_FACTOR;
const annualOnboardingCost =
  NEW_DEVS_PER_YEAR *
  (ONBOARDING_TRAINING_HOURS * midRate + ONBOARDING_MENTORING_HOURS * rate);
```

The standalone total becomes:

```typescript
const annualOrgCosts = versioningCost + supportCost + annualCoordinationCost + annualOnboardingCost;
const totalOrgCosts = annualOrgCosts * horizonYears;
const totalStandaloneCost = initialDevCost + totalMaintenanceCost + totalOrgCosts;
```

### Type Extension Pattern

`StandaloneOutputs` in `types.ts` currently has 7 fields. Add 4 named cost fields (D-09). The `breakdown: BreakdownRow[]` field is already present and accepts new rows without a type change.

```typescript
// Source: src/engine/types.ts (existing StandaloneOutputs — lines 48-56)
// Add these fields:
annualVersioningCost: number;
annualSupportCost: number;
annualCoordinationCost: number;
annualOnboardingCost: number;
```

### Breakdown Row Pattern

`BreakdownRow` has `{ category, hours, cost, percentage }`. Hours for organizational rows must be derived from the formula constants:

| Row | Hours formula | Cost formula |
|-----|---------------|--------------|
| Versioning | `VERSIONING_RELEASES_PER_YEAR * VERSIONING_HOURS_PER_RELEASE * horizonYears` | `versioningCost * horizonYears` |
| Consumer Support | `SUPPORT_HOURS_PER_WEEK * WEEKS_PER_YEAR * horizonYears` | `supportCost * horizonYears` |
| Coordination | `nbConsumingCodebases * COORDINATION_HOURS_PER_WEEK_PER_TEAM * WEEKS_PER_YEAR * horizonYears` | `annualCoordinationCost * horizonYears` |
| Onboarding | `NEW_DEVS_PER_YEAR * (ONBOARDING_TRAINING_HOURS + ONBOARDING_MENTORING_HOURS) * horizonYears` | `annualOnboardingCost * horizonYears` |

**Note:** Existing `breakdown` rows use total-over-horizon costs and hours, not per-year. The Annual Maintenance row already does `cost: totalMaintenanceCost`. Organizational rows should follow the same convention — total over horizon — for consistency. The `category` label for the maintenance row is `Annual Maintenance (x${horizonYears} years)` which signals this convention.

Percentage denominators must use the new `totalStandaloneCost` (which is higher).

### UI Rendering Pattern

`CostOutput.tsx` renders breakdown rows by mapping over `output.breakdown` (line 79). No structural change is needed. The table footer currently shows `output.initialDevHours` as the hours total. After this change, that figure only represents dev hours, not the full organizational hours total. The planner should decide whether to update the footer hours total to sum all breakdown row hours.

### Anti-Patterns to Avoid

- **Duplicating constant definitions:** Do not redeclare `VERSIONING_RELEASES_PER_YEAR` etc. inside `calcStandaloneCost`. They are already module-scoped and available.
- **Forgetting `nbConsumingCodebases` is already in `EngineInputs`:** It is destructured from `inputs` — add it to the destructure statement in `calcStandaloneCost`.
- **Computing percentages before updating `totalStandaloneCost`:** Percentages divide by total — the total must be computed first including org costs.
- **Using `annualMaintenanceCost` as the base for percentage:** The existing maintenance row percentage will shrink when the total grows — this is correct and expected.

## Don't Hand-Roll

This phase has no external library problem to solve. All math, types, rendering, and test patterns are established in the existing codebase.

| Problem | Don't build | Use instead |
|---------|-------------|-------------|
| Organizational cost formulas | Reimplemented logic | Exact constants already in `formulas.ts` module scope |
| Breakdown row rendering | New table component | Existing `CostOutput.tsx` map pattern |
| Test assertions on floats | Custom matcher | `toBeCloseTo(value, 0)` (Vitest, already used throughout) |

## Verified Numbers

These are the exact pre-computed values for the reference test inputs (`rate=65, devHours=400, horizonYears=3, maintenanceRate=0.18, genFactor=1.3, nbConsumingCodebases=0`):

| Item | Per-year | x3 years | Source |
|------|----------|----------|--------|
| initialDevCost | — | 33,800 € | 400 × 65 × 1.3 |
| annualMaintenanceCost | 6,084 € | 18,252 € | 33800 × 0.18 |
| annualVersioningCost | 2,340 € | 7,020 € | 12 × 3 × 65 |
| annualSupportCost | 25,350 € | 76,050 € | 7.5 × 52 × 65 |
| annualCoordinationCost | 0 € | 0 € | 0 × 3 × 52 × 65 |
| annualOnboardingCost | 12,900 € | 38,700 € | 3 × (60×50 + 20×65) |
| **totalStandaloneCost** | | **173,822 €** | 33800 + (6084+2340+25350+0+12900)×3 |

Old total (no org costs): 52,052 € — new total is ~3.3× higher.

For `nbConsumingCodebases=2` (matching the shared cost test fixture), coordination becomes:
- `annualCoordinationCost = 2 × 3 × 52 × 65 = 20,280 €/year`

## Common Pitfalls

### Pitfall 1: Percentage denominator uses old total
**What goes wrong:** Breakdown row percentages are computed before `totalStandaloneCost` includes org costs, so they don't sum to 100.
**Why it happens:** Copy-pasting percentage computation from the existing two-row logic without updating the total.
**How to avoid:** Compute `totalStandaloneCost` first, then construct the breakdown array using it as denominator.
**Warning signs:** Existing `breakdown percentages sum to 100` test will fail.

### Pitfall 2: Footer hours total becomes misleading
**What goes wrong:** `CostOutput.tsx` TableFooter shows `output.initialDevHours` as the "Total" hours. After adding 4 new breakdown rows with hours > 0, the footer total no longer matches the sum of all row hours.
**Why it happens:** The footer was written when only dev hours were meaningful. Now organizational rows add hours.
**How to avoid:** Planner should decide: either sum all `breakdown[].hours` for the footer, or accept that the footer hours only represents dev hours (and label accordingly).
**Warning signs:** Visual inconsistency between footer sum and individual row hours.

### Pitfall 3: `nbConsumingCodebases` missing from destructure
**What goes wrong:** TypeScript error or runtime NaN in coordination computation.
**Why it happens:** `calcStandaloneCost` currently destructures only 5 fields from `inputs` — `nbConsumingCodebases` is not among them.
**How to avoid:** Add `nbConsumingCodebases` to the destructure statement at the top of `calcStandaloneCost`.
**Warning signs:** `annualCoordinationCost` computes as `NaN` or `undefined * ...`.

### Pitfall 4: Test expects old `breakdown` length
**What goes wrong:** The existing test `'returns breakdown with 2 rows'` will fail after phase changes breakdown to 6 rows.
**Why it happens:** Hard-coded `toHaveLength(2)` in the test.
**How to avoid:** Update this assertion to `toHaveLength(6)` and add assertions for each new category name.

### Pitfall 5: Doc update uses wrong standalone cost figures
**What goes wrong:** `docs/feature-cost-shared-vs-duplicated.md` references standalone cost without organizational costs, and the update contradicts the formula engine.
**Why it happens:** The doc page has no live binding to the engine — it must be updated manually.
**How to avoid:** Use the verified numbers table above (173,822 € for the reference example) when updating the doc.

## Code Examples

### calcStandaloneCost — current structure (annotated for change points)

```typescript
// Source: src/engine/formulas.ts lines 140-178
export function calcStandaloneCost(inputs: EngineInputs): StandaloneOutputs {
  const {
    teamAvgHourlyRate,
    devHours,
    horizonYears,
    maintenanceRate,
    generalizationFactor,
    // ADD: nbConsumingCodebases  ← CHANGE POINT 1
  } = inputs;

  const initialDevCost = devHours * teamAvgHourlyRate * generalizationFactor;
  const annualMaintenanceCost = initialDevCost * maintenanceRate;
  const totalMaintenanceCost = annualMaintenanceCost * horizonYears;
  // ADD: org cost computations here  ← CHANGE POINT 2
  // UPDATE: totalStandaloneCost to include org costs  ← CHANGE POINT 3

  const breakdown = [
    { category: 'Initial Development', ... },
    { category: `Annual Maintenance (x${horizonYears} years)`, ... },
    // ADD: 4 new rows  ← CHANGE POINT 4
  ];

  return {
    // existing fields...
    // ADD: annualVersioningCost, annualSupportCost, annualCoordinationCost, annualOnboardingCost  ← CHANGE POINT 5
  };
}
```

### Test pattern for new assertions

```typescript
// Source: src/engine/__tests__/formulas.test.ts (existing pattern)
it('calculates annualVersioningCost = 12 * 3 * rate', () => {
  // 12 * 3 * 65 = 2340
  const result = calcStandaloneCost(baseInputs);
  expect(result.annualVersioningCost).toBeCloseTo(2340, 0);
});

it('returns breakdown with 6 rows', () => {
  const result = calcStandaloneCost(baseInputs);
  expect(result.breakdown).toHaveLength(6);
  expect(result.breakdown[2].category).toBe('Versioning');
  expect(result.breakdown[3].category).toBe('Consumer Support');
  expect(result.breakdown[4].category).toBe('Coordination');
  expect(result.breakdown[5].category).toBe('Onboarding');
});

it('breakdown percentages still sum to 100 after org cost addition', () => {
  const result = calcStandaloneCost(baseInputs);
  const total = result.breakdown.reduce((sum, row) => sum + row.percentage, 0);
  expect(total).toBeCloseTo(100, 1);
});
```

## Documentation Page Scope

The user requested that `docs/feature-cost-shared-vs-duplicated.md` be updated to reflect standalone costs now including organizational costs. The doc currently has no explicit "Standalone" formula section — standalone is implied by the absence of lib setup and coordination costs. The update should:

1. Add or update text in a relevant section (possibly a new subsection or note near §7.1) explaining that standalone features also incur versioning, support, and onboarding costs — just not lib setup or (by default) coordination.
2. Include the updated reference numbers showing the corrected standalone total (173,822 € vs old 52,052 € for the reference example).
3. NOT change the §7.1 shared formula — it remains accurate.

The documentation is rendered at runtime via `react-markdown` with `?raw` Vite import. The file is a plain Markdown file — edit in place, no build step required.

## Environment Availability

Step 2.6: SKIPPED — this phase makes no external tool calls. All changes are in TypeScript source files, Vitest tests, and a Markdown doc.

## Sources

### Primary (HIGH confidence)
- `src/engine/formulas.ts` — direct code read, constants and patterns verified
- `src/engine/types.ts` — direct code read, `StandaloneOutputs` and `BreakdownRow` types verified
- `src/engine/__tests__/formulas.test.ts` — direct code read, test patterns and existing assertions verified
- `src/components/CostOutput.tsx` — direct code read, rendering pattern verified
- `docs/feature-cost-shared-vs-duplicated.md §7.1` — direct read, organizational cost formulas and reference numbers verified
- `.planning/phases/12-standalone-organizational-costs/12-CONTEXT.md` — decisions D-01 through D-12 verified

### Secondary (MEDIUM confidence)
- N/A

### Tertiary (LOW confidence)
- N/A

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; all patterns read directly from source
- Architecture: HIGH — `calcSharedCost` is the direct reference implementation; constants are module-scoped and verified
- Pitfalls: HIGH — derived from direct code inspection, not estimation
- Verified numbers: HIGH — computed from formula constants in source; spot-checked against existing test expectations

**Research date:** 2026-03-24
**Valid until:** Until formulas.ts constants change (stable; no expiry concern)
