# Requirements: Feature Cost Calculator

**Defined:** 2026-03-23
**Core Value:** Make the hidden long-term costs of code duplication visible and quantifiable

## v1 Requirements

Requirements for v1.0 React Rebuild. Each maps to roadmap phases.

### Team Composition

- [x] **TEAM-01**: User can add team members with a name and seniority level (Junior/Mid/Senior/Lead)
- [x] **TEAM-02**: User sees French loaded-cost salary defaults auto-filled based on seniority selection
- [ ] **TEAM-03**: User can override the default hourly cost for any individual team member
- [x] **TEAM-04**: User can remove team members from the team
- [x] **TEAM-05**: User can see the team's average loaded hourly cost update in real-time

### Feature Sizing

- [x] **SIZE-01**: User can define a feature size in story points
- [x] **SIZE-02**: User can define a feature size in direct hours or days as an alternative to story points
- [x] **SIZE-03**: User can set team velocity (story points per sprint) to convert SP to hours
- [x] **SIZE-04**: User can set sprint duration (1-4 weeks) for the SP-to-hours conversion
- [x] **SIZE-05**: User can see the estimated development hours derived from inputs

### Time Horizon

- [ ] **TIME-01**: User can select a projection horizon from preset values (1, 3, 5, 10 years)
- [ ] **TIME-02**: User can see cost projections update when changing the time horizon

### Cost Calculation

- [ ] **COST-01**: User can see the total cost of a feature for their team (standalone calculation)
- [ ] **COST-02**: User can see a cost breakdown table with categories: initial dev, maintenance, coordination, bugs, sync
- [ ] **COST-03**: User can see side-by-side comparison of shared code vs duplicated code total costs
- [ ] **COST-04**: User can see the break-even point (month) when shared code becomes cheaper than duplicated
- [ ] **COST-05**: User can see a clear message when break-even does not exist (shared never cheaper)
- [ ] **COST-06**: User can see divergence rate modeling showing non-linear cost growth for duplicated code over time
- [ ] **COST-07**: User can see bug propagation cost as a separate line item in the duplicated code breakdown
- [ ] **COST-08**: User can see coordination overhead as an explicit cost line in the shared code breakdown

### Advanced Inputs

- [ ] **ADV-01**: User can adjust the generalization factor (default 1.3, range 1.0-2.0)
- [ ] **ADV-02**: User can adjust the porting factor (default 0.65, range 0.3-1.0)
- [ ] **ADV-03**: User can adjust the divergence rate (default 0.20, range 0.05-0.50)
- [ ] **ADV-04**: User can adjust the maintenance rate for shared code (default 0.18, range 0.10-0.30)
- [ ] **ADV-05**: User can adjust the maintenance rate for duplicated code (default 0.22, range 0.15-0.40)
- [ ] **ADV-06**: User can adjust the bug duplication factor (default 2.0, range 1.0-3.0)
- [ ] **ADV-07**: User can adjust the number of consuming codebases/teams (default 2, range 2-10)
- [ ] **ADV-08**: User can see all defaults are pre-filled from research-backed values with source references

### Visualization

- [ ] **VIZ-01**: User can see temporal cost curves (cumulative) for both shared and duplicated approaches on a single chart
- [ ] **VIZ-02**: User can see the break-even point highlighted on the chart with annotation
- [ ] **VIZ-03**: Chart has high-contrast, presentation-ready styling with labeled axes
- [ ] **VIZ-04**: User can see citation tooltips showing the research source for each formula constant

### Sharing

- [ ] **SHARE-01**: User can share a scenario via URL (all inputs encoded in URL hash)
- [ ] **SHARE-02**: User opening a shared URL sees the exact same scenario with all inputs restored

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
| TEAM-03 | Phase 4 | Pending |
| TEAM-04 | Phase 4 | Complete |
| TEAM-05 | Phase 4 | Complete |
| SIZE-01 | Phase 4 | Complete |
| SIZE-02 | Phase 4 | Complete |
| SIZE-03 | Phase 4 | Complete |
| SIZE-04 | Phase 4 | Complete |
| SIZE-05 | Phase 4 | Complete |
| TIME-01 | Phase 4 | Pending |
| TIME-02 | Phase 4 | Pending |
| COST-01 | Phase 4 | Pending |
| COST-02 | Phase 4 | Pending |
| COST-03 | Phase 5 | Pending |
| COST-04 | Phase 5 | Pending |
| COST-05 | Phase 5 | Pending |
| COST-06 | Phase 5 | Pending |
| COST-07 | Phase 5 | Pending |
| COST-08 | Phase 5 | Pending |
| ADV-01 | Phase 5 | Pending |
| ADV-02 | Phase 5 | Pending |
| ADV-03 | Phase 5 | Pending |
| ADV-04 | Phase 5 | Pending |
| ADV-05 | Phase 5 | Pending |
| ADV-06 | Phase 5 | Pending |
| ADV-07 | Phase 5 | Pending |
| ADV-08 | Phase 5 | Pending |
| VIZ-01 | Phase 5 | Pending |
| VIZ-02 | Phase 5 | Pending |
| VIZ-03 | Phase 5 | Pending |
| VIZ-04 | Phase 5 | Pending |
| SHARE-01 | Phase 6 | Pending |
| SHARE-02 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 34 total
- Mapped to phases: 34
- Unmapped: 0

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-03-23 — v1.0 React Rebuild roadmap created (Phases 4-6)*
