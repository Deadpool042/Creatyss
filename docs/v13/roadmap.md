# Roadmap V13

## Objectif général

La V13 prolonge la V12 sans rouvrir un chantier massif de refonte.

Son rôle est de finaliser le durcissement UI là où cela reste utile, puis de clarifier explicitement ce qui doit désormais être considéré comme du CSS structurel stable du projet.

La V13 doit permettre de sortir proprement de la phase de migration UI pour revenir ensuite sur des priorités plus métier.

## Principes de travail

Chaque lot V13 doit respecter les règles suivantes :

- petit incrément uniquement
- pas de changement métier
- pas de changement de logique serveur
- pas de nouvelle dépendance
- pas de refonte large d’écran sans nécessité forte
- suppression CSS seulement si la règle est réellement morte
- priorité à la lisibilité du code et à la cohérence du système existant

## V13-1 — Stable pattern cleanup

### Objectif

Traiter les derniers patterns globaux simples encore perfectibles, lorsque le gain est réel et le risque faible.

### Cibles possibles

- `.meta-label` côté storefront
- `.eyebrow` dans les derniers composants résiduels
- `.lead` sur les usages éditoriaux isolés
- quelques labels implicites encore présents dans les formulaires storefront

### Intention

Ce lot ne cherche pas à réécrire les layouts structurels.

Il vise seulement à réduire les derniers patterns globaux simples qui n’ont plus vraiment besoin d’exister sous forme de CSS partagé si une alternative plus locale et plus claire est désormais évidente.

### Ce que couvre ce lot

- petits remplacements ciblés par Tailwind inline ou composants UI déjà stabilisés
- suppression de règles CSS réellement mortes après migration
- harmonisation légère de quelques détails de présentation

### Ce que ce lot ne couvre pas

- refonte structurelle du storefront
- création de nouveaux composants de thème abstraits
- changements métier

## V13-2 — Structural storefront CSS audit

### Objectif

Faire un audit explicite du CSS structurel encore vivant côté storefront afin de décider clairement ce qui doit être conservé, simplifié ou laissé tel quel.

### Cibles d’audit

- `.cart-*`
- `.checkout-*`
- `.product-*`
- `.variant-*`
- `.article-*`
- classes storefront transverses encore actives

### Intention

L’objectif n’est pas de supprimer tout le CSS global restant.

L’objectif est de documenter et stabiliser une décision explicite :

- ce qui reste du CSS structurel assumé
- ce qui peut encore être simplifié plus tard
- ce qui ne mérite plus d’être traité car le gain serait trop faible

### Ce que couvre ce lot

- audit du CSS global storefront encore actif
- qualification des classes restantes
- identification des patterns vraiment structurels
- éventuel cleanup mineur uniquement si 100% sûr

### Ce que ce lot ne couvre pas

- migration brute de tous les layouts storefront
- réécriture massive des fiches produit, panier ou checkout
- abstraction supplémentaire sans besoin clair

## V13-3 — UI closeout documentation

### Objectif

Clôturer proprement la phase de migration UI par une documentation claire de l’état final du système.

### Attendus

- liste des composants stabilisés
- conventions UI retenues
- CSS global conservé volontairement
- patterns résiduels acceptés
- frontières claires entre UI stabilisée et futurs sujets métier

### Intention

Ce lot sert à éviter qu’un futur travailleur du repo relance un faux chantier de nettoyage là où des décisions ont déjà été prises.

Il doit rendre explicite ce qui est désormais :

- stable
- intentionnel
- hors dette prioritaire

## Ordre recommandé

1. V13-1 — Stable pattern cleanup
2. V13-2 — Structural storefront CSS audit
3. V13-3 — UI closeout documentation

## Suite après V13

Une fois V13 terminée, la priorité peut revenir à des sujets plus métier, par exemple :

- paiement réel
- gestion de stock
- durcissement du flux commande
- robustesse transactionnelle

## Résultat attendu

À la fin de V13, Creatyss doit disposer :

- d’une UI stabilisée
- d’un CSS global restant assumé et documenté
- d’un nombre réduit de patterns ambigus
- d’une base suffisamment propre pour que le prochain chantier principal soit métier, pas visuel
