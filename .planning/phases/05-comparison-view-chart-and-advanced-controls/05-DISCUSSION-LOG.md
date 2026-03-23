# Phase 5: Comparison View, Chart, and Advanced Controls - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-23
**Phase:** 05-comparison-view-chart-and-advanced-controls
**Areas discussed:** Comparison layout, Chart design, Advanced controls placement, Break-even 'no result' UX

---

## Comparison Layout

### How should the comparison relate to the existing standalone view?

| Option | Description | Selected |
|--------|-------------|----------|
| Replace standalone | Standalone becomes comparison — one view to rule them all | |
| Tabs: Standalone / Comparison | Keep standalone as its own tab, add Comparison tab | ✓ |
| Stacked: standalone on top, comparison below | Both views visible at once | |

**User's choice:** Tabs: Standalone / Comparison
**Notes:** User wants to preserve the simpler standalone view for quick estimates.

### Summary presentation on the Comparison tab

| Option | Description | Selected |
|--------|-------------|----------|
| Two summary cards | Side-by-side cards with Shared total and Duplicated total, delta highlighted | ✓ |
| Single summary row | Compact horizontal row | |
| You decide | Claude picks | |

**User's choice:** Two summary cards

### Breakdown table format

| Option | Description | Selected |
|--------|-------------|----------|
| Side-by-side columns | Single table: Category / Shared / Duplicated | ✓ |
| Stacked tables | Two separate tables | |
| You decide | Claude picks | |

**User's choice:** Side-by-side columns

### Standalone cost visibility on Comparison tab

| Option | Description | Selected |
|--------|-------------|----------|
| One tab at a time | Standard tab behavior, mutually exclusive views | |
| Show standalone total as badge | Small standalone reference number on Comparison tab | ✓ |

**User's choice:** Show standalone total as a badge on the Comparison tab

### Content ordering on Comparison tab

| Option | Description | Selected |
|--------|-------------|----------|
| Chart first, table below | Visual impact first, detail below | ✓ |
| Table first, chart below | Numbers first | |
| You decide | Claude picks | |

**User's choice:** Chart first, table below

### Default active tab

| Option | Description | Selected |
|--------|-------------|----------|
| Standalone | Start with simpler view | |
| Comparison | Jump straight to core value prop | ✓ |

**User's choice:** Comparison — the comparison is the main reason this tool exists.

### Sticky behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Sticky for Standalone, scroll for Comparison | Adaptive per tab | |
| Always sticky | Both tabs sticky | |
| Never sticky | Both columns scroll with page | ✓ |

**User's choice:** Never sticky — removes Phase 4 sticky behavior entirely.

### Tab labels

| Option | Description | Selected |
|--------|-------------|----------|
| Standalone / Comparison | Clear, descriptive | ✓ |
| Cost / Compare | Shorter | |
| You decide | Claude picks | |

**User's choice:** Standalone / Comparison

---

## Chart Design

### Chart type

| Option | Description | Selected |
|--------|-------------|----------|
| Area chart | Filled areas with transparency | ✓ |
| Line chart | Clean lines without fill | |
| You decide | Claude picks | |

**User's choice:** Area chart

### Break-even annotation

| Option | Description | Selected |
|--------|-------------|----------|
| Vertical dashed line + label | ReferenceLine with text annotation | ✓ |
| Dot marker + tooltip | Highlighted dot at crossover | |
| You decide | Claude picks | |

**User's choice:** Vertical dashed line + label

### Color scheme

| Option | Description | Selected |
|--------|-------------|----------|
| Green (shared) / Red (duplicated) | Intuitive, high contrast | ✓ |
| Blue (shared) / Orange (duplicated) | Colorblind-friendly, neutral | |
| You decide | Claude picks | |

**User's choice:** Green / Red

### X-axis granularity

| Option | Description | Selected |
|--------|-------------|----------|
| Monthly | Smoother curves, precise break-even | ✓ |
| Yearly | Simpler, matches engine output | |
| You decide | Claude picks | |

**User's choice:** Monthly (interpolated from yearly engine data)

### Legend

| Option | Description | Selected |
|--------|-------------|----------|
| Inline legend | Inside chart area with color swatches | ✓ |
| No legend | Colors match summary cards | |
| You decide | Claude picks | |

**User's choice:** Inline legend

### Y-axis format

| Option | Description | Selected |
|--------|-------------|----------|
| Abbreviated (€42K) | Cleaner labels, tooltip for exact | ✓ |
| Full values (€42,300) | Precise but crowded | |
| You decide | Claude picks | |

**User's choice:** Abbreviated (€42K)

### Tooltips

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, with both values | Month, Shared, Duplicated, difference | ✓ |
| No tooltips | Static chart only | |
| You decide | Claude picks | |

**User's choice:** Yes, with both values

### Chart size

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed height ~300-400px | Consistent, presentation-ready | ✓ |
| Aspect ratio based | Height varies with width | |
| You decide | Claude picks | |

**User's choice:** Fixed height ~300-400px

---

## Advanced Controls Placement

### Location of advanced parameters

| Option | Description | Selected |
|--------|-------------|----------|
| Collapsible section in left column | Below Time Horizon, collapsed by default | ✓ |
| Sidebar/drawer | Slide-out panel via gear icon | |
| Always visible | No collapse, everything shown | |
| You decide | Claude picks | |

**User's choice:** Collapsible section in left column

### Parameter input style

| Option | Description | Selected |
|--------|-------------|----------|
| Slider + number input | Slider with range + editable number | ✓ |
| Number inputs only | Simple labeled inputs | |
| You decide | Claude picks | |

**User's choice:** Slider + number input

### Reset to defaults

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, reset button | Small reset link/button in the section | ✓ |
| No reset | Users manually set values back | |
| You decide | Claude picks | |

**User's choice:** Yes, reset button

### Number of consuming teams placement

| Option | Description | Selected |
|--------|-------------|----------|
| Keep with advanced parameters | All constants in one place | |
| Move to main inputs | Near team-related inputs, more discoverable | ✓ |
| You decide | Claude picks | |

**User's choice:** Move to main inputs — it's a core scenario parameter, not a formula constant. Placed below Time Horizon as its own card.

### Citation tooltips

| Option | Description | Selected |
|--------|-------------|----------|
| Info icon with popover | [?] icon, click/hover shows research source | ✓ |
| Helper text below input | Static text, always visible | |
| You decide | Claude picks | |

**User's choice:** Info icon with popover

### Modified indicator

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, show a 'Modified' badge | Badge on header when values differ from defaults | ✓ |
| No indicator | Reset button is enough | |
| You decide | Claude picks | |

**User's choice:** Yes, show a 'Modified' badge

---

## Break-even 'No Result' UX

### No break-even communication

| Option | Description | Selected |
|--------|-------------|----------|
| Inline alert card | Warning-styled callout between summary cards and chart | ✓ |
| Chart annotation only | Text note inside chart area | |
| You decide | Claude picks | |

**User's choice:** Inline alert card with suggestion to increase teams or time horizon.

### Break-even exists — placement

| Option | Description | Selected |
|--------|-------------|----------|
| Between summary cards and chart | Success-styled callout in same position as no-break-even alert | ✓ |
| Inside summary cards | Break-even figure in card area | |
| You decide | Claude picks | |

**User's choice:** Between summary cards and chart — consistent position for both states.

---

## Claude's Discretion

- Component granularity and internal state management approach
- Specific shadcn/ui component choices for slider
- Exact popover/tooltip implementation for citations
- Responsive breakpoint behavior
- Monthly interpolation approach for chart data

## Deferred Ideas

None — discussion stayed within phase scope.
