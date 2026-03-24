# Phase 12: Standalone Organizational Costs - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Enrich the Standalone cost model with organizational costs (support, versioning, onboarding, coordination) that currently only appear in the Shared/Duplicated paths. A feature built by a single team still incurs these costs — the current Standalone mode underestimates by ~5× because it only counts dev + maintenance.

</domain>

<decisions>
## Implementation Decisions

### Which organizational costs to include
- **D-01:** Include all four organizational cost categories from the shared model: versioning, support, onboarding, and coordination
- **D-02:** Coordination cost scales with `nbConsumingCodebases` — when set to 0 (standalone default), coordination is 0€. This makes coordination optional for standalone but structurally present
- **D-03:** Support and versioning apply to any maintained feature regardless of sharing — these are non-zero even for standalone
- **D-04:** Onboarding applies to any team maintaining code — new devs still need training on the feature

### Breakdown display
- **D-05:** Each organizational cost gets its own row in the breakdown table — same granularity as the shared model for consistency
- **D-06:** Breakdown rows: Initial Development, Annual Maintenance, Versioning, Consumer Support, Coordination, Onboarding — matching the categories in `calcSharedCost`
- **D-07:** Hours column populated for each category (derived from the formula constants) — not just cost

### Engine changes
- **D-08:** Modify `calcStandaloneCost` in `src/engine/formulas.ts` to compute organizational costs using the same constants already defined (VERSIONING_*, SUPPORT_*, COORDINATION_*, ONBOARDING_*)
- **D-09:** `StandaloneOutputs` in `src/engine/types.ts` extended with individual cost fields (annualVersioningCost, annualSupportCost, annualCoordinationCost, annualOnboardingCost) for breakdown display
- **D-10:** No new Advanced Parameters needed — organizational costs use the same constants as shared. The existing `nbConsumingCodebases` slider already controls coordination scaling

### Unit tests
- **D-11:** Update `src/engine/__tests__/formulas.test.ts` to verify standalone totals match expected values with organizational costs included
- **D-12:** Engine-before-UI discipline: formula changes verified before CostOutput.tsx is updated

### Claude's Discretion
- Exact ordering of breakdown rows in the table
- Whether to add a subtotal row separating dev/maintenance from organizational costs
- Any helper text or tooltip explaining what organizational costs represent

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Cost Model & Formulas
- `docs/feature-cost-shared-vs-duplicated.md` §7.1 — Shared cost formula with all organizational cost components (versioning, support, coordination, onboarding) and their constants
- `docs/feature-cost-shared-vs-duplicated.md` §1.3 — French developer salary data used for rate calculations

### Existing Engine
- `src/engine/formulas.ts` — Current formula engine with `calcStandaloneCost` (to modify) and `calcSharedCost` (reference for organizational cost computation)
- `src/engine/types.ts` — Type definitions including `StandaloneOutputs` (to extend) and `EngineInputs`
- `src/engine/__tests__/formulas.test.ts` — Existing test suite to extend

### UI Components
- `src/components/CostOutput.tsx` — Standalone cost display component (to update with new breakdown rows)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `calcSharedCost` in formulas.ts already computes all four organizational costs — the same constants and formulas can be reused directly in `calcStandaloneCost`
- Constants already defined at module level: `VERSIONING_RELEASES_PER_YEAR`, `VERSIONING_HOURS_PER_RELEASE`, `SUPPORT_HOURS_PER_WEEK`, `WEEKS_PER_YEAR`, `COORDINATION_HOURS_PER_WEEK_PER_TEAM`, `NEW_DEVS_PER_YEAR`, `ONBOARDING_TRAINING_HOURS`, `ONBOARDING_MENTORING_HOURS`, `ONBOARDING_TRAINING_RATE_FACTOR`

### Established Patterns
- `BreakdownRow` type already has: category, hours, cost, percentage — fits new rows without type changes
- `CostOutput.tsx` maps over `output.breakdown` array — adding rows to the engine output automatically renders them
- `formatEuro` utility for currency display

### Integration Points
- `App.tsx` calls `calcStandaloneCost(engineInputs)` and passes result to `<CostOutput>`
- `url-state.ts` serializes/deserializes `EngineInputs` — no changes needed since no new input parameters are added
- `ComparisonTab.tsx` uses shared/duplicated outputs — unaffected by standalone changes

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

*Phase: 12-standalone-organizational-costs*
*Context gathered: 2026-03-24*
