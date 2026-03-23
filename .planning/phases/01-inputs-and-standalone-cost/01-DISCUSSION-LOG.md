# Phase 1: Inputs and Standalone Cost - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-23
**Phase:** 01-inputs-and-standalone-cost
**Areas discussed:** Salary defaults & team input, Feature sizing UX, Cost breakdown display, Page layout & sections

---

## Salary Defaults & Team Input

### Salary Baseline

| Option | Description | Selected |
|--------|-------------|----------|
| Loaded cost (employer cost) | Junior 32€/h, Mid 40€/h, Senior 51€/h, Lead 67€/h — gross × 1.42 / 1607h | ✓ |
| Fully loaded (with overhead) | Junior 40€/h, Mid 50€/h, Senior 65€/h, Lead 84€/h — adds 20-30% overhead | |
| Both as a toggle | Default to loaded cost, toggle to switch to fully-loaded | |

**User's choice:** Loaded cost (employer cost)
**Notes:** Standard employer cost without tools/facilities overhead.

### Team Input Pattern

| Option | Description | Selected |
|--------|-------------|----------|
| Add-row pattern | "Add member" button, name + seniority dropdown + editable cost per row | |
| Fixed 4-slot grid | One row per seniority level, headcount field per row | ✓ |
| You decide | Claude picks | |

**User's choice:** Fixed 4-slot grid
**Notes:** Simpler approach — no individual names, just headcount per seniority.

### Cost Editability

| Option | Description | Selected |
|--------|-------------|----------|
| Editable per seniority | Each seniority row's €/h is editable, defaults auto-filled | ✓ |
| Fixed defaults only | Hourly costs display-only, locked to research values | |

**User's choice:** Editable per seniority
**Notes:** Covers TEAM-03 requirement (override hourly cost).

---

## Feature Sizing UX

### Input Mode Presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Tab switch | Two tabs, only one mode visible at a time | ✓ |
| All visible, radio toggle | Both input groups always visible, inactive one grayed out | |
| You decide | Claude picks | |

**User's choice:** Tab switch
**Notes:** Clean separation, no confusion about which inputs matter.

### Direct Hours Input

| Option | Description | Selected |
|--------|-------------|----------|
| Hours only | Single field for total dev hours | |
| Hours or days toggle | Let user pick hours or days (×7h/day conversion) | ✓ |
| You decide | Claude picks | |

**User's choice:** Hours or days toggle
**Notes:** Matches SIZE-02 requirement ("hours or days").

---

## Cost Breakdown Display

### Presentation Style

| Option | Description | Selected |
|--------|-------------|----------|
| Summary card + table | Big total cost card at top, detail table below | ✓ |
| Table only | Breakdown table with total row, no separate card | |
| You decide | Claude picks | |

**User's choice:** Summary card + table
**Notes:** Prominent total cost number for presentation impact.

### Reactivity

| Option | Description | Selected |
|--------|-------------|----------|
| Real-time | All outputs recalculate instantly as inputs change | ✓ |
| Calculate button | User clicks button to see results | |
| You decide | Claude picks | |

**User's choice:** Real-time
**Notes:** Natural fit for Alpine.js reactivity.

---

## Page Layout & Sections

### Page Arrangement

| Option | Description | Selected |
|--------|-------------|----------|
| Top-down flow | Inputs stacked vertically, output below | |
| Two-column split | Inputs left, outputs right | |
| You decide | Claude picks based on Pico CSS and Phase 2 needs | ✓ |

**User's choice:** You decide
**Notes:** Claude has discretion on layout arrangement.

### Theme

| Option | Description | Selected |
|--------|-------------|----------|
| Light theme | Clean, presentation-friendly, Pico CSS default | ✓ |
| Dark theme | Developer-friendly, less ideal for projectors | |
| Auto (system preference) | OS dark/light detection | |
| You decide | Claude picks | |

**User's choice:** Light theme
**Notes:** Optimized for stakeholder presentations on projectors.

### File Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Split files | index.html + app.js + data.js + styles.css | ✓ |
| Single file | Everything in index.html | |
| You decide | Claude picks | |

**User's choice:** Split files
**Notes:** As defined in CLAUDE.md stack patterns.

---

## Claude's Discretion

- Page layout arrangement (top-down vs two-column) — deferred to Claude based on Pico CSS strengths and Phase 2 integration

## Deferred Ideas

None — discussion stayed within phase scope.
