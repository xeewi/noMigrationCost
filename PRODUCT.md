# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: a decision-maker (engineering manager, PO, CTO) who receives a shared link from a developer or tech lead, opens it cold, with no prior context on the tool or its model. Their job: understand in seconds what question is being answered, read the conclusion (share or duplicate, and when it pays off), and trust it enough to decide.

Secondary: the developer / tech lead who builds the scenario and sends the link to argue for (or against) a shared-code migration.

## Product Purpose

Feature Cost Calculator (repo: noMigrationCost) puts a euro figure on the hidden long-term cost of duplicated code versus shared code. Given a team, a feature size and a time horizon, it shows the cumulative cost of each approach year by year and the break-even point where sharing starts paying for itself.

Success: the person who opens the link leaves with one clear sentence ("over 5 years, duplicating costs X € more; sharing pays off after N months") and believes it.

## Positioning

Not a generic estimation tool: it quantifies the cost of *not* migrating, which is normally invisible because it is spread over years. Every formula is traceable to a research document (COCOMO II reuse model, empirical reuse and fork studies, French labor market data) readable inside the app.

## Operating Context

- Scenario state lives entirely in the URL hash; sharing a link is the main distribution channel.
- Also used live in stakeholder presentations.
- French market assumptions (35 h/week, 7 h/day, French hourly rates). UI copy is currently in English.

## Capabilities and Constraints

- Standalone cost estimate and shared-vs-duplicated comparison over 1, 3, 5 or 10 years, with break-even.
- Team composition by seniority (Junior, Mid, Senior, Lead) with editable rates.
- Sizing in story points (velocity, sprint length) or direct hours/days.
- Number of apps that need the feature, and whether the shared library already exists.
- Model assumptions, each marked measured or assumption: generalization, porting, integration, yearly upkeep, extra-copy upkeep, drift, coordination and upgrades.
- Built-in documentation of the research behind every formula.
- Stack: React 19 + Vite + TypeScript + shadcn/ui + Tailwind 4 + Recharts. Static build, deployed on GitHub Pages.

Known problems (confirmed by the owner, 2026-10-28):
- The purpose is not understandable on arrival.
- The calculator starts empty (everything at 0); nothing shows until inputs are filled.
- Model parameters use unexplained jargon.
- Results (curves, figures) do not deliver a clear conclusion.

## Evidence on Hand

- Research document: `docs/feature-cost-shared-vs-duplicated.md`.
- Default parameters and rates in `src/engine/types.ts`.
- No testimonials, customers or case studies exist; do not fabricate any.

## Product Principles

1. Conclusion first: the answer is readable before the inputs.
2. Every number is explainable in plain words and traceable to its source.
3. A cold link must make sense on its own, without the sender in the room.
4. Inputs are a way to challenge the result, not a gate before seeing one.
