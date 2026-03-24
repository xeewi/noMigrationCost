# Phase 7: Author Footer - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-24
**Phase:** 07-author-footer
**Areas discussed:** Footer positioning & style, Author display format, Icon & link presentation

---

## Footer Positioning & Style

### Position

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed to viewport (Recommended) | Always visible at bottom of screen, even when scrolling. Matches "visible without scrolling" requirement. | ✓ |
| End of page content | Appears after all calculator content. Only visible when scrolled to bottom. | |
| You decide | Claude picks based on requirements and layout. | |

**User's choice:** Fixed to viewport
**Notes:** None — straightforward match with FOOT-01 requirement.

### Visual Weight

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle muted bar (Recommended) | Muted text, border-t like AppHeader's border-b. Lightweight, mirrors AppHeader style. | ✓ |
| Accent branding strip | Darker background or accent color. More prominent. | |
| You decide | Claude picks based on UI consistency. | |

**User's choice:** Subtle muted bar
**Notes:** None.

---

## Author Display Format

### Name Format

| Option | Description | Selected |
|--------|-------------|----------|
| Full name + handle (Recommended) | "Guillaume Gautier (xeewi)" — professional with handle. | |
| Handle only | "xeewi" — minimal, developer-focused. | |
| "Made by" prefix | "Made by Guillaume Gautier (xeewi)" — adds attribution context. | ✓ |

**User's choice:** "Made by" prefix
**Notes:** User preferred the attribution framing over just displaying the name.

### Extra Text

| Option | Description | Selected |
|--------|-------------|----------|
| Name + links only (Recommended) | Clean and minimal. Name and icons speak for themselves. | ✓ |
| Add project name | "Feature Cost Calculator · Guillaume Gautier (xeewi)" | |
| You decide | Claude picks what looks best. | |

**User's choice:** Name + links only
**Notes:** None.

---

## Icon & Link Presentation

### Link Style

| Option | Description | Selected |
|--------|-------------|----------|
| Icon-only buttons (Recommended) | Just platform icons — GitHub, Malt, LinkedIn universally recognizable. Compact, clean. | ✓ |
| Icon + text labels | Each link shows icon + platform name. More explicit but wider. | |
| You decide | Claude picks for footer style. | |

**User's choice:** Icon-only buttons
**Notes:** None.

### Malt Icon

| Option | Description | Selected |
|--------|-------------|----------|
| Text "M" badge (Recommended) | Styled "M" letter as icon substitute. No extra dependency. | |
| Malt SVG logo | Inline SVG of actual Malt logo. More recognizable. | ✓ |
| You decide | Claude picks best match. | |

**User's choice:** Malt SVG logo
**Notes:** User wants recognizable platform icons — text fallback not preferred.

### Hover Effects

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle opacity/color shift (Recommended) | Icons go from muted to full foreground on hover. Discoverable without flashy. | ✓ |
| Underline on hover | Traditional link hover. May look odd on icon-only buttons. | |
| You decide | Claude picks natural style. | |

**User's choice:** Subtle opacity/color shift
**Notes:** None.

### Link Target

| Option | Description | Selected |
|--------|-------------|----------|
| New tab (Recommended) | target="_blank" with rel="noopener noreferrer". Keeps calculator open. | ✓ |
| Same tab | Navigates away — user loses scenario. | |

**User's choice:** New tab
**Notes:** None.

---

## Claude's Discretion

- Footer height and padding values
- Mobile/responsive behavior
- Accessibility (aria-labels, keyboard nav)
- Malt SVG sourcing/design
- Button variant vs plain anchor for icon links
- Container alignment matching AppHeader

## Deferred Ideas

None — discussion stayed within phase scope.
