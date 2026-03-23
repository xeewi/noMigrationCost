# Roadmap: Feature Cost Calculator

## Overview

A standalone HTML/JS dashboard that quantifies the real cost of code duplication over time. The build follows a strict engine-before-UI discipline: inputs and the standalone cost calculation are wired to a verified formula engine first, then the comparison view and visualization are layered on top, then URL sharing makes the tool shareable without any backend.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Inputs and Standalone Cost** - Team composition, feature sizing, time horizon, and single-feature cost output — built on top of a verified formula engine
- [ ] **Phase 2: Comparison, Visualization, and Advanced Controls** - Shared vs duplicated cost curves, break-even detection, chart, cost breakdown table, and all adjustable research-backed factors
- [ ] **Phase 3: URL Sharing** - Full scenario state encoded in URL hash for sharing and presentation replay

## Phase Details

### Phase 1: Inputs and Standalone Cost
**Goal**: Users can configure a team, size a feature, and see its total cost calculated from research-backed defaults
**Depends on**: Nothing (first phase)
**Requirements**: TEAM-01, TEAM-02, TEAM-03, TEAM-04, TEAM-05, SIZE-01, SIZE-02, SIZE-03, SIZE-04, SIZE-05, TIME-01, TIME-02, COST-01, COST-02
**Success Criteria** (what must be TRUE):
  1. User can add team members with seniority levels and see French loaded-cost defaults auto-filled
  2. User can override any member's hourly cost and see the team average update in real-time
  3. User can define feature size via story points (with velocity and sprint duration) or direct hours, and see estimated development hours derived
  4. User can select a time horizon (1, 3, 5, 10 years) and see cost projections update
  5. User can see total standalone feature cost and a breakdown by category (initial dev, maintenance, coordination, bugs, sync)
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — Data layer and formula engine (data.js constants + app.js formula functions)
- [ ] 01-02-PLAN.md — HTML markup, Alpine wiring, and CSS styling (index.html + styles.css)
**UI hint**: yes

### Phase 2: Comparison, Visualization, and Advanced Controls
**Goal**: Users can compare shared code vs duplicated code total costs over time, see the break-even point on a chart, and adjust every research-backed factor
**Depends on**: Phase 1
**Requirements**: COST-03, COST-04, COST-05, COST-06, COST-07, COST-08, ADV-01, ADV-02, ADV-03, ADV-04, ADV-05, ADV-06, ADV-07, ADV-08, VIZ-01, VIZ-02, VIZ-03, VIZ-04
**Success Criteria** (what must be TRUE):
  1. User can see dual cumulative cost curves (shared path and duplicated path) on a single presentation-ready chart with labeled axes
  2. User can see the break-even point highlighted on the chart with an annotation, or a clear message when break-even does not exist within the selected horizon
  3. User can see divergence rate modeling driving non-linear cost growth for the duplicated path, and bug propagation and coordination overhead as explicit cost line items in the breakdown table
  4. User can adjust all formula constants (generalization factor, porting factor, divergence rate, maintenance rates, bug duplication factor, number of consuming teams) and see all defaults pre-filled from research-backed values with source references
  5. User can see citation tooltips showing the research source for each formula constant
**Plans**: TBD
**UI hint**: yes

### Phase 3: URL Sharing
**Goal**: Users can share any scenario via URL so recipients see the exact same inputs and results with no account or backend required
**Depends on**: Phase 2
**Requirements**: SHARE-01, SHARE-02
**Success Criteria** (what must be TRUE):
  1. User can copy a URL from the app that encodes all current inputs in the URL hash
  2. User opening a shared URL sees all inputs restored to the shared scenario with results matching the original view
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Inputs and Standalone Cost | 1/2 | In Progress|  |
| 2. Comparison, Visualization, and Advanced Controls | 0/? | Not started | - |
| 3. URL Sharing | 0/? | Not started | - |
