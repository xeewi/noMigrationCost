# Notes de Présentation — Coût Feature : Code Partagé vs Dupliqué

> Document de référence pour accompagner la présentation. Bullet points pour lecture rapide.

---

## Slide 2 — Contexte : Pourquoi cette analyse ?

- **Question centrale** : quand on développe une feature pour plusieurs codebases, vaut-il mieux partager le code (lib commune / monorepo) ou dupliquer (copier-adapter) ?
- **Impact financier massif** : la maintenance = 50-80% du coût total d'un logiciel → le choix initial conditionne le long terme
- **Pas dogmatique** : chaque approche a ses cas d'usage. L'objectif est de quantifier pour décider
- **Sources** : modèle COCOMO II, études IEEE sur la propagation de bugs, données salariales France 2025-2026

---

## Slide 3 — La maintenance domine le coût total

- **50-80% du coût total** d'un logiciel est de la maintenance (jusqu'à 90% pour les systèmes legacy)
- Sur 5 ans : **~21% dev initial** vs **~79% maintenance/évolution**
- Répartition de la maintenance :
  - Corrective (bugs) : 17-21%
  - Adaptative (environnement, OS, APIs) : 18-25%
  - Perfective (nouvelles features) : 50-60%
  - Préventive (refactoring) : 4-5%
- **Conclusion** : optimiser la maintenance a beaucoup plus d'impact que réduire le coût de dev initial
- Le budget annuel de maintenance = 15-25% du coût de développement initial
- Sur 5 ans, le coût total = 2x à 4x le dev initial

---

## Slide 4 — Coûts initiaux : l'investissement de départ

### Code partagé
- Dev initial + surcoût de généralisation : **+20-40% de code** pour rendre le code suffisamment abstrait
  - Créer des interfaces/abstractions
  - Options de configuration
  - Tests plus exhaustifs
  - Documentation API
- Setup infrastructure : **5-11 semaines** d'effort dev senior
  - Config repo/monorepo : 0.5-1 sem
  - Pipeline CI/CD : 1-2 sem
  - Documentation : 1-2 sem
  - Versioning/registry : 0.5-1 sem
  - Tests d'intégration : 1-2 sem
- **Exemple chiffré** : 33 800€ (dev) + 18 200€ (setup) = **~52 000€**

### Code dupliqué
- Dev codebase A : coût de base (ex: 26 000€)
- Portage codebase B : **+50-80%** de l'effort initial
  - Le design est déjà fait, les edge cases identifiés
  - MAIS il faut adapter aux conventions, patterns et deps de la codebase B
  - Plus les codebases diffèrent, plus le facteur est élevé
- **Exemple chiffré** : 26 000€ × 1.65 = **~43 000€**
- **Différence initiale : la duplication est ~20% moins chère au départ**

---

## Slide 5 — Le piège : des coûts de maintenance qui accélèrent

### Double maintenance (facteur 1.8x → 2.0x+)
- Chaque bug doit être trouvé et fixé dans les 2 codebases
- Chaque évolution fonctionnelle : implémentation double (1.5x-2x)
- Tests de régression : 2x (suites séparées)
- Code review : 2x (PRs dans 2 repos)
- Le facteur augmente de +0.05 par an car les copies divergent progressivement
- Monitoring et alerting : 2x (systèmes séparés)

### Synchronisation croissante (+20%/an d'augmentation)
- Coût de synchro exponentiel : chaque différence rend les futures synchros plus complexes
- Année 1 : ~10 000€ → Année 3 : ~14 400€ → Année 5 : ~23 000€
- Le coût triple en 5 ans (effet boule de neige / composé)
- À chaque évolution dans A, il faut : comprendre le changement → adapter à B (qui a divergé) → tester dans B → review séparée → déployer dans B

### Bugs propagés : 33% jamais corrigés dans l'autre copie
- **Étude IEEE sur 4 projets open source Java** : 1/3 des fragments de code clonés qui subissent des corrections de bugs contiennent des bugs propagés (= le même bug non corrigé dans les autres copies)
- Le clonage multiplie aussi les **vulnérabilités de sécurité** (ACM ESEM 2017)
- Mécanismes : propagation incomplète, régression croisée, faux sentiment de sécurité
- Estimation coût bugs supplémentaires : **~50 600€/an** (2 critiques + 6 majeurs + 12 mineurs)

### Conclusion slide
- **La duplication n'est viable que pour des features à durée de vie courte**

---

## Slide 6 — Comparaison chiffrée sur 3 ans (contexte France)

### Tableau des coûts cumulés

| | Année 0 | Année 1 | Année 2 | Année 3 |
|---|---|---|---|---|
| **Code partagé** | 52 000€ | 119 000€ | 186 000€ | 253 000€ |
| **Code dupliqué** | 43 000€ | 114 000€ | 187 000€ | 263 000€ |

### Points clés à retenir
- **Année 0** : la duplication est ~9 000€ moins chère (pas de setup lib)
- **Année 1** : les coûts cumulés sont quasi identiques (~5K€ de diff)
- **Année 2** : le croisement s'opère, la duplication commence à coûter plus
- **Année 3** : la duplication coûte ~10 000€ de plus — et **l'écart s'accélère ensuite**
- Au-delà de 3 ans, l'écart se creuse de manière exponentielle

### Hypothèses de calcul
- Feature de 400h de dev (2 seniors, 5 semaines)
- Coût horaire fully loaded : 65€/h (senior France)
- 2 équipes de consumers
- 8 évolutions par an
- Taux de divergence : 20%/an

---

## Slide 7 — Break-even : quand le partage devient rentable

- **Break-even typique : 6 à 18 mois**
- Dans l'exemple chiffré : **~18 mois** (1 an et demi)
- Calcul : surcoût initial (26 000€) / économie nette mensuelle (~1 400€/mois)
- L'économie mensuelle = économie maintenance (~3 100€) - coût coordination (~1 700€)

### Ce qui raccourcit le break-even
- Feature volumineuse (plus d'économies de maintenance)
- Haute fréquence d'évolution (plus de synchronisation évitée)
- Bugs fréquents en production (coûts de bugs supplémentaires évités)
- Plus de 2 codebases consumers → effet multiplicateur
- Équipes déjà dans un monorepo (setup allégé)

### Ce qui allonge le break-even
- Feature petite et stable (peu de maintenance nécessaire)
- Équipes très indépendantes (coordination coûteuse)
- Codebases très différentes (généralisation difficile, facteur 1.4+)
- Feature en fin de vie (peu de temps pour amortir)

### Point important
- Si l'économie de maintenance < coût de coordination → **le break-even n'existe jamais** = le partage n'est pas rentable pour cette feature

---

## Slide 8 — Facteur d'échelle : l'effet multiplicateur

### Ratio coût dupliqué / coût partagé sur 3 ans
- **2 codebases : ratio 1.04x** → quasi équivalent, léger avantage partage
- **3 codebases : ratio 1.56x** → le partage économise ~160 000€ sur 3 ans
- **5 codebases : ratio 2.47x** → la duplication coûte 2.5x plus cher

### Pourquoi cette accélération ?
- Code dupliqué : chaque nouvelle codebase = coût quasi-linéaire (portage + maintenance + synchro + bugs)
- Code partagé : chaque nouveau consumer = **seulement 5-10% du coût de portage** (intégration de la lib)
- La formule de Brooks s'applique à la coordination : n(n-1)/2 interfaces
  - 2 équipes = 1 interface, 3 équipes = 3, 5 équipes = 10
  - MAIS ce coût de coordination est largement compensé par les économies de maintenance

### Conclusion
- **À partir de 3 codebases, le partage est clairement gagnant**
- À 5 codebases, pas de débat possible

---

## Slide 9 — Impact organisationnel

### Onboarding
- Code partagé : le dev apprend 1 source + le système de partage → +1-2 sem au processus standard
- Code dupliqué : le dev doit comprendre les 2 implémentations ET leurs différences
- Temps avant productivité complète : 3-6 mois sans structure, 8-12 semaines avec onboarding structuré
- Coût de remplacement d'un dev en France : 50 000-100 000€ (recrutement + onboarding + productivité perdue)

### QA / Testing
- QA = 20-30% de l'effort dev en standard (40-50% pour systèmes critiques)
- **Duplication = double effort de test** (2 suites, 2 environnements, 2 pipelines)
- Code review : ~12.5% du temps dev (5h/semaine/dev). Avec duplication = doublé.

### Product Management
- Partagé : 1 backlog unifié + surcoût de généralisation des specs (+20%)
- Dupliqué : 1.3-1.5x effort de planification (2 backlogs à coordonner)
- Gestion des incidents : 1x (partagé) vs 1.5-2x (dupliqué, investigation dans 2 codebases)

### Cohérence UX
- Partagé : **garantie par le code** — même composant = même comportement
- Dupliqué : dégradation progressive et inévitable
  - Divergence fonctionnelle au fil du temps
  - Incohérences UX et bugs spécifiques à chaque version

---

## Slide 10 — Dette technique

### Chiffre clé
- **42% du temps dev** est perdu en dette technique et code de mauvaise qualité (Stripe Developer Coefficient 2018)
  - 13.5h/semaine sur la dette technique
  - 3.8h/semaine sur du bad code
  - Sur 41.1h/semaine totales
- Coût global pour l'économie US : **2 410 milliards $** (CISQ 2022), dont 1 520 milliards $ de dette technique seule

### Duplication = accélérateur de dette
- Le facteur de divergence commence à 1.0 et peut atteindre 3.0-5.0 après 2 ans
- Le code churn double avec la duplication → augmente la probabilité de bugs
- Cible Technical Debt Ratio ≤ 5% — la duplication fait exploser ce ratio
- Coût de correction par ligne : 1-5$ selon la complexité

### Coût des bugs selon la phase
- Design : 1x (correction documentaire)
- Implémentation : 3-5x (modification code + tests)
- QA/Testing : 5-10x (diagnostic + correction + re-test + potentiel re-design)
- Production : 10-30x (diagnostic prod + hotfix + déploiement + impact utilisateurs)
- **Avec duplication, un bug en prod touche potentiellement 2 codebases → coût amplifié**

### Note méthodologique
- Les ratios historiques "1x→100x" (attribués à IBM) proviennent de notes de formation internes de 1981, pas d'une étude publiée
- Le principe reste valide, mais les multiplicateurs exacts varient selon le contexte

---

## Slide 11 — Synthèse comparative

| Dimension | Code Partagé | Code Dupliqué |
|---|---|---|
| Coût initial | +30-50% (généralisation + setup) | ~170-220% d'une feature |
| Maintenance/an | 15-25% du dev initial | 30-50% (double) |
| Risque de bugs | 1x (source unique) | 33% bugs propagés non corrigés |
| Cohérence UX | Garantie par le code | Dégradation progressive |
| Scalabilité | Excellent (linéaire) | Mauvais (N × coût) |
| Break-even | 6-18 mois | Jamais (coûts croissants) |
| Onboarding | Simple (1 source) | Complexe (N sources + différences) |
| Time to market | Plus long au début | Plus court initialement |
| Flexibilité | Limitée (couplage) | Élevée (indépendance totale) |

---

## Slide 12 — Recommandations : quand choisir quoi ?

### Privilégier le code partagé si :
- La feature a une durée de vie > 18 mois
- Fréquence d'évolution élevée (plusieurs fois par trimestre)
- 3+ codebases consumers (ou prévues à terme)
- La cohérence UX est critique pour le produit
- L'équipe peut investir dans le setup initial
- Le système est en croissance (nouveaux consumers prévisibles)

### La duplication peut convenir si :
- Feature à durée de vie courte (< 6 mois, prototype, MVP)
- Très peu d'évolutions prévues après la livraison
- Codebases très différentes (langages, frameworks, architectures)
- Équipes totalement indépendantes et non alignées
- Prototype ou MVP rapide où le time-to-market prime
- Pas de besoin de cohérence UX entre les produits

### Message clé pour conclure
- **La duplication est une facilité à court terme qui se paie cher à moyen/long terme**
- Le partage est un investissement : plus cher au départ, mais amorti rapidement
- Au-delà de 2 codebases, le partage est quasi-systématiquement gagnant

---

## Chiffres clés à retenir (aide-mémoire)

| Métrique | Valeur |
|---|---|
| Maintenance en % du TCO | 50-80% |
| Break-even code partagé | 6-18 mois |
| Bugs propagés dans les clones | 33% (IEEE) |
| Temps dev perdu en dette tech | 42% (Stripe) |
| Ratio à 5 codebases | 2.47x en faveur du partage |
| Coût bug en production vs design | 10-30x |
| Facteur de portage | 0.5-0.8x de l'effort initial |
| Surcoût généralisation | +20-40% |
