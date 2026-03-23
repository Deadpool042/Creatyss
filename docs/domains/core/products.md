# Domaine `products`

## Objectif

Ce document décrit le domaine `products` dans la doctrine courante du socle.

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

Le domaine `products` est structurant pour la réutilisabilité du socle, car il porte la vérité catalogue interne du commerce.

Le domaine `products` ne doit pas être réduit à quelques champs storefront.
Il doit porter une structure catalogue stable, capable de servir :

- produits simples ;
- variantes ;
- bundles si activés ;
- métadonnées métier ;
- contenu produit ;
- articulation claire avec `pricing`, `availability`, `cart` et `orders`.

---

## Position dans la doctrine de modularité

Le domaine `products` est classé comme :

- `domaine coeur à capabilities toggleables`

Le domaine existe dans tous les projets e-commerce sérieux.
En revanche, sa richesse structurelle varie selon le projet.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- une vérité catalogue interne ;
- une identité produit stable ;
- une structure claire entre offre et variantes si le projet en a besoin ;
- une séparation avec pricing, disponibilité et commandes ;
- un lifecycle explicite des objets catalogue.

### Ce qui est activable / désactivable par capability

Le domaine `products` est lié aux capabilities suivantes :

- `simpleProducts`
- `variants`
- `bundles`
- `productMedia`
- `productAttributes`
- `productBadges`
- `seoMetadata`
- `productPublishingWorkflow`

### Ce qui relève d’un niveau

Le domaine porte plusieurs niveaux de sophistication catalogue.

### Ce qui relève d’un provider ou d’une intégration externe

Relèvent de `integrations` et non du coeur de `products` :

- PIM externe ;
- imports catalogue ;
- synchronisations marketplace ;
- enrichissements automatiques externes.

Le domaine `products` garde la vérité interne du catalogue exploité par le socle.

---

## Rôle

Le domaine `products` porte la vérité catalogue du socle.

Il constitue la source de vérité interne pour :

- l’identité des produits ;
- les variantes ;
- les attributs métier catalogue ;
- l’état de publication catalogue ;
- les informations structurantes utilisées par pricing, availability, cart et checkout.

Le domaine est distinct :

- de `pricing`, qui porte la vérité économique ;
- de `availability`, qui porte la disponibilité ;
- de `cart`, qui porte l’intention d’achat runtime ;
- de `orders`, qui porte le figement durable de l’achat ;
- de `blog` ou du contenu éditorial.

---

## Responsabilités

Le domaine `products` prend en charge :

- la création et gestion des produits ;
- la gestion des variantes si activées ;
- les attributs catalogue ;
- les métadonnées structurantes ;
- les médias si activés ;
- le statut de publication ;
- la lisibilité du catalogue pour les autres domaines ;
- l’identité stable des références produit.

---

## Ce que le domaine ne doit pas faire

Le domaine `products` ne doit pas :

- porter le prix ;
- porter la disponibilité ;
- porter la commande ;
- porter le paiement ;
- devenir un CMS générique ;
- dépendre d’un PIM externe pour exister localement ;
- laisser les autres domaines recréer l’identité produit différemment.

---

## Source de vérité

Le domaine `products` est la source de vérité pour :

- l’identité produit ;
- l’identité variante ;
- les attributs produit ;
- la publication catalogue ;
- les relations produit / variante structurantes.

Le domaine n’est pas la source de vérité pour :

- le prix ;
- la disponibilité ;
- la taxation ;
- le paiement ;
- la commande figée ;
- les projections storefront dérivées.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `Product`
- `ProductVariant`
- `ProductStatus`
- `ProductAttribute`
- `ProductMedia`
- `ProductBundle`
- `ProductBadge`

---

## Capabilities activables liées

Le domaine `products` est lié aux capabilities suivantes :

- `simpleProducts`
- `variants`
- `bundles`
- `productMedia`
- `productAttributes`
- `productBadges`
- `seoMetadata`
- `productPublishingWorkflow`

### Effet si `simpleProducts` est activée

Le domaine supporte des produits simples sans structure complexe.

### Effet si `variants` est activée

Le domaine distingue explicitement le niveau produit et le niveau variante.

### Effet si `bundles` est activée

Le domaine peut porter des offres composées.

### Effet si `productMedia` est activée

Le domaine gère une couche média structurée.

### Effet si `productAttributes` est activée

Le domaine porte davantage d’attributs typés ou structurants.

### Effet si `productBadges` est activée

Le domaine peut exposer des signaux catalogue structurés.

### Effet si `seoMetadata` est activée

Le domaine porte des métadonnées SEO structurées côté produit.

### Effet si `productPublishingWorkflow` est activée

Le lifecycle de publication devient plus riche.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

- produits simples ;
- publication simple ;
- peu d’attributs ;
- faible profondeur structurelle.

### Niveau 2 — standard

- variantes ;
- attributs plus riches ;
- médias structurés ;
- meilleure qualité catalogue.

### Niveau 3 — avancé

- bundles ;
- workflow de publication plus riche ;
- plus d’attributs et de signaux métier ;
- meilleures dépendances avec pricing et availability.

### Niveau 4 — expert / multi-contraintes

- catalogue très structuré ;
- multiples vues ou usages ;
- intégrations riches ;
- gouvernance catalogue plus exigeante.

---

## Entrées

Le domaine reçoit principalement :

- des commandes de création ou mise à jour produit ;
- des commandes de gestion de variantes ;
- des changements d’attributs ;
- des changements de statut de publication ;
- des imports externes traduits si activés.

---

## Sorties

Le domaine expose principalement :

- un catalogue interne lisible ;
- des produits et variantes identifiés ;
- un statut de publication ;
- des métadonnées structurantes ;
- un graphe exploitable par les autres domaines.

---

## Dépendances vers autres domaines

Le domaine `products` dépend de :

- `stores`
- `audit`
- `observability`

Les domaines suivants dépendent de `products` :

- `pricing`
- `availability`
- `cart`
- `checkout`
- `orders`
- `analytics`
- `search` si activé

---

## Dépendances vers providers / intégrations

Le domaine `products` peut être alimenté via `integrations`, mais garde une vérité locale.

Il ne laisse pas un import brut ou un PIM externe redéfinir le coeur sans validation.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `catalog_manager`

### Permissions

Exemples de permissions concernées :

- `products.read`
- `products.write`
- `products.publish`
- `products.media.manage`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `product.created`
- `product.updated`
- `product.published`
- `product.unpublished`
- `product.variant.created`
- `product.variant.updated`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `store.capabilities.updated`
- `integration.product.result.translated`

---

## Données sensibles / sécurité

Le domaine `products` porte une donnée métier structurante mais moins sensible que `payments` ou `auth`.

Points de vigilance :

- cohérence des identités produit ;
- publication maîtrisée ;
- imports validés ;
- séparation claire entre catalogue et autres vérités métier.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un produit ou une variante a changé ;
- pourquoi il est publié ou non ;
- quelles données catalogue sont actives ;
- si un import externe a modifié la vérité locale.

### Audit

Il faut tracer :

- les créations ;
- les publications / dépublications ;
- les changements structurants ;
- les imports ayant un impact durable.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un produit possède une identité stable ;
- une variante appartient à un produit explicite ;
- `products` reste la vérité catalogue ;
- le prix, la disponibilité et la commande ne redéfinissent pas le catalogue ;
- un produit non publié n’est pas assimilé à un produit storefront actif, selon la politique retenue.

---

## Lifecycle et gouvernance des données

### États principaux

Les états principaux incluent typiquement :

- `DRAFT`
- `ACTIVE`
- `INACTIVE`
- `ARCHIVED`

### Transitions autorisées

Exemples :

- `DRAFT -> ACTIVE`
- `ACTIVE -> INACTIVE`
- `INACTIVE -> ACTIVE`
- `ACTIVE -> ARCHIVED`

### Transitions interdites

Exemples :

- un produit archivé ne redevient pas actif sans action explicite ;
- une variante n’existe pas sans rattachement produit valide.

### Règles de conservation / archivage / suppression

- l’archivage est préférable à la suppression implicite pour des références catalogue structurantes ;
- les identités utiles au support, aux commandes et aux lectures historiques restent compréhensibles.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’un produit ;
- création d’une variante liée ;
- publication / dépublication ;
- mise à jour structurante d’attributs ;
- écriture des événements `product.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- indexation search ;
- projections storefront ;
- analytics ;
- synchronisations externes.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les changements structurants ;
- unicité logique des identités produit ;
- cohérence produit / variante ;
- validation avant imports externes appliqués.

Les conflits attendus sont :

- double mise à jour structurante ;
- import externe concurrent ;
- publication et archivage concurrents.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `upsert-product` : clé d’intention = `(productRef, changeIntentId)`
- `upsert-product-variant` : clé d’intention = `(variantRef, changeIntentId)`
- `apply-external-product-result` : clé d’intention = `(providerName, externalEventId)`

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `product.created`
- `product.updated`
- `product.published`
- `product.unpublished`
- `product.variant.created`
- `product.variant.updated`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- indexation externe ;
- analytics ;
- synchronisation PIM / marketplace ;
- projection storefront.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` pour catalogue simple ;
- `M2` pour variantes et médias ;
- `M3` pour workflows riches ou imports structurants ;
- `M4` pour catalogue très intégré ou fortement gouverné.

### Pourquoi

Le domaine `products` structure plusieurs autres domaines.
Un catalogue mal gouverné dégrade pricing, availability, cart et commandes.

### Points d’exploitation à surveiller

- cohérence produit / variante ;
- publication ;
- imports ;
- attributs structurants ;
- dérives de catalogue.

---

## Impact coût / complexité

Le coût du domaine `products` monte principalement avec :

- `variants`
- `bundles`
- `productMedia`
- `productAttributes`
- `productPublishingWorkflow`
- les imports externes.

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Créer un produit
2. Créer une variante
3. Publier ou dépublier un produit
4. Exposer un catalogue interne fiable
5. Alimenter pricing, availability, cart et checkout

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- produit introuvable ;
- variante introuvable ;
- identité dupliquée ;
- publication invalide ;
- import externe ambigu ;
- relation produit / variante incohérente.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `products` est un domaine coeur à capabilities toggleables ;
- le catalogue est distinct de pricing et availability ;
- les variantes sont une capability, pas une hypothèse imposée à tous les projets ;
- les imports externes restent des intégrations ;
- le catalogue reste une vérité interne stable et auditée.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `products` appartient au coeur du socle ;
- le catalogue n’est pas confondu avec le storefront ;
- pricing et availability ne portent pas la vérité produit ;
- les intégrations PIM éventuelles restent à la frontière ;
- la montée de richesse catalogue se fait par capabilities et niveaux ;
- le lifecycle du catalogue reste explicite.
