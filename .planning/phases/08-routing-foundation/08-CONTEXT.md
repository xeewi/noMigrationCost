# Phase 9: Routing Foundation - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can switch between the calculator and documentation views via AppHeader nav links, using hash-based routing that coexists with the existing URL state sharing. Browser back/forward works correctly, calculator state is preserved across view switches, and doc section deep-links are shareable.

</domain>

<decisions>
## Implementation Decisions

### Navigation Links
- **D-01:** Add "Calculator" and "Documentation" text links as a nav group in AppHeader, positioned near the app title
- **D-02:** Active view gets a visual indicator (underline, bold, or similar) to show which view the user is on
- **D-03:** Reset All button only shown on calculator view — it has no meaning on the docs page
- **D-04:** Copy Link works on both views — copies the current URL including the current hash (state hash on calculator, route hash on docs)

### Route Transition
- **D-05:** Instant view swap with no transition animation — simple and appropriate for a utility app
- **D-06:** No router library — simple state-based routing with a `view` state derived from the URL hash

### Calculator State Preservation
- **D-07:** Keep the calculator component tree mounted but hidden (CSS `display:none`) when viewing docs — guarantees zero state loss on round-trip without needing hash restore logic
- **D-08:** Hash-write guard: the debounced state-encode `useEffect` in App.tsx must not fire when the current view is docs — prevents overwriting the docs hash with calculator state

### URL Hash Format
- **D-09:** `#/docs` for the documentation home page; `#/docs/{section-id}` for deep links to specific sections
- **D-10:** Empty hash or base64url-encoded hash = calculator view (existing behavior, unchanged)
- **D-11:** Namespace discriminator: hash starting with `/` = route; anything else = calculator state (base64url alphabet per RFC 4648 never produces `/`, so namespaces are disjoint — already decided during v1.2 roadmap)
- **D-12:** `rehype-slug` configured with prefix `doc-` to prevent heading IDs from matching base64url state hashes (already decided during v1.2 roadmap)

### Claude's Discretion
- Exact visual styling of active/inactive nav links (color, weight, underline variant)
- Whether nav links use `<a>` tags with href or `<button>` elements with click handlers
- Internal hook design for hash-based routing (custom `useHashRoute` or inline logic)
- How the view state is threaded through the component tree (prop drilling, context, or co-located in App.tsx)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing URL State System
- `src/lib/url-state.ts` — `encodeAppState` / `decodeAppState` / `applyStateToSetters` — the hash encoding system that must coexist with route hashes
- `src/App.tsx` — Hash read effect (line 63-74), hash write effect (line 77-88), all useState hooks defining calculator state

### App Shell Components
- `src/components/AppHeader.tsx` — Current header with Copy Link + Reset All; nav links will be added here
- `src/components/AppFooter.tsx` — Footer shared across both views (no changes needed)

### Requirements
- `.planning/REQUIREMENTS.md` §Routing — ROUTE-01 through ROUTE-05

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `AppHeader` component: already structured with left (title) and right (buttons) sections — nav links fit naturally between them
- `url-state.ts`: `decodeAppState` returns null for non-base64url hashes — route hashes (starting with `/`) will naturally fail decode and be handled by routing logic
- shadcn/ui Button component: available for nav link styling

### Established Patterns
- State lifted to App.tsx with individual `useState` hooks — view state will follow same pattern
- `useEffect` for hash read on mount and hash write on state change — routing will extend this pattern
- `useCallback` for event handlers (e.g., `handleReset`)

### Integration Points
- App.tsx `return` block: calculator JSX will be conditionally shown/hidden based on view state; docs view rendered alongside
- App.tsx hash-read effect: needs to distinguish route hashes (`/docs/...`) from state hashes (base64url) on mount
- App.tsx hash-write effect: needs a guard condition to skip when `view !== 'calculator'`
- `window.addEventListener('hashchange', ...)` needed for browser back/forward support (ROUTE-04)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — user deferred all decisions to Claude's best judgment. Standard approaches preferred.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-routing-foundation*
*Context gathered: 2026-03-24*
