# Coût d'une Feature : Code Partagé vs Code Dupliqué

## Guide de données pour construire un calculateur de coûts

---

## 1. Modèles d'estimation du coût de développement

### 1.1 COCOMO II (Constructive Cost Model)

Le modèle COCOMO II est le standard industriel pour estimer l'effort de développement logiciel [[1]](https://en.wikipedia.org/wiki/COCOMO) [[2]](https://softwarecost.org/tools/COCOMO/). Il se base sur la taille du projet (en milliers de lignes de code, KSLOC) et des facteurs d'ajustement.

**Formule principale :**

```
Effort (Person-Months) = 2.94 × EAF × (KSLOC)^E
```

Où [[3]](https://docs.linuxfoundation.org/lfx/insights/v3-beta-version-current/getting-started/landing-page/cocomo-cost-estimation-simplified) :
- **EAF** (Effort Adjustment Factor) : dérivé des Cost Drivers (valeurs typiques : 0.9 à 1.4)
- **E** : exposant dérivé des 5 Scale Drivers
- **KSLOC** : milliers de lignes de code source

**Classification des projets** [[4]](https://www.geeksforgeeks.org/software-engineering/software-engineering-cocomo-model/) :

| Type | Description | Coefficient a | Exposant b |
|------|-------------|---------------|------------|
| Organique | Petite équipe, environnement bien compris | 2.4 | 1.05 |
| Semi-détaché | Équipe mixte, complexité modérée | 3.0 | 1.12 |
| Embarqué | Grande complexité, contraintes fortes | 3.6 | 1.20 |

**Calcul du temps de développement :**

```
Temps (mois) = 2.5 × (Effort)^(0.32 à 0.39)
```

**Calcul du nombre de personnes nécessaires :**

```
Personnes = Effort / Temps
```

### 1.2 Estimation par Story Points

Pour les équipes agiles, une approche alternative consiste à utiliser les story points :

```
Coût par story point = (Salaire moyen équipe × Durée sprint) / Vélocité moyenne
```

**Données de référence :**
- Vélocité moyenne d'une équipe de 5-7 devs : 30-50 story points par sprint de 2 semaines
- Coût moyen d'un story point (US) : 1 000 $ à 3 000 $ selon la séniorité

### 1.3 Coût des développeurs — Données France (2025-2026)

#### Salaires bruts annuels (CDI) [[35]](https://welovedevs.com/fr/salaires/developpeur-web) [[36]](https://www.journaldunet.com/business/salaire/developpeur/salaire-00419) [[37]](https://blog.adatechschool.fr/salaire-developpeur-web/)

| Séniorité | Salaire brut annuel (médian France) | Salaire brut annuel (Paris / Île-de-France) |
|-----------|-------------------------------------|---------------------------------------------|
| Junior (0-2 ans) | 33 000 - 40 000 € | 38 000 - 45 000 € |
| Mid-level (3-5 ans) | 40 000 - 50 000 € | 45 000 - 55 000 € |
| Senior (5-10 ans) | 50 000 - 65 000 € | 55 000 - 75 000 € |
| Lead / Staff (10+ ans) | 60 000 - 80 000 € | 70 000 - 95 000 € |

#### Coût chargé employeur (salariés CDI)

En France, les charges patronales représentent environ 42-45 % du salaire brut [[5]](https://www.dougs.fr/blog/charges-patronales/) [[6]](https://staffmatch.com/blog/fr/charges-patronales/) (assurance maladie, allocations familiales, retraite, chômage, etc.). Le coût employeur total ("super-brut") est donc :

```
Coût employeur ≈ Salaire brut × 1.42 à 1.45
```

| Séniorité | Salaire brut annuel | Coût employeur annuel | Coût horaire chargé (1 607h/an) |
|-----------|--------------------|-----------------------|---------------------------------|
| Junior | 36 000 € | 51 120 - 52 200 € | 32 - 33 €/h |
| Mid-level | 45 000 € | 63 900 - 65 250 € | 40 - 41 €/h |
| Senior | 58 000 € | 82 360 - 84 100 € | 51 - 52 €/h |
| Lead / Staff | 75 000 € | 106 500 - 108 750 € | 66 - 68 €/h |

**Note :** Le coût horaire chargé ci-dessus est basé sur 1 607 heures travaillées par an (base légale en France, 35h/semaine). Pour un coût "fully loaded" incluant aussi les outils, locaux, management overhead, on ajoute généralement 20-30 %, ce qui donne :

| Séniorité | Coût "fully loaded" horaire (estimation) |
|-----------|------------------------------------------|
| Junior | 38 - 43 €/h |
| Mid-level | 48 - 53 €/h |
| Senior | 61 - 68 €/h |
| Lead / Staff | 80 - 88 €/h |

#### TJM Freelance (Tarif Journalier Moyen) — France 2025

Alternative utile pour le calculateur si l'équipe utilise des prestataires externes [[7]](https://www.portage360.fr/tjm-developpeur-en-france/) [[8]](https://www.silkhom.com/barometre-des-tjm-informatique-electronique-digital/) [[9]](https://www.blogdumoderateur.com/freelances-taux-journaliers-moyens-it-france-2025/) :

| Profil | TJM moyen (province) | TJM moyen (Paris/IDF) |
|--------|----------------------|-----------------------|
| Junior (0-3 ans) | 300 - 400 €/jour | 350 - 450 €/jour |
| Confirmé (3-7 ans) | 400 - 550 €/jour | 450 - 650 €/jour |
| Senior (7+ ans) | 550 - 700 €/jour | 600 - 800 €/jour |
| Expert / Lead (10+ ans) | 700 - 900 €/jour | 750 - 1 000+ €/jour |

**Conversion TJM → coût horaire :** TJM / 7h (journée standard freelance) ou TJM / 8h selon la convention.

---

## 2. Coûts de maintenance logicielle

### 2.1 La maintenance comme pourcentage du TCO

La maintenance est le poste de dépense le plus important dans le cycle de vie d'un logiciel [[10]](https://www.scnsoft.com/software-development/maintenance-and-support/costs) [[11]](https://idealink.tech/blog/software-development-maintenance-true-cost-equation) [[12]](https://galorath.com/blog/software-maintenance-costs/) :

| Métrique | Valeur |
|----------|--------|
| Maintenance en % du TCO total | 50-80 % (jusqu'à 90 % pour les systèmes legacy) |
| Cloud-based apps | 30-60 % du TCO |
| On-premises / enterprise | 70-90 % du TCO |
| Embedded software | 65-80 % du TCO |
| Budget annuel de maintenance | 15-25 % du coût de développement initial |
| Coût sur la durée de vie (5 ans) | 2x à 4x le coût de développement initial |

**Répartition sur 5 ans** [[11]](https://idealink.tech/blog/software-development-maintenance-true-cost-equation) [[34]](https://www.techstep.io/articles/app-maintenance-cost-can-be-three-times-higher-than-development-cost) :
- Planning + Développement initial : ~21 % du coût total
- Maintenance et évolution : ~79 % du coût total

### 2.2 Types de maintenance et leur répartition [[12]](https://galorath.com/blog/software-maintenance-costs/) [[13]](https://maddevs.io/customer-university/software-maintenance-costs/)

| Type | % de l'effort de maintenance | Description |
|------|------------------------------|-------------|
| Corrective | 17-21 % | Correction de bugs |
| Adaptative | 18-25 % | Adaptation à l'environnement (OS, APIs, dépendances) |
| Perfective | 50-60 % | Nouvelles fonctionnalités, améliorations |
| Préventive | 4-5 % | Refactoring, optimisation proactive |

### 2.3 Coût des bugs selon la phase de détection

L'idée que le coût de correction d'un bug croît avec le temps dans le cycle de développement est largement acceptée dans l'industrie. Des études empiriques montrent que les défauts détectés plus tard nécessitent plus de travail de diagnostic, de correction et de re-test [[14]](https://www.functionize.com/blog/the-cost-of-finding-bugs-later-in-the-sdlc) [[15]](https://www.blackduck.com/blog/cost-to-fix-bugs-during-each-sdlc-phase.html).

**Ordres de grandeur réalistes (basés sur des données de l'industrie) :**

| Phase de détection | Coût relatif | Justification |
|--------------------|-------------|---------------|
| Spécifications / Design | 1x | Correction documentaire, pas de code à modifier |
| Implémentation | 3-5x | Modification de code + tests unitaires |
| QA / Testing | 5-10x | Diagnostic + correction + re-test + potentiel re-design |
| Production | 10-30x | Diagnostic en prod + hotfix + déploiement + impact utilisateurs |

**Note méthodologique :** Les ratios historiques souvent cités (1x→6x→15x→100x, attribués à "IBM Systems Sciences Institute") proviennent en réalité de notes de formation internes IBM de 1981 et non d'une étude de recherche publiée [[40]](https://www.theregister.com/2021/07/22/bugs_expense_bs/). Le principe général reste valide — corriger tard coûte plus cher — mais les multiplicateurs exacts varient considérablement selon le contexte.

**Données vérifiées sur la propagation de bugs dans le code dupliqué :** Une étude IEEE sur la propagation de bugs dans les clones de code montre que jusqu'à 33 % des fragments de code clonés qui subissent des corrections de bugs contiennent des bugs propagés (bugs identiques non corrigés dans les autres copies) [[41]](https://ieeexplore.ieee.org/document/8094424/) [[42]](https://www.sciencedirect.com/science/article/abs/pii/S0164121219301815).

**Implication pour la duplication :** Quand une feature est dupliquée, un bug trouvé dans une codebase doit être identifié et corrigé dans l'autre aussi. Les études empiriques confirment que cette propagation est un problème réel et fréquent, doublant potentiellement le coût de correction et augmentant le risque de régression.

---

## 3. Coûts spécifiques : Code Partagé (Shared Library / Monorepo)

### 3.1 Coûts initiaux (one-time)

| Poste de coût | Estimation |
|---------------|------------|
| Architecture et design de la librairie partagée | 2-4 semaines (1-2 seniors) |
| Configuration CI/CD pour le package | 1-2 semaines |
| Documentation API | 1-2 semaines |
| Setup monorepo ou registry privé (npm, PyPI, etc.) | 0.5-1 semaine |
| Tests unitaires et d'intégration de la lib | 1-2 semaines |
| **Total estimé setup** | **5-11 semaines d'effort dev senior** |

### 3.2 Coûts récurrents de maintenance

| Poste de coût | Fréquence | Effort estimé |
|---------------|-----------|---------------|
| Gestion des versions (semver, changelog) | À chaque release | 2-4h par release |
| Review des PRs sur la lib partagée | Continu | 5-10h/semaine |
| Résolution des conflits de merge | Variable | 2-8h/semaine |
| Migration des breaking changes | Trimestriel | 1-3 jours par consumer |
| Mise à jour des dépendances | Mensuel | 0.5-1 jour |
| Maintenance de la CI/CD | Mensuel | 0.5-1 jour |
| Support aux équipes consumers | Continu | 5-10h/semaine |

### 3.3 Coûts de coordination

| Facteur | Impact |
|---------|--------|
| Réunions de synchronisation inter-équipes | 2-4h/semaine par équipe |
| Négociation des interfaces/APIs | 1-2 jours par feature majeure |
| Revue de design conjointe | 0.5-1 jour par feature |
| Temps de coordination (étude ING) | 11-23 % du temps dev [[17]](https://andrewbegel.com/papers/coordination-chase09.pdf) |
| Interfaces de coordination (formule de Brooks) | n(n-1)/2 où n = nombre d'équipes |

### 3.4 Risques et coûts cachés

- **Couplage fort :** Les modifications de la lib partagée impactent tous les consumers. Un breaking change peut bloquer N équipes [[31]](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/monorepo-vs-multirepo).
- **Bottleneck de release :** La lib devient un point de contention pour les releases [[38]](https://kodus.io/en/monorepo-vs-multi-repo-strategy/).
- **Versioning hell :** Quand différentes équipes ont besoin de versions différentes simultanément [[39]](https://www.aviator.co/blog/what-is-a-monorepo-and-why-use-one/).
- **Complexité accrue :** Le code doit être suffisamment générique pour servir plusieurs cas d'usage, ce qui augmente la complexité (estimé +20-40 % de code par rapport à une implémentation spécifique) [[31]](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/monorepo-vs-multirepo) [[32]](https://livebook.manning.com/book/software-mistakes-and-tradeoffs/chapter-2).

---

## 4. Coûts spécifiques : Code Dupliqué

### 4.1 Coûts initiaux (one-time)

| Poste de coût | Estimation |
|---------------|------------|
| Développement de la feature (codebase A) | X semaines (baseline) |
| Adaptation et portage vers codebase B | 0.5X à 0.8X (50-80 % de l'effort initial) |
| Tests pour la codebase B | 0.6X à 1X de l'effort de test initial |
| Adaptation du design (points d'entrée, UI) | 0.2X à 0.4X |
| **Total estimé** | **1.7X à 2.2X d'une seule implémentation** |

### 4.2 Coûts récurrents de maintenance

| Poste de coût | Impact vs code unique |
|---------------|-----------------------|
| Correction de bugs | 2x (chaque bug doit être trouvé et fixé dans les 2 codebases) |
| Évolutions fonctionnelles | 1.5x à 2x (implémentation double) |
| Tests de régression | 2x (suites de tests séparées) |
| Revue de code | 2x (PRs dans 2 repos) |
| Monitoring et alerting | 2x (systèmes séparés) |
| Documentation | 1.5x à 2x |

### 4.3 Risques et coûts cachés de la duplication

- **Divergence fonctionnelle :** Au fil du temps, les deux copies divergent, créant des incohérences UX et des bugs spécifiques à chaque version [[20]](https://www.graphapp.ai/blog/the-hidden-costs-of-duplicate-code-in-software-engineering).
- **Perte de connaissance :** L'équipe qui maintient la copie B peut ne pas comprendre les décisions initiales de la copie A [[32]](https://livebook.manning.com/book/software-mistakes-and-tradeoffs/chapter-2).
- **Double effort de test :** Chaque feature, chaque bug fix nécessite des tests dans les deux codebases [[21]](https://idealink.tech/blog/understanding-software-testing-costs-development-breakdown).
- **Synchronisation manuelle :** Le suivi des différences entre les deux versions nécessite un effort constant d'inventaire et de comparaison [[19]](https://linearb.io/blog/code-duplication).
- **Code churn accru :** Les métriques de code churn doublent, augmentant la probabilité de bugs [[29]](https://getdx.com/blog/technical-debt-ratio/).

**Métrique de référence :** Une étude IEEE sur 4 projets open source Java montre que jusqu'à 33 % des fragments de code clonés qui subissent des corrections de bugs contiennent des bugs propagés (i.e. le même bug non corrigé dans les autres copies) [[41]](https://ieeexplore.ieee.org/document/8094424/) [[42]](https://www.sciencedirect.com/science/article/abs/pii/S0164121219301815). De plus, le clonage de code multiplie les vulnérabilités de sécurité [[45]](https://dl.acm.org/doi/abs/10.1109/ESEM.2017.9). Concrètement, la duplication augmente significativement le risque de défauts car les corrections ne sont pas toujours propagées uniformément [[18]](https://www.software.com/engineering-metrics/code-duplication) [[19]](https://linearb.io/blog/code-duplication).

---

## 5. Coûts organisationnels et transversaux

### 5.1 Product Management

| Activité | Shared Code | Duplicated Code |
|----------|-------------|-----------------|
| Planification du backlog | 1x (backlog unifié pour la feature) | 1.3x-1.5x (coordination de 2 backlogs) |
| Spécifications | 1x + surcoût de généralisation (+20 %) | 1.5x-2x (specs adaptées par codebase) |
| Suivi des releases | Complexe (dépendances inter-repos) | Simple mais double (2 releases indépendantes) |
| Gestion des incidents | 1x (source unique) | 1.5x-2x (investigation dans 2 codebases) |

### 5.2 Design / UX

| Activité | Shared Code | Duplicated Code |
|----------|-------------|-----------------|
| Design system | 1x (composants réutilisés) | 1x initial puis divergence progressive |
| User research | 1x (feature identique) | 1x-1.2x (contextes différents) |
| Itérations design | 1x + coût de négociation | 1.5x-2x (itérations indépendantes) |
| Cohérence UX long terme | Garantie par le code partagé | Dégradation progressive (effort de sync) |

### 5.3 QA / Testing

| Métrique | Valeur de référence |
|----------|---------------------|
| QA en % de l'effort de développement | 20-30 % (standard), 40-50 % (systèmes critiques) [[21]](https://idealink.tech/blog/understanding-software-testing-costs-development-breakdown) [[22]](https://intersog.com/blog/development/software-testing-percent-of-software-development-costs/) |
| Ratio testeurs/développeurs | 1 testeur pour 3-4 développeurs [[23]](https://hypersense-software.com/blog/2025/07/19/software-development-effort-allocation-dev-qa-design-pm-ratio/) |
| Réduction de bugs avec code review | -10 % de temps sur les bugs [[24]](https://blog.codacy.com/10-facts-about-code-reviews-and-quality) |
| Coût de la code review | 12.5 % du temps dev (5h/semaine/dev en moyenne) [[25]](https://coralogix.com/blog/this-is-what-your-developers-are-doing-75-of-the-time-and-this-is-the-cost-you-pay/) [[33]](https://engineering.fb.com/2022/11/16/culture/meta-code-review-time-improving/) |

### 5.4 Onboarding et turnover

| Métrique | Valeur |
|----------|--------|
| Temps avant productivité complète | 3-6 mois (sans structure), 8-12 semaines (avec onboarding structuré) [[26]](https://fullscale.io/blog/developer-onboarding-best-practices/) |
| Coût de productivité perdue par nouveau dev | ~30 000 - 40 000 € sur 6 semaines (France) [[26]](https://fullscale.io/blog/developer-onboarding-best-practices/) |
| Impact sur la vélocité de l'équipe | -25 à -40 % pendant l'intégration [[26]](https://fullscale.io/blog/developer-onboarding-best-practices/) |
| Perte de productivité des mentors | -30 % pendant l'onboarding [[27]](https://about.gitlab.com/the-source/platform/how-to-accelerate-developer-onboarding-and-why-it-matters/) |
| Coût de remplacement d'un dev (France) | 50 000 - 100 000 € (recrutement + onboarding + productivité perdue) [[28]](https://www.growin.com/blog/developer-retention-costs-onboarding/) |

**Impact pour le calculateur :** Avec du code dupliqué, un nouveau développeur doit comprendre les deux implémentations et leurs différences. Avec du code partagé, il n'apprend qu'une seule implémentation mais doit comprendre le système de partage.

---

## 6. Dette technique

### 6.1 Métriques quantitatives

| Métrique | Formule / Valeur | Cible idéale |
|----------|------------------|--------------|
| Technical Debt Ratio (TDR) | Coût de correction / Coût de reconstruction [[29]](https://getdx.com/blog/technical-debt-ratio/) | ≤ 5 % |
| Code Churn | (Lignes ajoutées + supprimées) / Total lignes × 100 [[29]](https://getdx.com/blog/technical-debt-ratio/) | < 15 % par sprint |
| Temps passé sur la dette technique | % du temps dev consacré à la dette + mauvais code | 42 % (13.5h dette + 3.8h bad code sur 41.1h/semaine, Stripe Developer Coefficient 2018) [[43]](https://stripe.com/files/reports/the-developer-coefficient.pdf) |
| Coût pour l'économie US (2022, CISQ) | 2 410 milliards $ (dont 1 520 milliards $ de dette technique seule) [[44]](https://www.it-cisq.org/the-cost-of-poor-quality-software-in-the-us-a-2022-report/) | — |

### 6.2 Impact de la duplication sur la dette technique

La duplication de code est l'un des principaux contributeurs à la dette technique :

```
Dette technique (duplication) = Nb_lignes_dupliquées × Coût_correction_par_ligne × Facteur_divergence
```

Où :
- **Facteur_divergence** augmente avec le temps (1.0 au début, peut atteindre 3.0-5.0 après 2 ans)
- **Coût_correction_par_ligne** : 1-5 $ par ligne de code (dépend de la complexité)

---

## 7. Formules pour le calculateur — Explications détaillées

Cette section décompose chaque formule de manière verbeuse avec le raisonnement derrière chaque composant, des exemples chiffrés concrets, et des conseils d'implémentation pour le calculateur.

---

### 7.1 Coût total — Approche Code Partagé

#### Vue d'ensemble

L'idée de cette formule est de capturer la totalité du coût lorsqu'on choisit de créer une librairie (ou un package, ou un module dans un monorepo) qui sera consommée par plusieurs codebases. Ce choix implique un investissement initial plus lourd (il faut concevoir du code générique, documenter une API, mettre en place de l'outillage), mais on en récolte les bénéfices sur la durée parce que toute correction ou évolution n'a lieu qu'une seule fois.

#### Formule

```
Coût_Partagé_Total = Coût_Dev_Initial
                   + Coût_Setup_Lib
                   + Σ(Coût_Maintenance_Annuel × Année)
                   + Coût_Coordination_Annuel × Nb_Années
                   + Coût_Onboarding × Nb_Nouveaux_Devs
```

#### Décomposition de chaque terme

**1. Coût_Dev_Initial — Le développement de la feature elle-même**

```
Coût_Dev_Initial = Nb_Devs × Coût_Horaire × Heures_Dev × Facteur_Généralisation
```

Ce terme représente le coût pour développer la feature dans sa version "partageable". Le `Facteur_Généralisation` (typiquement 1.2 à 1.4, valeur par défaut recommandée : 1.3) reflète le surcoût pour rendre le code suffisamment abstrait et configurable pour fonctionner dans plusieurs contextes. Concrètement, cela signifie que là où un développeur écrirait du code "en dur" adapté à un seul cas d'usage, il doit maintenant :

- Créer des interfaces/abstractions pour les points de variation (points d'entrée, affichage des données, etc.)
- Ajouter des options de configuration pour couvrir les différences entre les codebases cibles
- Écrire des tests plus exhaustifs qui couvrent les différentes combinaisons de configuration
- Documenter l'API publique de manière claire pour les équipes consommatrices

**Exemple chiffré (contexte France) :**
Imaginons une feature qui prendrait 400 heures à développer de manière spécifique (2 devs seniors pendant 5 semaines). Avec un coût horaire "fully loaded" de 65 €/h (senior en France) :
- Version spécifique : 400h × 65 € = 26 000 €
- Version partageable : 400h × 65 € × 1.3 = 33 800 €
- Le surcoût de généralisation est donc de 7 800 €, mais c'est un investissement qui sera amorti sur la durée.

**2. Coût_Setup_Lib — La mise en place de l'infrastructure de partage**

```
Coût_Setup_Lib = Nb_Semaines_Setup × 40h × Coût_Horaire_Senior
```

C'est le coût "one-time" pour créer toute l'infrastructure technique nécessaire au partage. Ce n'est pas du développement de la feature en elle-même, c'est le travail d'outillage autour. Cela comprend :

- **Configuration du repository / monorepo** (0.5-1 semaine) : Mise en place de la structure du package, configuration de l'outil de build (Webpack, Rollup, esbuild...), définition des entry points, configuration du tree-shaking, etc.
- **Pipeline CI/CD** (1-2 semaines) : Tests automatisés sur chaque PR, publication automatique des nouvelles versions, gestion des environnements de staging, vérification de compatibilité avec les consumers.
- **Documentation** (1-2 semaines) : README, guide d'intégration, documentation de l'API (JSDoc, Storybook pour les composants UI, etc.), exemples d'utilisation.
- **Versioning et registry** (0.5-1 semaine) : Configuration du semantic versioning, mise en place du changelog automatique, publication sur un registry privé (npm private, Artifactory, etc.).
- **Tests d'intégration** (1-2 semaines) : Tests qui vérifient que la lib fonctionne correctement dans le contexte de chaque codebase consommatrice.

**Exemple chiffré (contexte France) :**
Pour un setup typique de 8 semaines avec un dev senior à 65 €/h (fully loaded) :
- Coût_Setup_Lib = 8 × 35h × 65 = 18 200 €
- (Note : 35h/semaine en France, base légale)
- Ce coût n'est payé qu'une seule fois, au début du projet.

**3. Coût_Maintenance_Annuel — L'entretien courant de la librairie partagée**

```
Coût_Maintenance_Annuel = (Coût_Dev_Initial × Taux_Maintenance)
                        + Coût_Versioning_Annuel
                        + Coût_Support_Consumers_Annuel
```

La maintenance annuelle d'une librairie partagée a trois composantes :

- **Taux_Maintenance** (0.15 à 0.25) : C'est le pourcentage du coût de développement initial qu'on dépense chaque année pour maintenir le code (corrections de bugs, mises à jour de dépendances, améliorations de performance, refactoring préventif). Les données de l'industrie montrent que la maintenance coûte 15-25 % du développement initial par an [[10]](https://www.scnsoft.com/software-development/maintenance-and-support/costs) [[12]](https://galorath.com/blog/software-maintenance-costs/). Pour une librairie partagée, on est plutôt dans le bas de la fourchette (0.15-0.18) parce qu'il n'y a qu'une seule base de code à maintenir.

- **Coût_Versioning_Annuel** : Le temps passé à gérer les releases. Si on fait 12 releases par an (une par mois), avec 3h de travail par release (mise à jour du changelog, bump de version, vérification des tests, communication aux consumers) :
  ```
  Coût_Versioning_Annuel = 12 × 3h × 65 €/h = 2 340 €/an
  ```

- **Coût_Support_Consumers_Annuel** : Le temps passé à aider les équipes consommatrices à intégrer les nouvelles versions, résoudre des problèmes d'utilisation, répondre aux questions. Typiquement 5-10h par semaine :
  ```
  Coût_Support = 7.5h × 52 × 65 = 25 350 €/an
  ```

**Exemple chiffré complet (France) :**
```
Coût_Maintenance_Annuel = (33 800 × 0.18) + 2 340 + 25 350
                        = 6 084 + 2 340 + 25 350
                        = 33 774 €/an
```

**4. Coût_Coordination_Annuel — Le prix de la synchronisation inter-équipes**

```
Coût_Coordination_Annuel = Nb_Équipes × Heures_Coordination_Semaine × 52 × Coût_Horaire_Moyen
```

C'est le coût le plus souvent sous-estimé. Quand plusieurs équipes partagent du code, elles doivent se coordonner. Cela se manifeste par :

- **Réunions de synchronisation** : Typiquement 1-2h par semaine par équipe pour discuter des évolutions de la lib, des breaking changes à venir, des priorités.
- **Négociation des interfaces** : Quand une équipe a besoin d'une nouvelle fonctionnalité dans la lib qui pourrait impacter l'autre équipe. Cela nécessite des discussions de design, des compromis, parfois des POCs.
- **Gestion des conflits de priorité** : L'équipe A a besoin d'un changement urgent mais l'équipe B n'est pas prête à absorber l'impact. Il faut négocier, planifier, parfois faire des contournements temporaires.

La formule de Brooks nous dit que le nombre d'interfaces de communication croît de manière quadratique : n(n-1)/2 [[17]](https://andrewbegel.com/papers/coordination-chase09.pdf). Avec 2 équipes, c'est 1 interface. Avec 3 équipes, c'est 3. Avec 5 équipes, c'est 10.

**Exemple chiffré (France) :**
Avec 2 équipes, 3h de coordination par semaine par équipe, à 65 €/h :
```
Coût_Coordination = 2 × 3 × 52 × 65 = 20 280 €/an
```

**5. Coût_Onboarding — Le coût d'intégration des nouveaux développeurs**

```
Coût_Onboarding = Nb_Nouveaux_Devs × (Heures_Formation_Lib × Coût_Horaire_Nouveau
                + Heures_Mentorat × Coût_Horaire_Mentor)
```

Chaque nouveau développeur doit comprendre non seulement la feature, mais aussi le système de partage (comment publier, versionner, tester la lib). Typiquement, cela ajoute 1-2 semaines au processus d'onboarding standard [[26]](https://fullscale.io/blog/developer-onboarding-best-practices/) [[27]](https://about.gitlab.com/the-source/platform/how-to-accelerate-developer-onboarding-and-why-it-matters/).

**Exemple chiffré (France) :**
Pour 3 nouveaux devs par an, avec 60h de formation (coût mid-level 50 €/h) et 20h de mentorat (coût senior 65 €/h) :
```
Coût_Onboarding = 3 × (60 × 50 + 20 × 65) = 3 × (3 000 + 1 300) = 12 900 €/an
```

#### Coût total annuel de l'approche Code Partagé — Exemple récapitulatif (France)

| Poste | Année 0 (setup) | Année 1 | Année 2 | Année 3 |
|-------|-----------------|---------|---------|---------|
| Dev initial | 33 800 € | — | — | — |
| Setup lib | 18 200 € | — | — | — |
| Maintenance | — | 33 774 € | 33 774 € | 33 774 € |
| Coordination | — | 20 280 € | 20 280 € | 20 280 € |
| Onboarding | — | 12 900 € | 12 900 € | 12 900 € |
| **Total cumulé** | **52 000 €** | **118 954 €** | **185 908 €** | **252 862 €** |

---

### 7.2 Coût total — Approche Code Dupliqué

#### Vue d'ensemble

Avec cette approche, on développe la feature dans la codebase A, puis on la "porte" (copie et adapte) dans la codebase B. Il n'y a pas de mécanisme formel de partage : chaque codebase vit sa propre vie. C'est plus rapide à mettre en place au départ, mais le coût de maintenance augmente avec le temps à cause de la divergence progressive entre les deux copies.

#### Formule

```
Coût_Dupliqué_Total = Coût_Dev_Initial × (1 + Facteur_Portage)
                    + Σ(Coût_Maintenance_Annuel_Dupliqué × Année)
                    + Coût_Sync_Annuel × Nb_Années
                    + Coût_Bugs_Supplémentaires × Nb_Années
```

#### Décomposition de chaque terme

**1. Coût_Dev_Initial × (1 + Facteur_Portage) — Le développement dans les deux codebases**

```
Coût_Dev_Dupliqué = Coût_Dev_Base × (1 + Facteur_Portage)
```

Le `Facteur_Portage` (typiquement 0.5 à 0.8) représente le pourcentage de l'effort initial nécessaire pour adapter et porter la feature dans la seconde codebase. Ce n'est pas un simple copier-coller : il faut adapter les points d'entrée, les conventions de code, les patterns d'architecture de la codebase cible, les tests, etc.

Pourquoi une fourchette de 0.5 à 0.8 et pas simplement 1.0 (le double) ?
- Le design est déjà fait (on ne re-réfléchit pas la logique métier)
- Les edge cases sont déjà identifiés
- Les tests peuvent être adaptés plutôt que réécrits de zéro
- MAIS il faut adapter le code aux conventions, patterns et dépendances de la codebase B

Plus les deux codebases sont différentes (frameworks différents, langages différents, architectures différentes), plus le facteur se rapproche de 0.8 ou même 1.0.

**Exemple chiffré (France) :**
Feature de base : 400h × 65 €/h = 26 000 €
Avec un facteur de portage de 0.65 (codebases assez similaires, même langage) :
```
Coût_Dev_Dupliqué = 26 000 × (1 + 0.65) = 26 000 × 1.65 = 42 900 €
```

**2. Coût_Maintenance_Annuel_Dupliqué — L'entretien de deux copies**

```
Coût_Maintenance_Annuel_Dupliqué = Coût_Maintenance_Base × Facteur_Double_Maintenance
```

Le `Facteur_Double_Maintenance` (typiquement 1.8 à 2.0) reflète le fait que maintenir deux copies n'est pas exactement le double du coût d'une seule. Il y a une légère économie parce que le diagnostic d'un problème dans la copie A donne souvent des indices pour la copie B. Mais cette économie s'érode avec le temps à mesure que les deux copies divergent.

On peut modéliser cela avec un facteur qui augmente :
```
Facteur_Double_Maintenance(année) = 1.8 + (0.05 × année)
```
Autrement dit, le facteur commence à 1.8 la première année et augmente de 0.05 chaque année (parce que les deux copies divergent de plus en plus, rendant la maintenance croisée plus difficile).

Concrètement, le `Coût_Maintenance_Base` est le coût de maintenance d'une seule copie, calculé comme :
```
Coût_Maintenance_Base = Coût_Dev_Base × Taux_Maintenance
```

Avec un `Taux_Maintenance` entre 0.20 et 0.30 (plus élevé que pour le code partagé parce qu'il n'y a pas de facteur de généralisation qui simplifie la maintenance).

**Exemple chiffré (France) :**
```
Coût_Maintenance_Base = 26 000 × 0.22 = 5 720 €/an (pour une seule copie)

Année 1 : 5 720 × 1.80 = 10 296 €
Année 2 : 5 720 × 1.85 = 10 582 €
Année 3 : 5 720 × 1.90 = 10 868 €
```

**3. Coût_Sync_Annuel — Le coût de garder les deux copies alignées**

```
Coût_Sync_Annuel = Nb_Features_Évoluées_Par_An × Heures_Sync_Par_Feature × Coût_Horaire
```

C'est le coût le plus insidieux de la duplication. Chaque fois qu'on fait évoluer la feature dans la codebase A, il faut se demander : "est-ce que ce changement doit aussi être appliqué dans la codebase B ?". Si oui, il faut :

- Comprendre le changement dans le contexte de A
- Adapter le changement au contexte de B (qui a peut-être divergé)
- Tester dans le contexte de B
- Faire une code review séparée pour B
- Déployer dans B

Le temps de synchronisation par feature augmente avec le temps parce que les deux copies divergent. On peut modéliser cela avec un facteur de divergence :

```
Heures_Sync_Par_Feature(année) = Heures_Sync_Base × (1 + Taux_Divergence)^année
```

Où `Taux_Divergence` est typiquement 0.15 à 0.30 par an (15-30 % de complexité supplémentaire chaque année pour synchroniser).

**Exemple chiffré (France) :**
Avec 8 évolutions par an, 16h de sync par évolution au départ, un taux de divergence de 0.20, à 65 €/h :
```
Année 1 : 8 × 16 × 1.20^1 × 65 = 8 × 19.2 × 65 = 9 984 €
Année 2 : 8 × 16 × 1.20^2 × 65 = 8 × 23.0 × 65 = 11 981 €
Année 3 : 8 × 16 × 1.20^3 × 65 = 8 × 27.6 × 65 = 14 377 €
```

On voit clairement l'accélération des coûts année après année.

**4. Coût_Bugs_Supplémentaires — Le prix de la duplication sur la qualité**

```
Coût_Bugs_Supplémentaires = Nb_Bugs_Base × Facteur_Duplication_Bugs × Coût_Moyen_Bug
```

Les études IEEE montrent que jusqu'à 33 % des clones de code corrigés contiennent des bugs propagés non corrigés dans les autres copies [[41]](https://ieeexplore.ieee.org/document/8094424/) [[42]](https://www.sciencedirect.com/science/article/abs/pii/S0164121219301815). Le clonage multiplie aussi les vulnérabilités de sécurité [[45]](https://dl.acm.org/doi/abs/10.1109/ESEM.2017.9). Cela s'explique par plusieurs mécanismes :

- **Propagation incomplète** : Un bug est corrigé dans A mais pas dans B (ou inversement). C'est le cas le plus fréquent.
- **Régression croisée** : La correction dans B introduit un nouveau bug parce que le contexte a divergé.
- **Faux sentiment de sécurité** : L'équipe pense que le bug a été corrigé partout alors qu'il ne l'a été que dans une codebase.

Le `Facteur_Duplication_Bugs` (1.5 à 3.0) dépend de la discipline de l'équipe et de la qualité du suivi entre les deux copies. En pratique :
- 1.5 : Équipe très disciplinée avec un processus formel de propagation des fixes
- 2.0 : Équipe moyenne avec un suivi informel
- 3.0 : Pas de processus de suivi, la propagation dépend de la mémoire individuelle

Le `Coût_Moyen_Bug` dépend de la phase de détection (voir section 2.3). En production, un bug coûte en moyenne 5 000 à 15 000 $ à diagnostiquer, corriger, tester, déployer et communiquer [[14]](https://www.functionize.com/blog/the-cost-of-finding-bugs-later-in-the-sdlc) [[16]](https://deepsource.com/blog/exponential-cost-of-fixing-bugs).

**Exemple chiffré (France) :**
Pour une estimation réaliste, on sépare les bugs par sévérité. Les coûts de correction en France sont plus bas qu'aux US mais restent significatifs :
```
Coût_Bugs_Supp = (Nb_Bugs_Critiques × Coût_Bug_Critique)
               + (Nb_Bugs_Majeurs × Coût_Bug_Majeur)
               + (Nb_Bugs_Mineurs × Coût_Bug_Mineur)
```

Avec par exemple :
- 2 bugs critiques × 10 000 € = 20 000 € (hotfix, rollback, astreinte, communication)
- 6 bugs majeurs × 3 500 € = 21 000 € (diagnostic + correction + tests + review + déploiement)
- 12 bugs mineurs × 800 € = 9 600 € (correction simple + tests)
- **Total : 50 600 €/an**

#### Coût total annuel de l'approche Code Dupliqué — Exemple récapitulatif (France)

| Poste | Année 0 (dev) | Année 1 | Année 2 | Année 3 |
|-------|---------------|---------|---------|---------|
| Dev initial (A + B) | 42 900 € | — | — | — |
| Maintenance (2 copies) | — | 10 296 € | 10 582 € | 10 868 € |
| Synchronisation | — | 9 984 € | 11 981 € | 14 377 € |
| Bugs supplémentaires | — | 50 600 € | 50 600 € | 50 600 € |
| **Total cumulé** | **42 900 €** | **113 780 €** | **186 943 €** | **262 788 €** |

---

### 7.3 Formule de point de croisement (break-even)

#### Vue d'ensemble

Le code partagé coûte plus cher au départ (investissement dans l'infrastructure de partage) mais moins cher sur la durée (maintenance unique, pas de synchronisation). Le code dupliqué coûte moins cher au départ mais les coûts accélèrent avec le temps. Le point de croisement (break-even) est le moment où le coût cumulé du code partagé devient inférieur à celui du code dupliqué.

#### Formule

```
Nb_Mois_Break_Even = (Coût_Setup_Lib + Surcoût_Généralisation) /
                      (Économie_Maintenance_Mensuelle - Coût_Coordination_Mensuel)
```

Détaillons chaque composant :

- **Coût_Setup_Lib** : L'investissement initial pour mettre en place l'infrastructure de partage (calculé en 7.1).
- **Surcoût_Généralisation** : La différence entre le coût de développement d'une feature partageable et celui d'une feature spécifique. C'est `Coût_Dev_Initial × (Facteur_Généralisation - 1)`.
- **Économie_Maintenance_Mensuelle** : Combien on économise chaque mois en n'ayant qu'une seule copie à maintenir au lieu de deux. C'est `(Coût_Maintenance_Dupliqué - Coût_Maintenance_Partagé) / 12`.
- **Coût_Coordination_Mensuel** : Le surcoût mensuel de coordination qu'on paie pour le partage et qu'on ne paierait pas avec du code dupliqué. C'est `Coût_Coordination_Annuel / 12`.

La formule ne fonctionne (le break-even existe) que si l'économie de maintenance est supérieure au coût de coordination. Sinon, le code partagé ne devient jamais rentable — c'est un signal que la feature est trop petite ou que le coût de coordination est trop élevé pour justifier le partage.

**Exemple chiffré (avec les données françaises précédentes) :**
```
Surcoût_Généralisation = 33 800 - 26 000 = 7 800 €
Coût_Setup_Lib = 18 200 €

Économie_Maintenance_Annuelle (année 1) = (10 296 + 9 984 + 50 600) - 33 774 = 37 106 €
Économie_Maintenance_Mensuelle = 37 106 / 12 = 3 092 €/mois

Coût_Coordination_Mensuel = 20 280 / 12 = 1 690 €/mois

Nb_Mois_Break_Even = (18 200 + 7 800) / (3 092 - 1 690)
                   = 26 000 / 1 402
                   ≈ 18.5 mois
```

Dans cet exemple, le code partagé devient rentable après environ 18-19 mois (~1 an et demi).

**Facteurs qui raccourcissent le break-even :**
- Feature de grande taille (plus d'économies de maintenance)
- Haute fréquence d'évolution (plus de synchronisation évitée)
- Bugs fréquents en production (coûts de bugs supplémentaires évités)
- Plus de 2 codebases consumers

**Facteurs qui allongent le break-even :**
- Feature petite et stable (peu de maintenance)
- Équipes très indépendantes (coordination coûteuse)
- Codebases très différentes (généralisation difficile)
- Feature en fin de vie (peu de temps pour amortir)

---

### 7.4 Facteur d'échelle — L'effet multiplicateur du nombre de consumers

#### Vue d'ensemble

Le vrai avantage du code partagé se révèle quand le nombre de codebases consommatrices augmente. Avec du code dupliqué, chaque nouvelle codebase multiplie les coûts de manière quasi-linéaire. Avec du code partagé, le coût marginal de chaque nouveau consumer est bien plus faible.

#### Formule

```
Ratio_Avantage(N) = Coût_Total_Dupliqué(N) / Coût_Total_Partagé(N)
```

Que l'on peut décomposer comme :

```
Coût_Total_Dupliqué(N) = Coût_Dev_Base + (N-1) × Coût_Dev_Base × Facteur_Portage
                        + N × Coût_Maintenance_Unitaire × Nb_Années

Coût_Total_Partagé(N) = Coût_Dev_Base × Facteur_Généralisation + Coût_Setup_Lib
                       + Coût_Maintenance_Lib × Nb_Années
                       + N × Coût_Intégration_Unitaire × Nb_Années
                       + Coût_Coordination(N) × Nb_Années
```

Où `Coût_Intégration_Unitaire` est le faible coût pour intégrer la lib dans une nouvelle codebase (typiquement 5-10 % du coût de portage).

Le ratio devient clairement favorable au partage (> 1.5) quand N ≥ 3 dans la plupart des scénarios.

**Exemple avec N = 2, 3, et 5 codebases (coûts sur 3 ans, contexte France) :**

| N codebases | Coût dupliqué (3 ans) | Coût partagé (3 ans) | Ratio |
|-------------|----------------------|---------------------|-------|
| 2 | 262 788 € | 252 862 € | 1.04 |
| 3 | 438 000 € | 280 000 € | 1.56 |
| 5 | 790 000 € | 320 000 € | 2.47 |

On voit que l'avantage du code partagé s'accélère avec le nombre de consumers. À 5 codebases, le code dupliqué coûte 2.5 fois plus cher.

---

### 7.5 Formule bonus : Coût de la divergence dans le temps

Un aspect crucial pour le calculateur est de modéliser comment le coût de la duplication croît dans le temps. On peut le faire avec une courbe exponentielle :

```
Coût_Divergence(t) = Coût_Sync_Base × e^(Taux_Divergence × t)
```

Où :
- `t` est le temps en années
- `Taux_Divergence` est typiquement 0.15 à 0.30
- `Coût_Sync_Base` est le coût de synchronisation de la première année

Cette formule capture le fait que la divergence n'est pas linéaire : les deux codebases accumulent des différences qui se composent. Chaque différence rend les futures synchronisations plus complexes, créant un effet boule de neige.

**Exemple (France) avec Coût_Sync_Base = 8 500 €/an et Taux_Divergence = 0.20 :**
```
Année 1 : 8 500 × e^(0.20 × 1) = 10 382 €
Année 2 : 8 500 × e^(0.20 × 2) = 12 680 €
Année 3 : 8 500 × e^(0.20 × 3) = 15 488 €
Année 5 : 8 500 × e^(0.20 × 5) = 23 106 €
```

Au bout de 5 ans, le coût de synchronisation a presque triplé par rapport à la première année. C'est un argument fort pour montrer que la duplication n'est viable que pour des features à durée de vie courte.

---

## 8. Variables d'entrée recommandées pour le calculateur

### 8.1 Paramètres de l'équipe

- Nombre de développeurs
- Coût horaire moyen (chargé)
- Séniorité moyenne de l'équipe
- Taux de turnover annuel
- Nombre d'équipes impliquées

### 8.2 Paramètres de la feature

- Taille estimée (story points ou KLOC)
- Complexité (simple, modérée, complexe)
- Nombre de codebases cibles
- Pourcentage de code commun vs spécifique (%)
- Fréquence d'évolution prévue (features/trimestre)

### 8.3 Paramètres temporels

- Horizon de calcul (en années)
- Durée du sprint
- Temps estimé de développement initial

### 8.4 Paramètres organisationnels

- Méthodologie (Agile, Waterfall, hybride)
- Niveau de maturité CI/CD (1-5)
- Qualité de la documentation existante (1-5)
- Couverture de tests existante (%)

---

## 9. Tableau comparatif synthétique

| Dimension | Code Partagé | Code Dupliqué |
|-----------|-------------|---------------|
| **Coût initial** | Plus élevé (+30-50 %) | Plus bas, mais double (~170-220 % d'une feature) |
| **Coût de maintenance annuel** | 15-25 % du dev initial | 30-50 % du dev initial (double maintenance) |
| **Coût de coordination** | Élevé (11-23 % du temps dev) | Faible si équipes indépendantes |
| **Risque de bugs** | 1x (source unique) | ~33 % des clones contiennent des bugs propagés [[41]](https://ieeexplore.ieee.org/document/8094424/) |
| **Cohérence fonctionnelle** | Garantie | Se dégrade avec le temps |
| **Flexibilité** | Limitée (couplage) | Élevée (indépendance totale) |
| **Scalabilité (N codebases)** | Linéaire (excellent) | N × coût (mauvais) |
| **Temps de mise sur le marché** | Plus long (setup initial) | Plus court initialement |
| **Onboarding** | Plus simple (1 source) | Plus complexe (N sources + différences) |
| **Break-even** | 6-18 mois | Jamais (coûts croissants) |

---

## 10. Sources

### Modèles de coût et estimation
- [COCOMO - Wikipedia](https://en.wikipedia.org/wiki/COCOMO)
- [COCOMO Model - GeeksforGeeks](https://www.geeksforgeeks.org/software-engineering/software-engineering-cocomo-model/)
- [COCOMO II - Constructive Cost Model](https://softwarecost.org/tools/COCOMO/)
- [Linux Foundation - COCOMO Cost Estimation](https://docs.linuxfoundation.org/lfx/insights/v3-beta-version-current/getting-started/landing-page/cocomo-cost-estimation-simplified)

### Coûts de maintenance
- [ScienceSoft - Software Maintenance Costs](https://www.scnsoft.com/software-development/maintenance-and-support/costs)
- [IdeaLink - Software Development vs Maintenance](https://idealink.tech/blog/software-development-maintenance-true-cost-equation)
- [MadDevs - Software Maintenance Costs](https://maddevs.io/customer-university/software-maintenance-costs/)
- [Galorath - Software Maintenance Cost](https://galorath.com/blog/software-maintenance-costs/)
- [TechStep - App Maintenance Cost](https://www.techstep.io/articles/app-maintenance-cost-can-be-three-times-higher-than-development-cost)
- [O'Reilly - The 60/60 Rule (97 Things Every Project Manager Should Know)](https://www.oreilly.com/library/view/97-things-every/9780596805425/ch34.html) — Source originale de la règle des 60 % de coûts en maintenance
- [NIH/PMC - Factors Affecting Software Projects Maintenance Cost](https://pmc.ncbi.nlm.nih.gov/articles/PMC3610582/) — Étude académique peer-reviewed

### Duplication de code et dette technique
- [Software.com - Code Duplication Metrics](https://www.software.com/engineering-metrics/code-duplication)
- [LinearB - Code Duplication](https://linearb.io/blog/code-duplication)
- [Graph AI - Hidden Costs of Duplicate Code](https://www.graphapp.ai/blog/the-hidden-costs-of-duplicate-code-in-software-engineering)
- [GetDX - Technical Debt Ratio](https://getdx.com/blog/technical-debt-ratio/)
- [SonarSource - Measuring Technical Debt](https://www.sonarsource.com/resources/library/measuring-and-identifying-code-level-technical-debt-a-practical-guide/)
- [Manning - Software Mistakes and Tradeoffs, Chapter 2](https://livebook.manning.com/book/software-mistakes-and-tradeoffs/chapter-2)
- [Stripe - The Developer Coefficient (2018)](https://stripe.com/files/reports/the-developer-coefficient.pdf) — Étude originale sur le temps perdu en dette technique
- [CISQ - Cost of Poor Software Quality in the US (2022)](https://www.it-cisq.org/the-cost-of-poor-quality-software-in-the-us-a-2022-report/) — Rapport officiel 2.41T$

### Études académiques sur la propagation de bugs dans le code cloné
- [IEEE - Bug Propagation through Code Cloning (2017)](https://ieeexplore.ieee.org/document/8094424/) — Étude empirique montrant ~33 % de bugs propagés dans les clones
- [ScienceDirect - Empirical study on bug propagation through code cloning (2019)](https://www.sciencedirect.com/science/article/abs/pii/S0164121219301815) — Version étendue de l'étude IEEE
- [ACM ESEM - Security vulnerabilities in cloned vs non-cloned code (2017)](https://dl.acm.org/doi/abs/10.1109/ESEM.2017.9) — Impact de la duplication sur les vulnérabilités de sécurité
- [SANER - Bug Replication in Code Clones (2016)](https://clones.usask.ca/pubfiles/articles/JudithSANER2016BugReplication.pdf) — Étude sur la réplication de bugs entre clones

### Monorepo vs Multirepo
- [ThoughtWorks - Monorepo vs Multi-repo](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/monorepo-vs-multirepo)
- [Kodus - Monorepo vs Multi-repo Strategy](https://kodus.io/en/monorepo-vs-multi-repo-strategy/)
- [Aviator - What is a Monorepo](https://www.aviator.co/blog/what-is-a-monorepo-and-why-use-one/)

### Coût des bugs
- [Functionize - Cost of Finding Bugs Later](https://www.functionize.com/blog/the-cost-of-finding-bugs-later-in-the-sdlc)
- [Black Duck - Cost to Fix Bugs per SDLC Phase](https://www.blackduck.com/blog/cost-to-fix-bugs-during-each-sdlc-phase.html)
- [DeepSource - Exponential Cost of Fixing Bugs](https://deepsource.com/blog/exponential-cost-of-fixing-bugs)
- [The Register - "Bugs 100x more expensive" study might not exist](https://www.theregister.com/2021/07/22/bugs_expense_bs/) — Enquête sur la source IBM contestée

### Effort de test et QA
- [IdeaLink - Software Testing Costs](https://idealink.tech/blog/understanding-software-testing-costs-development-breakdown)
- [Hypersense - Effort Allocation](https://hypersense-software.com/blog/2025/07/19/software-development-effort-allocation-dev-qa-design-pm-ratio/)
- [Intersog - Testing Percent of Costs](https://intersog.com/blog/development/software-testing-percent-of-software-development-costs/)

### Code review et productivité
- [Codacy - Facts About Code Reviews](https://blog.codacy.com/10-facts-about-code-reviews-and-quality)
- [Coralogix - Developer Time Allocation](https://coralogix.com/blog/this-is-what-your-developers-are-doing-75-of-the-time-and-this-is-the-cost-you-pay/)
- [Meta Engineering - Code Review Time](https://engineering.fb.com/2022/11/16/culture/meta-code-review-time-improving/)

### Onboarding et coût des équipes
- [FullScale - Developer Onboarding](https://fullscale.io/blog/developer-onboarding-best-practices/)
- [GitLab - Accelerate Developer Onboarding](https://about.gitlab.com/the-source/platform/how-to-accelerate-developer-onboarding-and-why-it-matters/)
- [Growin - Developer Retention Costs](https://www.growin.com/blog/developer-retention-costs-onboarding/)
- [FullScale - Team Capacity Planning](https://fullscale.io/blog/team-capacity-planning/)

### Coordination inter-équipes
- [Count - Cross-Team Dependency Analysis](https://count.co/metric/cross-team-dependency-analysis)
- [Minware - Tracking Cross-Team Dependencies](https://www.minware.com/blog/tracking-cross-team-dependencies)
- [Andrew Begel, Microsoft Research - Coordination in Large-Scale Software Teams](https://andrewbegel.com/papers/coordination-chase09.pdf)

### Salaires et coûts — France
- [Licorne Society - Salaire développeur en 2026](https://www.licornesociety.com/blog/salaire-developpeur)
- [WeLoveDevs - Salaire développeur junior 2025](https://welovedevs.com/fr/salaires/junior)
- [WeLoveDevs - Salaire développeur web 2025](https://welovedevs.com/fr/salaires/developpeur-web)
- [WeLoveDevs - Salaire développeur à Paris 2025](https://welovedevs.com/fr/salaires/paris)
- [Journal du Net - Salaire développeur](https://www.journaldunet.com/business/salaire/developpeur/salaire-00419)
- [Ada Tech School - Salaire développeur 2025 par niveau](https://blog.adatechschool.fr/salaire-developpeur-web/)
- [GEFOR - Salaire Développeur Web 2025 France](https://www.gefor.com/salaire-developpeur-web-en-france/)

### TJM Freelance — France
- [Portage360 - TJM Développeur en France 2025](https://www.portage360.fr/tjm-developpeur-en-france/)
- [Silkhom - Baromètre des TJM 2025 IT & Digital](https://www.silkhom.com/barometre-des-tjm-informatique-electronique-digital/)
- [RH Solutions - TJM freelances tech 2025](https://www.rh-solutions.com/le-grand-guide-du-portage/tjm-freelance-tech-2025/)
- [Blog du Modérateur - TJM freelances IT France 2025](https://www.blogdumoderateur.com/freelances-taux-journaliers-moyens-it-france-2025/)
- [Free-Work - TJM Développeur Fullstack](https://www.free-work.com/fr/tech-it/developpeur-fullstack/rate-tjm-freelance)

### Charges patronales et coût employeur — France
- [Dougs - Charges patronales 2026](https://www.dougs.fr/blog/charges-patronales/)
- [Staffmatch - Charges patronales 2025](https://staffmatch.com/blog/fr/charges-patronales/)
- [Watt Portage - Charges patronales France 2025-2026](https://www.watt-portage.fr/charges-patronales-en-2026)
- [HelloWork - Coût d'un salarié](https://www.hellowork.com/fr-fr/outil/salaire-brut-net/guides/calcul-salaire-brut-cout-employeur.html)
- [PayFit - Charges patronales 2026](https://payfit.com/fr/fiches-pratiques/charges-patronales/)

### Salaires et coûts — International (référence)
- [FullStack Labs - Software Development Price Guide 2025](https://www.fullstack.com/labs/resources/blog/software-development-price-guide-hourly-rate-comparison)
- [Glassdoor - Software Engineer Salary 2026](https://www.glassdoor.com/Salaries/software-engineer-salary-SRCH_KO0,17.htm)
