# V14-3 — Simple public layout helpers cleanup

## Objectif du lot

Le lot V14-3 prend le relais après les familles de texte et de métadonnées traitées dans les premiers lots de V14.

Son objectif est de s’attaquer aux helpers publics de layout encore globaux mais relativement simples, lorsque leur remplacement local peut être fait proprement sans dégrader la lisibilité du markup ni introduire une duplication excessive.

Ce lot reste un lot de cleanup ciblé. Il ne doit pas devenir une refonte du storefront.

## Intention

V14-3 vise les helpers de structure légère utilisés sur plusieurs pages publiques, par exemple pour :

- des états vides
- des grilles simples
- des cartes storefront génériques

L’objectif est de vérifier si ces helpers restent utiles comme conventions globales, ou si le projet est désormais assez stabilisé pour que ces structures soient rendues explicitement au niveau local.

## Résultat attendu

À l’issue de V14-3, le projet doit idéalement :

- réduire certaines classes globales de layout léger encore actives
- conserver une structure storefront lisible
- éviter la duplication inutile
- supprimer uniquement les règles CSS réellement mortes
- ne provoquer aucun changement métier ni aucune régression de mise en page

## Ce que couvre ce lot

V14-3 couvre :

- l’audit des helpers publics de layout léger encore actifs
- leur qualification par famille
- leur remplacement local si le gain est réel
- la suppression des règles CSS devenues réellement mortes
- l’harmonisation minimale nécessaire des structures publiques touchées

## Ce que ce lot ne couvre pas

V14-3 ne couvre pas :

- les classes de layout storefront dense
- la refonte des structures `.product-*`, `.variant-*`, `.cart-*`, `.checkout-*`
- une nouvelle abstraction de composant
- des changements métier ou serveur
- des migrations opportunistes sans cohérence de famille

## Cibles probables

Les classes les plus probables dans ce lot sont :

- `.empty-state`
- `.card-grid`
- `.store-card`

Cette liste doit être confirmée par l’état réel du repo.

## Nature des patterns ciblés

Ces helpers sont plus structurels que les simples styles texte, mais restent plus accessibles que les grands layouts storefront.

Ils constituent donc une zone intermédiaire :

- assez simples pour être audités proprement
- assez visibles pour avoir un vrai impact
- suffisamment partagés pour nécessiter une décision explicite

## Questions auxquelles le lot doit répondre

### 1. Le helper apporte-t-il encore une vraie valeur de mutualisation ?

Si une classe comme `.card-grid` ou `.store-card` reste un pattern clair, utile et stable, elle peut être conservée.

### 2. Le remplacement local est-il réellement plus lisible ?

Si le remplacement produit un markup beaucoup plus lourd sans gain net, la conservation du helper global peut être préférable.

### 3. Le helper est-il homogène dans tous ses usages ?

Si les contextes d’usage sont déjà très divergents, un remplacement local peut être justifié.

### 4. La règle CSS devient-elle totalement morte ?

La suppression ne doit intervenir que si tous les usages réels ont disparu.

## Principes de décision

### 1. La lisibilité du markup prime

Le cleanup ne vaut que si le résultat reste sobre et compréhensible.

### 2. Un helper simple et utile peut rester global

Le but de V14 n’est pas d’éradiquer tout le CSS global à n’importe quel prix.

### 3. Traiter par famille cohérente

On évite les remplacements ponctuels sans vision globale de la famille ciblée.

### 4. Pas de faux gain

Supprimer un helper global stable pour le remplacer par une répétition lourde dans 5 pages n’est pas une amélioration.

## Méthode recommandée

Le déroulé recommandé est :

1. lister les occurrences des helpers ciblés
2. comparer leurs usages réels
3. qualifier chaque famille :
   - à conserver
   - à remplacer maintenant
   - à repousser
4. appliquer les remplacements seulement si le gain est réel
5. vérifier si une règle CSS devient morte
6. supprimer uniquement ce qui est prouvé inutile
7. lancer le typecheck
8. documenter clairement la décision prise pour chaque helper

## Validation attendue

### Validation technique

- `pnpm run typecheck`
- aucune suppression CSS injustifiée
- aucun changement de comportement

### Validation visuelle

Vérifier que les écrans publics touchés restent :

- cohérents
- sobres
- bien espacés
- sans régression de responsive ou d’alignement

### Validation fonctionnelle

Vérifier que les pages storefront concernées restent identiques fonctionnellement.

## Anti-patterns à éviter

### 1. Transformer le lot en refonte storefront

V14-3 reste un lot de cleanup, pas un lot de redesign.

### 2. Introduire trop de duplication locale

Le remplacement local n’est utile que s’il reste simple.

### 3. Nettoyer des helpers encore très bons

Une classe globale stable, lisible et encore utile peut être conservée.

### 4. Déborder vers les structures denses

Si le travail commence à toucher en profondeur les layouts produit, panier ou checkout, on sort du périmètre.

## Livrables attendus

Le lot doit idéalement produire :

- un audit des helpers publics ciblés
- un petit nombre de fichiers modifiés
- la suppression éventuelle de règles réellement mortes
- une justification claire des helpers conservés ou supprimés

## Suite logique

Une fois V14-3 terminé, la suite logique est :

### V14-4 — Dense storefront structure cleanup

Ce lot pourra aborder les familles structurelles plus denses, uniquement si les lots précédents ont montré que le cleanup reste maintenable et lisible.

## Résumé

V14-3 est un lot de clarification et de réduction des helpers publics de layout léger.

Il sert à décider proprement quels helpers globaux peuvent encore disparaître, lesquels restent utiles, et jusqu’où il est raisonnable de pousser l’élimination du CSS custom sans dégrader le code.
