import { useMemo } from 'react';

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

interface DocsSidebarProps {
  markdown: string;
}

export function DocsSidebar({ markdown }: DocsSidebarProps) {
  const headings = useMemo(() => extractHeadings(markdown), [markdown]);

  return (
    <nav aria-label="Table of contents">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Contents
      </p>
      {headings.map((entry) => (
        <a
          key={entry.id}
          href={`#/docs/${entry.id}`}
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = `/docs/${entry.id}`;
            document.getElementById(entry.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className={
            entry.level === 2
              ? "block py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              : "block py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors pl-4"
          }
        >
          {entry.text}
        </a>
      ))}
    </nav>
  );
}
