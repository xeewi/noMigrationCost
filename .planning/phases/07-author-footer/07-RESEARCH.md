# Phase 7: Author Footer - Research

**Researched:** 2026-03-24
**Domain:** React component authoring — fixed footer, icon-only links, inline SVG brand icons
**Confidence:** HIGH

## Summary

Phase 7 adds a fixed-position footer banner that always stays visible at the viewport bottom. It identifies the author (Guillaume Gautier / xeewi) with icon-only links to GitHub, Malt, and LinkedIn. The implementation is purely additive: one new component file, two integration points in App.tsx (render footer + add bottom padding to content wrapper).

The most important discovery from research: **lucide-react v1.0 (installed: 1.0.1) removed all brand icons**, including Github and LinkedIn, due to legal concerns. The CONTEXT.md assumption that "GitHub and LinkedIn icons from lucide-react" are available is incorrect for the installed version. Additionally, `simple-icons` v16 does not include LinkedIn either (removed for the same legal reasons). All three icons — GitHub, Malt, LinkedIn — must be implemented as inline SVGs. This is consistent with decision D-07's handling of Malt, and simply extends the same pattern to all three.

SVG path data for all three icons has been sourced: GitHub from simple-icons v16 (CDN-verified), Malt from simple-icons v16 (CDN-verified), LinkedIn from Bootstrap Icons (a permissive open-source source — Bootstrap Icons MIT license, and LinkedIn's own guidelines encourage linking to profiles using their "in" mark).

**Primary recommendation:** Implement `AppFooter.tsx` as a named export following the exact AppHeader pattern. Use three inline SVG components (`GitHubIcon`, `MaltIcon`, `LinkedInIcon`) defined in the same file or as small sibling files. Wrap each in `Button variant="ghost" size="icon"` rendered as an anchor tag.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Fixed to viewport bottom — `position: fixed; bottom: 0` so the footer is always visible without scrolling (FOOT-01 requirement)
- **D-02:** Subtle muted bar with `border-t` top border, matching AppHeader's `border-b` pattern. Muted-foreground text color. Lightweight — does not compete with calculator content.
- **D-03:** Main content area needs bottom padding to prevent the fixed footer from overlapping calculator content
- **D-04:** "Made by Guillaume Gautier (xeewi)" — attribution prefix with full name and handle in parentheses
- **D-05:** Name and links only — no project name or additional text in the footer
- **D-06:** Icon-only buttons for the three profile links (GitHub, Malt, LinkedIn) — compact and clean
- **D-07:** GitHub and LinkedIn icons from lucide-react (already installed). Malt uses an inline SVG of the actual Malt logo.
  - **RESEARCH CORRECTION:** lucide-react v1.0.1 removed all brand icons. GitHub and LinkedIn must also be inline SVGs. This extends D-07 to all three icons — the pattern is consistent.
- **D-08:** Links open in new tab (`target="_blank"` with `rel="noopener noreferrer"`) — keeps the calculator open
- **D-09:** Subtle hover effect — icons shift from muted to full foreground color on hover

### Claude's Discretion

- Footer height and exact padding values
- Mobile/responsive behavior (single-row vs stacked on narrow screens)
- Accessibility: aria-labels for icon-only links, keyboard navigation order
- Exact Malt SVG icon design/sourcing
- Whether to use shadcn Button variant="ghost" for icon links or plain anchor tags
- Max-width container alignment (should match AppHeader's max-w-[1280px] px-6 pattern)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOOT-01 | User can see the author name (Guillaume Gautier / xeewi) in a fixed footer banner on every page | Fixed positioning pattern documented; text layout from AppHeader pattern |
| FOOT-02 | User can click a GitHub icon/link in the footer to navigate to the author's GitHub profile | GitHub SVG path verified from simple-icons v16 CDN; anchor tag pattern documented |
| FOOT-03 | User can click a Malt icon/link in the footer to navigate to the author's Malt profile | Malt SVG path verified from simple-icons v16 CDN; inline SVG pattern documented |
| FOOT-04 | User can click a LinkedIn icon/link in the footer to navigate to the author's LinkedIn profile | LinkedIn SVG path sourced from Bootstrap Icons MIT; inline SVG pattern documented |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 19 + TypeScript | 19.0.0 | Component authoring | Project stack |
| Tailwind CSS 4 | 4.2.2 | Utility styling | Project stack — all layout via classes |
| lucide-react | 1.0.1 | Installed but NOT usable for brand icons | Brand icons removed in v1.0 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Button (shadcn/base-ui) | — | Ghost icon wrapper for links | Provides focus ring, hover state, size normalization |
| Inline SVG | — | Brand icons (GitHub, Malt, LinkedIn) | All three brand icons unavailable in lucide-react v1 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline SVG | @icons-pack/react-simple-icons | Adds a package dep; only GitHub + Malt available anyway (LinkedIn removed). Inline SVG keeps zero new deps. |
| Inline SVG | simple-icons npm package | Same coverage gap for LinkedIn. Inline SVG is simpler. |
| Button ghost | Plain `<a>` tag | Button provides consistent focus ring and accessible sizing from existing design system. Prefer Button. |

**Installation:** No new packages required.

**Version verification:**
```bash
npm view lucide-react version  # 1.0.1 — brand icons removed in v1.0
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── AppFooter.tsx    # New component — mirrors AppHeader.tsx structure
│   └── AppHeader.tsx    # Reference — copy border/max-width/padding pattern
└── App.tsx              # Integration — render <AppFooter /> + pb-[footer-height]
```

### Pattern 1: Fixed Footer Matching AppHeader
**What:** A `<footer>` element with `fixed bottom-0 left-0 right-0` positioning, containing the same `max-w-[1280px] mx-auto px-6` container as AppHeader.
**When to use:** Any persistent navigation or attribution bar.
**Example:**
```tsx
// Mirrors AppHeader — source: src/components/AppHeader.tsx
export function AppFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Made by Guillaume Gautier (xeewi)
        </span>
        <div className="flex items-center gap-1">
          {/* icon links */}
        </div>
      </div>
    </footer>
  );
}
```

### Pattern 2: Button as Anchor (Ghost Icon Link)
**What:** Render the shadcn `Button` component as an `<a>` tag using the `render` prop pattern (base-ui pattern used in AppHeader's AlertDialogTrigger).
**When to use:** Icon-only links that need keyboard focus and hover states from the design system.

**IMPORTANT:** The Button component uses `@base-ui/react/button`. Looking at AppHeader, `AlertDialogTrigger` uses `render={<Button ... />}`. For a plain anchor, the pattern is to render `<a>` directly wrapping a `<Button>` OR use `Button` with `asChild`-equivalent. Given base-ui Button is `ButtonPrimitive` from `@base-ui/react/button`, the safest pattern matching existing code is:

```tsx
// Option A: Button wrapping anchor (simplest — no asChild needed)
<a
  href="https://github.com/xeewi"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="GitHub profile"
>
  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" tabIndex={-1}>
    <GitHubIcon className="h-4 w-4" />
  </Button>
</a>

// Option B: Plain anchor styled with Tailwind (no Button dep)
<a
  href="https://github.com/xeewi"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="GitHub profile"
  className="inline-flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
>
  <GitHubIcon className="h-4 w-4" />
</a>
```

Recommendation: **Option B** — plain anchor avoids the tabIndex={-1} workaround, handles keyboard navigation correctly by default, and the styling is trivial with Tailwind.

### Pattern 3: Inline SVG Icon Component
**What:** A small functional component that returns an `<svg>` element with the brand's path data. Accept standard SVG/HTML attributes via `className`.
**When to use:** Brand icons not available in lucide-react.
**Example:**
```tsx
// Source: simple-icons v16 CDN — https://cdn.jsdelivr.net/npm/simple-icons@16.13.0/icons/github.svg
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
```

### Pattern 4: App.tsx Bottom Padding
**What:** Add bottom padding to the main content wrapper equal to or slightly greater than the footer height to prevent fixed footer from covering content.
**When to use:** Any time a fixed-position element overlaps scrollable content.
**Example:**
```tsx
// src/App.tsx — update existing content wrapper
<div className="max-w-[1280px] mx-auto px-6 py-8 pb-16">
  {/* ... existing content ... */}
</div>
```
Footer height with `py-3` (12px top + 12px bottom) + text/icon (~20px) = ~44px. `pb-16` (64px) provides comfortable clearance.

### Anti-Patterns to Avoid
- **Using lucide-react brand icon names:** `Github`, `Linkedin` — these exports do not exist in v1.0.1 and will cause a TypeScript/runtime error.
- **Using `@base-ui/react/button` render prop for external links:** The `render` prop pattern is for replacing the button element with another component. A plain anchor wrapping is simpler for external links.
- **Missing `bg-background` on footer:** Without it, the footer is transparent and content scrolls visually behind it.
- **Missing `z-index`:** If any content has a stacking context, the footer needs `z-50` or similar to stay on top.
- **`tabIndex={-1}` on Button inside anchor:** Causes the Button to be skipped in keyboard navigation. Use plain anchor or ensure only the outer element is focusable.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus ring on icon links | Custom focus CSS | Button variant="ghost" size="icon" OR Tailwind `focus-visible:ring-2` | Design system consistency; browsers vary |
| Icon sizing | Ad-hoc width/height attributes | `className="h-4 w-4"` on SVG (matches lucide-react convention) | Consistent with existing icon sizing in AppHeader |

**Key insight:** The entire component is ~50 lines of straightforward JSX. No libraries, no hooks, no state. The only complexity is sourcing correct SVG path data — which is resolved in the Code Examples section.

## Common Pitfalls

### Pitfall 1: lucide-react Brand Icons Missing
**What goes wrong:** Importing `Github` or `Linkedin` from `lucide-react` causes TypeScript error "Module has no exported member" and runtime crash.
**Why it happens:** lucide-react v1.0 removed all brand icons for legal compliance. The installed version is 1.0.1.
**How to avoid:** Use inline SVG components for all three brand icons (GitHub, Malt, LinkedIn).
**Warning signs:** TypeScript immediately flags missing exports.

### Pitfall 2: Footer Overlaps Content
**What goes wrong:** The fixed footer covers the bottom portion of the calculator, making the last inputs inaccessible.
**Why it happens:** `position: fixed` removes the element from normal flow; no bottom padding was added to content.
**How to avoid:** Add `pb-16` (or equivalent) to the main content wrapper div in App.tsx.
**Warning signs:** Scrolling to the bottom reveals content hidden behind the footer.

### Pitfall 3: Footer Background Transparent
**What goes wrong:** The fixed footer has no background, so content scrolls visibly through it.
**Why it happens:** `bg-background` omitted from the footer element.
**How to avoid:** Always include `bg-background` on fixed overlays.
**Warning signs:** Content text appears over the footer text when scrolling.

### Pitfall 4: Z-Index Stacking
**What goes wrong:** Recharts tooltips or dropdown overlays appear above the footer.
**Why it happens:** Recharts creates its own stacking context; fixed position alone does not guarantee top-layer placement.
**How to avoid:** Add `z-50` to the footer className. Verify visually with chart tooltips open.
**Warning signs:** Footer disappears when hovering over the cost chart.

### Pitfall 5: LinkedIn SVG Not Available in Major Libraries
**What goes wrong:** Developer tries to import LinkedIn icon from simple-icons or lucide-react and finds it missing.
**Why it happens:** LinkedIn brand guidelines restrict use of their logo; simple-icons removed it, lucide-react v1 removed all brand icons.
**How to avoid:** Use inline SVG with Bootstrap Icons' LinkedIn path (MIT license; Bootstrap Icons is one of the few MIT-licensed sources with this icon).
**Warning signs:** npm install of @icons-pack/react-simple-icons and then `SiLinkedin` import will fail.

## Code Examples

Verified patterns from official sources:

### Complete AppFooter Component
```tsx
// src/components/AppFooter.tsx
// All three SVG paths verified against live CDN sources (see Sources section)

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function MaltIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.195 8.581c-.069 0-.285.026-.484.113-.432.181-.597.311-.597.58v5.023c0 .277.26.355.735.355.467 0 .649-.087.649-.355V8.858c0-.173-.113-.277-.303-.277zm3.502 4.903c-.345.087-.45.113-.57.113-.147 0-.2-.044-.2-.2v-2.161h.788c.207 0 .285-.078.285-.285 0-.173-.078-.26-.285-.26h-.787v-.839c0-.259-.087-.363-.268-.363-.173 0-.415.156-.934.597-.528.45-.83.744-.83.951 0 .121.086.199.224.199h.424v2.335c0 .683.337 1.08.925 1.08.39 0 .675-.146 1.012-.406.311-.242.51-.432.51-.596 0-.139-.103-.217-.294-.165zm-15.21-3.078c-.13 0-.285.026-.484.112-.433.19-.597.312-.597.58v3.2c0 .276.26.354.735.354.467 0 .649-.087.649-.355v-3.614c0-.173-.113-.277-.303-.277Zm1.816 0c-.355 0-.675.121-.986.363-.173.138-.32.294-.32.424 0 .112.078.173.19.173.19 0 .251-.078.416-.078.164 0 .25.173.25.476v2.533c0 .277.26.355.735.355.467 0 .649-.087.649-.355v-2.776c0-.657-.39-1.115-.934-1.115zm2.43 0c-.337 0-.692.121-1.003.363-.173.138-.32.294-.32.424 0 .112.078.173.19.173.19 0 .25-.078.432-.078s.268.173.268.476v2.533c0 .277.26.355.735.355.467 0 .649-.087.649-.355v-2.776c0-.657-.39-1.115-.951-1.115zm5.335 0a1.29 1.29 0 0 0-.484.112c-.26.113-.398.2-.467.312-.26-.303-.597-.398-.977-.398-1.116 0-1.911.942-1.911 2.283 0 1.124.605 1.954 1.461 1.954.26 0 .493-.104.77-.363.216-.2.32-.329.32-.45a.14.14 0 0 0-.147-.147c-.121 0-.251.104-.416.104-.354 0-.596-.545-.596-1.35 0-.803.32-1.348.804-1.348.32 0 .562.242.562.657v2.525c0 .277.26.355.735.355.467 0 .649-.087.649-.355v-3.614c0-.173-.113-.277-.303-.277ZM3.499 13.563l-.21.21.619.618c.304.304.79.598 1.244.144.339-.34.26-.695.073-.98-.06.004-1.726.008-1.726.008zm-.963-2.325.21-.21-.608-.607c-.304-.303-.765-.621-1.243-.143-.351.35-.273.692-.087.97Zm2.86.416c-.037.043-1.511 1.524-1.511 1.524h1.154c.43 0 .981-.101.981-.777 0-.496-.296-.683-.624-.747zm-3.244-.031H.981c-.43 0-.981.135-.981.778 0 .479.307.676.641.745.04-.046 1.511-1.523 1.511-1.523zm1.484 3.04-.618-.618-.608.607a2.613 2.613 0 0 1-.137.128c.07.333.266.639.745.639s.676-.307.745-.641c-.043-.037-.085-.073-.127-.115zM2.41 10.15l.608.607.618-.618a2.25 2.25 0 0 1 .128-.118c-.065-.327-.251-.623-.747-.623s-.682.297-.746.625c.046.04.092.08.14.127zm2.742.117c-.455-.454-.94-.16-1.244.144l-2.87 2.87c-.303.303-.621.765-.143 1.243.478.478.94.16 1.243-.143l2.87-2.87c.304-.304.598-.79.144-1.244Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  // Source: Bootstrap Icons v1.x (MIT license)
  // viewBox 0 0 16 16 — scale with h-4 w-4 className
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
    </svg>
  );
}

export function AppFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Made by Guillaume Gautier (xeewi)
        </span>
        <div className="flex items-center gap-1">
          <a
            href="https://github.com/xeewi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="inline-flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <GitHubIcon className="h-4 w-4" />
          </a>
          <a
            href="https://www.malt.fr/profile/xeewi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Malt profile"
            className="inline-flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MaltIcon className="h-4 w-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/xeewi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="inline-flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LinkedInIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
```

### App.tsx Integration Points
```tsx
// 1. Import (add alongside AppHeader import)
import { AppFooter } from '@/components/AppFooter';

// 2. Add bottom padding to content wrapper (line ~196 in App.tsx)
// BEFORE:
<div className="max-w-[1280px] mx-auto px-6 py-8">
// AFTER:
<div className="max-w-[1280px] mx-auto px-6 py-8 pb-16">

// 3. Render footer inside the min-h-screen wrapper, after the content div (line ~259)
// BEFORE:
    </div>  {/* closes min-h-screen */}
// AFTER:
      <AppFooter />
    </div>  {/* closes min-h-screen */}
```

### Hover Color Transition
```tsx
// All three links use identical classes — muted-foreground at rest, foreground on hover
className="... text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ..."
// This matches the ghost Button behavior from button.tsx:
// "hover:bg-muted hover:text-foreground"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| lucide-react Github/Linkedin icons | Inline SVG for all brand icons | lucide-react v1.0 (Feb 2025) | Must source SVG paths separately |
| simple-icons LinkedIn | Not available in simple-icons | simple-icons removed LinkedIn (legal) | Must source from Bootstrap Icons or hand-craft |

**Deprecated/outdated:**
- `import { Github } from 'lucide-react'`: Removed in lucide-react v1.0, does not exist in v1.0.1
- `import { Linkedin } from 'lucide-react'`: Same — removed in v1.0
- `@icons-pack/react-simple-icons` SiLinkedin: LinkedIn not included in simple-icons v14+

## Open Questions

1. **Author's exact profile URLs**
   - What we know: CONTEXT.md uses "xeewi" as the handle
   - What's unclear: Exact profile URLs for Malt and LinkedIn (slug may differ from GitHub username)
   - Recommendation: Planner should use placeholder URLs with TODOs and flag for implementer to confirm. Suggested: `https://www.malt.fr/profile/xeewi` and `https://www.linkedin.com/in/guillaumegautier` or similar.

2. **LinkedIn path viewBox mismatch**
   - What we know: Bootstrap Icons LinkedIn uses `viewBox="0 0 16 16"` rather than `0 0 24 24`
   - What's unclear: Whether `h-4 w-4` className will render correctly regardless of viewBox
   - Recommendation: This is fine — SVG scales to the CSS dimensions via `width`/`height` from className. The viewBox only defines the internal coordinate system. No action needed.

## Environment Availability

Step 2.6: SKIPPED (no external dependencies identified — this phase is purely code/config changes within the existing React project)

## Sources

### Primary (HIGH confidence)
- `https://cdn.jsdelivr.net/npm/simple-icons@16.13.0/icons/github.svg` — GitHub SVG path data, live CDN fetch
- `https://cdn.jsdelivr.net/npm/simple-icons@16.13.0/icons/malt.svg` — Malt SVG path data, live CDN fetch
- `https://lucide.dev/guide/version-1` — Official Lucide v1 docs confirming brand icon removal
- `src/components/AppHeader.tsx` — Reference implementation for container/border/icon patterns
- `src/components/ui/button.tsx` — Button variants and sizes confirmed via direct file read

### Secondary (MEDIUM confidence)
- `https://icons.getbootstrap.com/icons/linkedin/` — Bootstrap Icons LinkedIn path data (MIT license; LinkedIn icon retained under linking use-case interpretation)
- lucide-react v1.0.1 node_modules runtime verification — confirmed Github and Linkedin exports do not exist

### Tertiary (LOW confidence)
- WebSearch: "lucide-react brand icons Github LinkedIn removed" — confirms policy change, corroborated by official docs
- WebSearch: "simple-icons v16 linkedin removed" — confirms LinkedIn not in simple-icons v16, corroborated by CDN 404

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — direct file reads of installed package, version confirmed via npm
- Architecture: HIGH — mirrors verified existing AppHeader pattern exactly
- SVG path data: HIGH (GitHub, Malt — CDN verified) / MEDIUM (LinkedIn — Bootstrap Icons, separate MIT-licensed source)
- Pitfalls: HIGH — lucide-react brand icon removal confirmed by official docs + runtime test

**Research date:** 2026-03-24
**Valid until:** 2026-04-24 (stable domain — SVG paths and positioning patterns do not change frequently)
