<!-- GSD:project-start source:PROJECT.md -->
## Project

**Feature Cost Calculator**

An interactive dashboard that calculates and visualizes the real cost of software features — both as standalone cost estimation and as a comparison between shared code vs duplicated code approaches. Built with React and shadcn/ui for internal use and stakeholder presentations, with data models based on industry research (COCOMO II, IEEE studies, French labor market data).

**Core Value:** Make the hidden long-term costs of code duplication visible and quantifiable, so teams can make informed build-vs-duplicate decisions backed by real numbers.

### Constraints

- **Tech stack**: React + Vite + TypeScript + shadcn/ui + Tailwind CSS + Recharts
- **Data source**: All reference data (salaries, ratios, factors) embedded in the app from the research doc
- **Deployment**: Static build output, can be served from any static host
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

### Core Technologies
| Technology | Purpose |
|------------|---------|
| React 19 + TypeScript | Component framework with type safety |
| Vite | Build tool, dev server with HMR |
| shadcn/ui (Radix + Tailwind) | Polished, accessible component library |
| Tailwind CSS 4 | Utility-first styling |
| Recharts | React charting library (line/area charts, built on D3) |

### Development Tools
| Tool | Purpose |
|------|---------|
| `npm run dev` | Vite dev server with hot reload |
| Browser DevTools | Debugging, layout inspection |

### What NOT to Use
| Avoid | Why |
|-------|-----|
| D3.js directly | Recharts wraps D3 — use Recharts API |
| Highcharts | Commercial license required for internal business use |
| CSS-in-JS (styled-components, emotion) | Tailwind covers all styling needs via shadcn/ui |
| jQuery | Unnecessary with React |
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
