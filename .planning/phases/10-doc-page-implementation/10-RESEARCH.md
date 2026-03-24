# Phase 10: Doc Page Implementation - Research

**Researched:** 2026-03-24
**Domain:** Markdown rendering in React (react-markdown + remark-gfm + rehype-slug), Tailwind Typography (@tailwindcss/typography), fixed-header scroll offset, sidebar anchor navigation
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DOC-01 | User can read the full research document rendered as HTML on the docs page | react-markdown v10 renders `docs/feature-cost-shared-vs-duplicated.md` imported via Vite `?raw`; no runtime fetch |
| DOC-02 | User can see GFM tables rendered correctly (pipe tables from the research doc) | remark-gfm v4 plugin passed to `remarkPlugins` prop; activates table/strikethrough/tasklist extensions |
| DOC-03 | User can see properly styled prose (headings, paragraphs, lists, links) via Tailwind Typography | `@tailwindcss/typography` v0.5.19 added via `@plugin` directive in `index.css`; `prose` class on wrapper element |
| DOC-04 | User can click a sidebar anchor link and land at the correct heading without it being hidden behind the fixed header | AppHeader made `sticky top-0 z-50`; headings get `scroll-mt-16` (or exact measured value) via Tailwind; rehype-slug adds `id="doc-{slug}"` to each heading |
| NAV-01 | User can see a left sidebar listing all document sections as clickable anchor links | DocsSidebar component extracts `##` and `###` headings from raw markdown string; renders `<a href="#/docs/{id}">` links |

</phase_requirements>

---

## Summary

Phase 10 delivers the complete documentation reading experience: the 849-line research markdown file rendered as styled HTML with GFM table support, a left sidebar listing all sections as clickable anchor links, and correct scroll behavior when an anchor is clicked under a fixed/sticky header.

The package stack is pre-decided in STATE.md locked decisions: `react-markdown@10.1.0` + `remark-gfm@4.0.1` + `rehype-slug@6.0.0` + `@tailwindcss/typography@0.5.19`. None of these packages are installed yet. The Vite `?raw` suffix for importing the markdown file as a string is supported natively by `vite/client` types (already in `src/vite-env.d.ts`).

The most technically subtle requirement is DOC-04: the AppHeader is currently a normal-flow `<header>` (not sticky). To make sidebar anchor clicks land correctly, the header must be made `sticky top-0 z-50` and all rendered headings must have a `scroll-margin-top` equal to the header height. The correct Tailwind pattern is `scroll-mt-[N]` applied to each `<h1>`–`<h6>` via the `components` prop of `<ReactMarkdown>`. The sidebar generates its link list by parsing heading text directly from the raw markdown string (no DOM query required), which keeps the sidebar data extraction pure and fast.

**Primary recommendation:** Import the markdown as a module-level `?raw` string; render with `<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeSlug, { prefix: 'doc-' }]]} components={headingComponents}>`; wrap in `<div className="prose prose-neutral max-w-none">`. Build the sidebar as a separate component that receives the raw markdown string and extracts headings via a simple regex.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-markdown | 10.1.0 | Render markdown string as React elements | No `dangerouslySetInnerHTML`; safe by default; supports remark/rehype plugin pipeline |
| remark-gfm | 4.0.1 | GitHub Flavored Markdown: tables, strikethrough, task lists | Only way to activate pipe-table parsing in react-markdown v10 |
| rehype-slug | 6.0.0 | Add `id` attributes to `<h1>`–`<h6>` elements for anchor navigation | Standard rehype plugin; `prefix` option locks in `doc-` per D-12 |
| @tailwindcss/typography | 0.5.19 | `prose` class system for readable HTML typography | Official Tailwind plugin; handles all heading/paragraph/list/link/table styles |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | — | Sidebar is a hand-built React component | Sidebar is simple enough to build from a regex on the raw markdown string |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-markdown | @mdx-js/react | MDX allows JSX in markdown — overkill for a read-only document |
| Vite `?raw` import | Runtime `fetch()` | Fetch requires hosting the file separately and handling loading state; `?raw` is zero-overhead |
| CSS `scroll-margin-top` on elements | `scroll-padding-top` on `<html>` | `scroll-padding-top` only works when the browser's scroll container is the `<html>` element; heading-level `scroll-margin-top` is more reliable and works regardless of scroll container |
| @tailwindcss/typography | Hand-crafted prose CSS | Typography plugin handles 50+ edge cases (nested lists, code in headings, blockquotes); do not hand-roll |

**Installation:**

```bash
npm install react-markdown remark-gfm rehype-slug @tailwindcss/typography
```

Note: `@tailwindcss/typography` is a runtime CSS plugin (not devDependency) when using Tailwind v4's `@plugin` directive. Install as a regular dependency.

**Version verification (confirmed 2026-03-24):**

```
react-markdown   10.1.0  (npm view react-markdown version)
remark-gfm        4.0.1  (npm view remark-gfm version)
rehype-slug       6.0.0  (npm view rehype-slug version)
@tailwindcss/typography  0.5.19  (npm view @tailwindcss/typography version)
```

---

## Architecture Patterns

### Recommended Project Structure Addition

```
src/
├── components/
│   ├── DocsPage.tsx         # New: full docs page layout (sidebar + article)
│   ├── DocsSidebar.tsx      # New: extracts headings from raw MD; renders anchor links
│   └── ...                  # Existing components unchanged
├── content/
│   └── research.md?raw      # Import path (file at docs/feature-cost-shared-vs-duplicated.md)
└── App.tsx                  # Modified: replace docs placeholder with <DocsPage />
```

The markdown file lives at `docs/feature-cost-shared-vs-duplicated.md` (project root). Import path in DocsPage.tsx:

```typescript
import researchMd from '../../docs/feature-cost-shared-vs-duplicated.md?raw';
```

TypeScript resolves this correctly because `vite/client` types (already referenced in `src/vite-env.d.ts`) declare the `?raw` query as returning `string`.

### Pattern 1: Tailwind Typography — CSS-First Registration (Tailwind v4)

**What:** Register `@tailwindcss/typography` via `@plugin` directive in `index.css`. Do NOT use `tailwind.config.js` (that's the v3 approach).

**When to use:** Required for Tailwind v4 projects (this project uses `tailwindcss@4.2.2`).

```css
/* src/index.css — add after existing @import lines */
@import "tailwindcss";
@plugin "@tailwindcss/typography";
/* existing theme and custom rules below unchanged */
```

After this, `prose`, `prose-neutral`, `prose-invert`, `prose-lg`, etc. become available as Tailwind utility classes.

### Pattern 2: React-Markdown Rendering (v10 Stable API)

**What:** The `<ReactMarkdown>` (default export as `Markdown` in v10) component accepts `children` as the markdown string, `remarkPlugins`, `rehypePlugins`, and `components`.

**Critical:** Define `remarkPlugins`, `rehypePlugins`, and `components` at **module level** (outside the component function). If defined inline as JSX props, React recreates them on every render, causing react-markdown to re-parse the entire document on every render. This is the most common performance pitfall with react-markdown.

```typescript
// Source: STATE.md [v1.2 Doc] decision + react-markdown v10 API
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import researchMd from '../../docs/feature-cost-shared-vs-duplicated.md?raw';

// Module-level constants — prevents re-parse on parent re-render
const REMARK_PLUGINS = [remarkGfm];
const REHYPE_PLUGINS = [[rehypeSlug, { prefix: 'doc-' }]] as const;
const HEADING_COMPONENTS = {
  h1: (props: React.ComponentProps<'h1'>) => <h1 className="scroll-mt-16" {...props} />,
  h2: (props: React.ComponentProps<'h2'>) => <h2 className="scroll-mt-16" {...props} />,
  h3: (props: React.ComponentProps<'h3'>) => <h3 className="scroll-mt-16" {...props} />,
};

export function DocsPage() {
  return (
    <article className="prose prose-neutral max-w-none">
      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}
        components={HEADING_COMPONENTS}
      >
        {researchMd}
      </ReactMarkdown>
    </article>
  );
}
```

### Pattern 3: Fixed Header — Making AppHeader Sticky

**What:** The requirement DOC-04 states headings must not be hidden "behind the fixed AppHeader". Currently, AppHeader is a normal-flow element (no `position: sticky` or `fixed`). To make sidebar anchor clicks land correctly, the header must be made sticky.

**Change to AppHeader.tsx:**

```typescript
// Before:
<header className="border-b border-border">

// After:
<header className="sticky top-0 z-50 border-b border-border bg-background">
```

`bg-background` is required: without it, the sticky header is transparent, and scrolled content bleeds through.

**Measured header height:** `py-3` = 12px top + 12px bottom = 24px. Content height: `text-xl` line-height ≈ 28px. Total header height ≈ 52px. Tailwind spacing: `scroll-mt-16` = 64px provides ~12px breathing room above the heading. Use `scroll-mt-16` on all headings.

### Pattern 4: Sidebar Heading Extraction

**What:** The DocsSidebar needs a list of `{ id, text, level }` entries. Extract these from the raw markdown string at module or component level using a simple regex — do NOT query the DOM after render.

```typescript
// Source: Pattern derived from rehype-slug's github-slugger algorithm + rehype-slug prefix: 'doc-'
import GithubSlugger from 'github-slugger'; // re-export from rehype-slug's dep
// OR: use a simple manual slug function that matches github-slugger output

interface HeadingEntry {
  id: string;    // "doc-{slug}" — matches what rehype-slug generates
  text: string;  // display text in sidebar
  level: 2 | 3; // h2 or h3
}

function extractHeadings(markdown: string): HeadingEntry[] {
  const slugger = new GithubSlugger(); // tracks duplicates
  const lines = markdown.split('\n');
  const entries: HeadingEntry[] = [];
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    const text = m[2].trim();
    const slug = slugger.slug(text);
    entries.push({ id: `doc-${slug}`, text, level });
  }
  return entries;
}
```

**Note on `github-slugger`:** It is a dependency of `rehype-slug` and will be available after `npm install rehype-slug`. Import from `github-slugger` directly. Alternatively, implement a simple slug function: lowercase, replace spaces with `-`, strip non-alphanumeric (except `-`). The sidebar only needs to match rehype-slug's output exactly — verify against the actual headings in the document after install.

**Simpler alternative** (no import needed): The research doc has no duplicate headings and uses simple ASCII text in headings (no emoji). A naive `text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')` slug is sufficient and avoids the `github-slugger` import.

### Pattern 5: Sidebar Anchor Click and Hash Navigation

**What:** Sidebar links must update the URL hash to `#/docs/{section-id}` (D-09 format) so the `useHashRoute` hook keeps the URL in sync. A plain `<a href="#doc-{id}">` would scroll correctly but write a plain fragment hash (`#doc-...`), which breaks the routing discriminator (it does not start with `/`).

**Correct pattern:**

```typescript
// Sidebar link — writes route hash AND triggers scroll
<a
  href={`#/docs/${entry.id}`}
  onClick={(e) => {
    e.preventDefault();
    window.location.hash = `/docs/${entry.id}`;
    document.getElementById(entry.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }}
>
  {entry.text}
</a>
```

**Why `scrollIntoView` instead of native anchor behavior:** Using `window.location.hash = '/docs/doc-1-software...'` does NOT trigger native scroll-to-anchor behavior (the browser only auto-scrolls to a fragment when the URL is updated via normal link navigation, not via JS assignment in some browsers). `scrollIntoView` ensures reliable cross-browser scroll. The `scroll-mt-16` CSS on each heading ensures the final scroll position accounts for the sticky header.

### Pattern 6: Docs Page Layout (sidebar + content)

**What:** Two-column layout: sticky left sidebar (~240px) + scrollable main content area.

```typescript
export function DocsPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8 pb-16 flex gap-8">
      {/* Sidebar — sticky, stops at viewport bottom */}
      <aside className="w-60 flex-shrink-0">
        <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <DocsSidebar markdown={researchMd} />
        </div>
      </aside>
      {/* Content */}
      <main className="flex-1 min-w-0">
        <article className="prose prose-neutral max-w-none">
          <ReactMarkdown ...>{researchMd}</ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
```

`top-20` (80px) accounts for the sticky header height (~52px) + breathing room. `min-w-0` on the flex main prevents prose content from overflowing the flex container.

### Anti-Patterns to Avoid

- **Inline plugin arrays in JSX:** `<ReactMarkdown remarkPlugins={[remarkGfm]}>` defined inline causes re-parse on every render. Always define at module level.
- **Plain `<a href="#doc-id">` for sidebar links:** This writes a bare fragment (`#doc-id`) to the URL, which collides with the routing namespace discriminator. Always write `#/docs/{id}` format.
- **`scroll-padding-top` on `<html>`:** Only works when the scroll container is the root element. `scroll-margin-top` on individual headings is more reliable.
- **Querying the DOM for headings:** Don't use `document.querySelectorAll('h2, h3')` to build the sidebar — the DOM is not available during SSR and is fragile. Parse the raw markdown string instead.
- **`@tailwindcss/typography` as devDependency:** In Tailwind v4, `@plugin` loads the package at CSS build time. It must be in `dependencies`, not `devDependencies`, or the production build may fail depending on the host.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown-to-HTML rendering | Custom HTML string builder | react-markdown | XSS risk; edge cases in CommonMark spec (nested emphasis, code fences, etc.) |
| GFM table parsing | Manual pipe-table regex | remark-gfm | Tables have complex alignment and multi-line cell edge cases |
| Heading ID generation | Custom slug function | rehype-slug + github-slugger | Duplicate heading handling, Unicode normalization, exact match with GitHub's algorithm |
| Prose typography defaults | Hand-crafted CSS for each element | @tailwindcss/typography | 50+ styling decisions; link colors, nested list spacing, code blocks, blockquotes |
| Markdown link sanitization | Custom URL filtering | react-markdown default (allowedElements/skipHtml) | react-markdown is safe by default; it does not render raw HTML unless `remarkRehypeOptions.allowDangerousHtml` is set |

**Key insight:** The markdown rendering stack (react-markdown + remark + rehype) is the unified ecosystem — each layer has a well-defined responsibility. Do not mix concerns by trying to post-process HTML output or intercept intermediate AST nodes without a plugin.

---

## Common Pitfalls

### Pitfall 1: Module-Level Plugin Array Not Used (Re-parse Performance)
**What goes wrong:** Every parent re-render (e.g., hash change) triggers a full markdown re-parse, causing visible jank on a 45KB document.
**Why it happens:** `remarkPlugins={[remarkGfm]}` defined inline in JSX creates a new array reference on every render, causing react-markdown to treat it as changed config.
**How to avoid:** Define `REMARK_PLUGINS`, `REHYPE_PLUGINS`, and `HEADING_COMPONENTS` as module-level constants.
**Warning signs:** DevTools Profiler shows expensive `ReactMarkdown` renders on unrelated state changes.

### Pitfall 2: Sticky Header Without `bg-background`
**What goes wrong:** Sticky header appears transparent; text from the scrolled document bleeds through the nav links, making the header unreadable.
**Why it happens:** Tailwind `sticky` does not add a background color — only position behavior.
**How to avoid:** Add `bg-background` to the sticky `<header>` element simultaneously with `sticky top-0 z-50`.
**Warning signs:** Header looks fine when page is at top; becomes unreadable after scrolling.

### Pitfall 3: Sidebar Links Using Plain `#doc-{id}` Href
**What goes wrong:** Clicking a sidebar link updates the hash to `#doc-introduction` (no `/` prefix). `useHashRoute.deriveView` sees a hash that does not start with `/` and derives `view = 'calculator'`. The app switches to calculator view.
**Why it happens:** Native anchor `href="#doc-introduction"` writes the fragment directly without the route namespace.
**How to avoid:** Use `window.location.hash = '/docs/doc-introduction'` in an `onClick` handler (D-09 format). Or use `href="#/docs/doc-introduction"` which the browser will write verbatim.
**Warning signs:** Clicking a sidebar link navigates away from the docs page.

### Pitfall 4: `scroll-margin-top` Value Too Small
**What goes wrong:** After clicking a sidebar link, the target heading is partially hidden behind the sticky header (e.g., only the bottom 10px of the heading is visible).
**Why it happens:** `scroll-mt-16` (64px) may need adjustment based on actual rendered header height. The calculated header height (~52px) is an estimate; actual height depends on font rendering and any padding changes.
**How to avoid:** Measure the actual header height in DevTools after making it sticky. Set `scroll-mt` to `Math.ceil(headerHeight / 4) * 4` rounded up to the nearest 4px Tailwind increment. Use an arbitrary value `scroll-mt-[56px]` if the standard scale doesn't fit exactly.
**Warning signs:** Target heading is clipped behind the header after anchor navigation.

### Pitfall 5: `@tailwindcss/typography` Installed as devDependency
**What goes wrong:** Build succeeds locally, but production static build fails because the `@plugin` CSS directive cannot resolve the package.
**Why it happens:** Vite and Tailwind's CSS build pipeline resolve `@plugin` paths from `node_modules` at build time. If the package is not in `dependencies`, it may be absent in CI/production environments.
**How to avoid:** `npm install @tailwindcss/typography` (no `--save-dev`).

### Pitfall 6: `rehype-slug` Prefix Collision with Section IDs
**What goes wrong:** The sidebar link `#/docs/doc-1-software-development-cost-estimation-models` is very long; no direct problem, but this is expected behavior.
**Why it happens:** `rehype-slug` with `prefix: 'doc-'` generates `id="doc-{github-slugger-output}"`. The full IDs are long but guaranteed unique and stable.
**How to avoid:** Accept the verbosity — IDs match what the sidebar generates and what the URL uses. The `doc-` prefix is mandatory per D-12 to prevent collision with base64url state hashes.

---

## Code Examples

### Complete `DocsPage.tsx` Structure

```typescript
// Source: react-markdown v10 API + STATE.md [v1.2 Doc] decisions
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import type { Options as RehypeSlugOptions } from 'rehype-slug';
import researchMd from '../../docs/feature-cost-shared-vs-duplicated.md?raw';
import { DocsSidebar } from './DocsSidebar';

// Module-level — prevents re-parse on parent re-render (STATE.md [v1.2 Doc])
const REMARK_PLUGINS = [remarkGfm] as const;
const REHYPE_PLUGINS = [[rehypeSlug, { prefix: 'doc-' } satisfies RehypeSlugOptions]] as const;
const COMPONENTS = {
  h1: (props: React.ComponentProps<'h1'>) => <h1 className="scroll-mt-16" {...props} />,
  h2: (props: React.ComponentProps<'h2'>) => <h2 className="scroll-mt-16" {...props} />,
  h3: (props: React.ComponentProps<'h3'>) => <h3 className="scroll-mt-16" {...props} />,
  h4: (props: React.ComponentProps<'h4'>) => <h4 className="scroll-mt-16" {...props} />,
};

export function DocsPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8 pb-16 flex gap-8">
      <aside className="w-60 flex-shrink-0">
        <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <DocsSidebar markdown={researchMd} />
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <article className="prose prose-neutral max-w-none">
          <ReactMarkdown
            remarkPlugins={REMARK_PLUGINS}
            rehypePlugins={REHYPE_PLUGINS}
            components={COMPONENTS}
          >
            {researchMd}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
```

### Vite `?raw` Import (TypeScript)

```typescript
// Supported natively by vite/client types (already in src/vite-env.d.ts)
// No additional type declarations needed
import researchMd from '../../docs/feature-cost-shared-vs-duplicated.md?raw';
// researchMd is typed as string
```

### `@tailwindcss/typography` Registration (Tailwind v4)

```css
/* src/index.css — add as second line after @import "tailwindcss" */
@import "tailwindcss";
@plugin "@tailwindcss/typography";   /* ADD THIS */
@import "tw-animate-css";
/* ... rest unchanged */
```

### AppHeader Sticky Modification

```typescript
// src/components/AppHeader.tsx — change opening <header> className
// Before:
<header className="border-b border-border">
// After:
<header className="sticky top-0 z-50 border-b border-border bg-background">
```

### `DocsSidebar.tsx` Heading Extraction

```typescript
// Parses raw markdown string — no DOM dependency
interface HeadingEntry {
  id: string;   // "doc-{slug}" — matches rehype-slug output
  text: string;
  level: 2 | 3;
}

function toSlug(text: string): string {
  // Matches github-slugger behavior for the research doc's ASCII headings
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')   // strip non-word chars (except hyphen)
    .replace(/\s+/g, '-')       // spaces to hyphens
    .replace(/-+/g, '-')        // collapse consecutive hyphens
    .replace(/^-|-$/g, '');     // trim leading/trailing hyphens
}

function extractHeadings(markdown: string): HeadingEntry[] {
  const entries: HeadingEntry[] = [];
  const counts: Record<string, number> = {};
  for (const line of markdown.split('\n')) {
    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    const text = m[2].trim();
    const base = toSlug(text);
    const count = counts[base] ?? 0;
    counts[base] = count + 1;
    const slug = count === 0 ? base : `${base}-${count}`;
    entries.push({ id: `doc-${slug}`, text, level });
  }
  return entries;
}
```

**Note on slug function accuracy:** The research doc contains a heading `## Data Guide for Building a Cost Calculator` at line 3 with no `#` prefix beyond `##`. All other section headings follow numeric patterns (`## 1.`, `### 1.1`). The custom slug function handles these correctly. However, if any heading contains special characters (em dashes, footnote markers, etc.), the slug may diverge from `github-slugger`. Verify by logging `extractHeadings(researchMd)` in the browser and comparing IDs to what `rehype-slug` generates on the rendered elements in DevTools.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@tailwindcss/typography` via JS config | `@plugin "@tailwindcss/typography"` in CSS | Tailwind v4.0 (Jan 2025) | No `tailwind.config.js` needed; config is CSS-only |
| `react-markdown` default export was `ReactMarkdown` | Default export renamed, `Markdown` as named export | v10.0 (2024) | Both work; import default as any name or use named `{ Markdown }` |
| `remark-gfm` v3 (remark-parse v10) | `remark-gfm` v4 (remark-parse v11) | v4.0.0 (2024) | Breaking change in peer deps; v4 is current and paired with react-markdown v10 |

**Deprecated/outdated:**
- `remarkPlugins={[remarkGfm]}` with `react-markdown@7` or earlier: different prop name (`plugins` not `remarkPlugins`)
- `tailwind.config.js` plugins array for typography: v3 approach, not compatible with v4 CSS-first config

---

## Open Questions

1. **Exact header height after sticky change**
   - What we know: Calculated at ~52px (`py-3` + `text-xl` line height); `scroll-mt-16` (64px) adds 12px breathing room
   - What's unclear: Actual rendered pixel height may vary by browser/font-rendering; needs measurement in DevTools after implementation
   - Recommendation: Implement with `scroll-mt-16`, measure in browser, adjust to `scroll-mt-[Npx]` if headings are visually clipped

2. **Slug accuracy for the custom `toSlug` function**
   - What we know: Research doc headings are primarily ASCII with numbers and periods; `github-slugger` strips non-ASCII and periods, lowercases, converts spaces to hyphens
   - What's unclear: Edge cases in headings like `## 1.1 COCOMO II (Constructive Cost Model)` — parentheses and periods get stripped
   - Recommendation: Log `extractHeadings(researchMd)` and compare to DevTools-inspected `id` attributes on rendered headings; adjust `toSlug` if any mismatch found. The simplest fix: install and use `github-slugger` directly.

3. **Sidebar scroll on deep-link mount**
   - What we know: When the page loads with `#/docs/{section-id}` in the URL, `useHashRoute` sets `view='docs'`. The docs page renders and the heading exists in the DOM.
   - What's unclear: Whether the browser auto-scrolls to the element ID after `DocsPage` mounts (since the hash includes the route prefix `/docs/`, not a bare fragment, the browser will NOT auto-scroll)
   - Recommendation: In `DocsPage`, add a `useEffect` that reads `window.location.hash`, extracts a section ID if present, and calls `document.getElementById(id)?.scrollIntoView()`. This handles the deep-link case that ROUTE-03 established but deferred to Phase 10.

---

## Environment Availability

Step 2.6: SKIPPED — all dependencies are npm packages; no external services, CLIs, or runtimes beyond Node.js/npm are required. The markdown file already exists at `docs/feature-cost-shared-vs-duplicated.md`.

---

## Project Constraints (from CLAUDE.md)

**Required tech stack (must not deviate):**
- React 19 + TypeScript
- Vite (build tool)
- shadcn/ui (Radix + Tailwind) — already installed
- Tailwind CSS 4 — `@plugin` directive, not JS config
- Recharts — not relevant to this phase

**What NOT to use:**
- D3.js directly — not applicable here
- CSS-in-JS (styled-components, emotion) — use Tailwind utility classes only
- jQuery — not applicable here

**GSD workflow enforcement:** All file changes must go through GSD workflow (`/gsd:execute-phase`). No direct edits outside GSD workflow unless user explicitly requests it.

---

## Sources

### Primary (HIGH confidence)
- **STATE.md locked decisions `[v1.2 Doc]`** — package versions and configuration decisions already made by the team: react-markdown 10.1.0 / remark-gfm 4.0.1 / rehype-slug 6.0.0 / @tailwindcss/typography 0.5.19; `doc-` prefix on rehype-slug; `?raw` import; module-level components constant
- **npm registry (verified 2026-03-24)** — current published versions confirmed: react-markdown 10.1.0, remark-gfm 4.0.1, rehype-slug 6.0.0, @tailwindcss/typography 0.5.19
- **GitHub: tailwindlabs/tailwindcss-typography** — `@plugin "@tailwindcss/typography"` is the v4 registration pattern; `prose` class system confirmed
- **rehype-slug v6 API docs** — `prefix` option confirmed; uses github-slugger algorithm; processes h1–h6 without existing IDs
- **react-markdown v10 API** — `remarkPlugins`, `rehypePlugins`, `components` props confirmed; module-level definition recommendation from official docs

### Secondary (MEDIUM confidence)
- **WebSearch: scroll-margin-top pattern** — verified against MDN and Tailwind docs: `scroll-mt-{n}` is the correct Tailwind utility; works on individual elements regardless of scroll container
- **WebSearch: @tailwindcss/typography Tailwind v4** — CSS-first `@plugin` directive confirmed as the v4 installation approach

### Tertiary (LOW confidence)
- **Custom `toSlug` function accuracy** — derived from understanding of github-slugger algorithm; needs runtime verification against actual heading IDs generated by rehype-slug

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions locked in STATE.md, confirmed against npm registry
- Architecture: HIGH — pattern derived from locked decisions and official docs
- Pitfalls: HIGH — pitfalls 1-4 derived from react-markdown/Tailwind official patterns; pitfall 5 from npm install semantics
- Slug function accuracy: LOW — untested against actual document headings; runtime verification required

**Research date:** 2026-03-24
**Valid until:** 2026-04-24 (stable libraries; Tailwind v4 plugin API unlikely to change)
