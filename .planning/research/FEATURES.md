# Feature Research

**Domain:** Software cost calculator / TCO comparison dashboard (shared vs duplicated code)
**Researched:** 2026-03-23
**Confidence:** MEDIUM — TCO calculator market is well-documented (Azure, AWS tools analyzed); the specific "shared vs duplicated code" niche is novel, so differentiators are inferred from analogous tools and the project's own research doc.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features engineering leads and managers expect when they open any cost comparison tool. Missing these makes the tool feel broken or incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Input form for team composition | Every cost model is team-specific; users cannot trust output without defining who does the work | LOW | Seniority levels + salary per member; French loaded-cost defaults pre-filled |
| Adjustable time horizon | All TCO tools (Azure, AWS) allow a time range — 1-5 or 1-10 years is standard | LOW | Slider is the expected UX; show years not arbitrary units |
| Cost breakdown table | Azure TCO, Codacy tech-debt calculator both show itemized cost categories; users need to see where the number comes from | MEDIUM | Categories: initial dev, maintenance, coordination overhead, bug rate, sync effort |
| Side-by-side comparison of two approaches | Core premise of any "shared vs duplicate" tool — users come for this | MEDIUM | Shared code path vs N duplicated copies; must show both totals clearly |
| Break-even point calculation | Decision-makers need to know "when does shared code pay off?" — this is the single most-asked question in build-vs-buy decisions | MEDIUM | Highlight on graph; state explicitly in plain text |
| Temporal cost curve chart | All major TCO dashboards (Azure, AWS) include a graph showing cost over time; text-only output is insufficient for presentations | MEDIUM | Cumulative cost, dual curves (shared vs duplicated), break-even marker |
| Story points as input unit | Agile teams think in story points, not hours — any estimation tool that forces hours loses this audience | LOW | Convert via team velocity (SP/sprint); velocity input required alongside SP input |
| Direct hours/days input | Non-agile teams or quick estimates require direct time entry; supporting both is expected in estimation tools | LOW | Alternative to SP mode, not a separate screen |
| Research-backed default values | Users trust the output only if the underlying constants (maintenance ratios, divergence rates, bug multipliers) are grounded in sources | LOW | Pre-fill from research doc; expose for override |
| Overridable defaults | Every TCO calculator (Azure, HubSpot, Commercetools) allows adjusting assumptions; hardcoded constants are a red flag | LOW | Advanced inputs panel or inline; must not block basic use |

### Differentiators (Competitive Advantage)

Features specific to this tool's core value: making the hidden long-term cost of code duplication visible and quantifiable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Divergence rate modeling over time | Duplicated code does not stay identical — it drifts. Showing cost growth as copies diverge is a unique insight no generic TCO calculator offers | HIGH | Use divergence rate factor from research doc (section 7.x); non-linear cost curve for duplicated path |
| Per-copy cost breakdown (N teams) | When there are 3 teams duplicating a feature, total cost is not simply 3×; there are compounding maintenance and bug-propagation costs. Surfacing this is the key "aha" moment | MEDIUM | Input: number of copies/teams; output: per-copy vs shared delta |
| Bug propagation cost component | Duplicated code has a known higher bug rate (research: 4× per clone for critical defects). Showing this as its own cost line differentiates from generic maintenance calculators | MEDIUM | Derive from research doc bug multiplier; show as distinct category in breakdown table |
| Annotation of research citations inline | Engineering leads need to defend numbers to skeptical stakeholders. Showing the source for each coefficient (COCOMO II, IEEE study, French labor data) gives credibility and is rare in calculator tools | LOW | Tooltip or expandable reference per formula constant |
| Coordination overhead as explicit cost line | Shared code requires API design, documentation, versioning meetings. This is typically invisible in cost discussions but is a real counter-argument to sharing. Surfacing it honestly (and showing it is still lower than duplication long-term) strengthens the argument | MEDIUM | From research doc coordination factor; must include both paths' hidden costs |
| Scenario save / shareable state via URL | Engineering leads present to multiple audiences. Being able to share a URL with a pre-configured scenario (no account, no database) is a practical differentiator over tools that require export or login | LOW | Encode inputs in URL query string or hash; read on load |
| Generalization factor adjustment | Building shared code costs more upfront (generalization tax). Explicitly modeling this and showing it in the break-even calculus is honest and differentiating — most tools hide the upfront cost disadvantage | LOW | Single factor (1.2–2.0×); default from research doc |
| Presentation-ready chart styling | Target users present to stakeholders. Clean, high-contrast chart with labeled axes and a visible break-even callout is immediately useful in a deck — this is not typical in technical tools | MEDIUM | Export as SVG or high-res PNG; fallback: browser print / screenshot guidance |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| User accounts and persistent storage | "Save my scenarios" sounds useful | Adds auth complexity, backend dependency, GDPR surface area, and conflicts with the standalone HTML/JS constraint entirely. The tool's primary value is in the calculation, not the storage. | URL-encoded state for sharing; instruct users to bookmark or export |
| Full COCOMO II implementation | COCOMO II is the industry reference; using it sounds more credible | The full model has 22 cost drivers and calibration curves requiring KSLOC input. Target users think in story points, not KSLOC. A simplified story-point bridge already covers the estimation need. | Use simplified COCOMO-derived coefficients with SP-to-hours bridge as documented in research doc |
| Multi-language toggle (FR/EN) | French-speaking teams may prefer FR | Adds i18n complexity, doubles copy-editing, and the target audience uses English for stakeholder presentations. Scope creep before v1 is validated. | English only for v1; revisit if real French-only users emerge |
| Real-time collaboration / multi-user editing | "Multiple people adjusting inputs at the same time" | This is a backend websocket problem. The tool is a standalone HTML file — no backend exists and none is planned. | Share via URL state; one person drives the calculation in meetings |
| Mobile-specific layout | "I want to check this on my phone" | Engineering leads use this in desktop presentations. Mobile layout requires significant responsive design investment for a niche use case. Calculation-heavy dashboards with charts are inherently desktop tools. | Desktop-first; ensure it does not break at tablet widths as a secondary concern |
| PDF export | "I want to export a professional PDF" | PDF generation in a pure browser context (no server) requires a library (jsPDF, Puppeteer) that adds significant complexity. The quality is also inconsistent across browsers. | Document browser Print-to-PDF as the export path; it produces clean output for a well-styled page |
| Historical scenario comparison (v1) | "I want to compare 5 different team configurations" | Adds state management complexity (list of saved scenarios, diff UI). The core value is one comparison at a time. | Scope to A/B (shared vs duplicated) for v1; URL sharing covers the "save this run" need |

---

## Feature Dependencies

```
Team composition input (members + seniority + salary)
    └──required by──> Feature cost calculation (standalone)
                          └──required by──> Shared vs duplicated comparison
                                                └──required by──> Break-even point
                                                └──required by──> Temporal cost curves (chart)

Story points input
    └──required by──> Team velocity input
                          └──required by──> SP-to-hours conversion
                                                └──feeds──> Feature cost calculation

Research-backed defaults (divergence rate, bug multiplier, coordination factor, generalization factor)
    └──required by──> Shared vs duplicated comparison
    └──optional upgrade──> Overridable advanced inputs panel

Temporal cost curves (chart)
    └──enhances──> Break-even point (visual callout on chart)

URL-encoded state
    └──enhances──> Scenario sharing (no dependency on any other feature — additive)

Divergence rate modeling
    └──requires──> Temporal cost curves (chart) (divergence is a time-dependent phenomenon)

Per-copy cost breakdown (N teams)
    └──enhances──> Side-by-side comparison
    └──requires──> Feature cost calculation
```

### Dependency Notes

- **Team composition requires salary + seniority:** The loaded hourly cost is the base unit for every downstream calculation. This must be built first.
- **Story points require velocity:** SP input is meaningless without a velocity to convert to hours. Both inputs must be on screen together.
- **Divergence modeling requires the chart:** The non-linear widening of costs over time is only meaningful when shown visually. Divergence without the chart is a number without context.
- **Break-even enhances the chart:** The break-even point can be shown as a table cell, but its value is dramatically higher when marked on the cumulative cost curve. Build the chart first, then add the callout.
- **Overridable defaults enhance but do not block:** The tool is usable with hardcoded research defaults. Advanced override is an upgrade, not a prerequisite.

---

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed for an engineering lead to use this in a real stakeholder presentation.

- [ ] Team composition input (member names, seniority, salary override) — base unit for all calculations
- [ ] Feature size input via story points with velocity, or direct hours/days — covers both team types
- [ ] Time horizon slider (1–10 years) — required for temporal comparison
- [ ] Standalone feature cost output (single team, no comparison yet) — validates the cost model before adding comparison complexity
- [ ] Shared vs duplicated cost comparison with N-copy input — core product value
- [ ] Break-even point calculation, displayed as a text callout and marked on chart — the single most decision-relevant output
- [ ] Temporal cumulative cost curves (shared path vs duplicated path) — required for presentations
- [ ] Cost breakdown table by category (initial dev, maintenance, coordination, bugs, divergence) — required for credibility
- [ ] Research-backed defaults pre-filled (divergence rate, bug multiplier, coordination factor, generalization factor) — allows immediate use
- [ ] Overridable advanced inputs (all research constants) — required for teams that know their own numbers differ from defaults

### Add After Validation (v1.x)

Features to add once core calculation is working and at least one team has used it in a real presentation.

- [ ] URL-encoded state for scenario sharing — add if users report needing to share or revisit configurations
- [ ] Annotation of research citations inline (tooltips per coefficient) — add if stakeholders challenge the numbers
- [ ] Presentation-ready chart export (SVG/PNG) — add if browser print proves insufficient in real presentations
- [ ] Per-copy divergence cost breakdown per team — add if N-team scenarios surface as a common use case

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Generalization factor as a visible adjustable input on the main UI (currently buried in advanced) — defer until users explicitly request it
- [ ] Mobile-responsive layout — defer; desktop-first is validated by the presentation use case
- [ ] Additional locale salary datasets (UK, Germany, US) — defer; validate French-market use first

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Team composition input | HIGH | LOW | P1 |
| Feature size input (SP + hours) | HIGH | LOW | P1 |
| Shared vs duplicated comparison | HIGH | MEDIUM | P1 |
| Temporal cost curves (chart) | HIGH | MEDIUM | P1 |
| Break-even point | HIGH | LOW | P1 |
| Cost breakdown table | HIGH | LOW | P1 |
| Time horizon slider | HIGH | LOW | P1 |
| Research-backed defaults | HIGH | LOW | P1 |
| Overridable advanced inputs | MEDIUM | LOW | P2 |
| Divergence rate modeling (non-linear) | HIGH | HIGH | P2 |
| URL-encoded state / sharing | MEDIUM | LOW | P2 |
| Citation annotations (tooltips) | MEDIUM | LOW | P2 |
| Chart export (SVG/PNG) | MEDIUM | MEDIUM | P2 |
| Per-copy cost breakdown (N teams) | MEDIUM | MEDIUM | P2 |
| Mobile-responsive layout | LOW | MEDIUM | P3 |
| Additional locale salary datasets | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch — tool is unusable or uncredible without it
- P2: Should have — add when core is working, before first external stakeholder presentation
- P3: Nice to have — defer until v1 is validated

---

## Competitor Feature Analysis

No direct competitor for "shared vs duplicated feature cost" comparison exists. The closest analogues are TCO tools (Azure, AWS), technical debt calculators (Codacy, Second Talent), and design system cost guides.

| Feature | Azure TCO Calculator | Codacy Tech Debt Calculator | This Tool |
|---------|---------------------|----------------------------|-----------|
| Time horizon input | Yes (1–5 years) | No | Yes (1–10 years) |
| Side-by-side cost comparison | Yes (on-prem vs cloud) | No | Yes (shared vs duplicated) |
| Temporal cost curves | Yes | No | Yes |
| Cost breakdown by category | Yes (compute, storage, labor) | Partial (debt ratio, churn) | Yes (dev, maintenance, coordination, bugs, divergence) |
| Break-even / crossover point | No | No | Yes — key differentiator |
| Research-cited default constants | No | No | Yes — key differentiator |
| Divergence / drift modeling | No | Partial (code churn) | Yes — unique to this domain |
| Team composition input | No (uses infrastructure units) | Employee count only | Yes (named members + seniority) |
| Coordination overhead as cost line | No | No | Yes — key differentiator |
| Standalone HTML, no login | No | No | Yes — key constraint and advantage |
| Export / share | PDF report download | No | URL state (v1.x), browser print |

**Note:** Azure TCO Calculator is being deprecated end of August 2025 (per Microsoft announcement), which reduces the reference set of polished TCO tool UX to study.

---

## Sources

- Azure TCO Calculator (features analyzed): https://azure.microsoft.com/en-us/pricing/tco/calculator/
- Azure TCO deprecation: https://techcommunity.microsoft.com/blog/finopsblog/understanding-the-total-cost-of-ownership/4419195
- Codacy Technical Debt Calculator: https://www.codacy.com/technical-debt-calculator
- Second Talent Technical Debt Calculator: https://www.secondtalent.com/technical-debt-calculator/
- Build vs Buy framework (table stakes vs differentiators): https://www.productteacher.com/articles/sequencing-table-stakes-and-differentiators
- HubSpot TCO Calculator (UX reference): https://www.hubspot.com/tco-calculator
- Design System cost guide (analogous domain): https://thedesignsystem.guide/blog/a-guide-for-calculating-design-system-costs
- Project research doc: `/docs/feature-cost-shared-vs-duplicated.md` (COCOMO II formulas, French salary data, divergence/bug/coordination factors) — HIGH confidence, primary source

---
*Feature research for: software cost calculator / TCO comparison dashboard (shared vs duplicated code)*
*Researched: 2026-03-23*
