---
phase: quick
plan: 260324-jpj
subsystem: inputs-ui
tags: [ui, refactor, advanced-parameters, consuming-teams]
dependency_graph:
  requires: []
  provides: [consuming-teams-inside-advanced-panel]
  affects: [src/components/AdvancedParameters.tsx, src/App.tsx]
tech_stack:
  added: []
  patterns: [prop-drilling, controlled-input]
key_files:
  created: []
  modified:
    - src/components/AdvancedParameters.tsx
    - src/App.tsx
  deleted:
    - src/components/ConsumingTeams.tsx
decisions:
  - "Consuming Teams input placed above slider params with a Separator divider for visual grouping"
  - "ConsumingTeams.tsx deleted — logic (handleChange/handleBlur with parseInt clamping) inlined into AdvancedParameters"
metrics:
  duration: ~3min
  completed: "2026-03-24T13:13:53Z"
  tasks: 1
  files_changed: 3
---

# Quick Task 260324-jpj: Move Consuming Teams into Advanced Parameters Summary

**One-liner:** Absorbed standalone Consuming Teams card into Advanced Parameters collapsible panel, reducing inputs column visual clutter by one card.

## What Was Done

Consuming Teams was a standalone Card in the inputs column, visually presented alongside core inputs (Team Composition, Feature Sizing, Time Horizon). It logically belongs with the other formula-tuning parameters in the Advanced Parameters panel.

### Changes

**src/components/AdvancedParameters.tsx**
- Added `Separator` import from `@/components/ui/separator`
- Extended `AdvancedParametersProps` with `nbConsumingCodebases: number` and `onNbConsumingCodebasesChange: (value: number) => void`
- Added `handleConsumingTeamsChange` and `handleConsumingTeamsBlur` handlers (same parseInt clamping logic as the deleted component)
- Rendered "Number of consuming teams" input at the top of `CollapsibleContent`, above a `Separator` that divides it from the slider params

**src/App.tsx**
- Removed `import { ConsumingTeams }` line
- Removed `<ConsumingTeams value={nbConsumingCodebases} onChange={setNbConsumingCodebases} />` JSX block
- Added `nbConsumingCodebases` and `onNbConsumingCodebasesChange` props to `<AdvancedParameters />`

**src/components/ConsumingTeams.tsx** — deleted entirely.

## Verification

- `npx tsc --noEmit` — passed (no type errors)
- `npm run build` — succeeded (1.77s, all modules transformed)

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None.

## Self-Check: PASSED

- `src/components/AdvancedParameters.tsx` — exists, contains consuming teams input and Separator
- `src/App.tsx` — ConsumingTeams import and JSX removed; new props passed to AdvancedParameters
- `src/components/ConsumingTeams.tsx` — deleted
- Commit `3d8a91e` — exists in git log
