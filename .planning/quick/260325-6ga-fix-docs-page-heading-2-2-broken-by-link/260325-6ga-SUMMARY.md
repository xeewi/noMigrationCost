---
phase: quick
plan: 260325-6ga
subsystem: DocsSidebar
tags: [bug-fix, docs, sidebar, markdown, slug]
dependency_graph:
  requires: []
  provides: [clean-sidebar-headings, correct-anchor-slugs]
  affects: [DocsSidebar.tsx]
tech_stack:
  added: []
  patterns: [regex-link-stripping]
key_files:
  created: []
  modified:
    - src/components/DocsSidebar.tsx
decisions:
  - "stripMarkdownLinks applied before toSlug so sidebar slugs match rehype-slug output exactly"
metrics:
  duration: ~3m
  completed: "2026-03-25"
---

# Quick Task 260325-6ga: Fix Docs Page Heading 2.2 Broken by Link

**One-liner:** Added `stripMarkdownLinks` helper in DocsSidebar.tsx to strip `[text](url)` syntax from heading text before display and slug generation, fixing broken sidebar navigation for heading 2.2.

## What Was Done

Heading 2.2 "Types of Maintenance and Their Distribution" in the research doc contains inline citation links (`[[12]](url) [[13]](url)`). The `extractHeadings` function was passing raw markdown to both `text` (for display) and `toSlug` (for ID generation), causing two problems:

1. Sidebar displayed raw markdown syntax instead of clean text
2. Generated slug included URL characters, so it did not match the ID produced by `rehype-slug`, breaking scroll-to-section navigation

**Fix:** Added a `stripMarkdownLinks` helper that strips `[text](url)` patterns (preserving the link text), and applied it in `extractHeadings` before the `toSlug` call. The regex `\[([^\]]*)\]\([^)]*\)` handles nested brackets like `[[12]](url)` correctly — the outer `[...]` is plain text brackets, the inner `[12](url)` is the markdown link that gets stripped to `[12]`.

## Tasks

| # | Name | Status | Commit |
|---|------|--------|--------|
| 1 | Strip markdown links from extracted heading text | Done | 5e75c2e |

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- TypeScript: no errors (`npx tsc --noEmit` passed)
- Build: `npm run build` succeeded (`built in 2.09s`)
- Heading 2.2 sidebar text now reads "2.2 Types of Maintenance and Their Distribution [12] [13]" (clean, no URLs)
- Generated slug matches rehype-slug output: `doc-22-types-of-maintenance-and-their-distribution-12-13`

## Self-Check: PASSED

- [x] src/components/DocsSidebar.tsx modified with stripMarkdownLinks helper
- [x] Commit 5e75c2e exists and contains the fix
- [x] Build passes without TypeScript errors
