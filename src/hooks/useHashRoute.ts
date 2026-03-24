/**
 * @file useHashRoute.ts
 * @author Guillaume Gautier (xeewi)
 * @created 2026-03-24
 * @project Feature Cost Calculator
 */

import { useState, useEffect, useCallback } from 'react';

export type View = 'calculator' | 'docs';

/**
 * Derives the current view from a raw hash string.
 *
 * Namespace discriminator: base64url alphabet (RFC 4648) never produces `/`,
 * so `hash.startsWith('/')` is a lossless discriminator for route hashes
 * vs calculator state hashes (D-11 from RESEARCH.md).
 */
function deriveView(rawHash: string): View {
  const hash = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
  return hash.startsWith('/') ? 'docs' : 'calculator';
}

/**
 * Hash-based routing hook.
 *
 * - Lazy initializer prevents flash of wrong view on deep-link (RESEARCH.md Pitfall 2)
 * - hashchange listener keeps view in sync with browser back/forward (RESEARCH.md Pitfall 3)
 * - navigateTo writes hash and lets the hashchange event update state
 */
export function useHashRoute(): { view: View; navigateTo: (target: View, sectionId?: string) => void } {
  const [view, setView] = useState<View>(() => deriveView(window.location.hash));

  useEffect(() => {
    function handleHashChange() {
      setView(deriveView(window.location.hash));
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigateTo = useCallback((target: View, sectionId?: string) => {
    if (target === 'docs') {
      window.location.hash = sectionId ? '/docs/' + sectionId : '/docs';
    } else {
      window.location.hash = '';
    }
  }, []);

  return { view, navigateTo };
}
