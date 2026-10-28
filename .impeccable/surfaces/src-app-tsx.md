---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Calculator surface

Scope: the calculator view (src/App.tsx and its components). Mode: Operate.
Audience: a decision-maker opening a shared link cold. Job: read the verdict (gap in €, break-even) in seconds, then challenge it through the inputs.
Constraints: keep every formula, the URL-hash state and the docs view. Prefill an example scenario instead of starting at zero. Plain-language labels; the model constants live behind a Simple / Detailed switch.

## Direction contract

THESIS: The scenario is posted like a French public-works site notice: what is built, how much it costs, how long until it pays off. The verdict panel is the page. Refuses the default of input cards on the left and KPI tiles on the right.

OWN-WORLD: Notice-board blue #1F3A93 panel with white condensed lettering (Barlow Condensed) and a signal-yellow #F7C600 tag; ink #14171A header; cool light grey ground #EDEFF2; hazard red #D7261E reserved only for the cost of duplication, drawn as red/white chevron hatching. Barlow for UI text, tabular numerals everywhere. Square-ish 3–6px corners, no shadows except the panel's white mounting border.

STORY: The visitor reads "Duplicating costs you +83 400 €" and "Sharing pays off after 14 months", sees the hatched gap grow on the chart, scans the four biggest hidden costs ranked by size, then tweaks the team or app count to test it and copies the link back.

FIRST VIEWPORT: Ink header (logo, Calculator / How it works, Reset, yellow Copy link). Left rail 340px: numbered steps 1 Team, 2 Feature, 3 Apps, 4 Assumptions (Simple/Detailed), example-scenario note. Main: the blue verdict panel spanning full width, € gap at ~84px, break-even and totals beside; under it Comparison / Single feature tabs with the horizon switch; the cumulative-cost chart with hatched gap and a yellow break-even flag; four hidden-cost tiles ranked by magnitude bars.

FORM: Panneau de chantier, position 4 of my grounded list, pinned by the user over a re-roll. seed:33be666bbba89be0. Raises kept: scale-contrast hierarchy; one dominant region; fixed-capacity horizon with flush-right totals; magnitude ramp for cost items; reserved colour for duplication; visible shared grid; tabular density; Simple/Detailed as whole states.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Open decisions
- UI language: English today; French is an option for the French audience.
- Signature interaction and motion grammar to be confirmed at build (candidate: the hatched gap and verdict figure re-tally when an input changes).
