/**
 * @file DocsSidebar.tsx
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-24
 * @project Feature Cost Calculator
 */

import { useMemo, useEffect, useRef } from 'react';

export interface HeadingEntry {
  id: string;    // "doc-{slug}" — matches rehype-slug output with prefix: 'doc-'
  text: string;  // display text for sidebar link
  level: 2 | 3;  // h2 or h3 only
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function extractHeadings(markdown: string): HeadingEntry[] {
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

export interface DocsSidebarProps {
  markdown: string;
  activeId: string;
}

export function DocsSidebar({ markdown, activeId }: DocsSidebarProps) {
  const headings = useMemo(() => extractHeadings(markdown), [markdown]);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  useEffect(() => {
    if (!activeId) return;
    const el = linkRefs.current.get(activeId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeId]);

  return (
    <nav aria-label="Table of contents">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Contents
      </p>
      {headings.map((entry) => (
        <a
          key={entry.id}
          href={`#/docs/${entry.id}`}
          ref={(node) => {
            if (node) linkRefs.current.set(entry.id, node);
            else linkRefs.current.delete(entry.id);
          }}
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = `/docs/${entry.id}`;
            document.getElementById(entry.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className={[
            "block py-1.5 text-sm transition-colors",
            entry.id === activeId ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
            entry.level === 3 ? "pl-4" : "",
          ].join(" ")}
        >
          {entry.text}
        </a>
      ))}
    </nav>
  );
}
