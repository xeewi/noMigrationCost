---
phase: 09-routing-foundation
plan: 01
subsystem: ui
tags: [react, typescript, routing, hash-routing, hooks, shadcn]

# Dependency graph
requires: []
provides:
  - useHashRoute hook with View type ('calculator' | 'docs') and hash-based navigation
  - AppHeader updated with Calculator/Documentation nav links and conditional Reset All
affects:
  - 09-02 (App.tsx integration — consumes useHashRoute and updated AppHeader props)
  - 09-03 (DocsPage — renders when view === 'docs')

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Hash namespace discriminator — '/' prefix identifies route hashes; base64url never produces '/', namespaces are disjoint
    - Lazy useState initializer for hash-derived state — prevents flash of wrong view on deep-link
    - hashchange event listener in useEffect with cleanup — keeps view in sync with browser back/forward

key-files:
  created:
    - src/hooks/useHashRoute.ts
  modified:
    - src/components/AppHeader.tsx

key-decisions:
  - "useHashRoute lazy initializer uses () => deriveView(window.location.hash) to prevent flash on deep-link"
  - "deriveView uses hash.startsWith('/') as lossless namespace discriminator — base64url (RFC 4648) never produces '/'"
  - "AppHeader nav uses <a> tags not <button> — correct semantic for navigation, supports href and native browser behavior"
  - "Reset All conditionalized to view === 'calculator' only — hidden on docs view per D-03"

patterns-established:
  - "Route hooks: derive view from hash in lazy initializer, update via hashchange listener with cleanup"
  - "Nav links: <a> with aria-current='page' on active, cn() for conditional active/inactive classes"

requirements-completed: [ROUTE-01, ROUTE-02, ROUTE-04]

# Metrics
duration: 1min
completed: 2026-03-24
---

# Phase 09 Plan 01: Routing Foundation — Hook and Header Summary

**useHashRoute hook with View type and hash namespace discriminator, plus AppHeader with nav links and conditional Reset All**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-03-24T14:28:33Z
- **Completed:** 2026-03-24T14:29:39Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created `src/hooks/useHashRoute.ts` with exported `View` type and `useHashRoute` function
- Hash namespace discriminator: `hash.startsWith('/')` reliably identifies route hashes vs base64url calculator state
- Lazy useState initializer prevents flash of wrong view on deep-link (RESEARCH Pitfall 2 handled)
- hashchange event listener with cleanup keeps view in sync with browser back/forward (RESEARCH Pitfall 3 handled)
- AppHeader updated with Calculator and Documentation nav links, active state via underline + text-foreground
- Reset All wrapped in `{view === 'calculator' && (...)}` — hidden on docs view per D-03
- Copy Link remains unconditionally visible per D-04
- Cancel button text updated from "Cancel" to "Keep Inputs" per UI-SPEC copywriting contract

## Task Commits

Each task was committed atomically:

1. **Task 1: Create useHashRoute hook** - `cfd336b` (feat)
2. **Task 2: Update AppHeader with nav links and conditional Reset All** - `a014056` (feat)

## Files Created/Modified

- `src/hooks/useHashRoute.ts` - Hash-based routing hook; exports View type and useHashRoute function
- `src/components/AppHeader.tsx` - Updated with nav links, view/onNavigate props, conditional Reset All

## Decisions Made

- Used lazy initializer `() => deriveView(window.location.hash)` for useState — avoids flash of wrong view on deep-link
- `deriveView` strips leading `#` before checking `startsWith('/')` — handles both raw hash and `window.location.hash` forms
- Nav links use `<a>` tags not `<button>` — correct semantic for navigation, native browser behavior, proper accessibility
- Active nav link communicates state via underline (`underline underline-offset-4 decoration-1`) and `text-foreground`, weight stays 400 (both states) per UI-SPEC

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Known Stubs

- `src/components/AppHeader.tsx`: The updated component accepts `view` and `onNavigate` props but App.tsx has not yet been updated to pass them. App.tsx will have a TypeScript error until Plan 02 updates the call site. This is intentional per the plan — Plan 01 establishes the contract, Plan 02 integrates it.

## Next Phase Readiness

- `useHashRoute` hook is ready for consumption by App.tsx (Plan 02)
- `AppHeader` prop contract established (`view: View`, `onNavigate: (target: View) => void`)
- App.tsx will need to call `useHashRoute()` and pass `view` + `navigateTo` to `<AppHeader>` (Plan 02)
- Plan 02 will also add the docs placeholder view and conditionalize the calculator content

---
*Phase: 09-routing-foundation*
*Completed: 2026-03-24*
