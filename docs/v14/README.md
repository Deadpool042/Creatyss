# V14 — Progressive custom CSS elimination

## Contexte

La V12 a permis de migrer une grande partie des écrans admin et storefront vers une base UI plus cohérente, avec une adoption progressive de composants réutilisables et de primitives shadcn.

La V13 a ensuite servi à clôturer proprement cette séquence :

- nettoyage final des derniers patterns globaux simples
- audit du CSS structurel storefront restant
- documentation de clôture UI

À l’issue de cette phase, le projet ne contient plus une masse de CSS global “accidentelle”, mais il reste encore un ensemble de classes custom actives, principalement côté storefront.

Ces classes sont désormais identifiées, qualifiées et documentées.

La V14 part d’un choix explicite : **réduire autant que possible le CSS custom restant**, de manière méthodique, lot par lot, sans rouvrir de refonte brutale et sans casser les flux métier.

## Objectif de V14

La V14 vise à faire disparaître progressivement les dernières classes CSS custom encore actives, en les remplaçant par :

- du Tailwind local explicite
- des composants UI déjà stabilisés
- ou, plus rarement, des structures plus sobres déjà présentes dans le code

L’objectif n’est pas d’optimiser “un peu” le CSS. L’objectif est de tendre vers une base où le CSS global restant devient minimal, intentionnel, clairement justifié, voire presque nul sur les patterns de présentation courants.

## Ce que V14 n’est pas

La V14 n’est pas :

- une refonte design complète
- un chantier produit métier
- une réécriture opportuniste de tous les écrans en parallèle
- une phase d’abstraction supplémentaire
- une migration “idéologique” qui casserait des layouts stables pour supprimer quelques lignes de CSS

Chaque lot V14 doit rester :

- petit
- lisible
- sûr
- ciblé sur une famille de classes
- sans changement de comportement

## Hypothèse de travail

Après V13, il reste encore plusieurs familles de classes custom actives.

Elles ne sont pas toutes au même niveau de difficulté.

Certaines relèvent de la présentation simple et peuvent être éliminées avec un faible risque.
D’autres portent encore une part de structure storefront et doivent être traitées avec plus de précaution.

La V14 doit donc procéder **par ordre croissant de difficulté**.

## Principe central

La règle de V14 est simple :

> On supprime le CSS custom par familles cohérentes, uniquement lorsque le remplacement est lisible, sûr et maintenable.

Une classe custom ne doit pas être conservée par habitude.
Mais elle ne doit pas non plus être supprimée si cela impose un refactor disproportionné ou un résultat moins clair.

## Priorité V14

La priorité de V14 est de traiter d’abord les classes encore simples à remplacer, puis de remonter progressivement vers les classes plus structurelles.

### Ordre recommandé

1. patterns de texte / métadonnées encore globaux
2. patterns de cartes et d’états simples
3. classes structurelles storefront plus denses
4. audit final de ce qu’il reste

## Types de classes visés

Selon l’audit V13, la V14 a vocation à traiter progressivement des familles comme :

- `.meta-label`
- `.card-kicker`
- `.card-meta`
- `.card-copy`
- `.variant-meta`
- `.empty-state`
- `.card-grid`
- `.store-card`
- puis, si pertinent plus tard :
  - `.product-*`
  - `.variant-*`
  - `.cart-*`
  - `.checkout-*`
  - `.article-*`

L’ordre exact dépendra du rapport gain / risque réel constaté dans le repo.

## Contraintes générales

Chaque lot V14 doit respecter les règles suivantes :

- aucun changement métier
- aucune modification de logique serveur sans demande explicite
- aucune nouvelle dépendance
- TypeScript strict
- aucun `any`
- pas de nouveau composant abstrait sans nécessité forte
- pas de refonte visuelle large
- pas de migration transversale incontrôlée
- cleanup CSS uniquement si la règle devient réellement morte

## Méthode de travail

Chaque lot V14 doit suivre ce déroulé :

1. identifier une famille de classes précise
2. auditer ses usages réels
3. vérifier si les usages sont homogènes ou non
4. choisir le remplacement le plus simple et le plus lisible
5. appliquer les changements sur un périmètre limité
6. vérifier si la règle CSS devient morte
7. supprimer la règle uniquement si c’est prouvé
8. relancer le typecheck
9. documenter clairement ce qui a été supprimé et ce qui a été laissé en place

## Doctrine de décision

### 1. Remplacer localement avant d’abstraire

Si quelques classes Tailwind inline suffisent à remplacer proprement une classe globale, cette solution est préférable à la création d’un nouveau composant.

### 2. Traiter une famille à la fois

La V14 doit rester compréhensible. Chaque lot doit porter un sujet clair.

### 3. Éviter les demi-nettoyages

Supprimer une règle CSS tout en laissant partout son nom de classe inerte dans le markup est rarement une bonne solution.

Quand un cleanup est entrepris, il doit être cohérent :

- remplacement local
- suppression du markup devenu inutile
- suppression de la règle CSS si elle est morte

### 4. Conserver la lisibilité du markup

Le fait d’éliminer du CSS global n’est pas une fin en soi si le markup devient illisible.

Le projet doit rester maintenable et sobre.

## Structure recommandée de V14

### V14-1 — `.meta-label` storefront cleanup

Premier lot recommandé.

C’est une famille encore très visible, simple à comprendre, mais répartie sur plusieurs écrans. Elle constitue un bon test de méthode pour la V14.

### V14-2 — Storefront text/meta cleanup

Élimination progressive de classes comme :

- `.card-kicker`
- `.card-meta`
- `.card-copy`
- `.variant-meta`

si leur remplacement local est suffisamment cohérent.

### V14-3 — Simple public layout helpers cleanup

Traitement de classes comme :

- `.empty-state`
- `.card-grid`
- `.store-card`

si la structure locale devient suffisamment claire sans elles.

### V14-4 — Dense storefront structure cleanup

Phase plus prudente, à n’ouvrir que si les lots précédents se passent bien.

Cibles possibles :

- `.product-*`
- `.variant-*`
- `.cart-*`
- `.checkout-*`

### V14-5 — Editorial cleanup

Éventuel lot pour les classes éditoriales restantes :

- `.article-*`

uniquement si cela reste utile et lisible.

### V14-6 — Final audit

Audit final des dernières règles custom restantes, avec décision claire sur ce qui peut disparaître et ce qui doit être conservé comme structure résiduelle assumée.

## Résultat attendu

À la fin de V14, Creatyss doit disposer :

- d’un CSS custom fortement réduit
- d’un markup plus explicite localement
- d’une base visuelle toujours stable
- d’une dépendance minimale au global CSS pour les patterns de présentation courants
- d’un socle suffisamment propre pour que les prochains sujets redeviennent principalement métier

## Sortie attendue de V14

Quand la V14 sera terminée, le projet devra pouvoir affirmer clairement :

- le CSS global restant est soit minimal, soit structurellement justifié
- les patterns de présentation courants ne dépendent plus d’un ancien système global diffus
- la base frontend est suffisamment propre pour ne plus faire de la dette CSS un sujet prioritaire

## Résumé

La V14 est une phase de suppression méthodique du CSS custom restant.

Elle ne cherche pas à tout refaire. Elle cherche à terminer le travail de simplification commencé en V12 et clôturé en V13, en supprimant progressivement les dernières classes globales encore remplaçables proprement.

Le principe est simple :

- une famille à la fois
- aucun changement métier
- cleanup seulement s’il est propre
- lisibilité du code avant tout
