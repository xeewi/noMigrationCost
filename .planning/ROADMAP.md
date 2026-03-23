# Roadmap: Feature Cost Calculator

## Overview

A React + Vite + TypeScript + shadcn/ui + Recharts dashboard that quantifies the real cost of code duplication over time. The build follows strict engine-before-UI discipline: the Vite project scaffold and pure TypeScript formula engine are verified against the research doc's worked examples first, then the input UI and standalone cost output are assembled on top, then the comparison view, chart, and advanced controls deliver the core product value, and finally URL sharing makes scenarios portable without any backend.

## Milestones

- (abandoned) **Phases 1-3: Alpine+Pico CSS prototype** — abandoned on stack pivot 2026-03-23
- **Phases 4-6: v1.0 React Rebuild** — in progress

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

<details>
<summary>(abandoned) Phases 1-3: Alpine+Pico CSS prototype — ABANDONED 2026-03-23</summary>

- [x] **Phase 1: Inputs and Standalone Cost** - Team composition, feature sizing, time horizon, and single-feature cost output — built on top of a verified formula engine (abandoned mid-phase)
- [ ] **Phase 2: Comparison, Visualization, and Advanced Controls** - Never started
- [ ] **Phase 3: URL Sharing** - Never started

</details>

### v1.0 React Rebuild

- [ ] **Phase 4: Scaffold, Engine, and Standalone Cost** - React+Vite project, TypeScript formula engine verified against research doc, input form wired to real-time cost output
- [ ] **Phase 5: Comparison View, Chart, and Advanced Controls** - Shared vs duplicated cost curves, break-even detection, Recharts visualization, and all adjustable research-backed formula constants
- [ ] **Phase 6: URL Sharing** - Full scenario state encoded in URL hash for sharing and presentation replay

## Phase Details

### Phase 4: Scaffold, Engine, and Standalone Cost
**Goal**: Users can configure a team and size a feature to see its standalone cost calculated from research-backed defaults, running on the new React stack
**Depends on**: Nothing (first phase of React rebuild)
**Requirements**: TEAM-01, TEAM-02, TEAM-03, TEAM-04, TEAM-05, SIZE-01, SIZE-02, SIZE-03, SIZE-04, SIZE-05, TIME-01, TIME-02, COST-01, COST-02
**Success Criteria** (what must be TRUE):
  1. User can add, configure, and remove team members with seniority levels and see French loaded-cost salary defaults auto-filled
  2. User can override any member's hourly cost and see the team average loaded hourly cost update in real-time
  3. User can define feature size in story points (with velocity and sprint duration) or direct hours, and see derived development hours
  4. User can select a time horizon (1, 3, 5, 10 years) and see cost projections update
  5. User can see the total standalone feature cost and a breakdown table by category (initial dev, maintenance, coordination, bugs, sync)
**Plans:** 1/3 plans executed

Plans:
- [x] 04-01-PLAN.md — Scaffold Vite + React + shadcn project, install dependencies, define engine types
- [ ] 04-02-PLAN.md — TDD formula engine: all cost functions verified against research doc worked examples
- [ ] 04-03-PLAN.md — Build input/output UI components and wire to engine with two-column layout

**UI hint**: yes

### Phase 5: Comparison View, Chart, and Advanced Controls
**Goal**: Users can compare shared code vs duplicated code total costs over time on a presentation-ready chart, with full control over all research-backed formula constants
**Depends on**: Phase 4
**Requirements**: COST-03, COST-04, COST-05, COST-06, COST-07, COST-08, ADV-01, ADV-02, ADV-03, ADV-04, ADV-05, ADV-06, ADV-07, ADV-08, VIZ-01, VIZ-02, VIZ-03, VIZ-04
**Success Criteria** (what must be TRUE):
  1. User can see dual cumulative cost curves (shared path and duplicated path) on a single chart with labeled axes and presentation-ready styling
  2. User can see the break-even point highlighted on the chart with an annotation, or a clear message when break-even does not exist within the selected horizon
  3. User can see divergence rate modeling driving non-linear cost growth for the duplicated path, with bug propagation and coordination overhead as explicit line items in the breakdown table
  4. User can adjust all formula constants (generalization factor, porting factor, divergence rate, maintenance rates, bug duplication factor, number of consuming teams) and see research-backed defaults and source citations pre-filled
**Plans**: TBD
**UI hint**: yes

### Phase 6: URL Sharing
**Goal**: Users can share any scenario via URL so recipients see the exact same inputs and results with no account or backend required
**Depends on**: Phase 5
**Requirements**: SHARE-01, SHARE-02
**Success Criteria** (what must be TRUE):
  1. User can copy a URL from the app that encodes all current inputs in the URL hash
  2. User opening a shared URL sees all inputs restored to the shared scenario with results matching the original view
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 4. Scaffold, Engine, and Standalone Cost | 1/3 | In Progress|  |
| 5. Comparison View, Chart, and Advanced Controls | 0/? | Not started | - |
| 6. URL Sharing | 0/? | Not started | - |
