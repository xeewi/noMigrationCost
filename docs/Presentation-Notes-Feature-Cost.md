# Presentation Notes — Feature Cost: Shared Code vs Duplicated Code

> Reference document to accompany the presentation. Bullet points for quick reading.
> Revised October 2026 after the theory review (`docs/revue-theorique-2026-10.md`). Every figure below comes from the calculator's engine (`src/engine/formulas.ts`) with its default values.

---

## Reference scenario (used throughout)

- **Team**: 1 junior, 2 mid, 1 senior → average loaded rate **€40.50/h** (France 2026: 32 / 40 / 50 / 62 €/h for junior / mid / senior / lead)
- **Feature**: 40 story points, velocity 10, 2-week sprints → 4 sprints × 2 weeks × 35 h × 4 people = **1,120 person-hours**
- **Build cost of one copy**: C0 = 1,120 h × €40.50 = **€45,360**
- **2 apps, 5 years, a new shared library must be created**
- **Defaults**: generalization G = 1.2, porting p = 0.65, integration i = 0.2, upkeep m = 20 %/yr, extra-copy upkeep e0 = 1.0, drift δ = +0.05/yr (capped at 1.5), coordination k = 4 %/yr per extra app, new library = 280 h setup + 100 h/yr running

---

## Slide 2 — Context: Why this analysis?

- **Core question**: when a feature must exist in several apps, is it cheaper to share it (one library) or to copy-adapt it into each app?
- **Every cost scales with the feature**: each cost is a share of C0 = person-hours × loaded rate. Only the new library's setup and running cost are fixed hours
- **The hourly rate never flips the verdict**: the gap is proportional to the rate (€9,088 at €32/h, €11,502 at €40.50/h, €17,608 at €62/h)
- **Not dogmatic**: depending on size, number of apps and horizon, either option can win
- **Sources**: COCOMO II reuse model, Krüger & Berger (FSE 2020), Ray & Kim (FSE 2012), Poulin, France 2026 labor-cost data. Each parameter is labelled measured or assumed

---

## Slide 3 — Upkeep is a recurring cost

- Order of magnitude used: **~20 % of the build cost per copy per year** (DoD rule of thumb, Glass's 60/60 rule, Boehm's annual change traffic)
- One app, one copy, 5 years: build €45,360 + upkeep €45,360 → **upkeep = half of the 5-year cost**
- So the choice plays out mostly after delivery: in the upkeep of the extra copies
- Bugs are not priced separately: fixing them is part of upkeep. There is no reliable data to price "propagated bugs" on their own, and the 1-10-100 cost-by-phase rule is not supported by data (Menzies et al., EMSE 2017: no delay effect across 171 projects)

---

## Slide 4 — Up-front costs: roughly equal for 2 apps

### Shared code
- Build it once, made to share: **G = 1.2 × C0** (measured: COCOMO II RUSE 1.07–1.24, Krüger & Berger median +20 %) → €54,432
- Plug it into each other app: **i = 20 % of C0** (Poulin, Krüger & Berger) → €9,072
- Set up a new library (repo, CI, versioning, docs): **280 h** (assumption; 0 if the library exists) → €11,340
- **Total up-front: €74,844** (€63,504 if the library already exists)

### Duplicated code
- Build it for the first app: C0 = €45,360
- Copy-adapt into each other app: **p = 65 % of C0** (measured: COCOMO II reuse model 0.55–0.8, Selby/NASA) → €29,484
- **Total up-front: €74,844**

### Takeaway
- **For 2 apps with a new library, the up-front costs are equal.** Copying is not cheaper at the start; what decides is the recurring upkeep of the extra copies

---

## Slide 5 — What decides: upkeep of the extra copies

### Every copy is maintained (e0 = 1.0)
- Each extra copy costs about as much upkeep per year as the first: 20 % of C0, sync and propagated fixes included
- Hint from data: between BSD forks, 11–16 % of changes are ported from the sibling fork, at a stable rate (Ray & Kim, FSE 2012). The exact value of e0 is an assumption

### Copies drift (δ = +0.05/yr, capped at 1.5×)
- Assumption, no data: the upkeep of an extra copy grows by 0.05 a year (1.0 in year 1 → 1.2 in year 5)
- Not exponential: copies that diverge too much simply stop being synced

### Sharing has its own upkeep
- Shared code upkeep: 20 % of 1.2 × C0 = **24 % of C0 per year**
- Coordination and breaking-change upgrades: **k = 4 % of C0 per extra app per year** (order of magnitude: Krüger & Berger ~5 % vs ~7 % coordination effort; Xavier 2017: 14.8 % of API changes break compatibility)
- Running a new library: **100 h/yr** (assumption)

### Slide conclusion
- Yearly cost in the reference scenario:
  - Shared: €10,886 upkeep + €1,814 coordination + €4,050 running = **€16,751/yr**
  - Duplicated: €9,072 first copy + €9,072 → €10,886 extra copy = **€18,144 → €19,958/yr**
- The difference is small per year, but it is paid every year and grows with the number of apps

---

## Slide 6 — 5-year projection (reference scenario)

### Cumulative cost table

| | Year 0 | Year 1 | Year 3 | Year 5 |
|---|---|---|---|---|
| **Shared code** | €74,844 | €91,595 | €125,096 | €158,598 |
| **Duplicated code** | €74,844 | €92,988 | €130,637 | €170,100 |
| **Gap** | €0 | €1,393 | €5,540 | €11,502 |

### Key takeaways
- **Year 0**: same up-front cost
- Sharing is never more expensive, so **it pays off from the start (equal build cost, cheaper every month after)**
- The gap grows a little faster each year as copies drift: **€11,502 after 5 years (7 % of the duplicated cost)**
- **With an existing library**: shared €127,008 vs duplicated €170,100 → **gap €43,092**
- The margin is thin for 2 apps: a costlier generalization (G ≥ 1.33) or cheaper copy upkeep (e0 < 0.75, threshold ≈ 0.746) flips the verdict

---

## Slide 7 — Break-even: read from the same curves

- Break-even = **earliest month from which sharing stays cheaper until the horizon**, read from the same cumulative curves as the gap (no separate formula)
- Reference scenario: **month 0** (equal up-front cost, cheaper upkeep)
- Small feature (140 h, new library): **never** within 5 years. Sharing costs €47,466 vs €21,263 for duplication (2.2×), because the library's setup and running hours dwarf the feature
- Cheap porting (p = 0.4): break-even only at month 60

### What favours sharing
- Large feature (with a new library and 2 apps, sharing wins above ~820 h over 5 years)
- More apps (with 3 apps, the threshold drops to ~340 h)
- A shared library already exists (then sharing wins at any feature size with the defaults)
- Long horizon

### What favours copying
- Small feature, especially if a new library must be created for it
- Short horizon (1 year: sharing needs ~1,030 h to win)
- Cheap porting or cheap upkeep of copies
- Costly generalization (very different apps)

---

## Slide 8 — Scale: the advantage grows with the number of apps

### Duplicated / shared cost over 5 years (new library)
- **2 apps: 1.07×** → sharing saves ~€11,500
- **3 apps: 1.41×** → sharing saves ~€72,700
- **5 apps: 1.92×** → sharing saves ~€195,200
- (10 apps: 2.65×, ~€501,400)

### Why
- Each extra copy costs 65 % of the build up front, then a full share of upkeep every year (and rising)
- Each extra app on a shared library costs 20 % of the build up front, then 4 %/yr
- No n(n−1)/2 coordination: a library serving N apps has about N interfaces, not N²

---

## Slide 9 — Counter-evidence: what the numbers don't say

### Clones are often harmless
- Up to 71 % of clones judged beneficial (Kapser & Godfrey 2008, 2 systems)
- 54–72 % of clones that disappear do so within ~8 commits (Kim et al. 2005)
- Clones are not more defect-prone (Rahman et al. 2012)

### The wrong abstraction
- "Duplication is far cheaper than the wrong abstraction" (Sandi Metz)
- A copy that is meant to evolve differently is not a cost
- 49 % of Microsoft engineers cope with dependency problems by removing code dependencies (Begel et al. 2009)

### Breaking changes in shared libraries
- 14.8 % of API changes break compatibility, affecting 2.5 % of clients (Xavier et al., SANER 2017)
- 81.5 % of systems keep outdated dependencies (Kula et al. 2018)
- The model prices this only as k = 4 %/yr per app

### Left out of the model
- Time to market and the release bottleneck of a shared library
- Intended divergence between apps
- UX consistency (a benefit of sharing, not priced)
- Discounting (NPV): small effect over 5 years

---

## Slide 10 — Measured vs assumed

### Measured (published ranges)
- Generalization **G = 1.2** (COCOMO II RUSE 1.07–1.24, Krüger & Berger; range 1.1–1.6)
- Porting **p = 0.65** (COCOMO II reuse model 0.55–0.8, Selby/NASA)
- Integration per extra app **i = 0.2** (Poulin, Krüger & Berger ≈ 0.2–0.33)
- Upkeep **m = 20 %/yr**, order of magnitude (DoD rule, Glass 60/60, Boehm ACT)

### Assumed (no solid data)
- Extra-copy upkeep e0 = 1.0 (Ray & Kim give a hint, not a value)
- Drift δ = +0.05/yr, capped at 1.5×
- Coordination and upgrades k = 4 %/yr per extra app (order of magnitude)
- New library: 280 h setup, 100 h/yr running

### Not priced
- Bugs on their own: no reliable data. The 1-10-100 rule is not supported (Menzies et al. 2017)
- The verdict is most sensitive to G and e0: test them in the calculator before deciding

---

## Slide 11 — Summary comparison

| Dimension | Shared Code | Duplicated Code |
|---|---|---|
| Up-front cost | 120 % + 20 % per extra app (+ library setup) | 100 % + 65 % per extra copy |
| Yearly upkeep | 24 % + 4 % per extra app (+ library running) | 20 % + 20 % per extra copy, rising |
| Bug fixes | Once, in one place | In every copy (inside upkeep) |
| Consistency | Same code, same behavior | Can drift (sometimes on purpose) |
| Each extra app | Cheap | Expensive |
| Break-even (ref.) | From the start (tie at build) | Wins for small or short-lived features |
| Main risk | Wrong abstraction, breaking changes | Missed fixes, drift |

(Percentages are shares of C0, the cost of building the feature once.)

---

## Slide 12 — Recommendations: when to choose what?

### Prefer shared code if:
- 3+ apps need the feature (or are planned)
- The feature is large (2 apps and a new library: above ~800 h)
- The horizon is several years
- A shared library already exists
- The apps should behave the same
- Generalization is cheap (G ≤ ~1.3)

### Copying may be better if:
- The feature is small or the horizon short
- A new library would be created for this one feature
- The copies are expected to diverge
- The apps are very different (costly generalization)
- Prototype or MVP
- Teams can't coordinate releases

### Key closing message
- **Up-front costs are roughly equal for 2 apps; the recurring upkeep of the extra copies decides**
- **The advantage of sharing grows with every app**
- **Small features and short horizons favour copying, especially when a new library is needed**

---

## Key figures to remember (cheat sheet)

| Metric | Value |
|---|---|
| Up-front cost, 2 apps, new library | €74,844 each (equal) |
| 5-year gap, reference scenario | €11,502 in favour of sharing (7 %) |
| Same, existing library | €43,092 |
| Break-even, reference scenario | From the start (tie at build) |
| Duplicated / shared at 3 / 5 apps (5 yrs) | 1.41× / 1.92× |
| Minimum size for sharing to win (2 apps, new lib, 5 yrs) | ~820 h |
| Small feature (140 h, new lib) | Copying is 2.2× cheaper |
| Porting factor | 0.65 of the build (measured) |
| Generalization factor | 1.2 (measured) |
| Upkeep | ~20 % of the build per copy per year |
