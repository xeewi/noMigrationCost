# Feature Cost Calculator

## What This Is

An interactive dashboard that calculates and visualizes the real cost of software features — both as standalone cost estimation and as a comparison between shared code vs duplicated code approaches. Built with React and shadcn/ui for internal use and stakeholder presentations, with data models based on industry research (COCOMO II, IEEE studies, French labor market data).

## Core Value

Make the hidden long-term costs of code duplication visible and quantifiable, so teams can make informed build-vs-duplicate decisions backed by real numbers.

## Requirements

### Validated

- [x] User can compare shared code vs duplicated code total costs over time — Validated in Phase 5: Comparison View, Chart, and Advanced Controls
- [x] Dashboard displays temporal graphs showing cumulative cost curves for both approaches — Validated in Phase 5
- [x] Dashboard displays detailed tables with cost breakdowns by category (maintenance, coordination, bugs, sync) — Validated in Phase 5
- [x] Break-even point is calculated and highlighted on the graph — Validated in Phase 5
- [x] Variables from the research doc (generalization factor, porting factor, divergence rate, etc.) are adjustable — Validated in Phase 5
- [x] User can share scenarios via URL with all inputs encoded in hash — Validated in Phase 6: URL Sharing
- [x] User opening a shared URL sees all inputs restored to the shared scenario — Validated in Phase 6
- [x] User can see author name in a fixed footer with links to GitHub, Malt, and LinkedIn profiles — Validated in Phase 7: Author Footer
- [x] User can switch between calculator and documentation views via AppHeader links with hash-based routing — Validated in Phase 9: Routing Foundation
- [x] Hash-based routing (#/docs) coexists with existing URL sharing (base64url hashes) without collision — Validated in Phase 9: Routing Foundation
- [x] User can read the full research document rendered as formatted HTML on the docs page — Validated in Phase 10: Doc Page Implementation
- [x] User can see a left sidebar listing all document sections as clickable anchor links — Validated in Phase 10: Doc Page Implementation
- [x] User can click a sidebar anchor link and scroll to the correct heading under the sticky header — Validated in Phase 10: Doc Page Implementation
- [x] User arriving via deep-link URL scrolls to the correct section on mount — Validated in Phase 10: Doc Page Implementation

### Active

- [ ] User can declare a team with named members, each having a seniority level (Junior/Mid/Senior/Lead) with French salary defaults that can be overridden
- [ ] User can define a feature with size expressed in story points or direct time (hours/days)
- [ ] User can configure team velocity to convert story points to hours
- [ ] User can adjust a time horizon (1-10 years) via slider
- [ ] User can see the total cost of a feature for a given team (standalone calculation)
- [ ] User can compare shared code vs duplicated code total costs over time
- [ ] Dashboard displays temporal graphs showing cumulative cost curves for both approaches
- [ ] Dashboard displays detailed tables with cost breakdowns by category (maintenance, coordination, bugs, sync)
- [ ] Break-even point is calculated and highlighted on the graph
- [ ] Variables from the research doc (generalization factor, porting factor, divergence rate, etc.) are adjustable
- [ ] French salary data (loaded costs, 1607h/year) is pre-filled as defaults
- [ ] Interface is in English

### Out of Scope

- Multi-language (FR/EN toggle) — English only for v1
- User accounts / persistence to a database — local/session only
- COCOMO II full model implementation — simplified estimation based on story points
- Mobile-specific layout — desktop-first, responsive is a bonus
- PDF export — screenshot or browser print is sufficient for v1

## Current Milestone: v1.2 Documentation

**Goal:** Make the research document backing the calculator browsable directly on the site, with seamless navigation between calculator and documentation.

**Target features:**
- Doc page rendering the research Markdown as HTML within the app
- Left sidebar navigation with anchor links to document sections
- Header links to switch between calculator and doc views
- Hash-based routing (#/docs) coexisting with existing URL sharing
- Shared AppHeader and AppFooter across both views
- Source file comment headers (carried from v1.1)

## Context

- Based on extensive research document (`docs/feature-cost-shared-vs-duplicated.md`) with 45+ cited sources covering cost models, maintenance ratios, bug propagation in cloned code, French labor market data
- Key formulas documented in sections 7.1-7.5 of the research doc (shared cost, duplicated cost, break-even, scale factor, divergence over time)
- Target audience: engineering leads and managers who need to justify shared library investments to stakeholders
- Must be visually clear enough for presentations but detailed enough for real estimation work

## Constraints

- **Tech stack**: React + Vite + TypeScript + shadcn/ui + Tailwind CSS + Recharts
- **Data source**: All reference data (salaries, ratios, factors) embedded in the app from the research doc
- **Deployment**: Static build output, can be served from any static host

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React + shadcn/ui + Recharts | Polished component library for presentation-quality UI | Pivoted from Alpine+Pico on 2026-03-23 |
| French salary defaults | Primary audience is France-based teams, data available in research doc | — Pending |
| Story points + direct time as input options | Teams use different estimation methods, support both | — Pending |
| English interface | Stakeholder presentations often in English even in French companies | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-24 — Phase 10 (Doc Page Implementation) complete*
