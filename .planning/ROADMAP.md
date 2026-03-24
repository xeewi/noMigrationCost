# Roadmap: Feature Cost Calculator

## Overview

A React + Vite + TypeScript + shadcn/ui + Recharts dashboard that quantifies the real cost of code duplication over time. The build follows strict engine-before-UI discipline: the Vite project scaffold and pure TypeScript formula engine are verified against the research doc's worked examples first, then the input UI and standalone cost output are assembled on top, then the comparison view, chart, and advanced controls deliver the core product value, and finally URL sharing makes scenarios portable without any backend.

## Milestones

- (abandoned) **Phases 1-3: Alpine+Pico CSS prototype** — abandoned on stack pivot 2026-03-23
- **Phases 4-6: v1.0 React Rebuild** — complete
- **Phase 7: v1.1 Author Branding** — complete
- **Phases 8-11: v1.2 Documentation** — in progress

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

- [x] **Phase 4: Scaffold, Engine, and Standalone Cost** - React+Vite project, TypeScript formula engine verified against research doc, input form wired to real-time cost output (completed 2026-03-23)
- [x] **Phase 5: Comparison View, Chart, and Advanced Controls** - Shared vs duplicated cost curves, break-even detection, Recharts visualization, and all adjustable research-backed formula constants (completed 2026-03-23)
- [x] **Phase 6: URL Sharing** - Full scenario state encoded in URL hash for sharing and presentation replay (completed 2026-03-24)

### v1.1 Author Branding

- [x] **Phase 7: Author Footer** - Fixed footer banner with author name and links to GitHub, Malt, and LinkedIn profiles (completed 2026-03-24)

### v1.2 Documentation

- [x] **Phase 8: Routing Foundation** - Hash-based view routing that safely coexists with existing URL sharing, with AppHeader nav links for switching between calculator and docs (completed 2026-03-24)
- [x] **Phase 9: Doc Page Implementation** - Full research document rendered as HTML with prose typography, GFM tables, sidebar anchor navigation, and correct scroll offsets under the fixed header (completed 2026-03-24)
- [ ] **Phase 10: Sidebar Polish** - Active section highlighting via IntersectionObserver scroll-spy and sidebar auto-scroll to keep the active link visible
- [ ] **Phase 11: Source File Headers** - Comment headers with author name, creation date, and project identifier added to every source file

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
**Plans:** 3/3 plans complete

Plans:
- [x] 04-01-PLAN.md — Scaffold Vite + React + shadcn project, install dependencies, define engine types
- [x] 04-02-PLAN.md — TDD formula engine: all cost functions verified against research doc worked examples
- [x] 04-03-PLAN.md — Build input/output UI components and wire to engine with two-column layout

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
**Plans:** 4/4 plans complete

Plans:
- [x] 05-01-PLAN.md — Engine extensions (sub-totals, flexible maintenanceRateShared), chart utilities, shadcn component install
- [x] 05-02-PLAN.md — Advanced Parameters panel, Consuming Teams card, lift formula constants to App.tsx state
- [x] 05-03-PLAN.md — CostChart, ComparisonTab, tabbed output layout with visual verification checkpoint

**UI hint**: yes

### Phase 6: URL Sharing
**Goal**: Users can share any scenario via URL so recipients see the exact same inputs and results with no account or backend required
**Depends on**: Phase 5
**Requirements**: SHARE-01, SHARE-02
**Success Criteria** (what must be TRUE):
  1. User can copy a URL from the app that encodes all current inputs in the URL hash
  2. User opening a shared URL sees all inputs restored to the shared scenario with results matching the original view
**Plans:** 2/2 plans complete

Plans:
- [x] 06-01-PLAN.md — URL state serialization module (encode/decode) and AppHeader component (Copy Link + Reset All)
- [x] 06-02-PLAN.md — Wire hash effects, controlled tabs, reset handler, and AppHeader into App.tsx

**UI hint**: yes

### Phase 7: Author Footer
**Goal**: Users see a persistent footer banner identifying the author with direct links to professional profiles
**Depends on**: Phase 6
**Requirements**: FOOT-01, FOOT-02, FOOT-03, FOOT-04
**Success Criteria** (what must be TRUE):
  1. User can see the author name (Guillaume Gautier / xeewi) displayed in a fixed footer that is visible on every page without scrolling
  2. User can click a GitHub icon/link in the footer and land on the author's GitHub profile in a new tab
  3. User can click a Malt icon/link in the footer and land on the author's Malt profile in a new tab
  4. User can click a LinkedIn icon/link in the footer and land on the author's LinkedIn profile in a new tab
**Plans:** 1/1 plans complete

Plans:
- [x] 07-01-PLAN.md — AppFooter component with inline SVG brand icons and App.tsx integration

**UI hint**: yes

### Phase 8: Routing Foundation
**Goal**: Users can switch between the calculator and documentation views via AppHeader links, with hash-based routing that safely coexists with existing URL sharing and browser navigation working correctly
**Depends on**: Phase 7
**Requirements**: ROUTE-01, ROUTE-02, ROUTE-03, ROUTE-04, ROUTE-05
**Success Criteria** (what must be TRUE):
  1. User can click a "Documentation" link in the AppHeader from the calculator and land on the docs page; user can click "Calculator" from the docs page and return to the calculator
  2. User can use the browser back and forward buttons to switch between calculator and docs views
  3. User's calculator inputs are intact after navigating to docs and back — no state is lost on round-trip
  4. User can share a URL containing a docs section anchor (e.g. `#/docs/section-id`) and a recipient lands on the docs page at the correct section
  5. Existing calculator share URLs (base64url-encoded hashes) continue to restore calculator state correctly with no collision
**Plans:** 2/2 plans complete

Plans:
- [x] 08-01-PLAN.md — Create useHashRoute hook and update AppHeader with nav links and conditional Reset All
- [x] 08-02-PLAN.md — Wire routing into App.tsx with hash-write guard, mount-but-hide, and docs placeholder

**UI hint**: yes

### Phase 9: Doc Page Implementation
**Goal**: Users can read the full research document rendered as formatted HTML on the docs page, with a working left sidebar for navigation and correct scroll behavior under the fixed header
**Depends on**: Phase 8
**Requirements**: DOC-01, DOC-02, DOC-03, DOC-04, NAV-01
**Success Criteria** (what must be TRUE):
  1. User can read the complete research document on the docs page with proper heading hierarchy, paragraphs, lists, and links styled via Tailwind Typography
  2. User can see all pipe tables in the research document rendered as formatted HTML tables (not raw pipe syntax)
  3. User can see a left sidebar listing all document sections as clickable anchor links that jump to the correct heading
  4. User can click a sidebar anchor link and the target heading is fully visible — not hidden behind the fixed AppHeader
**Plans:** 1/1 plans complete

Plans:
- [x] 09-01-PLAN.md — Install markdown stack, create DocsPage and DocsSidebar components, wire into App.tsx

**UI hint**: yes

### Phase 10: Sidebar Polish
**Goal**: Users can see which documentation section they are currently reading highlighted in the sidebar, and the sidebar keeps the active link in view as they scroll through the document
**Depends on**: Phase 9
**Requirements**: NAV-02, NAV-03
**Success Criteria** (what must be TRUE):
  1. User can see the currently visible section highlighted in the sidebar as they scroll through the document
  2. User can scroll to any section in a long document and the sidebar auto-scrolls to keep the active link visible without manual sidebar scrolling
**Plans**: TBD
**UI hint**: yes

### Phase 11: Source File Headers
**Goal**: Every source file (including all new v1.2 components) carries a consistent comment header that establishes authorship and project identity
**Depends on**: Phase 10
**Requirements**: HEAD-01
**Success Criteria** (what must be TRUE):
  1. Every TypeScript and TSX source file opens with a comment block containing the author name, creation date, and project identifier
  2. The header format is consistent across all files (same fields, same comment style)
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 8 → 9 → 10 → 11

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 4. Scaffold, Engine, and Standalone Cost | 3/3 | Complete | 2026-03-23 |
| 5. Comparison View, Chart, and Advanced Controls | 4/4 | Complete | 2026-03-23 |
| 6. URL Sharing | 2/2 | Complete | 2026-03-24 |
| 7. Author Footer | 1/1 | Complete | 2026-03-24 |
| 8. Routing Foundation | 2/2 | Complete | 2026-03-24 |
| 9. Doc Page Implementation | 1/1 | Complete | 2026-03-24 |
| 10. Sidebar Polish | 0/? | Not started | - |
| 11. Source File Headers | 0/? | Not started | - |

## Backlog

### Phase 998.1: Standalone Organizational Costs (BACKLOG)

**Goal:** Enrich the Standalone cost model with organizational costs (support, versioning, onboarding, coordination) that currently only appear in Shared/Duplicated paths. A feature built by a single team still incurs these costs — the current Standalone mode underestimates by ~5× because it only counts dev + maintenance.
**Requirements:** TBD
**Plans:** 0 plans

Plans:
- [ ] TBD (promote with /gsd:review-backlog when ready)

### Phase 998.2: Story Points Input Clearing Bug (BACKLOG)

**Goal:** Fix the Team Velocity story points input so the user can fully clear the field and type a new value (e.g. 42) directly. Currently the "1" cannot be erased, forcing awkward editing instead of a clean retype.
**Requirements:** TBD
**Plans:** 0 plans

Plans:
- [ ] TBD (promote with /gsd:review-backlog when ready)
