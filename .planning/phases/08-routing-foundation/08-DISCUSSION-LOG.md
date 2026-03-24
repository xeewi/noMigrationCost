# Phase 9: Routing Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-24
**Phase:** 09-routing-foundation
**Areas discussed:** Nav link design, Route transition behavior, Calculator state preservation, URL format for docs

---

## Nav Link Design

| Option | Description | Selected |
|--------|-------------|----------|
| Text links near title | Calculator/Documentation as text nav links next to app title | |
| Tab-style nav | Tab component for view switching | |
| Dropdown menu | Single menu with view options | |

**User's choice:** "I let you decide the best decision for all of that"
**Notes:** Claude selected text links near title — fits the existing AppHeader layout (title left, buttons right). Nav links sit naturally between them. Active view gets visual indicator.

---

## Route Transition Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Instant swap | No animation, immediate view switch | |
| Fade transition | Crossfade between views | |

**User's choice:** Deferred to Claude
**Notes:** Claude selected instant swap — simplest approach for a utility app with only two views. Reset All hidden on docs view; Copy Link works on both.

---

## Calculator State Preservation

| Option | Description | Selected |
|--------|-------------|----------|
| Mount/hide (CSS) | Keep calculator mounted but hidden via display:none | |
| Unmount/restore | Unmount calculator, restore state from hash on return | |

**User's choice:** Deferred to Claude
**Notes:** Claude selected mount/hide — guarantees zero state loss without restore complexity. Hash-write guard prevents encode effect from firing on docs view.

---

## URL Format for Docs

| Option | Description | Selected |
|--------|-------------|----------|
| #/docs and #/docs/{id} | Route prefix with section deep-links | |
| #docs and #docs-{id} | No slash prefix | |

**User's choice:** Deferred to Claude
**Notes:** Claude selected #/docs format — the `/` prefix discriminator was already decided during v1.2 roadmap planning. Base64url never produces `/`, making namespaces disjoint.

---

## Claude's Discretion

- All four areas above — user delegated all decisions to Claude's judgment
- Visual styling of nav links (active/inactive states)
- Internal routing hook design
- View state threading through component tree

## Deferred Ideas

None — discussion stayed within phase scope
