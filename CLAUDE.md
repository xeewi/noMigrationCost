## Project

**Feature Cost Calculator**

An interactive dashboard that calculates and visualizes the real cost of software features — both as standalone cost estimation and as a comparison between shared code vs duplicated code approaches. Built with React and shadcn/ui for internal use and stakeholder presentations, with data models based on industry research (COCOMO II reuse model, empirical reuse and fork studies, French labor market data).

**Core Value:** Make the hidden long-term costs of code duplication visible and quantifiable, so teams can make informed build-vs-duplicate decisions backed by real numbers.

### Constraints

- **Tech stack**: React + Vite + TypeScript + shadcn/ui + Tailwind CSS + Recharts
- **Data source**: All reference data (salaries, ratios, factors) embedded in the app from the research doc
- **Deployment**: Static build output, can be served from any static host

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
