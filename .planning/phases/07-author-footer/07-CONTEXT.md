# Phase 7: Author Footer - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

A persistent footer banner fixed to the viewport bottom, identifying the author (Guillaume Gautier / xeewi) with clickable icon links to GitHub, Malt, and LinkedIn profiles. The footer is always visible without scrolling, styled as a subtle muted bar that mirrors the AppHeader's understated aesthetic.

</domain>

<decisions>
## Implementation Decisions

### Footer Positioning & Style
- **D-01:** Fixed to viewport bottom — `position: fixed; bottom: 0` so the footer is always visible without scrolling (FOOT-01 requirement)
- **D-02:** Subtle muted bar with `border-t` top border, matching AppHeader's `border-b` pattern. Muted-foreground text color. Lightweight — does not compete with calculator content.
- **D-03:** Main content area needs bottom padding to prevent the fixed footer from overlapping calculator content

### Author Display Format
- **D-04:** "Made by Guillaume Gautier (xeewi)" — attribution prefix with full name and handle in parentheses
- **D-05:** Name and links only — no project name or additional text in the footer

### Icon & Link Presentation
- **D-06:** Icon-only buttons for the three profile links (GitHub, Malt, LinkedIn) — compact and clean
- **D-07:** GitHub and LinkedIn icons from lucide-react (already installed). Malt uses an inline SVG of the actual Malt logo.
- **D-08:** Links open in new tab (`target="_blank"` with `rel="noopener noreferrer"`) — keeps the calculator open
- **D-09:** Subtle hover effect — icons shift from muted to full foreground color on hover

### Claude's Discretion
- Footer height and exact padding values
- Mobile/responsive behavior (single-row vs stacked on narrow screens)
- Accessibility: aria-labels for icon-only links, keyboard navigation order
- Exact Malt SVG icon design/sourcing
- Whether to use shadcn Button variant="ghost" for icon links or plain anchor tags
- Max-width container alignment (should match AppHeader's max-w-[1280px] px-6 pattern)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing UI Components
- `src/components/AppHeader.tsx` — Reference for consistent header/footer styling pattern (border, max-width, flex layout, lucide-react icon usage)
- `src/App.tsx` lines 193-261 — Root layout structure where footer will be integrated (min-h-screen wrapper, content container)

### UI Library
- `src/components/ui/button.tsx` — Button component for potential ghost-variant icon links
- `src/components/ui/separator.tsx` — Available if visual separator needed

### Requirements
- `.planning/REQUIREMENTS.md` — FOOT-01 through FOOT-04 define acceptance criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lucide-react` — Already installed; provides `Github` and `Linkedin` icons. No Malt icon available — needs inline SVG.
- `src/components/ui/button.tsx` — Ghost variant could serve as icon link wrapper
- AppHeader pattern — `border-b`, `max-w-[1280px] mx-auto px-6 py-3`, `flex items-center justify-between` is the template for the footer

### Established Patterns
- Global bars use `max-w-[1280px] mx-auto px-6` container with border separator
- lucide-react icons at `h-4 w-4` sizing (see AppHeader's Link/Check icons)
- Components are named exports from dedicated files in `src/components/`

### Integration Points
- `src/App.tsx` — Footer component rendered inside the `min-h-screen` wrapper, after the content container
- Main content `div` needs `pb-[footer-height]` to prevent overlap with the fixed footer

</code_context>

<specifics>
## Specific Ideas

- Footer should visually bookend with AppHeader — same container width, similar padding, border treatment (top instead of bottom)
- "Made by" prefix was specifically chosen over just showing the name — conveys attribution intent
- Malt SVG logo preferred over text "M" fallback — user wants recognizable platform icons

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-author-footer*
*Context gathered: 2026-03-24*
