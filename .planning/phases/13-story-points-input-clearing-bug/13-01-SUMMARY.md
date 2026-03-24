---
phase: 13-story-points-input-clearing-bug
plan: "01"
subsystem: feature-sizing-ui
tags: [bug-fix, ux, input-handling]
dependency_graph:
  requires: []
  provides: [VEL-FIX]
  affects: [src/components/FeatureSizing.tsx]
tech_stack:
  added: []
  patterns: [empty-when-zero input pattern]
key_files:
  created: []
  modified:
    - src/components/FeatureSizing.tsx
decisions:
  - "Velocity NaN/min guard changed to v < 0 ? 0 : v — allows 0 as valid intermediate state for empty field display, engine already guards against velocity=0 divide-by-zero"
metrics:
  duration: "32s"
  completed: "2026-03-24"
  tasks: 1
  files: 1
requirements_validated:
  - VEL-FIX
---

# Phase 13 Plan 01: Fix velocity input clearing bug — Summary

**One-liner:** Velocity input now uses empty-when-zero pattern (value={velocity === 0 ? '' : velocity}) matching story points and direct hours inputs, allowing full field clearing with placeholder "1".

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Fix velocity input to allow clearing | 7554843 | src/components/FeatureSizing.tsx |

## What Was Built

The Team Velocity (SP/sprint) input in `FeatureSizing.tsx` previously clamped NaN to 1 in its onChange handler, preventing users from erasing the existing value. The field also displayed the raw numeric state (always showing a number), which meant the user could never see an empty input.

Four targeted changes applied to the velocity Input element:

1. `value={velocity}` changed to `value={velocity === 0 ? '' : velocity}` — field shows empty when state is 0
2. `placeholder="1"` added — field shows hint when empty
3. `onVelocityChange(isNaN(v) || v < 1 ? 1 : v)` changed to `onVelocityChange(isNaN(v) || v < 0 ? 0 : v)` — allows 0 as intermediate empty state
4. `min={1}` changed to `min={0}` — matches new allowed range

The engine (`calcDevHours` in `formulas.ts`) already has a `velocity === 0 → return 0` guard at line 112, so no divide-by-zero risk.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None.

## Self-Check: PASSED

- src/components/FeatureSizing.tsx modified: FOUND (line 104: `velocity === 0 ? '' : velocity`, line 105: `placeholder="1"`, line 108: `v < 0 ? 0 : v`, line 103: `min={0}`)
- Commit 7554843: FOUND
- Build: PASSED (✓ built in 1.86s)
- Story points input unchanged: CONFIRMED (line 87: `value={storyPoints === 0 ? '' : storyPoints}`)
- Direct hours input unchanged: CONFIRMED (line 144: `value={directValue === 0 ? '' : directValue}`)
