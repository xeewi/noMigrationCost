# Retrospective: Feature Cost Calculator

## Milestone: v1.2 — Documentation

**Shipped:** 2026-03-24
**Phases:** 4 (8-11) | **Plans:** 5

### What Was Built
- Hash-based view routing coexisting with URL sharing via namespace discriminator
- Full research document rendered as HTML with Tailwind Typography and GFM table support
- Sidebar navigation with anchor links, IntersectionObserver scroll-spy, and auto-scroll
- JSDoc authorship headers on all 36 source files

### What Worked
- Single-plan phases (9, 10, 11) executed cleanly with minimal overhead
- IntersectionObserver + Map-based ratio tracking was a clean solution for scroll-spy
- Hash namespace discriminator (`#/docs` vs base64url) avoided any collision with URL sharing
- Verification caught real issues — every phase passed automated checks

### What Was Inefficient
- Phase 8 needed 2 plans for routing when it could have been 1 (hook + wiring were tightly coupled)
- Some Active requirements in PROJECT.md were stale duplicates of already-validated items — drifted over multiple phases

### Patterns Established
- Mount-but-hide pattern for preserving calculator state across view switches
- `useHashRoute` hook pattern for hash-based routing without a router library
- `useActiveSection` hook pattern for scroll-spy with IntersectionObserver

### Key Lessons
- Markdown reference-style links (`[[12]]`) don't render well with react-markdown — need custom rendering for citations
- Keeping PROJECT.md requirements in sync requires discipline at every phase transition, not just milestones

### Cost Observations
- Model mix: executor=sonnet, planner=opus, verifier=sonnet
- v1.2 milestone completed in a single day (2026-03-24)
- Notable: Small focused phases (1-2 plans) execute fastest with least rework

## Milestone: v1.1 — Author Branding

**Shipped:** 2026-03-24
**Phases:** 1 (7) | **Plans:** 1

### What Was Built
- Fixed footer banner with author name and inline SVG icons linking to GitHub, Malt, LinkedIn

### What Worked
- Single-phase, single-plan milestone — minimal overhead
- Inline SVGs avoided external icon library dependency

### What Was Inefficient
- Human verification items from phase 7 were never formally resolved (5 items still pending in UAT)

### Key Lessons
- Even trivial phases benefit from verification — the UAT debt accumulated silently

## Milestone: v1.0 — React Rebuild

**Shipped:** 2026-03-24
**Phases:** 3 (4-6) | **Plans:** 9

### What Was Built
- Vite + React + TypeScript scaffold with shadcn/ui component library
- TDD formula engine verified against research doc worked examples
- Full input UI: team composition, feature sizing, time horizon
- Comparison view with dual-curve Recharts chart and break-even detection
- Advanced parameters panel with all research-backed formula constants
- URL sharing with full state serialization in hash

### What Worked
- Engine-before-UI discipline caught formula bugs before they reached the UI
- TDD on the formula engine provided high confidence in cost calculations
- shadcn/ui delivered presentation-quality components out of the box

### What Was Inefficient
- Alpine+Pico CSS prototype (phases 1-3) was abandoned — wasted effort before stack pivot
- Phase 5 needed 4 plans due to scope (engine extensions + UI + chart + build fix)

### Patterns Established
- Two-column layout: inputs left, outputs right
- Controlled tab state lifted to App.tsx for URL sharing
- `ENGINE_DEFAULTS` pattern for research-backed formula constants

### Key Lessons
- Stack choice matters enormously — Alpine+Pico looked cheap but couldn't deliver presentation quality
- User rejected ugly UI immediately — invest in component library up front

## Cross-Milestone Trends

| Metric | v1.0 | v1.1 | v1.2 |
|--------|------|------|------|
| Phases | 3 | 1 | 4 |
| Plans | 9 | 1 | 5 |
| Duration | 1 day | <1 day | 1 day |
| Rework phases | 0 | 0 | 0 |
| Verification debt | 0 | 5 items | 0 |
