# Domaine `pricing`

## Objectif

Ce document décrit le domaine `pricing` dans la doctrine courante du socle.

Il précise :

- le rôle du domaine ;
- sa place dans la modularité du socle ;
- sa source de vérité ;
- ses capabilities activables ;
- ses niveaux de sophistication ;
- ses objets métier ;
- ses invariants ;
- son cycle de vie ;
- ses règles de cohérence ;
- ses frontières externes ;
- ses implications de maintenance, d’exploitation et de coût.

Le domaine `pricing` est structurant pour la réutilisabilité du socle, car il porte la vérité économique interne du commerce avant figement dans `checkout` et `orders`.

Le domaine `pricing` ne doit pas être pensé comme un simple champ `price`.
Il doit pouvoir couvrir :

- prix de base ;
- variantes ;
- listes de prix ;
- remises ;
- promotions ;
- règles B2B ;
- enrichissements de contexte ;
- niveau de sophistication variable selon le projet.

---

## Position dans la doctrine de modularité

Le domaine `pricing` est classé comme :

- `domaine coeur à capabilities toggleables`

Le domaine existe dans tous les projets e-commerce sérieux.
En revanche, sa sophistication varie fortement selon les besoins du projet.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- une vérité interne du prix de vente ;
- une distinction entre prix de base et prix calculé dans un contexte donné ;
- une séparation claire avec taxation ;
- une séparation claire avec paiements ;
- une articulation explicite avec `products`, `checkout` et `orders`.

### Ce qui est activable / désactivable par capability

Le domaine `pricing` est lié aux capabilities suivantes :

- `basePricing`
- `variantsPricing`
- `priceLists`
- `discounts`
- `promotions`
- `campaignPricing`
- `b2bPricing`
- `storeSpecificPricing`
- `compareAtPrice`

### Ce qui relève d’un niveau

Le domaine porte explicitement plusieurs niveaux de sophistication de pricing.

### Ce qui relève d’un provider ou d’une intégration externe

Relèvent de `integrations` et non du coeur de `pricing` :

- connecteurs ERP / PIM / POS de prix ;
- imports externes de listes de prix ;
- moteurs de pricing externes.

Le domaine `pricing` garde la vérité interne des prix exploités par le socle.

---

## Rôle

Le domaine `pricing` porte la vérité économique interne de l’offre commercialisable.

Il constitue la source de vérité interne pour :

- le prix de base ;
- le prix contextualisé ;
- les règles de remise ou promotion ;
- les éventuelles listes de prix ;
- les composants monétaires utilisés par `checkout` puis figés dans `orders`.

Le domaine est distinct :

- de `products`, qui porte l’identité et la structure de l’offre ;
- de `taxation`, qui porte la logique fiscale ;
- de `payments`, qui porte la logique de paiement ;
- de `orders`, qui fige le résultat validé ;
- de `integrations`, qui peut alimenter le pricing sans le définir à lui seul.

---

## Responsabilités

Le domaine `pricing` prend en charge :

- le prix de base des produits ou variantes ;
- la détermination d’un prix applicable dans un contexte donné ;
- les listes de prix si activées ;
- les remises et promotions si activées ;
- la production d’un breakdown économique exploitable par `checkout` ;
- la séparation entre prix interne source et prix figé dans la commande ;
- l’exposition d’une vérité claire pour le storefront, le panier, le checkout et l’admin.

---

## Ce que le domaine ne doit pas faire

Le domaine `pricing` ne doit pas :

- porter la fiscalité ;
- porter la vérité de la commande ;
- porter le paiement ;
- devenir un moteur de catalogue complet ;
- faire dépendre la vérité de prix d’un provider externe sans contrôle ;
- laisser le front calculer librement le prix final.

---

## Source de vérité

Le domaine `pricing` est la source de vérité pour :

- le prix interne applicable d’une offre ;
- les règles de remise et promotion ;
- les listes de prix si activées ;
- les composants économiques transmis au checkout.

Pour toute opération engageante, la source de vérité du prix est portée par `ProductVariantPrice`, rattaché à la variante effectivement visée par l’achat. Lorsqu’un produit simple est exposé sans déclinaisons visibles, cette règle s’applique via sa variante par défaut (`defaultVariant`).

`ProductPrice` ne constitue pas la source de vérité transactionnelle. Tant qu’aucun lot ultérieur n’a redéfini son statut, il peut être conservé pour des usages de projection, d’affichage catalogue ou de prix de référence, selon les besoins du projet.


Le domaine n’est pas la source de vérité pour :

- les taxes ;
- la commande figée ;
- le paiement ;
- les documents externes ;
- la stratégie marketing globale ;
- le transport ;
- la disponibilité.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `Price`
- `PriceList`
- `PriceRule`
- `PricingContext`
- `PricingResult`
- `Discount`
- `Promotion`
- `PriceBreakdown`
- `CompareAtPrice`

---

## Capabilities activables liées

Le domaine `pricing` est lié aux capabilities suivantes :

- `basePricing`
- `variantsPricing`
- `priceLists`
- `discounts`
- `promotions`
- `campaignPricing`
- `b2bPricing`
- `storeSpecificPricing`
- `compareAtPrice`

### Effet si `basePricing` est activée

Le domaine porte un prix de base minimum pour chaque offre vendable.

### Effet si `variantsPricing` est activée

Le domaine peut distinguer les prix au niveau des variantes.

### Effet si `priceLists` est activée

Le domaine peut sélectionner un prix selon une liste ou un contexte explicite.

### Effet si `discounts` est activée

Le domaine peut appliquer des remises structurées.

### Effet si `promotions` est activée

Le domaine peut appliquer des promotions contextuelles ou temporelles.

### Effet si `campaignPricing` est activée

Le domaine peut distinguer des règles de prix liées à certaines campagnes.

### Effet si `b2bPricing` est activée

Le domaine peut produire des prix spécifiques au contexte B2B.

### Effet si `storeSpecificPricing` est activée

Le domaine peut différencier le pricing selon la boutique.

### Effet si `compareAtPrice` est activée

Le domaine peut exposer un prix de comparaison ou prix barré, distinct du prix interne applicable.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

- prix de base ;
- pricing simple ;
- faible nombre de règles ;
- pas ou peu de contextes enrichis.

### Niveau 2 — standard

- prix par variante ;
- remises ou promotions usuelles ;
- pricing contextuel raisonnable ;
- meilleur breakdown économique.

### Niveau 3 — avancé

- listes de prix ;
- B2B ;
- store-specific pricing ;
- promotions plus riches ;
- plus de règles et de contrôles.

### Niveau 4 — expert / multi-contraintes

- pricing fortement contextualisé ;
- plusieurs dimensions commerciales ;
- règles d’arbitrage plus nombreuses ;
- forte dépendance au contexte boutique, client ou campagne.

---

## Entrées

Le domaine reçoit principalement :

- un produit ou une variante ;
- un contexte boutique ;
- un contexte client ;
- un contexte campagne ou canal si activé ;
- des capacités de pricing activées ;
- des règles de remise / promotion ;
- éventuellement des imports ou résultats externes traduits.

---

## Sorties

Le domaine expose principalement :

- un prix applicable ;
- un breakdown économique ;
- un résultat de pricing contextualisé ;
- des informations exploitables par `cart`, `checkout` et `orders`.

---

## Dépendances vers autres domaines

Le domaine `pricing` dépend de :

- `products`
- `stores`
- `customers`
- `audit`
- `observability`

Les domaines suivants dépendent de `pricing` :

- `cart`
- `checkout`
- `orders`
- `documents`
- `analytics`

---

## Dépendances vers providers / intégrations

Le domaine `pricing` peut être alimenté par des imports externes via `integrations`, mais il ne leur délègue pas sa souveraineté interne.

Le domaine `pricing` :

- ne prend pas un prix externe brut comme vérité sans validation ;
- ne laisse pas un provider imposer son modèle coeur ;
- n’expose pas directement les schémas externes aux autres domaines.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `catalog_manager`
- `finance_manager`

### Permissions

Exemples de permissions concernées :

- `pricing.read`
- `pricing.write`
- `pricing.rules.manage`
- `pricing.price_lists.manage`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `pricing.updated`
- `pricing.rule.created`
- `pricing.rule.updated`
- `pricing.price_list.updated`
- `pricing.result.produced`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `product.created`
- `product.updated`
- `store.capabilities.updated`
- `customer.updated`
- `integration.pricing.result.translated`

---

## Données sensibles / sécurité

Le domaine `pricing` porte une donnée métier critique.

Points de vigilance :

- un prix erroné crée un risque commercial immédiat ;
- les règles de réduction ou promotion doivent être contrôlées ;
- un prix ne doit jamais être considéré valide juste parce qu’il vient du client ;
- les changements structurants de pricing doivent être auditables.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un prix a été retenu ;
- quelle règle a été appliquée ;
- si une promotion ou remise a modifié le prix ;
- quel contexte a servi au calcul ;
- pourquoi un résultat diffère entre deux contextes.

### Audit

Il faut tracer :

- les changements de prix de base ;
- les changements de listes de prix ;
- les créations / modifications de règles ;
- les corrections manuelles sensibles ;
- les imports externes ayant un impact durable.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une offre vendable a un pricing interne intelligible ;
- le domaine `pricing` reste la source de vérité des montants économiques avant taxation ;
- la taxation ne remplace pas le pricing ;
- le checkout fige un résultat de pricing, il ne le redéfinit pas ;
- un projet simple ne paie pas la complexité B2B ou multi-price-lists si elle n’est pas activée.

---

## Lifecycle et gouvernance des données

### États principaux

Les états utiles incluent :

- prix ou règle `ACTIVE`
- `DISABLED`
- `ARCHIVED`

### Transitions autorisées

Exemples :

- `ACTIVE -> DISABLED`
- `DISABLED -> ACTIVE`
- `ACTIVE -> ARCHIVED`

### Transitions interdites

Exemples :

- une règle archivée ne redevient pas implicitement active ;
- un prix figé dans une commande ne change pas rétroactivement.

### Règles de conservation / archivage / suppression

- les règles et prix structurants doivent rester auditables ;
- les résultats de pricing figés dans `orders` ne sont pas recalculés comme si le passé n’existait pas ;
- la suppression physique n’est pas la stratégie par défaut pour les règles structurantes.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création ou mise à jour d’un prix structurant ;
- création ou mise à jour d’une règle de pricing ;
- activation / désactivation d’une règle ;
- mise à jour d’une liste de prix ;
- écriture des événements `pricing.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- projections admin ;
- analytics ;
- synchronisations externes ;
- import / export non bloquant ;
- notifications opératoires.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les changements structurants ;
- garde sur les états des règles ;
- version implicite ou explicite des ensembles de règles si nécessaire ;
- refus de produire deux vérités incohérentes pour la même règle.

Les conflits attendus sont :

- double mise à jour de prix ;
- double modification d’une règle ;
- import externe et correction manuelle concurrents ;
- changement de pricing pendant une préparation checkout.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `upsert-price` : clé d’intention = `(offerId, priceContextKey, changeIntentId)`
- `upsert-pricing-rule` : clé d’intention = `(storeId, pricingRuleCode, changeIntentId)`
- `apply-external-pricing-result` : clé d’intention = `(providerName, externalEventId)`
- `produce-pricing-result` : clé d’intention = `(pricingContextId, pricingProfileVersion)`

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `pricing.updated`
- `pricing.rule.created`
- `pricing.rule.updated`
- `pricing.price_list.updated`
- `pricing.result.produced`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- appel à un moteur externe ;
- analytics externe ;
- export ou import externe ;
- notifications.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` pour un pricing simple ;
- `M2` pour variantes, remises et promotions standard ;
- `M3` pour listes de prix, B2B, pricing enrichi ;
- `M4` pour pricing très contextuel ou fortement intégré.

### Pourquoi

Le pricing influence directement la valeur commerciale, la marge, le support et la confiance dans le système.

### Points d’exploitation à surveiller

- dérives de prix ;
- règles actives ;
- conflits de règles ;
- impacts d’imports externes ;
- incohérences entre pricing, checkout et commande.

---

## Impact coût / complexité

Le coût du domaine `pricing` monte principalement avec :

- `variantsPricing`
- `priceLists`
- `discounts`
- `promotions`
- `campaignPricing`
- `b2bPricing`
- `storeSpecificPricing`

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Définir le prix de base d’une offre
2. Produire un résultat de pricing contextualisé
3. Appliquer une remise ou promotion
4. Exposer un breakdown économique au checkout
5. Figer un résultat économique ensuite dans la commande

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- prix introuvable ;
- règle incohérente ;
- promotion invalide ;
- import externe ambigu ;
- conflit entre deux règles ;
- contexte de pricing incomplet.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `pricing` est un domaine coeur à capabilities toggleables ;
- le pricing est distinct de la taxation ;
- le pricing est distinct du paiement ;
- le checkout fige un résultat, il ne devient pas la source de vérité ;
- les niveaux avancés ne sont pas activés par défaut ;
- la vérité de prix reste interne même si des imports externes existent.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `pricing` appartient au coeur du socle ;
- un prix n’est pas réduit à un simple champ brut ;
- la sophistication du pricing varie par capability et par niveau ;
- les moteurs externes éventuels restent des intégrations ;
- le pricing alimente `checkout` et `orders` sans se faire remplacer par eux ;
- la séparation pricing / taxation / payments est obligatoire.
