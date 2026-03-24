---
phase: quick
plan: 260324-jpj
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/AdvancedParameters.tsx
  - src/App.tsx
  - src/components/ConsumingTeams.tsx
autonomous: true
must_haves:
  truths:
    - "Consuming Teams input appears inside the Advanced Parameters collapsible panel"
    - "Consuming Teams no longer appears as a standalone card in the inputs column"
    - "Consuming Teams value still drives nbConsumingCodebases state in App.tsx"
  artifacts:
    - path: "src/components/AdvancedParameters.tsx"
      provides: "Consuming Teams input rendered inside collapsible content"
    - path: "src/App.tsx"
      provides: "ConsumingTeams standalone card removed from JSX; nbConsumingCodebases state passed through AdvancedParameters"
  key_links:
    - from: "src/components/AdvancedParameters.tsx"
      to: "App.tsx state"
      via: "nbConsumingCodebases prop + onChange callback"
      pattern: "nbConsumingCodebases"
---

<objective>
Move the "Consuming Teams" input from its own standalone Card in the inputs column into the "Advanced Parameters" collapsible panel, where it logically belongs alongside the other tuning parameters.

Purpose: Reduce visual clutter in the main inputs column — consuming teams is an advanced concept that belongs with other formula parameters, not alongside core inputs like team composition and feature sizing.
Output: AdvancedParameters panel contains consuming teams input; one fewer card in the inputs column.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/App.tsx
@src/components/AdvancedParameters.tsx
@src/components/ConsumingTeams.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Absorb Consuming Teams into AdvancedParameters and remove standalone card</name>
  <files>src/components/AdvancedParameters.tsx, src/App.tsx, src/components/ConsumingTeams.tsx</files>
  <action>
1. **AdvancedParameters.tsx** — Add consuming teams props and render the input inside the collapsible content:
   - Extend `AdvancedParametersProps` with `nbConsumingCodebases: number` and `onNbConsumingCodebasesChange: (value: number) => void`
   - Inside `CollapsibleContent`, ABOVE the existing ParamRow map, add a section for "Number of consuming teams" using the same Input component pattern currently in ConsumingTeams.tsx (type="number", min=1, max=10, step=1, w-24, with the same handleChange/handleBlur clamping logic)
   - Add a `Separator` (from ui/separator) between the consuming teams input and the slider params to visually group them
   - Keep the same helper text: "Teams sharing the same codebase"

2. **App.tsx** — Update wiring:
   - Remove the `<ConsumingTeams ... />` JSX from the inputs column (line ~225-228)
   - Remove the `import { ConsumingTeams }` line
   - Pass `nbConsumingCodebases={nbConsumingCodebases}` and `onNbConsumingCodebasesChange={setNbConsumingCodebases}` to `<AdvancedParameters />`

3. **ConsumingTeams.tsx** — Delete the file entirely since it is no longer used anywhere.
  </action>
  <verify>
    <automated>cd /Users/brucecoaster/code/noMigrationCost && npx tsc --noEmit && npm run build</automated>
  </verify>
  <done>
  - Consuming Teams input renders inside the Advanced Parameters collapsible panel when expanded
  - No standalone Consuming Teams card appears in the inputs column
  - ConsumingTeams.tsx file deleted
  - TypeScript compiles cleanly and build succeeds
  - nbConsumingCodebases state still flows correctly (URL state encode/decode unaffected since state variable unchanged)
  </done>
</task>

</tasks>

<verification>
- `npx tsc --noEmit` passes (no type errors)
- `npm run build` succeeds (production build)
- Visual: open dev server, expand Advanced Parameters — consuming teams input visible at top of panel
- Visual: inputs column has one fewer card (no standalone Consuming Teams card)
</verification>

<success_criteria>
- Consuming Teams input lives inside AdvancedParameters collapsible
- No regression in state management (nbConsumingCodebases still drives engine calculations)
- Clean TypeScript compilation and build
- ConsumingTeams.tsx removed from codebase
</success_criteria>

<output>
After completion, create `.planning/quick/260324-jpj-move-consuming-teams-into-advanced-param/260324-jpj-SUMMARY.md`
</output>
