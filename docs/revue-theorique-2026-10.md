# Revue théorique — Feature Cost Calculator

*28 octobre 2026. Revue du modèle (`src/engine/`), de la doc de recherche (`docs/feature-cost-shared-vs-duplicated.md`, et sa version FR) et de leurs sources.*

**Méthode.** Quatre agents en parallèle :
- un audit mathématique du modèle ;
- une recherche sur le coût du travail en France en 2026 ;
- une recherche dans la littérature empirique en génie logiciel ;
- une vérification des 45 citations.

Deux relecteurs adverses sont ensuite passés derrière. Le premier a contre-vérifié l'audit et attaqué le modèle corrigé proposé. Le second a vérifié 16 chiffres clés dans les sources primaires. Seuls les constats qui ont tenu à ces deux passes figurent ici.

---

## 1. Conclusion

**Le verdict affiché par l'app ne mesure pas ce qu'il prétend mesurer.** Dans le scénario par défaut, l'écart « dupliquer coûte +111 855 € sur 5 ans » se décompose ainsi :

- **253 000 € (74 % du coût dupliqué)** viennent d'une constante codée en dur : 50 600 €/an de « bugs supplémentaires ». Elle ne dépend ni de la taille de la feature, ni du taux horaire, ni du nombre de codebases.
- **88 % du coût partagé** sont des coûts d'organisation fixes (support 7,5 h/semaine, versioning, coordination, onboarding). Eux non plus ne dépendent pas de la feature.

Conséquences :
- Une feature de **1 journée** reçoit le même type de verdict (+97 k€ en faveur du partage) qu'une feature de 2 ans.
- Ajouter des codebases **dégrade** le partage. Au-delà de N ≈ 5,5, la duplication « gagne ». C'est l'inverse de la thèse du projet (§7.4).
- Le slider « Bugs fixed more than once » n'a **aucun effet** : aucune formule ne le lit.

Côté sources : une statistique semble **inventée** (« étude ING, 11-23 % »). Deux sources disent **l'inverse** de ce qui leur est attribué. La majorité des chiffres viennent de blogs commerciaux qui ne les contiennent pas.

Ce qui tient :
- Les **taux horaires France** restent justes à ±2 €/h, sauf le Lead.
- Le **facteur de généralisation 1,3** et le **facteur de portage 0,65** ont une vraie base empirique.

---

## 2. Erreurs du modèle

### 2.1 Critiques : elles inversent ou dominent le verdict

| # | Problème | Où | Effet |
|---|---|---|---|
| C1 | Bugs = constante de 50 600 €/an. `bugDuplicationFactor` n'est jamais utilisé. | `formulas.ts:86`, `:342`, `:406` | 74 % du coût dupliqué. Sur 5 ans, l'écart vaut exactement 253 000 − 3 463,7 × taux. Une équipe mieux payée se voit donc conseiller de dupliquer (bascule vers 73 €/h). C'est 40 à 45 fois ce que la doc elle-même attribue aux corrections de bugs (§2.2 : 17-21 % de la maintenance). |
| C2 | N (nombre de codebases) n'apparaît pas côté dupliqué : pas de N−1 portages, pas de N copies à maintenir. N ne fait qu'augmenter la coordination côté partagé. | `calcDuplicatedCost` | Le verdict bascule à N = 5,52 dans le **mauvais sens**. Le panneau conseille « Try more teams », ce qui aggrave le résultat. Les lignes N=3 et N=5 du tableau §7.4 (1,56 et 2,47) ne découlent d'aucune formule ; le moteur donne 0,93 et 0,76. |
| C3 | Coûts d'organisation fixes, indépendants de la taille de la feature : support 390 h/an, versioning 36 h/an, onboarding 3 devs/an, setup 8 semaines. | `formulas.ts:42-70` | La taille de la feature ne fait jamais basculer le verdict : 7 h donne +97,7 k€, 14 000 h donne +822 k€. Le support seul pèse 1,4 fois l'effort de build par an. |
| C4 | Le seuil de rentabilité vient d'une autre formule que les courbes. Elle ignore que la duplication paie aussi le portage dès le départ : l'écart initial réel est de 9 100 €, pas 26 000 €. Elle utilise une photo de l'année 1 et exclut l'onboarding. | `calcBreakEven` | Le panneau peut se **contredire**. Sur 480 scénarios testés, 71 affichent un écart et un seuil incompatibles, par exemple « Sharing costs +24 094 € » à côté de « pays off after 47 months ». Les propres tableaux de la doc se croisent à **22 mois**, pas aux 18,5 annoncés. Le seuil ne varie pas avec l'horizon. |

### 2.2 Majeures

| # | Problème | Effet |
|---|---|---|
| M1 | En mode story points : heures = sprints × semaines × 35 h, **sans multiplier par l'effectif**. Or la vélocité est celle de l'équipe (§1.2), le pas s'appelle « Team » et le taux est moyenné sur l'équipe. Le mode « heures directes » donne donc un résultat différent pour le même travail. | Effort sous-estimé 4× pour l'équipe par défaut (280 h au lieu de 1 120 h). |
| M2 | Onboarding compté **uniquement côté partagé**, alors que §9 dit que l'onboarding est plus complexe avec la duplication. Le taux « mid » calculé (50/65 × taux) donne 31,3 €/h, moins que le junior. | 40 k€ contre le partage sur 5 ans. |
| M3 | Modèle standalone (§7.1.1) : il applique la généralisation ×1,3 et un « support consommateurs » à une feature qui n'est pas partagée. La doc dit coordination = 0, mais le code utilise N (2 par défaut). Le §7.1.1 n'existe pas dans la doc FR. | Build + maintenance = seulement 12,9 % du total standalone. |
| M4 | Les coûts hebdomadaires utilisent 52 semaines par an, alors que les taux horaires sont calculés sur 1 607 h, soit 45,9 semaines. | Support et coordination surévalués de 13 %. |
| M5 | Taux de maintenance distincts (0,18 / 0,22) sans aucune base. La justification de la doc est à l'envers : un code générique est plus gros, pas plus simple. La synchronisation (8 × 16 h) recouvre en partie la maintenance perfective, qui en représente déjà 50-60 %. | Double comptage partiel. Le relecteur a nuancé : le ×1,8 et la prime de bugs sont des mécanismes légitimes, c'est leur calibrage qui est faux. |
| M6 | Les citations affichées dans l'app sont fausses : §3.2 au lieu de §3.4, §7.4 au lieu de §7.2, « +20-40 % » de **taille de code** présenté comme un effort, le « 33 % » présenté comme un multiplicateur de bugs, « COCOMO II » annoncé mais jamais utilisé. | Perte de traçabilité, alors que c'est un principe produit (« every number traceable »). |

### 2.3 Mineures

- Notation Σ(Coût × Année) fausse : elle implique une croissance triangulaire.
- Formule de setup en 40 h/semaine mais exemple en 35 h. « 2 seniors × 5 semaines » = 350 h, pas 400 h.
- §7.5 (e^rt, base 8 500) incohérent avec §7.2 ((1+r)^t, base 8 320). « Nearly tripled » est faux : le ratio est de 2,2.
- Section COCOMO : elle mélange COCOMO 81 basique (2,4/1,05 ; 2,5×E^0,38) et COCOMO II (2,94·EAF·KSLOC^E), et le moteur ne s'en sert pas.
- Tableau §9 : « Break-even : Never » pour la duplication n'a pas de sens. « Linear vs N × cost » : les deux sont linéaires.
- `calcScaleFactor` et `calcDivergence` ne sont jamais utilisés, mais restent verrouillés par des tests.
- Le hash d'URL n'est pas validé : horizon 0 → « Sharing costs 7 416 € ».
- Le seuil est arrondi à 1 mois minimum : l'app ne peut pas dire « rentable dès le jour 0 ».
- Pas d'actualisation (NPV). Effet faible : 32 k → 28 k sur 5 ans.

---

## 3. Sources : ce qui ne tient pas

| Affirmation de la doc | Réalité vérifiée |
|---|---|
| « Coordination time (ING study) 11-23 % » [17] | **Introuvable.** Begel et al. (CHASE 2009) est une enquête Microsoft auprès de 775 ingénieurs. Le papier ne parle pas d'ING et ne donne aucun pourcentage de temps. À supprimer (§3.3, §9). |
| Brooks n(n−1)/2 attribué à [17] | Vient de *The Mythical Man-Month* (1975, ch. 2) et compte des **personnes**, pas des équipes. Une équipe lib qui sert N consommateurs a environ N interfaces, pas N². |
| « Cloning multiplies security vulnerabilities » [45] | **Inverse** : Islam, Zibran & Nagpal (ESEM 2017, 34 systèmes) trouvent des vulnérabilités plus sévères dans les clones, mais **pas plus denses**. |
| « Up to 33 % of clones contain propagated bugs » [41][42] | 33 % est le **maximum** sur 4 systèmes Java (ICSME 2017), et seulement parmi les fragments qui ont reçu un correctif de bug. La version journal (JSS 2019, 7 systèmes) donne **18,42 %**. Tous les clones sont à l'intérieur d'un même dépôt, pas entre codebases. Le §9 surinterprète. |
| +20-40 % de code pour du générique [31][32] | Aucun chiffre dans ces sources. |
| Onboarding France : 30-40 k€ de perte, −25-40 % de vélocité, 50-100 k€ de remplacement [26][27][28] | Aucun de ces chiffres, ni aucune mention de la France, dans les sources (blogs de staffing US/PH/PT). 30-40 k€ en 6 semaines est aussi incompatible avec les salaires de la doc : un senior coûte environ 9 k€ à l'employeur sur 6 semaines. |
| Code review 12,5 % / 5 h par semaine [25][33] | Absent des sources. Coralogix parle de debugging. Ordres de grandeur publiés : ~3 h/semaine chez Google, ~6 h chez Microsoft. |
| Bug en production 5-15 k$ [14][16] | Aucun montant dans les sources. |
| Maintenance 15-25 %/an [10][12] | Absent des sources. Le « 15-22 % » de Gartner porte sur la **maintenance de licences éditeur**, pas sur l'effort. |
| Répartition 21 % / 79 % sur 5 ans [11] | Absent de [11]. L'original est Zarnekow & Brenner (ECIS 2005), et les 79 % incluent l'exploitation. |
| Stripe 42 % de « dette technique » [43] | Calcul de la doc, pas du rapport. La dette seule représente 33 %. |
| CISQ « 2,41 T$ dont 1,52 T$ de dette » [44] | Ce sont deux grandeurs distinctes : un coût annuel et une dette accumulée. « Dont » est faux. |
| Charges patronales 42-45 % [5][6] | [5] donne environ 40-42 %, [6] ne donne aucun chiffre. |
| Répartition des types de maintenance [12][13] | Galorath donne 5 % de perfective, pas 50-60 %. Les chiffres de la doc ressemblent à Lientz & Swanson (1978/1980), à citer directement. |
| Ratios de coût par phase de détection [14][15] | Ces sources reposent sur l'« IBM Systems Sciences Institute » que la doc elle-même démystifie [40]. Menzies et al. (EMSE 2017) ne trouvent **aucun effet du délai** sur 171 projets. |

**Liens morts :** [3] (404), [18] (redirige puis 404), [27] (redirige vers un autre site).

**Sources de faible qualité à retirer :** [20] (contenu SEO avec des « [Tool A] » non remplis), [25], et [39], qui défend la thèse inverse.

**Numérotation :**
- [30] n'est jamais utilisé.
- Les numéros ne sont pas dans l'ordre.
- La §10 n'est pas numérotée, on ne peut donc pas retrouver une source à partir de son numéro.
- 19 entrées ne sont citées nulle part, dont deux sources sérieuses (SANER 2016, PMC3610582).

**Chiffres présentés comme des faits sans aucune source :**
- §1.2 ;
- §3.1-3.3 ;
- §4.1 (portage 50-80 %) ;
- §4.2 ;
- §5.1-5.2 ;
- §6.2 (Divergence 3-5, 1-5 $/ligne) ;
- Bug_Duplication_Factor 1,5-3,0 (3,0 est logiquement impossible avec 2 copies) ;
- Divergence_Rate ;
- §9 (6-18 mois).

---

## 4. Données à jour

### 4.1 Coût du travail en France (2026)

Sources : Apec (déc. 2025, cadres uniquement), WeLoveDevs (oct. 2026), Silkhom (juil. 2026), URSSAF.

| Niveau | Brut national | Multiplicateur employeur 2026 | €/h chargé (÷1 607) | App actuelle | Paris €/h |
|---|---|---|---|---|---|
| Junior | 37 k€ | ×1,38 | 31,6 | 32 | 37,4 |
| Mid | 45 k€ | ×1,42 | 39,5 | 40 | 46,3 |
| Senior | 55 k€ | ×1,44 | 49,0 | 51 | 56,6 |
| Lead | 68 k€ | ×1,46 | 61,5 | **67** | 71,9 |

- **Recommandation :** 32 / 40 / 50 / 62 en national, ou garder 51/67 en les étiquetant « tendance Paris ». Les salaires sont stables, voire en léger recul. L'Apec note que les embauches de jeunes cadres restent 13 % sous leur niveau de 2023.
- **Réforme 2026 :** la réduction générale dégressive unique (RGDU) s'applique jusqu'à 3 SMIC, soit 65 629 €/an au 1er janvier 2026, avec un plancher de 2 %. Les taux réduits maladie (7 %) et famille (3,45 %) disparaissent. Le multiplicateur n'est donc plus uniforme : un flat 42-45 % est trop haut pour un junior.
- **1 607 h** est correct comme dénominateur par heure payée. 15 % des salariés à temps plein du privé sont au forfait jours, 84 % d'entre eux cadres (DARES 2026). Avec Syntec, cela donne au plus 218 j × 7 h = 1 526 h. Garder 1 607 h et l'indiquer en note.
- **Fully loaded (+20-30 %)** : il n'existe pas de statistique française. Deux références officielles sont cohérentes avec cette fourchette : le forfait de 25 % de coûts indirects d'Horizon Europe, et le plafond de 40 % du CIR. Défaut ×1,25. Senior fully loaded : 61 €/h en national, 71 €/h à Paris. Le 65 €/h de la doc tient.
- **Écart d'étiquetage :** les défauts de l'app sont « chargés », les exemples de la doc sont « fully loaded ». L'utilisateur voit 51 d'un côté et 65 de l'autre sans explication.
- **TJM 2026 :** Hays Paris full-stack donne 450 / 515 / 580 / 650 €/j, Malt 317 / 435 / 575 / 672 €/j. Les lignes senior et expert de la doc sont 15-25 % trop hautes.

### 4.2 Paramètres du modèle face aux données empiriques

| Paramètre | Défaut | Évidence | Verdict |
|---|---|---|---|
| Généralisation | 1,3 | Multiplicateur RUSE de COCOMO II : 1,07 / 1,15 / 1,24. HP (Lim) : 1,11. Poulin : ~1,5 (défaut recommandé, pas une mesure). Krüger & Berger (FSE 2020) : médiane +20 % sur 5 études. | **Soutenu.** Garder 1,2-1,3, plage 1,1-1,6. |
| Portage | 0,65 | Modèle de réutilisation COCOMO II (AAF = 0,4·DM + 0,3·CM + 0,3·IM) : 0,55-0,8 en copier-adapter. Selby (NASA) : coût relatif de 0,55 dès ~12,5 % de modification. Krüger & Berger : −35 % (une seule étude). | **Soutenu.** |
| Intégration par consommateur (absente du moteur ; la doc dit 5-10 % du portage) | — | Poulin RCR ≈ 0,2. Krüger & Berger : variante plateforme ≈ 0,33 du coût initial (médiane sur 9 études). | **À ajouter, 20-33 %**, pas 5-10 %. |
| Maintenance annuelle | 18 % / 22 % | L'ordre de grandeur ~20 %/an est défendable (règle DoD, Glass 60/60, modèle ACT de Boehm). La différence entre partagé et dupliqué n'a aucune base. | **Un seul taux, ~20 %.** |
| Synchronisation | 8 × 16 h × 1,2^t | Ray & Kim (FSE 2012, forks BSD sur 18 ans) : 10,7-15,5 % des lignes modifiées sont portées depuis le fork voisin, taux stable dans le temps, latence médiane 10-20 mois. Aucune donnée sur une hausse exponentielle ; les forks qui divergent **cessent de synchroniser**. | **Remplacer** par environ 10-20 % du volume de changements × facteur de portage. Pas d'exponentielle, ou une dérive linéaire plafonnée. |
| Bugs propagés | 50 600 €/an | 18,42 % des fragments de clone qui reçoivent un correctif (Mondal 2019, intra-dépôt). Clones pas plus sujets aux défauts (Rahman 2012). Krüger & Berger : propager les changements est jugé plus coûteux avec une plateforme. | **Supprimer la constante.** Intégrer dans la maintenance de chaque copie supplémentaire. |
| Coordination | 3 h/semaine/équipe | Krüger & Berger : ~5 % de l'effort en clone-and-own contre ~7 % avec une plateforme. | **Petit écart en %,** pas un forfait horaire. |
| Breaking changes (absent) | — | Xavier (SANER 2017) : 14,78 % des changements d'API cassent la compatibilité, 2,54 % des clients sont touchés. Kula 2018 : 81,5 % des systèmes gardent des dépendances obsolètes. | **À ajouter** côté partagé, par consommateur. |
| Coût selon la phase de détection d'un bug | 1-10-30× | Menzies 2017 : pas d'effet du délai sur 171 projets. | Ne pas en faire un paramètre. |

**Contre-arguments que la doc doit présenter** (aujourd'hui elle est à charge) :
- Des clones bénéfiques jusqu'à 71 % (Kapser & Godfrey 2008, sur 2 systèmes).
- 54-72 % des clones disparus le font en environ 8 commits (Kim 2005).
- 49 % des ingénieurs Microsoft choisissent « éliminer les dépendances de code » pour gérer les problèmes de dépendance (Begel 2009).
- « Duplication is far cheaper than the wrong abstraction » (Metz).
- La règle « rentable à partir d'environ 3 produits » des lignes de produits logiciels, qui est heuristique.

**IA :**
- Le rapport GitClear 2025 (données éditeur) parle d'environ 8× plus de blocs dupliqués en 2024.
- L'essai contrôlé préenregistré de Borg et al. (EMSE 31, 2026, 151 développeurs) ne trouve aucun effet de l'IA sur la maintenabilité.
- Un LLM a porté correctement 42 % des patchs de Vim vers Neovim (PPatHF 2024).

Une remise optionnelle « portage assisté par IA » est envisageable, étiquetée comme hypothèse.

---

## 5. Modèle corrigé recommandé

Il part de la proposition du relecteur adverse, retouchée avec la littérature. Principes :
- chaque terme est proportionnel à l'effort ou à N ;
- les deux options sont traitées de façon symétrique ;
- l'écart et le seuil de rentabilité sont lus **sur les mêmes courbes** ;
- le taux horaire n'influence pas le sens du verdict.

```
C0 = B · w        B = heures-personnes (story points × effectif), w = taux chargé moyen
N ≥ 2 codebases, horizon T, coûts récurrents comptés par mois

Partagé
  Build_S  = G·C0 + i·C0·(N−1) + H_setup·w / F          (G : voir note)
  Annual_S = m · G · C0 · (1 + c·(N−1)) + b·C0·(N−1) + H_run·w / F

Dupliqué
  Build_D     = C0 · (1 + p·(N−1))
  Annual_D(y) = m · C0 · (1 + (N−1) · e(y)),   e(y) = min(e_max, e0 + δ·(y−1))

Écart(T)  = CumD(T) − CumS(T)
Seuil     = premier mois où CumS ≤ CumD  →  « dès le jour 0 » | « N mois » | « pas dans l'horizon »
```

Note sur la généralisation : le moteur actuel applique G = 1,3 fixe. Le relecteur propose G(N) = 1 + g1·(N−1). La littérature (RUSE, Krüger & Berger) mesure un surcoût global de ~+20 % plutôt qu'un surcoût par consommateur. **Recommandation : G fixe (1,2) pour N = 2-3, et l'exposer comme hypothèse.** C'est un point à trancher.

| Param | Défaut | Base |
|---|---|---|
| G | 1,2 | RUSE, Krüger & Berger |
| p, portage | 0,65 | COCOMO II reuse, Selby |
| i, intégration par consommateur | 0,2 | Poulin, Krüger & Berger |
| m, maintenance annuelle | 0,20 | DoD, Boehm ACT |
| e0, entretien d'une copie supplémentaire par rapport à la première (synchronisation et bugs propagés inclus) | 0,9-1,0 | Ray & Kim (la synchronisation porte sur 11-16 % des changements) |
| δ, e_max, dérive | +0,05/an, plafond 1,5 | **Hypothèse** (aucune donnée) |
| c, surcoût de coordination par consommateur | 0,05 | Krüger & Berger (écart de 5 à 7 %) |
| b, breaking changes par consommateur et par an | 0,02-0,05 | Xavier 2017, **ordre de grandeur** |
| H_setup / H_run, F | 280 h / 100 h par an, F = nombre de features hébergées dans la lib | **Hypothèse**. Mettre 0 si la lib existe déjà. |

Comportement observé du prototype (équipe par défaut, B = 1 120 h) :
- Nouvelle lib pour une seule feature : partage légèrement gagnant, seuil vers 31 mois.
- Lib existante : partage gagnant **dès le jour 0**.
- L'avantage croît avec N : +38 k / +91 k / +151 k pour N = 3 / 5 / 10.
- Feature de 35 à 280 h sur une nouvelle lib, horizon de 1 an, ou portage bon marché : **dupliquer gagne**, ce qui est le résultat attendu.

Le sens de chaque paramètre est le bon, et un test vérifie que l'écart est proportionnel au taux. Prototype : `redteam-simple.ts` dans le dossier de travail.

**Hors modèle, à afficher comme limites dans l'UI :**
- time-to-market ;
- goulot de release ;
- divergence voulue (une copie qui doit évoluer différemment n'est pas un coût) ;
- actualisation.

---

## 6. Plan de correction proposé

1. **Moteur** : remplacer `formulas.ts` par le modèle du §5. Supprimer la constante de bugs, les forfaits en heures, les deux taux de maintenance et `calcBreakEven` séparé. Multiplier les story points par l'effectif. Valider le hash d'URL.
2. **UI** : seuil de rentabilité lu sur les courbes, avec le cas « dès le jour 0 ». Corriger « Try more teams ». Étiquettes et citations alignées sur la nouvelle doc. Chaque paramètre marqué « mesuré » ou « hypothèse ».
3. **Doc EN + FR** :
   - réécrire §7 sur le nouveau modèle ;
   - supprimer ING, le Brooks mal attribué, [45] inversé et les chiffres d'onboarding ;
   - remplacer les sources commerciales par les sources primaires ci-dessus ;
   - corriger COCOMO ;
   - ajouter une section « contre-arguments » ;
   - mettre à jour la §1.3 avec les données 2026 ;
   - renuméroter les sources ;
   - resynchroniser FR et EN.
4. **Tests** : refaire les valeurs de référence de `formulas.test.ts`. Les assertions actuelles verrouillent les erreurs (`:66`, `:141-148`, `:208-214`, `:350-357`, `:390-393`, `:433-437`, `:514-528`).
5. Mettre à jour les présentations (`.pptx`, notes, script vidéo), qui reprennent les chiffres faux (18,5 mois, 33 %, ratios §7.4).

---

## Annexe — rapports détaillés

Dans le dossier de travail de la session (temporaire, à copier pour les garder) :
`/private/tmp/claude-501/-Users-brucecoaster-code-noMigrationCost/0500d27c-dc5f-4d78-9f63-18f613e20092/scratchpad/`

- `audit-model.md` : audit mathématique complet, sensibilités, références de lignes.
- `redteam-model.md` : contre-audit, et modèle simplifié dans `redteam-simple.ts`.
- `citation-audit.md` : tableau des 45 citations.
- `research-fr-labor.md` et `cost.py` : coût du travail 2026.
- `research-se-literature.md` : littérature empirique.
- `factcheck.md` : vérification de 16 chiffres clés dans les sources primaires.
