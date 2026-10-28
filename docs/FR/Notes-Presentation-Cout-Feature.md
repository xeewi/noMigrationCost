# Notes de Présentation — Coût Feature : Code Partagé vs Dupliqué

> Document de référence pour accompagner la présentation. Bullet points pour lecture rapide.
> Révisé en octobre 2026 après la revue théorique (`docs/revue-theorique-2026-10.md`). Tous les chiffres viennent du moteur du calculateur (`src/engine/formulas.ts`) avec ses valeurs par défaut.

---

## Scénario de référence (utilisé partout)

- **Équipe** : 1 junior, 2 confirmés, 1 senior → taux chargé moyen **40,50 €/h** (France 2026 : 32 / 40 / 50 / 62 €/h pour junior / confirmé / senior / lead)
- **Feature** : 40 story points, vélocité 10, sprints de 2 semaines → 4 sprints × 2 semaines × 35 h × 4 personnes = **1 120 heures-personnes**
- **Coût de build d'une copie** : C0 = 1 120 h × 40,50 € = **45 360 €**
- **2 apps, 5 ans, une nouvelle lib partagée à créer**
- **Valeurs par défaut** : généralisation G = 1,2, portage p = 0,65, intégration i = 0,2, entretien m = 20 %/an, entretien d'une copie supplémentaire e0 = 1,0, dérive δ = +0,05/an (plafond 1,5), coordination k = 4 %/an par app supplémentaire, nouvelle lib = 280 h de setup + 100 h/an de fonctionnement

---

## Slide 2 — Contexte : Pourquoi cette analyse ?

- **Question centrale** : quand une feature doit exister dans plusieurs apps, vaut-il mieux la partager (une lib) ou la copier-adapter dans chaque app ?
- **Chaque coût suit la taille de la feature** : chaque coût est une part de C0 = heures-personnes × taux chargé. Seuls le setup et le fonctionnement d'une nouvelle lib sont des heures fixes
- **Le taux horaire ne fait jamais basculer le verdict** : l'écart est proportionnel au taux (9 088 € à 32 €/h, 11 502 € à 40,50 €/h, 17 608 € à 62 €/h)
- **Pas dogmatique** : selon la taille, le nombre d'apps et l'horizon, l'une ou l'autre option gagne
- **Sources** : modèle de réutilisation COCOMO II, Krüger & Berger (FSE 2020), Ray & Kim (FSE 2012), Poulin, données de coût du travail France 2026. Chaque paramètre est marqué « mesuré » ou « hypothèse »

---

## Slide 3 — L'entretien est un coût récurrent

- Ordre de grandeur retenu : **~20 % du coût de build par copie et par an** (règle DoD, règle 60/60 de Glass, annual change traffic de Boehm)
- Une app, une copie, 5 ans : build 45 360 € + entretien 45 360 € → **l'entretien = la moitié du coût sur 5 ans**
- Le choix se joue donc surtout après la livraison : dans l'entretien des copies supplémentaires
- Les bugs ne sont pas chiffrés à part : les corriger fait partie de l'entretien. Il n'existe pas de donnée fiable pour chiffrer les « bugs propagés » seuls, et la règle 1-10-100 du coût par phase n'est pas soutenue par les données (Menzies et al., EMSE 2017 : aucun effet du délai sur 171 projets)

---

## Slide 4 — Coûts initiaux : à peu près égaux pour 2 apps

### Code partagé
- La construire une fois, pensée pour être partagée : **G = 1,2 × C0** (mesuré : RUSE de COCOMO II 1,07-1,24, Krüger & Berger médiane +20 %) → 54 432 €
- La brancher dans chaque autre app : **i = 20 % de C0** (Poulin, Krüger & Berger) → 9 072 €
- Monter une nouvelle lib (repo, CI, versioning, doc) : **280 h** (hypothèse ; 0 si la lib existe) → 11 340 €
- **Total initial : 74 844 €** (63 504 € si la lib existe déjà)

### Code dupliqué
- La construire pour la première app : C0 = 45 360 €
- La copier-adapter dans chaque autre app : **p = 65 % de C0** (mesuré : modèle de réutilisation COCOMO II 0,55-0,8, Selby/NASA) → 29 484 €
- **Total initial : 74 844 €**

### À retenir
- **Pour 2 apps avec une nouvelle lib, les coûts initiaux sont égaux.** Copier n'est pas moins cher au départ ; ce qui décide, c'est l'entretien récurrent des copies supplémentaires

---

## Slide 5 — Ce qui décide : l'entretien des copies supplémentaires

### Chaque copie s'entretient (e0 = 1,0)
- Chaque copie supplémentaire coûte à peu près autant d'entretien par an que la première : 20 % de C0, synchronisation et corrections propagées comprises
- Indice dans les données : entre forks BSD, 11 à 16 % des changements sont portés depuis le fork voisin, à un rythme stable (Ray & Kim, FSE 2012). La valeur exacte de e0 reste une hypothèse

### Les copies dérivent (δ = +0,05/an, plafond 1,5×)
- Hypothèse, sans donnée : l'entretien d'une copie supplémentaire augmente de 0,05 par an (1,0 l'année 1 → 1,2 l'année 5)
- Pas d'exponentielle : des copies qui divergent trop cessent simplement d'être synchronisées

### Le partage a aussi son entretien
- Entretien du code partagé : 20 % de 1,2 × C0 = **24 % de C0 par an**
- Coordination et montées de version cassantes : **k = 4 % de C0 par app supplémentaire et par an** (ordre de grandeur : Krüger & Berger ~5 % vs ~7 % d'effort de coordination ; Xavier 2017 : 14,8 % des changements d'API cassent la compatibilité)
- Faire tourner une nouvelle lib : **100 h/an** (hypothèse)

### Conclusion de la slide
- Coût annuel dans le scénario de référence :
  - Partagé : 10 886 € d'entretien + 1 814 € de coordination + 4 050 € de fonctionnement = **16 751 €/an**
  - Dupliqué : 9 072 € pour la première copie + 9 072 € → 10 886 € pour la copie supplémentaire = **18 144 € → 19 958 €/an**
- L'écart annuel est petit, mais il se paie chaque année et grandit avec le nombre d'apps

---

## Slide 6 — Projection sur 5 ans (scénario de référence)

### Tableau des coûts cumulés

| | Année 0 | Année 1 | Année 3 | Année 5 |
|---|---|---|---|---|
| **Code partagé** | 74 844 € | 91 595 € | 125 096 € | 158 598 € |
| **Code dupliqué** | 74 844 € | 92 988 € | 130 637 € | 170 100 € |
| **Écart** | 0 € | 1 393 € | 5 540 € | 11 502 € |

### Points clés à retenir
- **Année 0** : même coût initial
- Le partage n'est jamais plus cher, donc **il est rentable dès le départ (même coût de construction, moins cher chaque mois ensuite)**
- L'écart grandit un peu plus vite chaque année à mesure que les copies dérivent : **11 502 € après 5 ans (7 % du coût dupliqué)**
- **Avec une lib existante** : partagé 127 008 € vs dupliqué 170 100 € → **écart de 43 092 €**
- La marge est mince pour 2 apps : une généralisation plus chère (G ≥ 1,33) ou un entretien des copies moins cher (e0 < 0,75, seuil ≈ 0,746) fait basculer le verdict

---

## Slide 7 — Seuil de rentabilité : lu sur les mêmes courbes

- Seuil = **premier mois à partir duquel le partage reste moins cher jusqu'à l'horizon**, lu sur les mêmes courbes cumulées que l'écart (pas de formule à part)
- Scénario de référence : **mois 0** (même coût initial, entretien moins cher)
- Petite feature (140 h, nouvelle lib) : **jamais** sur 5 ans. Le partage coûte 47 466 € contre 21 263 € pour la duplication (2,2×), car les heures de setup et de fonctionnement de la lib écrasent la feature
- Portage bon marché (p = 0,4) : seuil atteint seulement au mois 60

### Ce qui favorise le partage
- Feature volumineuse (avec une nouvelle lib et 2 apps, le partage gagne au-delà de ~820 h sur 5 ans)
- Plus d'apps (avec 3 apps, le seuil tombe à ~340 h)
- Une lib partagée existe déjà (le partage gagne alors quelle que soit la taille, avec les valeurs par défaut)
- Horizon long

### Ce qui favorise la copie
- Petite feature, surtout s'il faut créer une nouvelle lib pour elle
- Horizon court (1 an : le partage a besoin de ~1 030 h pour gagner)
- Portage ou entretien des copies bon marché
- Généralisation coûteuse (apps très différentes)

---

## Slide 8 — Facteur d'échelle : l'avantage grandit avec le nombre d'apps

### Coût dupliqué / partagé sur 5 ans (nouvelle lib)
- **2 apps : 1,07×** → le partage économise ~11 500 €
- **3 apps : 1,41×** → le partage économise ~72 700 €
- **5 apps : 1,92×** → le partage économise ~195 200 €
- (10 apps : 2,65×, ~501 400 €)

### Pourquoi
- Chaque copie supplémentaire coûte 65 % du build au départ, puis une part entière d'entretien chaque année (et croissante)
- Chaque app supplémentaire sur une lib partagée coûte 20 % du build au départ, puis 4 %/an
- Pas de coordination en n(n−1)/2 : une lib qui sert N apps a environ N interfaces, pas N²

---

## Slide 9 — Contre-arguments : ce que les chiffres ne disent pas

### Les clones sont souvent inoffensifs
- Jusqu'à 71 % des clones jugés bénéfiques (Kapser & Godfrey 2008, 2 systèmes)
- 54 à 72 % des clones qui disparaissent le font en ~8 commits (Kim et al. 2005)
- Les clones ne sont pas plus sujets aux défauts (Rahman et al. 2012)

### La mauvaise abstraction
- « Duplication is far cheaper than the wrong abstraction » (Sandi Metz)
- Une copie qui doit évoluer différemment n'est pas un coût
- 49 % des ingénieurs Microsoft gèrent leurs problèmes de dépendances en supprimant des dépendances de code (Begel et al. 2009)

### Les breaking changes des libs partagées
- 14,8 % des changements d'API cassent la compatibilité et touchent 2,5 % des clients (Xavier et al., SANER 2017)
- 81,5 % des systèmes gardent des dépendances obsolètes (Kula et al. 2018)
- Le modèle ne le chiffre que via k = 4 %/an par app

### Hors modèle
- Time-to-market et goulot de release d'une lib partagée
- Divergence voulue entre apps
- Cohérence UX (un bénéfice du partage, non chiffré)
- Actualisation (VAN) : effet faible sur 5 ans

---

## Slide 10 — Mesuré vs hypothèse

### Mesuré (fourchettes publiées)
- Généralisation **G = 1,2** (RUSE de COCOMO II 1,07-1,24, Krüger & Berger ; plage 1,1-1,6)
- Portage **p = 0,65** (modèle de réutilisation COCOMO II 0,55-0,8, Selby/NASA)
- Intégration par app supplémentaire **i = 0,2** (Poulin, Krüger & Berger ≈ 0,2-0,33)
- Entretien **m = 20 %/an**, ordre de grandeur (règle DoD, Glass 60/60, ACT de Boehm)

### Hypothèses (pas de donnée solide)
- Entretien d'une copie supplémentaire e0 = 1,0 (Ray & Kim donnent un indice, pas une valeur)
- Dérive δ = +0,05/an, plafond 1,5×
- Coordination et montées de version k = 4 %/an par app supplémentaire (ordre de grandeur)
- Nouvelle lib : 280 h de setup, 100 h/an de fonctionnement

### Non chiffré
- Les bugs à part : pas de donnée fiable. La règle 1-10-100 n'est pas soutenue (Menzies et al. 2017)
- Le verdict est surtout sensible à G et e0 : les tester dans le calculateur avant de décider

---

## Slide 11 — Synthèse comparative

| Dimension | Code Partagé | Code Dupliqué |
|---|---|---|
| Coût initial | 120 % + 20 % par app supplémentaire (+ setup de la lib) | 100 % + 65 % par copie supplémentaire |
| Entretien annuel | 24 % + 4 % par app supplémentaire (+ fonctionnement de la lib) | 20 % + 20 % par copie supplémentaire, croissant |
| Corrections de bugs | Une fois, à un seul endroit | Dans chaque copie (inclus dans l'entretien) |
| Cohérence | Même code, même comportement | Peut dériver (parfois voulu) |
| Chaque app en plus | Peu coûteuse | Coûteuse |
| Seuil (réf.) | Dès le départ (égalité au build) | Gagne pour les petites features ou à court terme |
| Risque principal | Mauvaise abstraction, breaking changes | Corrections oubliées, dérive |

(Les pourcentages sont des parts de C0, le coût de construire la feature une fois.)

---

## Slide 12 — Recommandations : quand choisir quoi ?

### Privilégier le code partagé si :
- 3 apps ou plus ont besoin de la feature (ou sont prévues)
- La feature est volumineuse (2 apps et une nouvelle lib : au-delà de ~800 h)
- L'horizon est de plusieurs années
- Une lib partagée existe déjà
- Les apps doivent se comporter pareil
- La généralisation est peu coûteuse (G ≤ ~1,3)

### La copie peut être meilleure si :
- La feature est petite ou l'horizon court
- Une nouvelle lib serait créée pour cette seule feature
- Les copies sont censées diverger
- Les apps sont très différentes (généralisation coûteuse)
- Prototype ou MVP
- Les équipes ne peuvent pas coordonner leurs releases

### Message clé pour conclure
- **Pour 2 apps, les coûts initiaux sont à peu près égaux ; c'est l'entretien récurrent des copies supplémentaires qui décide**
- **L'avantage du partage grandit à chaque app**
- **Les petites features et les horizons courts favorisent la copie, surtout s'il faut créer une nouvelle lib**

---

## Chiffres clés à retenir (aide-mémoire)

| Indicateur | Valeur |
|---|---|
| Coût initial, 2 apps, nouvelle lib | 74 844 € chacun (égaux) |
| Écart sur 5 ans, scénario de référence | 11 502 € en faveur du partage (7 %) |
| Idem, lib existante | 43 092 € |
| Seuil, scénario de référence | Dès le départ (égalité au build) |
| Dupliqué / partagé à 3 / 5 apps (5 ans) | 1,41× / 1,92× |
| Taille minimale pour que le partage gagne (2 apps, nouvelle lib, 5 ans) | ~820 h |
| Petite feature (140 h, nouvelle lib) | La copie est 2,2× moins chère |
| Facteur de portage | 0,65 du build (mesuré) |
| Facteur de généralisation | 1,2 (mesuré) |
| Entretien | ~20 % du build par copie et par an |
