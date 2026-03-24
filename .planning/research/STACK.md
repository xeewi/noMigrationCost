# Stack Research

**Domain:** React + Vite + TypeScript + shadcn/ui dashboard — Markdown documentation rendering milestone
**Researched:** 2026-03-24
**Confidence:** HIGH (all versions verified against npm registry)

---

> **Note on scope:** The base stack (React 19, Vite, TypeScript, shadcn/ui, Tailwind CSS 4, Recharts) is already installed and validated. This document covers ONLY the additions required for the v1.2 Documentation milestone: Markdown parsing/rendering, sidebar navigation, and hash-based anchor routing.

---

## New Additions Required

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| react-markdown | 10.1.0 | Render a Markdown string as React elements | Purpose-built for React — outputs React components, not `dangerouslySetInnerHTML`. Supports remark and rehype plugin pipelines. ESM-only, works natively in Vite. The dominant Markdown-in-React solution (14M weekly downloads). |
| remark-gfm | 4.0.1 | GitHub Flavored Markdown support | The research doc uses GFM features: tables, strikethrough, task lists, autolinked URLs. Without this plugin, tables render as raw text. Fully typed TypeScript. |
| rehype-slug | 6.0.0 | Add `id` attributes to all headings | Required for anchor navigation. Turns `## Section Title` into `<h2 id="section-title">`. Uses github-slugger — matches GitHub's behavior, predictable slug output. |
| @tailwindcss/typography | 0.5.19 | Style rendered Markdown HTML with `prose` class | react-markdown outputs unstyled HTML elements. The `prose` class applies readable defaults (heading sizes, list margins, table borders, code blocks) in one className. Version 0.5.19 explicitly supports Tailwind CSS v4 via `@plugin` directive in CSS. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| rehype-autolink-headings | 7.1.0 | Inject anchor link icons into headings | Use alongside rehype-slug to make headings self-linkable. Needed if users should be able to copy a deep link to a specific section. Optional for v1.2 — sidebar links to `#slug` work without it. |

### No Additional Routing Library Needed

Hash-based routing (`#/docs`, `#/docs#section-id`) can be implemented with `window.location.hash` and a `hashchange` event listener. The existing URL sharing (Phase 6) already encodes full app state in the hash. Adding React Router or a dedicated router for two views would add unnecessary dependency overhead and require reworking the existing hash-sharing mechanism.

### No Additional Dev Dependencies Needed

react-markdown ships TypeScript types. A single `/// <reference types="vite/client" />` in `vite-env.d.ts` (already present from Vite scaffold) provides the `?raw` import type. No extra `@types/*` packages required.

## Installation

```bash
# Core — render Markdown as React components with GFM and heading IDs
npm install react-markdown remark-gfm rehype-slug @tailwindcss/typography

# Optional — make headings self-linkable (defer to v1.3 if not in v1.2 scope)
npm install rehype-autolink-headings
```

## Vite Configuration for Markdown Import

Vite's built-in `?raw` suffix imports any file as a raw string — no plugin required.

```typescript
// In your Doc component
import docContent from '../../docs/feature-cost-shared-vs-duplicated.md?raw'
```

Add a TypeScript declaration if the editor complains (paste into `src/vite-env.d.ts`):

```typescript
/// <reference types="vite/client" />
// ?raw imports are covered by vite/client, but if the linter flags *.md add:
declare module '*.md?raw' {
  const content: string
  export default content
}
```

## Tailwind CSS v4 Typography Setup

In Tailwind v4, plugins are registered in CSS, not `tailwind.config.js`:

```css
/* src/index.css */
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

Then wrap the rendered Markdown:

```tsx
<article className="prose prose-slate dark:prose-invert max-w-none">
  <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
    {docContent}
  </Markdown>
</article>
```

`max-w-none` removes the prose plugin's default `65ch` max-width so the content fills the layout column width. `prose-slate` matches shadcn/ui's default color palette.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| react-markdown | marked + dangerouslySetInnerHTML | When the Markdown source is fully trusted and performance of rendering very large docs is a concern. For a research doc of normal size, react-markdown's overhead is negligible. marked does not integrate with React's component model, making custom rendering (e.g., wrapping code blocks in shadcn components) much harder. |
| react-markdown | MDX (vite-plugin-mdx) | When Markdown files need to contain live React components. Overkill here — the research doc is static prose with tables. MDX adds a compilation step and changes the authoring format. |
| rehype-slug | Manual id assignment | Manual ids require editing the source Markdown file. rehype-slug derives ids automatically from heading text — zero maintenance. |
| @tailwindcss/typography | Custom CSS | Writing typography CSS from scratch (heading hierarchy, list spacing, code block padding) is 150–300 lines. The prose plugin handles it correctly in ~1 className. |
| window.location.hash (custom) | React Router HashRouter | React Router adds 50 KB and requires refactoring the existing hash-based URL sharing (Phase 6). For two views (calculator / docs), the native hash API is the correct scope. |
| window.location.hash (custom) | Wouter (2.3 KB) | Wouter is a good lightweight option if routing grows to 5+ routes. For two views, even Wouter is overhead. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `dangerouslySetInnerHTML` with marked/markdown-it | Bypasses React's XSS sanitization. react-markdown renders React nodes, never raw HTML strings. The research doc may eventually accept user-contributed content, and the safe default avoids a security regression. | react-markdown |
| vite-plugin-markdown | Extra plugin complexity — Vite's native `?raw` suffix already handles importing a `.md` file as a string. The plugin adds transformation modes (HTML, ToC, etc.) not needed when react-markdown handles rendering. | Vite `?raw` suffix import |
| React Router / Next.js router | Adds significant bundle weight and requires rearchitecting the hash-sharing mechanism from Phase 6. The project is a static SPA with two views, not a multi-page application. | Native `window.location.hash` |
| remark-react (deprecated) | The `remark-react` package is deprecated. Its successor is react-markdown, which wraps the full remark/rehype pipeline. | react-markdown 10 |

## Stack Patterns for This Milestone

**Sidebar navigation (no library needed):**
- Extract heading nodes from the rendered AST using a custom rehype plugin, or parse headings from the raw Markdown string with a simple regex before rendering
- Build a `<nav>` with `<a href="#slug">` anchor links
- On click: `window.location.hash = '#' + slug` (no scroll fighting — browser handles it)

**Coexisting hash routing and section anchors:**
- Reserve `#/docs` for the view route (forward-slash prefix distinguishes it from section slugs)
- Reserve bare `#section-title` for in-page anchors within the doc view
- In `hashchange` handler: if `hash.startsWith('#/')`, it's a route change; otherwise it's a scroll-to-anchor

**Sidebar scroll-spy (optional, v1.3):**
- Use `IntersectionObserver` on heading elements to highlight the active sidebar entry as the user scrolls
- No library needed — native browser API

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| react-markdown@10.1.0 | React 19, ESM (Vite 6), TypeScript 5.x | ESM-only — Vite's ESM-first architecture makes this a non-issue |
| remark-gfm@4.0.1 | react-markdown@10, Node 16+ | Must match react-markdown's unified version — using the same major works cleanly |
| rehype-slug@6.0.0 | react-markdown@10, rehype ecosystem | Part of the same unified/rehype monorepo — compatible by design |
| rehype-autolink-headings@7.1.0 | rehype-slug@6 (must run after) | Plugin order matters: rehype-slug first, then rehype-autolink-headings |
| @tailwindcss/typography@0.5.19 | Tailwind CSS v4.x | v0.5.15+ added v4 support; v0.5.19 is the latest stable as of 2026-03-24 |

## Sources

- npm registry — react-markdown@10.1.0 confirmed latest — HIGH confidence
  (verified via `npm info react-markdown version`)
- npm registry — remark-gfm@4.0.1 confirmed latest — HIGH confidence
  (verified via `npm info remark-gfm version`)
- npm registry — rehype-slug@6.0.0 confirmed latest — HIGH confidence
  (verified via `npm info rehype-slug version`)
- npm registry — rehype-autolink-headings@7.1.0 confirmed latest — HIGH confidence
  (verified via `npm info rehype-autolink-headings version`)
- npm registry — @tailwindcss/typography@0.5.19 confirmed latest — HIGH confidence
  (verified via `npm info @tailwindcss/typography version`)
- GitHub tailwindlabs/tailwindcss-typography releases — v0.5.15+ confirmed Tailwind v4 support — HIGH confidence
  https://github.com/tailwindlabs/tailwindcss-typography/releases
- Tailwind CSS v4 docs — `@plugin` directive confirmed as the v4 method for first-party plugins — HIGH confidence
  https://tailwindcss.com/blog/tailwindcss-v4
- react-markdown GitHub — v10 confirmed ESM-only, TypeScript types included — HIGH confidence
  https://github.com/remarkjs/react-markdown
- Vite docs — `?raw` suffix confirmed as built-in static asset handling — HIGH confidence
  https://vite.dev/guide/assets
- WebSearch: "react-markdown vs marked vs remark react 2026" — react-markdown confirmed dominant for React integration, marked recommended only for non-React or performance-critical contexts — MEDIUM confidence
- WebSearch: "hash routing React no react-router 2025" — native `window.location.hash` confirmed viable for simple SPA view-switching — MEDIUM confidence

---
*Stack research for: Markdown documentation rendering — v1.2 milestone addition to React+Vite+TypeScript+shadcn/ui dashboard*
*Researched: 2026-03-24*
