---
name: Feature Cost Calculator
description: The cost of duplicating code, posted like a public-works site notice.
colors:
  panel: "#1f3a93"
  panel-soft: "#c9d3f5"
  panel-text-soft: "#dfe5fa"
  signal: "#f7c600"
  signal-hover: "#ffd633"
  signal-wash: "#fff5cc"
  hazard: "#c8221b"
  hazard-wash: "#f3c9c6"
  ink: "#14171a"
  ink-text-soft: "#b9bec8"
  ground: "#edeff2"
  card: "#ffffff"
  muted: "#e3e6eb"
  muted-foreground: "#4a4f58"
  border: "#d3d7de"
  input: "#c3c8d1"
typography:
  display:
    fontFamily: "Barlow Condensed, Barlow, sans-serif"
    fontSize: "76px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Barlow Condensed, Barlow, sans-serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  figure:
    fontFamily: "Barlow Condensed, Barlow, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.25
    fontFeature: "tnum"
  title:
    fontFamily: "Barlow Condensed, Barlow, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.25
  heading:
    fontFamily: "Barlow Condensed, Barlow, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.06em"
  label:
    fontFamily: "Barlow Condensed, Barlow, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.1em"
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "tnum"
  caption:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
rounded:
  sm: "2.4px"
  segment: "3px"
  md: "3.2px"
  lg: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "20px"
  xl: "32px"
  rail: "340px"
  container: "1440px"
components:
  button-signal:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "32px"
  button-signal-hover:
    backgroundColor: "{colors.signal-hover}"
  button-outline-on-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "32px"
  segmented-option:
    textColor: "{colors.muted-foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.segment}"
    padding: "6px 12px"
  segmented-option-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
    rounded: "{rounded.segment}"
    padding: "6px 12px"
  stepper-button:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    size: "32px"
  input-field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "4px 10px"
    height: "32px"
  verdict-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.card}"
    rounded: "{rounded.md}"
    padding: "32px 32px 24px"
  signal-tag:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "2px 10px"
  step-number:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
    rounded: "{rounded.sm}"
    size: "24px"
  cost-tile:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  example-note:
    backgroundColor: "{colors.signal-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
---

# Design System: Feature Cost Calculator

## Overview

**Creative North Star: "The Site Notice"**

The page is posted like a French public-works notice (panneau de chantier): a blue board with white condensed lettering states what is being built, what it costs and when it pays off. The verdict panel is the page; everything else is the working that backs it up. A cold reader gets the sentence first, then the chart, then the inputs to argue with.

The world is flat, cool and municipal. An ink header bar, a light grey ground, white work surfaces with hairline borders, and one saturated blue board. Colour is signage, not decoration: blue is the notice and the shared path, yellow is a tag or a flag that points at something, red is reserved for the cost of duplication and is drawn as red/white chevron hatching like a road barrier. Density is tabular; every figure uses tabular numerals so columns of euros line up.

The default shadcn look (grey pills, soft shadows, rounded cards, neutral greys as the only voice) is what this world replaced.

**Key Characteristics:**
- One dominant blue board per view, carrying the conclusion at display size.
- Barlow Condensed for anything posted (figures, headings, tags); Barlow for working text.
- Tabular numerals everywhere, set once on `html`.
- Hazard red only means "cost of duplication", and its fill form is hatching.
- Flat: hairline borders and a white mounting ring instead of shadows.
- Square-ish corners, 2.4–4px.

## Colors

A signage palette: one board blue, one signal yellow, one hazard red, on ink and cool greys.

### Primary
- **Notice-Board Blue** (panel): the verdict board's field, the "Shared" line and legend swatch, the Shared total in the breakdown, slider fills, focus outlines, caret and native accent colour. It is the colour of the answer and of the shared path.
- **Board Lettering Blue** (panel-soft): the question lines on the board ("Duplicating this feature costs you", "Sharing pays off after"). Only ever on Notice-Board Blue.
- **Board Body Text** (panel-text-soft): supporting sentences and `dt` labels on the board, one step quieter than white.

### Secondary
- **Signal Yellow** (signal): the board's mounted tag, the chart's break-even flag, the primary action (Copy link), the active nav underline, and text selection. It points; it never fills a region.
- **Signal Yellow Lit** (signal-hover): hover state of the yellow action only.
- **Signal Wash** (signal-wash): the "Example scenario" note, the one tinted informational block.

### Tertiary
- **Hazard Red** (hazard): the "Duplicated" line, the Duplicated total, the hatched gap between the curves, the magnitude bars on hidden-cost tiles. Also mapped to `destructive`.
- **Hazard Wash** (hazard-wash): the light stripe inside hatching on the hidden-cost bars.

### Neutral
- **Ink** (ink): header bar, all body text, active segmented option, step-number chips, chart reference lines and break-even flag lettering.
- **Ink Soft Lettering** (ink-text-soft): inactive nav links on the ink header.
- **Site Grey** (ground): page ground behind the main column and footer.
- **Card White** (card): rail, chart card, tiles, table, inputs, popovers; also the board's mounting ring.
- **Muted Grey** (muted): hover fills, empty tracks of magnitude bars, chart gridlines.
- **Muted Text** (muted-foreground): captions, hints, legends, axis ticks.
- **Hairline** (border): every card and divider border.
- **Input Stroke** (input): input, stepper and segmented-group strokes; the chart's x-axis line.

### Named Rules
**The Hazard Reservation Rule.** Hazard red marks the cost of duplication and nothing else: the duplicated series, its total, the gap, the hidden-cost bars. Never use it for generic errors in the calculator view, emphasis, or decoration.

**The Hatch Is The Fill Rule.** When hazard red fills an area (the chart gap, a magnitude bar, a legend swatch), it is drawn as 45° red/white stripes, not a flat tint. Lines and text may be solid red.

**The Signal Points Rule.** Signal Yellow is used at tag, flag, underline or single-button scale. One yellow action per view.

## Typography

**Display Font:** Barlow Condensed (with Barlow, sans-serif), weights 600/700/800
**Body Font:** Barlow (with system-ui, sans-serif), weights 400/500/600

**Character:** Condensed grotesque lettering as on road and site signage, over a plain humanist-grotesque working face. The pairing is one family, so the change of width carries the hierarchy, not a change of voice.

### Hierarchy
- **Display** (800, 76px desktop / 56px mobile, line-height 1, -0.01em): the verdict gap figure only. One per view.
- **Headline** (700, 44px, line-height 1): the break-even answer on the board.
- **Figure** (700, 28px): totals on the board and hidden-cost tile amounts.
- **Title** (600, 24px desktop / 22px mobile): the board's question lines, sentence case.
- **Heading** (700, 20px, uppercase, 0.06em): section headings in the main column ("What copying keeps costing you", "Full breakdown"). The chart caption uses the same form at 17px / 0.08em.
- **Label** (700, 15px, uppercase, 0.1em): numbered rail-step titles. The board tag uses 13px / 0.14em, the chart flag 13px / 0.06em.
- **Body** (400–500, 14px; 15px on the board): labels, table cells, controls.
- **Caption** (400, 13px): hints under controls, legends, the example note. Chart ticks are 12px.

### Named Rules
**The Tabular Rule.** `font-variant-numeric: tabular-nums` is set on `html` and never overridden. Euro figures use `formatEuro` (space-grouped, trailing €).

**The Condensed Means Posted Rule.** Barlow Condensed is for things posted on the board or used as signage: figures, headings, tags, flags, step titles. Running text, labels and control text stay in Barlow.

## Layout

A two-column work layout inside a 1440px container. On `lg` and up: a 340px white input rail with a right hairline, and a main column on Site Grey (32px padding). The rail is a stack of numbered steps (1 Who builds it, 2 How big is the feature, 3 Who would share it, 4 Assumptions), each 20px padded and separated by hairlines. The numbers carry the reading order.

The main column reads top-down: the verdict board full width, then a control row (view tabs left, horizon switch flush right), then the chart card, the hidden-cost tiles, and the breakdown table. Section stack gap is 28px; tile gaps 12px. Hidden-cost tiles run 1 / 2 / 4 columns (base / sm / xl) and are always ordered biggest first. The board's interior is a 1.35fr / 1fr / 1fr grid on `lg`, stacked below.

Below `lg` the main column moves above the rail (conclusion first), the example note moves under the board, and the horizon switch goes full width. Header is sticky, 56px tall, and collapses button labels to icons under `sm`.

## Elevation & Depth

Flat. Depth comes from tone (white surfaces on Site Grey, the blue board on both) and hairline borders. The board is "mounted": a 6px white ring plus a 1px hairline outline offset 6px, like a sign in its frame. That ring is its only depth.

### Shadow Vocabulary
- **Overlay lift** (`box-shadow: 0 6px 20px -8px rgba(20,23,26,0.35)`): the chart tooltip, a transient floating layer. Not for anything at rest.

### Named Rules
**The Mounting Ring Rule.** Resting surfaces never cast shadows. The verdict board is set apart by its white ring and offset hairline; cards and tiles by a 1px hairline.

## Shapes

Square-ish. The radius scale derives from a 4px base: 2.4px for tags, chips, buttons and steppers; 3px for segmented options; 3.2px for the board, chart card, tiles and table; 4px for inputs. Nothing in the calculator view is pill-shaped except slider tracks and thumbs. Borders are 1px hairlines; the only heavier strokes are the 3px chart series lines and the 2px active-nav underline.

## Components

### Buttons
Small, flat, signage-coloured.
- **Shape:** slight corners (2.4px), 32px tall, 12px side padding, Barlow 14px.
- **Primary (Copy link):** Signal Yellow with Ink lettering, weight 600, icon + label. Hover lightens to Signal Yellow Lit.
- **Outline on ink (Start over):** transparent on the ink header, white text, 1px white/25% stroke; hover fills white/10%.
- **Text action (Restore research figures):** Notice-Board Blue text, 1px underline thickening to 2px on hover.
- **Focus:** global 2px Notice-Board Blue outline, 2px offset.

### Segmented Switch
The world's toggle: Story points / Time, Simple / Detailed, and the 1 / 3 / 5 / 10-year horizon.
- **Group:** white field, 1px Input Stroke border, 2px inner padding, 2.4px corners.
- **Option:** Muted Text, 14px weight 500, 6px × 12px; hover fills Muted Grey and darkens text.
- **Selected:** Ink fill, white text. `aria-pressed` carries the state. Colour transition 150ms.

### Stepper
Headcount and team-count control: 32px square white buttons with a 1px Input Stroke and 14px minus/plus icons, the value between them in 600 weight. Disabled drops to 40% opacity.

### Inputs / Fields
- **Style:** white or transparent field, 1px Input Stroke, 4px corners, 32px tall, numbers right-aligned.
- **Focus:** border turns Notice-Board Blue with a 3px blue/50% ring.
- **Inline rate edit:** hourly rates under each seniority are borderless until hover or focus, then take the Input Stroke on white.

### Navigation
Ink header bar, 56px, sticky. Wordmark in Barlow Condensed 800 uppercase beside a yellow warning-triangle mark. Nav links are Barlow 14px weight 500: Ink Soft Lettering at rest, white on hover, white with a 2px Signal Yellow underline when current.

### Rail Step
Numbered input section: a 24px Ink square holding the step number in white, then the uppercase Label-style title; content 12px below; 20px padding; hairline between steps.

### Verdict Board (signature)
The site notice. Notice-Board Blue field, white text, 3.2px corners, 32px top/side and 24px bottom padding, with the white mounting ring. A Signal Yellow tag sits on the top edge, offset 24–32px from the left, stating the horizon ("Verdict over 5 years"). Three columns: the gap in Display with its Title question above and a body sentence below; the break-even answer in Headline; the two totals as a ruled definition list in Figure. The gap figure re-tallies to a new value over 650ms with ease-out-expo, and snaps under reduced motion.

### Cumulative Cost Chart (signature)
A white card with hairline border holding a 240px line chart. Shared in Notice-Board Blue and Duplicated in Hazard Red, both 3px straight lines with no dots or entry animation. Where duplication costs more, the gap between them is filled with the 45° hazard hatch. Gridlines are horizontal only, in Muted Grey. Break-even is a dashed Ink vertical with a Signal Yellow flag lettered "BREAK-EVEN · N MO" in Barlow Condensed 700. The legend sits in the caption row, right-aligned.

### Hidden-Cost Tile
White, hairline, 3.2px corners, 12px × 16px padding. Caption-size label in Muted Text, amount in Figure, then an 8px magnitude bar: Muted Grey track, hatched Hazard fill scaled to the largest item (min 4%). Tiles are always sorted by size, biggest first.

### Example Note
Signal Wash block, 2.4px corners, 13px Ink text with a 600-weight lead-in. Shown only while the prefilled scenario is untouched.

## Do's and Don'ts

### Do:
- **Do** put the conclusion on the Notice-Board Blue board above everything else, with the gap at Display size.
- **Do** draw any area filled with Hazard Red as 45° red/white hatching.
- **Do** use Barlow Condensed for figures, headings, tags and flags, and Barlow for labels and running text.
- **Do** use the Segmented switch (Ink selected state) for every mutually exclusive choice.
- **Do** sort cost lists and tiles by magnitude, biggest first, with a bar showing relative size.
- **Do** separate surfaces with 1px hairlines (#d3d7de) and tone, keeping corners at 2.4–4px.

### Don't:
- **Don't** use Hazard Red for anything other than the cost of duplication.
- **Don't** add shadows to resting cards, tiles or the board; the only shadow is the transient tooltip lift.
- **Don't** use Signal Yellow as a background fill for a region or more than one action per view.
- **Don't** use pill-shaped buttons, grey pill tab bars or rounded-xl cards (the replaced shadcn default look).
- **Don't** set figures in proportional numerals.
