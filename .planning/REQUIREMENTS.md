# Requirements: Feature Cost Calculator

**Defined:** 2026-03-23
**Core Value:** Make the hidden long-term costs of code duplication visible and quantifiable

## v1 Requirements

Requirements for v1.0 React Rebuild. Each maps to roadmap phases.

### Team Composition

- [x] **TEAM-01**: User can add team members with a name and seniority level (Junior/Mid/Senior/Lead)
- [x] **TEAM-02**: User sees French loaded-cost salary defaults auto-filled based on seniority selection
- [x] **TEAM-03**: User can override the default hourly cost for any individual team member
- [x] **TEAM-04**: User can remove team members from the team
- [x] **TEAM-05**: User can see the team's average loaded hourly cost update in real-time

### Feature Sizing

- [x] **SIZE-01**: User can define a feature size in story points
- [x] **SIZE-02**: User can define a feature size in direct hours or days as an alternative to story points
- [x] **SIZE-03**: User can set team velocity (story points per sprint) to convert SP to hours
- [x] **SIZE-04**: User can set sprint duration (1-4 weeks) for the SP-to-hours conversion
- [x] **SIZE-05**: User can see the estimated development hours derived from inputs

### Time Horizon

- [x] **TIME-01**: User can select a projection horizon from preset values (1, 3, 5, 10 years)
- [x] **TIME-02**: User can see cost projections update when changing the time horizon

### Cost Calculation

- [x] **COST-01**: User can see the total cost of a feature for their team (standalone calculation)
- [x] **COST-02**: User can see a cost breakdown table with categories: initial dev, maintenance, coordination, bugs, sync
- [x] **COST-03**: User can see side-by-side comparison of shared code vs duplicated code total costs
- [x] **COST-04**: User can see the break-even point (month) when shared code becomes cheaper than duplicated
- [x] **COST-05**: User can see a clear message when break-even does not exist (shared never cheaper)
- [x] **COST-06**: User can see divergence rate modeling showing non-linear cost growth for duplicated code over time
- [x] **COST-07**: User can see bug propagation cost as a separate line item in the duplicated code breakdown
- [x] **COST-08**: User can see coordination overhead as an explicit cost line in the shared code breakdown

### Advanced Inputs

- [x] **ADV-01**: User can adjust the generalization factor (default 1.3, range 1.0-2.0)
- [x] **ADV-02**: User can adjust the porting factor (default 0.65, range 0.3-1.0)
- [x] **ADV-03**: User can adjust the divergence rate (default 0.20, range 0.05-0.50)
- [x] **ADV-04**: User can adjust the maintenance rate for shared code (default 0.18, range 0.10-0.30)
- [x] **ADV-05**: User can adjust the maintenance rate for duplicated code (default 0.22, range 0.15-0.40)
- [x] **ADV-06**: User can adjust the bug duplication factor (default 2.0, range 1.0-3.0)
- [x] **ADV-07**: User can adjust the number of consuming codebases/teams (default 2, range 2-10)
- [x] **ADV-08**: User can see all defaults are pre-filled from research-backed values with source references

### Visualization

- [x] **VIZ-01**: User can see temporal cost curves (cumulative) for both shared and duplicated approaches on a single chart
- [x] **VIZ-02**: User can see the break-even point highlighted on the chart with annotation
- [x] **VIZ-03**: Chart has high-contrast, presentation-ready styling with labeled axes
- [x] **VIZ-04**: User can see citation tooltips showing the research source for each formula constant

### Sharing

- [x] **SHARE-01**: User can share a scenario via URL (all inputs encoded in URL hash)
- [x] **SHARE-02**: User opening a shared URL sees the exact same scenario with all inputs restored

## v1.1 Requirements

Requirements for Author Branding milestone. Each maps to roadmap phases.

### Footer Banner

- [x] **FOOT-01**: User can see the author name (Guillaume Gautier / xeewi) in a fixed footer banner on every page
- [x] **FOOT-02**: User can click a GitHub icon/link in the footer to navigate to the author's GitHub profile
- [x] **FOOT-03**: User can click a Malt icon/link in the footer to navigate to the author's Malt profile
- [x] **FOOT-04**: User can click a LinkedIn icon/link in the footer to navigate to the author's LinkedIn profile

## v1.2 Requirements

Requirements for Documentation milestone. Each maps to roadmap phases.

### Routing

- [x] **ROUTE-01**: User can navigate to the documentation page via a link in the AppHeader
- [x] **ROUTE-02**: User can navigate back to the calculator via a link in the AppHeader from the docs page
- [x] **ROUTE-03**: User can share a URL that deep-links to a specific documentation section (e.g. `#/docs/section-id`)
- [x] **ROUTE-04**: User can use browser back/forward to switch between calculator and docs views
- [x] **ROUTE-05**: User's calculator inputs are preserved when switching to docs and back

### Documentation Rendering

- [x] **DOC-01**: User can read the full research document rendered as HTML on the docs page
- [x] **DOC-02**: User can see GFM tables rendered correctly (pipe tables from the research doc)
- [x] **DOC-03**: User can see properly styled prose (headings, paragraphs, lists, links) via Tailwind Typography
- [x] **DOC-04**: User can click a sidebar anchor link and land at the correct heading without it being hidden behind the fixed header

### Sidebar Navigation

- [x] **NAV-01**: User can see a left sidebar listing all document sections as clickable anchor links
- [x] **NAV-02**: User can see the currently visible section highlighted in the sidebar as they scroll
- [x] **NAV-03**: Sidebar auto-scrolls to keep the active section link visible when the document is long

### Source File Headers

- [ ] **HEAD-01**: Every source file contains a comment header with author name, creation date, and project identifier

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Export

- **EXP-01**: User can export chart as PNG or SVG image
- **EXP-02**: User can export cost breakdown as CSV

### Localization

- **L10N-01**: User can switch interface language between English and French
- **L10N-02**: User can switch currency and salary defaults between countries

### Scenarios

- **SCEN-01**: User can compare multiple team configurations side-by-side
- **SCEN-02**: User can save scenarios to localStorage for later retrieval

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / database persistence | Static app constraint; URL sharing covers the need |
| Full COCOMO II implementation | Target users think in story points, not KSLOC; simplified model sufficient |
| Mobile-specific layout | Desktop presentation tool; responsive as bonus only |
| PDF export | Browser Print-to-PDF is sufficient for v1 |
| Real-time collaboration | No backend; one person drives calculations in meetings |
| Multi-language toggle | English only for v1; French teams present in English to stakeholders |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TEAM-01 | Phase 4 | Complete |
| TEAM-02 | Phase 4 | Complete |
| TEAM-03 | Phase 4 | Complete |
| TEAM-04 | Phase 4 | Complete |
| TEAM-05 | Phase 4 | Complete |
| SIZE-01 | Phase 4 | Complete |
| SIZE-02 | Phase 4 | Complete |
| SIZE-03 | Phase 4 | Complete |
| SIZE-04 | Phase 4 | Complete |
| SIZE-05 | Phase 4 | Complete |
| TIME-01 | Phase 4 | Complete |
| TIME-02 | Phase 4 | Complete |
| COST-01 | Phase 4 | Complete |
| COST-02 | Phase 4 | Complete |
| COST-03 | Phase 5 | Complete |
| COST-04 | Phase 5 | Complete |
| COST-05 | Phase 5 | Complete |
| COST-06 | Phase 5 | Complete |
| COST-07 | Phase 5 | Complete |
| COST-08 | Phase 5 | Complete |
| ADV-01 | Phase 5 | Complete |
| ADV-02 | Phase 5 | Complete |
| ADV-03 | Phase 5 | Complete |
| ADV-04 | Phase 5 | Complete |
| ADV-05 | Phase 5 | Complete |
| ADV-06 | Phase 5 | Complete |
| ADV-07 | Phase 5 | Complete |
| ADV-08 | Phase 5 | Complete |
| VIZ-01 | Phase 5 | Complete |
| VIZ-02 | Phase 5 | Complete |
| VIZ-03 | Phase 5 | Complete |
| VIZ-04 | Phase 5 | Complete |
| SHARE-01 | Phase 6 | Complete |
| SHARE-02 | Phase 6 | Complete |
| FOOT-01 | Phase 7 | Complete |
| FOOT-02 | Phase 7 | Complete |
| FOOT-03 | Phase 7 | Complete |
| FOOT-04 | Phase 7 | Complete |
| ROUTE-01 | Phase 8 | Complete |
| ROUTE-02 | Phase 8 | Complete |
| ROUTE-03 | Phase 8 | Complete |
| ROUTE-04 | Phase 8 | Complete |
| ROUTE-05 | Phase 8 | Complete |
| DOC-01 | Phase 9 | Complete |
| DOC-02 | Phase 9 | Complete |
| DOC-03 | Phase 9 | Complete |
| DOC-04 | Phase 9 | Complete |
| NAV-01 | Phase 9 | Complete |
| NAV-02 | Phase 10 | Complete |
| NAV-03 | Phase 10 | Complete |
| HEAD-01 | Phase 11 | Pending |

**Coverage:**
- v1.0 requirements: 34 total
- v1.1 requirements: 4 total
- v1.2 requirements: 13 total (ROUTE-01–05, DOC-01–04, NAV-01–03, HEAD-01)
- Mapped to phases: 51
- Unmapped: 0

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-03-24 — Phase 8 (Source File Headers) removed, phases renumbered (9→8, 10→9, 11→10, 12→11)*
