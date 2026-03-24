---
phase: 06-url-sharing
plan: 01
subsystem: url-sharing
tags: [url-state, serialization, header, alert-dialog, base64url]
dependency_graph:
  requires: [src/engine/types.ts, src/components/AdvancedParameters.tsx]
  provides: [src/lib/url-state.ts, src/components/AppHeader.tsx, src/components/ui/alert-dialog.tsx]
  affects: [src/App.tsx (Plan 02 will wire these in)]
tech_stack:
  added: [shadcn AlertDialog]
  patterns: [Base64URL encoding (RFC 4648 §5), compact state key mapping, useState for clipboard feedback]
key_files:
  created:
    - src/lib/url-state.ts
    - src/components/AppHeader.tsx
    - src/components/ui/alert-dialog.tsx
  modified: []
decisions:
  - "Base64URL padding formula uses (4 - (hash.length % 4)) % 4 — handles all lengths including already-aligned"
  - "encodeAppState extracts team rows in fixed Junior/Mid/Senior/Lead order for stable positional encoding"
  - "clipboard.writeText uses .then() callback rather than await — avoids top-level async in event handler"
  - "AppHeader uses named export (not default) to match existing component conventions"
metrics:
  duration: "2 min"
  completed: "2026-03-24"
  tasks_completed: 2
  files_created: 3
  files_modified: 0
---

# Phase 06 Plan 01: URL-State Serialization and AppHeader Summary

**One-liner:** Base64URL encode/decode module with compact key mapping plus AppHeader with Copy Link feedback and AlertDialog reset confirmation.

## What Was Built

### Task 1 — url-state serialization module (`462c4ee`)

`src/lib/url-state.ts` provides the full serialization layer for Phase 6 URL sharing:

- **`ShareableState` interface** — 20 compact keys, schema version `v: 1` for future migration support
- **`encodeAppState`** — maps all App.tsx state to a Base64URL string; compact abbreviations (e.g. `sm: 'sp'|'dh'`, `du: 'h'|'d'`) minimize URL length
- **`decodeAppState`** — restores Base64 padding, wraps atob+JSON.parse in try/catch, returns `null` on any error (graceful fallback)
- **`applyStateToSetters`** — accepts `ShareableState` + object of all App.tsx setters, calls each with reverse-mapped values
- **`getDefaultTeam`** — canonical reset target: 4 rows at headcount 0 with `SENIORITY_DEFAULTS` rates
- **`getDefaultAdvancedParams`** — canonical reset target: all `ENGINE_DEFAULTS` formula constants

### Task 2 — AlertDialog install + AppHeader component (`0ed5f33`)

`src/components/ui/alert-dialog.tsx` — shadcn AlertDialog installed via `npx shadcn add alert-dialog`.

`src/components/AppHeader.tsx` implements the full AppHeader per UI-SPEC:
- Full-width `<header>` with `border-b border-border` separator
- `max-w-[1280px] mx-auto px-6 py-3` container matching page layout
- "Feature Cost Calculator" title at `text-xl font-semibold`
- Copy Link button (`variant="default" size="sm"`) with Link/Check icon swap and 2s "Copied!" feedback via `useState<boolean>` + `setTimeout`
- Reset All button (`variant="outline" size="sm"`) wrapped in AlertDialog trigger
- AlertDialog with "Reset all inputs?" title, two-sentence description, Cancel + destructive Reset All action button

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- FOUND: src/lib/url-state.ts
- FOUND: src/components/AppHeader.tsx
- FOUND: src/components/ui/alert-dialog.tsx
- FOUND commit: 462c4ee (Task 1)
- FOUND commit: 0ed5f33 (Task 2)
