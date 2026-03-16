# V14-8 — Cart and checkout structure cleanup

## Objectif du lot

Le lot V14-8 ouvre l’un des chantiers les plus sensibles de la seconde vague V14 : le panier et le checkout.

Après les lots précédents, une grande partie des patterns simples ou intermédiaires a déjà été traitée. Ce qui reste ici relève de structures storefront transactionnelles encore largement portées par le CSS global.

L’objectif de V14-8 n’est pas de refondre ces écrans, mais de déterminer jusqu’où certaines sous-familles `cart-*` et `checkout-*` peuvent être remplacées proprement, sans casser les flux critiques ni alourdir excessivement le JSX.

## Intention

Ce lot est un lot de cleanup structurel prudent.

Le panier et le checkout sont des zones à forte sensibilité, car elles combinent :

- layout responsive
- récapitulatif de commande
- formulaires ou actions utilisateur
- résumés de lignes
- interactions métier importantes

Le principe doit donc rester très strict :

> ne remplacer que les sous-familles dont le bénéfice est net, et conserver explicitement tout ce qui reste plus lisible ou plus sûr en CSS global.

## Résultat attendu

À l’issue de V14-8, le projet doit idéalement :

- clarifier quelles sous-familles `cart-*` et `checkout-*` sont réellement remplaçables
- supprimer certaines règles structurelles si leur remplacement local reste lisible
- conserver explicitement les sous-familles qui restent meilleures en CSS global
- éviter toute régression visuelle, responsive ou fonctionnelle
- ne produire aucun changement métier

## Ce que couvre ce lot

V14-8 couvre :

- l’audit des classes `cart-*` et `checkout-*` encore actives
- leur découpage en sous-familles si nécessaire
- leur qualification par sous-famille
- leur remplacement local uniquement si le ratio gain / risque est bon
- la suppression de règles réellement mortes après cleanup
- la documentation explicite des sous-familles conservées

## Ce que ce lot ne couvre pas

V14-8 ne couvre pas :

- une refonte du panier ou du checkout
- des changements métier sur les flux de commande
- des modifications serveur ou validation métier
- le traitement des familles produit/variante hors dépendance stricte
- la création de nouveaux composants abstraits sans nécessité forte

## Cibles probables

Les familles les plus probables dans ce lot sont :

- `.cart-page`
- `.cart-layout`
- `.cart-list`
- `.cart-summary`
- `.cart-line`
- `.cart-add-form`
- `.cart-line-form`
- `.checkout-layout`
- `.checkout-form`
- `.checkout-summary`
- `.checkout-line-list`
- `.checkout-line`

Cette liste doit être confirmée par l’état réel du repo.

## Nature des patterns ciblés

Ces classes sont plus denses que les helpers publics simples et touchent directement des flux transactionnels.

Elles peuvent porter :

- des grilles 2 colonnes responsive
- des sous-listes de lignes de commande
- des wrappers de formulaires
- des groupes d’actions
- des résumés latéraux

Cela signifie qu’un nettoyage réussi doit respecter deux contraintes simultanées :

1. préserver parfaitement le comportement et le responsive
2. ne pas dégrader la lisibilité du code

## Questions auxquelles le lot doit répondre

### 1. Les familles `cart-*` et `checkout-*` sont-elles divisibles en sous-familles traitables ?

Certaines classes peuvent être très simples à remplacer, tandis que d’autres restent trop centrales pour ce lot.

### 2. Certaines sous-familles sont-elles déjà presque locales ?

Si une classe n’a plus qu’un ou deux usages très homogènes, elle peut devenir un bon candidat.

### 3. Le remplacement local rend-il le JSX plus clair ?

Si le résultat ajoute beaucoup de classes pour très peu de gain, la conservation est préférable.

### 4. Le responsive reste-t-il parfaitement maîtrisé ?

C’est un point critique, notamment pour :

- les layouts à deux colonnes
- les listes de lignes
- les panneaux résumé
- les formulaires checkout

### 5. Y a-t-il des contraintes e2e ou des sélecteurs partagés ?

Le lot doit tenir compte de toute dépendance tests ou de règles groupées qui empêcheraient un cleanup propre.

### 6. La règle CSS devient-elle réellement morte ?

La suppression n’est justifiée que si les usages ont réellement disparu.

## Principes de décision

### 1. Traiter par sous-famille, pas en bloc global

Le lot ne doit pas essayer de faire tomber tout `cart-*` ou tout `checkout-*` d’un coup.

### 2. Conserver ce qui reste structurellement meilleur en CSS global

Si une classe reste plus lisible et plus stable en CSS global, elle doit être conservée.

### 3. Priorité absolue à la stabilité responsive

Le moindre nettoyage sur ces zones doit être validé contre les breakpoints réels.

### 4. Aucun changement métier, même implicite

Le lot ne doit toucher qu’à la couche de présentation.

## Méthode recommandée

Le déroulé recommandé est :

1. lister les occurrences réelles des familles `cart-*` et `checkout-*`
2. les regrouper en sous-familles cohérentes
3. qualifier chaque sous-famille :
   - à remplacer maintenant
   - à conserver
   - à repousser
4. choisir un plan minimal
5. appliquer uniquement les remplacements réellement justifiés
6. vérifier si certaines règles deviennent mortes
7. supprimer uniquement les règles prouvées inutiles
8. lancer le typecheck
9. documenter précisément les décisions prises

## Validation attendue

### Validation technique

- `pnpm run typecheck`
- aucune suppression CSS injustifiée
- aucun changement de comportement

### Validation visuelle

Vérifier en particulier :

- le panier vide
- le panier avec lignes
- les résumés de panier
- le checkout avec formulaire
- le checkout avec lignes de commande
- le layout desktop à deux colonnes
- le comportement mobile / tablette / desktop

### Validation fonctionnelle

Vérifier que les flux critiques restent identiques :

- ajout au panier
- modification de quantité
- suppression de ligne
- checkout
- confirmation de commande

## Anti-patterns à éviter

### 1. Transformer le lot en refonte du tunnel de commande

Le but est le cleanup CSS, pas la refonte UX du panier/checkout.

### 2. Toucher trop de sous-familles à la fois

Le lot doit rester lisible et pouvoir être validé correctement.

### 3. Sacrifier un layout robuste pour quelques lignes de CSS en moins

Le responsive et la stabilité priment.

### 4. Introduire du Tailwind inline trop lourd

Le résultat doit rester plus clair, pas juste “moins global CSS”.

## Livrables attendus

Le lot doit idéalement produire :

- un audit clair des sous-familles `cart-*` et `checkout-*`
- un petit nombre de remplacements réellement justifiés
- la suppression éventuelle de règles devenues mortes
- une justification explicite des sous-familles conservées

## Suite logique

Une fois V14-8 terminé, la suite logique est :

### V14-9 — Product and variant structure cleanup

Ce lot pourra traiter la fiche produit et les variantes, avec un périmètre dense comparable mais sur une autre zone storefront.

## Résumé

V14-8 est un lot de cleanup structurel transactionnel.

Il sert à déterminer jusqu’où le panier et le checkout peuvent sortir du CSS global sans casser les flux critiques, le responsive ou la lisibilité du code.
