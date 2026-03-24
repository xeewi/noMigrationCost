# Phase 13: Story Points Input Clearing Bug - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix the Team Velocity (SP/sprint) input field so the user can fully clear it and type a new value. Currently the field cannot be emptied because the onChange handler immediately clamps NaN to 1, preventing the user from erasing the existing value to retype.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
User deferred all decisions to Claude. The following choices are based on existing codebase patterns and sound UX:

- **D-01:** Allow temporary empty state while typing — match the story points input pattern (`value={velocity === 1 ? '' : velocity}` with `placeholder="1"`). This lets the user clear the field, see a placeholder, and type a new value.
- **D-02:** Handle empty/NaN in onChange by setting velocity to 0 (or a sentinel) as an intermediate state. On blur or when the engine reads it, treat velocity <= 0 as the default minimum (1) for calculation purposes. This avoids division-by-zero in the engine while allowing the field to be empty during editing.
- **D-03:** Audit all numeric inputs in FeatureSizing.tsx for consistency. Story points (line 94) and direct hours (line 151) already use the empty-when-zero pattern correctly. Only velocity needs fixing.
- **D-04:** No validation feedback (red borders, helper text) needed — silently allow empty and handle gracefully, consistent with how story points and direct hours already work.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Bug Location
- `src/components/FeatureSizing.tsx` lines 107-116 — The velocity input with the clamping bug (onChange handler clamps NaN to 1)
- `src/components/FeatureSizing.tsx` lines 90-100 — The story points input with the correct empty-state pattern (reference for fix)

### Engine Integration
- `src/engine/formulas.ts` — Uses `inputs.velocity` for story-point-to-hours conversion; must handle velocity=0 gracefully
- `src/engine/types.ts` — `EngineInputs.velocity` type definition

No external specs — requirements fully captured in decisions above

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Story points input pattern (line 94): `value={storyPoints === 0 ? '' : storyPoints}` with `placeholder="0"` — proven pattern to reuse
- Same onChange structure with `parseInt` + NaN guard already exists for all numeric inputs

### Established Patterns
- All numeric inputs in FeatureSizing use controlled components with `type="number"` and onChange handlers that parse + clamp
- Empty-when-zero pattern with placeholder is the established convention (story points, direct hours)
- Velocity is the only input that doesn't follow this pattern

### Integration Points
- `App.tsx` passes `velocity` state and `onVelocityChange` handler to FeatureSizing
- `url-state.ts` serializes velocity — empty/0 states should serialize as the default (1) to avoid broken shared URLs
- Engine formulas divide by velocity — zero-guard needed if intermediate state leaks to engine

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

*Phase: 13-story-points-input-clearing-bug*
*Context gathered: 2026-03-24*
