# Presentation Notes — Feature Cost: Shared Code vs Duplicated Code

> Reference document to accompany the presentation. Bullet points for quick reading.

---

## Slide 2 — Context: Why this analysis?

- **Core question**: when developing a feature for multiple codebases, is it better to share code (shared lib / monorepo) or duplicate (copy-adapt)?
- **Massive financial impact**: maintenance = 50-80% of total software cost → the initial choice determines the long term
- **Not dogmatic**: each approach has its use cases. The goal is to quantify in order to decide
- **Sources**: COCOMO II model, IEEE studies on bug propagation, France 2025-2026 salary data

---

## Slide 3 — Maintenance dominates total cost

- **50-80% of total cost** of software is maintenance (up to 90% for legacy systems)
- Over 5 years: **~21% initial dev** vs **~79% maintenance/evolution**
- Maintenance breakdown:
  - Corrective (bugs): 17-21%
  - Adaptive (environment, OS, APIs): 18-25%
  - Perfective (new features): 50-60%
  - Preventive (refactoring): 4-5%
- **Conclusion**: optimizing maintenance has far more impact than reducing initial dev cost
- Annual maintenance budget = 15-25% of initial development cost
- Over 5 years, total cost = 2x to 4x the initial dev

---

## Slide 4 — Initial costs: the upfront investment

### Shared code
- Initial dev + generalization overhead: **+20-40% more code** to make code sufficiently abstract
  - Create interfaces/abstractions
  - Configuration options
  - More exhaustive tests
  - API documentation
- Infrastructure setup: **5-11 weeks** of senior dev effort
  - Repo/monorepo config: 0.5-1 week
  - CI/CD pipeline: 1-2 weeks
  - Documentation: 1-2 weeks
  - Versioning/registry: 0.5-1 week
  - Integration tests: 1-2 weeks
- **Example**: €33,800 (dev) + €18,200 (setup) = **~€52,000**

### Duplicated code
- Dev codebase A: baseline cost (e.g., €26,000)
- Porting to codebase B: **+50-80%** of initial effort
  - Design is already done, edge cases identified
  - BUT must adapt to conventions, patterns and deps of codebase B
  - The more codebases differ, the higher the factor
- **Example**: €26,000 × 1.65 = **~€43,000**
- **Initial difference: duplication is ~20% cheaper upfront**

---

## Slide 5 — The trap: accelerating maintenance costs

### Double maintenance (factor 1.8x → 2.0x+)
- Every bug must be found and fixed in both codebases
- Every functional evolution: double implementation (1.5x-2x)
- Regression testing: 2x (separate suites)
- Code review: 2x (PRs in 2 repos)
- Factor increases by +0.05 per year as copies progressively diverge
- Monitoring and alerting: 2x (separate systems)

### Growing synchronization (+20%/yr increase)
- Sync cost is exponential: each difference makes future syncs more complex
- Year 1: ~€10,000 → Year 3: ~€14,400 → Year 5: ~€23,000
- Cost triples in 5 years (snowball / compound effect)
- For each evolution in A: understand the change → adapt to B (which has diverged) → test in B → separate review → deploy to B

### Propagated bugs: 33% never fixed in the other copy
- **IEEE study on 4 open-source Java projects**: 1/3 of cloned code fragments undergoing bug fixes contain propagated bugs (= the same bug not fixed in other copies)
- Cloning also multiplies **security vulnerabilities** (ACM ESEM 2017)
- Mechanisms: incomplete propagation, cross-regression, false sense of security
- Estimated additional bug cost: **~€50,600/yr** (2 critical + 6 major + 12 minor)

### Slide conclusion
- **Duplication is only viable for short-lived features**

---

## Slide 6 — 3-year cost comparison (France context)

### Cumulative cost table

| | Year 0 | Year 1 | Year 2 | Year 3 |
|---|---|---|---|---|
| **Shared code** | €52,000 | €119,000 | €186,000 | €253,000 |
| **Duplicated code** | €43,000 | €114,000 | €187,000 | €263,000 |

### Key takeaways
- **Year 0**: duplication is ~€9,000 cheaper (no lib setup)
- **Year 1**: cumulative costs are nearly identical (~€5K diff)
- **Year 2**: crossover happens, duplication starts costing more
- **Year 3**: duplication costs ~€10,000 more — and **the gap accelerates from there**
- Beyond 3 years, the gap widens exponentially

### Calculation assumptions
- 400h feature dev (2 seniors, 5 weeks)
- Fully loaded hourly rate: €65/h (senior in France)
- 2 consumer teams
- 8 evolutions per year
- Divergence rate: 20%/yr

---

## Slide 7 — Break-even: when sharing becomes profitable

- **Typical break-even: 6 to 18 months**
- In the worked example: **~18 months** (1.5 years)
- Calculation: initial premium (€26,000) / net monthly savings (~€1,400/month)
- Monthly savings = maintenance savings (~€3,100) - coordination cost (~€1,700)

### What shortens break-even
- Large feature (more maintenance savings)
- High evolution frequency (more sync avoided)
- Frequent production bugs (additional bug costs avoided)
- More than 2 consumer codebases → multiplier effect
- Teams already in a monorepo (lighter setup)

### What lengthens break-even
- Small and stable feature (little maintenance needed)
- Highly independent teams (costly coordination)
- Very different codebases (difficult generalization, factor 1.4+)
- End-of-life feature (little time to amortize)

### Important point
- If maintenance savings < coordination cost → **break-even never happens** = sharing is not profitable for this feature

---

## Slide 8 — Scale factor: the multiplier effect

### Duplicated / shared cost ratio over 3 years
- **2 codebases: ratio 1.04x** → nearly equivalent, slight sharing advantage
- **3 codebases: ratio 1.56x** → sharing saves ~€160,000 over 3 years
- **5 codebases: ratio 2.47x** → duplication costs 2.5x more

### Why this acceleration?
- Duplicated code: each new codebase = near-linear cost (porting + maintenance + sync + bugs)
- Shared code: each new consumer = **only 5-10% of porting cost** (library integration)
- Brooks's law applies to coordination: n(n-1)/2 interfaces
  - 2 teams = 1 interface, 3 teams = 3, 5 teams = 10
  - BUT this coordination cost is largely offset by maintenance savings

### Conclusion
- **Starting from 3 codebases, sharing is clearly the winner**
- At 5 codebases, there's no debate

---

## Slide 9 — Organizational impact

### Onboarding
- Shared code: dev learns 1 source + the sharing system → +1-2 weeks to standard process
- Duplicated code: dev must understand both implementations AND their differences
- Time to full productivity: 3-6 months without structure, 8-12 weeks with structured onboarding
- Developer replacement cost in France: €50,000-100,000 (recruitment + onboarding + lost productivity)

### QA / Testing
- QA = 20-30% of dev effort standard (40-50% for critical systems)
- **Duplication = double testing effort** (2 suites, 2 environments, 2 pipelines)
- Code review: ~12.5% of dev time (5h/week/dev). With duplication = doubled.

### Product Management
- Shared: 1 unified backlog + spec generalization overhead (+20%)
- Duplicated: 1.3-1.5x planning effort (2 backlogs to coordinate)
- Incident management: 1x (shared) vs 1.5-2x (duplicated, investigation in 2 codebases)

### UX Consistency
- Shared: **guaranteed by the code** — same component = same behavior
- Duplicated: progressive and inevitable degradation
  - Functional divergence over time
  - UX inconsistencies and version-specific bugs

---

## Slide 10 — Technical debt

### Key figure
- **42% of dev time** is lost to technical debt and poor quality code (Stripe Developer Coefficient 2018)
  - 13.5h/week on technical debt
  - 3.8h/week on bad code
  - Out of 41.1h/week total
- Global cost to the US economy: **$2.41 trillion** (CISQ 2022), including $1.52 trillion in technical debt alone

### Duplication = debt accelerator
- Divergence factor starts at 1.0 and can reach 3.0-5.0 after 2 years
- Code churn doubles with duplication → increases bug probability
- Target Technical Debt Ratio ≤ 5% — duplication blows up this ratio
- Cost of fixing per line: $1-5 depending on complexity

### Bug cost by detection phase
- Design: 1x (documentation fix)
- Implementation: 3-5x (code change + tests)
- QA/Testing: 5-10x (diagnosis + fix + retest + potential redesign)
- Production: 10-30x (prod diagnosis + hotfix + deployment + user impact)
- **With duplication, a production bug potentially affects 2 codebases → amplified cost**

### Methodological note
- Historical ratios "1x→100x" (attributed to IBM) come from 1981 internal training notes, not a published study
- The principle remains valid, but exact multipliers vary by context

---

## Slide 11 — Summary comparison

| Dimension | Shared Code | Duplicated Code |
|---|---|---|
| Initial cost | +30-50% (generalization + setup) | ~170-220% of one feature |
| Annual maintenance | 15-25% of initial dev | 30-50% (doubled) |
| Bug risk | 1x (single source) | 33% unfixed propagated bugs |
| UX Consistency | Guaranteed by the code | Progressive degradation |
| Scalability | Excellent (linear) | Poor (N × cost) |
| Break-even | 6-18 months | Never (rising costs) |
| Onboarding | Simple (1 source) | Complex (N sources + differences) |
| Time to market | Longer initially | Shorter initially |
| Flexibility | Limited (coupling) | High (total independence) |

---

## Slide 12 — Recommendations: when to choose what?

### Prefer shared code if:
- Feature lifespan > 18 months
- High evolution frequency (several times per quarter)
- 3+ consumer codebases (or planned long-term)
- UX consistency is critical for the product
- Team can invest in initial setup
- System is growing (new consumers foreseeable)

### Duplication may work if:
- Short-lived feature (< 6 months, prototype, MVP)
- Very few evolutions expected after delivery
- Very different codebases (languages, frameworks, architectures)
- Completely independent and unaligned teams
- Rapid prototype or MVP where time-to-market is king
- No need for UX consistency between products

### Key closing message
- **Duplication is a short-term convenience that comes at a steep medium/long-term price**
- Sharing is an investment: more expensive upfront, but quickly amortized
- Beyond 2 codebases, sharing is almost systematically the winner

---

## Key figures to remember (cheat sheet)

| Metric | Value |
|---|---|
| Maintenance as % of TCO | 50-80% |
| Shared code break-even | 6-18 months |
| Propagated bugs in clones | 33% (IEEE) |
| Dev time lost to tech debt | 42% (Stripe) |
| Ratio at 5 codebases | 2.47x in favor of sharing |
| Production vs design bug cost | 10-30x |
| Porting factor | 0.5-0.8x of initial effort |
| Generalization overhead | +20-40% |
