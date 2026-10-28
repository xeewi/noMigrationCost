# Feature Cost: Shared Code vs Duplicated Code

The research behind the calculator: where each number comes from, how much it can be trusted, and the exact formulas the app uses.

**What the calculator answers.** A feature is needed in N apps (N ≥ 2). You can build it once as a shared library that every app uses, or build it for one app and copy-and-adapt it into the others. The calculator adds up the cost of each option, month by month, over a horizon of 1 to 10 years. It shows the total for each, the gap between them and the month from which sharing stays cheaper. It also gives the cost of the feature built once, for a single app.

**What it deliberately leaves out.**

- **Time-to-market.** Copying is often faster for the second app when no library exists yet. The calculator counts effort, not calendar time.
- **Release bottleneck.** A shared library can make teams wait on each other's releases. That cost is real but is not measured anywhere in a usable form.
- **Intentional divergence.** If a copy is meant to evolve differently, its separate upkeep is not waste. The model treats every copy as one that should stay in sync.
- **Discounting.** All amounts are nominal euros. A euro spent in year 5 counts the same as one spent today.

§6 lists these and the other limits in more detail.

**How to read the evidence.** Every model parameter is labelled **Measured** (an empirical study gives at least an order of magnitude) or **Assumption** (a reasoned value with no direct measurement). §7.4 has the full table.

---

## 1. Developer cost in France (2026)

### 1.1 Salaries

The main source is Apec's December 2025 salary study [[1]](https://corporate.apec.fr/files/live/sites/corporate/files/Nos%20etudes/PDF/Les%20remunerations%20des%20cadres%20dans%20111%20familles%20de%20metiers%202025.pdf). It re-weights 26,000 private-sector cadre responses on official payroll (DSN) data. For the "software development" job family:

- Median **50 k€** gross a year (fixed + variable). 80 % of developers earn between 38 k€ and 74 k€.
- By age: under 35, median 44 k€; 35–45, 52 k€; over 45, 57 k€.
- Île-de-France median 55 k€, other regions 46 k€ (about +20 % for Paris).

Apec covers **cadres only**. Developers on non-cadre contracts, mostly juniors, are not in its data.

Two other sources agree:

- WeLoveDevs: junior (0–1 year) median 35 k€ [[2]](https://welovedevs.com/fr/salaires/junior), senior (5+ years) median 50 k€ [[3]](https://welovedevs.com/fr/salaires/senior). These are candidates' salary *expectations*, not salaries paid.
- Silkhom 2026 barometer: Java/Python developer about 45 k€, −1.1 % year on year [[4]](https://www.blogdumoderateur.com/salaires-informatique-digital-remunerations-2026/).

The market is flat to slightly down for generalist developers. Apec reports that hiring of young cadres is still 13 % below its 2023 level [[5]](https://corporate.apec.fr/home/nos-etudes/toutes-nos-etudes/previsions-de-recrutements-de-cadres-2026.html).

Point values used below (annual gross):

| Level | National | Paris / IDF |
|---|---|---|
| Junior (0–2 years) | 37 k€ | 42 k€ |
| Mid (3–5 years) | 45 k€ | 51 k€ |
| Senior (5–10 years) | 55 k€ | 62 k€ |
| Lead / Staff (10+ years) | 68 k€ | 78 k€ |

These are a synthesis of the sources above, not a single published table. The Lead row is the least certain: Apec does not split by level, and the national 68 k€ sits between its over-45 median (57 k€) and its 35–45 top decile (74 k€).

### 1.2 Employer contributions in 2026

A flat "+42–45 %" is no longer accurate. Since 1 January 2026 the **RGDU** (réduction générale dégressive unique) replaces the old general reduction and the reduced health (7 %) and family (3.45 %) rates [[6]](https://entreprendre.service-public.gouv.fr/vosdroits/F24542):

- It applies up to **3 SMIC**, i.e. 65,629 € a year in 2026 (the SMIC used in the formula stays at its 1 January value all year).
- It has a **2 % floor**, so every salary below that threshold gets at least 2 % off.
- At developer salaries it is worth about 10 % of gross at 36 k€, 4.9 % at 45 k€, 2.6 % at 55 k€ and 2.1 % at 62 k€.

Above the social security ceiling (PASS, 48,060 € in 2026), supplementary pension (Agirc-Arrco tranche 2) rises to 12.95 %, which pushes the lead's multiplier up. Rates are from the 2026 URSSAF tables [[7]](https://www.legisocial.fr/reperes-sociaux/taux-cotisations-sociales-urssaf-2026.html).

The resulting multiplier (gross → employer cost) therefore depends on the band. Assumptions: cadre, company of 50+ employees, workplace-accident rate 0.6 %, mandatory cadre insurance, a modest health plan. "Paris" adds the 3.2 % transport levy (versement mobilité).

| Level | Gross (national) | Multiplier | Employer cost | Gross (Paris) | Multiplier (Paris) | Employer cost (Paris) |
|---|---|---|---|---|---|---|
| Junior | 37,000 € | ×1.372 | 50,765 € | 42,000 € | ×1.433 | 60,167 € |
| Mid | 45,000 € | ×1.412 | 63,532 € | 51,000 € | ×1.459 | 74,420 € |
| Senior | 55,000 € | ×1.431 | 78,726 € | 62,000 € | ×1.466 | 90,881 € |
| Lead | 68,000 € | ×1.452 | 98,765 € | 78,000 € | ×1.482 | 115,558 € |

The statutory rates are solid. The totals carry ±0.03 of uncertainty, from company size, city, and health and insurance plans above the legal minimum.

### 1.3 Loaded hourly cost (the app's default rates)

The hourly rate divides employer cost by **1,607 hours**, the legal annual working time for a 35-hour contract [8]. It is the cost per *paid* hour.

Many developer cadres are on a **forfait jours** contract instead. DARES counts 15.1 % of full-time private-sector employees on forfait jours, 84.2 % of them cadres [[9]](https://www.moneyvox.fr/votre-argent/actualites/108773/les-salaries-au-forfait-jours-principalement-des-cadres-font-plus-heures-que-les-autres). Under the Syntec agreement the cap is 218 days a year [10], i.e. 218 × 7 h = 1,526 h. The calculator keeps 1,607 h because it is the legal basis and gives the lower (conservative) rate. With 1,526 h a senior costs 51.6 €/h instead of 49.0 €/h. Per *productive* hour (about 1,400 h after sick leave, training and admin, a convention rather than a statistic) it would be about 15 % more.

| Level | National €/h (÷ 1,607) | **App default** | Paris €/h |
|---|---|---|---|
| Junior | 31.6 | **32** | 37.4 → 37 |
| Mid | 39.5 | **40** | 46.3 → 46 |
| Senior | 49.0 | **50** | 56.6 → 57 |
| Lead | 61.5 | **62** | 71.9 → 72 |

**The app's defaults are "loaded", not "fully loaded".** They include salary and employer contributions only. A *fully loaded* cost also covers tools, office space, management and recruiting. There is no French statistic for that overhead. Two official flat rates bracket it: Horizon Europe funds indirect costs at 25 % of direct costs [[11]](https://www.ffg.at/en/europe/heu/legal-financial/theme_indirect-costs), and the French research tax credit counts operating costs at 40 % of R&D personnel costs [[12]](https://www.impots.gouv.fr/sites/default/files/formulaires/2069-a-sd/2026/2069-a-sd_5270.pdf). A ×1.25 factor gives fully loaded national rates of about 40 / 49 / 61 / 77 €/h (senior about 71 €/h in Paris). To work on that basis, type these rates into the team table.

### 1.4 Freelance day rates (TJM)

If the work is done by freelancers, use their day rate instead:

| Experience | Hays 2026, Paris full-stack [[13]](https://www.blogdumoderateur.com/freelance-tech-taux-journaliers-moyens-metier-2026/) | Malt, displayed rates [14] |
|---|---|---|
| Junior | 450 €/day (0–3 years) | 317 €/day (< 2 years) |
| Confirmed | 515 €/day (3–5 years) | 435 €/day (3–7 years) |
| Senior | 580 €/day (5–8 years) | 575 €/day (8–15 years) |
| Expert | 650 €/day (8+ years) | 672 €/day (15+ years) |

Hays puts the regions about 10 % below Paris. To get an hourly rate, divide by 7 (TJM / 7, the same 7-hour day the app uses for person-days). A TJM is a *price*: it already includes the freelancer's own charges, unbilled days and margin. It is not comparable with a salaried employee's loaded cost (a senior's loaded day costs about 78,726 € / 218 ≈ 361 €).

---

## 2. Maintenance

### 2.1 How much does upkeep cost per year?

There is no precise, general figure. The order of magnitude is about **20 % of the build cost per year**:

- A US Department of Defense rule of thumb puts annual maintenance at about 20 % of the development effort of the installed base [15].
- Boehm's COCOMO 81 computes annual maintenance as *annual change traffic* (the share of the code added or modified each year) × development effort [16]. The traffic is project-specific, but this is the framing the calculator uses: a yearly rate times the build cost.
- Glass's "60/60 rule": about 60 % of life-cycle cost is maintenance, and about 60 % of that is enhancement [17]. Over a 5–10-year life, that implies roughly 15–30 % of the build cost per year.

A figure often quoted for this, **Gartner's "15–22 %"**, is something else: according to the trade-press coverage it comes from, it is the annual support fee software vendors charge, as a percentage of the licence price. It says nothing about engineering effort.

The calculator uses one rate, `m`, for every copy of the code (default 0.20). COCOMO II applies its "built for reuse" premium to development only, not to maintenance [[18]](https://www.rose-hulman.edu/class/csse/csse372/201310/Homework/CII_modelman2000.pdf). The calculator nevertheless applies `m` to the larger cost of the shared build (§7.2), on the reasoning that generic code is bigger. That choice slightly penalises sharing.

### 2.2 What maintenance consists of

The classic split comes from surveys of IT managers by Lientz and Swanson:

| Type | 1978, 69 organisations [[19]](https://doi.org/10.1145/359511.359522) | 1980, 487 organisations [20] |
|---|---|---|
| Perfective (enhancements) | 60.3 % | about 50 % |
| Adaptive (environment changes) | 18.2 % | about 25 % |
| Corrective (bug fixes) | 17.4 % | about 22 % |
| Other | 4.1 % | about 3–4 % |

These are managers' estimates. When Schach et al. measured change logs instead, corrective work was over half of maintenance [[21]](https://doi.org/10.1023/A:1025368318006). Either way, **bug fixing is already part of maintenance**, so the calculator does not add a separate bug cost on top of `m`.

### 2.3 Build vs life-cycle cost

Zarnekow and Brenner followed 30 application systems over a 5-year production period [[22]](https://aisel.aisnet.org/ecis2005/26). Planning and initial development made up about 21 % of total cost, and the remaining 79 % went to running, maintaining and evolving the systems. That 79 % includes *operations* (infrastructure, support), which the calculator does not count. It is a reminder that over a few years the recurring costs, not the build, dominate.

### 2.4 Does a bug cost more the later it is found?

The "1-10-100 rule" is weaker than its reputation:

- NIST Planning Report 02-3 gives relative repair costs of 1× (requirements/design), 5× (coding), 10× (integration), 15× (beta) and 30× (post-release), but labels its table "**Example Only**" [[23]](https://www.nist.gov/system/files/documents/director/planning/report02-3.pdf).
- The often-cited "IBM Systems Sciences Institute" 1-6-15-100 figures trace back to internal IBM training notes, not to a published study [[24]](https://www.theregister.com/2021/07/22/bugs_expense_bs/) [[25]](https://leanpub.com/leprechauns).
- Boehm and Basili say post-delivery fixes are "often" 100× more expensive, but "more like 5:1" for small, non-critical systems [[26]](https://doi.org/10.1109/2.962984).
- Menzies et al. tested the effect on 171 software projects (2006–2014) and found **no evidence** that issues get harder to resolve the later they are found [[27]](https://arxiv.org/abs/1609.04886).

There is also no credible figure for the average cost of a production bug. **The calculator therefore does not price bugs separately.** Bug fixing is inside the upkeep rate `m` (§2.2), and the repeated fixes across copies are inside the extra-copy ratio `e` (§4.3).

---

## 3. Shared code

### 3.1 One-off costs

**Building it to be shared (`G`).** Code written for reuse costs more than code written for one app:

| Source | Value | What it is |
|---|---|---|
| COCOMO II, RUSE cost driver [[18]](https://www.rose-hulman.edu/class/csse/csse372/201310/Homework/CII_modelman2000.pdf) | 1.07 / 1.15 / 1.24 | Effort multiplier for reuse across a program / a product line / several product lines |
| Lim, HP [[28]](https://doi.org/10.1109/52.311048) | 1.11 | One of two HP programmes: a reusable component cost 111 % of a non-reusable one (via the Mohagheghi & Conradi review [[29]](https://doi.org/10.1007/s10664-007-9040-x)) |
| Poulin [[30]](http://jeffreypoulin.info/html/reucalc_basic.html) | about 1.5 | Recommended default (range 1.0–2.2), not a measurement |
| Krüger & Berger [[31]](https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf) | median +20 % | Systematic review: five studies on feature development for a platform; interviewees reported outliers towards much higher costs |

Default **G = 1.20**. Values above 1.5 fit true multi-product platforms rather than one feature shared by a few apps.

**Plugging it into each extra app (`i`).** Reusing an existing component is not free: the app must integrate, configure and test it. Poulin recommends a relative cost of reuse of 0.2 of a new build (range about 0.03–0.4) [[30]](http://jeffreypoulin.info/html/reucalc_basic.html). Krüger & Berger find that developing a new variant on a platform saves about 67 % against building it from scratch (median of nine studies), i.e. about 0.33 [[31]](https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf). Default **i = 0.20** per extra app.

**Setting up a new library: 280 hours (assumption).** Creating the package, its repository or registry entry, CI, versioning and API documentation. The calculator uses 8 weeks × 35 h = 280 h, at the team's average rate. No study measures this; it is close to zero inside an existing monorepo. If the library already exists, switch "new library" off: setup and running costs drop to zero.

### 3.2 Recurring costs

**Upkeep of the shared code.** `m × G × C0` per year (see §2.1 and §7.2).

**Running the library: 100 hours a year (assumption).** Releases, changelog, CI and dependency updates, about 2 hours a week. Again, no measurement exists. It only applies to a new library.

**Coordination and upgrades (`k`).** Sharing creates a dependency between teams. Two separate costs are merged into one parameter, because neither is measured precisely enough to be modelled on its own:

- *Coordination.*
  - Brooks's n(n−1)/2 counts communication paths between **people** on one task [32]. It is an argument, not a measurement. A library team serving N apps has about N interfaces, so the calculator grows coordination linearly with the number of extra apps.
  - In a Microsoft survey of 775 engineers, 72 % depended on another team's release schedule, and 49 % said they would "eliminate code dependencies (e.g. 'clone and own')" to deal with dependency problems [[33]](https://andrewbegel.com/papers/coordination-chase09.pdf). That is a multi-select answer about mitigation, not a measured time share. The survey gives no "percentage of time spent coordinating". The "11–23 % (ING study)" figure that circulates in blogs does not appear in it, and no source for it was found.
  - The best quantitative hint is Krüger & Berger's interviews: coordination was about 5 % of variant-development effort with clone-and-own and about 7 % with a platform [[31]](https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf). The *difference* is about 2 points.
- *Breaking-change upgrades.*
  - Across 317 Java libraries, 14.78 % of API changes broke backward compatibility, but only 2.54 % of client projects were actually affected [[34]](https://repositorio.ufmg.br/handle/1843/JCES-ARMPK6).
  - 81.5 % of 4,600 studied projects kept outdated dependencies [[35]](https://doi.org/10.1007/s10664-017-9521-5), which suggests teams often defer the cost rather than pay it.

Default **k = 0.04**: each extra app adds 4 % of the build cost per year. This is an **assumption** sized on the evidence above, not a measurement.

---

## 4. Duplicated code

### 4.1 Copying into another app (`p`)

The COCOMO II reuse model gives the cost of adapting existing code [[18]](https://www.rose-hulman.edu/class/csse/csse372/201310/Homework/CII_modelman2000.pdf):

```
AAF = 0.4·DM + 0.3·CM + 0.3·IM
AAM = [AA + AAF·(1 + 0.02·SU·UNFM)] / 100     (when AAF ≤ 50)
```

DM, CM and IM are the percentages of design modified, code modified and integration/test redone. SU (10–50) is the software-understanding penalty, UNFM (0–1) the team's unfamiliarity with the code and AA (0–8) the assessment effort. AAM is the cost relative to new code. Three illustrative settings for "copy a feature into a similar app":

| DM / CM / IM | AA, SU, UNFM | AAM |
|---|---|---|
| 20 / 30 / 80 | 4, 30, 0.4 (same team) | ≈ 0.55 |
| 20 / 30 / 80 | 4, 30, 1.0 (another team) | ≈ 0.70 |
| 20 / 30 / 100 | 4, 30, 1.0 (full retest, another team) | ≈ 0.79 |

Empirical data points:

- Selby's analysis of 2,954 reused NASA modules, reproduced by Boehm et al. [[36]](https://staff.emu.edu.tr/alexanderchefranov/Documents/CMPE412/Boehm1995%20COCOMO%202%20.pdf): unmodified reuse costs about 5 % of new code, but the relative cost jumps to about **0.55 once roughly 12.5 % of the code is modified** (read off the published figure), then rises slowly (about 0.70 at 62.5 % modified). Most of the cost is understanding the code and re-testing interfaces.
- Krüger & Berger report that clone-and-own reduced variant-development cost by about 35 %, i.e. a factor of about 0.65 [[31]](https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf). This comes from **a single study** (Henry & Faller), not a median.

Default **p = 0.65** per extra app.

### 4.2 Keeping the extra copies alive (`e0`)

Each copy needs its own upkeep: its own bug fixes, its own adaptation to its app's platform and dependencies. On top of that, changes made in one copy often have to be redone in the others.

The only hard data on cross-codebase syncing is Ray & Kim's study of 18 years of the FreeBSD, NetBSD and OpenBSD forks [[37]](https://baishakhir.github.io/uploads/fse2012-bsd.pdf):

- **10.7–15.5 % of edited lines** in release patches were ported from a sibling fork (13.8 % FreeBSD, 15.5 % NetBSD, 10.7 % OpenBSD).
- The porting rate **did not decline** over time.
- 26 %, 59 % and 45 % of active developers ported changes in each release.
- The **median porting latency was 10–20 months**, and ported changes were *less* defect-prone than others.

The calculator expresses the upkeep of each extra copy as a ratio `e` of the first copy's upkeep. Default **e0 = 1.00**: an extra copy costs as much to keep as the first, syncing and repeated fixes included. This is an **assumption**. Ray & Kim support the idea that syncing is a steady, moderate fraction of change volume, but nobody has measured the ratio itself.

### 4.3 Bugs in cloned code

The clone literature is often over-quoted. Stated precisely:

- Mondal et al. (ICSME 2017) studied **4 Java systems** (jEdit, Freecol, Carol, Jabref). **Up to 33 %** of the clone fragments *that received a bug fix* contained a propagated bug [[38]](https://clones.usask.ca/pubfiles/articles/MondalICSME2017BugPropagation.pdf). The extended journal version (JSS 2019, **7 systems**, Java, C and C#) gives **18.42 %** overall [[39]](https://clones.usask.ca/pubfiles/articles/MMondalBugProposationJSS.pdf).
  - The denominator is clone fragments that got a bug fix, not all clones.
  - "Propagated" is **inferred**: two fragments that received the same fix while staying clones are assumed to have shared a bug copied along with the code.
  - All clones are **inside one repository**, not across codebases.
- Juergens et al. found that about every second to third *unintentional* inconsistent change to a clone led to a fault, across five industrial and open-source systems [[40]](https://arxiv.org/abs/1701.05472).
- Islam et al. analysed 34 systems (8.7 MLOC) with two static detectors: vulnerabilities in cloned code were **more severe**, but **not denser**, than in non-cloned code [[41]](https://doi.org/10.1109/ESEM.2017.9).

So duplicated bugs are real, but there is no basis for a fixed "bug multiplier". The calculator includes repeated fixes in the extra-copy ratio `e` rather than pricing them separately.

### 4.4 Divergence over time (`δ`, cap 1.5)

No study measures sync cost growing exponentially as copies age. What studies do show is that copies that drift apart **stop syncing**:

- most hard forks on GitHub never sync with upstream again [[42]](https://www.cs.cmu.edu/~shuruiz/paper/icse20-hardfork.pdf);
- there is little code integration between members of fork families in the Android, .NET and JavaScript ecosystems [[43]](https://doi.org/10.1007/s10664-021-10078-2);
- a Krüger & Berger interviewee, on long-lived clones: "we don't do it at all" [[31]](https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf).

The unpaid sync becomes drift: inconsistent behaviour, missed fixes, a growing cost to ever merge back. The calculator models this as a **small linear increase** of the extra-copy ratio, default **δ = 0.05 a year**, **capped at 1.5×**. Past the cap, the assumption is that teams stop syncing rather than pay more. Both δ and the cap are **assumptions**.

---

## 5. The other side of the argument

The evidence does not all point towards sharing:

- **Many clones are fine.** In Apache httpd and Gnumeric, as many as 71 % of clones were judged to have a *positive* effect on maintainability [[44]](https://doi.org/10.1007/s10664-008-9076-6).
- **Many clones are short-lived.** Of the clone genealogies that disappeared, 54–72 % did so within about 8 check-ins, and most were not easy to refactor locally [[45]](https://dada.cs.washington.edu/research/tr/2005/04/UW-CSE-05-04-01.pdf).
- **Clones are not more buggy.** In four open-source C projects, most bugs had nothing to do with clones, and cloned code was, if anything, *less* defect-prone [[46]](https://doi.org/10.1007/s10664-011-9195-3).
- **Engineers choose cloning to escape dependencies.** 49 % of surveyed Microsoft engineers would eliminate code dependencies, e.g. by clone-and-own [[33]](https://andrewbegel.com/papers/coordination-chase09.pdf). Krüger & Berger's interviewees rated *change propagation* as more costly on a platform than with clones [[31]](https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf).
- **The wrong abstraction.** "Duplication is far cheaper than the wrong abstraction" [[47]](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction). A shared library built before the use cases are understood can cost more than the copies it replaced. This is an opinion piece, but consistent with the studies above.
- **The "about three products" heuristic.** Software product-line literature says a reuse platform pays off from about three products [[48]](https://doi.org/10.1007/3-540-28901-1). It is an experience-based rule, not a measurement. The calculator's verdict at N = 2 being close (§7.5) is consistent with it.

**AI coding assistants.** The evidence is new and mixed:

- GitClear's 2025 report, a vendor analysis, found about 8× more duplicated code blocks in 2024 than before [49]. It shows more duplication, not its cost.
- A preregistered controlled experiment with 151 participants found **no effect** of AI-assisted development on how easily others could later evolve the code [[50]](https://arxiv.org/abs/2507.00788).
- An LLM ported 42 % of Vim patches to Neovim correctly [[51]](https://arxiv.org/abs/2404.17964), which suggests porting may get cheaper.

**The calculator does not model AI.** If you believe your tooling makes copying cheaper, lower `p` and `e0` yourself.

---

## 6. Scope and limits

What the model does not capture, so the reader can adjust the verdict by judgement:

| Not modelled | Which way it pushes |
|---|---|
| Time-to-market | Either way. Without a library, copying usually ships the second app sooner. Once a platform is established, Krüger & Berger's review reports a larger time-to-market reduction for the platform (about −63 %) than for clone-and-own (about −30 %) [[31]](https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf). |
| Release bottleneck | Against sharing: teams wait on the library's releases. |
| Intentional divergence | Against the duplicated-side cost: if copies *should* differ, their separate upkeep is not waste. |
| Discounting (NPV) | Later costs would weigh less. Sharing's advantage comes from recurring costs, so discounting slightly reduces it. |
| Onboarding | Neutral in the model. No study separates "learning the sharing mechanism" from "learning two diverged copies". |
| Unpaid drift | Against duplication: inconsistent behaviour and missed fixes once copies stop syncing (§4.4) have a cost the model does not price. |
| AI assistance | See §5. |
| Bugs as a separate line | Not priced separately; included in `m` and `e` (§2.4). |

---

## 7. The calculator model

Every formula below is implemented in `src/engine/formulas.ts`, and every number in §7.5 can be reproduced by calling it.

**About COCOMO.** The calculator does not use COCOMO's size-based effort equation: you give the effort directly. Only two parts of COCOMO II serve as evidence: the RUSE cost driver (for G, §3.1) and the reuse model (for p, §4.1).

**Common definitions.**

- **w**: the team's average loaded hourly rate, weighted by headcount (§1.3).
- **B**: person-hours to build the feature once, for one app.
  - Story points: `B = (story points / velocity) × sprint weeks × 35 h × headcount`. Velocity is the whole team's, so each sprint costs every team member's hours.
  - Direct mode: the value is already person-hours, or person-days × 7 h.
- **C0 = B × w**: the cost of building the feature once, for one app. Every cost in the model is a multiple of C0, except library setup and running, which are fixed hours × w.
- **N**: number of apps that need the feature (2 to 10 in the UI). **T**: horizon in years.
- **Timing**: builds are paid at month 0. Yearly costs accrue evenly, one twelfth per month. Month t belongs to year y = ⌈t / 12⌉.

### 7.1 Standalone cost

The feature built once, for one app:

```
Standalone(T) = C0 + m · C0 · T
```

Example with the default scenario (§7.5): 45,360 + 0.20 × 45,360 × 5 = **90,720 €**.

### 7.2 Shared library

```
Build_S  = G·C0  +  i·C0·(N−1)  +  280 h · w        (setup only for a new library)
Yearly_S = m·G·C0  +  k·C0·(N−1)  +  100 h · w      (running only for a new library)
```

| Line in the app | Formula |
|---|---|
| Build it once, made to share | G · C0 |
| Plug it into the other apps | i · C0 · (N−1) |
| Set up the library | 280 h · w (0 if the library exists) |
| Upkeep of the shared code | m · G · C0 · T |
| Coordination and upgrades | k · C0 · (N−1) · T |
| Running the library | 100 h · w · T (0 if the library exists) |

### 7.3 Duplicated copies

```
Build_D     = C0  +  p·C0·(N−1)
Yearly_D(y) = m·C0  +  m·C0·(N−1)·e(y)
e(y)        = min(1.5, e0 + δ·(y−1))
```

| Line in the app | Formula |
|---|---|
| Build it for the first app | C0 |
| Copy it into the other apps | p · C0 · (N−1) |
| Upkeep of the first copy | m · C0 · T |
| Upkeep of the extra copies | m · C0 · (N−1) · [e(1) + e(2) + … + e(T)] |

The extra-copy ratio starts at e0 in year 1, grows by δ each year and stops at 1.5.

### 7.4 Parameters

Tunable in the "Assumptions" step (Detailed view):

| Symbol | In the app | Default | UI range | Evidence | Basis |
|---|---|---|---|---|---|
| G | Extra work to make it reusable | 1.20 | 1.0–1.6 | Measured | COCOMO II RUSE 1.07–1.24; HP 1.11; Krüger & Berger median +20 %; Poulin 1.5 as a recommended default (§3.1) |
| p | Effort to copy it into another app | 0.65 | 0.3–1.0 | Measured | COCOMO II reuse model 0.55–0.8; Selby 0.55 at ~12.5 % modified; Krüger & Berger −35 %, one study (§4.1) |
| i | Effort to plug the library into another app | 0.20 | 0–0.5 | Measured | Poulin RCR 0.2; Krüger & Berger platform variant ≈ 0.33 (§3.1) |
| m | Yearly upkeep of one copy | 0.20 | 0.1–0.4 | Measured (order of magnitude) | DoD ~20 %/yr rule of thumb; Boehm annual change traffic; Glass 60/60 (§2.1) |
| e0 | Upkeep of each extra copy | 1.00 | 0.5–1.5 | Assumption | Grounded by Ray & Kim: 10.7–15.5 % of changes ported between forks, at a steady rate (§4.2) |
| δ | How fast the copies drift apart | 0.05 / year | 0–0.2 | Assumption | No measurement; forks stop syncing rather than pay more (§4.4) |
| k | Coordination and upgrades per extra app | 0.04 / year | 0–0.15 | Assumption | Krüger & Berger coordination 5 % vs 7 %; Xavier et al. 14.78 % breaking API changes (§3.2) |

Fixed constants (not exposed in the UI):

| Constant | Value | Evidence | Basis |
|---|---|---|---|
| Library setup | 280 h (8 weeks × 35 h) | Assumption | §3.1 |
| Library running | 100 h / year | Assumption | §3.2 |
| Cap on the extra-copy ratio | 1.5 | Assumption | §4.4 |
| Working week / day | 35 h / 7 h | Legal basis | §1.3 |

"Measured" means an empirical source gives at least the order of magnitude. It does not mean the default is right for your team.

### 7.5 Worked example: the app's default scenario

**Inputs.**

- Team: 1 Junior (32 €/h), 2 Mid (40 €/h), 1 Senior (50 €/h), 0 Lead (62 €/h). Average w = (32 + 2 × 40 + 50) / 4 = **40.5 €/h**.
- Feature: 40 story points, team velocity 10, 2-week sprints → 4 sprints × 2 weeks × 35 h × 4 people = **B = 1,120 person-hours**.
- C0 = 1,120 × 40.5 = **45,360 €**.
- N = 2 apps, horizon 5 years, new library, all parameters at default.

**Shared library.**

| Line | Calculation | Cost |
|---|---|---|
| Build it once, made to share | 1.20 × 45,360 | 54,432 € |
| Plug it into the other apps | 0.20 × 45,360 × 1 | 9,072 € |
| Set up the library | 280 h × 40.5 | 11,340 € |
| Upkeep of the shared code | 0.20 × 1.20 × 45,360 × 5 | 54,432 € |
| Coordination and upgrades | 0.04 × 45,360 × 1 × 5 | 9,072 € |
| Running the library | 100 h × 40.5 × 5 | 20,250 € |
| **Total after 5 years** | | **158,598 €** |

**Duplicated copies.**

| Line | Calculation | Cost |
|---|---|---|
| Build it for the first app | 45,360 | 45,360 € |
| Copy it into the other apps | 0.65 × 45,360 × 1 | 29,484 € |
| Upkeep of the first copy | 0.20 × 45,360 × 5 | 45,360 € |
| Upkeep of the extra copies | 0.20 × 45,360 × (1.00 + 1.05 + 1.10 + 1.15 + 1.20) | 49,896 € |
| **Total after 5 years** | | **170,100 €** |

**Verdict: duplicating costs 11,502 € more over 5 years** (about 7 % of the duplicated total). Break-even: **month 0**.

Cumulative cost at each year end:

| | Year 0 | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|---|---|---|---|---|---|---|
| Shared | 74,844 € | 91,595 € | 108,346 € | 125,096 € | 141,847 € | 158,598 € |
| Duplicated | 74,844 € | 92,988 € | 111,586 € | 130,637 € | 150,142 € | 170,100 € |

**How close this is.** In the default case, the up-front costs are *exactly* equal: 1.20 + 0.20 + 280 / 1,120 = 1.65 = 1 + 0.65 times C0, i.e. 74,844 € each. That is a coincidence of this feature size, not a property of the model. The break-even of "month 0" means a tie at the start: the engine counts "shared ≤ duplicated" as sharing not being worse. The verdict is decided entirely by the **recurring costs**: 16,751 € a year for the shared side, against 18,144 € in year 1 for the duplicated side, rising by 454 € a year with drift. A modest change in one assumption flips it, as the next table shows.

**Sensitivity** (one input changed at a time from the default scenario; amounts rounded to the euro):

| Variant | Shared total | Duplicated total | Gap (duplicated − shared) | Break-even |
|---|---|---|---|---|
| Default | 158,598 € | 170,100 € | +11,502 € | month 0 (tie at build) |
| N = 3 | 176,742 € | 249,480 € | +72,738 € | month 0 |
| N = 5 | 213,030 € | 408,240 € | +195,210 € | month 0 |
| N = 10 | 303,750 € | 805,140 € | +501,390 € | month 0 |
| Existing library | 127,008 € | 170,100 € | +43,092 € | month 0 |
| Feature of 140 h | 47,466 € | 21,263 € | −26,203 € | none within horizon |
| Horizon 1 year | 91,595 € | 92,988 € | +1,393 € | month 0 |
| p = 0.4 | 158,598 € | 158,760 € | +162 € | month 60 |
| G = 1.5 | 185,814 € | 170,100 € | −15,714 € | none within horizon |

A positive gap means sharing is cheaper. Reading the table:

- More apps favour sharing strongly: each extra app costs 0.65 C0 to copy plus a full copy's upkeep, against 0.20 C0 to plug in plus 0.04 C0 a year.
- An existing library removes setup and running costs, which are fixed hours. That is why a small feature on a new library favours copying: for 140 h of work, the 280 h setup and 100 h a year of running outweigh everything else.
- Cheap copying (p = 0.4) leaves sharing ahead only at the very last month. A heavy generalisation premium (G = 1.5) makes duplication cheaper over the whole horizon.

### 7.6 Break-even and the gap

```
Gap(T)     = CumD(T) − CumS(T)
Break-even = earliest month t such that CumS(u) ≤ CumD(u) for every month u from t to T·12
```

- **0** means sharing is not more expensive from day one.
- **"None"** means sharing is not cheaper at the horizon.
- Otherwise, it is the month from which sharing stays cheaper until the horizon.

The break-even is read from the same monthly curves as the totals, so the gap and the break-even can never contradict each other. If shared is cheaper at the horizon, a break-even month exists. If it is more expensive, there is none.

**The hourly rate never flips the verdict.** Every term is hours × w (C0 = B × w; setup and running are fixed hours × w). So the gap is proportional to the rate: doubling every rate doubles the gap, and the break-even month does not move. What decides the verdict is the effort B, the number of apps, the horizon and the parameters.

---

## 8. Sources

Numbered in order of first citation. Entries without a link are books, reports or pages with no stable public URL.

1. Apec, *Les rémunérations des cadres dans 111 familles de métiers*, édition 2025 (published December 2025), p. 63, "Métiers du développement informatique". Cadres only. <https://corporate.apec.fr/files/live/sites/corporate/files/Nos%20etudes/PDF/Les%20remunerations%20des%20cadres%20dans%20111%20familles%20de%20metiers%202025.pdf>
2. WeLoveDevs, "Salaire développeur junior" (self-declared salary expectations of registered candidates, page updated October 2026). <https://welovedevs.com/fr/salaires/junior>
3. WeLoveDevs, "Salaire développeur senior" (same method, page updated October 2026). <https://welovedevs.com/fr/salaires/senior>
4. Silkhom, *Baromètre des salaires IT 2026* (July 2026), as reported by Blog du Modérateur, 7 July 2026. <https://www.blogdumoderateur.com/salaires-informatique-digital-remunerations-2026/>
5. Apec, *Prévisions de recrutements de cadres 2026* (April 2026). <https://corporate.apec.fr/home/nos-etudes/toutes-nos-etudes/previsions-de-recrutements-de-cadres-2026.html>
6. Service-public.fr (Entreprendre), "Réduction générale des cotisations patronales" (fiche F24542, 2026 RGDU parameters). <https://entreprendre.service-public.gouv.fr/vosdroits/F24542>
7. LégiSocial, "Taux de cotisations sociales URSSAF 2026" (updated 1 January 2026). <https://www.legisocial.fr/reperes-sociaux/taux-cotisations-sociales-urssaf-2026.html>
8. Code du travail, art. L3121-41 (1,607-hour annual reference duration).
9. DARES study on forfait jours (May 2026, reference year 2024), as reported by AFP / MoneyVox, May 2026. The DARES publication itself was not read. <https://www.moneyvox.fr/votre-argent/actualites/108773/les-salaries-au-forfait-jours-principalement-des-cadres-font-plus-heures-que-les-autres>
10. Convention collective Syntec (IDCC 1486), avenant of 1 April 2014 on working time, art. 4.4 (218-day cap for forfait jours).
11. FFG (Austrian Research Promotion Agency), "Horizon Europe: indirect costs" (flat rate of 25 % of direct eligible costs). <https://www.ffg.at/en/europe/heu/legal-financial/theme_indirect-costs>
12. impots.gouv.fr, notice of form 2069-A-SD (Crédit d'impôt recherche), 2026 edition: operating costs set at 40 % of R&D personnel costs. <https://www.impots.gouv.fr/sites/default/files/formulaires/2069-a-sd/2026/2069-a-sd_5270.pdf>
13. Hays, freelance day rates 2026, as reported by Blog du Modérateur, 29 January 2026. <https://www.blogdumoderateur.com/freelance-tech-taux-journaliers-moyens-metier-2026/>
14. Malt, day rates displayed by active freelancers on the platform, read August–September 2026 (no stable URL).
15. Institute for Defense Analyses, Document D-8367 (2017), citing a 2006 US DoD study: annual maintenance ≈ 20 % of the development effort of the installed base (secondary).
16. B. W. Boehm, *Software Engineering Economics*, Prentice Hall, 1981 (COCOMO 81; annual change traffic).
17. R. L. Glass, *Facts and Fallacies of Software Engineering*, Addison-Wesley, 2002 (the 60/60 rule).
18. B. Boehm et al., *COCOMO II Model Definition Manual*, version 2.1, USC, 2000 (RUSE driver, reuse model, maintenance model). Book form: *Software Cost Estimation with COCOMO II*, Prentice Hall, 2000. <https://www.rose-hulman.edu/class/csse/csse372/201310/Homework/CII_modelman2000.pdf>
19. B. P. Lientz, E. B. Swanson, G. E. Tompkins, "Characteristics of application software maintenance", *Communications of the ACM* 21(6), 1978. DOI 10.1145/359511.359522. <https://doi.org/10.1145/359511.359522>
20. B. P. Lientz, E. B. Swanson, *Software Maintenance Management*, Addison-Wesley, 1980.
21. S. R. Schach, B. Jin, L. Yu, G. Z. Heller, J. Offutt, "Determining the distribution of maintenance categories: survey versus measurement", *Empirical Software Engineering* 8(4), 2003. DOI 10.1023/A:1025368318006. <https://doi.org/10.1023/A:1025368318006>
22. R. Zarnekow, W. Brenner, "Distribution of cost over the application lifecycle – a multi-case study", ECIS 2005. <https://aisel.aisnet.org/ecis2005/26>
23. RTI for NIST, *The Economic Impacts of Inadequate Infrastructure for Software Testing*, Planning Report 02-3, 2002 (Table 5-1, "Example Only"). <https://www.nist.gov/system/files/documents/director/planning/report02-3.pdf>
24. The Register, "Everyone cites that 'bugs are 100x more expensive to fix in production' research, but the study might not even exist", 22 July 2021. <https://www.theregister.com/2021/07/22/bugs_expense_bs/>
25. L. Bossavit, *The Leprechauns of Software Engineering*, Leanpub, 2012–2015. <https://leanpub.com/leprechauns>
26. B. Boehm, V. R. Basili, "Software defect reduction top 10 list", *IEEE Computer* 34(1), 2001. DOI 10.1109/2.962984. <https://doi.org/10.1109/2.962984>
27. T. Menzies, W. Nichols, F. Shull, L. Layman, "Are delayed issues harder to resolve? Revisiting cost-to-fix of defects throughout the lifecycle", *Empirical Software Engineering* 22, 2017. DOI 10.1007/s10664-016-9469-x. Preprint arXiv:1609.04886. <https://arxiv.org/abs/1609.04886>
28. W. C. Lim, "Effects of reuse on quality, productivity, and economics", *IEEE Software* 11(5), 1994. DOI 10.1109/52.311048 (not read; figure taken from the Mohagheghi & Conradi review). <https://doi.org/10.1109/52.311048>
29. P. Mohagheghi, R. Conradi, "Quality, productivity and economic benefits of software reuse: a review of industrial studies", *Empirical Software Engineering* 12(5), 2007. DOI 10.1007/s10664-007-9040-x. <https://doi.org/10.1007/s10664-007-9040-x>
30. J. S. Poulin, *Measuring Software Reuse*, Addison-Wesley, 1997; recommended RCWR and RCR values as stated in the author's online reuse calculator. <http://jeffreypoulin.info/html/reucalc_basic.html>
31. J. Krüger, T. Berger, "An empirical analysis of the costs of clone- and platform-oriented software reuse", ESEC/FSE 2020. DOI 10.1145/3368089.3409684. <https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf>
32. F. P. Brooks, *The Mythical Man-Month*, Addison-Wesley, 1975, ch. 2.
33. A. Begel, N. Nagappan, C. Poile, L. Layman, "Coordination in large-scale software teams", CHASE 2009 (ICSE workshop). DOI 10.1109/CHASE.2009.5071401. <https://andrewbegel.com/papers/coordination-chase09.pdf>
34. L. Xavier, A. Brito, A. Hora, M. T. Valente, "Historical and impact analysis of API breaking changes: a large-scale study", SANER 2017. DOI 10.1109/SANER.2017.7884616. <https://repositorio.ufmg.br/handle/1843/JCES-ARMPK6>
35. R. G. Kula, D. M. German, A. Ouni, T. Ishio, K. Inoue, "Do developers update their library dependencies?", *Empirical Software Engineering* 23(1), 2018. DOI 10.1007/s10664-017-9521-5. <https://doi.org/10.1007/s10664-017-9521-5>
36. B. Boehm et al., "Cost models for future software life cycle processes: COCOMO 2.0", *Annals of Software Engineering* 1, 1995; Fig. 6 reproduces R. W. Selby, "Empirically analyzing software reuse in a production environment" (1988), 2,954 NASA modules. <https://staff.emu.edu.tr/alexanderchefranov/Documents/CMPE412/Boehm1995%20COCOMO%202%20.pdf>
37. B. Ray, M. Kim, "A case study of cross-system porting in forked projects", FSE 2012. DOI 10.1145/2393596.2393659. <https://baishakhir.github.io/uploads/fse2012-bsd.pdf>
38. M. Mondal, C. K. Roy, K. A. Schneider, "Bug propagation through code cloning: an empirical study", ICSME 2017. <https://clones.usask.ca/pubfiles/articles/MondalICSME2017BugPropagation.pdf>
39. M. Mondal, B. Roy, C. K. Roy, K. A. Schneider, "An empirical study on bug propagation through code cloning", *Journal of Systems and Software* 158, 2019. DOI 10.1016/j.jss.2019.110407. <https://clones.usask.ca/pubfiles/articles/MMondalBugProposationJSS.pdf>
40. E. Juergens, F. Deissenboeck, B. Hummel, S. Wagner, "Do code clones matter?", ICSE 2009. DOI 10.1109/ICSE.2009.5070547. Preprint arXiv:1701.05472. <https://arxiv.org/abs/1701.05472>
41. M. R. Islam, M. F. Zibran, A. Nagpal, "Security vulnerabilities in categories of clones and non-cloned code: an empirical study", ESEM 2017. DOI 10.1109/ESEM.2017.9. <https://doi.org/10.1109/ESEM.2017.9>
42. S. Zhou, B. Vasilescu, C. Kästner, "How has forking changed in the last 20 years? A study of hard forks on GitHub", ICSE 2020. <https://www.cs.cmu.edu/~shuruiz/paper/icse20-hardfork.pdf>
43. J. Businge, M. Openja, S. Nadi, T. Berger, "Reuse and maintenance practices among divergent forks in three software ecosystems", *Empirical Software Engineering* 27, 2022. DOI 10.1007/s10664-021-10078-2. <https://doi.org/10.1007/s10664-021-10078-2>
44. C. J. Kapser, M. W. Godfrey, "'Cloning considered harmful' considered harmful: patterns of cloning in software", *Empirical Software Engineering* 13(6), 2008. DOI 10.1007/s10664-008-9076-6. <https://doi.org/10.1007/s10664-008-9076-6>
45. M. Kim, V. Sazawal, D. Notkin, G. C. Murphy, "An empirical study of code clone genealogies", ESEC/FSE 2005 (technical report version UW-CSE-05-04-01). <https://dada.cs.washington.edu/research/tr/2005/04/UW-CSE-05-04-01.pdf>
46. F. Rahman, C. Bird, P. Devanbu, "Clones: what is that smell?", *Empirical Software Engineering* 17, 2012. DOI 10.1007/s10664-011-9195-3. <https://doi.org/10.1007/s10664-011-9195-3>
47. S. Metz, "The wrong abstraction", blog post, 20 January 2016 (opinion). <https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction>
48. K. Pohl, G. Böckle, F. van der Linden, *Software Product Line Engineering*, Springer, 2005, Fig. 1.1. DOI 10.1007/3-540-28901-1. <https://doi.org/10.1007/3-540-28901-1>
49. GitClear, *AI Copilot Code Quality* report, 2025 (vendor analysis of 211 M changed lines, 2020–2024; read via press coverage).
50. M. Borg et al., "Echoes of AI: investigating the downstream effects of AI assistants on software maintainability", *Empirical Software Engineering* 31, 2026. DOI 10.1007/s10664-026-10889-1. Preprint arXiv:2507.00788. <https://arxiv.org/abs/2507.00788>
51. S. Pan et al., "Automating zero-shot patch porting for hard forks" (PPatHF), 2024, arXiv:2404.17964. <https://arxiv.org/abs/2404.17964>
