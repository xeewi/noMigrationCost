# Coût d'une feature : code partagé vs code dupliqué

Les recherches derrière le calculateur : d'où vient chaque chiffre, quel degré de confiance lui accorder, et les formules exactes utilisées par l'application.

**La question à laquelle répond le calculateur.** Une feature est nécessaire dans N applications (N ≥ 2). On peut la construire une seule fois sous forme de bibliothèque partagée utilisée par toutes les applications, ou la construire pour une application puis la copier et l'adapter dans les autres. Le calculateur additionne le coût de chaque option, mois par mois, sur un horizon de 1 à 10 ans. Il affiche le total de chacune, l'écart entre les deux et le mois à partir duquel le partage reste moins cher. Il donne aussi le coût de la feature construite une seule fois, pour une seule application.

**Ce qu'il laisse volontairement de côté.**

- **Délai de mise sur le marché.** Copier est souvent plus rapide pour la deuxième application quand aucune bibliothèque n'existe encore. Le calculateur compte l'effort, pas le temps calendaire.
- **Goulot d'étranglement des releases.** Une bibliothèque partagée peut obliger les équipes à attendre les releases des autres. Ce coût est réel, mais il n'est mesuré nulle part sous une forme exploitable.
- **Divergence volontaire.** Si une copie est censée évoluer différemment, sa maintenance séparée n'est pas du gaspillage. Le modèle traite chaque copie comme devant rester synchronisée.
- **Actualisation.** Tous les montants sont en euros nominaux. Un euro dépensé en année 5 compte autant qu'un euro dépensé aujourd'hui.

Le §6 détaille ces limites et les autres.

**Comment lire les preuves.** Chaque paramètre du modèle est étiqueté **Mesuré** (une étude empirique en donne au moins l'ordre de grandeur) ou **Hypothèse** (une valeur raisonnée sans mesure directe). Le §7.4 donne le tableau complet.

---

## 1. Coût d'un développeur en France (2026)

### 1.1 Salaires

La source principale est l'étude de rémunération de l'Apec de décembre 2025 [[1]](https://corporate.apec.fr/files/live/sites/corporate/files/Nos%20etudes/PDF/Les%20remunerations%20des%20cadres%20dans%20111%20familles%20de%20metiers%202025.pdf). Elle repondère 26 000 réponses de cadres du secteur privé sur les données officielles de paie (DSN). Pour la famille de métiers « développement informatique » :

- Médiane de **50 k€** brut par an (fixe + variable). 80 % des développeurs gagnent entre 38 k€ et 74 k€.
- Par âge : moins de 35 ans, médiane 44 k€ ; 35–45 ans, 52 k€ ; plus de 45 ans, 57 k€.
- Médiane Île-de-France 55 k€, autres régions 46 k€ (environ +20 % pour Paris).

L'Apec ne couvre **que les cadres**. Les développeurs non cadres, surtout des juniors, ne figurent pas dans ses données.

Deux autres sources concordent :

- WeLoveDevs : médiane junior (0–1 an) 35 k€ [[2]](https://welovedevs.com/fr/salaires/junior), médiane senior (5 ans et plus) 50 k€ [[3]](https://welovedevs.com/fr/salaires/senior). Ce sont les *prétentions* salariales des candidats, pas des salaires versés.
- Baromètre Silkhom 2026 : développeur Java/Python autour de 45 k€, −1,1 % sur un an [[4]](https://www.blogdumoderateur.com/salaires-informatique-digital-remunerations-2026/).

Le marché est stable, voire en léger recul, pour les développeurs généralistes. L'Apec indique que les recrutements de jeunes cadres restent 13 % sous leur niveau de 2023 [[5]](https://corporate.apec.fr/home/nos-etudes/toutes-nos-etudes/previsions-de-recrutements-de-cadres-2026.html).

Valeurs ponctuelles retenues ci-dessous (brut annuel) :

| Niveau | National | Paris / IDF |
|---|---|---|
| Junior (0–2 ans) | 37 k€ | 42 k€ |
| Confirmé (3–5 ans) | 45 k€ | 51 k€ |
| Senior (5–10 ans) | 55 k€ | 62 k€ |
| Lead / Staff (10 ans et plus) | 68 k€ | 78 k€ |

Il s'agit d'une synthèse des sources ci-dessus, pas d'un tableau publié tel quel. La ligne Lead est la moins sûre : l'Apec ne ventile pas par niveau, et les 68 k€ nationaux se situent entre sa médiane des plus de 45 ans (57 k€) et son décile supérieur des 35–45 ans (74 k€).

### 1.2 Cotisations patronales en 2026

Un forfait de « +42–45 % » n'est plus exact. Depuis le 1er janvier 2026, la **RGDU** (réduction générale dégressive unique) remplace l'ancienne réduction générale ainsi que les taux réduits maladie (7 %) et famille (3,45 %) [[6]](https://entreprendre.service-public.gouv.fr/vosdroits/F24542) :

- Elle s'applique jusqu'à **3 SMIC**, soit 65 629 € par an en 2026 (le SMIC retenu dans la formule reste celui du 1er janvier toute l'année).
- Elle a un **plancher de 2 %** : tout salaire sous ce seuil bénéficie d'au moins 2 % de réduction.
- Aux salaires des développeurs, elle représente environ 10 % du brut à 36 k€, 4,9 % à 45 k€, 2,6 % à 55 k€ et 2,1 % à 62 k€.

Au-delà du plafond de la Sécurité sociale (PASS, 48 060 € en 2026), la retraite complémentaire (Agirc-Arrco tranche 2) monte à 12,95 %, ce qui relève le multiplicateur du lead. Les taux proviennent des barèmes URSSAF 2026 [[7]](https://www.legisocial.fr/reperes-sociaux/taux-cotisations-sociales-urssaf-2026.html).

Le multiplicateur obtenu (brut → coût employeur) dépend donc de la tranche. Hypothèses : cadre, entreprise de 50 salariés ou plus, taux accident du travail de 0,6 %, prévoyance cadre obligatoire, mutuelle modeste. « Paris » ajoute le versement mobilité de 3,2 %.

| Niveau | Brut (national) | Multiplicateur | Coût employeur | Brut (Paris) | Multiplicateur (Paris) | Coût employeur (Paris) |
|---|---|---|---|---|---|---|
| Junior | 37 000 € | ×1,372 | 50 765 € | 42 000 € | ×1,433 | 60 167 € |
| Confirmé | 45 000 € | ×1,412 | 63 532 € | 51 000 € | ×1,459 | 74 420 € |
| Senior | 55 000 € | ×1,431 | 78 726 € | 62 000 € | ×1,466 | 90 881 € |
| Lead | 68 000 € | ×1,452 | 98 765 € | 78 000 € | ×1,482 | 115 558 € |

Les taux légaux sont solides. Les totaux comportent une incertitude de ±0,03, liée à la taille de l'entreprise, à la ville, et aux contrats de mutuelle et de prévoyance supérieurs au minimum légal.

### 1.3 Coût horaire chargé (taux par défaut de l'application)

Le taux horaire divise le coût employeur par **1 607 heures**, la durée légale annuelle du travail pour un contrat de 35 heures [8]. C'est le coût par heure *payée*.

Beaucoup de développeurs cadres sont plutôt au **forfait jours**. La DARES compte 15,1 % des salariés à temps complet du privé au forfait jours, dont 84,2 % de cadres [[9]](https://www.moneyvox.fr/votre-argent/actualites/108773/les-salaries-au-forfait-jours-principalement-des-cadres-font-plus-heures-que-les-autres). Sous la convention Syntec, le plafond est de 218 jours par an [10], soit 218 × 7 h = 1 526 h. Le calculateur garde 1 607 h parce que c'est la base légale et qu'elle donne le taux le plus bas (prudent). Avec 1 526 h, un senior coûte 51,6 €/h au lieu de 49,0 €/h. Par heure *productive* (environ 1 400 h une fois retirés les arrêts maladie, la formation et l'administratif — une convention plutôt qu'une statistique), ce serait environ 15 % de plus.

| Niveau | €/h national (÷ 1 607) | **Défaut de l'application** | €/h Paris |
|---|---|---|---|
| Junior | 31,6 | **32** | 37,4 → 37 |
| Confirmé | 39,5 | **40** | 46,3 → 46 |
| Senior | 49,0 | **50** | 56,6 → 57 |
| Lead | 61,5 | **62** | 71,9 → 72 |

**Les valeurs par défaut de l'application sont « chargées », pas « complètement chargées ».** Elles comprennent uniquement le salaire et les cotisations patronales. Un coût *complètement chargé* couvre aussi les outils, les locaux, le management et le recrutement. Il n'existe pas de statistique française pour ces frais généraux. Deux forfaits officiels en donnent un encadrement : Horizon Europe finance les coûts indirects à 25 % des coûts directs [[11]](https://www.ffg.at/en/europe/heu/legal-financial/theme_indirect-costs), et le crédit d'impôt recherche compte les frais de fonctionnement à 40 % des dépenses de personnel de R&D [[12]](https://www.impots.gouv.fr/sites/default/files/formulaires/2069-a-sd/2026/2069-a-sd_5270.pdf). Un facteur ×1,25 donne des taux nationaux complètement chargés d'environ 40 / 49 / 61 / 77 €/h (senior autour de 71 €/h à Paris). Pour raisonner sur cette base, saisissez ces taux dans le tableau de l'équipe.

### 1.4 Taux journaliers des freelances (TJM)

Si le travail est confié à des freelances, utilisez plutôt leur TJM :

| Expérience | Hays 2026, full-stack Paris [[13]](https://www.blogdumoderateur.com/freelance-tech-taux-journaliers-moyens-metier-2026/) | Malt, tarifs affichés [14] |
|---|---|---|
| Junior | 450 €/jour (0–3 ans) | 317 €/jour (< 2 ans) |
| Confirmé | 515 €/jour (3–5 ans) | 435 €/jour (3–7 ans) |
| Senior | 580 €/jour (5–8 ans) | 575 €/jour (8–15 ans) |
| Expert | 650 €/jour (8 ans et plus) | 672 €/jour (15 ans et plus) |

Hays situe les régions environ 10 % sous Paris. Pour obtenir un taux horaire, divisez par 7 (TJM / 7, la même journée de 7 heures que celle utilisée par l'application pour les jours-homme). Un TJM est un *prix* : il inclut déjà les charges du freelance, ses jours non facturés et sa marge. Il n'est pas comparable au coût chargé d'un salarié (une journée chargée de senior coûte environ 78 726 € / 218 ≈ 361 €).

---

## 2. Maintenance

### 2.1 Combien coûte la maintenance par an ?

Il n'existe pas de chiffre précis et général. L'ordre de grandeur est d'environ **20 % du coût de construction par an** :

- Une règle empirique du Département de la Défense américain situe la maintenance annuelle à environ 20 % de l'effort de développement du parc installé [15].
- Le COCOMO 81 de Boehm calcule la maintenance annuelle comme le *trafic annuel de changements* (la part du code ajoutée ou modifiée chaque année) × l'effort de développement [16]. Ce trafic dépend du projet, mais c'est le cadrage retenu par le calculateur : un taux annuel multiplié par le coût de construction.
- La « règle des 60/60 » de Glass : environ 60 % du coût sur le cycle de vie est de la maintenance, et environ 60 % de celle-ci est de l'amélioration [17]. Sur une durée de vie de 5 à 10 ans, cela implique environ 15–30 % du coût de construction par an.

Un chiffre souvent cité à ce sujet, les **« 15–22 % » de Gartner**, désigne autre chose : d'après la presse spécialisée dont il provient, c'est la redevance annuelle de support facturée par les éditeurs, en pourcentage du prix de la licence. Il ne dit rien de l'effort d'ingénierie.

Le calculateur applique un seul taux, `m`, à chaque copie du code (0,20 par défaut). COCOMO II applique sa prime « conçu pour la réutilisation » au développement seulement, pas à la maintenance [[18]](https://www.rose-hulman.edu/class/csse/csse372/201310/Homework/CII_modelman2000.pdf). Le calculateur applique néanmoins `m` au coût plus élevé de la construction partagée (§7.2), au motif que le code générique est plus volumineux. Ce choix pénalise légèrement le partage.

### 2.2 En quoi consiste la maintenance

La répartition classique provient des enquêtes de Lientz et Swanson auprès de responsables informatiques :

| Type | 1978, 69 organisations [[19]](https://doi.org/10.1145/359511.359522) | 1980, 487 organisations [20] |
|---|---|---|
| Perfective (améliorations) | 60,3 % | environ 50 % |
| Adaptative (évolutions de l'environnement) | 18,2 % | environ 25 % |
| Corrective (corrections de bugs) | 17,4 % | environ 22 % |
| Autre | 4,1 % | environ 3–4 % |

Ce sont des estimations de responsables. Quand Schach et al. ont plutôt mesuré les journaux de modifications, le correctif représentait plus de la moitié de la maintenance [[21]](https://doi.org/10.1023/A:1025368318006). Dans les deux cas, **la correction de bugs fait déjà partie de la maintenance** : le calculateur n'ajoute donc pas de coût de bugs séparé en plus de `m`.

### 2.3 Construction vs coût sur le cycle de vie

Zarnekow et Brenner ont suivi 30 systèmes applicatifs sur une période de production de 5 ans [[22]](https://aisel.aisnet.org/ecis2005/26). La planification et le développement initial représentaient environ 21 % du coût total, et les 79 % restants allaient à l'exploitation, à la maintenance et à l'évolution des systèmes. Ces 79 % incluent l'*exploitation* (infrastructure, support), que le calculateur ne compte pas. C'est un rappel qu'au bout de quelques années, ce sont les coûts récurrents qui dominent, pas la construction.

### 2.4 Un bug coûte-t-il plus cher quand il est trouvé tard ?

La « règle des 1-10-100 » est plus fragile que sa réputation :

- Le NIST Planning Report 02-3 donne des coûts relatifs de correction de 1× (exigences/conception), 5× (codage), 10× (intégration), 15× (bêta) et 30× (après livraison), mais son tableau est étiqueté « **Example Only** » [[23]](https://www.nist.gov/system/files/documents/director/planning/report02-3.pdf).
- Les chiffres 1-6-15-100 souvent attribués à l'« IBM Systems Sciences Institute » remontent à des supports de formation internes d'IBM, pas à une étude publiée [[24]](https://www.theregister.com/2021/07/22/bugs_expense_bs/) [[25]](https://leanpub.com/leprechauns).
- Boehm et Basili affirment que les corrections après livraison coûtent « souvent » 100× plus cher, mais « plutôt 5:1 » pour les petits systèmes non critiques [[26]](https://doi.org/10.1109/2.962984).
- Menzies et al. ont testé l'effet sur 171 projets logiciels (2006–2014) et n'ont trouvé **aucune preuve** que les problèmes deviennent plus difficiles à résoudre à mesure qu'ils sont découverts tard [[27]](https://arxiv.org/abs/1609.04886).

Il n'existe pas non plus de chiffre crédible pour le coût moyen d'un bug en production. **Le calculateur ne chiffre donc pas les bugs séparément.** La correction de bugs est incluse dans le taux de maintenance `m` (§2.2), et les corrections répétées d'une copie à l'autre sont incluses dans le ratio par copie supplémentaire `e` (§4.3).

---

## 3. Code partagé

### 3.1 Coûts ponctuels

**Le construire pour être partagé (`G`).** Du code écrit pour être réutilisé coûte plus cher que du code écrit pour une seule application :

| Source | Valeur | Ce que c'est |
|---|---|---|
| COCOMO II, cost driver RUSE [[18]](https://www.rose-hulman.edu/class/csse/csse372/201310/Homework/CII_modelman2000.pdf) | 1,07 / 1,15 / 1,24 | Multiplicateur d'effort pour une réutilisation au sein d'un programme / d'une ligne de produits / de plusieurs lignes de produits |
| Lim, HP [[28]](https://doi.org/10.1109/52.311048) | 1,11 | L'un des deux programmes HP : un composant réutilisable coûtait 111 % d'un composant non réutilisable (via la revue de Mohagheghi & Conradi [[29]](https://doi.org/10.1007/s10664-007-9040-x)) |
| Poulin [[30]](http://jeffreypoulin.info/html/reucalc_basic.html) | environ 1,5 | Valeur par défaut recommandée (plage 1,0–2,2), pas une mesure |
| Krüger & Berger [[31]](https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf) | médiane +20 % | Revue systématique : cinq études sur le développement de features pour une plateforme ; les personnes interrogées ont signalé des cas extrêmes nettement plus coûteux |

Défaut **G = 1,20**. Les valeurs au-dessus de 1,5 correspondent à de véritables plateformes multi-produits plutôt qu'à une feature partagée par quelques applications.

**L'intégrer dans chaque application supplémentaire (`i`).** Réutiliser un composant existant n'est pas gratuit : l'application doit l'intégrer, le configurer et le tester. Poulin recommande un coût relatif de réutilisation de 0,2 d'une construction neuve (plage d'environ 0,03–0,4) [[30]](http://jeffreypoulin.info/html/reucalc_basic.html). Krüger & Berger constatent que développer une nouvelle variante sur une plateforme économise environ 67 % par rapport à une construction from scratch (médiane de neuf études), soit environ 0,33 [[31]](https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf). Défaut **i = 0,20** par application supplémentaire.

**Mettre en place une nouvelle bibliothèque : 280 heures (hypothèse).** Création du package, de son dépôt ou de son entrée dans le registre, de la CI, du versioning et de la documentation d'API. Le calculateur retient 8 semaines × 35 h = 280 h, au taux moyen de l'équipe. Aucune étude ne le mesure ; c'est proche de zéro dans un monorepo existant. Si la bibliothèque existe déjà, désactivez « nouvelle bibliothèque » : les coûts de mise en place et de fonctionnement tombent à zéro.

### 3.2 Coûts récurrents

**Maintenance du code partagé.** `m × G × C0` par an (voir §2.1 et §7.2).

**Faire vivre la bibliothèque : 100 heures par an (hypothèse).** Releases, changelog, CI et mises à jour de dépendances, environ 2 heures par semaine. Là encore, aucune mesure n'existe. Ne s'applique qu'à une nouvelle bibliothèque.

**Coordination et montées de version (`k`).** Le partage crée une dépendance entre équipes. Deux coûts distincts sont fusionnés en un seul paramètre, car aucun n'est mesuré assez précisément pour être modélisé seul :

- *Coordination.*
  - Le n(n−1)/2 de Brooks compte les canaux de communication entre **personnes** sur une même tâche [32]. C'est un argument, pas une mesure. Une équipe de bibliothèque qui sert N applications a environ N interfaces : le calculateur fait donc croître la coordination linéairement avec le nombre d'applications supplémentaires.
  - Dans une enquête Microsoft auprès de 775 ingénieurs, 72 % dépendaient du calendrier de releases d'une autre équipe, et 49 % déclaraient qu'ils « élimineraient les dépendances de code (par ex. "clone and own") » pour régler leurs problèmes de dépendances [[33]](https://andrewbegel.com/papers/coordination-chase09.pdf). C'est une réponse à choix multiples sur les parades, pas une part de temps mesurée. L'enquête ne donne aucun « pourcentage du temps passé à se coordonner ». Le chiffre « 11–23 % (étude ING) » qui circule sur les blogs n'y figure pas, et aucune source n'a été trouvée.
  - Le meilleur indice quantitatif vient des entretiens de Krüger & Berger : la coordination représentait environ 5 % de l'effort de développement d'une variante en clone-and-own et environ 7 % sur une plateforme [[31]](https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf). La *différence* est d'environ 2 points.
- *Montées de version cassantes.*
  - Sur 317 bibliothèques Java, 14,78 % des changements d'API cassaient la rétrocompatibilité, mais seuls 2,54 % des projets clients étaient réellement touchés [[34]](https://repositorio.ufmg.br/handle/1843/JCES-ARMPK6).
  - 81,5 % des 4 600 projets étudiés conservaient des dépendances obsolètes [[35]](https://doi.org/10.1007/s10664-017-9521-5), ce qui suggère que les équipes repoussent souvent ce coût plutôt que de le payer.

Défaut **k = 0,04** : chaque application supplémentaire ajoute 4 % du coût de construction par an. C'est une **hypothèse** calibrée sur les éléments ci-dessus, pas une mesure.

---

## 4. Code dupliqué

### 4.1 Copier dans une autre application (`p`)

Le modèle de réutilisation de COCOMO II donne le coût d'adaptation d'un code existant [[18]](https://www.rose-hulman.edu/class/csse/csse372/201310/Homework/CII_modelman2000.pdf) :

```
AAF = 0.4·DM + 0.3·CM + 0.3·IM
AAM = [AA + AAF·(1 + 0.02·SU·UNFM)] / 100     (when AAF ≤ 50)
```

DM, CM et IM sont les pourcentages de conception modifiée, de code modifié et d'intégration/tests refaits. SU (10–50) est la pénalité de compréhension du logiciel, UNFM (0–1) le manque de familiarité de l'équipe avec le code et AA (0–8) l'effort d'évaluation. AAM est le coût relatif à du code neuf. Trois réglages illustratifs pour « copier une feature dans une application similaire » :

| DM / CM / IM | AA, SU, UNFM | AAM |
|---|---|---|
| 20 / 30 / 80 | 4, 30, 0,4 (même équipe) | ≈ 0,55 |
| 20 / 30 / 80 | 4, 30, 1,0 (autre équipe) | ≈ 0,70 |
| 20 / 30 / 100 | 4, 30, 1,0 (retest complet, autre équipe) | ≈ 0,79 |

Données empiriques :

- L'analyse de Selby portant sur 2 954 modules NASA réutilisés, reproduite par Boehm et al. [[36]](https://staff.emu.edu.tr/alexanderchefranov/Documents/CMPE412/Boehm1995%20COCOMO%202%20.pdf) : la réutilisation sans modification coûte environ 5 % d'un code neuf, mais le coût relatif bondit à environ **0,55 dès qu'environ 12,5 % du code est modifié** (lu sur la figure publiée), puis augmente lentement (environ 0,70 à 62,5 % modifié). L'essentiel du coût tient à la compréhension du code et au re-test des interfaces.
- Krüger & Berger rapportent que le clone-and-own réduisait le coût de développement d'une variante d'environ 35 %, soit un facteur d'environ 0,65 [[31]](https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf). Ce chiffre provient d'**une seule étude** (Henry & Faller), pas d'une médiane.

Défaut **p = 0,65** par application supplémentaire.

### 4.2 Faire vivre les copies supplémentaires (`e0`)

Chaque copie a besoin de sa propre maintenance : ses propres corrections de bugs, sa propre adaptation à la plateforme et aux dépendances de son application. En plus, les modifications faites dans une copie doivent souvent être refaites dans les autres.

Les seules données solides sur la synchronisation entre bases de code viennent de l'étude de Ray & Kim sur 18 ans des forks FreeBSD, NetBSD et OpenBSD [[37]](https://baishakhir.github.io/uploads/fse2012-bsd.pdf) :

- **10,7–15,5 % des lignes modifiées** dans les patchs de release étaient portées depuis un fork voisin (13,8 % FreeBSD, 15,5 % NetBSD, 10,7 % OpenBSD).
- Le taux de portage **n'a pas diminué** avec le temps.
- 26 %, 59 % et 45 % des développeurs actifs ont porté des changements à chaque release.
- La **latence médiane de portage était de 10 à 20 mois**, et les changements portés étaient *moins* sujets aux défauts que les autres.

Le calculateur exprime la maintenance de chaque copie supplémentaire comme un ratio `e` de la maintenance de la première copie. Défaut **e0 = 1,00** : une copie supplémentaire coûte autant à maintenir que la première, synchronisation et corrections répétées comprises. C'est une **hypothèse**. Ray & Kim confortent l'idée que la synchronisation représente une fraction stable et modérée du volume de changements, mais personne n'a mesuré le ratio lui-même.

### 4.3 Bugs dans le code cloné

La littérature sur les clones est souvent sur-citée. Précisément :

- Mondal et al. (ICSME 2017) ont étudié **4 systèmes Java** (jEdit, Freecol, Carol, Jabref). **Jusqu'à 33 %** des fragments clonés *ayant reçu une correction de bug* contenaient un bug propagé [[38]](https://clones.usask.ca/pubfiles/articles/MondalICSME2017BugPropagation.pdf). La version étendue en revue (JSS 2019, **7 systèmes**, Java, C et C#) donne **18,42 %** au global [[39]](https://clones.usask.ca/pubfiles/articles/MMondalBugProposationJSS.pdf).
  - Le dénominateur est l'ensemble des fragments clonés ayant reçu une correction de bug, pas tous les clones.
  - « Propagé » est **déduit** : deux fragments ayant reçu la même correction tout en restant des clones sont supposés avoir partagé un bug copié avec le code.
  - Tous les clones sont **dans un même dépôt**, pas entre bases de code.
- Juergens et al. ont constaté qu'environ une modification incohérente *non intentionnelle* d'un clone sur deux à trois entraînait un défaut, sur cinq systèmes industriels et open source [[40]](https://arxiv.org/abs/1701.05472).
- Islam et al. ont analysé 34 systèmes (8,7 MLOC) avec deux détecteurs statiques : les vulnérabilités du code cloné étaient **plus graves**, mais **pas plus denses**, que dans le code non cloné [[41]](https://doi.org/10.1109/ESEM.2017.9).

Les bugs dupliqués sont donc réels, mais rien ne fonde un « multiplicateur de bugs » fixe. Le calculateur inclut les corrections répétées dans le ratio par copie supplémentaire `e` au lieu de les chiffrer à part.

### 4.4 Divergence dans le temps (`δ`, plafond 1,5)

Aucune étude ne mesure un coût de synchronisation qui croîtrait exponentiellement avec l'âge des copies. Ce que montrent les études, c'est que les copies qui s'éloignent **cessent d'être synchronisées** :

- la plupart des hard forks sur GitHub ne se resynchronisent jamais avec l'upstream [[42]](https://www.cs.cmu.edu/~shuruiz/paper/icse20-hardfork.pdf) ;
- il y a peu d'intégration de code entre membres d'une même famille de forks dans les écosystèmes Android, .NET et JavaScript [[43]](https://doi.org/10.1007/s10664-021-10078-2) ;
- une personne interrogée par Krüger & Berger, à propos des clones de longue durée : « we don't do it at all » [[31]](https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf).

La synchronisation non payée devient de la dérive : comportements incohérents, corrections manquées, coût croissant d'une éventuelle refusion. Le calculateur modélise cela comme une **légère hausse linéaire** du ratio par copie supplémentaire, par défaut **δ = 0,05 par an**, **plafonnée à 1,5×**. Au-delà du plafond, l'hypothèse est que les équipes arrêtent de synchroniser plutôt que de payer davantage. δ et le plafond sont tous deux des **hypothèses**.

---

## 5. L'autre côté de l'argument

Les preuves ne vont pas toutes dans le sens du partage :

- **Beaucoup de clones sont sans problème.** Dans Apache httpd et Gnumeric, jusqu'à 71 % des clones ont été jugés avoir un effet *positif* sur la maintenabilité [[44]](https://doi.org/10.1007/s10664-008-9076-6).
- **Beaucoup de clones ont une vie courte.** Parmi les généalogies de clones disparues, 54–72 % l'ont fait en environ 8 check-ins, et la plupart n'étaient pas faciles à refactorer localement [[45]](https://dada.cs.washington.edu/research/tr/2005/04/UW-CSE-05-04-01.pdf).
- **Les clones ne sont pas plus bogués.** Dans quatre projets open source en C, la plupart des bugs n'avaient rien à voir avec les clones, et le code cloné était plutôt *moins* sujet aux défauts [[46]](https://doi.org/10.1007/s10664-011-9195-3).
- **Les ingénieurs choisissent le clonage pour échapper aux dépendances.** 49 % des ingénieurs Microsoft interrogés élimineraient les dépendances de code, par exemple par clone-and-own [[33]](https://andrewbegel.com/papers/coordination-chase09.pdf). Les personnes interrogées par Krüger & Berger jugeaient la *propagation des changements* plus coûteuse sur une plateforme qu'avec des clones [[31]](https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf).
- **La mauvaise abstraction.** « Duplication is far cheaper than the wrong abstraction » [[47]](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction). Une bibliothèque partagée construite avant que les cas d'usage soient compris peut coûter plus cher que les copies qu'elle remplace. C'est un billet d'opinion, mais cohérent avec les études ci-dessus.
- **L'heuristique des « environ trois produits ».** La littérature sur les lignes de produits logiciels indique qu'une plateforme de réutilisation devient rentable à partir d'environ trois produits [[48]](https://doi.org/10.1007/3-540-28901-1). C'est une règle issue de l'expérience, pas une mesure. Le fait que le verdict du calculateur soit serré à N = 2 (§7.5) est cohérent avec elle.

**Assistants de code IA.** Les preuves sont récentes et contrastées :

- Le rapport 2025 de GitClear, une analyse d'éditeur, a relevé environ 8× plus de blocs de code dupliqués en 2024 qu'auparavant [49]. Il montre davantage de duplication, pas son coût.
- Une expérience contrôlée pré-enregistrée avec 151 participants n'a trouvé **aucun effet** du développement assisté par IA sur la facilité avec laquelle d'autres pouvaient ensuite faire évoluer le code [[50]](https://arxiv.org/abs/2507.00788).
- Un LLM a porté correctement 42 % des patchs Vim vers Neovim [[51]](https://arxiv.org/abs/2404.17964), ce qui suggère que le portage pourrait devenir moins cher.

**Le calculateur ne modélise pas l'IA.** Si vous pensez que vos outils rendent la copie moins chère, baissez vous-même `p` et `e0`.

---

## 6. Périmètre et limites

Ce que le modèle ne capture pas, pour que le lecteur puisse ajuster le verdict par son jugement :

| Non modélisé | Dans quel sens cela joue |
|---|---|
| Délai de mise sur le marché | Dans les deux sens. Sans bibliothèque, copier livre généralement la deuxième application plus tôt. Une fois une plateforme établie, la revue de Krüger & Berger rapporte une réduction du délai de mise sur le marché plus forte pour la plateforme (environ −63 %) que pour le clone-and-own (environ −30 %) [[31]](https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf). |
| Goulot d'étranglement des releases | Contre le partage : les équipes attendent les releases de la bibliothèque. |
| Divergence volontaire | Contre le coût côté duplication : si les copies *doivent* différer, leur maintenance séparée n'est pas du gaspillage. |
| Actualisation (VAN) | Les coûts tardifs pèseraient moins. L'avantage du partage vient des coûts récurrents, donc l'actualisation le réduit légèrement. |
| Intégration des nouveaux arrivants | Neutre dans le modèle. Aucune étude ne distingue « apprendre le mécanisme de partage » de « apprendre deux copies divergentes ». |
| Dérive non payée | Contre la duplication : les comportements incohérents et les corrections manquées une fois que les copies ne sont plus synchronisées (§4.4) ont un coût que le modèle ne chiffre pas. |
| Assistance IA | Voir §5. |
| Bugs comme ligne séparée | Pas chiffrés à part ; inclus dans `m` et `e` (§2.4). |

---

## 7. Le modèle du calculateur

Chaque formule ci-dessous est implémentée dans `src/engine/formulas.ts`, et chaque chiffre du §7.5 peut être reproduit en l'appelant.

**À propos de COCOMO.** Le calculateur n'utilise pas l'équation d'effort de COCOMO fondée sur la taille : c'est vous qui fournissez directement l'effort. Seules deux parties de COCOMO II servent de preuves : le cost driver RUSE (pour G, §3.1) et le modèle de réutilisation (pour p, §4.1).

**Définitions communes.**

- **w** : le taux horaire chargé moyen de l'équipe, pondéré par l'effectif (§1.3).
- **B** : les heures-personne nécessaires pour construire la feature une fois, pour une application.
  - Story points : `B = (story points / vélocité) × semaines par sprint × 35 h × effectif`. La vélocité est celle de toute l'équipe, donc chaque sprint coûte les heures de chaque membre.
  - Mode direct : la valeur est déjà en heures-personne, ou en jours-personne × 7 h.
- **C0 = B × w** : le coût de construction de la feature une fois, pour une application. Tous les coûts du modèle sont des multiples de C0, sauf la mise en place et le fonctionnement de la bibliothèque, qui sont des heures fixes × w.
- **N** : nombre d'applications ayant besoin de la feature (de 2 à 10 dans l'interface). **T** : horizon en années.
- **Calendrier** : les constructions sont payées au mois 0. Les coûts annuels s'accumulent de façon régulière, un douzième par mois. Le mois t appartient à l'année y = ⌈t / 12⌉.

### 7.1 Coût autonome

La feature construite une fois, pour une application :

```
Standalone(T) = C0 + m · C0 · T
```

Exemple avec le scénario par défaut (§7.5) : 45 360 + 0,20 × 45 360 × 5 = **90 720 €**.

### 7.2 Bibliothèque partagée

```
Build_S  = G·C0  +  i·C0·(N−1)  +  280 h · w        (setup only for a new library)
Yearly_S = m·G·C0  +  k·C0·(N−1)  +  100 h · w      (running only for a new library)
```

| Ligne dans l'application | Formule |
|---|---|
| La construire une fois, conçue pour être partagée | G · C0 |
| L'intégrer dans les autres applications | i · C0 · (N−1) |
| Mettre en place la bibliothèque | 280 h · w (0 si la bibliothèque existe) |
| Maintenance du code partagé | m · G · C0 · T |
| Coordination et montées de version | k · C0 · (N−1) · T |
| Faire vivre la bibliothèque | 100 h · w · T (0 si la bibliothèque existe) |

### 7.3 Copies dupliquées

```
Build_D     = C0  +  p·C0·(N−1)
Yearly_D(y) = m·C0  +  m·C0·(N−1)·e(y)
e(y)        = min(1.5, e0 + δ·(y−1))
```

| Ligne dans l'application | Formule |
|---|---|
| La construire pour la première application | C0 |
| La copier dans les autres applications | p · C0 · (N−1) |
| Maintenance de la première copie | m · C0 · T |
| Maintenance des copies supplémentaires | m · C0 · (N−1) · [e(1) + e(2) + … + e(T)] |

Le ratio par copie supplémentaire démarre à e0 en année 1, augmente de δ chaque année et s'arrête à 1,5.

### 7.4 Paramètres

Réglables dans le panneau « Paramètres avancés » :

| Symbole | Dans l'application | Défaut | Plage dans l'interface | Preuve | Fondement |
|---|---|---|---|---|---|
| G | Travail supplémentaire pour la rendre réutilisable | 1,20 | 1,0–1,6 | Mesuré | COCOMO II RUSE 1,07–1,24 ; HP 1,11 ; Krüger & Berger médiane +20 % ; Poulin 1,5 comme défaut recommandé (§3.1) |
| p | Effort pour la copier dans une autre application | 0,65 | 0,3–1,0 | Mesuré | Modèle de réutilisation COCOMO II 0,55–0,8 ; Selby 0,55 à ~12,5 % modifié ; Krüger & Berger −35 %, une seule étude (§4.1) |
| i | Effort pour intégrer la bibliothèque dans une autre application | 0,20 | 0–0,5 | Mesuré | Poulin RCR 0,2 ; Krüger & Berger variante sur plateforme ≈ 0,33 (§3.1) |
| m | Maintenance annuelle d'une copie | 0,20 | 0,1–0,4 | Mesuré (ordre de grandeur) | Règle empirique DoD ~20 %/an ; trafic annuel de changements de Boehm ; Glass 60/60 (§2.1) |
| e0 | Maintenance de chaque copie supplémentaire | 1,00 | 0,5–1,5 | Hypothèse | Étayé par Ray & Kim : 10,7–15,5 % des changements portés entre forks, à un rythme stable (§4.2) |
| δ | Vitesse de divergence des copies | 0,05 / an | 0–0,2 | Hypothèse | Aucune mesure ; les forks cessent de se synchroniser plutôt que de payer davantage (§4.4) |
| k | Coordination et montées de version par application supplémentaire | 0,04 / an | 0–0,15 | Hypothèse | Krüger & Berger coordination 5 % vs 7 % ; Xavier et al. 14,78 % de changements d'API cassants (§3.2) |

Constantes fixes (non exposées dans l'interface) :

| Constante | Valeur | Preuve | Fondement |
|---|---|---|---|
| Mise en place de la bibliothèque | 280 h (8 semaines × 35 h) | Hypothèse | §3.1 |
| Fonctionnement de la bibliothèque | 100 h / an | Hypothèse | §3.2 |
| Plafond du ratio par copie supplémentaire | 1,5 | Hypothèse | §4.4 |
| Semaine / journée de travail | 35 h / 7 h | Base légale | §1.3 |

« Mesuré » signifie qu'une source empirique donne au moins l'ordre de grandeur. Cela ne signifie pas que la valeur par défaut est la bonne pour votre équipe.

### 7.5 Exemple chiffré : le scénario par défaut de l'application

**Entrées.**

- Équipe : 1 Junior (32 €/h), 2 Confirmés (40 €/h), 1 Senior (50 €/h), 0 Lead (62 €/h). Moyenne w = (32 + 2 × 40 + 50) / 4 = **40,5 €/h**.
- Feature : 40 story points, vélocité d'équipe de 10, sprints de 2 semaines → 4 sprints × 2 semaines × 35 h × 4 personnes = **B = 1 120 heures-personne**.
- C0 = 1 120 × 40,5 = **45 360 €**.
- N = 2 applications, horizon de 5 ans, nouvelle bibliothèque, tous les paramètres par défaut.

**Bibliothèque partagée.**

| Ligne | Calcul | Coût |
|---|---|---|
| La construire une fois, conçue pour être partagée | 1,20 × 45 360 | 54 432 € |
| L'intégrer dans les autres applications | 0,20 × 45 360 × 1 | 9 072 € |
| Mettre en place la bibliothèque | 280 h × 40,5 | 11 340 € |
| Maintenance du code partagé | 0,20 × 1,20 × 45 360 × 5 | 54 432 € |
| Coordination et montées de version | 0,04 × 45 360 × 1 × 5 | 9 072 € |
| Faire vivre la bibliothèque | 100 h × 40,5 × 5 | 20 250 € |
| **Total après 5 ans** | | **158 598 €** |

**Copies dupliquées.**

| Ligne | Calcul | Coût |
|---|---|---|
| La construire pour la première application | 45 360 | 45 360 € |
| La copier dans les autres applications | 0,65 × 45 360 × 1 | 29 484 € |
| Maintenance de la première copie | 0,20 × 45 360 × 5 | 45 360 € |
| Maintenance des copies supplémentaires | 0,20 × 45 360 × (1,00 + 1,05 + 1,10 + 1,15 + 1,20) | 49 896 € |
| **Total après 5 ans** | | **170 100 €** |

**Verdict : dupliquer coûte 11 502 € de plus sur 5 ans** (environ 7 % du total dupliqué). Point mort : **mois 0**.

Coût cumulé à chaque fin d'année :

| | Année 0 | Année 1 | Année 2 | Année 3 | Année 4 | Année 5 |
|---|---|---|---|---|---|---|
| Partagé | 74 844 € | 91 595 € | 108 346 € | 125 096 € | 141 847 € | 158 598 € |
| Dupliqué | 74 844 € | 92 988 € | 111 586 € | 130 637 € | 150 142 € | 170 100 € |

**À quel point c'est serré.** Dans le cas par défaut, les coûts initiaux sont *exactement* égaux : 1,20 + 0,20 + 280 / 1 120 = 1,65 = 1 + 0,65 fois C0, soit 74 844 € de chaque côté. C'est une coïncidence liée à cette taille de feature, pas une propriété du modèle. Le point mort au « mois 0 » signifie une égalité au départ : le moteur considère « partagé ≤ dupliqué » comme un partage qui n'est pas plus cher. Le verdict est entièrement décidé par les **coûts récurrents** : 16 751 € par an côté partagé, contre 18 144 € en année 1 côté dupliqué, en hausse de 454 € par an avec la dérive. Une modification modeste d'une seule hypothèse suffit à l'inverser, comme le montre le tableau suivant.

**Sensibilité** (une seule entrée modifiée à la fois par rapport au scénario par défaut ; montants arrondis à l'euro) :

| Variante | Total partagé | Total dupliqué | Écart (dupliqué − partagé) | Point mort |
|---|---|---|---|---|
| Défaut | 158 598 € | 170 100 € | +11 502 € | mois 0 (égalité à la construction) |
| N = 3 | 176 742 € | 249 480 € | +72 738 € | mois 0 |
| N = 5 | 213 030 € | 408 240 € | +195 210 € | mois 0 |
| N = 10 | 303 750 € | 805 140 € | +501 390 € | mois 0 |
| Bibliothèque existante | 127 008 € | 170 100 € | +43 092 € | mois 0 |
| Feature de 140 h | 47 466 € | 21 263 € | −26 203 € | aucun sur l'horizon |
| Horizon d'1 an | 91 595 € | 92 988 € | +1 393 € | mois 0 |
| p = 0,4 | 158 598 € | 158 760 € | +162 € | mois 60 |
| G = 1,5 | 185 814 € | 170 100 € | −15 714 € | aucun sur l'horizon |

Un écart positif signifie que le partage est moins cher. Lecture du tableau :

- Davantage d'applications favorise fortement le partage : chaque application supplémentaire coûte 0,65 C0 à copier plus la maintenance d'une copie complète, contre 0,20 C0 à intégrer plus 0,04 C0 par an.
- Une bibliothèque existante supprime les coûts de mise en place et de fonctionnement, qui sont des heures fixes. C'est pourquoi une petite feature sur une nouvelle bibliothèque favorise la copie : pour 140 h de travail, les 280 h de mise en place et les 100 h par an de fonctionnement l'emportent sur tout le reste.
- Une copie bon marché (p = 0,4) ne laisse le partage devant qu'au tout dernier mois. Une forte prime de généralisation (G = 1,5) rend la duplication moins chère sur tout l'horizon.

### 7.6 Point mort et écart

```
Gap(T)     = CumD(T) − CumS(T)
Break-even = earliest month t such that CumS(u) ≤ CumD(u) for every month u from t to T·12
```

- **0** signifie que le partage n'est pas plus cher dès le premier jour.
- **« Aucun »** signifie que le partage n'est pas moins cher à l'horizon.
- Sinon, c'est le mois à partir duquel le partage reste moins cher jusqu'à l'horizon.

Le point mort est lu sur les mêmes courbes mensuelles que les totaux, donc l'écart et le point mort ne peuvent jamais se contredire. Si le partage est moins cher à l'horizon, un mois de point mort existe. S'il est plus cher, il n'y en a pas.

**Le taux horaire n'inverse jamais le verdict.** Chaque terme est un nombre d'heures × w (C0 = B × w ; la mise en place et le fonctionnement sont des heures fixes × w). L'écart est donc proportionnel au taux : doubler tous les taux double l'écart, et le mois de point mort ne bouge pas. Ce qui décide du verdict, c'est l'effort B, le nombre d'applications, l'horizon et les paramètres.

---

## 8. Sources

Numérotées par ordre de première citation. Les entrées sans lien sont des livres, des rapports ou des pages sans URL publique stable.

1. Apec, *Les rémunérations des cadres dans 111 familles de métiers*, édition 2025 (publiée en décembre 2025), p. 63, « Métiers du développement informatique ». Cadres uniquement. <https://corporate.apec.fr/files/live/sites/corporate/files/Nos%20etudes/PDF/Les%20remunerations%20des%20cadres%20dans%20111%20familles%20de%20metiers%202025.pdf>
2. WeLoveDevs, « Salaire développeur junior » (prétentions salariales déclarées par les candidats inscrits, page mise à jour en octobre 2026). <https://welovedevs.com/fr/salaires/junior>
3. WeLoveDevs, « Salaire développeur senior » (même méthode, page mise à jour en octobre 2026). <https://welovedevs.com/fr/salaires/senior>
4. Silkhom, *Baromètre des salaires IT 2026* (juillet 2026), relayé par le Blog du Modérateur, 7 juillet 2026. <https://www.blogdumoderateur.com/salaires-informatique-digital-remunerations-2026/>
5. Apec, *Prévisions de recrutements de cadres 2026* (avril 2026). <https://corporate.apec.fr/home/nos-etudes/toutes-nos-etudes/previsions-de-recrutements-de-cadres-2026.html>
6. Service-public.fr (Entreprendre), « Réduction générale des cotisations patronales » (fiche F24542, paramètres RGDU 2026). <https://entreprendre.service-public.gouv.fr/vosdroits/F24542>
7. LégiSocial, « Taux de cotisations sociales URSSAF 2026 » (mis à jour le 1er janvier 2026). <https://www.legisocial.fr/reperes-sociaux/taux-cotisations-sociales-urssaf-2026.html>
8. Code du travail, art. L3121-41 (durée annuelle de référence de 1 607 heures).
9. Étude DARES sur le forfait jours (mai 2026, année de référence 2024), relayée par l'AFP / MoneyVox, mai 2026. La publication DARES elle-même n'a pas été lue. <https://www.moneyvox.fr/votre-argent/actualites/108773/les-salaries-au-forfait-jours-principalement-des-cadres-font-plus-heures-que-les-autres>
10. Convention collective Syntec (IDCC 1486), avenant du 1er avril 2014 relatif à la durée du travail, art. 4.4 (plafond de 218 jours pour le forfait jours).
11. FFG (agence autrichienne de promotion de la recherche), « Horizon Europe: indirect costs » (forfait de 25 % des coûts directs éligibles). <https://www.ffg.at/en/europe/heu/legal-financial/theme_indirect-costs>
12. impots.gouv.fr, notice du formulaire 2069-A-SD (Crédit d'impôt recherche), édition 2026 : frais de fonctionnement fixés à 40 % des dépenses de personnel de R&D. <https://www.impots.gouv.fr/sites/default/files/formulaires/2069-a-sd/2026/2069-a-sd_5270.pdf>
13. Hays, TJM freelance 2026, relayé par le Blog du Modérateur, 29 janvier 2026. <https://www.blogdumoderateur.com/freelance-tech-taux-journaliers-moyens-metier-2026/>
14. Malt, TJM affichés par les freelances actifs sur la plateforme, relevés en août–septembre 2026 (pas d'URL stable).
15. Institute for Defense Analyses, Document D-8367 (2017), citant une étude du DoD américain de 2006 : maintenance annuelle ≈ 20 % de l'effort de développement du parc installé (source secondaire).
16. B. W. Boehm, *Software Engineering Economics*, Prentice Hall, 1981 (COCOMO 81 ; trafic annuel de changements).
17. R. L. Glass, *Facts and Fallacies of Software Engineering*, Addison-Wesley, 2002 (la règle des 60/60).
18. B. Boehm et al., *COCOMO II Model Definition Manual*, version 2.1, USC, 2000 (driver RUSE, modèle de réutilisation, modèle de maintenance). Version livre : *Software Cost Estimation with COCOMO II*, Prentice Hall, 2000. <https://www.rose-hulman.edu/class/csse/csse372/201310/Homework/CII_modelman2000.pdf>
19. B. P. Lientz, E. B. Swanson, G. E. Tompkins, « Characteristics of application software maintenance », *Communications of the ACM* 21(6), 1978. DOI 10.1145/359511.359522. <https://doi.org/10.1145/359511.359522>
20. B. P. Lientz, E. B. Swanson, *Software Maintenance Management*, Addison-Wesley, 1980.
21. S. R. Schach, B. Jin, L. Yu, G. Z. Heller, J. Offutt, « Determining the distribution of maintenance categories: survey versus measurement », *Empirical Software Engineering* 8(4), 2003. DOI 10.1023/A:1025368318006. <https://doi.org/10.1023/A:1025368318006>
22. R. Zarnekow, W. Brenner, « Distribution of cost over the application lifecycle – a multi-case study », ECIS 2005. <https://aisel.aisnet.org/ecis2005/26>
23. RTI pour le NIST, *The Economic Impacts of Inadequate Infrastructure for Software Testing*, Planning Report 02-3, 2002 (tableau 5-1, « Example Only »). <https://www.nist.gov/system/files/documents/director/planning/report02-3.pdf>
24. The Register, « Everyone cites that 'bugs are 100x more expensive to fix in production' research, but the study might not even exist », 22 juillet 2021. <https://www.theregister.com/2021/07/22/bugs_expense_bs/>
25. L. Bossavit, *The Leprechauns of Software Engineering*, Leanpub, 2012–2015. <https://leanpub.com/leprechauns>
26. B. Boehm, V. R. Basili, « Software defect reduction top 10 list », *IEEE Computer* 34(1), 2001. DOI 10.1109/2.962984. <https://doi.org/10.1109/2.962984>
27. T. Menzies, W. Nichols, F. Shull, L. Layman, « Are delayed issues harder to resolve? Revisiting cost-to-fix of defects throughout the lifecycle », *Empirical Software Engineering* 22, 2017. DOI 10.1007/s10664-016-9469-x. Prépublication arXiv:1609.04886. <https://arxiv.org/abs/1609.04886>
28. W. C. Lim, « Effects of reuse on quality, productivity, and economics », *IEEE Software* 11(5), 1994. DOI 10.1109/52.311048 (non lu ; chiffre repris de la revue de Mohagheghi & Conradi). <https://doi.org/10.1109/52.311048>
29. P. Mohagheghi, R. Conradi, « Quality, productivity and economic benefits of software reuse: a review of industrial studies », *Empirical Software Engineering* 12(5), 2007. DOI 10.1007/s10664-007-9040-x. <https://doi.org/10.1007/s10664-007-9040-x>
30. J. S. Poulin, *Measuring Software Reuse*, Addison-Wesley, 1997 ; valeurs RCWR et RCR recommandées telles qu'indiquées dans le calculateur de réutilisation en ligne de l'auteur. <http://jeffreypoulin.info/html/reucalc_basic.html>
31. J. Krüger, T. Berger, « An empirical analysis of the costs of clone- and platform-oriented software reuse », ESEC/FSE 2020. DOI 10.1145/3368089.3409684. <https://www.cse.chalmers.se/~bergert/paper/2020-fse-reusecosts.pdf>
32. F. P. Brooks, *The Mythical Man-Month*, Addison-Wesley, 1975, chap. 2.
33. A. Begel, N. Nagappan, C. Poile, L. Layman, « Coordination in large-scale software teams », CHASE 2009 (atelier ICSE). DOI 10.1109/CHASE.2009.5071401. <https://andrewbegel.com/papers/coordination-chase09.pdf>
34. L. Xavier, A. Brito, A. Hora, M. T. Valente, « Historical and impact analysis of API breaking changes: a large-scale study », SANER 2017. DOI 10.1109/SANER.2017.7884616. <https://repositorio.ufmg.br/handle/1843/JCES-ARMPK6>
35. R. G. Kula, D. M. German, A. Ouni, T. Ishio, K. Inoue, « Do developers update their library dependencies? », *Empirical Software Engineering* 23(1), 2018. DOI 10.1007/s10664-017-9521-5. <https://doi.org/10.1007/s10664-017-9521-5>
36. B. Boehm et al., « Cost models for future software life cycle processes: COCOMO 2.0 », *Annals of Software Engineering* 1, 1995 ; la fig. 6 reproduit R. W. Selby, « Empirically analyzing software reuse in a production environment » (1988), 2 954 modules NASA. <https://staff.emu.edu.tr/alexanderchefranov/Documents/CMPE412/Boehm1995%20COCOMO%202%20.pdf>
37. B. Ray, M. Kim, « A case study of cross-system porting in forked projects », FSE 2012. DOI 10.1145/2393596.2393659. <https://baishakhir.github.io/uploads/fse2012-bsd.pdf>
38. M. Mondal, C. K. Roy, K. A. Schneider, « Bug propagation through code cloning: an empirical study », ICSME 2017. <https://clones.usask.ca/pubfiles/articles/MondalICSME2017BugPropagation.pdf>
39. M. Mondal, B. Roy, C. K. Roy, K. A. Schneider, « An empirical study on bug propagation through code cloning », *Journal of Systems and Software* 158, 2019. DOI 10.1016/j.jss.2019.110407. <https://clones.usask.ca/pubfiles/articles/MMondalBugProposationJSS.pdf>
40. E. Juergens, F. Deissenboeck, B. Hummel, S. Wagner, « Do code clones matter? », ICSE 2009. DOI 10.1109/ICSE.2009.5070547. Prépublication arXiv:1701.05472. <https://arxiv.org/abs/1701.05472>
41. M. R. Islam, M. F. Zibran, A. Nagpal, « Security vulnerabilities in categories of clones and non-cloned code: an empirical study », ESEM 2017. DOI 10.1109/ESEM.2017.9. <https://doi.org/10.1109/ESEM.2017.9>
42. S. Zhou, B. Vasilescu, C. Kästner, « How has forking changed in the last 20 years? A study of hard forks on GitHub », ICSE 2020. <https://www.cs.cmu.edu/~shuruiz/paper/icse20-hardfork.pdf>
43. J. Businge, M. Openja, S. Nadi, T. Berger, « Reuse and maintenance practices among divergent forks in three software ecosystems », *Empirical Software Engineering* 27, 2022. DOI 10.1007/s10664-021-10078-2. <https://doi.org/10.1007/s10664-021-10078-2>
44. C. J. Kapser, M. W. Godfrey, « 'Cloning considered harmful' considered harmful: patterns of cloning in software », *Empirical Software Engineering* 13(6), 2008. DOI 10.1007/s10664-008-9076-6. <https://doi.org/10.1007/s10664-008-9076-6>
45. M. Kim, V. Sazawal, D. Notkin, G. C. Murphy, « An empirical study of code clone genealogies », ESEC/FSE 2005 (version rapport technique UW-CSE-05-04-01). <https://dada.cs.washington.edu/research/tr/2005/04/UW-CSE-05-04-01.pdf>
46. F. Rahman, C. Bird, P. Devanbu, « Clones: what is that smell? », *Empirical Software Engineering* 17, 2012. DOI 10.1007/s10664-011-9195-3. <https://doi.org/10.1007/s10664-011-9195-3>
47. S. Metz, « The wrong abstraction », billet de blog, 20 janvier 2016 (opinion). <https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction>
48. K. Pohl, G. Böckle, F. van der Linden, *Software Product Line Engineering*, Springer, 2005, fig. 1.1. DOI 10.1007/3-540-28901-1. <https://doi.org/10.1007/3-540-28901-1>
49. GitClear, rapport *AI Copilot Code Quality*, 2025 (analyse d'éditeur portant sur 211 M de lignes modifiées, 2020–2024 ; lu via la couverture presse).
50. M. Borg et al., « Echoes of AI: investigating the downstream effects of AI assistants on software maintainability », *Empirical Software Engineering* 31, 2026. DOI 10.1007/s10664-026-10889-1. Prépublication arXiv:2507.00788. <https://arxiv.org/abs/2507.00788>
51. S. Pan et al., « Automating zero-shot patch porting for hard forks » (PPatHF), 2024, arXiv:2404.17964. <https://arxiv.org/abs/2404.17964>
