# Video Script — Feature Cost: Shared Code vs Duplicated Code

> **Format:** ~12–15 min video presentation
> **Audience:** Management / Leadership (CTO, VP Engineering, Engineering Directors, Stakeholders)
> **Tone:** Business-oriented, decision-focused, data-backed. Minimal jargon.
> **Tip:** Text in `[brackets]` are stage directions — don't read them aloud.
> **Numbers:** all figures come from the calculator's engine with its default values (revised October 2026, see `docs/revue-theorique-2026-10.md`).

---

## SLIDE 1 — Title

`[Slide appears: "FEATURE COST — SHARED CODE vs DUPLICATED"]`

Hello everyone. Today I want to walk you through a decision every engineering organization makes again and again: when we build a feature that needs to exist in several apps, should we build it once in a shared library, or copy it and adapt it into each app?

It sounds like a purely technical choice. It is really a financial one. And the honest answer is: it depends — but it depends on a few things we can measure.

---

## SLIDE 2 — Context: Why this analysis?

`[Slide appears: 4 cards — Core question, Every cost scales with the feature, Not dogmatic, Sourced with limits]`

The core question is simple. When a feature has to live in more than one app, we can build it once and share it, or build it once and copy it. Both approaches ship product. The question is what each one costs over time.

The model behind this presentation expresses every cost as a share of one number: the cost of building the feature once, for one app. That's person-hours times the team's loaded hourly rate. Only the setup and running of a brand-new library are counted as fixed hours.

A useful consequence: the hourly rate never flips the verdict. A better-paid team sees a bigger gap, never a different answer.

This analysis isn't dogmatic. Depending on the size of the feature, the number of apps and the time horizon, either option can win — and I'll show you where the line is.

The key factors come from published studies — the COCOMO II reuse model, a 2020 synthesis by Krüger and Berger, a long study of BSD forks by Ray and Kim — and from 2026 French labor-cost data. Where we have no data, I'll say so.

---

## SLIDE 3 — Upkeep is a recurring cost

`[Slide appears: Big "~20%/yr" stat on the left, 5-year breakdown on the right]`

Before comparing the two options, one basic fact about software economics.

A feature is never finished. Keeping one copy alive — fixes, adaptations, small evolutions — costs, as an order of magnitude, about 20 percent of its build cost every year. That figure is consistent with long-standing industry rules of thumb, like the US Department of Defense rule and Robert Glass's 60/60 rule.

For one app over five years, that means upkeep costs as much as the build itself. Half of the five-year cost comes after delivery.

`[Pause briefly]`

One more point: we don't put a separate price on bugs. Fixing bugs is part of upkeep. The popular rule that a bug costs 10 or 100 times more in production isn't supported by the data — a 2017 study of 171 projects found no such effect. So keep this in mind: the decision plays out mostly after delivery, in the upkeep of the extra copies.

---

## SLIDE 4 — The upfront investment

`[Slide appears: Two columns — Shared Code (green) vs Duplicated Code (red)]`

Let's look at what it costs to get started. Our reference scenario: a team of four — one junior, two mid-level, one senior — at an average of about 40 euros an hour. The feature is 40 story points at a velocity of 10, so 1,120 person-hours. Building it once costs 45,360 euros. Two apps, five years, and no shared library yet.

With shared code, you build the feature once, but made to share — that costs about 20 percent more, a figure well supported by the research. You plug it into the second app for about 20 percent of the build. And because the library doesn't exist yet, you spend about 280 hours setting it up. Total: 74,844 euros.

With duplicated code, you build it for the first app, then copy and adapt it into the second. The copy costs about 65 percent of the original effort — the design is done, but it has to fit the other app's conventions. That figure sits inside the measured range, 0.55 to 0.8. Total: 74,844 euros.

`[Pause]`

Exactly the same. For two apps, copying is not cheaper at the start. What decides is what comes next.

---

## SLIDE 5 — What decides: upkeep of the extra copies

`[Slide appears: 3 cards — Every copy is maintained, Copies drift, Sharing has its own upkeep]`

This is the slide I'd ask you to pay the most attention to.

**First: every copy is maintained.** The second copy costs about as much upkeep per year as the first — including keeping it in sync and repeating fixes. A study of BSD forks over 18 years found that 11 to 16 percent of changes get ported from the sibling fork, at a stable rate. The exact value we use is an assumption, and I'll come back to it.

**Second: copies drift.** We assume the upkeep of an extra copy grows a little every year as the copies diverge — by 5 percent of its starting level — up to a ceiling. There is no hard data here, and it is not exponential — when copies drift too far apart, teams simply stop syncing them.

**Third — and this is often forgotten — sharing has its own upkeep.** The shared code is bigger, so it costs a bit more to maintain. Every extra app adds coordination and upgrades when the library ships a breaking change. And a new library has to be run: releases, CI, dependency updates — about 100 hours a year.

`[Pause]`

Put together, in our scenario: sharing costs about 16,750 euros a year; duplication starts at 18,100 and climbs to almost 20,000. A small difference — but paid every year, and multiplied by every extra app.

---

## SLIDE 6 — 5-year projection

`[Slide appears: Table with Year 0, 1, 3 and 5 for both approaches, plus observations]`

Here are the cumulative numbers for our reference scenario.

At year zero, both approaches cost 74,844 euros.

After one year, duplication costs about 1,400 euros more. After three years, 5,500 more. After five years, 11,500 more — 158,600 versus 170,100. That's about 7 percent.

Both cost the same to build, and sharing is cheaper every month after — so it pays off from the start.

If the shared library already exists, the gap jumps to 43,000 euros, because there's no setup and no extra running cost.

But I want to be honest about how thin the margin is for two apps. If making the code shareable costs 33 percent more instead of 20, or if the second copy is cheaper to maintain than we assume, the verdict flips. That's why the calculator lets you change these numbers.

---

## SLIDE 7 — When sharing becomes profitable

`[Slide appears: "Month 0" break-even, small-feature case, plus what favours each option]`

How long does it take for sharing to pay for itself? We read that from the same cost curves — the first month from which sharing stays cheaper until the end.

In our scenario, the answer is month zero.

Now take a small feature — 140 hours — and the same need to create a new library. Sharing never pays off: over five years it costs 47,500 euros against 21,300 for copying. More than twice as much. The library's setup and running hours dwarf the feature itself.

So what favours sharing? A large feature — with two apps and a new library, sharing wins above roughly 820 hours over five years. More apps — with three, that threshold drops to about 340 hours. A library that already exists — then sharing wins whatever the size. And a long horizon.

What favours copying? A small feature, especially if a new library has to be created for it. A short horizon — over one year, sharing needs about 1,000 hours to win. Cheap copies. And apps so different that generalizing is expensive.

---

## SLIDE 8 — The scale factor

`[Slide appears: 3 stat cards — 2, 3, and 5 apps with ratios]`

This is where the argument for sharing becomes strong.

With two apps, duplication costs 1.07 times as much as sharing over five years. Sharing saves about 11,500 euros.

With three apps, the ratio is 1.41. Sharing saves about 73,000 euros.

With five apps, it's 1.92 — duplication costs almost twice as much. Sharing saves about 195,000 euros.

Why? Each extra copy costs 65 percent of the build up front, and then a full share of upkeep every year, rising as it drifts. Each extra app on a shared library costs 20 percent of the build up front, and then about 4 percent a year.

So if three or more apps need the same feature, sharing is very likely the right call.

---

## SLIDE 9 — What the numbers don't say

`[Slide appears: 4 cards — Clones often harmless, Wrong abstraction, Breaking changes, Not in the model]`

Now, the counter-arguments — because a fair analysis has to show them.

**Copies are often harmless.** Studies have found that a large share of code clones are deliberate and beneficial, and that many disappear within a few commits. Clones are not shown to be more bug-prone.

**The wrong abstraction.** As Sandi Metz puts it, duplication is far cheaper than the wrong abstraction. If two apps are meant to evolve differently, a copy is not a cost — it's freedom.

**Breaking changes.** Shared libraries break their users: one study found about 15 percent of API changes break compatibility, and most systems keep outdated dependencies. Our model only prices this roughly.

**And some things aren't in the model at all**: time to market, the release bottleneck a shared library can become, the UX consistency that sharing brings, and discounting.

---

## SLIDE 10 — Measured vs assumed

`[Slide appears: "4 of 7" stat, list of assumptions, table of measured factors]`

Let me be transparent about where the numbers come from.

Four of the seven factors rest on published measurements: the 20 percent cost of making code shareable, the 65 percent cost of a copy, the 20 percent cost of plugging a library into another app, and the order of magnitude of yearly upkeep.

The other three are assumptions: how much upkeep an extra copy costs compared to the first, how fast copies drift, and how much coordination each extra app adds. The setup and running hours of a new library are assumptions too.

And we deliberately don't price bugs on their own: there's no reliable data, and the famous 1-10-100 rule doesn't hold up.

The verdict is most sensitive to two of these: the cost of making code shareable, and the upkeep of an extra copy. Test those for your own case before deciding.

---

## SLIDE 11 — Global comparison

`[Slide appears: Summary table with 7 dimensions]`

Here's the complete picture. All percentages are shares of the cost of building the feature once.

Up-front cost: 120 percent plus 20 percent per extra app for sharing, plus the library setup. 100 percent plus 65 percent per extra copy for duplication.

Yearly upkeep: about 24 percent plus 4 percent per extra app for sharing. 20 percent plus about 20 percent per extra copy — and rising — for duplication.

Bug fixes: once, in one place, versus in every copy.

Consistency: same code, same behavior — versus copies that can drift, sometimes on purpose.

Each extra app: cheap with sharing, expensive with copies.

Break-even: from the start in our scenario — but copying wins for small or short-lived features.

And the main risks: the wrong abstraction and breaking changes on one side; missed fixes and drift on the other.

---

## SLIDE 12 — When to choose what

`[Slide appears: Two columns — green for shared, red for duplicated]`

So — practical guidance.

Prefer shared code when three or more apps need the feature, or will. When the feature is large — with two apps and a new library, above roughly 800 hours. When you're looking several years ahead. When a shared library already exists. When the apps should behave the same. And when making the code shareable is cheap.

Copying can be the better choice when the feature is small or the horizon short. When you'd be creating a new library just for this one feature. When the copies are expected to diverge. When the apps are very different. For prototypes and MVPs. And when teams can't coordinate their releases.

`[Pause]`

The key message: for two apps, the up-front costs are about equal — it's the recurring upkeep of the extra copies that decides. The advantage of sharing grows with every app. And small features or short horizons favour copying, especially when a new library would be needed.

---

## SLIDE 13 — Questions

`[Slide appears: "QUESTIONS?"]`

That wraps up the analysis. Let me leave you with three numbers:

74,844 euros — the up-front cost of both options in our scenario. Exactly equal. Copying isn't cheaper at the start.

11,500 euros — what sharing saves over five years with two apps. Modest, and sensitive to assumptions.

And 1.92 — the cost ratio at five apps. That's where sharing really pays.

The calculator lets you plug in your own team, feature size, number of apps and assumptions. I'm happy to take questions, or to run it live on a decision we're facing.

Thank you.

---

## Timing Guide

| Section | Slide | Est. Duration |
|---|---|---|
| Title + intro | 1 | 0:30 |
| Context | 2 | 1:30 |
| Upkeep is recurring | 3 | 1:30 |
| Initial costs | 4 | 1:30 |
| What decides | 5 | 2:00 |
| 5-year projection | 6 | 1:30 |
| Break-even | 7 | 1:30 |
| Scale factor | 8 | 1:00 |
| Counter-evidence | 9 | 1:30 |
| Measured vs assumed | 10 | 1:30 |
| Summary table | 11 | 1:00 |
| Recommendations | 12 | 1:30 |
| Questions / close | 13 | 0:30 |
| **Total** | | **~14 min** |
