# Feature Cost: Shared Code vs Duplicated Code

## Data Guide for Building a Cost Calculator

---

## 1. Software Development Cost Estimation Models

### 1.1 COCOMO II (Constructive Cost Model)

COCOMO II is the industry standard for estimating software development effort [[1]](https://en.wikipedia.org/wiki/COCOMO) [[2]](https://softwarecost.org/tools/COCOMO/). It is based on project size (in thousands of lines of code, KSLOC) and adjustment factors.

**Main Formula:**

```
Effort (Person-Months) = 2.94 × EAF × (KSLOC)^E
```

Where [[3]](https://docs.linuxfoundation.org/lfx/insights/v3-beta-version-current/getting-started/landing-page/cocomo-cost-estimation-simplified) :
- **EAF** (Effort Adjustment Factor) : derived from Cost Drivers (typical values : 0.9 to 1.4)
- **E** : exponent derived from 5 Scale Drivers
- **KSLOC** : thousands of lines of source code

**Project Classification** [[4]](https://www.geeksforgeeks.org/software-engineering/software-engineering-cocomo-model/) :

| Type | Description | Coefficient a | Exponent b |
|------|-------------|---------------|------------|
| Organic | Small team, well-understood environment | 2.4 | 1.05 |
| Semi-detached | Mixed team, moderate complexity | 3.0 | 1.12 |
| Embedded | High complexity, strong constraints | 3.6 | 1.20 |

**Development Time Calculation:**

```
Time (months) = 2.5 × (Effort)^(0.32 to 0.39)
```

**Required Personnel Calculation:**

```
Personnel = Effort / Time
```

### 1.2 Estimation by Story Points

For agile teams, an alternative approach is to use story points:

```
Cost per story point = (Average team salary × Sprint duration) / Average velocity
```

**Reference Data:**
- Average velocity of a 5-7 dev team: 30-50 story points per 2-week sprint
- Average cost per story point (US): $1,000 to $3,000 depending on seniority

### 1.3 Developer Costs — France Data (2025-2026)

#### Annual Gross Salaries (Employment Contract) [[35]](https://welovedevs.com/fr/salaires/developpeur-web) [[36]](https://www.journaldunet.com/business/salaire/developpeur/salaire-00419) [[37]](https://blog.adatechschool.fr/salaire-developpeur-web/)

| Seniority | Median Annual Gross Salary (France) | Annual Gross Salary (Paris / Île-de-France) |
|-----------|-------------------------------------|---------------------------------------------|
| Junior (0-2 years) | 33,000 - 40,000 € | 38,000 - 45,000 € |
| Mid-level (3-5 years) | 40,000 - 50,000 € | 45,000 - 55,000 € |
| Senior (5-10 years) | 50,000 - 65,000 € | 55,000 - 75,000 € |
| Lead / Staff (10+ years) | 60,000 - 80,000 € | 70,000 - 95,000 € |

#### Loaded Cost (Employer Contributions)

In France, employer contributions represent approximately 42-45% of gross salary [[5]](https://www.dougs.fr/blog/charges-patronales/) [[6]](https://staffmatch.com/blog/fr/charges-patronales/) (health insurance, family benefits, retirement, unemployment, etc.). Total employer cost ("super-gross") is therefore:

```
Employer Cost ≈ Gross Salary × 1.42 to 1.45
```

| Seniority | Annual Gross Salary | Annual Employer Cost | Loaded Hourly Cost (1,607h/year) |
|-----------|--------------------|-----------------------|---------------------------------|
| Junior | 36,000 € | 51,120 - 52,200 € | 32 - 33 €/h |
| Mid-level | 45,000 € | 63,900 - 65,250 € | 40 - 41 €/h |
| Senior | 58,000 € | 82,360 - 84,100 € | 51 - 52 €/h |
| Lead / Staff | 75,000 € | 106,500 - 108,750 € | 66 - 68 €/h |

**Note:** The loaded hourly cost above is based on 1,607 hours worked per year (legal basis in France, 35h/week). For "fully loaded" cost also including tools, facilities, management overhead, typically add 20-30%, resulting in:

| Seniority | "Fully Loaded" Hourly Cost (estimate) |
|-----------|------------------------------------------|
| Junior | 38 - 43 €/h |
| Mid-level | 48 - 53 €/h |
| Senior | 61 - 68 €/h |
| Lead / Staff | 80 - 88 €/h |

#### Freelance Daily Rate (Daily Average Rate) — France 2025

Useful alternative for the calculator if the team uses external providers [[7]](https://www.portage360.fr/tjm-developpeur-en-france/) [[8]](https://www.silkhom.com/barometre-des-tjm-informatique-electronique-digital/) [[9]](https://www.blogdumoderateur.com/freelances-taux-journaliers-moyens-it-france-2025/) :

| Profile | Average Daily Rate (Province) | Average Daily Rate (Paris/IDF) |
|--------|----------------------|-----------------------|
| Junior (0-3 years) | 300 - 400 €/day | 350 - 450 €/day |
| Confirmed (3-7 years) | 400 - 550 €/day | 450 - 650 €/day |
| Senior (7+ years) | 550 - 700 €/day | 600 - 800 €/day |
| Expert / Lead (10+ years) | 700 - 900 €/day | 750 - 1,000+ €/day |

**Daily Rate Conversion to Hourly:** Daily Rate / 7h (standard freelance day) or Daily Rate / 8h depending on convention.

---

## 2. Software Maintenance Costs

### 2.1 Maintenance as a Percentage of TCO

Maintenance is the largest cost item in a software lifecycle [[10]](https://www.scnsoft.com/software-development/maintenance-and-support/costs) [[11]](https://idealink.tech/blog/software-development-maintenance-true-cost-equation) [[12]](https://galorath.com/blog/software-maintenance-costs/) :

| Metric | Value |
|----------|--------|
| Maintenance as % of Total TCO | 50-80 % (up to 90 % for legacy systems) |
| Cloud-based apps | 30-60 % of TCO |
| On-premises / enterprise | 70-90 % of TCO |
| Embedded software | 65-80 % of TCO |
| Annual maintenance budget | 15-25 % of initial development cost |
| Cost over lifetime (5 years) | 2x to 4x initial development cost |

**Distribution over 5 years** [[11]](https://idealink.tech/blog/software-development-maintenance-true-cost-equation) [[34]](https://www.techstep.io/articles/app-maintenance-cost-can-be-three-times-higher-than-development-cost) :
- Planning + Initial Development: ~21% of total cost
- Maintenance and Evolution: ~79% of total cost

### 2.2 Types of Maintenance and Their Distribution [[12]](https://galorath.com/blog/software-maintenance-costs/) [[13]](https://maddevs.io/customer-university/software-maintenance-costs/)

| Type | % of Maintenance Effort | Description |
|------|------------------------------|-------------|
| Corrective | 17-21 % | Bug fixes |
| Adaptive | 18-25 % | Adaptation to environment (OS, APIs, dependencies) |
| Perfective | 50-60 % | New features, improvements |
| Preventive | 4-5 % | Refactoring, proactive optimization |

### 2.3 Bug Fix Cost by Detection Phase

The idea that the cost of fixing a bug increases over time in the development cycle is widely accepted in the industry. Empirical studies show that defects detected later require more diagnostic work, corrections, and re-testing [[14]](https://www.functionize.com/blog/the-cost-of-finding-bugs-later-in-the-sdlc) [[15]](https://www.blackduck.com/blog/cost-to-fix-bugs-during-each-sdlc-phase.html).

**Realistic Order of Magnitude (based on industry data):**

| Detection Phase | Relative Cost | Justification |
|--------------------|-------------|---------------|
| Specifications / Design | 1x | Documentation fix, no code changes |
| Implementation | 3-5x | Code modification + unit tests |
| QA / Testing | 5-10x | Diagnosis + fix + re-test + potential re-design |
| Production | 10-30x | Production diagnosis + hotfix + deployment + user impact |

**Methodological Note:** The historical ratios often cited (1x→6x→15x→100x, attributed to "IBM Systems Sciences Institute") actually come from internal IBM training notes from 1981 and not from a published research study [[40]](https://www.theregister.com/2021/07/22/bugs_expense_bs/). The general principle remains valid — fixing late costs more — but the exact multipliers vary considerably depending on context.

**Verified Data on Bug Propagation in Duplicated Code:** An IEEE study on bug propagation in code clones shows that up to 33% of cloned code fragments that undergo bug fixes contain propagated bugs (identical bugs not fixed in other copies) [[41]](https://ieeexplore.ieee.org/document/8094424/) [[42]](https://www.sciencedirect.com/science/article/abs/pii/S0164121219301815).

**Implication for Duplication:** When a feature is duplicated, a bug found in one codebase must be identified and fixed in the other as well. Empirical studies confirm that this propagation is a real and frequent problem, potentially doubling fix costs and increasing regression risk.

---

## 3. Specific Costs: Shared Code (Shared Library / Monorepo)

### 3.1 Initial Costs (One-time)

| Cost Item | Estimation |
|---------------|------------|
| Shared library architecture and design | 2-4 weeks (1-2 seniors) |
| CI/CD configuration for the package | 1-2 weeks |
| API documentation | 1-2 weeks |
| Monorepo or private registry setup (npm, PyPI, etc.) | 0.5-1 week |
| Unit and integration tests for the lib | 1-2 weeks |
| **Total estimated setup** | **5-11 weeks of senior dev effort** |

### 3.2 Recurring Maintenance Costs

| Cost Item | Frequency | Estimated Effort |
|---------------|-----------|---------------|
| Version management (semver, changelog) | Each release | 2-4h per release |
| Code review on shared lib PRs | Continuous | 5-10h/week |
| Merge conflict resolution | Variable | 2-8h/week |
| Breaking change migration | Quarterly | 1-3 days per consumer |
| Dependency updates | Monthly | 0.5-1 day |
| CI/CD maintenance | Monthly | 0.5-1 day |
| Support for consuming teams | Continuous | 5-10h/week |

### 3.3 Coordination Costs

| Factor | Impact |
|---------|--------|
| Cross-team synchronization meetings | 2-4h/week per team |
| Interface/API negotiation | 1-2 days per major feature |
| Joint design review | 0.5-1 day per feature |
| Coordination time (ING study) | 11-23 % of dev time [[17]](https://andrewbegel.com/papers/coordination-chase09.pdf) |
| Coordination interfaces (Brooks' formula) | n(n-1)/2 where n = number of teams |

### 3.4 Hidden Risks and Costs

- **Strong Coupling:** Changes to the shared lib impact all consumers. A breaking change can block N teams [[31]](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/monorepo-vs-multirepo).
- **Release Bottleneck:** The lib becomes a contention point for releases [[38]](https://kodus.io/en/monorepo-vs-multi-repo-strategy/).
- **Versioning Hell:** When different teams need different versions simultaneously [[39]](https://www.aviator.co/blog/what-is-a-monorepo-and-why-use-one/).
- **Increased Complexity:** Code must be generic enough to serve multiple use cases, which increases complexity (estimated +20-40% of code compared to a specific implementation) [[31]](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/monorepo-vs-multirepo) [[32]](https://livebook.manning.com/book/software-mistakes-and-tradeoffs/chapter-2).

---

## 4. Specific Costs: Duplicated Code

### 4.1 Initial Costs (One-time)

| Cost Item | Estimation |
|---------------|------------|
| Feature development (codebase A) | X weeks (baseline) |
| Adaptation and porting to codebase B | 0.5X to 0.8X (50-80% of initial effort) |
| Testing for codebase B | 0.6X to 1X of initial test effort |
| Design adaptation (entry points, UI) | 0.2X to 0.4X |
| **Total estimated** | **1.7X to 2.2X of a single implementation** |

### 4.2 Recurring Maintenance Costs

| Cost Item | Impact vs Unique Code |
|---------------|-----------------------|
| Bug fixes | 2x (each bug must be found and fixed in both codebases) |
| Feature evolution | 1.5x to 2x (double implementation) |
| Regression testing | 2x (separate test suites) |
| Code review | 2x (PRs in 2 repos) |
| Monitoring and alerting | 2x (separate systems) |
| Documentation | 1.5x to 2x |

### 4.3 Hidden Risks and Costs of Duplication

- **Functional Divergence:** Over time, the two copies diverge, creating UX inconsistencies and version-specific bugs [[20]](https://www.graphapp.ai/blog/the-hidden-costs-of-duplicate-code-in-software-engineering).
- **Loss of Knowledge:** The team maintaining copy B may not understand the design decisions of copy A [[32]](https://livebook.manning.com/book/software-mistakes-and-tradeoffs/chapter-2).
- **Double Testing Effort:** Each feature, each bug fix requires testing in both codebases [[21]](https://idealink.tech/blog/understanding-software-testing-costs-development-breakdown).
- **Manual Synchronization:** Tracking differences between the two versions requires constant effort to inventory and compare [[19]](https://linearb.io/blog/code-duplication).
- **Increased Code Churn:** Code churn metrics double, increasing bug probability [[29]](https://getdx.com/blog/technical-debt-ratio/).

**Reference Metric:** An IEEE study on 4 open source Java projects shows that up to 33% of cloned code fragments that undergo bug fixes contain propagated bugs (i.e. the same bug not fixed in other copies) [[41]](https://ieeexplore.ieee.org/document/8094424/) [[42]](https://www.sciencedirect.com/science/article/abs/pii/S0164121219301815). Furthermore, code cloning multiplies security vulnerabilities [[45]](https://dl.acm.org/doi/abs/10.1109/ESEM.2017.9). In practice, duplication significantly increases defect risk because fixes are not always propagated uniformly [[18]](https://www.software.com/engineering-metrics/code-duplication) [[19]](https://linearb.io/blog/code-duplication).

---

## 5. Organizational and Cross-Cutting Costs

### 5.1 Product Management

| Activity | Shared Code | Duplicated Code |
|----------|-------------|-----------------|
| Backlog planning | 1x (unified backlog for feature) | 1.3x-1.5x (coordination of 2 backlogs) |
| Specifications | 1x + generalization overhead (+20%) | 1.5x-2x (specs adapted per codebase) |
| Release tracking | Complex (inter-repo dependencies) | Simple but double (2 independent releases) |
| Incident management | 1x (single source) | 1.5x-2x (investigation in 2 codebases) |

### 5.2 Design / UX

| Activity | Shared Code | Duplicated Code |
|----------|-------------|-----------------|
| Design system | 1x (reused components) | 1x initial then progressive divergence |
| User research | 1x (identical feature) | 1x-1.2x (different contexts) |
| Design iterations | 1x + negotiation cost | 1.5x-2x (independent iterations) |
| UX consistency long-term | Guaranteed by shared code | Progressive degradation (sync effort) |

### 5.3 QA / Testing

| Metric | Reference Value |
|----------|---------------------|
| QA as % of development effort | 20-30% (standard), 40-50% (critical systems) [[21]](https://idealink.tech/blog/understanding-software-testing-costs-development-breakdown) [[22]](https://intersog.com/blog/development/software-testing-percent-of-software-development-costs/) |
| Tester to Developer Ratio | 1 tester per 3-4 developers [[23]](https://hypersense-software.com/blog/2025/07/19/software-development-effort-allocation-dev-qa-design-pm-ratio/) |
| Bug Reduction with Code Review | -10% of time on bugs [[24]](https://blog.codacy.com/10-facts-about-code-reviews-and-quality) |
| Code Review Cost | 12.5% of dev time (5h/week/dev on average) [[25]](https://coralogix.com/blog/this-is-what-your-developers-are-doing-75-of-the-time-and-this-is-the-cost-you-pay/) [[33]](https://engineering.fb.com/2022/11/16/culture/meta-code-review-time-improving/) |

### 5.4 Onboarding and Turnover

| Metric | Value |
|----------|--------|
| Time to full productivity | 3-6 months (without structure), 8-12 weeks (with structured onboarding) [[26]](https://fullscale.io/blog/developer-onboarding-best-practices/) |
| Productivity loss cost per new dev | ~30,000 - 40,000 € over 6 weeks (France) [[26]](https://fullscale.io/blog/developer-onboarding-best-practices/) |
| Impact on team velocity | -25 to -40% during integration [[26]](https://fullscale.io/blog/developer-onboarding-best-practices/) |
| Mentor productivity loss | -30% during onboarding [[27]](https://about.gitlab.com/the-source/platform/how-to-accelerate-developer-onboarding-and-why-it-matters/) |
| Dev replacement cost (France) | 50,000 - 100,000 € (recruitment + onboarding + lost productivity) [[28]](https://www.growin.com/blog/developer-retention-costs-onboarding/) |

**Calculator Impact:** With duplicated code, a new developer must understand both implementations and their differences. With shared code, they learn only one implementation but must understand the sharing mechanism.

---

## 6. Technical Debt

### 6.1 Quantitative Metrics

| Metric | Formula / Value | Ideal Target |
|----------|------------------|--------------|
| Technical Debt Ratio (TDR) | Correction Cost / Reconstruction Cost [[29]](https://getdx.com/blog/technical-debt-ratio/) | ≤ 5 % |
| Code Churn | (Lines Added + Deleted) / Total Lines × 100 [[29]](https://getdx.com/blog/technical-debt-ratio/) | < 15 % per sprint |
| Time Spent on Technical Debt | % of dev time spent on debt + poor code | 42% (13.5h debt + 3.8h poor code over 41.1h/week, Stripe Developer Coefficient 2018) [[43]](https://stripe.com/files/reports/the-developer-coefficient.pdf) |
| Cost to US Economy (2022, CISQ) | $2.41 trillion (of which $1.52 trillion in technical debt alone) [[44]](https://www.it-cisq.org/the-cost-of-poor-quality-software-in-the-us-a-2022-report/) | — |

### 6.2 Impact of Duplication on Technical Debt

Code duplication is one of the primary contributors to technical debt:

```
Technical Debt (duplication) = Nb_Duplicated_Lines × Cost_Fix_Per_Line × Divergence_Factor
```

Where:
- **Divergence_Factor** increases over time (1.0 initially, can reach 3.0-5.0 after 2 years)
- **Cost_Fix_Per_Line**: $1-5 per line of code (depends on complexity)

---

## 7. Calculator Formulas — Detailed Explanations

This section breaks down each formula verbosely with the reasoning behind each component, concrete numerical examples, and implementation advice for the calculator.

---

### 7.1 Total Cost — Shared Code Approach

#### Overview

The idea of this formula is to capture the full cost when choosing to create a library (or package, or module in a monorepo) that will be consumed by multiple codebases. This choice implies a heavier initial investment (designing generic code, documenting an API, setting up tooling), but the benefits are reaped over time because any correction or evolution only happens once.

#### Formula

```
Total_Shared_Cost = Initial_Dev_Cost
                  + Lib_Setup_Cost
                  + Σ(Annual_Maintenance_Cost × Year)
                  + Annual_Coordination_Cost × Nb_Years
                  + Onboarding_Cost × Nb_New_Devs
```

#### Breakdown of Each Term

**1. Initial_Dev_Cost — Development of the Feature Itself**

```
Initial_Dev_Cost = Nb_Devs × Hourly_Cost × Dev_Hours × Generalization_Factor
```

This term represents the cost to develop the feature in its "shareable" version. The `Generalization_Factor` (typically 1.2 to 1.4, recommended default value: 1.3) reflects the overhead to make the code sufficiently abstract and configurable to work in multiple contexts. Concretely, this means that where a developer would write hard-coded code adapted to a single use case, they must now:

- Create interfaces/abstractions for points of variation (entry points, data display, etc.)
- Add configuration options to cover differences between target codebases
- Write more exhaustive tests covering different configuration combinations
- Document the public API clearly for consuming teams

**Numerical Example (France Context):**
Imagine a feature that would take 400 hours to develop in a specific manner (2 senior devs for 5 weeks). With a "fully loaded" hourly cost of 65 €/h (senior in France):
- Specific version: 400h × 65 € = 26,000 €
- Shareable version: 400h × 65 € × 1.3 = 33,800 €
- The generalization overhead is 7,800 €, but this is an investment that will be amortized over time.

**2. Lib_Setup_Cost — Setting Up the Sharing Infrastructure**

```
Lib_Setup_Cost = Nb_Weeks_Setup × 40h × Senior_Hourly_Cost
```

This is the "one-time" cost to create all the technical infrastructure necessary for sharing. This is not feature development itself, it is tooling work around it. This includes:

- **Repository / Monorepo Configuration** (0.5-1 week): Package structure setup, build tool configuration (Webpack, Rollup, esbuild...), entry point definition, tree-shaking configuration, etc.
- **CI/CD Pipeline** (1-2 weeks): Automated tests on each PR, automatic publication of new versions, staging environment setup, consumer compatibility verification.
- **Documentation** (1-2 weeks): README, integration guide, API documentation (JSDoc, Storybook for UI components, etc.), usage examples.
- **Versioning and Registry** (0.5-1 week): Semantic versioning configuration, automatic changelog setup, publication to private registry (npm private, Artifactory, etc.).
- **Integration Tests** (1-2 weeks): Tests verifying the lib works correctly in the context of each consuming codebase.

**Numerical Example (France Context):**
For a typical 8-week setup with a senior dev at 65 €/h (fully loaded):
- Lib_Setup_Cost = 8 × 35h × 65 = 18,200 €
- (Note: 35h/week in France, legal basis)
- This cost is paid only once, at the start of the project.

**3. Annual_Maintenance_Cost — Ongoing Library Maintenance**

```
Annual_Maintenance_Cost = (Initial_Dev_Cost × Maintenance_Rate)
                        + Annual_Versioning_Cost
                        + Annual_Consumer_Support_Cost
```

Annual maintenance of a shared library has three components:

- **Maintenance_Rate** (0.15 to 0.25): The percentage of initial development cost spent annually on maintenance (bug fixes, dependency updates, performance improvements, preventive refactoring). Industry data shows maintenance costs 15-25% of initial development per year [[10]](https://www.scnsoft.com/software-development/maintenance-and-support/costs) [[12]](https://galorath.com/blog/software-maintenance-costs/). For a shared library, we're in the lower range (0.15-0.18) because there's only one codebase to maintain.

- **Annual_Versioning_Cost**: Time spent managing releases. If doing 12 releases per year (one monthly), with 3h of work per release (changelog update, version bump, test verification, consumer communication):
  ```
  Annual_Versioning_Cost = 12 × 3h × 65 €/h = 2,340 €/year
  ```

- **Annual_Consumer_Support_Cost**: Time helping consuming teams integrate new versions, resolve usage issues, answer questions. Typically 5-10h per week:
  ```
  Annual_Support_Cost = 7.5h × 52 × 65 = 25,350 €/year
  ```

**Complete Numerical Example (France):**
```
Annual_Maintenance_Cost = (33,800 × 0.18) + 2,340 + 25,350
                        = 6,084 + 2,340 + 25,350
                        = 33,774 €/year
```

**4. Annual_Coordination_Cost — Price of Cross-Team Synchronization**

```
Annual_Coordination_Cost = Nb_Teams × Hours_Coordination_Per_Week × 52 × Average_Hourly_Cost
```

This is the most often underestimated cost. When multiple teams share code, they must coordinate. This manifests as:

- **Synchronization Meetings**: Typically 1-2h per week per team to discuss lib evolution, upcoming breaking changes, priorities.
- **Interface Negotiation**: When one team needs a new lib feature that could impact the other. This requires design discussions, compromises, sometimes POCs.
- **Priority Conflict Management**: Team A needs an urgent change but Team B isn't ready to absorb the impact. Must negotiate, plan, sometimes create temporary workarounds.

Brooks' formula tells us communication interfaces grow quadratically: n(n-1)/2 [[17]](https://andrewbegel.com/papers/coordination-chase09.pdf). With 2 teams, there's 1 interface. With 3 teams, there are 3. With 5 teams, there are 10.

**Numerical Example (France):**
With 2 teams, 3h coordination per week per team, at 65 €/h:
```
Coordination_Cost = 2 × 3 × 52 × 65 = 20,280 €/year
```

**5. Onboarding_Cost — New Developer Integration Cost**

```
Onboarding_Cost = Nb_New_Devs × (Lib_Training_Hours × New_Dev_Hourly_Cost
                + Mentoring_Hours × Mentor_Hourly_Cost)
```

Each new developer must understand not only the feature but also the sharing mechanism (how to publish, version, test the lib). Typically, this adds 1-2 weeks to the standard onboarding process [[26]](https://fullscale.io/blog/developer-onboarding-best-practices/) [[27]](https://about.gitlab.com/the-source/platform/how-to-accelerate-developer-onboarding-and-why-it-matters/).

**Numerical Example (France):**
For 3 new devs per year, with 60h training (mid-level cost 50 €/h) and 20h mentoring (senior cost 65 €/h):
```
Onboarding_Cost = 3 × (60 × 50 + 20 × 65) = 3 × (3,000 + 1,300) = 12,900 €/year
```

#### Total Annual Cost of Shared Code Approach — Recap Example (France)

| Item | Year 0 (setup) | Year 1 | Year 2 | Year 3 |
|-------|-----------------|---------|---------|---------|
| Initial Dev | 33,800 € | — | — | — |
| Lib Setup | 18,200 € | — | — | — |
| Maintenance | — | 33,774 € | 33,774 € | 33,774 € |
| Coordination | — | 20,280 € | 20,280 € | 20,280 € |
| Onboarding | — | 12,900 € | 12,900 € | 12,900 € |
| **Total Cumulative** | **52,000 €** | **118,954 €** | **185,908 €** | **252,862 €** |

---

### 7.2 Total Cost — Duplicated Code Approach

#### Overview

With this approach, we develop the feature in codebase A, then "port" it (copy and adapt) to codebase B. There's no formal sharing mechanism: each codebase lives its own life. It's faster to set up initially, but maintenance costs increase over time due to progressive divergence between the two copies.

#### Formula

```
Total_Duplicated_Cost = Initial_Dev_Cost × (1 + Porting_Factor)
                      + Σ(Annual_Duplicated_Maintenance_Cost × Year)
                      + Annual_Sync_Cost × Nb_Years
                      + Additional_Bugs_Cost × Nb_Years
```

#### Breakdown of Each Term

**1. Initial_Dev_Cost × (1 + Porting_Factor) — Development in Both Codebases**

```
Duplicated_Dev_Cost = Base_Dev_Cost × (1 + Porting_Factor)
```

The `Porting_Factor` (typically 0.5 to 0.8) represents the percentage of initial effort needed to adapt and port the feature to the second codebase. It's not a simple copy-paste: must adapt entry points, code conventions, architecture patterns of target codebase, tests, etc.

Why a range of 0.5 to 0.8 and not simply 1.0 (double)?
- Design is already done (don't re-think the business logic)
- Edge cases already identified
- Tests can be adapted rather than rewritten from scratch
- BUT must adapt code to conventions, patterns, and dependencies of codebase B

The more different the two codebases (different frameworks, languages, architectures), the closer the factor approaches 0.8 or even 1.0.

**Numerical Example (France):**
Base feature: 400h × 65 €/h = 26,000 €
With a porting factor of 0.65 (fairly similar codebases, same language):
```
Duplicated_Dev_Cost = 26,000 × (1 + 0.65) = 26,000 × 1.65 = 42,900 €
```

**2. Annual_Duplicated_Maintenance_Cost — Maintaining Two Copies**

```
Annual_Duplicated_Maintenance_Cost = Base_Maintenance_Cost × Double_Maintenance_Factor
```

The `Double_Maintenance_Factor` (typically 1.8 to 2.0) reflects that maintaining two copies is not exactly double the cost of one. There's slight economy because diagnosing a problem in copy A often gives clues for copy B. But this economy erodes over time as the two copies diverge.

We can model this with a factor that increases:
```
Double_Maintenance_Factor(year) = 1.8 + (0.05 × year)
```
In other words, the factor starts at 1.8 the first year and increases by 0.05 each year (because the two copies diverge more, making cross-maintenance harder).

Concretely, `Base_Maintenance_Cost` is the cost of maintaining a single copy, calculated as:
```
Base_Maintenance_Cost = Base_Dev_Cost × Maintenance_Rate
```

With a `Maintenance_Rate` between 0.20 and 0.30 (higher than shared code because there's no generalization factor to simplify maintenance).

**Numerical Example (France):**
```
Base_Maintenance_Cost = 26,000 × 0.22 = 5,720 €/year (for single copy)

Year 1: 5,720 × 1.80 = 10,296 €
Year 2: 5,720 × 1.85 = 10,582 €
Year 3: 5,720 × 1.90 = 10,868 €
```

**3. Annual_Sync_Cost — Keeping the Two Copies Aligned**

```
Annual_Sync_Cost = Nb_Evolved_Features_Per_Year × Sync_Hours_Per_Feature × Hourly_Cost
```

This is the most insidious cost of duplication. Each time we evolve the feature in codebase A, we must ask: "Should this change also be applied in codebase B?". If yes, we must:

- Understand the change in context of A
- Adapt the change to context of B (which may have diverged)
- Test in context of B
- Separate code review for B
- Deploy in B

Synchronization time per feature increases over time as the two copies diverge. We can model this with a divergence factor:

```
Sync_Hours_Per_Feature(year) = Base_Sync_Hours × (1 + Divergence_Rate)^year
```

Where `Divergence_Rate` is typically 0.15 to 0.30 per year (15-30% additional complexity each year for synchronization).

**Numerical Example (France):**
With 8 evolutions per year, 16h sync per evolution initially, 0.20 divergence rate, at 65 €/h:
```
Year 1: 8 × 16 × 1.20^1 × 65 = 8 × 19.2 × 65 = 9,984 €
Year 2: 8 × 16 × 1.20^2 × 65 = 8 × 23.0 × 65 = 11,981 €
Year 3: 8 × 16 × 1.20^3 × 65 = 8 × 27.6 × 65 = 14,377 €
```

We clearly see cost acceleration year over year.

**4. Additional_Bugs_Cost — Price of Duplication on Quality**

```
Additional_Bugs_Cost = Base_Nb_Bugs × Bug_Duplication_Factor × Average_Bug_Cost
```

IEEE studies show that up to 33% of code clones that undergo bug fixes contain propagated bugs not fixed in other copies [[41]](https://ieeexplore.ieee.org/document/8094424/) [[42]](https://www.sciencedirect.com/science/article/abs/pii/S0164121219301815). Cloning also multiplies security vulnerabilities [[45]](https://dl.acm.org/doi/abs/10.1109/ESEM.2017.9). This is explained by several mechanisms:

- **Incomplete Propagation**: A bug is fixed in A but not in B (or vice versa). This is the most frequent case.
- **Cross-Regression**: The fix in B introduces a new bug because context has diverged.
- **False Sense of Security**: Team thinks bug is fixed everywhere when it's only fixed in one codebase.

The `Bug_Duplication_Factor` (1.5 to 3.0) depends on team discipline and quality of tracking between copies. In practice:
- 1.5: Highly disciplined team with formal fix propagation process
- 2.0: Average team with informal tracking
- 3.0: No tracking process, propagation depends on individual memory

The `Average_Bug_Cost` depends on detection phase (see section 2.3). In production, a bug averages $5,000 to $15,000 to diagnose, fix, test, deploy, and communicate [[14]](https://www.functionize.com/blog/the-cost-of-finding-bugs-later-in-the-sdlc) [[16]](https://deepsource.com/blog/exponential-cost-of-fixing-bugs).

**Numerical Example (France):**
For realistic estimation, we separate bugs by severity. Bug fix costs in France are lower than US but still significant:
```
Additional_Bugs_Cost = (Nb_Critical_Bugs × Critical_Bug_Cost)
                     + (Nb_Major_Bugs × Major_Bug_Cost)
                     + (Nb_Minor_Bugs × Minor_Bug_Cost)
```

For example:
- 2 critical bugs × 10,000 € = 20,000 € (hotfix, rollback, on-call, communication)
- 6 major bugs × 3,500 € = 21,000 € (diagnosis + fix + tests + review + deployment)
- 12 minor bugs × 800 € = 9,600 € (simple fix + tests)
- **Total: 50,600 €/year**

#### Total Annual Cost of Duplicated Code Approach — Recap Example (France)

| Item | Year 0 (dev) | Year 1 | Year 2 | Year 3 |
|-------|---------------|---------|---------|---------|
| Initial Dev (A + B) | 42,900 € | — | — | — |
| Maintenance (2 copies) | — | 10,296 € | 10,582 € | 10,868 € |
| Synchronization | — | 9,984 € | 11,981 € | 14,377 € |
| Additional Bugs | — | 50,600 € | 50,600 € | 50,600 € |
| **Total Cumulative** | **42,900 €** | **113,780 €** | **186,943 €** | **262,788 €** |

---

### 7.3 Break-Even Formula

#### Overview

Shared code costs more upfront (investment in sharing infrastructure) but less over time (single maintenance, no synchronization). Duplicated code costs less upfront but costs accelerate over time. The break-even point is when cumulative shared code cost becomes less than duplicated code cost.

#### Formula

```
Months_To_Break_Even = (Lib_Setup_Cost + Generalization_Overhead) /
                       (Monthly_Maintenance_Savings - Monthly_Coordination_Cost)
```

Let's detail each component:

- **Lib_Setup_Cost**: Initial investment to set up sharing infrastructure (calculated in 7.1).
- **Generalization_Overhead**: Difference between cost of developing a shareable feature and a specific one. It's `Initial_Dev_Cost × (Generalization_Factor - 1)`.
- **Monthly_Maintenance_Savings**: How much we save monthly by having single copy instead of two. It's `(Duplicated_Maintenance - Shared_Maintenance) / 12`.
- **Monthly_Coordination_Cost**: Monthly cost of coordination we pay for sharing that we wouldn't with duplicated code. It's `Annual_Coordination_Cost / 12`.

The formula works (break-even exists) only if maintenance savings exceed coordination costs. Otherwise, shared code never becomes profitable — it signals the feature is too small or coordination cost too high to justify sharing.

**Numerical Example (with previous French data):**
```
Generalization_Overhead = 33,800 - 26,000 = 7,800 €
Lib_Setup_Cost = 18,200 €

Annual_Maintenance_Savings (Year 1) = (10,296 + 9,984 + 50,600) - 33,774 = 37,106 €
Monthly_Maintenance_Savings = 37,106 / 12 = 3,092 €/month

Monthly_Coordination_Cost = 20,280 / 12 = 1,690 €/month

Months_To_Break_Even = (18,200 + 7,800) / (3,092 - 1,690)
                     = 26,000 / 1,402
                     ≈ 18.5 months
```

In this example, shared code becomes profitable after approximately 18-19 months (~1.5 years).

**Factors That Shorten Break-Even:**
- Larger feature (more maintenance savings)
- Higher evolution frequency (more synchronization avoided)
- Frequent production bugs (additional bug costs avoided)
- More than 2 consuming codebases

**Factors That Extend Break-Even:**
- Small, stable feature (little maintenance)
- Highly independent teams (expensive coordination)
- Very different codebases (difficult generalization)
- End-of-life feature (little time to amortize)

---

### 7.4 Scale Factor — Multiplicative Effect of Consumer Count

#### Overview

The true advantage of shared code emerges when consumer codebase count increases. With duplicated code, each new codebase multiplies costs almost linearly. With shared code, the marginal cost per new consumer is much lower.

#### Formula

```
Advantage_Ratio(N) = Total_Duplicated_Cost(N) / Total_Shared_Cost(N)
```

Which we can decompose as:

```
Total_Duplicated_Cost(N) = Base_Dev_Cost + (N-1) × Base_Dev_Cost × Porting_Factor
                          + N × Unit_Maintenance_Cost × Nb_Years

Total_Shared_Cost(N) = Base_Dev_Cost × Generalization_Factor + Lib_Setup_Cost
                     + Lib_Maintenance_Cost × Nb_Years
                     + N × Unit_Integration_Cost × Nb_Years
                     + Coordination_Cost(N) × Nb_Years
```

Where `Unit_Integration_Cost` is the low cost to integrate lib into new codebase (typically 5-10% of porting cost).

The ratio clearly favors sharing (> 1.5) when N ≥ 3 in most scenarios.

**Example with N = 2, 3, and 5 codebases (costs over 3 years, France context):**

| N codebases | Duplicated Cost (3 years) | Shared Cost (3 years) | Ratio |
|-------------|----------------------|---------------------|-------|
| 2 | 262,788 € | 252,862 € | 1.04 |
| 3 | 438,000 € | 280,000 € | 1.56 |
| 5 | 790,000 € | 320,000 € | 2.47 |

We see shared code advantage accelerates with consumer count. At 5 codebases, duplicated code costs 2.5x more.

---

### 7.5 Bonus Formula: Cost of Divergence Over Time

A crucial aspect for the calculator is modeling how duplication cost grows over time. We can do this with an exponential curve:

```
Divergence_Cost(t) = Base_Sync_Cost × e^(Divergence_Rate × t)
```

Where:
- `t` is time in years
- `Divergence_Rate` is typically 0.15 to 0.30
- `Base_Sync_Cost` is synchronization cost of first year

This formula captures the fact that divergence is not linear: the two codebases accumulate differences that compound. Each difference makes future synchronizations more complex, creating a snowball effect.

**Example (France) with Base_Sync_Cost = 8,500 €/year and Divergence_Rate = 0.20:**
```
Year 1: 8,500 × e^(0.20 × 1) = 10,382 €
Year 2: 8,500 × e^(0.20 × 2) = 12,680 €
Year 3: 8,500 × e^(0.20 × 3) = 15,488 €
Year 5: 8,500 × e^(0.20 × 5) = 23,106 €
```

After 5 years, synchronization cost has nearly tripled from year 1. This is strong argument that duplication is only viable for short-lived features.

---

## 8. Recommended Input Variables for the Calculator

### 8.1 Team Parameters

- Number of developers
- Average hourly cost (loaded)
- Average team seniority
- Annual turnover rate
- Number of teams involved

### 8.2 Feature Parameters

- Estimated size (story points or KLOC)
- Complexity (simple, moderate, complex)
- Number of target codebases
- Percentage of shared vs specific code (%)
- Planned evolution frequency (features/quarter)

### 8.3 Temporal Parameters

- Calculation horizon (in years)
- Sprint duration
- Estimated initial development time

### 8.4 Organizational Parameters

- Methodology (Agile, Waterfall, hybrid)
- CI/CD maturity level (1-5)
- Existing documentation quality (1-5)
- Test coverage (%)

---

## 9. Comparative Summary Table

| Dimension | Shared Code | Duplicated Code |
|-----------|-------------|-----------------|
| **Initial Cost** | Higher (+30-50%) | Lower, but double (~170-220% of single feature) |
| **Annual Maintenance Cost** | 15-25% of initial dev | 30-50% of initial dev (double maintenance) |
| **Coordination Cost** | High (11-23% of dev time) | Low if teams independent |
| **Bug Risk** | 1x (single source) | ~33% of clones contain propagated bugs [[41]](https://ieeexplore.ieee.org/document/8094424/) |
| **Functional Consistency** | Guaranteed | Degrades over time |
| **Flexibility** | Limited (coupling) | High (complete independence) |
| **Scalability (N codebases)** | Linear (excellent) | N × cost (poor) |
| **Time to Market** | Longer (initial setup) | Shorter initially |
| **Onboarding** | Simpler (1 source) | More complex (N sources + differences) |
| **Break-Even** | 6-18 months | Never (increasing costs) |

---

## 10. Sources

### Cost Models and Estimation
- [COCOMO - Wikipedia](https://en.wikipedia.org/wiki/COCOMO)
- [COCOMO Model - GeeksforGeeks](https://www.geeksforgeeks.org/software-engineering/software-engineering-cocomo-model/)
- [COCOMO II - Constructive Cost Model](https://softwarecost.org/tools/COCOMO/)
- [Linux Foundation - COCOMO Cost Estimation](https://docs.linuxfoundation.org/lfx/insights/v3-beta-version-current/getting-started/landing-page/cocomo-cost-estimation-simplified)

### Maintenance Costs
- [ScienceSoft - Software Maintenance Costs](https://www.scnsoft.com/software-development/maintenance-and-support/costs)
- [IdeaLink - Software Development vs Maintenance](https://idealink.tech/blog/software-development-maintenance-true-cost-equation)
- [MadDevs - Software Maintenance Costs](https://maddevs.io/customer-university/software-maintenance-costs/)
- [Galorath - Software Maintenance Cost](https://galorath.com/blog/software-maintenance-costs/)
- [TechStep - App Maintenance Cost](https://www.techstep.io/articles/app-maintenance-cost-can-be-three-times-higher-than-development-cost)
- [O'Reilly - The 60/60 Rule (97 Things Every Project Manager Should Know)](https://www.oreilly.com/library/view/97-things-every/9780596805425/ch34.html) — Original source of 60% maintenance cost rule
- [NIH/PMC - Factors Affecting Software Projects Maintenance Cost](https://pmc.ncbi.nlm.nih.gov/articles/PMC3610582/) — Peer-reviewed academic study

### Code Duplication and Technical Debt
- [Software.com - Code Duplication Metrics](https://www.software.com/engineering-metrics/code-duplication)
- [LinearB - Code Duplication](https://linearb.io/blog/code-duplication)
- [Graph AI - Hidden Costs of Duplicate Code](https://www.graphapp.ai/blog/the-hidden-costs-of-duplicate-code-in-software-engineering)
- [GetDX - Technical Debt Ratio](https://getdx.com/blog/technical-debt-ratio/)
- [SonarSource - Measuring Technical Debt](https://www.sonarsource.com/resources/library/measuring-and-identifying-code-level-technical-debt-a-practical-guide/)
- [Manning - Software Mistakes and Tradeoffs, Chapter 2](https://livebook.manning.com/book/software-mistakes-and-tradeoffs/chapter-2)
- [Stripe - The Developer Coefficient (2018)](https://stripe.com/files/reports/the-developer-coefficient.pdf) — Original study on wasted time in technical debt
- [CISQ - Cost of Poor Software Quality in the US (2022)](https://www.it-cisq.org/the-cost-of-poor-quality-software-in-the-us-a-2022-report/) — Official report $2.41T

### Academic Studies on Bug Propagation in Cloned Code
- [IEEE - Bug Propagation through Code Cloning (2017)](https://ieeexplore.ieee.org/document/8094424/) — Empirical study showing ~33% of propagated bugs in clones
- [ScienceDirect - Empirical study on bug propagation through code cloning (2019)](https://www.sciencedirect.com/science/article/abs/pii/S0164121219301815) — Extended version of IEEE study
- [ACM ESEM - Security vulnerabilities in cloned vs non-cloned code (2017)](https://dl.acm.org/doi/abs/10.1109/ESEM.2017.9) — Impact of duplication on security vulnerabilities
- [SANER - Bug Replication in Code Clones (2016)](https://clones.usask.ca/pubfiles/articles/JudithSANER2016BugReplication.pdf) — Study on bug replication between clones

### Monorepo vs Multirepo
- [ThoughtWorks - Monorepo vs Multi-repo](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/monorepo-vs-multirepo)
- [Kodus - Monorepo vs Multi-repo Strategy](https://kodus.io/en/monorepo-vs-multi-repo-strategy/)
- [Aviator - What is a Monorepo](https://www.aviator.co/blog/what-is-a-monorepo-and-why-use-one/)

### Bug Costs
- [Functionize - Cost of Finding Bugs Later](https://www.functionize.com/blog/the-cost-of-finding-bugs-later-in-the-sdlc)
- [Black Duck - Cost to Fix Bugs per SDLC Phase](https://www.blackduck.com/blog/cost-to-fix-bugs-during-each-sdlc-phase.html)
- [DeepSource - Exponential Cost of Fixing Bugs](https://deepsource.com/blog/exponential-cost-of-fixing-bugs)
- [The Register - "Bugs 100x more expensive" study might not exist](https://www.theregister.com/2021/07/22/bugs_expense_bs/) — Investigation into contested IBM source

### Testing and QA Effort
- [IdeaLink - Software Testing Costs](https://idealink.tech/blog/understanding-software-testing-costs-development-breakdown)
- [Hypersense - Effort Allocation](https://hypersense-software.com/blog/2025/07/19/software-development-effort-allocation-dev-qa-design-pm-ratio/)
- [Intersog - Testing Percent of Costs](https://intersog.com/blog/development/software-testing-percent-of-software-development-costs/)

### Code Review and Productivity
- [Codacy - Facts About Code Reviews](https://blog.codacy.com/10-facts-about-code-reviews-and-quality)
- [Coralogix - Developer Time Allocation](https://coralogix.com/blog/this-is-what-your-developers-are-doing-75-of-the-time-and-this-is-the-cost-you-pay/)
- [Meta Engineering - Code Review Time](https://engineering.fb.com/2022/11/16/culture/meta-code-review-time-improving/)

### Onboarding and Team Costs
- [FullScale - Developer Onboarding](https://fullscale.io/blog/developer-onboarding-best-practices/)
- [GitLab - Accelerate Developer Onboarding](https://about.gitlab.com/the-source/platform/how-to-accelerate-developer-onboarding-and-why-it-matters/)
- [Growin - Developer Retention Costs](https://www.growin.com/blog/developer-retention-costs-onboarding/)
- [FullScale - Team Capacity Planning](https://fullscale.io/blog/team-capacity-planning/)

### Cross-Team Coordination
- [Count - Cross-Team Dependency Analysis](https://count.co/metric/cross-team-dependency-analysis)
- [Minware - Tracking Cross-Team Dependencies](https://www.minware.com/blog/tracking-cross-team-dependencies)
- [Andrew Begel, Microsoft Research - Coordination in Large-Scale Software Teams](https://andrewbegel.com/papers/coordination-chase09.pdf)

### Salaries and Costs — France
- [Licorne Society - Salaire développeur en 2026](https://www.licornesociety.com/blog/salaire-developpeur)
- [WeLoveDevs - Salaire développeur junior 2025](https://welovedevs.com/fr/salaires/junior)
- [WeLoveDevs - Salaire développeur web 2025](https://welovedevs.com/fr/salaires/developpeur-web)
- [WeLoveDevs - Salaire développeur à Paris 2025](https://welovedevs.com/fr/salaires/paris)
- [Journal du Net - Salaire développeur](https://www.journaldunet.com/business/salaire/developpeur/salaire-00419)
- [Ada Tech School - Salaire développeur 2025 par niveau](https://blog.adatechschool.fr/salaire-developpeur-web/)
- [GEFOR - Salaire Développeur Web 2025 France](https://www.gefor.com/salaire-developpeur-web-en-france/)

### Freelance Daily Rate — France
- [Portage360 - TJM Développeur en France 2025](https://www.portage360.fr/tjm-developpeur-en-france/)
- [Silkhom - Baromètre des TJM 2025 IT & Digital](https://www.silkhom.com/barometre-des-tjm-informatique-electronique-digital/)
- [RH Solutions - TJM freelances tech 2025](https://www.rh-solutions.com/le-grand-guide-du-portage/tjm-freelance-tech-2025/)
- [Blog du Modérateur - TJM freelances IT France 2025](https://www.blogdumoderateur.com/freelances-taux-journaliers-moyens-it-france-2025/)
- [Free-Work - TJM Développeur Fullstack](https://www.free-work.com/fr/tech-it/developpeur-fullstack/rate-tjm-freelance)

### Employer Contributions and Loaded Cost — France
- [Dougs - Charges patronales 2026](https://www.dougs.fr/blog/charges-patronales/)
- [Staffmatch - Charges patronales 2025](https://staffmatch.com/blog/fr/charges-patronales/)
- [Watt Portage - Charges patronales France 2025-2026](https://www.watt-portage.fr/charges-patronales-en-2026)
- [HelloWork - Coût d'un salarié](https://www.hellowork.com/fr-fr/outil/salaire-brut-net/guides/calcul-salaire-brut-cout-employeur.html)
- [PayFit - Charges patronales 2026](https://payfit.com/fr/fiches-pratiques/charges-patronales/)

### Salaries and Costs — International (Reference)
- [FullStack Labs - Software Development Price Guide 2025](https://www.fullstack.com/labs/resources/blog/software-development-price-guide-hourly-rate-comparison)
- [Glassdoor - Software Engineer Salary 2026](https://www.glassdoor.com/Salaries/software-engineer-salary-SRCH_KO0,17.htm)
