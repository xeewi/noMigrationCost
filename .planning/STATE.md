---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: React Rebuild
status: Ready to plan
stopped_at: Completed 10-doc-page-implementation-01-PLAN.md
last_updated: "2026-03-24T17:05:25.033Z"
progress:
  total_phases: 9
  completed_phases: 7
  total_plans: 15
  completed_plans: 15
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-24)

**Core value:** Make the hidden long-term costs of code duplication visible and quantifiable
**Current focus:** Phase 10 — doc-page-implementation

## Current Position

Phase: 999.1
Plan: Not started

## Performance Metrics

**Velocity (v1.0 history):**

- Total plans completed (v1.0): 9
- Average duration: ~3-4 min/plan

**By Phase (v1.0):**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 04 | 3 | ~11m | ~3.7m |
| Phase 05 | 4 | ~12m | ~3m |
| Phase 06 | 2 | ~4m | ~2m |

**v1.1 Trend:**

- Last 5 plans: —
- Trend: —

*Updated after each plan completion*
| Phase 07 P01 | 3 | 2 tasks | 2 files |
| Phase 09-routing-foundation P01 | 1 | 2 tasks | 2 files |
| Phase 09-routing-foundation P02 | 5 | 1 tasks | 1 files |
| Phase 10-doc-page-implementation P01 | 2 | 3 tasks | 5 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Pivot]: React + Vite + TypeScript + shadcn/ui + Tailwind CSS + Recharts — replaces Alpine.js + Pico CSS
- [Pivot]: Engine-before-UI build discipline still applies — formula functions verified before UI construction
- [Phase 04]: Used vitest/config defineConfig instead of vite defineConfig to include Vitest type support in vite.config.ts
- [Phase 04]: Added compilerOptions.paths to root tsconfig.json for shadcn CLI alias validation (CLI doesn't follow project references)
- [Phase 04]: calcBreakEven uses ENGINE_DEFAULTS.maintenanceRateShared for shared side — inputs.maintenanceRate is the duplicated rate
- [Phase 04]: Double maintenance factor starts at 1.80 for year 1 (increments from year-1), matches §7.2 research doc model
- [Phase 04]: CostOutput receives emptyReason prop to differentiate zero-team vs zero-hours empty states
- [Phase 04]: Hours/Days unit toggle in FeatureSizing implemented as two paired Buttons (default/outline) instead of Toggle primitive for clearer mutual exclusion UX
- [Phase 04]: CostOutput receives emptyReason prop to differentiate zero-team vs zero-hours empty states
- [Phase 04]: Hours/Days unit toggle in FeatureSizing implemented as two paired Buttons instead of Toggle primitive for clearer mutual exclusion UX
- [Phase 05]: calcBreakEven reads maintenanceRateShared from inputs with ?? fallback to ENGINE_DEFAULTS — preserves backward compatibility while enabling user-controlled parameter
- [Phase 05]: base-ui Slider onValueChange receives (value: number) not number[] — AdvancedParameters ParamRow adapted to single-value handler
- [Phase 05]: AdvancedParamsState exported from AdvancedParameters.tsx for App.tsx import — avoids type duplication
- [Phase 05]: CustomTooltip uses own props interface not recharts TooltipProps — recharts omits active/payload/label via PropertiesReadFromContext
- [Phase 05]: Maintenance row for Duplicated path computed as totalCost residual after duplicatedDevCost, totalBugsCost, totalSyncCost
- [Phase 05]: base-ui Slider onValueChange union type requires Array.isArray guard; CollapsibleTrigger renders button natively (no asChild); useState<number> needed with as-const literals
- [Phase 06]: Base64URL padding formula uses (4 - (hash.length % 4)) % 4 — handles all lengths including already-aligned
- [Phase 06]: AppHeader uses named export matching existing component conventions; clipboard.writeText uses .then() callback to avoid async event handler
- [Phase 06]: AlertDialogTrigger uses base-ui render prop pattern not Radix asChild — base-ui Trigger does not support asChild prop
- [Phase 07]: Inline SVG for all brand icons — lucide-react v1.0.1 removed brand icons; Bootstrap Icons MIT used for LinkedIn
- [Phase 07]: Plain anchor tags for footer icon links — avoids tabIndex workaround vs Button wrapping
- [v1.2 Routing]: Hash namespace discriminator: `/` prefix identifies route hashes; base64url alphabet (RFC 4648) never produces `/`, so namespaces are disjoint
- [v1.2 Routing]: Hash-write guard required in App.tsx — debounced state-encode effect must not run when view === 'docs'
- [v1.2 Routing]: rehype-slug configured with prefix: 'doc-' — prevents heading IDs from matching base64url state hashes
- [v1.2 Doc]: react-markdown + remark-gfm + rehype-slug + @tailwindcss/typography — verified package versions: 10.1.0 / 4.0.1 / 6.0.0 / 0.5.19
- [v1.2 Doc]: Markdown imported via Vite ?raw suffix as module-level constant — zero runtime fetch, avoids re-parse on every render
- [v1.2 Doc]: components prop for ReactMarkdown defined at module level — prevents re-parse when parent re-renders
- [v1.2 Sidebar]: IntersectionObserver scroll-spy uses Map<id, ratio> approach with rootMargin: '-10% 0px -80% 0px' — prevents flicker at section boundaries
- [Phase 09-routing-foundation]: useHashRoute lazy initializer prevents flash on deep-link; deriveView uses hash.startsWith('/') as lossless namespace discriminator
- [Phase 09-routing-foundation]: AppHeader nav uses <a> tags not <button> for correct navigation semantics; Reset All conditionalized to calculator view only per D-03
- [Phase 09-routing-foundation]: Mount-but-hide pattern for calculator — className toggle, not conditional render, for zero React state loss
- [Phase 09-routing-foundation]: view added as first element in hash-write dep array so guard re-evaluates on view change
- [Phase 10-doc-page-implementation]: REHYPE_PLUGINS typed as any[] to resolve readonly tuple vs Pluggable[] TypeScript incompatibility
- [Phase 10-doc-page-implementation]: Module-level constants for ReactMarkdown plugins prevent re-parse on every parent re-render
- [Phase 10-doc-page-implementation]: DocsSidebar heading IDs prefixed with doc- matching rehype-slug prefix config for consistent anchor navigation

### Pending Todos

None.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260324-jpj | Move Consuming Teams into Advanced Parameters panel | 2026-03-24 | 3d8a91e | [260324-jpj-move-consuming-teams-into-advanced-param](./quick/260324-jpj-move-consuming-teams-into-advanced-param/) |
| 260324-jxg | Move Time Horizon near chart (output column) | 2026-03-24 | 7ebd5ed | [260324-jxg-move-consuming-teams-to-top-of-advanced-](./quick/260324-jxg-move-consuming-teams-to-top-of-advanced-/) |

### Blockers/Concerns

None for v1.2.

## Session Continuity

Last session: 2026-03-24T16:28:44.337Z
Stopped at: Completed 10-doc-page-implementation-01-PLAN.md
Resume file: None
