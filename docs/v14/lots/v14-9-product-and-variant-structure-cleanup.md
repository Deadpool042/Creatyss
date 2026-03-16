# V14-9 — Product and variant structure cleanup

## Objectif du lot

Le lot V14-9 poursuit la seconde vague V14 sur une autre zone dense du storefront : la fiche produit et les variantes.

Après les lots précédents, plusieurs classes de présentation simples ont déjà disparu, et une première partie du cleanup structurel a été menée sur la page produit. Ce qui reste désormais concerne des familles encore plus proches du cœur du layout produit.

L’objectif de V14-9 n’est pas de refondre la fiche produit, ni de casser les sélecteurs e2e existants. Il est d’identifier, sous-famille par sous-famille, ce qui peut encore sortir de `globals.css` proprement, et ce qui doit rester comme structure storefront assumée.

## Intention

Ce lot est un lot de cleanup structurel dense, mais ciblé.

La fiche produit et les variantes combinent :

- une galerie
- des blocs de résumé
- des cartes de variantes
- des groupes de détails
- des médias
- des interactions liées au panier

Il ne s’agit donc pas d’une zone où l’on peut faire du nettoyage brut. Le principe doit rester :

> ne remplacer que les sous-familles réellement prêtes, et conserver explicitement celles dont le maintien en CSS global reste plus clair, plus stable ou imposé par les tests.

## Résultat attendu

À l’issue de V14-9, le projet doit idéalement :

- clarifier quelles sous-familles `product-*` et `variant-*` restent réellement remplaçables
- supprimer certaines règles structurelles si leur remplacement local reste lisible
- conserver explicitement les sous-familles qui restent meilleures en CSS global
- éviter toute régression visuelle, responsive ou e2e
- ne produire aucun changement métier

## Ce que couvre ce lot

V14-9 couvre :

- l’audit des classes `product-*` et `variant-*` encore actives
- leur découpage en sous-familles si nécessaire
- leur qualification par sous-famille
- leur remplacement local uniquement si le ratio gain / risque est bon
- la suppression de règles réellement mortes après cleanup
- la documentation explicite des sous-familles conservées

## Ce que ce lot ne couvre pas

V14-9 ne couvre pas :

- une refonte de la fiche produit
- des changements métier liés aux variantes, au stock ou au panier
- des modifications serveur ou validation métier
- le traitement opportuniste des familles `cart-*` et `checkout-*`
- la création de nouveaux composants abstraits sans nécessité forte

## Cibles probables

Les familles les plus probables dans ce lot sont :

- `.product-gallery`
- `.product-panel`
- `.product-summary`
- `.product-summary-header`
- `.product-summary-stats`
- `.product-summary-stat`
- `.product-copy`
- `.variant-list`
- `.variant-card`
- `.variant-header`
- `.variant-purchase`
- `.variant-details`
- `.variant-detail`
- `.variant-images`
- `.variant-media`

Cette liste doit être confirmée par l’état réel du repo.

## Nature des patterns ciblés

Ces classes sont parmi les plus sensibles du storefront, car elles mêlent :

- structure de layout
- rythme vertical
- organisation des métadonnées produit
- médias et galeries
- cartes et détails de variantes
- sélecteurs parfois observés par les tests e2e

Cela implique que le cleanup ne peut réussir que si trois conditions sont réunies :

1. le remplacement local reste lisible
2. le responsive et la structure visuelle restent identiques
3. les dépendances e2e ou sélecteurs descendants ne sont pas cassés

## Questions auxquelles le lot doit répondre

### 1. Les familles `product-*` et `variant-*` sont-elles divisibles en sous-familles réellement traitables ?

Certaines classes peuvent être encore simples à sortir, alors que d’autres resteront clairement structurelles.

### 2. Certaines sous-familles sont-elles bloquées par les tests e2e ?

Les classes servant de points d’ancrage aux sélecteurs de tests doivent être traitées avec une extrême prudence.

### 3. Le remplacement local améliore-t-il réellement le code ?

Si le JSX devient plus lourd, plus bruyant ou moins lisible, le cleanup n’est pas un gain.

### 4. Les groupes de règles partagées empêchent-ils des suppressions fines ?

Si certaines sous-familles sont encore liées à des règles groupées, elles peuvent devoir être repoussées ou traitées seulement après découplage.

### 5. Le responsive et les médias restent-ils parfaitement maîtrisés ?

C’est particulièrement important pour :

- la galerie produit
- les images de variantes
- les cartes variantes
- les grilles de détails
- les wrappers média et `object-fit`

### 6. La règle CSS devient-elle réellement morte ?

La suppression n’est justifiée que si tous les usages réels ont disparu.

## Principes de décision

### 1. Traiter par sous-famille, jamais en bloc global

Le lot ne doit pas essayer de faire tomber tout `product-*` ou tout `variant-*` en une passe.

### 2. Conserver ce qui reste meilleur en CSS global

Si une sous-famille reste plus claire, plus stable ou mieux testée en CSS global, elle doit être conservée.

### 3. Priorité absolue à la stabilité visuelle et aux tests

Le layout produit et les variantes sont des zones visibles et sensibles. Toute régression ici est coûteuse.

### 4. Aucun changement métier implicite

Le lot ne doit toucher qu’à la couche de présentation.

## Méthode recommandée

Le déroulé recommandé est :

1. lister les occurrences réelles des familles `product-*` et `variant-*`
2. les regrouper en sous-familles cohérentes
3. vérifier les dépendances e2e et sélecteurs descendants
4. qualifier chaque sous-famille :
   - à remplacer maintenant
   - à conserver
   - à repousser
5. choisir un plan minimal
6. appliquer uniquement les remplacements réellement justifiés
7. vérifier si certaines règles deviennent mortes
8. supprimer uniquement les règles prouvées inutiles
9. lancer le typecheck
10. documenter précisément les décisions prises

## Validation attendue

### Validation technique

- `pnpm run typecheck`
- aucune suppression CSS injustifiée
- aucune régression e2e connue
- aucun changement de comportement

### Validation visuelle

Vérifier en particulier :

- le layout général de la page produit
- la galerie et les médias
- les prix et métadonnées produit
- les cartes variantes
- les badges et détails de variantes
- les images de variantes
- le responsive mobile / tablette / desktop

### Validation fonctionnelle

Vérifier que les flux critiques restent identiques :

- affichage des variantes
- ajout au panier
- rendu des images produit et variante
- affichage du résumé produit

## Anti-patterns à éviter

### 1. Transformer le lot en refonte de la fiche produit

Le but est le cleanup CSS, pas la réécriture de l’écran produit.

### 2. Casser des sélecteurs e2e pour quelques lignes de CSS en moins

Ce serait un mauvais échange.

### 3. Déplacer trop de structure dans le JSX

Le résultat doit rester plus clair, pas seulement plus “inline”.

### 4. Toucher trop de sous-familles à la fois

Le lot doit rester lisible et validable.

## Livrables attendus

Le lot doit idéalement produire :

- un audit clair des sous-familles `product-*` et `variant-*`
- un petit nombre de remplacements réellement justifiés
- la suppression éventuelle de règles devenues mortes
- une justification explicite des sous-familles conservées

## Suite logique

Une fois V14-9 terminé, la suite logique est :

### V14-10 — Real final audit

Ce lot devra établir le véritable état final du CSS custom restant après toute la seconde vague V14, avec une lecture honnête de ce qui est encore assumé.

## Résumé

V14-9 est un lot de cleanup structurel dense sur la fiche produit et les variantes.

Il sert à déterminer jusqu’où cette zone storefront peut sortir du CSS global sans casser les tests, la lisibilité ou la stabilité visuelle du produit.
