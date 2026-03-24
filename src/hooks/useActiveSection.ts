/**
 * @file useActiveSection.ts
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-24
 * @project Feature Cost Calculator
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-spy hook using IntersectionObserver.
 *
 * Tracks the heading element with the highest intersection ratio and returns
 * its id as the "active" section. The Map-based ratio approach prevents flicker
 * at section boundaries (multiple headings partially visible simultaneously).
 *
 * rootMargin: '-10% 0px -80% 0px' — fires when heading enters the top 10-20%
 * of the viewport, matching typical "currently reading" expectation.
 */
export function useActiveSection(ids: string[]): string {
  const [activeId, setActiveId] = useState<string>(() => ids[0] ?? '');
  const ratioMap = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratioMap.current.set(entry.target.id, entry.intersectionRatio);
        }

        let best = '';
        let bestRatio = 0;
        for (const [id, ratio] of ratioMap.current) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }

        if (best !== '' && bestRatio > 0) {
          setActiveId(best);
        }
      },
      {
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
