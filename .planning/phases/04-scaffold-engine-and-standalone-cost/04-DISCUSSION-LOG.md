# Phase 4: Scaffold, Engine, and Standalone Cost - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-23
**Phase:** 04-scaffold-engine-and-standalone-cost
**Areas discussed:** Page layout, Team input revisit, Cost output style, Formula engine scope

---

## Page Layout

### Section arrangement

| Option | Description | Selected |
|--------|-------------|----------|
| Two-column | Inputs left, cost output right. Classic dashboard feel. | ✓ |
| Stacked (top-down) | Single column, scrolling vertically. | |
| Dashboard grid | Flexible grid with cards that reflow. | |

**User's choice:** Two-column
**Notes:** Inputs (team, sizing, time horizon) on the left, cost output on the right. Always visible side-by-side.

### Sticky output column

| Option | Description | Selected |
|--------|-------------|----------|
| Sticky | Cost output stays fixed in viewport while scrolling inputs. | ✓ |
| Normal scroll | Both columns scroll together. | |
| You decide | Claude picks. | |

**User's choice:** Sticky

### Header/nav bar

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal header | App title + tagline at top. | |
| No header | Jump straight into content. Maximum screen real estate. | ✓ |
| You decide | Claude picks. | |

**User's choice:** No header

### Narrow screen handling

| Option | Description | Selected |
|--------|-------------|----------|
| Stack columns | Below ~768px, columns stack vertically. | ✓ |
| Desktop only | Don't worry about narrow screens. | |
| You decide | Claude picks. | |

**User's choice:** Stack columns

---

## Team Input Revisit

### Input model

| Option | Description | Selected |
|--------|-------------|----------|
| Keep seniority grid | Four fixed rows (Junior/Mid/Senior/Lead), headcount + editable €/h. | ✓ |
| Dynamic named members | Add/remove individual team members with name, seniority, custom €/h. | |
| Hybrid | Seniority grid as default, expandable to individual members. | |

**User's choice:** Keep seniority grid
**Notes:** Confirmed from Phase 1. Simple, fast to fill, aligns with research doc salary tiers.

### Name field and removal

| Option | Description | Selected |
|--------|-------------|----------|
| Headcount only | No names. Headcount=0 means removed. | ✓ |
| Keep name field | Optional label per seniority row. | |

**User's choice:** Headcount only
**Notes:** TEAM-01 "name" and TEAM-04 "remove" requirements satisfied by headcount adjustment per seniority level.

---

## Cost Output Style

### Presentation approach

| Option | Description | Selected |
|--------|-------------|----------|
| Card + table | Prominent total in a card, detailed breakdown table below. | ✓ |
| KPI cards + table | Multiple small metric cards at top, then table. | |
| Table only | Just the breakdown table with total row. | |

**User's choice:** Card + table
**Notes:** Same concept as Phase 1 but with polished shadcn Card and Table components.

### Breakdown categories for standalone

| Option | Description | Selected |
|--------|-------------|----------|
| All five categories | Show all even in standalone view. | |
| Relevant only | Show only initial dev + maintenance. Others introduced in Phase 5. | ✓ |
| You decide | Claude picks based on research doc formulas. | |

**User's choice:** Relevant only
**Notes:** Coordination, bugs (propagation), and sync are comparison-specific categories.

---

## Formula Engine Scope

### How much to build in Phase 4

| Option | Description | Selected |
|--------|-------------|----------|
| Full engine now | All formula functions built and tested in Phase 4. Phase 5 just wires UI. | ✓ |
| Standalone only | Only standalone formulas. Shared/duplicated/break-even in Phase 5. | |
| You decide | Claude decides based on formula dependencies. | |

**User's choice:** Full engine now
**Notes:** Aligns with engine-before-UI discipline noted in STATE.md.

### Testing approach

| Option | Description | Selected |
|--------|-------------|----------|
| Tests first | Unit tests from research doc worked examples, engine passes before UI. | ✓ |
| Tests alongside | Build engine and UI in parallel, tests as you go. | |
| You decide | Claude picks. | |

**User's choice:** Tests first

### API design

| Option | Description | Selected |
|--------|-------------|----------|
| Separate functions | Individual pure functions per formula section. Composable, testable. | ✓ |
| Single entry point | One function takes all inputs, returns full result. | |
| You decide | Claude picks. | |

**User's choice:** Separate functions
**Notes:** Clear mapping to research doc sections 7.1-7.5.

---

## Claude's Discretion

- Component granularity and React state management approach
- shadcn/ui component selection for each input type
- File/folder structure within the React project

## Deferred Ideas

None — discussion stayed within phase scope.
