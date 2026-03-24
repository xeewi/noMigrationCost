# Architecture Research

**Domain:** In-app Markdown documentation rendering integrated into existing React+Vite SPA
**Researched:** 2026-03-24
**Confidence:** HIGH — all integration points are deterministic given the existing codebase

---

## The Core Constraint: Hash Namespace Collision

The existing app encodes calculator state as an opaque base64 string directly in `window.location.hash`:

```
https://example.com/#eyJ2IjoxLCJ0aCI6WzAsMCwwLDBdLCJ0cil6...
```

The new docs feature requires hash-based routing (`#/docs`). These two usages of the hash **will collide** without an explicit namespace convention.

**Resolution (HIGH confidence — deterministic from reading the code):**

The base64 state strings produced by `encodeAppState()` in `src/lib/url-state.ts` never start with `/`. Base64url characters are `[A-Za-z0-9\-_]`. A prefix convention of `/docs` (always starts with `/`) is therefore unambiguous — the two namespaces are disjoint.

The routing discriminator reads `window.location.hash` and branches:
- Starts with `/docs` → show docs view
- Anything else → show calculator view (existing behavior unchanged)

No changes to `encodeAppState` or `decodeAppState` are needed.

---

## System Overview

```
┌───────────────────────────────────────────────────────────────┐
│                          main.tsx                             │
│  (createRoot → <App />)                                       │
└───────────────────────────────┬───────────────────────────────┘
                                │
┌───────────────────────────────▼───────────────────────────────┐
│                           App.tsx                             │
│  Hash discriminator: reads window.location.hash on mount      │
│  "/docs*" → render <DocLayout>                                │
│  anything else → render <CalculatorLayout> (existing)         │
└──────────────┬─────────────────────────────────┬─────────────┘
               │                                 │
┌──────────────▼──────────┐       ┌──────────────▼──────────────┐
│    CalculatorLayout     │       │       DocLayout              │
│  (existing App.tsx JSX) │       │  AppHeader (nav variant)     │
│  AppHeader (calc nav)   │       │  DocSidebar (section links)  │
│  two-column grid        │       │  DocContent (rendered MD)    │
│  AppFooter              │       │  AppFooter                   │
└─────────────────────────┘       └──────────────────────────────┘
```

### Component Responsibilities

| Component | New / Modified | Responsibility |
|-----------|---------------|---------------|
| `App.tsx` | Modified | Add hash discriminator to switch between calculator and docs views. Existing calculator state and effects unchanged. |
| `AppHeader.tsx` | Modified | Accept a `view` prop (`'calculator' \| 'docs'`). Render "Documentation" nav link when in calculator view; "Calculator" link when in docs view. Copy-link and Reset buttons only shown in calculator view. |
| `DocLayout` | New | Thin shell: renders `DocSidebar` + `DocContent` in a two-column layout. No state. |
| `DocSidebar` | New | Receives an array of `{ id, label, depth }` section headings. Renders anchor links. Highlights active section on scroll (optional for MVP). |
| `DocContent` | New | Renders the parsed Markdown as sanitized HTML using `dangerouslySetInnerHTML` or a renderer component. Applies prose typography styles. |
| `useDocSections` hook | New | Parses the imported Markdown string and extracts `{ id, label, depth }` entries from ATX headings. Returns both the raw HTML string and the sections array. |

---

## Recommended Project Structure Changes

```
src/
├── components/
│   ├── AppHeader.tsx        # MODIFIED: add view prop, conditional nav links
│   ├── AppFooter.tsx        # UNCHANGED
│   ├── docs/                # NEW folder — all docs-view components
│   │   ├── DocLayout.tsx    # NEW: two-column shell
│   │   ├── DocSidebar.tsx   # NEW: section anchor nav
│   │   └── DocContent.tsx   # NEW: Markdown HTML renderer
│   └── ... (existing)
├── hooks/
│   └── useDocSections.ts    # NEW: parse headings from Markdown string
├── lib/
│   └── url-state.ts         # UNCHANGED
└── App.tsx                  # MODIFIED: add hash discriminator + DocLayout branch
```

### Structure Rationale

- **`src/components/docs/`** — groups all doc-view components as a unit. Keeps calculator components uncontaminated. Easy to find and delete if the feature is removed.
- **`src/hooks/`** — the section extraction logic is reusable (sidebar and potentially a table-of-contents). Separating it from the component keeps `DocContent` focused on rendering.
- **No new router library** — the project has no routing library today. Adding React Router or TanStack Router for two views would be disproportionate. The two-hash-namespace pattern is sufficient and self-contained.

---

## Architectural Patterns

### Pattern 1: Hash Discriminator in App.tsx

**What:** `App.tsx` reads `window.location.hash` on mount and on `hashchange` events. Returns early with `<DocLayout>` when the hash starts with `/docs`. Otherwise renders the existing calculator JSX unchanged.

**When to use:** When a SPA has two or fewer top-level views and no nested routing needs. Avoids adding a router dependency.

**Trade-offs:** Simple and zero-dependency. Does not compose if a third view is later added (at that point, reach for TanStack Router). Worth it for this milestone.

**Example:**
```typescript
// App.tsx (simplified addition)
const [view, setView] = useState<'calculator' | 'docs'>(
  () => window.location.hash.startsWith('/docs') ? 'docs' : 'calculator'
);

useEffect(() => {
  function handleHashChange() {
    setView(window.location.hash.startsWith('/docs') ? 'docs' : 'calculator');
  }
  window.addEventListener('hashchange', handleHashChange);
  return () => window.removeEventListener('hashchange', handleHashChange);
}, []);

if (view === 'docs') return <DocLayout />;
// ... existing calculator JSX
```

**Important:** The existing hash-write effect in App.tsx must NOT fire when `view === 'docs'`. It currently depends on calculator state values. Since those state values won't change while on the docs view, the effect won't fire — but to be explicit and safe, guard it:

```typescript
useEffect(() => {
  if (view === 'docs') return; // don't overwrite /docs hash
  const id = setTimeout(() => { window.location.hash = encodeAppState(...); }, 300);
  return () => clearTimeout(id);
}, [view, team, sizingMode, ...]); // add view to deps
```

### Pattern 2: Markdown as Static Import via Vite

**What:** Import the Markdown file as a raw string using Vite's `?raw` query. No build plugin needed. The string is bundled at build time — zero runtime fetch.

**When to use:** Always for this project. The doc is a single file that changes only with source deployments. Dynamic fetch would add loading state complexity for no benefit.

**Trade-offs:** The Markdown string is included in the JS bundle. At ~46KB the doc file adds negligible weight. The bundle is already larger from React and Recharts.

**Example:**
```typescript
// DocContent.tsx or useDocSections.ts
import docMarkdown from '../../../docs/feature-cost-shared-vs-duplicated.md?raw';
```

Vite handles `?raw` imports natively — no plugin configuration needed. TypeScript needs a declaration for `.md` files:

```typescript
// src/vite-env.d.ts (extend existing file)
declare module '*.md?raw' {
  const content: string;
  export default content;
}
```

### Pattern 3: Client-Side Markdown Parsing with marked

**What:** Use `marked` to parse the Markdown string to HTML at component render time. The result is passed to `dangerouslySetInnerHTML`. Apply Tailwind Typography (`@tailwindcss/typography`) prose classes for styling.

**When to use:** For a static doc that is rendered once on mount and never changes. `marked` is synchronous, fast (~50ms for 46KB), and has no dependencies.

**Trade-offs:** `dangerouslySetInnerHTML` requires trusting the source. The Markdown comes from the project repository — this is acceptable. The alternative (a full MDX pipeline or react-markdown with plugins) adds significant dependency weight.

**Example:**
```typescript
// DocContent.tsx
import { marked } from 'marked';
import docMarkdown from '../../../docs/feature-cost-shared-vs-duplicated.md?raw';

export function DocContent() {
  const html = useMemo(() => marked(docMarkdown) as string, []);
  return (
    <article
      className="prose prose-neutral max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

**Heading IDs for anchor links:** `marked` does not add `id` attributes to headings by default. Use `marked.use({ renderer })` with a custom heading renderer that slugifies the heading text. This makes sidebar anchor links (`#heading-text`) work.

### Pattern 4: Section Extraction via Regex (not DOM parsing)

**What:** Extract heading sections from the Markdown string using a regex before parsing to HTML. This gives the sidebar its navigation data without needing to query the DOM.

**When to use:** Always preferred over post-render DOM queries (`querySelectorAll('h2, h3')`). The Markdown string is available synchronously; DOM queries require a `useEffect` after render.

**Example:**
```typescript
// hooks/useDocSections.ts
export interface DocSection {
  id: string;     // slug of the heading text
  label: string;  // raw heading text
  depth: number;  // 1–6
}

export function useDocSections(markdown: string): DocSection[] {
  return useMemo(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const sections: DocSection[] = [];
    let match: RegExpExecArray | null;
    while ((match = headingRegex.exec(markdown)) !== null) {
      sections.push({
        depth: match[1].length,
        label: match[2].trim(),
        id: slugify(match[2].trim()),
      });
    }
    return sections;
  }, [markdown]);
}
```

---

## Data Flow

### Navigation Flow (Calculator → Docs)

```
User clicks "Documentation" link in AppHeader
    ↓
<a href="#/docs"> (plain anchor)
    ↓
hashchange event fires
    ↓
App.tsx handleHashChange()
    ↓
setView('docs')
    ↓
React re-render → <DocLayout> replaces calculator JSX
    ↓
Calculator state preserved in memory (React state survives re-render)
```

### Navigation Flow (Docs → Calculator)

```
User clicks "Calculator" link in AppHeader
    ↓
<a href="#"> or <a href="#/"> (clears hash or uses saved state)
    ↓
hashchange event fires
    ↓
setView('calculator')
    ↓
React re-render → calculator JSX restored
    ↓
Existing hash-write effect fires (debounced 300ms) → re-encodes current state
```

Note: When navigating docs → calculator, the in-memory React state is fully intact (team, sizing, params). The 300ms debounce re-encodes it into the hash. The user's scenario is preserved.

### Markdown Render Flow

```
Vite bundle time: docs/feature-cost-shared-vs-duplicated.md bundled as string
    ↓
Component mount: marked(docMarkdown) → HTML string (synchronous, ~50ms)
    ↓
useDocSections(docMarkdown) → DocSection[] array (regex parse)
    ↓
<DocSidebar sections={sections} /> renders anchor links
<DocContent html={html} /> sets dangerouslySetInnerHTML
```

### Active Section Tracking (Docs Sidebar)

```
IntersectionObserver watches all heading elements in DocContent
    ↓
As user scrolls, observer callbacks fire
    ↓
DocSidebar state (activeId) updates
    ↓
Active link highlighted in sidebar
```

This is optional for the MVP — the sidebar can be static anchor links first, with scroll-tracking added as a polish step.

---

## Integration Points

### New vs. Existing Component Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `App.tsx` view discriminator → `DocLayout` | `view` state, early return | `DocLayout` is a pure presentational component — receives no props from App |
| `App.tsx` hash-write effect → `view` state | `view` added to effect deps array | Guard prevents overwriting `/docs` hash when on docs view |
| `AppHeader.tsx` → navigation links | `view` prop passed from `App.tsx` | Conditional rendering of nav links and action buttons |
| `DocLayout` → `DocSidebar` | `sections: DocSection[]` prop | Sections derived from Markdown in `DocLayout` or a hook |
| `DocLayout` → `DocContent` | No props needed (content is a static import inside the component) | Alternatively pass `markdown` string as prop for testability |
| `useDocSections` hook → `DocSidebar` | `DocSection[]` array | Hook called in `DocLayout`, sections passed down |

### What Does NOT Change

| Existing element | Impact |
|-----------------|--------|
| `src/lib/url-state.ts` | No changes. `encodeAppState`/`decodeAppState` logic is untouched. |
| `src/engine/` | No changes. |
| Calculator component tree | No changes. All components receive same props as before. |
| Hash-read effect on mount | No changes. Correctly ignores `/docs` hash (base64 decode will fail or return v !== 1, decodeAppState returns null, app stays at defaults). |
| AppFooter | No changes. Shared as-is in both views. |

---

## Suggested Build Order

Dependencies flow bottom-up. Build in this order to avoid blocked work:

1. **Vite raw import declaration** — Add `.md?raw` type declaration to `src/vite-env.d.ts`. Zero logic, unblocks everything else. Verify with a console.log of the import.

2. **Hash discriminator in App.tsx** — Add `view` state, `hashchange` listener, guard on hash-write effect, and early return for docs view. Renders `null` or a placeholder initially. This is the integration spine — everything else hangs off it.

3. **AppHeader nav links** — Modify `AppHeader` to accept `view` prop and render the "Documentation" / "Calculator" toggle link. Lets you test navigation before the doc page is built.

4. **`useDocSections` hook** — Pure function, no React dependencies beyond `useMemo`. Can be unit-tested immediately with the raw Markdown string. Unblocks sidebar.

5. **`DocContent` component** — Imports `marked`, parses Markdown to HTML, renders prose. Depends on step 1 (raw import) and the `marked` package. No sidebar dependency.

6. **`DocSidebar` component** — Renders anchor links from `DocSection[]`. Depends on step 4. Can be built with static/hardcoded data first, then wired to the hook.

7. **`DocLayout` shell** — Assembles `DocSidebar` + `DocContent` in a two-column layout. Final wiring step. Then replaces the `null` placeholder from step 2.

8. **Heading ID generation** — Ensure `marked` custom renderer adds `id` attributes matching the slugs used in sidebar anchors. Anchors won't work until this is done.

9. **Polish** — Scroll-spy active section, sticky sidebar, responsive collapse (sidebar hidden on mobile), prose styling tweaks.

---

## Anti-Patterns

### Anti-Pattern 1: Using Hash Paths That Collide with Base64

**What people do:** Use `#docs` or `#documentation` as the route. Base64url alphabet includes all alphanumeric characters — a calculator state string could theoretically start with `docs`.

**Why it's wrong:** Any route discriminator that could be produced by `btoa()` creates an ambiguous hash. A shared calculator URL that starts with `docs...` would incorrectly show the documentation view.

**Do this instead:** Prefix with `/` (e.g., `#/docs`). The `/` character is not produced by base64url encoding, making the namespaces provably disjoint.

### Anti-Pattern 2: Fetching Markdown at Runtime

**What people do:** `fetch('/docs/feature-cost-shared-vs-duplicated.md')` in a `useEffect`.

**Why it's wrong:** Adds loading state, error state, and a network round-trip. The Markdown file is a build artifact deployed alongside the app — it doesn't change without a new deployment. There is no benefit to deferring it.

**Do this instead:** Import with `?raw`. Vite bundles the string. No loading state needed, no network dependency.

### Anti-Pattern 3: Querying the DOM for Headings

**What people do:** After rendering the Markdown HTML, use `document.querySelectorAll('h2, h3')` in a `useEffect` to build the sidebar navigation.

**Why it's wrong:** Creates a dependency on render timing. Requires a ref to the content container or a global DOM query. Race conditions if the component re-renders. The Markdown string contains all the heading information before any HTML is produced.

**Do this instead:** Parse headings from the raw Markdown string with `useDocSections`. The sidebar data is available synchronously before the first render.

### Anti-Pattern 4: Unmounting Calculator State on View Switch

**What people do:** Conditionally render the entire App.tsx return including all calculator state, effectively unmounting and remounting the calculator component tree on navigation.

**Why it's wrong:** All in-progress calculator inputs are lost when the user returns from the docs view (before the hash has been written). The 300ms debounce means there's a window where the hash has not been updated yet.

**Do this instead:** Keep calculator React state alive in App.tsx regardless of view. Only swap the JSX returned — the state variables remain in memory. Add `view` to the hash-write effect deps so it fires immediately on return from docs (bypassing the 300ms debounce, or reducing the guard condition).

---

## Scaling Considerations

This is a static single-page app. The documentation feature adds no server or data concerns. "Scaling" here means: what breaks if the documentation grows.

| Concern | Current scope | If doc grows |
|---------|--------------|--------------|
| Bundle size | 46KB Markdown string is negligible | A 10x larger doc would add ~460KB to the JS bundle — still fine for a desktop tool |
| Sidebar navigation depth | Research doc has ~40 headings | `DocSidebar` handles any N with a simple map; no limit |
| Multiple doc files | Not in scope | Would require a `#/docs/[slug]` routing layer — at that point, add TanStack Router |
| Markdown features (math, diagrams) | Research doc uses tables, code blocks, headings — all standard | If KaTeX or Mermaid are needed, add `marked` extensions; no architectural change |

---

## Sources

- Analysis of existing codebase: `src/App.tsx`, `src/lib/url-state.ts`, `src/components/AppHeader.tsx`
- Vite raw import documentation: https://vite.dev/guide/assets#importing-asset-as-string
- `marked` library documentation: https://marked.js.org/
- Base64url alphabet specification (RFC 4648 §5): characters are `A–Z a–z 0–9 - _` — no `/` character, confirming disjoint namespace

---
*Architecture research for: in-app Markdown documentation rendering integrated with React+Vite SPA*
*Researched: 2026-03-24*
