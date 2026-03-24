# Feature Research

**Domain:** In-app Markdown documentation viewer (React SPA, milestone v1.2)
**Researched:** 2026-03-24
**Confidence:** HIGH for table stakes and anti-features (well-established patterns in React doc-viewer ecosystem); MEDIUM for differentiators (inferred from analogous tools: Docusaurus, VitePress, GitHub's rendered Markdown).

---

## Scope Note

This file covers the NEW features being added in milestone v1.2. The existing calculator features (team composition, cost comparison, chart, URL sharing, footer) are already built. Research focuses exclusively on:

- Documentation page (Markdown rendered as HTML in-app)
- Sidebar navigation with section anchors
- Header links switching between calculator and docs views
- Hash-based routing that coexists with the existing URL state mechanism

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features that any user who clicks "Documentation" expects to exist. Missing these makes the doc view feel broken or unfinished.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Markdown rendered as formatted HTML | Raw Markdown text is unacceptable; users expect headings, bold/italic, code blocks, tables, links, blockquotes rendered visually | LOW | Use react-markdown (HIGH confidence: most-used library, >12M weekly npm downloads); avoids dangerouslySetInnerHTML XSS risk unlike `marked` |
| Left sidebar with section links | Any tool with a long document (45KB research doc) needs navigation; users expect to jump to sections, not scroll from the top | MEDIUM | Parse headings from Markdown AST or DOM; render as sticky sidebar; anchor scroll on click |
| Sticky/fixed sidebar while scrolling | Standard behavior in all reference docs (MDN, GitHub, Docusaurus); sidebar disappearing on scroll is jarring | LOW | CSS: `position: sticky; top: 0` on sidebar container |
| Active section highlighting in sidebar | Users expect the sidebar link to highlight as they scroll to that section — Docusaurus, VitePress, and GitHub all do this | MEDIUM | IntersectionObserver on heading elements; update active link state on visibility change |
| Smooth scroll to section on sidebar click | Clicking a section link should scroll smoothly, not jump; this is the expected browser behavior for anchor navigation | LOW | CSS `scroll-behavior: smooth` on html element or JS `scrollIntoView({ behavior: 'smooth' })` |
| Code blocks with monospace styling | The research doc contains formulas and code; raw code rendered as prose is unreadable | LOW | react-markdown's `code` component override; add `bg-muted font-mono` Tailwind classes; optional syntax highlighting via rehype-highlight |
| Table rendering | The research doc has comparison tables; they must render as actual HTML tables, not Markdown pipe syntax | LOW | react-markdown handles tables natively via `remark-gfm` plugin |
| Links that open in new tab | External links in the doc (research citations) should open in a new tab; this is the expected behavior for reference links in docs | LOW | Override react-markdown's `a` component; check if href is external; set `target="_blank" rel="noopener noreferrer"` |
| Navigation between calculator and docs | Users expect a way to get back to the calculator from the docs page; a nav header with both links is standard | LOW | Re-use existing AppHeader; add "Calculator" and "Documentation" nav links or tabs |
| Shared AppHeader and AppFooter | A doc page that lacks the footer or changes the header creates a disorienting shift in branding | LOW | Pass `currentView` prop to AppHeader; render AppFooter below doc content |

### Differentiators (Competitive Advantage)

Features that would make this doc view noticeably better than a plain Markdown render.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Styled with shadcn/ui typography | Research doc was written to support stakeholder presentations; prose styled with the same design system as the calculator (consistent font, spacing, color) reads as one product, not a Markdown dump | LOW | Apply Tailwind `prose` classes from `@tailwindcss/typography` OR override all react-markdown components with shadcn-matched Tailwind classes — no extra library needed if component overrides are used |
| Deep-link to doc sections from calculator | The calculator uses inline "source citation" concepts; a future path would allow clicking a citation to jump to the doc section that explains the formula. Even without that, `#/docs#section-id` deep links let someone share a link to a specific formula section | MEDIUM | Requires URL scheme that encodes both the view (docs) and the section anchor; conflicts with existing hash state must be resolved first |
| Responsive sidebar collapse on narrow viewports | The tool is desktop-first but some users may view on a laptop with reduced width; a sidebar that collapses to a "contents" toggle below 1024px prevents layout breakage | MEDIUM | Tailwind `hidden lg:block` on sidebar; add a "Table of contents" toggle button for narrow widths; shadcn Collapsible or Sheet component works well here |
| Section count / reading-time indicator | The research doc is long (~45KB, 45+ sources); a "N sections, ~X min read" note sets expectations before reading | LOW | Word count regex on markdown string; divide by 200 wpm; display in doc header |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| MDX (Markdown + JSX) | Sounds powerful — embed React components in docs | The research doc is a static Markdown file with no React components embedded; MDX adds a compile step, Vite plugin, and content-build pipeline for zero runtime value here. Over-engineering. | Use react-markdown with remark/rehype plugins; handles everything the doc needs |
| Full text search within docs | "Find a term in the doc" sounds useful | The doc is a single file. Ctrl+F (browser native search) already works on the rendered text. Adding a search UI requires indexing, a search library (FlexSearch, Fuse.js), and UI surface — complexity for a feature the browser provides free. | Document that Ctrl+F works; add it to a future consideration only if the doc grows to multi-page |
| Syntax highlighting for formula code blocks | The formulas in the doc are written in pseudo-code or plain text, not a real language. Highlight.js/Shiki adds 30-100KB to bundle for no visible benefit on non-language content. | Adds bundle weight; code blocks in this doc are plain-text formulas, not real language syntax | Apply monospace + background color only (no language-aware highlighting); revisit only if real code examples are added |
| Client-side Markdown editing | "Edit the doc in-app" | The research doc is source-of-truth content checked into the repo. In-app editing creates a diverged version with no persistence (static SPA, no backend). | Edit the .md file in the repo; rebuild is instant with Vite HMR |
| Multi-page docs routing (separate routes per section) | "Each section should be its own URL" | The doc is one file. Splitting into multiple pages requires a content pipeline, route registration, and a much more complex nav. No benefit for a single research document. | Single page with anchor-based section navigation |
| Right-side "on this page" + left sidebar simultaneously | Some docs show both; seems thorough | Two navbars for one document is excessive at this scale. A single left sidebar covers both concerns. | Left sidebar only; skip the "on this page" right panel |

---

## Feature Dependencies

```
View routing (calculator vs docs)
    └──required by──> Doc page render
                          └──required by──> Sidebar navigation
                                                └──required by──> Active section highlighting (IntersectionObserver)

Hash routing scheme
    └──must coexist with──> Existing URL state (encodeAppState/decodeAppState)
                                └──conflict if──> Both use bare hash for different purposes

AppHeader (existing)
    └──must be extended──> Nav links to switch views
    └──shared by──> Doc page (no new header component needed)

AppFooter (existing)
    └──shared by──> Doc page (no changes needed)

react-markdown
    └──requires plugin──> remark-gfm (for tables and strikethrough in research doc)
    └──optional plugin──> rehype-slug (auto-generates id attributes on headings for anchor linking)
    └──optional plugin──> rehype-autolink-headings (adds # anchor links on hover)
```

### Dependency Notes

- **Hash routing must be resolved before doc page**: The existing system writes all app state to `window.location.hash` on every state change (300ms debounce). A docs route also using the bare hash would immediately collide. The scheme must distinguish `#/docs` (view routing) from `#eyJ...` (encoded app state). This is the highest-risk dependency.
- **rehype-slug is required for anchor navigation**: The sidebar links to `#section-id`; without heading `id` attributes, scrolling to sections requires DOM query hacks. rehype-slug generates these cleanly from heading text.
- **remark-gfm is required for tables**: Standard Markdown does not include table syntax. The research doc uses pipe tables extensively. Without remark-gfm, tables render as raw text.
- **Active highlighting requires IntersectionObserver**: The browser API is available in all modern browsers. No polyfill needed. Implementation is ~30 lines with a hook.

---

## MVP Definition

### Launch With (v1.2)

Minimum viable documentation page — what's needed for a user to read the research doc in-app with reasonable navigation.

- [ ] Hash routing scheme that distinguishes docs view from encoded app state — without this, navigating to docs corrupts the calculator state
- [ ] Doc page component that loads and renders `docs/feature-cost-shared-vs-duplicated.md` via react-markdown — core rendering
- [ ] remark-gfm plugin enabled — required for table rendering (research doc has many tables)
- [ ] rehype-slug plugin enabled — required for sidebar anchor links to work
- [ ] Left sidebar listing all `##` and `###` headings with scroll-to-section on click — navigation for a 45KB document
- [ ] Active section highlighting in sidebar (IntersectionObserver) — expected behavior
- [ ] AppHeader extended with calculator/docs nav links — required for moving between views
- [ ] AppFooter shared on docs page — visual consistency

### Add After Validation (v1.2.x)

- [ ] Sidebar collapse on narrow viewports (Tailwind responsive breakpoint) — add if real usage on non-widescreen is reported
- [ ] Deep links to doc sections (combined view + section in URL) — add if users share doc-specific links

### Future Consideration (v2+)

- [ ] Reading-time / section-count indicator — low value, deferred
- [ ] Syntax highlighting for code blocks — deferred; this doc doesn't need it
- [ ] Multi-page doc structure — deferred unless doc grows substantially

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hash routing scheme (docs vs state) | HIGH | MEDIUM | P1 |
| Doc page Markdown render (react-markdown) | HIGH | LOW | P1 |
| remark-gfm (table support) | HIGH | LOW | P1 |
| rehype-slug (heading IDs for anchors) | HIGH | LOW | P1 |
| Left sidebar with section links | HIGH | MEDIUM | P1 |
| AppHeader nav (calculator / docs toggle) | HIGH | LOW | P1 |
| AppFooter on docs page | MEDIUM | LOW | P1 |
| Active section highlighting | MEDIUM | MEDIUM | P2 |
| Sticky sidebar positioning | MEDIUM | LOW | P2 |
| External links open in new tab | MEDIUM | LOW | P2 |
| Sidebar collapse on narrow viewports | LOW | MEDIUM | P3 |
| Deep links to sections | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch — doc page is unusable or broken without it
- P2: Should have — noticeable UX gap if missing, but doc is readable
- P3: Nice to have — defer until P1 and P2 are stable

---

## Hash Routing Conflict Analysis

This is the most critical architectural constraint for this milestone.

**Current state:** `window.location.hash` contains base64/JSON-encoded app state. Any navigation to a docs view must not trigger the existing hash decoder (`decodeAppState`), which would interpret a routing string as malformed state and silently fall back to defaults.

**Recommended scheme:** Prefix-based discrimination.

| URL | Meaning |
|-----|---------|
| `example.com/#eyJ...` | Calculator view with encoded state (current behavior, unchanged) |
| `example.com/#/docs` | Documentation view, no calculator state |
| `example.com/#/docs#methodology` | (future) Documentation view, scrolled to #methodology section |

The hash decoder checks `if (!raw) return;` and `if (!state) return;` already — a raw value of `/docs` will fail JSON parse and fall back to defaults silently. This is a collision, not an error. The fix is to check the prefix of the hash before passing it to `decodeAppState`:

```typescript
const raw = window.location.hash.slice(1);
if (raw.startsWith('/')) {
  // It's a view route, not encoded state — handle routing
  return;
}
```

This is a LOW-complexity fix with HIGH impact. Must be in Phase 1 of the milestone.

---

## Sources

- react-markdown npm: https://www.npmjs.com/package/react-markdown (12M+ weekly downloads; HIGH confidence)
- react-markdown GitHub: https://github.com/remarkjs/react-markdown
- remark-gfm (GitHub Flavored Markdown plugin): https://github.com/remarkjs/remark-gfm
- rehype-slug (auto heading IDs): https://github.com/rehypejs/rehype-slug
- Table of contents IntersectionObserver pattern: https://blog.logrocket.com/create-table-contents-highlighting-react/
- TanStack Start Rendering Markdown guide: https://tanstack.com/start/latest/docs/framework/react/guide/rendering-markdown
- Strapi react-markdown guide: https://strapi.io/blog/react-markdown-complete-guide-security-styling
- Existing codebase analysis: `/src/lib/url-state.ts`, `/src/App.tsx` (hash encoding/decoding pattern)
- Research doc analyzed: `/docs/feature-cost-shared-vs-duplicated.md` (45KB, tables, code blocks, 45+ sources)

---
*Feature research for: in-app Markdown documentation viewer (v1.2 milestone)*
*Researched: 2026-03-24*
