# Feature Cost Calculator

## What This Is

An interactive dashboard that calculates and visualizes the real cost of software features — both as standalone cost estimation and as a comparison between shared code vs duplicated code approaches. Includes a built-in documentation page rendering the full research document with sidebar navigation. Built with React and shadcn/ui for internal use and stakeholder presentations, with data models based on industry research (COCOMO II, IEEE studies, French labor market data).

## Core Value

Make the hidden long-term costs of code duplication visible and quantifiable, so teams can make informed build-vs-duplicate decisions backed by real numbers.

## Requirements

### Validated

- [x] User can declare a team with named members, each having a seniority level (Junior/Mid/Senior/Lead) with French salary defaults that can be overridden — v1.0
- [x] User can define a feature with size expressed in story points or direct time (hours/days) — v1.0
- [x] User can configure team velocity to convert story points to hours — v1.0
- [x] User can adjust a time horizon (1, 3, 5, 10 years) via selector — v1.0
- [x] User can see the total cost of a feature for a given team (standalone calculation) — v1.0
- [x] User can compare shared code vs duplicated code total costs over time — v1.0
- [x] Dashboard displays temporal graphs showing cumulative cost curves for both approaches — v1.0
- [x] Dashboard displays detailed tables with cost breakdowns by category (maintenance, coordination, bugs, sync) — v1.0
- [x] Break-even point is calculated and highlighted on the graph — v1.0
- [x] Variables from the research doc (generalization factor, porting factor, divergence rate, etc.) are adjustable — v1.0
- [x] French salary data (loaded costs, 1607h/year) is pre-filled as defaults — v1.0
- [x] Interface is in English — v1.0
- [x] User can share scenarios via URL with all inputs encoded in hash — v1.0
- [x] User opening a shared URL sees all inputs restored to the shared scenario — v1.0
- [x] User can see author name in a fixed footer with links to GitHub, Malt, and LinkedIn profiles — v1.1
- [x] User can switch between calculator and documentation views via AppHeader links with hash-based routing — v1.2
- [x] Hash-based routing (#/docs) coexists with existing URL sharing (base64url hashes) without collision — v1.2
- [x] User can read the full research document rendered as formatted HTML on the docs page — v1.2
- [x] User can see a left sidebar listing all document sections as clickable anchor links — v1.2
- [x] User can click a sidebar anchor link and scroll to the correct heading under the sticky header — v1.2
- [x] User arriving via deep-link URL scrolls to the correct section on mount — v1.2
- [x] User can see the currently visible section highlighted in the sidebar as they scroll — v1.2
- [x] Sidebar auto-scrolls to keep the active section link visible when the document is long — v1.2
- [x] Every source file carries a consistent comment header with author name, creation date, and project identifier — v1.2

### Active

(None — all requirements through v1.2 shipped. Next milestone will define new requirements.)

### Out of Scope

- Multi-language (FR/EN toggle) — English only; French teams present in English to stakeholders
- User accounts / persistence to a database — static app; URL sharing covers the need
- COCOMO II full model implementation — simplified estimation based on story points sufficient
- Mobile-specific layout — desktop presentation tool; responsive as bonus only
- PDF export — browser Print-to-PDF sufficient
- Real-time collaboration — no backend; one person drives calculations in meetings

## Current State

**Shipped:** v1.2 Documentation (2026-03-24)

All planned milestones complete:
- **v1.0** — Calculator with team composition, feature sizing, cost comparison, charts, URL sharing
- **v1.1** — Author footer with professional profile links
- **v1.2** — Research document rendered as browsable HTML with sidebar navigation, source file headers

**Codebase:** 4,300 LOC TypeScript/TSX across 36 source files. 84 tests passing.

**Known issues:**
- Markdown reference links render as raw URLs on docs page (citation rendering)
- Standalone cost model underestimates by ~5x (missing organizational costs — backlog item 998.1)
- ~~Story points input clearing bug~~ — fixed in Phase 13 (2026-03-24)

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
| React + shadcn/ui + Recharts | Polished component library for presentation-quality UI | ✓ Good — pivoted from Alpine+Pico on 2026-03-23 |
| French salary defaults | Primary audience is France-based teams, data available in research doc | ✓ Good — shipped in v1.0 |
| Story points + direct time as input options | Teams use different estimation methods, support both | ✓ Good — shipped in v1.0 |
| English interface | Stakeholder presentations often in English even in French companies | ✓ Good — shipped in v1.0 |
| Hash-based routing with namespace discriminator | Coexist with existing URL sharing without collision | ✓ Good — shipped in v1.2 |
| react-markdown + remark-gfm for docs | Lightweight, renders research doc directly without build step | ✓ Good — shipped in v1.2 |
| IntersectionObserver for scroll-spy | Native API, no library dependency, Map-based ratio tracking | ✓ Good — shipped in v1.2 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone:**
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-24 — after Phase 13 story points input clearing bug fix*
