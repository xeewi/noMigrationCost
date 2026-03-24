---
phase: 06-url-sharing
plan: 02
subsystem: url-sharing
tags: [url-state, hash-sync, controlled-tabs, reset-handler, AppHeader]
dependency_graph:
  requires: [src/lib/url-state.ts, src/components/AppHeader.tsx]
  provides: [src/App.tsx (URL sharing wired)]
  affects: []
tech_stack:
  added: []
  patterns: [useEffect hash read/write, useCallback reset handler, controlled Tabs state]
key_files:
  created: []
  modified:
    - src/App.tsx
    - src/components/AppHeader.tsx
decisions:
  - "AlertDialogTrigger uses base-ui render prop pattern (render={<Button />}) not Radix asChild — base-ui does not support asChild"
  - "Hash write effect depends on all serializable state — triggers 300ms after any change including tab switch"
  - "handleReset sets horizonYears to 5 (matching initial useState value) not ENGINE_DEFAULTS.defaultHorizonYears which is 3"
metrics:
  duration: "3 min"
  completed: "2026-03-24"
  tasks_completed: 1
  files_modified: 2
---

# Phase 06 Plan 02: Wire URL Sharing into App.tsx Summary

**One-liner:** Hash read/write effects, controlled Tabs, and reset handler wired into App.tsx with AppHeader rendered above the calculator layout.

## What Was Built

### Task 1 — URL sharing wired into App.tsx (`4f0518c`)

`src/App.tsx` now has full URL sharing functionality:

- **Hash read on mount** — `useEffect([], [])` reads `window.location.hash.slice(1)`, calls `decodeAppState`, and `applyStateToSetters` to restore all inputs (SHARE-02). Malformed hashes return `null` from `decodeAppState` and are silently ignored (graceful fallback).

- **Hash write on state change** — Debounced `useEffect` (300ms) depends on all 11 serializable state values. Calls `encodeAppState` and assigns `window.location.hash` (SHARE-01, D-01).

- **`handleReset` callback** — `useCallback` resets all 11 state values to their initial defaults: `getDefaultTeam()`, `getDefaultAdvancedParams()`, `ENGINE_DEFAULTS.nbConsumingCodebases`, `'comparison'` tab. Hash is updated by the write effect automatically (D-04).

- **Controlled Tabs** — `activeTab` useState replaces `defaultValue="comparison"`. `<Tabs value={activeTab} onValueChange={setActiveTab}>` enables tab preservation in URLs (SHARE-01 active tab encoding).

- **AppHeader rendering** — `<AppHeader onReset={handleReset} />` inserted directly inside `min-h-screen` wrapper, above the `max-w-[1280px]` container div.

### Auto-fix applied (Rule 1 — Bug)

`AppHeader.tsx` used `asChild` on `AlertDialogTrigger`, which is a Radix UI API not supported by base-ui (the project's component library). Changed to `render={<Button variant="outline" size="sm" />}` matching the base-ui render prop pattern already used by `AlertDialogCancel` in the same file.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed AlertDialogTrigger asChild incompatibility**
- **Found during:** Task 1 (build verification)
- **Issue:** `AppHeader.tsx` used `asChild` prop on `AlertDialogTrigger` which does not exist on base-ui's Trigger type (TS2322 error)
- **Fix:** Changed to `render={<Button variant="outline" size="sm" />}` pattern, matching base-ui conventions already used in the same file
- **Files modified:** `src/components/AppHeader.tsx`
- **Commit:** `4f0518c` (same task commit)

## Status

Task 2 (human verification checkpoint) is pending. The dev server (`npm run dev`) should be started and the full URL sharing flow verified per the checkpoint instructions.

## Self-Check: PASSED

- FOUND: src/App.tsx (modified)
- FOUND: src/components/AppHeader.tsx (modified)
- FOUND commit: 4f0518c
