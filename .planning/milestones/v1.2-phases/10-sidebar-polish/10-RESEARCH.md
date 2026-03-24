# Phase 10: Sidebar Polish - Research

**Researched:** 2026-03-24
**Domain:** IntersectionObserver scroll-spy, sidebar active-link highlighting, sidebar auto-scroll
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

None — all implementation decisions deferred to Claude's discretion.

### Claude's Discretion

- **Active link styling** — How the currently-visible section is visually distinguished from other sidebar links (color, weight, border, background, or combination)
- **Heading level behavior** — Whether h2 and h3 headings are independently tracked as active sections, or only h2 top-level sections
- **Sidebar auto-scroll** — Animation style (smooth vs instant) and scroll positioning (center, nearest, start) when bringing the active link into view
- **IntersectionObserver configuration** — rootMargin, threshold, and ratio-based selection strategy for determining the active section

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NAV-02 | User can see the currently visible section highlighted in the sidebar as they scroll | IntersectionObserver Map<id, ratio> pattern; `activeId` state prop on DocsSidebar |
| NAV-03 | Sidebar auto-scrolls to keep the active section link visible when the document is long | `scrollIntoView` on the active `<a>` element inside the overflow-y-auto sidebar container |
</phase_requirements>

## Summary

Phase 10 is a focused UI-behavior phase: two features (active-link highlight + sidebar auto-scroll) built on a single IntersectionObserver scroll-spy hook that is already architecturally anticipated by the codebase. The STATE.md entry from Phase 9 implementation explicitly locks the scroll-spy approach: `Map<id, ratio>` with `rootMargin: '-10% 0px -80% 0px'`. The `DocsSidebar` component already has all heading IDs prefixed `doc-` and renders anchor links; it only needs an `activeId: string` prop wired in. The `DocsPage` layout's aside already uses `overflow-y-auto` which makes `scrollIntoView` on the active link element work correctly within the sidebar container.

No new dependencies are required. The implementation is pure React + browser APIs (IntersectionObserver, scrollIntoView). All discretion areas have clear standard patterns used by production doc sites (Docusaurus, VitePress, Next.js docs).

**Primary recommendation:** Extract scroll-spy into a `useActiveSection(ids: string[])` custom hook, pass `activeId` to `DocsSidebar`, and call `el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })` on the active sidebar `<a>` ref inside a `useEffect`.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React (useState, useEffect, useRef, useMemo) | 19 (already installed) | State management, DOM observation lifecycle, ref capture | Already in project; no additions needed |
| IntersectionObserver API | Browser native | Detect which headings are in the viewport | Standard browser API, no polyfill needed for modern targets |
| Element.scrollIntoView | Browser native | Scroll active sidebar link into view | Standard browser API with `block: 'nearest'` to avoid jumping when already visible |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None required | — | — | — |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| IntersectionObserver | scroll event + getBoundingClientRect | IO is more performant (off-main-thread), less code; scroll events risk jank |
| `scrollIntoView({ block: 'nearest' })` | Manual `scrollTop` arithmetic | `nearest` is zero-jump when already visible; manual math is fragile |
| Custom hook `useActiveSection` | Logic inline in DocsPage | Hook is testable, reusable; inline creates a 100-line component |

**Installation:** No new packages. All required APIs are native browser + existing React 19.

## Architecture Patterns

### Recommended Project Structure

No new files or folders beyond one custom hook:

```
src/
├── hooks/
│   └── useActiveSection.ts   # NEW — IntersectionObserver scroll-spy
├── components/
│   ├── DocsPage.tsx           # MODIFIED — owns activeId state, passes to DocsSidebar
│   └── DocsSidebar.tsx        # MODIFIED — accepts activeId prop, applies highlight, scrolls to active link
```

### Pattern 1: Map<id, ratio> IntersectionObserver Hook

**What:** A single IntersectionObserver observes all `doc-*` heading elements. Each intersection update writes the element's `intersectionRatio` into a `Map<string, number>`. After every update, the heading with the highest ratio becomes `activeId`.

**When to use:** Any scroll-spy where multiple sections can be partially in view simultaneously and you want stable, flicker-free active tracking.

**Example:**
```typescript
// src/hooks/useActiveSection.ts
import { useEffect, useRef, useState } from 'react';

export function useActiveSection(ids: string[]): string {
  const [activeId, setActiveId] = useState<string>('');
  const ratioMap = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratioMap.current.set(entry.target.id, entry.intersectionRatio);
        }
        // Pick the heading with the highest visible ratio
        let best = '';
        let bestRatio = 0;
        for (const [id, ratio] of ratioMap.current) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActiveId(best);
      },
      {
        // Viewport: ignore top 10% (fixed header) and bottom 80%
        // This means only headings in the top 10%-20% zone are "active"
        rootMargin: '-10% 0px -80% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
```

### Pattern 2: DocsSidebar Active-Link Highlight

**What:** Accept `activeId` as prop. Apply visually distinct Tailwind classes to the matching link. Use `useRef` map keyed by heading ID to obtain stable DOM refs for scrollIntoView.

**When to use:** Any sidebar component that needs to reflect scroll position.

**Example:**
```typescript
// DocsSidebar.tsx — relevant changes
interface DocsSidebarProps {
  markdown: string;
  activeId: string;  // NEW
}

// Inside component, add ref map:
const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

// Active link scroll effect:
useEffect(() => {
  if (!activeId) return;
  const el = linkRefs.current.get(activeId);
  el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}, [activeId]);

// In the <a> render, set ref and apply conditional classes:
<a
  key={entry.id}
  ref={(node) => {
    if (node) linkRefs.current.set(entry.id, node);
    else linkRefs.current.delete(entry.id);
  }}
  className={
    entry.id === activeId
      ? (entry.level === 2
          ? "block py-1.5 text-sm font-medium text-foreground transition-colors"
          : "block py-1.5 text-sm font-medium text-foreground transition-colors pl-4")
      : (entry.level === 2
          ? "block py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          : "block py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors pl-4")
  }
  ...
>
```

### Pattern 3: DocsPage Wiring

**What:** DocsPage extracts heading IDs from the sidebar's heading list, passes them to `useActiveSection`, then passes `activeId` down to `DocsSidebar`.

**When to use:** Parent layout owns the intersection state; sidebar is a presentational child.

**Example:**
```typescript
// DocsPage.tsx — relevant additions
import { useMemo } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import { extractHeadingIds } from './DocsSidebar'; // exported helper, or inline

// In component:
const headingIds = useMemo(
  () => extractHeadings(researchMd).map((h) => h.id),
  []  // researchMd is module-level constant, never changes
);
const activeId = useActiveSection(headingIds);

// Pass to sidebar:
<DocsSidebar markdown={researchMd} activeId={activeId} />
```

Note: `extractHeadings` and `toSlug` must be exported from DocsSidebar.tsx (or moved to a shared util) so DocsPage can call them without duplicating logic.

### Anti-Patterns to Avoid

- **Scroll event listener for active tracking:** Causes main-thread jank on every scroll frame. IntersectionObserver fires off-thread. Use IO only.
- **rootMargin: '0px':** Without top margin, a heading is "active" as soon as it enters the very bottom of the viewport — section feels active before the user reaches it. The `'-10% 0px -80% 0px'` setting from STATE.md is the correct configuration.
- **`scrollIntoView({ block: 'start' })` in sidebar:** When the active link is near the middle of the sidebar, `start` causes the sidebar to scroll so the active link sits at the very top, which can be visually jarring. `block: 'nearest'` only scrolls when the link is outside the visible area — no unnecessary jump.
- **Re-creating the Observer on every render:** IDs are stable (computed from static markdown). Memoize the `ids` array passed to the hook so the `useEffect` dep doesn't fire every render.
- **Inline ref functions creating new function instances:** The `ref` callback pattern shown above is stable when using a persistent `Map` — avoids triggering unnecessary effects.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll position detection | Polling `scrollTop` or `getBoundingClientRect` in a scroll handler | IntersectionObserver | IO fires asynchronously off main thread; scroll handlers fire synchronously every frame and must be throttled manually |
| "Is element in sidebar viewport?" | Manual sidebar height calculation | `scrollIntoView({ block: 'nearest' })` | Browser implements the containment check natively; `nearest` does nothing if already visible |
| Heading ID list | Duplicating extraction logic in DocsPage | Export `extractHeadings` from DocsSidebar | Single source of truth for `doc-` prefix and slug algorithm |

**Key insight:** Both NAV-02 and NAV-03 are solved by two well-understood browser APIs (IntersectionObserver + scrollIntoView). The entire feature can be implemented in under 80 lines of new code across three files.

## Common Pitfalls

### Pitfall 1: rootMargin % Values Are Viewport-Relative, Not Container-Relative

**What goes wrong:** Heading becomes "active" at unexpected scroll positions — too early or too late.
**Why it happens:** `rootMargin` percentages are relative to the root viewport dimensions. `'-80%'` bottom margin means the observer fires only for headings in the top 20% of the viewport — exactly what keeps the active section aligned with what the user is reading.
**How to avoid:** Use the pre-validated `'-10% 0px -80% 0px'` from STATE.md. Do not change without testing with the actual doc length.
**Warning signs:** Active link jumps to the next section before user sees it, or lags behind by a full screen.

### Pitfall 2: Observer Attaches Before DOM Elements Exist

**What goes wrong:** `document.getElementById(id)` returns null for some headings; those headings are never observed and never become active.
**Why it happens:** If the `useEffect` runs before ReactMarkdown finishes rendering all headings, the elements don't exist yet. In practice with this project's synchronous render (static markdown, no async data loading), this is unlikely — but DOM timing can be fragile.
**How to avoid:** If any heading IDs are missing, add a small `requestAnimationFrame` delay in the observer setup, or observe the parent `<article>` element for a MutationObserver trigger before setting up IO. In practice, `useEffect` runs after paint, which is sufficient here.
**Warning signs:** Some sections never highlight in the sidebar no matter how far you scroll.

### Pitfall 3: sidebar scrollIntoView Scrolls the Page, Not the Sidebar

**What goes wrong:** Calling `el.scrollIntoView()` on a sidebar link scrolls the entire document instead of the sidebar overflow container.
**Why it happens:** `scrollIntoView` scrolls the nearest scrollable ancestor. The `aside > div.sticky` wrapper has `overflow-y-auto` — as long as the `<a>` element is a descendant of that overflow container, the browser will scroll the container, not the page.
**How to avoid:** Confirm the `linkRefs` map stores refs to `<a>` elements that are children of the `.overflow-y-auto` div. The existing DocsPage layout already has this structure — no changes needed to the outer layout.
**Warning signs:** Clicking a sidebar link or auto-scroll causes the main document to jump instead of the sidebar panel scrolling.

### Pitfall 4: Stale `ids` Array Reference Triggers Observer Re-Setup

**What goes wrong:** `useActiveSection` tears down and re-creates the IntersectionObserver on every render, causing flickering or missed observations during the re-attach window.
**Why it happens:** If `headingIds` is computed with `useMemo` but the dep array includes `researchMd` (a module-level constant), React still creates a new array reference on mount if memoization is bypassed. Or if `ids` is created inline without memo, it's a new reference every render.
**How to avoid:** Memoize `headingIds` with `useMemo(() => ..., [])` (empty deps because `researchMd` never changes at runtime). Inside the hook, use `ids` as a dep — a stable reference means no unnecessary effect re-runs.
**Warning signs:** Observer fires `disconnect()` and re-attaches frequently (visible in browser DevTools Performance panel as repeated IO observer creation).

### Pitfall 5: No Active State on Initial Load (Above-the-Fold First Section)

**What goes wrong:** Page loads at the top; first section heading is visible but no link is highlighted until the user scrolls past the first threshold.
**Why it happens:** IntersectionObserver fires its callback for all observed elements on initial observation — but only if they intersect at that moment. With `rootMargin: '-10% 0px -80% 0px'`, a heading at the very top of the page may fall outside the intersection zone.
**How to avoid:** Initialize `activeId` to the first heading ID, or lower the threshold array minimum to include `0` so the initial callback fires even with minimal intersection. The threshold array `[0, 0.1, ...]` already handles this — a ratio of `0` means the element is at the edge.
**Warning signs:** No sidebar link is highlighted when the page first loads; first highlight appears only after scrolling slightly.

## Code Examples

Verified patterns from project conventions and browser API docs:

### Ref Map Pattern (stable, no new function per render)
```typescript
// Pattern used in React docs for lists of refs
const nodeMap = useRef<Map<string, HTMLElement>>(new Map());

// In JSX:
ref={(node) => {
  if (node) nodeMap.current.set(id, node);
  else nodeMap.current.delete(id);
}}
```

### IntersectionObserver Cleanup
```typescript
useEffect(() => {
  const observer = new IntersectionObserver(callback, options);
  elements.forEach((el) => observer.observe(el));
  return () => observer.disconnect();  // cleanup on unmount / re-run
}, [stableDep]);
```

### scrollIntoView in Overflow Container
```typescript
// 'nearest' = scroll only if out of view; no jump if already visible
el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
```

### Tailwind Active vs Inactive Sidebar Link
```typescript
// Active: stronger contrast, medium font weight
const activeClass = "block py-1.5 text-sm font-medium text-foreground transition-colors";
// Inactive: muted, normal weight
const inactiveClass = "block py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors";
// h3 adds left indent
const indent = "pl-4";
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| scroll event + getBoundingClientRect | IntersectionObserver | Chrome 51 / 2016 | Off-main-thread, no throttling needed |
| Manual scroll position tracking | `scrollIntoView({ block: 'nearest' })` | Broadly supported ~2018 | No arithmetic, handles containment automatically |

**Deprecated/outdated:**
- `element.scrollIntoViewIfNeeded()`: Non-standard WebKit extension — use `scrollIntoView({ block: 'nearest' })` instead, which is the standard equivalent.

## Open Questions

1. **Track h3 headings independently as active sections?**
   - What we know: `DocsSidebar` already extracts and displays both h2 and h3 links. `extractHeadings` returns both levels with `doc-` IDs.
   - What's unclear: Whether the research document is long enough that h3-level tracking adds real navigation value, or whether it creates noise (active link jumps rapidly between h3 sub-sections within one h2).
   - Recommendation: Track both h2 and h3. The `useActiveSection` hook is ID-agnostic — it tracks whatever IDs are passed. The `rootMargin: '-10% 0px -80% 0px'` zone is narrow enough that rapid jumps are unlikely. Tracking both is more informative and consistent with established doc sites.

2. **Export `extractHeadings` from DocsSidebar or move to a shared utility?**
   - What we know: `DocsPage` needs the heading ID list to feed `useActiveSection`. Currently `extractHeadings` is a private function in DocsSidebar.tsx.
   - What's unclear: Whether the project will ever need heading extraction elsewhere.
   - Recommendation: Export `extractHeadings` directly from `DocsSidebar.tsx` — no need for a separate utility file for this single-use case. Simpler than introducing a new file.

## Environment Availability

Step 2.6: SKIPPED — this phase is purely React component changes using browser native APIs. No external tools, services, CLIs, or runtimes beyond the existing dev server are required.

## Sources

### Primary (HIGH confidence)
- MDN IntersectionObserver API — https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver — rootMargin behavior, threshold array, disconnect/cleanup
- MDN Element.scrollIntoView — https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView — `block: 'nearest'` behavior in overflow containers
- React docs (useRef, useEffect) — https://react.dev/reference/react — ref callback pattern, effect cleanup
- STATE.md decision log — `[v1.2 Sidebar]: IntersectionObserver scroll-spy uses Map<id, ratio> approach with rootMargin: '-10% 0px -80% 0px'` — locked in Phase 9 implementation

### Secondary (MEDIUM confidence)
- Docusaurus sidebar scroll-spy implementation (open source) — consistent with Map<id, ratio> pattern; `block: 'nearest'` for sidebar auto-scroll

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; browser APIs are well-specified
- Architecture: HIGH — approach is locked in STATE.md; codebase structure is clear from reading both components
- Pitfalls: HIGH — all pitfalls are derived from the actual code layout and known IO behavior; not speculative

**Research date:** 2026-03-24
**Valid until:** 2026-09-24 (IntersectionObserver API is stable; no expiry risk)
