# Phase 10: Sidebar Polish - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can see which documentation section they are currently reading via a highlighted link in the sidebar, and the sidebar auto-scrolls to keep the active link visible as they scroll through the document.

Requirements: NAV-02 (active section highlighting), NAV-03 (sidebar auto-scroll).

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion

All implementation decisions deferred to Claude's best judgment. User chose not to discuss any gray areas.

Areas under discretion:
- **Active link styling** — How the currently-visible section is visually distinguished from other sidebar links (color, weight, border, background, or combination)
- **Heading level behavior** — Whether h2 and h3 headings are independently tracked as active sections, or only h2 top-level sections
- **Sidebar auto-scroll** — Animation style (smooth vs instant) and scroll positioning (center, nearest, start) when bringing the active link into view
- **IntersectionObserver configuration** — rootMargin, threshold, and ratio-based selection strategy for determining the active section

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Sidebar & Docs Components
- `src/components/DocsSidebar.tsx` — Current sidebar with heading extraction and anchor links; needs active state prop and highlight styling
- `src/components/DocsPage.tsx` — Parent layout with sticky sidebar aside; IntersectionObserver will be set up here or in a custom hook

### Prior Phase Context
- `.planning/phases/08-routing-foundation/08-CONTEXT.md` — Routing decisions (hash format, rehype-slug prefix, mount-but-hide pattern)

### Requirements
- `.planning/REQUIREMENTS.md` §Sidebar Navigation — NAV-02, NAV-03

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `DocsSidebar` component: Already extracts h2/h3 headings with `doc-` prefixed IDs matching rehype-slug output. Needs `activeId` prop to highlight the active link.
- `DocsPage` layout: Sidebar is in a sticky `aside` with `overflow-y-auto` and `max-h-[calc(100vh-5rem)]` — this container supports `scrollIntoView` for auto-scroll (NAV-03).
- Heading components in DocsPage have `scroll-mt-16` for sticky header offset.

### Established Patterns
- Module-level constants pattern (REMARK_PLUGINS, REHYPE_PLUGINS, COMPONENTS) to avoid re-render overhead
- Tailwind utility classes for all styling (no CSS modules or styled-components)
- `useMemo` for expensive computations (heading extraction)

### Integration Points
- `DocsPage` renders `DocsSidebar` — will pass `activeId` state down as a prop
- IntersectionObserver needs to observe all heading elements matching the `doc-` prefix
- Sidebar auto-scroll targets the `aside > div.sticky` container's `overflow-y-auto` element

### Prior Technical Decision
- STATE.md notes: "IntersectionObserver scroll-spy uses Map<id, ratio> approach with rootMargin: '-10% 0px -80% 0px'" — this approach was noted during Phase 9 implementation

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-sidebar-polish*
*Context gathered: 2026-03-24*
