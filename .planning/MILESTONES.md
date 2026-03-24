# Milestones

## v1.2 Documentation (Shipped: 2026-03-24)

**Phases completed:** 11 phases, 17 plans, 23 tasks

**Key accomplishments:**

- Standalone cost formula engine: spToHours/computeStandaloneCost/computeBreakdown verified against docs §7.1 worked examples, with French salary constants and Alpine appState() component
- Complete Feature Cost Calculator Phase 1 UI: team composition grid, feature sizing tabs, time horizon buttons, standalone cost card and breakdown table — all reactively wired via Alpine.js to the formula engine from Plan 01
- One-liner:
- One-liner:
- One-liner:
- Engine extended with DuplicatedCostOutputs sub-totals (totalBugsCost, totalSyncCost), flexible calcBreakEven maintenanceRateShared, chart interpolation utilities (formatEuroAbbrev, buildMonthlyChartData), and three shadcn primitives (Slider, Popover, Collapsible) installed
- ConsumingTeams card with 2-10 range input and AdvancedParameters collapsible panel with 6 slider+input rows, citation popovers, Modified badge, and Reset button — all formula constants lifted from hardcoded ENGINE_DEFAULTS to App.tsx state with two separate EngineInputs objects for shared vs duplicated engine paths
- Recharts AreaChart with green/red dual-curve comparison and break-even annotation, ComparisonTab with summary cards and side-by-side breakdown table, App.tsx output column refactored to tabbed Comparison/Standalone layout
- 3 targeted type-alignment fixes unblocking `npm run build` — zero behavioral changes, 84 tests preserved, dist/ deployable static assets produced
- One-liner:
- Hash read/write effects, controlled Tabs, and reset handler wired into App.tsx — plus 4 verification fixes for dialog close, button contrast, shared empty state, and chart legend
- useHashRoute hook with View type and hash namespace discriminator, plus AppHeader with nav links and conditional Reset All
- App.tsx wired with hash-based routing: view switching, mount-but-hide calculator, hash-write guard, and docs placeholder at #/docs
- React-markdown docs page with @tailwindcss/typography prose, GFM tables, sticky header, DocsSidebar heading extraction, and deep-link scroll support wired into App.tsx
- IntersectionObserver scroll-spy with Map-based ratio tracking and sidebar auto-scroll to active link, satisfying NAV-02 and NAV-03

---
