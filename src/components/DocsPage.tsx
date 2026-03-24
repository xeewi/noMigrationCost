import { useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import researchMd from '../../docs/feature-cost-shared-vs-duplicated.md?raw';
import { useActiveSection } from '../hooks/useActiveSection';
import { DocsSidebar, extractHeadings } from './DocsSidebar';

// Module-level constants — defined OUTSIDE the component to prevent re-parse on every render
const REMARK_PLUGINS = [remarkGfm];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REHYPE_PLUGINS: any[] = [[rehypeSlug, { prefix: 'doc-' }]];
const COMPONENTS = {
  h1: (props: React.ComponentProps<'h1'>) => <h1 className="scroll-mt-16" {...props} />,
  h2: (props: React.ComponentProps<'h2'>) => <h2 className="scroll-mt-16" {...props} />,
  h3: (props: React.ComponentProps<'h3'>) => <h3 className="scroll-mt-16" {...props} />,
  h4: (props: React.ComponentProps<'h4'>) => <h4 className="scroll-mt-16" {...props} />,
};

export function DocsPage() {
  const headingIds = useMemo(
    () => extractHeadings(researchMd).map((h) => h.id),
    []  // researchMd is module-level constant, stable reference
  );
  const activeId = useActiveSection(headingIds);

  // Deep-link scroll on mount — scrolls to section if URL contains a doc anchor
  useEffect(() => {
    const hash = window.location.hash;
    // Format: #/docs/doc-section-slug
    const match = hash.match(/^#\/docs\/(doc-.+)$/);
    if (match) {
      const el = document.getElementById(match[1]);
      if (el) {
        // requestAnimationFrame ensures DOM is painted before scroll
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8 pb-16 flex gap-8">
      <aside className="w-60 flex-shrink-0">
        <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <DocsSidebar markdown={researchMd} activeId={activeId} />
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
