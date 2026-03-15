# V13-3 — UI closeout documentation

## Objectif du lot

Le lot V13-3 clôt la séquence V13 consacrée au durcissement final de la base UI.

Après :

- V13-1 — Stable pattern cleanup
- V13-2 — Structural storefront CSS audit

ce lot a pour objectif de transformer les décisions prises pendant V12 et V13 en documentation claire, stable et exploitable pour la suite du projet.

L’enjeu n’est plus de migrer des écrans, ni de supprimer du CSS à tout prix. L’enjeu est de rendre explicite l’état final du système UI tel qu’il existe réellement dans le repo.

## Intention

V13-3 est un lot de formalisation.

Il doit empêcher deux dérives fréquentes :

- relancer plus tard un faux chantier de nettoyage sur des zones déjà stabilisées
- perdre la mémoire des décisions prises pendant la migration UI

Ce lot sert donc à documenter clairement :

- ce qui est désormais stabilisé
- ce qui reste volontairement en CSS global
- ce qui n’est plus une dette prioritaire
- ce qui pourra éventuellement être repris plus tard dans un autre cadre, mais sans urgence

## Résultat attendu

À l’issue de V13-3, le projet doit disposer d’une documentation de clôture UI suffisamment claire pour qu’un futur intervenant comprenne immédiatement :

- quels composants sont devenus la base UI courante
- quelles conventions sont désormais retenues
- quelles familles de styles globaux restent actives et pourquoi
- quelles zones ont été considérées comme structurelles et non plus comme du legacy à supprimer
- où se situe désormais la vraie priorité du projet

## Ce que couvre ce lot

V13-3 couvre :

- la documentation finale de la migration UI
- la synthèse des composants stabilisés
- la synthèse des conventions retenues
- la documentation du CSS global conservé volontairement
- la clarification des patterns résiduels acceptés
- la formulation explicite de la sortie du chantier UI

## Ce que ce lot ne couvre pas

V13-3 ne couvre pas :

- une nouvelle passe de migration d’écrans
- une suppression CSS large
- une refonte de composants
- une extraction registry
- des changements métier ou serveur

## Questions auxquelles le lot doit répondre

Le lot doit répondre de manière claire aux questions suivantes :

### 1. Quelle est la base UI désormais officielle du projet ?

Il faut identifier explicitement les composants et patterns qui servent maintenant de référence courante.

### 2. Quel CSS global reste volontairement dans le projet ?

Le but n’est pas de tout supprimer, mais d’expliquer clairement ce qui reste et pourquoi.

### 3. Qu’est-ce qui n’est plus considéré comme une dette prioritaire ?

Certaines classes ou structures encore présentes doivent être documentées comme des choix acceptés, pas comme des reliquats honteux.

### 4. Quelle est la bonne priorité après la clôture UI ?

La documentation doit rendre évident que la priorité peut revenir au produit et au métier.

## Contenu attendu de la documentation

La documentation finale issue de ce lot doit idéalement couvrir les points suivants.

### 1. Composants stabilisés

Lister les composants confirmés par plusieurs usages et désormais considérés comme la base UI active du projet.

Exemples typiques :

- shells admin stabilisés
- sections de formulaire admin
- actions de formulaire admin
- notices transverses
- composants shadcn devenus la norme courante sur plusieurs écrans

### 2. Conventions UI retenues

Documenter les conventions qui ont émergé pendant la migration, par exemple :

- usage de `Button` pour les actions principales
- usage de `Notice` pour les retours d’état
- usage de `AdminPageShell` pour les pages admin
- usage de `Input`, `Label`, `Badge` quand cela apporte un vrai gain de cohérence
- préférence pour un Tailwind local explicite quand une abstraction n’apporte pas plus de clarté

### 3. CSS global conservé intentionnellement

Documenter les familles de styles globales qui restent actives et qui sont désormais assumées comme structurelles ou légitimes.

Exemples possibles selon l’état réel du repo :

- layout storefront structurel
- classes de cartes storefront
- classes de métadonnées encore utiles
- classes éditoriales isolées encore acceptées

### 4. Patterns résiduels acceptés

Certains patterns peuvent être encore présents sans constituer une priorité de reprise.

Il faut documenter ce statut explicitement, afin de sortir d’une logique où tout ce qui est global serait considéré comme un bug latent.

### 5. Frontière avec la suite du projet

La doc doit dire clairement que la suite logique n’est plus une grande migration UI, mais un retour vers des sujets de valeur produit ou des micro-ajustements ciblés seulement si nécessaire.

## Forme attendue

La documentation produite dans ce lot doit être :

- lisible rapidement
- sobre
- durable
- orientée décision
- sans jargon inutile
- directement exploitable par un futur intervenant sur le repo

## Principes rédactionnels

### 1. Documenter le réel, pas l’idéal abstrait

Il ne faut pas documenter un design system rêvé. Il faut documenter l’état réellement stabilisé dans le projet.

### 2. Préférer les décisions explicites aux formulations floues

Par exemple, il vaut mieux écrire :

- cette famille de classes est conservée volontairement comme CSS structurel storefront

plutôt que :

- cette zone pourra peut-être être revisitée un jour

### 3. Éviter la culpabilisation du CSS restant

Le CSS global restant n’est pas nécessairement une dette. Une partie doit maintenant être assumée comme un socle structurel stable.

### 4. Rendre la sortie du chantier visible

Le but de V13-3 est aussi de marquer clairement la fin de la phase de migration UI comme sujet principal.

## Livrables attendus

Le lot doit idéalement produire :

- une synthèse finale de la base UI stabilisée
- une synthèse des conventions retenues
- une synthèse du CSS global conservé volontairement
- une clarification explicite de la fin du chantier UI
- une orientation claire pour la suite du projet

## Validation attendue

### Validation documentaire

La documentation doit permettre à une personne découvrant le repo de comprendre en peu de temps :

- où se situe la base UI officielle
- quelles règles implicites sont devenues explicites
- ce qui reste volontairement global
- pourquoi il n’est plus rationnel de poursuivre un nettoyage massif

### Validation projet

La documentation doit aider à réorienter naturellement le projet vers les sujets à plus forte valeur métier une fois la phase UI clôturée.

## Anti-patterns à éviter

### 1. Écrire une documentation trop vague

Si la doc reste trop générale, elle ne protège pas le repo contre le retour d’un faux chantier UI plus tard.

### 2. Présenter comme “temporaire” ce qui est déjà stabilisé

Quand une décision a déjà été prise dans les faits, elle doit être documentée comme telle.

### 3. Documenter une architecture fictive

La documentation doit coller au code réellement en place, pas à une projection théorique.

### 4. Repartir dans une roadmap UI infinie

V13-3 doit justement empêcher ce glissement.

## Résumé

V13-3 est le lot de clôture documentaire du chantier UI.

Il sert à rendre explicite ce que la migration a réellement produit :

- une base UI stabilisée
- un CSS global restant assumé et qualifié
- des conventions claires
- une sortie propre de la phase de migration

Une fois ce lot terminé, le projet doit pouvoir considérer que la UI n’est plus le sujet principal, sauf micro-ajustements ciblés ou besoins fonctionnels futurs.
