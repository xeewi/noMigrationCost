# Phase 6: URL Sharing - Research

**Researched:** 2026-03-24
**Domain:** URL hash state serialization, React effect patterns, shadcn/ui AlertDialog
**Confidence:** HIGH

## Summary

This phase encodes ~22 scalar values (the complete App.tsx state) into a URL hash so recipients can restore an exact scenario with no backend. The standard approach for this use case — no router, static Vite app, pure React — is: serialize state to compact JSON, Base64URL-encode it (not standard Base64), assign to `window.location.hash` in a debounced `useEffect`, and read it on mount in a lazy initializer or separate `useEffect`. The hash fragment is never sent to the server, so URL length is not a meaningful concern for ~22 fields.

The reset confirmation requires `shadcn/ui AlertDialog`, which is not yet installed. It is a one-command add and follows the same import pattern as the other installed shadcn/ui components.

The Copy Link button's inline feedback (D-03) is a simple `useState<boolean>` plus `setTimeout` pattern — no third-party library needed.

**Primary recommendation:** Serialize to JSON, Base64URL-encode (`btoa` + replace `+`/`/`/`=`), write to `window.location.hash` in a debounced state-change effect, parse in a mount effect. No external serialization library required.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Both live URL and Copy Link button — URL hash updates in real-time as inputs change AND a dedicated Copy Link button is available for convenience
- **D-02:** New header component for global actions — houses the Copy Link button, Reset button, and any future global actions (e.g., app title/branding)
- **D-03:** Copy Link feedback via inline button state change — button text/icon briefly changes to checkmark/"Copied!" then reverts, no toast notification
- **D-04:** Reset All button in the header component — clears all inputs to initial defaults (zero headcounts, zero SP/hours, default horizon, default advanced params, default consuming teams) and clears the URL hash
- **D-05:** Reset requires confirmation dialog before executing — prevents accidental loss of a configured scenario

### Claude's Discretion
- URL encoding strategy (compact JSON, base64, query params, or other approach — optimize for reasonable URL length with ~20 fields)
- Restore behavior when opening a shared URL (instant restore vs any intermediate step)
- Handling of malformed or incomplete URL hashes (graceful fallback to defaults)
- Whether active output tab (Comparison/Standalone) is encoded in URL — default to Comparison per Phase 5 D-02 if not
- Header component visual design and placement (should feel lightweight, not compete with the calculator content)
- shadcn/ui Alert Dialog or similar for the reset confirmation

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SHARE-01 | User can share a scenario via URL (all inputs encoded in URL hash) | URL hash encode/decode pattern, Base64URL encoding, `window.location.hash` write on state change |
| SHARE-02 | User opening a shared URL sees the exact same scenario with all inputs restored | Mount-time `useEffect` to parse hash and call all state setters, graceful fallback for malformed hash |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React (built-in) | 19 (already installed) | `useEffect`, `useState`, `useCallback` for hash sync | No external dependency needed |
| Web API `btoa` / `atob` | Browser native | Base64 encode/decode for URL-safe serialization | Universal browser support, zero bundle cost |
| Web API `window.location.hash` | Browser native | Read/write URL hash fragment | Standard approach for hash-based state |
| shadcn/ui AlertDialog | CLI install needed | Reset confirmation modal | Already-used component library; accessibility included |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | ^1.0.1 (already installed) | Copy/check icons for Copy Link button | Already available for the "Copied!" checkmark icon |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| JSON + Base64URL | URLSearchParams per-field | URLSearchParams produces long URLs with many `&key=value` pairs for 22 fields; harder to version |
| JSON + Base64URL | compact custom format | Harder to extend; versioning becomes manual |
| `window.location.hash` direct write | React Router `useNavigate` | This project has no router; adding one just for URL sync is over-engineering |
| Native `btoa`/`atob` | `js-base64` npm package | Native APIs are sufficient; no extra dependency warranted |

**Installation:**
```bash
npx shadcn@latest add alert-dialog
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   └── url-state.ts        # serialize() / deserialize() / encodeHash() / decodeHash()
├── components/
│   └── AppHeader.tsx       # Copy Link + Reset All (with AlertDialog)
└── App.tsx                 # useEffect for hash write; useEffect for hash read on mount
```

### Pattern 1: Base64URL Encode/Decode
**What:** Serialize state to JSON, then Base64URL-encode it (replacing `+`→`-`, `/`→`_`, `=`→`''`) so it is safe in a URL hash with no percent-encoding needed.
**When to use:** Any time a hash must survive copy-paste, link shorteners, and social media auto-linkifiers.
**Example:**
```typescript
// Source: MDN Web APIs + base64url standard RFC 4648 §5
function encodeState(state: ShareableState): string {
  const json = JSON.stringify(state);
  return btoa(json)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function decodeState(hash: string): ShareableState | null {
  try {
    // Restore standard Base64 padding before decoding
    const padded = hash
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(hash.length + (4 - (hash.length % 4)) % 4, '=');
    const json = atob(padded);
    return JSON.parse(json) as ShareableState;
  } catch {
    return null; // malformed hash → graceful fallback to defaults
  }
}
```

### Pattern 2: Write Hash on State Change (Debounced)
**What:** A `useEffect` that depends on all serializable state writes the encoded hash to `window.location.hash`. Debounce avoids thrashing the URL on every keystroke.
**When to use:** Real-time URL sync (D-01 requires live URL updates).
**Example:**
```typescript
// Source: established React pattern (window.location.hash assignment)
useEffect(() => {
  const id = setTimeout(() => {
    const encoded = encodeState(buildShareableState());
    window.location.hash = encoded;
  }, 300); // 300ms debounce
  return () => clearTimeout(id);
}, [team, sizingMode, storyPoints, velocity, sprintWeeks,
    directValue, directUnit, horizonYears, advancedParams, nbConsumingCodebases]);
```

### Pattern 3: Read Hash on Mount
**What:** A `useEffect` with an empty dependency array runs once after the first render and calls all individual state setters if a valid hash is present.
**When to use:** Restoring a shared URL (SHARE-02).
**Example:**
```typescript
// Source: standard React mount pattern
useEffect(() => {
  const raw = window.location.hash.slice(1); // strip '#'
  if (!raw) return;
  const state = decodeState(raw);
  if (!state) return; // malformed — stay at defaults
  applyShareableState(state, {
    setTeam, setSizingMode, setStoryPoints, setVelocity,
    setSprintWeeks, setDirectValue, setDirectUnit,
    setHorizonYears, setAdvancedParams, setNbConsumingCodebases,
  });
}, []);
```

### Pattern 4: Copy Link Button with Inline Feedback
**What:** `navigator.clipboard.writeText(window.location.href)` copies the current URL, then a `boolean` state triggers a brief "Copied!" / checkmark for ~2 seconds.
**When to use:** D-01/D-03 requirements.
**Example:**
```typescript
const [copied, setCopied] = useState(false);

const handleCopy = () => {
  navigator.clipboard.writeText(window.location.href);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

// JSX: {copied ? <Check className="h-4 w-4" /> : <Link className="h-4 w-4" />}
```

### Pattern 5: AlertDialog for Reset Confirmation
**What:** shadcn/ui `AlertDialog` wraps the Reset All button. Clicking triggers the dialog; confirming calls the reset function.
**When to use:** D-05 — destructive action requiring confirmation.
**Example:**
```typescript
// Source: https://ui.shadcn.com/docs/components/radix/alert-dialog
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Reset All</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Reset all inputs?</AlertDialogTitle>
      <AlertDialogDescription>
        This will clear your scenario and cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Anti-Patterns to Avoid
- **Standard Base64 in URL hash:** Characters `+` and `/` work in the hash fragment but can be corrupted by link shorteners or social media parsers. Always use Base64URL variant.
- **Encoding `=` padding in hash:** Trailing `=` looks like a broken URL to many tools. Strip on encode, restore on decode.
- **Writing hash inside the read effect:** Causes an infinite loop (mount read → write → hashchange event → re-read). Use a flag or separate effects.
- **Depending on `hashchange` event for own writes:** Not needed; the app drives hash writes directly. `hashchange` is only needed if external navigation changes the hash (not a concern for this static app).
- **Re-applying URL state on every render:** The mount `useEffect` must have an empty dep array `[]` — not the full state list — to avoid overwriting user input after initial load.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Confirmation modal | Custom modal with backdrop | shadcn/ui AlertDialog | Focus trapping, keyboard navigation (Escape to cancel), ARIA roles all handled |
| Copy-to-clipboard | `document.execCommand('copy')` | `navigator.clipboard.writeText()` | `execCommand` is deprecated; Clipboard API is the current standard |
| State versioning | Ad-hoc version field parsing | Include a `v: 1` field in the JSON object from day one | Enables graceful migration if state shape changes in future phases |

**Key insight:** All three custom-build temptations here have well-established browser-native or library solutions that handle edge cases (focus management, deprecated APIs, forward compatibility) better than hand-rolled equivalents.

## Common Pitfalls

### Pitfall 1: Infinite Loop Between Mount Read and State-Change Write
**What goes wrong:** The mount `useEffect` sets state; the state-change `useEffect` immediately writes the hash back; this can trigger a `hashchange` event which re-fires the read effect.
**Why it happens:** Two effects interact through `window.location.hash` and the same state.
**How to avoid:** Give the read effect an empty dependency array `[]` so it only runs once on mount. Do not add a `hashchange` listener in the write effect.
**Warning signs:** Infinite re-render loop in DevTools; inputs reset themselves after being changed.

### Pitfall 2: Standard Base64 `+` and `/` Characters Corrupted
**What goes wrong:** A URL like `#abc+def/ghi=` gets pasted into Slack or a link shortener and becomes `#abc%20def%2Fghi%3D` or `#abc def/ghi=` — `atob` fails.
**Why it happens:** `btoa()` uses standard Base64 which includes `+`, `/`, and `=` as output characters.
**How to avoid:** Replace `+`→`-`, `/`→`_`, strip trailing `=` after `btoa()`. Reverse before `atob()`.
**Warning signs:** `atob` throws `InvalidCharacterError` on hash strings received from outside the app.

### Pitfall 3: Mount Effect Overwrites User Edits After Initial Load
**What goes wrong:** User opens shared URL, edits an input, and immediately the inputs reset back to the URL-encoded values.
**Why it happens:** Mount effect has a state dependency in its dep array, causing it to re-run after user edits.
**How to avoid:** Empty dep array `[]` on the mount read effect. It runs exactly once.

### Pitfall 4: Reset Clears Hash but State-Change Effect Re-Encodes It
**What goes wrong:** Reset function sets `window.location.hash = ''`, but the state-change effect immediately re-encodes default values back into the hash (a non-empty hash of default state).
**Why it happens:** State setters called by reset trigger the state-change write effect.
**How to avoid:** Two options: (a) after reset, the state-change effect will write the encoded defaults — accept this as correct behavior (URL encodes defaults, which is harmless). (b) Skip writing hash when state matches all defaults exactly. Option (a) is simpler and acceptable — the encoded-defaults URL restores correctly and is not misleading.

### Pitfall 5: `navigator.clipboard` Fails Without HTTPS or Focus
**What goes wrong:** `navigator.clipboard.writeText()` throws `DOMException: Not allowed` in HTTP contexts or when the document does not have focus.
**Why it happens:** Clipboard API requires a secure context (HTTPS) or localhost.
**How to avoid:** In development (`localhost`) this is fine. For production: the static host should serve HTTPS. Wrap in try/catch and silently degrade (hide "Copied!" feedback, or fallback to `document.execCommand`).
**Warning signs:** Copy button appears to do nothing; console shows `DOMException`.

### Pitfall 6: Hash Fragment Visible in Server Access Logs? No — But Bookmark/Share Behavior Differs from Query Params
**What goes wrong:** Team assumes hash params work identically to query params.
**Why it happens:** Unfamiliarity with hash semantics.
**How to avoid:** Hash is client-only. The server never sees it. This is a feature — no backend changes needed. But it means the server cannot pre-render the shared view (irrelevant for this SPA).

## State Shape to Serialize

All fields from `App.tsx` that must be encoded. Derived values (`teamAvgRate`, `devHours`, etc.) are NOT encoded — they recompute from inputs.

```typescript
// Canonical serializable shape for the URL hash
interface ShareableState {
  v: 1;                            // schema version — enables future migration
  // Team (4 rows, fixed order: Junior/Mid/Senior/Lead)
  th: [number, number, number, number]; // headcounts
  tr: [number, number, number, number]; // hourly rates
  // Feature sizing
  sm: 'sp' | 'dh';                 // sizingMode (shortened)
  sp: number;                      // storyPoints
  vel: number;                     // velocity
  sw: number;                      // sprintWeeks
  dv: number;                      // directValue
  du: 'h' | 'd';                   // directUnit (shortened)
  // Time horizon
  hy: number;                      // horizonYears
  // Advanced params (6 fields)
  gf: number;                      // generalizationFactor
  pf: number;                      // portingFactor
  dr: number;                      // divergenceRate
  mrs: number;                     // maintenanceRateShared
  mrd: number;                     // maintenanceRateDuplicated
  bdf: number;                     // bugDuplicationFactor
  // Consuming codebases
  nc: number;                      // nbConsumingCodebases
}
```

**Why short keys:** 22 fields with full names (~400 chars of JSON) becomes ~120 chars with short keys after Base64URL encoding. With short keys the final URL hash is approximately 160-200 characters — comfortable for copy-paste.

**Active tab:** Per CONTEXT.md discretion note, the active tab (`comparison` | `standalone`) SHOULD be encoded so shared URLs restore the exact view. Add `tab: 'c' | 's'` to ShareableState. Default to `'c'` (comparison) when absent.

## Code Examples

### Complete encode/decode module (`src/lib/url-state.ts`)
```typescript
// All serialization logic isolated in one file — App.tsx stays clean
import type { SeniorityRow, SizingMode, DirectHoursUnit } from '@/engine/types';
import type { AdvancedParamsState } from '@/components/AdvancedParameters';
import { SENIORITY_DEFAULTS, ENGINE_DEFAULTS } from '@/engine/types';

export interface ShareableState {
  v: 1;
  th: [number, number, number, number];
  tr: [number, number, number, number];
  sm: 'sp' | 'dh';
  sp: number;
  vel: number;
  sw: number;
  dv: number;
  du: 'h' | 'd';
  hy: number;
  gf: number;
  pf: number;
  dr: number;
  mrs: number;
  mrd: number;
  bdf: number;
  nc: number;
  tab: 'c' | 's';
}

export function encodeAppState(/* all state params */): string {
  const state: ShareableState = { v: 1, /* ... map fields */ };
  const json = JSON.stringify(state);
  return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeAppState(hash: string): ShareableState | null {
  try {
    const padded = hash.replace(/-/g, '+').replace(/_/g, '/')
      .padEnd(hash.length + (4 - (hash.length % 4)) % 4, '=');
    return JSON.parse(atob(padded)) as ShareableState;
  } catch {
    return null;
  }
}

export function getDefaultTeam(): SeniorityRow[] {
  return [
    { label: 'Junior', headcount: 0, hourlyRate: SENIORITY_DEFAULTS.Junior },
    { label: 'Mid',    headcount: 0, hourlyRate: SENIORITY_DEFAULTS.Mid    },
    { label: 'Senior', headcount: 0, hourlyRate: SENIORITY_DEFAULTS.Senior },
    { label: 'Lead',   headcount: 0, hourlyRate: SENIORITY_DEFAULTS.Lead   },
  ];
}
```

## Environment Availability

Step 2.6: SKIPPED (no external dependencies — purely code/config changes within the existing React + Vite stack, plus one `npx shadcn` component add).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `document.execCommand('copy')` | `navigator.clipboard.writeText()` | Chrome 66+ / 2018 | `execCommand` deprecated; Clipboard API is standard |
| Standard Base64 in URLs | Base64URL (RFC 4648 §5) | Established standard | Eliminates `+`/`/` corruption in link contexts |

**Deprecated/outdated:**
- `document.execCommand('copy')`: Deprecated in all major browsers; use Clipboard API.
- `location.hash = '#' + value` with raw JSON: Special characters in JSON values (`{`, `"`, `:`) must be percent-encoded; Base64URL avoids this.

## Open Questions

1. **Active tab encoding — include or skip?**
   - What we know: CONTEXT.md flags this as discretion; Phase 5 D-02 says Comparison is default
   - What's unclear: Whether tab state matters enough to encode (a user might share a Standalone result)
   - Recommendation: Encode it (adds 8 bytes to JSON, negligible). Planner should include `tab` in ShareableState and sync the Tabs `value` as controlled state in App.tsx.

2. **Debounce duration for hash write**
   - What we know: 300ms is a conventional UI debounce for text inputs
   - What's unclear: Whether number inputs (sliders, numeric fields) feel responsive at 300ms
   - Recommendation: 300ms — matches existing slider interaction latency and is imperceptible for URL updates.

## Sources

### Primary (HIGH confidence)
- MDN Web APIs (`btoa`, `atob`, `navigator.clipboard`, `window.location.hash`) — browser native behavior
- https://ui.shadcn.com/docs/components/radix/alert-dialog — AlertDialog install command and JSX pattern
- RFC 4648 §5 — Base64URL alphabet specification (`+`→`-`, `/`→`_`, no padding)

### Secondary (MEDIUM confidence)
- https://peterkellner.net/2023-09-16-state-management-in-react-applications-through-url-hashes/ — mount/hashchange React patterns (verified against React docs mental model)
- https://codescene.com/blog/base-64-padding-and-urls — Base64 padding pitfalls in URL contexts

### Tertiary (LOW confidence)
- General WebSearch results on URLSearchParams pitfalls — confirmed the `+`-as-space issue (cross-verified with MDN)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tools are browser native or already installed; one known shadcn add needed
- Architecture: HIGH — patterns are well-established React/Web API idioms, verified against MDN and official shadcn docs
- Pitfalls: HIGH — Base64URL pitfall is documented in RFC and multiple sources; React infinite-loop pitfall is a known React effect interaction

**Research date:** 2026-03-24
**Valid until:** 2026-09-24 (stable Web APIs; shadcn component API unlikely to change significantly)
