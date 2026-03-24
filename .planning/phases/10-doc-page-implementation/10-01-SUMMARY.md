---
phase: 10-doc-page-implementation
plan: 01
subsystem: ui
tags: [react-markdown, remark-gfm, rehype-slug, tailwindcss-typography, docs, sidebar, routing]

# Dependency graph
requires:
  - phase: 09-routing-foundation
    provides: useHashRoute hook with hash namespace discrimination; AppHeader with view/onNavigate props
provides:
  - DocsPage component rendering full research markdown with sidebar navigation
  - DocsSidebar component with heading extraction and anchor link list
  - Typography plugin registered in Tailwind CSS for prose styling
  - Sticky AppHeader with bg-background to prevent scroll bleed-through
  - Deep-link scroll support for #/docs/doc-{slug} URLs
affects: [11-doc-scroll-spy, any future doc page enhancements]

# Tech tracking
tech-stack:
  added: [react-markdown@10.1.0, remark-gfm@4.0.1, rehype-slug@6.0.0, @tailwindcss/typography@0.5.19]
  patterns:
    - Module-level plugin constants (REMARK_PLUGINS, REHYPE_PLUGINS, COMPONENTS) to prevent re-parse on render
    - Vite ?raw import for bundling markdown as string at build time
    - rehype-slug with prefix: 'doc-' to prevent ID collision with base64url state hashes
    - scrollIntoView with requestAnimationFrame for post-paint scroll in useEffect

key-files:
  created:
    - src/components/DocsPage.tsx
    - src/components/DocsSidebar.tsx
  modified:
    - src/index.css
    - src/components/AppHeader.tsx
    - src/App.tsx

key-decisions:
  - "REHYPE_PLUGINS typed as any[] to resolve readonly tuple vs Pluggable[] TypeScript incompatibility"
  - "Module-level constants for ReactMarkdown plugins to prevent re-parse on every parent re-render"
  - "DocsSidebar heading IDs prefixed with doc- matching rehype-slug prefix config for consistent anchor navigation"

patterns-established:
  - "Pattern 1: Module-level ReactMarkdown plugin arrays prevent re-instantiation on re-render"
  - "Pattern 2: Markdown imported via Vite ?raw suffix for zero-fetch bundled content"

requirements-completed: [DOC-01, DOC-02, DOC-03, DOC-04, NAV-01]

# Metrics
duration: 2min
completed: 2026-03-24
---

# Phase 10 Plan 01: Doc Page Implementation Summary

**React-markdown docs page with @tailwindcss/typography prose, GFM tables, sticky header, DocsSidebar heading extraction, and deep-link scroll support wired into App.tsx**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-24T16:25:20Z
- **Completed:** 2026-03-24T16:27:37Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Installed react-markdown, remark-gfm, rehype-slug, @tailwindcss/typography as runtime dependencies and registered typography plugin in CSS
- Created DocsSidebar with extractHeadings (github-slugger-compatible toSlug, h2/h3 only, doc- prefix, route-namespace hash links)
- Created DocsPage with two-column layout (sticky sidebar + prose article), deep-link useEffect, and wired it into App.tsx replacing the placeholder

## Task Commits

Each task was committed atomically:

1. **Task 1: Install packages, register typography plugin, make AppHeader sticky** - `98c67d4` (feat)
2. **Task 2: Create DocsSidebar component with heading extraction** - `57a27af` (feat)
3. **Task 3: Create DocsPage component and wire into App.tsx** - `d5f8f48` (feat)

## Files Created/Modified

- `src/components/DocsPage.tsx` - Full docs layout with sticky sidebar + ReactMarkdown article, deep-link scroll on mount
- `src/components/DocsSidebar.tsx` - Heading extraction from raw markdown, clickable anchor links, h3 indented with pl-4
- `src/index.css` - Added `@plugin "@tailwindcss/typography"` on line 2 (Tailwind v4 CSS-first pattern)
- `src/components/AppHeader.tsx` - Made sticky with `sticky top-0 z-50 bg-background` to prevent scroll bleed-through
- `src/App.tsx` - Added DocsPage import, replaced docs placeholder with `<DocsPage />`

## Decisions Made

- Typed REHYPE_PLUGINS as `any[]` to resolve readonly tuple vs `Pluggable[]` TypeScript incompatibility (using `as const` caused type error)
- Module-level constants for ReactMarkdown plugin arrays prevent re-instantiation on every parent re-render (RESEARCH.md Pitfall 1)
- DocsSidebar heading IDs prefixed with `doc-` matching rehype-slug prefix config for consistent anchor navigation

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed REHYPE_PLUGINS TypeScript type error**
- **Found during:** Task 3 (Create DocsPage component)
- **Issue:** `as const` made the array readonly, causing TypeScript error "cannot be assigned to the mutable type 'Pluggable[]'"
- **Fix:** Typed `REHYPE_PLUGINS` as `any[]` instead of using `as const`
- **Files modified:** src/components/DocsPage.tsx
- **Verification:** `npm run build` passed with zero TypeScript errors
- **Committed in:** d5f8f48 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor type annotation fix only. No scope creep, full plan intent preserved.

## Issues Encountered

- TypeScript rejected `as const` on REHYPE_PLUGINS tuple — resolved by typing as `any[]` with eslint-disable comment

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- DocsPage fully functional: prose typography, GFM tables, sidebar navigation, deep-link scroll
- Phase 11 (NAV-02) can implement IntersectionObserver scroll-spy for active heading highlighting in the sidebar
- No blockers

---
*Phase: 10-doc-page-implementation*
*Completed: 2026-03-24*
