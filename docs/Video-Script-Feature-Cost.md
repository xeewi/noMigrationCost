# Video Script — Feature Cost: Shared Code vs Duplicated Code

> **Format:** ~12–15 min video presentation
> **Audience:** Management / Leadership (CTO, VP Engineering, Engineering Directors, Stakeholders)
> **Tone:** Business-oriented, decision-focused, data-backed. Minimal jargon.
> **Tip:** Text in `[brackets]` are stage directions — don't read them aloud.

---

## SLIDE 1 — Title

`[Slide appears: "FEATURE COST — SHARED CODE vs DUPLICATED"]`

Hello everyone. Today I want to walk you through a critical decision that impacts every engineering organization: when we build a feature that needs to exist in multiple codebases, should we invest in shared code — a library, a package, a shared module — or should we simply duplicate the code and adapt it?

This might sound like a purely technical decision. But as you'll see, it's fundamentally a financial one — and the numbers are significant.

---

## SLIDE 2 — Context: Why this analysis?

`[Slide appears: 4 cards — Core question, Financial impact, Not dogmatic, Data-backed]`

So why does this matter?

The core question is simple. When a feature needs to live in more than one codebase, we have two paths: build it once and share it, or build it twice — once for each codebase. Both approaches work. Both ship product. But the total cost over time is very different.

And this isn't a theoretical exercise. Maintenance typically represents 50 to 80 percent of total software cost. So the choice we make upfront — share or duplicate — has a massive effect on our budget for years to come.

I want to be clear: this analysis isn't dogmatic. There are legitimate scenarios for both approaches, and we'll cover those. The goal here is to quantify the trade-offs so we can make informed decisions, not emotional ones.

Everything you'll see is backed by industry-recognized models — COCOMO II for cost estimation, peer-reviewed IEEE studies for bug propagation data, and current salary benchmarks for the French market.

---

## SLIDE 3 — Maintenance dominates total cost

`[Slide appears: Big "50-80%" stat on the left, 5-year breakdown on the right]`

Before we compare the two approaches, let's establish one fundamental truth about software economics.

50 to 80 percent of the total cost of any software system is maintenance. Not development. Maintenance. For legacy systems, this number can climb as high as 90 percent.

Let me put that differently. If you look at a 5-year window, initial development — the part we obsess over in planning meetings — accounts for only about 21 percent of total spend. The remaining 79 percent goes to maintenance and evolution.

This completely reframes the decision. Saving a few weeks on initial development is almost irrelevant if it means doubling your maintenance costs for the next three to five years. And that's exactly the trade-off we're making when we choose duplication over sharing.

`[Pause briefly]`

So keep this in mind as we go through the rest of this presentation: the real battleground isn't the upfront investment — it's what comes after.

---

## SLIDE 4 — The upfront investment

`[Slide appears: Two columns — Shared Code (green) vs Duplicated Code (red)]`

Now, let's look at what it costs to get started with each approach.

With shared code, the upfront investment is higher. You're not just building the feature — you're building it in a way that's reusable. That means creating proper abstractions, configuration options, more thorough tests, and documentation. This generalization adds about 30 percent to the development effort. On top of that, you need 5 to 11 weeks to set up the infrastructure — CI/CD pipelines, versioning, a package registry. In our worked example, that comes to roughly 52,000 euros.

With duplicated code, it's faster. You build the feature once in codebase A, then port it to codebase B. The porting takes about 50 to 80 percent of the original effort — the design is done, the edge cases are known, but you still need to adapt everything to the conventions and architecture of the second codebase. Total: about 43,000 euros.

So duplication looks about 20 percent cheaper upfront. And honestly? That's the number most people anchor on when they make this decision. But as we're about to see, that initial saving is a mirage.

---

## SLIDE 5 — The trap: accelerating costs

`[Slide appears: 3 red cards — Double maintenance, Growing synchronization, Propagated bugs]`

This is where the real story begins — and it's the slide I'd ask you to pay the most attention to.

When you duplicate code, you create three cost drivers that compound over time.

**First: double maintenance.** Every single bug fix, every evolution, every test, every code review has to happen twice. And the multiplication factor isn't a clean 2x — it starts around 1.8x and increases by 0.05 each year as the two copies diverge. By year three, you're closer to 2x. By year five, it's worse.

**Second: synchronization costs that grow exponentially.** Every time you evolve the feature in one codebase, you need to ask: does this change need to go to the other one too? If yes, someone has to understand the change in context A, adapt it to context B — which may have diverged significantly — test it, review it, and deploy it. In year one, this costs around 10,000 euros. By year three, it's 14,000. By year five, it's 23,000. The cost nearly triples because divergence compounds. Each difference makes the next synchronization harder.

**Third — and this one often catches people off guard — propagated bugs.** An IEEE study across four open-source Java projects found that when a bug is fixed in one code clone, 33 percent of the time that same bug is never fixed in the other copy. One in three. That means a third of your bug fixes are incomplete. We estimate the additional cost from these unfixed bugs at around 50,000 euros per year — accounting for critical production incidents, major bugs, and minor issues.

`[Pause]`

The takeaway here is clear: duplication is only a viable strategy for features with a short lifespan. If the feature is going to live longer than a year or two, the compounding costs will eat you alive.

---

## SLIDE 6 — 3-year cost comparison

`[Slide appears: Table with Year 0 through Year 3 for both approaches, plus observations]`

Let's put concrete numbers on this. These figures are based on a realistic scenario: a feature requiring 400 hours of development by two senior engineers, with a fully loaded rate of 65 euros per hour in the French market, two consumer teams, and eight feature evolutions per year.

At year zero, duplication wins. 43,000 versus 52,000 euros — that's a 9,000 euro advantage.

At year one, the gap has almost entirely closed. Cumulative costs are within 5,000 euros of each other.

At year two, the crossover happens. Duplication is now more expensive.

At year three, duplication costs about 10,000 euros more — 263,000 versus 253,000. And critically, this gap is accelerating. It's not a flat 10K per year — it's widening because of the compounding effects we just discussed.

So the initial 9,000 euro saving turns into a 10,000 euro loss within three years. And beyond three years, the divergence only gets steeper.

---

## SLIDE 7 — When sharing becomes profitable

`[Slide appears: "6 to 18 months" break-even, plus accelerators and decelerators]`

A natural question is: how long does it take for the shared approach to pay for itself?

The typical break-even is 6 to 18 months. In our specific example, it's about 18 months — a year and a half. The math is straightforward: the initial premium of 26,000 euros is recovered through net monthly savings of approximately 1,400 euros — that's the maintenance savings minus the coordination overhead of sharing.

Now, this break-even can be shorter or longer depending on your context.

It shortens if the feature is large, if it evolves frequently, if you have frequent production bugs, or if you have three or more consumer codebases.

It lengthens if the feature is small and stable, if coordination between teams is very expensive, if the codebases are fundamentally different — different languages, different architectures — or if the feature is approaching end of life.

And here's an important decision criterion: if your maintenance savings don't exceed your coordination costs, the break-even never happens. That's a signal that for this particular feature, duplication might actually be the right call. This isn't one-size-fits-all.

---

## SLIDE 8 — The scale factor

`[Slide appears: 3 stat cards — 2, 3, and 5 codebases with ratios]`

This is where the argument for shared code becomes truly compelling.

With two codebases, the three-year cost ratio is 1.04x — nearly a wash. A slight advantage for sharing, but marginal.

With three codebases, the ratio jumps to 1.56x. Sharing saves approximately 160,000 euros over three years.

With five codebases, it's 2.47x. Duplication costs two and a half times more.

Why does this scale so dramatically? Because with duplicated code, every new codebase adds near-linear cost — you're porting, maintaining, synchronizing, and fixing bugs in yet another copy. With shared code, adding a new consumer costs only 5 to 10 percent of what a port would cost — you're just integrating an existing library.

So if your organization has — or plans to have — three or more products or codebases consuming the same feature, the shared approach isn't just preferable. It's the only approach that makes financial sense.

---

## SLIDE 9 — Beyond code: the impact on the team

`[Slide appears: 4 cards — Onboarding, QA/Testing, Product Management, UX Consistency]`

The cost impact goes beyond engineering hours. Let me highlight four organizational dimensions.

**Onboarding.** With shared code, a new developer learns one implementation. With duplicated code, they need to understand both versions and their differences. That adds one to two weeks to the ramp-up period. Given that developer replacement in France costs 50,000 to 100,000 euros when you factor in recruitment, onboarding, and lost productivity — this adds up.

**QA and testing.** Quality assurance typically represents 20 to 30 percent of development effort. With duplication, you're running two separate test suites, two CI pipelines, two sets of regression tests. That's doubled QA spend.

**Product management.** Shared code means one backlog, one set of specs, one incident response path. Duplication means coordinating two backlogs and investigating incidents across two codebases — 1.5 to 2x the effort.

**And finally, UX consistency.** With shared code, consistency is guaranteed by the code itself — same component, same behavior. With duplication, the two implementations inevitably diverge over time, creating inconsistencies that your users will notice.

---

## SLIDE 10 — Duplication fuels technical debt

`[Slide appears: "42%" stat, debt accelerator points, bug cost phases]`

Let's talk about technical debt — a topic every engineering leader should care about.

According to the Stripe Developer Coefficient study, developers spend 42 percent of their time on technical debt and poor-quality code. That's 13 and a half hours per week on debt, plus nearly four hours on bad code. Out of a 41-hour work week. Almost half.

Duplication is a direct accelerator of this debt. The divergence factor between two copies starts at 1.0 and can reach 3 to 5 after just two years. Code churn doubles, which statistically increases bug probability. And the CISQ estimated the cost of poor software quality to the US economy at 2.41 trillion dollars in 2022 — with 1.52 trillion attributable to technical debt alone.

There's also a cost multiplier depending on when bugs are caught. A bug caught during design costs 1x to fix. During implementation, 3 to 5x. During QA, 5 to 10x. In production, 10 to 30x. Now imagine that production bug exists in two codebases, and in one of them, nobody even knows it's there. That's the reality of duplication.

---

## SLIDE 11 — Global comparison

`[Slide appears: Summary table with 7 dimensions]`

Here's the complete picture across seven key dimensions.

Initial cost: shared is 30 to 50 percent higher. Duplication runs at 170 to 220 percent of a single implementation — technically more total code, but less infrastructure.

Annual maintenance: 15 to 25 percent for shared, 30 to 50 percent for duplicated. That's the single biggest differentiator.

Bug risk: single source with sharing versus a 33 percent rate of propagated, unfixed bugs with duplication.

UX consistency: guaranteed with sharing, progressively degrading with duplication.

Scalability: linear cost growth for shared, multiplicative for duplicated.

Break-even: 6 to 18 months for shared. Never for duplicated — costs only ever go up.

Onboarding: simpler with one source, more complex when developers need to navigate multiple implementations.

---

## SLIDE 12 — When to choose what

`[Slide appears: Two columns — green for shared, red for duplicated]`

So — practical guidance. When should you choose which approach?

Prefer shared code when the feature will live longer than 18 months, when it evolves frequently, when you have or plan to have three or more consumer codebases, when UX consistency is important to your product, and when your team can absorb the upfront setup investment. Also when your system is growing — because each new consumer makes the shared investment more valuable.

Duplication can be the right choice for short-lived features — prototypes, MVPs, experiments with a lifespan under six months. Also when the codebases are fundamentally different — different languages, different frameworks — making generalization impractical. When teams are fully independent with no need for alignment. And when there's no user-facing requirement for consistency.

`[Pause]`

The key message is this: duplication is a short-term convenience that comes at a steep medium and long-term price. Sharing is an investment — more expensive upfront, but it pays for itself quickly and keeps paying.

---

## SLIDE 13 — Questions

`[Slide appears: "QUESTIONS?"]`

That wraps up the analysis. Let me leave you with three numbers to remember:

50 to 80 percent — the share of total software cost that goes to maintenance, which is where this decision has its biggest impact.

33 percent — the rate of bugs that go unfixed when code is duplicated, according to IEEE research.

And 2.47x — the cost ratio at five codebases, showing how dramatically duplication scales compared to sharing.

I'm happy to take any questions, dive deeper into any section, or discuss how this applies to specific decisions we're facing.

Thank you.

---

## Timing Guide

| Section | Slide | Est. Duration |
|---|---|---|
| Title + intro | 1 | 0:30 |
| Context | 2 | 1:30 |
| Maintenance dominates | 3 | 1:30 |
| Initial costs | 4 | 1:30 |
| The trap | 5 | 2:30 |
| 3-year comparison | 6 | 1:30 |
| Break-even | 7 | 1:30 |
| Scale factor | 8 | 1:30 |
| Organizational impact | 9 | 1:30 |
| Technical debt | 10 | 1:30 |
| Summary table | 11 | 1:00 |
| Recommendations | 12 | 1:30 |
| Questions / close | 13 | 0:30 |
| **Total** | | **~14 min** |
