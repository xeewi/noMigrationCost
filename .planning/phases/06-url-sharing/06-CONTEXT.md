# Phase 6: URL Sharing - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can share any calculator scenario via URL so recipients see the exact same inputs and results. All ~20 state fields are encoded in the URL hash — no backend, no accounts. A new header component provides global actions: Copy Link and Reset All.

</domain>

<decisions>
## Implementation Decisions

### Share UX
- **D-01:** Both live URL and Copy Link button — URL hash updates in real-time as inputs change AND a dedicated Copy Link button is available for convenience
- **D-02:** New header component for global actions — houses the Copy Link button, Reset button, and any future global actions (e.g., app title/branding)
- **D-03:** Copy Link feedback via inline button state change — button text/icon briefly changes to checkmark/"Copied!" then reverts, no toast notification

### Reset
- **D-04:** Reset All button in the header component — clears all inputs to initial defaults (zero headcounts, zero SP/hours, default horizon, default advanced params, default consuming teams) and clears the URL hash
- **D-05:** Reset requires confirmation dialog before executing — prevents accidental loss of a configured scenario

### Claude's Discretion
- URL encoding strategy (compact JSON, base64, query params, or other approach — optimize for reasonable URL length with ~20 fields)
- Restore behavior when opening a shared URL (instant restore vs any intermediate step)
- Handling of malformed or incomplete URL hashes (graceful fallback to defaults)
- Whether active output tab (Comparison/Standalone) is encoded in URL — default to Comparison per Phase 5 D-02 if not
- Header component visual design and placement (should feel lightweight, not compete with the calculator content)
- shadcn/ui Alert Dialog or similar for the reset confirmation

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing State Shape (all fields to encode)
- `src/App.tsx` — All `useState` hooks define the complete state to serialize: team[], sizingMode, storyPoints, velocity, sprintWeeks, directValue, directUnit, horizonYears, advancedParams (6 fields), nbConsumingCodebases
- `src/engine/types.ts` — `SeniorityRow`, `SizingMode`, `DirectHoursUnit`, `EngineInputs`, `ENGINE_DEFAULTS`, `SENIORITY_DEFAULTS` — defines types and default values needed for URL restore logic

### Stack & Patterns
- `CLAUDE.md` — Technology stack (React + Vite + TypeScript + shadcn/ui + Tailwind CSS + Recharts)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/App.tsx` — Single source of truth for all state; individual `useState` setters for each field; `useMemo` for derived calculations
- `src/engine/types.ts` — `ENGINE_DEFAULTS` and `SENIORITY_DEFAULTS` provide the canonical default values for reset logic
- `src/components/ui/` — shadcn/ui Card, Button, Badge, Tabs already installed and in use

### Established Patterns
- State lifted to App.tsx with individual `useState` hooks
- All outputs recalculate in real-time via `useMemo` — no "Calculate" button (D-18 from Phase 4)
- Two-column flex layout with `flex-[55]` / `flex-[45]` split
- No header/nav bar currently exists (D-03 from Phase 4: "jump straight into calculator content") — new header component adds one

### Integration Points
- App.tsx will need a `useEffect` to read URL hash on mount and set state
- App.tsx will need a `useEffect` (or similar) to update URL hash when state changes
- New Header component rendered above the two-column layout in App.tsx
- Reset function will call all individual state setters with their defaults (similar pattern to existing `resetAdvancedParams`)

</code_context>

<specifics>
## Specific Ideas

- Header should handle "global actions" — user specifically wants a header component rather than placing buttons near specific sections
- Reset must feel safe — confirmation dialog is important because users may have spent time configuring a complex scenario

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-url-sharing*
*Context gathered: 2026-03-24*
