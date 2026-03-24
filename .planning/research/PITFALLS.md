# Pitfalls Research

**Domain:** Adding in-app Markdown documentation rendering with hash-based routing to an existing React SPA that uses URL hash for state encoding
**Researched:** 2026-03-24
**Confidence:** HIGH — core hash conflict pitfall is directly observable in the existing codebase; Markdown rendering pitfalls verified via official react-markdown docs and community issues; IntersectionObserver pitfalls from MDN and CSS-Tricks

---

## Critical Pitfalls

### Pitfall 1: Hash Namespace Collision — Doc Router Overwrites Calculator State

**What goes wrong:**
The existing `App.tsx` reads `window.location.hash` on mount to restore shared calculator state (line 64: `const raw = window.location.hash.slice(1)`). It also writes back to the hash with a 300ms debounce whenever inputs change (lines 77–88). If the doc routing feature uses the same hash space — e.g., `#/docs` or `#/docs#section-2` — the app's mount effect will attempt to decode `/docs` or `/docs#section-2` as a base64-encoded calculator state. `decodeAppState` will fail (the try/catch returns null), so state silently falls to defaults. More critically: once a user visits the doc page and then returns to the calculator, the debounced hash-write effect fires and overwrites the doc route with encoded calculator state, making browser back navigation break.

**Why it happens:**
The hash write effect in `App.tsx` has no guard — it fires on every state change regardless of which "view" is active. The router and the state encoder both assume full ownership of `window.location.hash`.

**How to avoid:**
Design a top-level view discriminator that owns the hash namespace before either the router or state encoder touches it. One proven approach:
- Reserve a prefix: calculator state hashes always start with a known character (e.g., the base64 payload already starts with `e` for `{"v":1,...}` encoded) while doc routes start with a literal `/docs` prefix. The mount effect in `App.tsx` checks `raw.startsWith('/docs')` first and skips state restoration if true.
- The hash-write effect adds a guard: skip the write when the current view is `docs`.
- A single `useHashRouter` hook centralizes all `window.location.hash` reads and writes, so no component writes the hash without going through the discriminator.

Alternatively, abandon hash routing for docs entirely and use a query parameter (`?view=docs`) or path routing. Since this is a static build, `?view=docs` works without server config changes and avoids the namespace problem completely.

**Warning signs:**
- Clicking "Docs" in the header and then clicking browser back returns to the calculator with all inputs reset to defaults.
- Visiting a shared calculator URL that happens to contain a long base64 string causes a brief flash of the docs view before the app realizes it should be the calculator.
- The URL in the address bar shows encoded calculator state immediately after navigating away from the docs page.

**Phase to address:** Phase 1 (routing foundation) — the namespace strategy must be decided and implemented before any other doc feature is built. Retrofitting this after sidebar navigation and scroll sync are implemented is a rewrite.

---

### Pitfall 2: `rehype-slug` Heading IDs Collide with Hash State on Direct URL Load

**What goes wrong:**
When `rehype-slug` generates heading IDs (e.g., `#cost-models`, `#7-1-shared-cost`), clicking an anchor link in the sidebar sets `window.location.hash` to that heading ID. If the user copies this URL and shares it, the next visitor loads the page with `window.location.hash = '#cost-models'`. The existing mount effect in `App.tsx` will attempt `decodeAppState('cost-models')` — the base64 decode will throw or return garbage, the try/catch returns null, and the app silently defaults. This is survivable, but the user lands on the calculator view instead of the docs section they expected.

More dangerously: if `rehype-slug` generates an ID that happens to be valid base64 (unlikely but possible with short section names), the calculator could load with corrupted state values that produce nonsensical output without any visible error.

**Why it happens:**
`rehype-slug` doesn't know about the app's hash namespace. It generates IDs from heading text, and those IDs become plain URL fragments. Without coordination, two systems write to and read from the same fragment space.

**How to avoid:**
Prefix all doc heading IDs with a namespace that the calculator's `decodeAppState` will always reject cleanly. Use `rehype-slug` with `{ prefix: 'doc-' }` option. The mount effect already handles unknown hash formats gracefully (returns null from `decodeAppState`), so as long as all doc heading IDs start with `doc-`, any such URL load will fall through to the docs view rather than the calculator.

**Warning signs:**
- A heading ID in the rendered doc exactly matches a valid base64 string.
- Clicking a sidebar anchor link and refreshing the page lands on the calculator, not the doc section.
- Any heading ID without a namespace prefix that would survive `atob()` without throwing.

**Phase to address:** Phase 1 (routing foundation) — add the `prefix` option to `rehype-slug` at initial integration, not after.

---

### Pitfall 3: `react-markdown` Re-parses the Full Document on Every Render

**What goes wrong:**
The research document (`docs/feature-cost-shared-vs-duplicated.md`) is large — 45+ cited sources implies substantial prose. `react-markdown` parses the entire Markdown string into an AST on every render of the component that owns it. If the doc page component re-renders for any reason unrelated to content (parent state changes, context updates, or accidental prop instability), the full parse runs again on the main thread, potentially causing a visible stutter or layout shift.

In this specific app, `App.tsx` has a debounced hash-write effect. If the doc page is rendered inside the same component tree as `App.tsx`'s state, every debounced hash update could trigger a re-render that re-parses the Markdown.

**Why it happens:**
`react-markdown` does not memoize its parse result internally. Developers who put the `<ReactMarkdown>` component inside a frequently re-rendering parent don't notice the issue until the document is large enough or the re-render frequency is high enough.

**How to avoid:**
- Import the Markdown file content as a module-level constant or load it once with a static import (Vite supports `import docContent from './docs/research.md?raw'`). This ensures the string reference is stable.
- Wrap the `<ReactMarkdown>` call in `React.memo` or move it to a component that is isolated from the calculator state tree.
- Keep the docs view and the calculator view as separate top-level components that are conditionally rendered — when docs are shown, the calculator state effects are idle. This isolation naturally prevents the cross-contamination re-render.

**Warning signs:**
- Browser Performance tab shows repeated long tasks (>50ms) while scrolling the docs page when no content is changing.
- React DevTools Profiler shows the Markdown component re-rendering on every keystroke in a calculator input field.
- The document content is inline as a JSX string prop rather than a stable module-level reference.

**Phase to address:** Phase 2 (doc page implementation) — use the stable `?raw` import pattern from the start.

---

### Pitfall 4: IntersectionObserver Sidebar Highlight Flickers at Section Boundaries

**What goes wrong:**
When multiple document sections are near the viewport boundary simultaneously (e.g., at the end of a short section and the start of the next), the IntersectionObserver can fire for both sections nearly simultaneously with contradictory intersection states. The sidebar active state flickers between two entries, producing a visible flash of the highlight jumping back and forth.

This is particularly likely in a document with short sections (individual formula definitions, bullet-point lists) — which a research document with many numbered subsections will have.

**Why it happens:**
A naive implementation uses a single observer with one threshold (e.g., `0.5`) and sets `activeSection` to whichever entry `.isIntersecting`. When sections are short, `isIntersecting` can become true for the next section before it becomes false for the previous one, depending on scroll direction and speed.

**How to avoid:**
Use a map-based approach instead of a single active-entry setter:
1. Maintain a `visibleSections` Map from section ID to its intersection ratio.
2. In the observer callback, update the map for all entries in the batch.
3. Derive the active section as the highest-ratio entry from the map — or the topmost visible section by DOM position.
4. Set state once after processing the full batch, not once per entry.

Additionally, use a `rootMargin` that biases toward the top of the viewport (e.g., `'-10% 0px -80% 0px'`) so only the section most prominently in view counts as active.

**Warning signs:**
- Sidebar highlight visibly flickers when scrolling at normal speed through short sections.
- `activeSection` state changes more than once per scroll tick in React DevTools.
- The observer callback calls `setActiveSection` inside a per-entry loop rather than after processing all entries.

**Phase to address:** Phase 3 (sidebar navigation) — implement the map-based approach from the start rather than patching the naive approach.

---

### Pitfall 5: Fixed Header Obscures the Target Section on Anchor Navigation

**What goes wrong:**
The existing `AppHeader` is a fixed `<header>` element with `border-b border-border` styling. When a sidebar anchor link targets a heading ID (e.g., `#doc-cost-models`), the browser's default scroll behavior positions the heading flush with the top of the viewport — underneath the fixed header. The section title is hidden by the header, and the content appears to start mid-paragraph.

**Why it happens:**
Browsers implement anchor scrolling by aligning the target element's top edge to the viewport top. Fixed headers intercept this space. CSS `scroll-margin-top` was designed to solve this but must be applied to every heading element.

**How to avoid:**
Apply `scroll-margin-top` to all headings in the Markdown output. Since `react-markdown` renders headings through component overrides, add a `components` prop that sets `scroll-margin-top` to the approximate height of the fixed header (measured from the rendered DOM, typically `~57px` for a `py-3` header with a `text-xl` heading). Use a Tailwind class like `[scroll-margin-top:4rem]` applied via the heading component override, or set it in CSS as `h1, h2, h3, h4, h5, h6 { scroll-margin-top: 4rem; }` scoped to the doc content container.

**Warning signs:**
- Clicking any sidebar anchor link hides the first line of that section under the header.
- The effect is worst for sections that follow a long previous section (the scroll jump is large).
- Testing only with sections near the bottom of a short document (scroll offset is small) misses this bug.

**Phase to address:** Phase 2 (doc page implementation) — add `scroll-margin-top` to heading component overrides at initial implementation. Easy to add but invisible in testing if you only test with a short document.

---

### Pitfall 6: Copy Link Button Captures Doc Anchor Fragment as Calculator Share URL

**What goes wrong:**
The existing "Copy Link" button in `AppHeader` calls `navigator.clipboard.writeText(window.location.href)`. When the user is on the docs page and has scrolled to a section (causing the hash to be `#doc-cost-models`), clicking "Copy Link" captures a URL that contains the doc anchor, not a calculator state payload. Pasting this URL shares a broken link — the recipient's page will try to decode `doc-cost-models` as calculator state, fail silently, and show the calculator at defaults with no indication that the shared link was a doc anchor.

The inverse problem: if "Copy Link" is shown on the docs page at all, users may think they are sharing a link to the document section, but the AppHeader was designed to share calculator scenarios.

**Why it happens:**
`AppHeader` currently receives only an `onReset` prop. It has no awareness of which view is active. The "Copy Link" behavior was designed exclusively for calculator state and will not work correctly when the hash contains a doc anchor.

**How to avoid:**
One of the following approaches:
1. **Hide or disable "Copy Link" on the docs page.** Pass a `showCopyLink` prop (or `activeView` prop) to `AppHeader` and conditionally render the button only on the calculator view.
2. **Separate header concerns.** Use a shared `AppHeader` for branding/nav, but a separate `CalculatorHeader` subcomponent that holds the calculator-specific actions (Copy Link, Reset All).
3. **Make Copy Link view-aware.** The header detects the active view and changes button label and behavior — "Copy Link" on calculator, "Copy Section Link" on docs (which would be a shareable doc anchor URL). This is the most feature-complete approach but adds complexity.

**Warning signs:**
- AppHeader is rendered identically in both views with no props diff.
- "Copy Link" is visible and enabled while on the docs page.
- A shared link from the docs page loads the calculator at defaults for the recipient.

**Phase to address:** Phase 2 (doc page implementation) — decide on approach before AppHeader is used in the docs layout. Approach 1 (hide button) is acceptable for MVP.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Use `dangerouslySetInnerHTML` with a raw Markdown-to-HTML converter instead of `react-markdown` | Avoid adding a dependency | No component overrides possible (scroll-margin-top, custom heading anchors), XSS risk if content ever changes origin | Never — the doc content is static but the precedent is unsafe |
| Inline Markdown content as a JSX string literal | Avoid Vite `?raw` import syntax | Re-parsing on every render, large component file, can't lazy-load content | Never — use module-level import |
| Use a single `useState` for `activeSection` updated per-observer-entry | Simple first implementation | Sidebar flicker at section boundaries (Pitfall 4) | Only if document has no sections shorter than one viewport height |
| No `scroll-margin-top` on headings — rely on users scrolling manually | No extra CSS | Every anchor click hides content under the header | Never — `scroll-margin-top` is one line of CSS |
| Don't namespace heading IDs — let `rehype-slug` generate plain IDs | Simpler config | Hash collision with calculator state on direct URL load (Pitfall 2) | Never for this specific app |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `rehype-slug` | Install without setting the `prefix` option | Always set `prefix: 'doc-'` to namespace all generated IDs away from the calculator's hash namespace |
| `react-markdown` `components` prop | Pass a new object literal inline: `components={{ h1: ... }}` | Extract to a module-level constant so the reference is stable across renders and memoization works |
| `react-markdown` with `rehype-raw` | Add `rehype-raw` to enable HTML in Markdown without adding `rehype-sanitize` | The research doc is static and trusted, but establish the pattern of not using `rehype-raw` at all — the doc content does not require raw HTML |
| Vite `?raw` import for Markdown files | Use a dynamic `fetch()` to load the file at runtime | Use `import docContent from './research.md?raw'` — Vite bundles the content at build time, no network request, works offline, no loading state needed |
| `window.location.hash` hashchange event | Listen to `hashchange` to detect navigation between views | Use `popstate` or a custom event — React Router's hash implementation has a documented issue where `hashchange` does not fire for programmatic navigation |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| `ReactMarkdown` inside a component that re-renders on every calculator input change | CPU spike on every keystroke in the calculator while docs are mounted | Render docs view and calculator view as mutually exclusive top-level branches; don't mount both simultaneously | Immediately if the doc component is inside `App.tsx`'s render tree |
| Creating `components` prop object inline inside `ReactMarkdown`'s parent render | `react-markdown` re-processes component overrides on every render, defeating memoization | Define `components` as a module-level constant outside any React function | With documents >5,000 words — noticeable jank on scroll |
| Observing every heading element individually with `IntersectionObserver` | New observer instance created on every doc mount, memory grows if component mounts/unmounts | Create one observer, observe all targets, disconnect in cleanup | Not a threshold issue — happens immediately on every doc page visit |
| Loading the research Markdown file via `fetch()` instead of `?raw` import | Loading spinner on first visit, FOUC (flash of unstyled content), fails if deployed to a path with CORS restrictions | Use `import content from './research.md?raw'` — zero-latency, bundled | On any deployment where the static file path differs from the import path |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Using `rehype-raw` without `rehype-sanitize` | Any raw HTML in the research doc (e.g., `<script>`) would execute in the browser | Do not add `rehype-raw` to the plugin list — the research document does not contain raw HTML that requires it |
| Generating heading IDs without a prefix | DOM Clobbering: a heading named `getElementById` or `location` would shadow a global property | Use `rehype-slug` with `prefix: 'doc-'`; this also prevents the hash namespace collision described in Pitfall 2 |
| Trusting `window.location.hash` input without bounds in `decodeAppState` | A crafted URL with a very large base64 payload could cause a memory spike in `atob()` or `JSON.parse()` | Already handled: `decodeAppState` wraps in try/catch and validates `parsed.v === 1`; the existing defense is sufficient |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No visual indication of active section in sidebar | Users lose their place when scrolling a long document; sidebar feels decorative | Implement IntersectionObserver-based active highlight from the start, not as a polish pass |
| Sidebar scrolls independently but doesn't auto-scroll to keep active item visible | When reading section 7.4, the sidebar highlight is active but out of the sidebar's visible scroll area | Use `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` on the active sidebar item whenever the active section changes |
| Header nav link to "Docs" has no back link or breadcrumb inside the doc page | Users have to find the header to navigate back to the calculator; mobile users may not notice | Ensure the AppHeader nav is visible at all times in the doc view and includes a clearly labeled "Calculator" link |
| Anchor links in the sidebar cause full-page scroll jumps with no smooth scroll | Disorienting on long documents | Set `scroll-behavior: smooth` on the doc content container or use `element.scrollIntoView({ behavior: 'smooth' })` in the anchor click handler |
| Code blocks or tables in the research doc overflow on narrow viewports | Content is unreadable on tablet/laptop when the sidebar is open | Apply `overflow-x: auto` to the Markdown content container; wrap code blocks in a scrollable container via the `components` prop |

---

## "Looks Done But Isn't" Checklist

- [ ] **Hash routing:** Verify that visiting a calculator shared URL still restores state correctly when the docs feature is deployed — confirm that `decodeAppState` is not called with a doc route string.
- [ ] **Heading anchors:** Confirm that all sidebar anchor links use the `doc-` prefix matching the `rehype-slug` configuration — a mismatch means clicking a sidebar item scrolls nowhere.
- [ ] **Copy Link on docs page:** Verify that "Copy Link" is either hidden, disabled, or correctly redirects to the calculator URL — not the current doc anchor fragment.
- [ ] **scroll-margin-top:** Test by clicking a sidebar link to a section that is currently below the fold — the heading should appear below the fixed header, not behind it.
- [ ] **IntersectionObserver cleanup:** Confirm that navigating from docs back to calculator and back to docs multiple times does not accumulate orphaned observers (check in Chrome DevTools Performance Monitor > DOM Nodes).
- [ ] **Sidebar auto-scroll:** Test with a section near the bottom of the sidebar list — clicking that section's anchor link should scroll the sidebar to show the active item.
- [ ] **Vite build:** Run `npm run build` and verify the Markdown content is included in the bundle, not expected as a runtime fetch (check that no 404 appears in the built output).
- [ ] **Mobile layout:** With the sidebar open on a narrow viewport, verify the doc content is still readable and the sidebar does not overlap the close button of the header.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Hash namespace collision discovered after sidebar is built | HIGH | Redesign the top-level routing discriminator, update all hash reads/writes, retest all shared URL scenarios end-to-end |
| Heading IDs without prefix causing hash collisions | MEDIUM | Update `rehype-slug` config to add prefix, update all sidebar anchor `href` values, verify no existing shared URLs in the wild use those IDs |
| React-markdown re-render performance discovered post-launch | MEDIUM | Extract doc component to a lazy-loaded route, add `React.memo`, move `components` constant to module level — each step is independent |
| IntersectionObserver flicker discovered post-launch | LOW | Replace per-entry `setActiveSection` with map-based approach; isolated change with no API impact |
| Fixed header obscuring headings discovered in QA | LOW | Add `scroll-margin-top` to heading component overrides; one CSS change |
| Copy Link sharing broken doc anchor URLs | LOW | Add `activeView` prop to AppHeader and conditionally hide the button; one prop addition, one conditional render |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Hash namespace collision (Pitfall 1) | Phase 1: Routing foundation | Round-trip test: encode calculator state, navigate to docs, navigate back, verify state is restored |
| Heading IDs collide with hash state (Pitfall 2) | Phase 1: Routing foundation | Confirm `rehype-slug` prefix option is set before any heading is rendered |
| React-markdown re-parse on every render (Pitfall 3) | Phase 2: Doc page implementation | React DevTools Profiler: Markdown component renders exactly once per doc page mount |
| IntersectionObserver sidebar flicker (Pitfall 4) | Phase 3: Sidebar navigation | Manual test: scroll quickly through 3+ consecutive short sections; no visible sidebar flicker |
| Fixed header obscures anchor targets (Pitfall 5) | Phase 2: Doc page implementation | Click 5 different sidebar links; each heading appears fully below the header |
| Copy Link captures doc anchor (Pitfall 6) | Phase 2: Doc page implementation | On docs page: "Copy Link" is absent or shows correct behavior; verify by checking rendered AppHeader props |

---

## Sources

- [react-markdown GitHub — Issue #899: Code rerendering unnecessarily](https://github.com/remarkjs/react-markdown/issues/899)
- [react-markdown GitHub — Issue #289: Performance issues](https://github.com/remarkjs/react-markdown/issues/289)
- [remarkjs Discussion #1027: Improving performance with very large texts — virtualization](https://github.com/orgs/remarkjs/discussions/1027)
- [rehype-slug README — prefix option and DOM Clobbering warning](https://github.com/rehypejs/rehype-slug/blob/main/readme.md)
- [remark-slug — deprecated, now replaced by rehype-slug](https://github.com/remarkjs/remark-slug)
- [Strapi: React Markdown Complete Guide 2025 — security and rehype-sanitize](https://strapi.io/blog/react-markdown-complete-guide-security-styling)
- [CSS-Tricks: Table of Contents with IntersectionObserver](https://css-tricks.com/table-of-contents-with-intersectionobserver/)
- [CSS-Tricks: Sticky Table of Contents with Scrolling Active States](https://css-tricks.com/sticky-table-of-contents-with-scrolling-active-states/)
- [Thomas Ledoux: Highlighting navigation items on scroll in React with IntersectionObserver](https://www.thomasledoux.be/blog/highlighting-navigation-items-on-scroll)
- [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [React Router Issue #11220: hashchange event not triggered on navigate() with createHashRouter](https://github.com/remix-run/react-router/issues/11220)
- [Medium: Pitfall of Potential Stored XSS in React-Markdown Editors](https://medium.com/@brian3814/pitfall-of-potential-xss-in-markdown-editors-1d9e0d2df93a)
- [Existing codebase: src/lib/url-state.ts — hash encode/decode implementation](../../../src/lib/url-state.ts)
- [Existing codebase: src/App.tsx — hash read on mount (line 64) and debounced hash write (lines 77–88)](../../../src/App.tsx)

---
*Pitfalls research for: Adding Markdown doc rendering with hash routing to an existing React SPA with hash-based state encoding*
*Researched: 2026-03-24*
