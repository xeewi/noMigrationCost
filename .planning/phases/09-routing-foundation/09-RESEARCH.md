# Phase 9: Routing Foundation - Research

**Researched:** 2026-03-24
**Domain:** Hash-based client-side routing without a router library; React view switching; URL hash coexistence
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Add "Calculator" and "Documentation" text links as a nav group in AppHeader, positioned near the app title
- **D-02:** Active view gets a visual indicator (underline, bold, or similar) to show which view the user is on
- **D-03:** Reset All button only shown on calculator view
- **D-04:** Copy Link works on both views — copies current URL including current hash
- **D-05:** Instant view swap with no transition animation
- **D-06:** No router library — simple state-based routing with a `view` state derived from the URL hash
- **D-07:** Keep the calculator component tree mounted but hidden (CSS `display:none`) when viewing docs — guarantees zero state loss on round-trip
- **D-08:** Hash-write guard: the debounced state-encode `useEffect` in App.tsx must not fire when the current view is docs
- **D-09:** `#/docs` for the documentation home page; `#/docs/{section-id}` for deep links to specific sections
- **D-10:** Empty hash or base64url-encoded hash = calculator view (existing behavior, unchanged)
- **D-11:** Namespace discriminator: hash starting with `/` = route; anything else = calculator state (base64url alphabet per RFC 4648 never produces `/`, so namespaces are disjoint)
- **D-12:** `rehype-slug` configured with prefix `doc-` to prevent heading IDs from matching base64url state hashes

### Claude's Discretion

- Exact visual styling of active/inactive nav links (color, weight, underline variant)
- Whether nav links use `<a>` tags with href or `<button>` elements with click handlers
- Internal hook design for hash-based routing (custom `useHashRoute` or inline logic)
- How the view state is threaded through the component tree (prop drilling, context, or co-located in App.tsx)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ROUTE-01 | User can navigate to the documentation page via a link in the AppHeader | D-01 nav links in AppHeader; `<a href="#/docs">` pattern; `view` state drives conditional render |
| ROUTE-02 | User can navigate back to the calculator via a link in the AppHeader from the docs page | Same nav group; click sets `window.location.hash = ''` or `'#/'` — hash-read detects empty → calculator |
| ROUTE-03 | User can share a URL that deep-links to a specific documentation section | D-09 `#/docs/{section-id}` format; mount hash-read parses this; docs page scrolls to element with matching `id` |
| ROUTE-04 | User can use browser back/forward to switch between calculator and docs views | `window.addEventListener('hashchange', handler)` in App.tsx; handler re-derives `view` from `window.location.hash` |
| ROUTE-05 | User's calculator inputs are preserved when switching to docs and back | D-07 mount-but-hide (CSS `display:none`); D-08 hash-write guard prevents overwriting; React state stays live |

</phase_requirements>

---

## Summary

Phase 9 implements hash-based client-side routing without any router library. The routing layer is a thin wrapper around `window.location.hash` and `window.addEventListener('hashchange', ...)`, deriving a `view` value (`'calculator' | 'docs'`) from the hash on every navigation event. The discriminator between route hashes and calculator-state hashes is already proven correct: the base64url alphabet (RFC 4648) never produces a `/` character, so `hash.startsWith('/')` is a lossless discriminator with zero collision risk.

Calculator state is preserved across view switches by mounting the calculator subtree permanently and toggling visibility with `className={view === 'calculator' ? '' : 'hidden'}` (Tailwind's `display: none`). This is the simplest, most reliable state-preservation approach for a React app with many lifted `useState` hooks — no serialization or restoration logic needed. The debounced hash-write `useEffect` in App.tsx must be guarded to skip when `view === 'docs'` to prevent the calculator state encoder from overwriting the docs route hash.

The only novel work in this phase is: (1) adding a `view` state and `hashchange` listener to App.tsx, (2) adding nav links to AppHeader with active-state styling, (3) guarding the hash-write effect, and (4) conditionally rendering the `Reset All` button. No new packages are needed.

**Primary recommendation:** Implement routing as a custom `useHashRoute` hook that encapsulates the `hashchange` listener and returns `{ view, navigateTo }`. Co-locate the hook in `src/hooks/useHashRoute.ts`. Thread `view` down to AppHeader as a prop.

---

## Standard Stack

### Core

No new libraries required. All needed capabilities are native browser APIs and existing project dependencies.

| Capability | Implementation | Source |
|------------|---------------|--------|
| Route detection | `window.location.hash.startsWith('/')` | Native browser API |
| Navigation events | `window.addEventListener('hashchange', fn)` | Native browser API |
| State preservation | Tailwind `hidden` class (`display: none`) | Already installed |
| Nav link styling | shadcn/ui Button (ghost/link variant) or plain `<a>` | Already installed |
| Hash mutation | `window.location.hash = '/docs'` or `window.location.hash = ''` | Native browser API |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom hash routing | React Router v6 | Overkill; requires BrowserRouter or HashRouter setup, changes link semantics, adds 50KB+ bundle; **locked out by D-06** |
| `display:none` via Tailwind `hidden` | React `key`-based unmount/remount | Unmounting destroys all useState; re-mounting requires full URL-hash restore logic — more complex |
| `display:none` via Tailwind `hidden` | React Context for global state | Moves state out of App.tsx, larger refactor; not needed when mount-and-hide avoids the problem entirely |

**Installation:** No new packages.

---

## Architecture Patterns

### View Type

```typescript
// src/hooks/useHashRoute.ts
type View = 'calculator' | 'docs';
```

### Pattern 1: Hash Discriminator

The namespace discriminator is already decided and proven safe.

```typescript
// Source: D-11 (CONTEXT.md) — verified against RFC 4648 §5
function deriveView(hash: string): View {
  // hash = window.location.hash.slice(1) — strip the leading '#'
  // Route hashes start with '/' (e.g., '/docs', '/docs/section-id')
  // Calculator hashes are base64url — RFC 4648 alphabet: A-Z a-z 0-9 - _
  // '/' is NOT in the base64url alphabet, so namespaces are disjoint
  return hash.startsWith('/') ? 'docs' : 'calculator';
}
```

**Confidence:** HIGH — RFC 4648 §5 defines base64url as using `-` and `_` instead of `+` and `/`. The existing `encodeAppState` confirms: it replaces `/` with `_` on line 73 of `url-state.ts`. So a calculator hash will never start with `/`.

### Pattern 2: useHashRoute Hook

```typescript
// src/hooks/useHashRoute.ts
import { useState, useEffect, useCallback } from 'react';

type View = 'calculator' | 'docs';

function deriveView(rawHash: string): View {
  const hash = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
  return hash.startsWith('/') ? 'docs' : 'calculator';
}

export function useHashRoute() {
  const [view, setView] = useState<View>(() =>
    deriveView(window.location.hash)
  );

  useEffect(() => {
    function handleHashChange() {
      setView(deriveView(window.location.hash));
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = useCallback((target: View, sectionId?: string) => {
    if (target === 'docs') {
      window.location.hash = sectionId ? `/docs/${sectionId}` : '/docs';
    } else {
      // Return to calculator: clear route hash; let hash-read effect on next
      // navigation remain inert (empty hash → calculator default state)
      window.location.hash = '';
    }
  }, []);

  return { view, navigateTo };
}
```

### Pattern 3: Hash-Write Guard in App.tsx

The existing hash-write `useEffect` (lines 77-88 of App.tsx) runs whenever calculator state changes. When `view === 'docs'`, this must not fire — it would overwrite the `/docs` route hash with encoded calculator state.

```typescript
// App.tsx — modified hash-write effect
useEffect(() => {
  if (view !== 'calculator') return; // guard: don't overwrite route hash
  const id = setTimeout(() => {
    window.location.hash = encodeAppState(
      team, sizingMode, storyPoints, velocity, sprintWeeks,
      directValue, directUnit, horizonYears, advancedParams,
      nbConsumingCodebases, activeTab,
    );
  }, 300);
  return () => clearTimeout(id);
}, [view, team, sizingMode, storyPoints, velocity, sprintWeeks,
    directValue, directUnit, horizonYears, advancedParams,
    nbConsumingCodebases, activeTab]);
```

Note: `view` must be added to the dependency array so the guard is re-evaluated when view changes.

### Pattern 4: Mount-but-Hide (State Preservation)

```tsx
// App.tsx return block — simplified structure
return (
  <div className="min-h-screen bg-background text-foreground">
    <AppHeader onReset={handleReset} view={view} onNavigate={navigateTo} />

    {/* Calculator view — always mounted, hidden when on docs */}
    <div className={view === 'calculator' ? '' : 'hidden'}>
      <div className="max-w-[1280px] mx-auto px-6 py-8 pb-16">
        {/* ...existing calculator JSX unchanged... */}
      </div>
    </div>

    {/* Docs view — rendered when view === 'docs' */}
    {view === 'docs' && (
      <div className="max-w-[1280px] mx-auto px-6 py-8 pb-16">
        {/* DocsPage component — Phase 10 */}
      </div>
    )}

    <AppFooter />
  </div>
);
```

**Why `hidden` on the calculator div rather than on individual children:** Wrapping all calculator JSX in a single container div with `hidden` is the simplest change — no modification to existing child components.

### Pattern 5: Nav Links in AppHeader

AppHeader currently receives `onReset: () => void`. It needs two new props for Phase 9:

```typescript
interface AppHeaderProps {
  onReset: () => void;
  view: 'calculator' | 'docs';           // which view is active
  onNavigate: (target: 'calculator' | 'docs') => void;
}
```

Nav link implementation — two options within Claude's discretion:

**Option A: `<a>` tags with href (preferred for accessibility and browser native behavior)**
```tsx
<nav className="flex items-center gap-1" aria-label="Main navigation">
  <a
    href="#"
    onClick={(e) => { e.preventDefault(); onNavigate('calculator'); }}
    className={cn(
      "text-sm font-medium px-2 py-1 rounded transition-colors",
      view === 'calculator'
        ? "text-foreground underline underline-offset-4"
        : "text-muted-foreground hover:text-foreground"
    )}
    aria-current={view === 'calculator' ? 'page' : undefined}
  >
    Calculator
  </a>
  <a
    href="#/docs"
    onClick={(e) => { e.preventDefault(); onNavigate('docs'); }}
    className={cn(
      "text-sm font-medium px-2 py-1 rounded transition-colors",
      view === 'docs'
        ? "text-foreground underline underline-offset-4"
        : "text-muted-foreground hover:text-foreground"
    )}
    aria-current={view === 'docs' ? 'page' : undefined}
  >
    Documentation
  </a>
</nav>
```

**Option B: shadcn/ui Button ghost variant** — less semantically appropriate for navigation; `<a>` is preferred.

**Recommendation:** Use `<a>` tags with `aria-current` for correct accessibility semantics. Active state: `text-foreground` + `underline-offset-4` (Tailwind). Inactive: `text-muted-foreground` with hover to `text-foreground`.

### Pattern 6: Deep-Link Section Scroll (ROUTE-03)

When the app mounts with `#/docs/section-id`, or when a sidebar anchor is clicked within the docs view, the docs page needs to scroll to the heading with `id="doc-{section-id}"` (the `doc-` prefix is set by `rehype-slug` per D-12 — Phase 10 concern, but the hash format is established here).

For this phase, the hash-read effect simply needs to detect the `/docs/...` pattern and set `view = 'docs'`. Actual section scrolling is Phase 10/11 concern, but the URL format is locked by D-09.

```typescript
// Hash-read on mount — extended to handle routing
useEffect(() => {
  const raw = window.location.hash.slice(1); // strip '#'
  if (!raw) return;

  if (raw.startsWith('/')) {
    // Route hash — view already set by useHashRoute initial state
    // No calculator state to restore
    return;
  }

  // Calculator state hash — existing decode logic
  const state = decodeAppState(raw);
  if (!state) return;
  applyStateToSetters(state, { ... });
}, []);
```

The existing hash-read effect at lines 63-74 of App.tsx already handles this correctly: `decodeAppState('/docs/introduction')` will throw in `atob()` and return `null` (the `try/catch` in `decodeAppState` handles it). The guard `if (!state) return` already exists. So the hash-read effect needs no change for routing — `useHashRoute` initializes `view` before any effects run via the lazy initializer (`useState<View>(() => deriveView(window.location.hash))`).

**Confidence:** HIGH — verified against the actual `decodeAppState` implementation in `url-state.ts`.

### Recommended Project Structure Addition

```
src/
├── hooks/
│   └── useHashRoute.ts    # New: hash routing hook
├── components/
│   ├── AppHeader.tsx      # Modified: add nav links, view/onNavigate props
│   └── ...                # No changes to other components
├── App.tsx                # Modified: useHashRoute, view guard, mount-hide
└── ...
```

### Anti-Patterns to Avoid

- **Writing `window.location.hash = value` in both the hook and the effect:** Only the hook's `navigateTo` and the calculator's debounced encoder should write the hash. Avoid multiple writers.
- **Using `useEffect` with empty deps to read initial hash:** Use a lazy state initializer (`useState(() => deriveView(window.location.hash))`) for synchronous initial state — avoids a flash of the wrong view on mount.
- **Triggering hash-write on docs-view render:** If `view` is not in the hash-write effect's dependency array, the guard cannot fire correctly. Always include `view` in deps.
- **Using `router.push`-style navigation:** This is not React Router. Hash mutations are synchronous and trigger `hashchange` events that drive state — do not attempt to set state directly in `navigateTo`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Active nav link detection | Custom comparison logic per link | Single `view === 'calculator'` ternary | State already derives from hash — no extra tracking |
| State preservation on route switch | Serialization/deserialization of all inputs | CSS `display:none` on calculator container | D-07 — React state stays live in memory; simpler, zero risk of restore bugs |
| Hash format negotiation | Complex parsing logic | `startsWith('/')` discriminator | D-11 — already proven disjoint from base64url alphabet |

**Key insight:** The hash namespace discriminator eliminates all ambiguity. There is no need for complex parsing — a single `startsWith('/')` check is the entire routing decision.

---

## Common Pitfalls

### Pitfall 1: Hash-Write Fires When View Is Docs
**What goes wrong:** User clicks "Documentation", hash changes to `#/docs`. The 300ms debounced hash-write effect in App.tsx fires (because no dependencies changed), overwriting the hash with base64url-encoded calculator state. Browser URL shows state hash, not route hash. Back button and shared URL are broken.
**Why it happens:** The existing hash-write effect has no guard — it was written when routing did not exist.
**How to avoid:** Add `if (view !== 'calculator') return;` as the first line of the hash-write effect. Add `view` to the effect's dependency array.
**Warning signs:** Clicking "Documentation" briefly shows `#/docs` then immediately changes to a base64url hash.

### Pitfall 2: Flash of Calculator View on Docs Deep-Link
**What goes wrong:** User opens `example.com/#/docs/introduction`. The page briefly renders the calculator before switching to docs.
**Why it happens:** Using `useState('calculator')` as initial state, then a `useEffect` to detect the hash and call `setView('docs')`. Effects run after first render.
**How to avoid:** Use a lazy state initializer: `useState<View>(() => deriveView(window.location.hash))`. This runs synchronously before first render.
**Warning signs:** Visible flash or layout shift on hard refresh to a `/docs` URL.

### Pitfall 3: hashchange Listener Not Cleaned Up
**What goes wrong:** Memory leak and double-firing if App remounts (unusual in production, common in React StrictMode dev).
**Why it happens:** `addEventListener` without corresponding `removeEventListener` in the `useEffect` cleanup.
**How to avoid:** Always return `() => window.removeEventListener('hashchange', handleHashChange)` from the `useEffect`.
**Warning signs:** In StrictMode, navigation events fire twice.

### Pitfall 4: Calculator Hidden but Still Encoding Hash
**What goes wrong:** With `display:none`, the calculator DOM is hidden but React state is live. Any state change (even from a prior interaction) could trigger the hash-write effect. Without the guard, this overwrites the route hash.
**Why it happens:** Calculator input state may change from effects (e.g., hash-read populating fields on mount). These trigger the debounced hash-write even while view is `'docs'`.
**How to avoid:** Guard in the hash-write effect is mandatory, not optional. See Pattern 3 above.

### Pitfall 5: Prop Interface Breaking Change in AppHeader
**What goes wrong:** AppHeader currently receives only `onReset`. Adding required props `view` and `onNavigate` without updating all call sites breaks TypeScript compilation.
**Why it happens:** App.tsx is the only consumer, but the interface change must be applied atomically.
**How to avoid:** Add both props to `AppHeaderProps` interface and the `App.tsx` call site in the same task/commit.

### Pitfall 6: Empty Hash Calculator Navigation
**What goes wrong:** Clicking "Calculator" sets `window.location.hash = ''`, which removes the hash from the URL. The hash-write effect then fires (after 300ms) and sets a calculator-state hash. This is correct behavior — but if the hash-write effect fires before the guard check stabilizes, there could be a race.
**Why it happens:** `hashchange` fires immediately when hash is set to `''`. The guard `view !== 'calculator'` transitions. Then the debounced hash-write runs 300ms later.
**How to avoid:** The sequence is actually correct — by the time the 300ms debounce fires, `view` is already `'calculator'`, so the guard passes and the hash-write runs normally. No special handling needed.

---

## Code Examples

### Existing decodeAppState Behavior on Route Hash (Verified)

```typescript
// Source: src/lib/url-state.ts lines 77-89
// Calling decodeAppState('/docs/introduction') will:
// 1. Replace - with +, _ with / → '/docs/introduction' (no replacements)
// 2. Pad to multiple of 4 → '/docs/introduction==='
// 3. atob('/docs/introduction===') → throws (not valid base64)
// 4. catch block returns null
// Result: null → existing guard `if (!state) return` in App.tsx handles it
```

This means the hash-read effect in App.tsx requires NO modification for routing — it already handles route hashes gracefully via the existing null-check.

### Tailwind `hidden` Class

```tsx
// Tailwind applies: display: none
// All React state inside the hidden subtree remains live in memory
<div className={view === 'calculator' ? '' : 'hidden'}>
  {/* entire calculator JSX — unchanged */}
</div>
```

Confirmed behavior: `display: none` does not unmount React components. All `useState` values are preserved. DOM nodes exist in memory but are not painted.

### Copy Link on Both Views (D-04)

The existing `handleCopyLink` in AppHeader already calls `window.location.href`, which includes the current hash. No modification needed — it will correctly copy `#/docs/section-id` when on docs view, and the calculator state hash when on calculator view.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|-----------------|--------------|--------|
| Hash routing via React Router HashRouter | Custom `hashchange` listener (no library) | React Router v6+ recommends BrowserRouter; HashRouter still exists but discouraged | Avoids library overhead; appropriate for SPAs without server-side routing needs |
| Direct `window.onhashchange` assignment | `addEventListener('hashchange', fn)` | Always preferred | Supports multiple listeners; proper cleanup via `removeEventListener` |

---

## Open Questions

1. **Docs view placeholder for Phase 9**
   - What we know: Phase 9 adds routing infrastructure; Phase 10 adds the actual docs content (DocsPage component with react-markdown).
   - What's unclear: Should Phase 9 render a placeholder `<div>` for the docs view, or simply leave `view === 'docs'` rendering nothing (or a loading state)?
   - Recommendation: Render a minimal placeholder (`<div className="p-8 text-muted-foreground">Documentation coming soon.</div>`) so ROUTE-01 and ROUTE-02 are testable manually even before Phase 10.

2. **Navigator link position in AppHeader**
   - What we know: D-01 says "positioned near the app title." AppHeader has title on left, buttons on right.
   - What's unclear: Between title and buttons, or as a separate centered group?
   - Recommendation: Place nav links between the title (left) and the buttons (right), within the same flex row — title | [nav links] | [Copy Link] [Reset All].

---

## Environment Availability

Step 2.6: SKIPPED — this phase is code-only changes. No external tools, services, CLIs, or runtimes beyond the existing Vite + React dev stack are required.

---

## Sources

### Primary (HIGH confidence)
- `src/lib/url-state.ts` (project source) — verified `decodeAppState` error handling and base64url encoding; confirmed `/` is replaced with `_` (line 73), proving route hash discriminator is safe
- `src/App.tsx` (project source) — verified hash-read effect (lines 63-74), hash-write effect (lines 77-88); confirmed structure for guard insertion
- `src/components/AppHeader.tsx` (project source) — verified current props interface and layout structure
- RFC 4648 §5 (base64url alphabet) — `A-Za-z0-9-_` never includes `/`; discriminator proven disjoint

### Secondary (MEDIUM confidence)
- MDN Web Docs: `hashchange` event — event fires synchronously when `window.location.hash` changes; `window.addEventListener` / `removeEventListener` cleanup pattern standard
- React docs: `useState` lazy initializer — runs synchronously before first render, avoids flash

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages; all implementation uses verified existing code paths
- Architecture: HIGH — all patterns derived directly from existing codebase code; discriminator mathematically proven
- Pitfalls: HIGH — identified from direct reading of existing effects in App.tsx; no speculation

**Research date:** 2026-03-24
**Valid until:** 2026-06-24 (stable platform; no version-sensitive decisions)
