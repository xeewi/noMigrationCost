# Roadmap: Feature Cost Calculator

## Overview

A React + Vite + TypeScript + shadcn/ui + Recharts dashboard that quantifies the real cost of code duplication over time. The build follows strict engine-before-UI discipline: the Vite project scaffold and pure TypeScript formula engine are verified against the research doc's worked examples first, then the input UI and standalone cost output are assembled on top, then the comparison view, chart, and advanced controls deliver the core product value, and finally URL sharing makes scenarios portable without any backend.

## Milestones

- (abandoned) **Phases 1-3: Alpine+Pico CSS prototype** — abandoned on stack pivot 2026-03-23
- ✅ **Phases 4-6: v1.0 React Rebuild** — shipped 2026-03-24
- ✅ **Phase 7: v1.1 Author Branding** — shipped 2026-03-24
- ✅ **Phases 8-11: v1.2 Documentation** — shipped 2026-03-24

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

<details>
<summary>✅ v1.0 React Rebuild (Phases 4-6) — SHIPPED 2026-03-24</summary>

- [x] **Phase 4: Scaffold, Engine, and Standalone Cost** - React+Vite project, TypeScript formula engine verified against research doc, input form wired to real-time cost output (completed 2026-03-23)
- [x] **Phase 5: Comparison View, Chart, and Advanced Controls** - Shared vs duplicated cost curves, break-even detection, Recharts visualization, and all adjustable research-backed formula constants (completed 2026-03-23)
- [x] **Phase 6: URL Sharing** - Full scenario state encoded in URL hash for sharing and presentation replay (completed 2026-03-24)

</details>

<details>
<summary>✅ v1.1 Author Branding (Phase 7) — SHIPPED 2026-03-24</summary>

- [x] **Phase 7: Author Footer** - Fixed footer banner with author name and links to GitHub, Malt, and LinkedIn profiles (completed 2026-03-24)

</details>

<details>
<summary>✅ v1.2 Documentation (Phases 8-11) — SHIPPED 2026-03-24</summary>

- [x] **Phase 8: Routing Foundation** - Hash-based view routing that safely coexists with existing URL sharing, with AppHeader nav links for switching between calculator and docs (completed 2026-03-24)
- [x] **Phase 9: Doc Page Implementation** - Full research document rendered as HTML with prose typography, GFM tables, sidebar anchor navigation, and correct scroll offsets under the fixed header (completed 2026-03-24)
- [x] **Phase 10: Sidebar Polish** - Active section highlighting via IntersectionObserver scroll-spy and sidebar auto-scroll to keep the active link visible (completed 2026-03-24)
- [x] **Phase 11: Source File Headers** - Comment headers with author name, creation date, and project identifier added to every source file (completed 2026-03-24)

</details>

### Phase 12: Standalone Organizational Costs

**Goal:** Enrich the Standalone cost model with organizational costs (support, versioning, onboarding, coordination) that currently only appear in Shared/Duplicated paths. A feature built by a single team still incurs these costs — the current Standalone mode underestimates by ~5× because it only counts dev + maintenance.
**Requirements:** ORG-ENGINE, ORG-BREAKDOWN, ORG-UI, ORG-DOCS
**Plans:** 1/2 plans executed

Plans:
- [x] 12-01-PLAN.md — Engine: extend calcStandaloneCost with organizational costs + tests
- [ ] 12-02-PLAN.md — UI footer fix + documentation update

### Phase 13: Story Points Input Clearing Bug

**Goal:** Fix the Team Velocity story points input so the user can fully clear the field and type a new value (e.g. 42) directly. Currently the "1" cannot be erased, forcing awkward editing instead of a clean retype.
**Requirements:** TBD
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd:plan-phase 13 to break down)

## Progress

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 4. Scaffold, Engine, and Standalone Cost | v1.0 | 3/3 | Complete | 2026-03-23 |
| 5. Comparison View, Chart, and Advanced Controls | v1.0 | 4/4 | Complete | 2026-03-23 |
| 6. URL Sharing | v1.0 | 2/2 | Complete | 2026-03-24 |
| 7. Author Footer | v1.1 | 1/1 | Complete | 2026-03-24 |
| 8. Routing Foundation | v1.2 | 2/2 | Complete | 2026-03-24 |
| 9. Doc Page Implementation | v1.2 | 1/1 | Complete | 2026-03-24 |
| 10. Sidebar Polish | v1.2 | 1/1 | Complete | 2026-03-24 |
| 11. Source File Headers | v1.2 | 1/1 | Complete | 2026-03-24 |
| 12. Standalone Organizational Costs | — | 1/2 | In Progress|  |
| 13. Story Points Input Clearing Bug | — | 0/0 | Not Started | — |

## Backlog

(empty)
