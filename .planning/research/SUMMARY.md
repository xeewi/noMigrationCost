# Project Research Summary

**Project:** Feature Cost Calculator — v1.2 Documentation Milestone
**Domain:** In-app Markdown documentation viewer integrated into existing React+Vite SPA
**Researched:** 2026-03-24
**Confidence:** HIGH

## Executive Summary

This milestone adds a readable in-app documentation page to an already-functional React+Vite+TypeScript+shadcn/ui calculator. The research doc (`docs/feature-cost-shared-vs-duplicated.md`, ~45KB, 45+ sources) must be rendered as formatted HTML with sidebar navigation inside the existing SPA — without a new routing library, without touching the calculator's state engine, and without breaking the existing URL-sharing mechanism that encodes calculator state in `window.location.hash`.

The recommended approach is a prefix-based hash namespace (route hashes start with `/`, encoded state hashes never do) combined with `react-markdown` + `remark-gfm` + `rehype-slug` for rendering and `@tailwindcss/typography` for prose styling. Sidebar navigation is built with a regex-based heading extractor (`useDocSections` hook) and `IntersectionObserver` for scroll-spy. No router library is added. All new components live in `src/components/docs/` as a self-contained unit, and only `App.tsx` and `AppHeader.tsx` receive surgical modifications.

The dominant risk is hash namespace collision: two separate subsystems (`decodeAppState` and the new view router) both read `window.location.hash` on mount and write to it on user action. This collision must be resolved in Phase 1 before any other docs feature is built — retrofitting it later is effectively a rewrite. Secondary risks (IntersectionObserver sidebar flicker, fixed header obscuring anchor targets, Copy Link button capturing doc fragments) are all low-recovery-cost if the Phase 1 routing foundation is solid.

## Key Findings

### Recommended Stack

The base stack (React 19, Vite, TypeScript, shadcn/ui, Tailwind CSS 4, Recharts) is already installed and validated. This milestone requires four additional packages: `react-markdown@10.1.0` (renders Markdown as React components, ESM-native, 14M weekly downloads), `remark-gfm@4.0.1` (required for the tables in the research doc), `rehype-slug@6.0.0` (auto-generates heading `id` attributes for sidebar anchors), and `@tailwindcss/typography@0.5.19` (applies readable prose styling in one `prose` className, explicitly supports Tailwind v4 via `@plugin` directive). All versions verified against npm registry.

**Core technologies:**
- `react-markdown@10.1.0`: Markdown-to-React-components renderer — avoids `dangerouslySetInnerHTML`, supports remark/rehype plugin pipelines, ESM-native for Vite
- `remark-gfm@4.0.1`: GitHub Flavored Markdown — required for pipe tables in the research doc; without it, tables render as raw pipe syntax
- `rehype-slug@6.0.0`: Auto-generates heading `id` attributes from heading text — required for sidebar anchor links to function; configure with `prefix: 'doc-'` to prevent hash namespace collision
- `@tailwindcss/typography@0.5.19`: `prose` class applies heading hierarchy, list spacing, table borders — replaces 150-300 lines of custom CSS; registered via `@plugin` in CSS (Tailwind v4 method)
- Vite `?raw` import: Built-in suffix to import `.md` as a string at build time — zero runtime fetch, no plugin needed

**What not to use:** `dangerouslySetInnerHTML` with `marked` (no component overrides, XSS precedent), any routing library (50KB+ overhead for two views), MDX (compile step for no benefit on static prose), `fetch()` for the Markdown file (loading state complexity for a bundled asset).

### Expected Features

**Must have (table stakes) — v1.2:**
- Hash routing scheme that distinguishes `#/docs` from encoded calculator state — without this the app is broken
- Doc page renders `docs/feature-cost-shared-vs-duplicated.md` via react-markdown with remark-gfm — core deliverable
- rehype-slug enabled with `prefix: 'doc-'` — required for sidebar anchors to hit correct headings
- Left sidebar listing all `##` and `###` headings with scroll-to-section on click — essential for a 45KB document
- Active section highlighting in sidebar via IntersectionObserver — users expect this from any reference doc
- AppHeader extended with calculator/docs nav links — required for switching between views
- AppFooter shared on docs page — visual consistency

**Should have (polish) — v1.2.x:**
- Sidebar collapse on narrow viewports (Tailwind responsive breakpoint) — add if real non-widescreen usage is reported
- Deep links to doc sections (`#/docs#section-id`) — add if users share doc-specific links
- Smooth scroll behavior (`scroll-behavior: smooth`) — noticeable quality gap if missing

**Defer (v2+):**
- Reading-time / section-count indicator — low value
- Syntax highlighting for code blocks — research doc uses plain-text formulas, not real language syntax
- Multi-page doc structure — not needed unless doc grows substantially
- Full-text search — browser Ctrl+F already covers this for a single-file doc

### Architecture Approach

The architecture is additive: `App.tsx` gains a hash discriminator and an early-return branch that renders `<DocLayout>` instead of the existing calculator JSX; `AppHeader.tsx` gains a `view` prop for conditional nav links; three new components (`DocLayout`, `DocSidebar`, `DocContent`) land in `src/components/docs/`; and a `useDocSections` hook in `src/hooks/` extracts headings from the raw Markdown string via regex (avoiding post-render DOM queries). The existing `url-state.ts`, `src/engine/`, and all calculator components are completely untouched. Calculator React state survives view switches because it lives in `App.tsx` state variables, not in the component tree being swapped.

**Major components:**
1. `App.tsx` (modified) — hash discriminator on mount and `hashchange`; `view` state (`'calculator' | 'docs'`); guard on the debounced hash-write effect to not overwrite `/docs` hash
2. `AppHeader.tsx` (modified) — accepts `view` prop; renders "Documentation" link in calculator view, "Calculator" link in docs view; Copy Link and Reset buttons hidden in docs view
3. `DocLayout` (new) — thin two-column shell; owns the `useDocSections` call; passes sections to `DocSidebar`, renders `DocContent`
4. `DocSidebar` (new) — receives `DocSection[]`; renders anchor links; tracks active section via IntersectionObserver
5. `DocContent` (new) — imports `docs/feature-cost-shared-vs-duplicated.md?raw`; renders via `<ReactMarkdown>` with prose classes; heading component overrides include `scroll-margin-top` for fixed header clearance
6. `useDocSections` (new hook) — pure regex parse of Markdown string; returns `{ id, label, depth }[]`; `useMemo`-wrapped for stability

### Critical Pitfalls

1. **Hash namespace collision** — The existing `decodeAppState` reads `window.location.hash` on mount; the new view router also writes `#/docs`. Resolution: prefix-based discrimination (`/` prefix for routes, base64url never produces `/`). Guard the hash-write effect with `if (view === 'docs') return`. Must be addressed in Phase 1 — retrofitting after sidebar is built is a full rewrite.

2. **Heading IDs collide with hash state** — `rehype-slug` generates plain heading IDs by default; a short section name could produce a valid base64 string. Resolution: always configure `rehype-slug` with `prefix: 'doc-'`. One config option, zero implementation cost.

3. **react-markdown re-parses on every render** — If `<ReactMarkdown>` or its `components` prop object is inside a frequently re-rendering parent, it re-parses the full 45KB doc on every render. Resolution: import Markdown as a module-level constant via `?raw`; define the `components` object as a module-level constant; render docs and calculator as mutually exclusive top-level branches.

4. **IntersectionObserver sidebar flicker at section boundaries** — Short sections cause simultaneous intersection events for adjacent headings, making the active highlight flicker. Resolution: maintain a `visibleSections` Map of ID to intersection ratio; derive active section as highest-ratio visible entry; use `rootMargin: '-10% 0px -80% 0px'` to bias toward the topmost section.

5. **Fixed AppHeader obscures anchor scroll targets** — Default browser anchor scroll aligns the heading to the viewport top, placing it behind the fixed header. Resolution: add `scroll-margin-top` (~`4rem`) to all heading component overrides in react-markdown's `components` prop. One CSS property, invisible in testing unless you test with sections below the fold.

6. **Copy Link button captures doc anchor as calculator share URL** — If AppHeader is rendered identically in both views, clicking Copy Link on the docs page writes a doc anchor fragment to clipboard. Recipient loads the calculator at defaults. Resolution: pass `activeView` prop to AppHeader; hide Copy Link and Reset in docs view.

## Implications for Roadmap

Based on the dependency graph and pitfall severity, three phases are recommended.

### Phase 1: Routing Foundation

**Rationale:** The hash namespace collision is a load-bearing constraint. Every other docs feature depends on a stable routing discriminator. Building sidebar navigation or Markdown rendering before this is resolved means retrofitting later at high cost. The architecture research confirms this is the integration spine — everything hangs off it.

**Delivers:** Safe view switching between calculator and docs with no state corruption; `#/docs` hash correctly routes to docs view; `#eyJ...` hashes continue to restore calculator state unchanged; hash-write effect guarded; AppHeader shows correct nav links per view.

**Addresses:** Hash routing scheme (P1 feature), AppHeader nav links (P1 feature)

**Avoids:** Pitfall 1 (hash namespace collision), Pitfall 2 (heading ID prefix — configure `rehype-slug` before any headings are rendered), Pitfall 6 (Copy Link — hide in docs view)

**Sequence within phase:**
1. Add `.md?raw` TypeScript declaration to `src/vite-env.d.ts`
2. Add `view` state + `hashchange` listener + hash-write guard to `App.tsx`
3. Modify `AppHeader.tsx` with `view` prop; hide Copy Link and Reset in docs view
4. Render a `null` placeholder for docs view — confirm routing works end-to-end before building the doc page

### Phase 2: Doc Page Implementation

**Rationale:** With routing solid, the doc page can be built without collision risk. This phase delivers the core milestone value: the research document rendered and navigable in-app.

**Delivers:** Fully rendered research document with prose typography, working tables, functional sidebar anchor links, and correct scroll offsets under the fixed header.

**Uses:** `react-markdown`, `remark-gfm`, `rehype-slug` (with `prefix: 'doc-'`), `@tailwindcss/typography`, Vite `?raw` import

**Implements:** `DocContent`, `useDocSections` hook, `DocLayout` shell, `DocSidebar` (static anchor links, no scroll-spy yet)

**Avoids:** Pitfall 3 (re-parse — module-level constant for both Markdown string and `components` object), Pitfall 5 (scroll-margin-top — add to heading overrides at initial implementation)

**Sequence within phase:**
1. Install four packages
2. Build `useDocSections` hook; verify against raw Markdown string
3. Build `DocContent` with ReactMarkdown, GFM plugin, rehype-slug, prose classes, heading overrides
4. Build `DocSidebar` with static anchor links
5. Build `DocLayout` two-column shell; wire into App.tsx replacing the placeholder
6. Verify heading IDs match sidebar `href` values end-to-end

### Phase 3: Sidebar Polish

**Rationale:** The doc is readable and navigable after Phase 2. This phase upgrades sidebar navigation from functional to polished: scroll-spy active highlighting, sidebar auto-scroll, smooth scroll, and responsive collapse.

**Delivers:** Active section highlighted in sidebar as user scrolls; sidebar auto-scrolls to keep active item visible; smooth scroll on anchor click; sidebar collapses on narrow viewports.

**Implements:** IntersectionObserver scroll-spy in `DocSidebar`, `scrollIntoView` auto-scroll on active section change, `scroll-behavior: smooth`, responsive breakpoint (Tailwind `hidden lg:block`)

**Avoids:** Pitfall 4 (IntersectionObserver flicker — implement map-based approach with `rootMargin` from the start, not a naive per-entry setter)

### Phase Ordering Rationale

- Phase 1 before Phase 2: The routing discriminator is the integration spine. Any Markdown rendering built before the hash-write guard is in place risks corrupting navigation state.
- rehype-slug `prefix: 'doc-'` confirmed in Phase 1: The sidebar `href` values in Phase 2 must match the heading IDs. Setting the prefix in Phase 1 (when routing is being configured) establishes the contract before any headings are rendered.
- Phase 2 before Phase 3: `DocSidebar` must exist as a static component before scroll-spy behavior can be layered on. Active highlighting has no value without working anchor links.

### Research Flags

Phases with standard patterns (no additional research-phase needed):
- **Phase 1:** Hash discrimination pattern is deterministic from reading `src/App.tsx` and `src/lib/url-state.ts`; base64url alphabet is formally specified (RFC 4648); implementation approach is fully documented in ARCHITECTURE.md with code examples
- **Phase 2:** react-markdown, remark-gfm, rehype-slug, and @tailwindcss/typography all have official documentation and verified version compatibility; Vite `?raw` import is documented and confirmed
- **Phase 3:** IntersectionObserver scroll-spy has well-documented patterns (CSS-Tricks, MDN, LogRocket); map-based approach is established community best practice with code examples in PITFALLS.md

No phase requires a `/gsd:research-phase` before implementation can begin. All integration points are resolved.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All four package versions verified against npm registry on 2026-03-24; Tailwind v4 compatibility verified against tailwindcss-typography release notes; Vite `?raw` import confirmed in official docs |
| Features | HIGH | Table stakes derived from analogous tools (Docusaurus, VitePress, GitHub Markdown rendering) and direct analysis of the 45KB research doc content; P1/P2/P3 priorities based on direct impact analysis |
| Architecture | HIGH | Integration points are deterministic from reading the existing codebase — no inferences, only code analysis of `App.tsx`, `url-state.ts`, `AppHeader.tsx`; base64url alphabet (RFC 4648) confirms disjoint hash namespaces |
| Pitfalls | HIGH | Core hash collision pitfall directly observable in existing code; Markdown rendering pitfalls sourced from react-markdown GitHub issues; IntersectionObserver pitfalls from MDN and CSS-Tricks |

**Overall confidence:** HIGH

### Gaps to Address

- **Sidebar auto-scroll timing:** `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` on the active sidebar item is the recommended approach, but the exact timing (synchronous with state update vs. deferred in a `useEffect`) needs to be validated during Phase 3 to avoid scroll conflicts between sidebar auto-scroll and the main document scroll.
- **Docs-to-calculator transition flash:** When navigating from docs back to calculator, the hash-write effect re-encodes state after a 300ms debounce. There is a brief window where the hash is empty. This is likely imperceptible but should be verified during Phase 1 to rule out any flash of default state.

## Sources

### Primary (HIGH confidence)

- npm registry (`npm info [package] version`) — react-markdown@10.1.0, remark-gfm@4.0.1, rehype-slug@6.0.0, rehype-autolink-headings@7.1.0, @tailwindcss/typography@0.5.19 all verified
- GitHub tailwindlabs/tailwindcss-typography releases — v0.5.15+ Tailwind v4 support via `@plugin` directive confirmed
- Vite documentation: https://vite.dev/guide/assets — `?raw` suffix as built-in static asset handling
- RFC 4648 §5 — base64url alphabet: `A-Z a-z 0-9 - _` (no `/` character, confirming disjoint hash namespace)
- react-markdown GitHub: https://github.com/remarkjs/react-markdown — ESM-only, TypeScript types included in package
- rehype-slug README — `prefix` option and DOM Clobbering warning documented
- MDN: Intersection Observer API — https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- Existing codebase analysis: `src/App.tsx`, `src/lib/url-state.ts`, `src/components/AppHeader.tsx`

### Secondary (MEDIUM confidence)

- WebSearch: "react-markdown vs marked vs remark react 2026" — react-markdown confirmed dominant for React integration
- WebSearch: "hash routing React no react-router 2025" — native `window.location.hash` confirmed viable for simple SPA view-switching
- CSS-Tricks: Table of Contents with IntersectionObserver — map-based active tracking approach
- Strapi: React Markdown Complete Guide 2025 — security and rehype-sanitize recommendations
- LogRocket: Create table of contents with highlighting in React — IntersectionObserver implementation reference

### Tertiary (LOW confidence)

- react-markdown GitHub Issues #899 and #289 — re-render performance issues (confirmed pattern but no precise benchmark for this specific document size)

---
*Research completed: 2026-03-24*
*Ready for roadmap: yes*
