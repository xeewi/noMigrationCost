<!-- GSD:project-start source:PROJECT.md -->
## Project

**Feature Cost Calculator**

An interactive dashboard that calculates and visualizes the real cost of software features — both as standalone cost estimation and as a comparison between shared code vs duplicated code approaches. Built as a standalone HTML/JS app for internal use and stakeholder presentations, with data models based on industry research (COCOMO II, IEEE studies, French labor market data).

**Core Value:** Make the hidden long-term costs of code duplication visible and quantifiable, so teams can make informed build-vs-duplicate decisions backed by real numbers.

### Constraints

- **Tech stack**: Standalone HTML/CSS/JS — no build step, no framework, single file or minimal files
- **Data source**: All reference data (salaries, ratios, factors) embedded in the app from the research doc
- **Deployment**: Static file, can be opened directly in a browser or served from any static host
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Vanilla HTML/CSS/JS | Browser-native | Application shell | No build step, no toolchain, zero deployment friction — a file double-click opens it. The constraint is the feature. |
| Alpine.js | 3.15.8 | Reactive UI (form inputs, sliders, computed values, show/hide) | HTML-attribute-driven reactivity with zero build step, 7.1 KB gzipped, loads via CDN. Handles `x-data`, `x-model`, `x-show`, and `$store` for global state — covers 100% of what a calculator dashboard needs without introducing JSX or a component model. Matures well: v3 stable since 2021, v3.15.8 released Feb 2025. |
| Chart.js | 4.5.1 | Line/area charts — cumulative cost curves, break-even visualization | Canvas-based (fast, no SVG DOM thrash), 60 KB minified + gzipped, CDN-loadable in one `<script>` tag, outstanding animation defaults for temporal curves. Simpler API than ECharts for the two chart types this project needs (line + area). v4.5.1 released Oct 2024. |
| Pico CSS | 2.1.1 | Base styling — forms, tables, sliders, layout | Styles semantic HTML tags directly (no classes needed for `<table>`, `<input>`, `<button>`, `<select>`). Single CDN link, ~8 KB gzipped. Provides a professional, readable default that works for presentations without writing a CSS reset. v2.1.1 released March 2025. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| chart.js date adapter (chartjs-adapter-date-fns) | N/A | Time-axis formatting | Only needed if x-axis is real dates. For this project, x-axis is integer years (1–10), so no adapter is needed. Skip this entirely. |
| tofsjonas/sortable | Latest (CDN) | Sortable HTML tables | Use if the cost breakdown table needs column-sort. Add `class="sortable"` to the `<table>` tag. Zero config, no dependencies, 1 KB. Only add if sortable columns are needed — for v1, static tables are fine. |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| Browser DevTools | Debugging, layout inspection | Only tool needed — no bundler, no sourcemaps required |
| VS Code Live Server extension | Local dev server with hot reload | Optional. The file can be opened directly with `file://`, but a local server avoids CORS issues if data files are ever split out. Not required for v1 single-file approach. |
| Browser print / screenshot | "Export" for presentations | Declared sufficient in PROJECT.md — no PDF library needed |
## CDN Load Order
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Alpine.js | VanJS (1 KB) | If the UI is entirely JS-generated with no HTML templates — VanJS builds the DOM programmatically. Alpine is better here because the HTML structure is static with reactive slots, not a fully generated DOM. |
| Alpine.js | Pure Proxy + EventTarget | If you want zero CDN dependencies and are comfortable writing 50–100 lines of reactive plumbing. Viable for a senior JS dev. Alpine removes that boilerplate for free at 7 KB. |
| Alpine.js | Vue 3 (CDN build) | Vue 3 has a CDN build (no build step). Use it if the UI needs virtual-DOM-level component isolation or you are already a Vue team. Overkill for this project. |
| Chart.js | Apache ECharts 6.0.0 | ECharts 6 (released July 2025) is more powerful but the full bundle is ~900 KB minified (vs ~60 KB for Chart.js). For two chart types — line and area — Chart.js is the correct tool. ECharts is the right call for dashboards needing 10+ chart types, 3D, or map overlays. |
| Chart.js | Plotly.js | Plotly's CDN bundle is 3+ MB. Enormous for a project that needs two line charts. |
| Pico CSS | Bootstrap 5 | Bootstrap provides more component variety but requires more class markup and delivers ~150 KB of CSS. Pico's semantic approach means the HTML stays clean and readable without utility classes. Use Bootstrap if the team already knows it and wants richer components (modals, dropdowns). |
| Pico CSS | Tailwind (CDN Play CDN) | Tailwind's Play CDN is ~150 KB at runtime and builds a custom CSS blob. Incompatible with "open a file and it works" reliability. Avoid. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| React / Vue / Svelte (npm-only builds) | All require a build step to use in production. CDN builds of React are available but are development-mode only and 40–140 KB. The mental model adds framework complexity to a problem that is purely "bind inputs to formulas and draw charts." | Alpine.js |
| jQuery | Adds 30–90 KB for DOM selection utilities that are fully covered by `document.querySelector` and `querySelectorAll` in 2025. Alpine already provides event binding and state. | Native DOM APIs + Alpine.js |
| D3.js | D3 is a data transformation + SVG rendering primitives library — not a charting library. Using D3 to draw cumulative cost curves from scratch means writing a chart library. Correct for custom novel visualizations; wrong for standard line charts. | Chart.js |
| Highcharts | Commercial license required for most uses ($0 only for personal/non-commercial). This dashboard is described for internal business use — that triggers a paid license. | Chart.js (MIT) or ECharts (Apache 2.0) |
| Tailwind Play CDN | Works in development but is explicitly marked "not for production" in the Tailwind docs. Generates CSS at runtime by scanning the DOM, which is slow and fragile for a standalone file. | Pico CSS |
| ECharts full bundle via CDN for only 2 chart types | The full ECharts bundle is ~900 KB minified. Even tree-shaking requires a build step. For 2 chart types in a no-build context, this cost is unjustifiable. | Chart.js |
## Stack Patterns by Variant
- Inline all `<style>` overrides in a `<style>` block after Pico CSS link
- Put all Alpine component logic in `<script>` blocks at the bottom of `<body>`
- Chart.js instances live inside Alpine `init()` callbacks using `$el.querySelector('canvas')`
- `index.html` — markup only
- `app.js` — Alpine component definitions and chart setup
- `data.js` — salary constants, COCOMO factors, default values from research doc
- `styles.css` — overrides on top of Pico CSS
- Use Chart.js `annotation` plugin (`chartjs-plugin-annotation@3.x`) — CDN-loadable, adds vertical line + label at the break-even year
- CDN: `https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3/dist/chartjs-plugin-annotation.min.js`
## Version Compatibility
| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Alpine.js 3.15.8 | Any modern browser (Chrome 87+, Firefox 78+, Safari 14+) | No IE11 support — acceptable for internal tooling |
| Chart.js 4.5.1 | Any modern browser with Canvas API | No IE11. Canvas is universally supported in modern browsers. |
| Pico CSS 2.1.1 | Any modern browser | v2 dropped IE support in favor of CSS custom properties for theming |
| chartjs-plugin-annotation 3.x | Chart.js 4.x only | Do not mix with Chart.js 3.x |
## Sources
- Alpine.js GitHub releases — v3.15.8 confirmed stable, released Feb 2, 2025 — HIGH confidence
- Alpine.js official installation docs — CDN URL and defer requirement confirmed — HIGH confidence
- Chart.js GitHub releases — v4.5.1 confirmed latest stable, released Oct 13, 2024 — HIGH confidence
- Apache ECharts — v6.0.0 released July 30, 2025, stable — MEDIUM confidence (new major, migration required from v5)
- Pico CSS GitHub releases — v2.1.1 confirmed latest, released March 15, 2025 — HIGH confidence
- jsDelivr ECharts package — version 6.0.0 listed as latest — MEDIUM confidence
- WebSearch: "vanilla JS reactive UI without framework no build step 2025" — multiple sources confirming Alpine.js as standard for no-build reactive UIs — MEDIUM confidence
- WebSearch: "Chart.js vs ECharts CDN 2025" — multiple sources confirming Chart.js as the lighter, simpler choice for standard line/area charts — MEDIUM confidence
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
