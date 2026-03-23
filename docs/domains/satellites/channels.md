# Domaine channels

## Rôle

Le domaine `channels` porte la diffusion externe du catalogue et, plus largement, la projection contrôlée d’objets commerciaux internes vers des canaux tiers.

Il décide quelles vues du catalogue ou quelles entités commerciales peuvent être exposées à des canaux externes, dans quel état, avec quelle éligibilité et selon quelles règles de publication.

## Responsabilités

Le domaine `channels` prend en charge :

- la notion de canal de diffusion commerciale
- l’éligibilité d’un produit ou d’une variante à un canal
- la projection catalogue interne vers une vue diffusable
- les statuts de publication par canal
- la lecture de ce qui est publiable, publié, refusé ou exclu
- les contraintes de diffusion liées à un canal
- la coordination métier avec `products`, `sales-policy`, `seo`, `pricing` et `integrations`

## Ce que le domaine ne doit pas faire

Le domaine `channels` ne doit pas :

- devenir le catalogue source, qui relève de `products`
- parler directement à Google Shopping, Meta ou un provider externe spécifique, ce qui relève de `integrations`
- recalculer localement la vendabilité, qui relève de `sales-policy`
- recalculer les prix, taxes ou remises, qui relèvent de `pricing`, `discounts` et `taxation`
- porter la logique complète de publication sociale, qui relève de `social`
- devenir un simple dossier de flux techniques sans responsabilité métier explicite

Le domaine `channels` porte la diffusion métier vers des canaux, pas l’exécution technique des appels externes.

## Sous-domaines

- `catalog` : projection catalogue destinée à la diffusion
- `google-shopping` : règles métier spécifiques à Google Shopping au niveau canal
- `meta-catalog` : règles métier spécifiques à Meta Catalog au niveau canal
- `publication-status` : états de publication par canal

## Entrées

Le domaine reçoit principalement :

- des produits et variantes issus de `products`
- des décisions de vendabilité issues de `sales-policy`
- des données monétaires lisibles pour le canal concerné
- des capacités actives de boutique issues de `stores`
- des demandes de lecture de statut de diffusion ou d’éligibilité canal
- des changements de publication catalogue ou de règles canal

## Sorties

Le domaine expose principalement :

- une lecture de l’éligibilité par canal
- une projection diffusable du catalogue interne
- un statut de publication par canal
- des raisons explicites de refus ou d’exclusion
- une lecture exploitable par `integrations`, `dashboarding`, `observability` et l’admin boutique si autorisé

## Dépendances vers autres domaines

Le domaine `channels` peut dépendre de :

- `products` pour le catalogue source
- `sales-policy` pour la vendabilité contextuelle
- `stores` pour les capabilities et le contexte boutique
- `pricing` pour certains montants nécessaires à la projection diffusable
- `seo` pour certains enrichissements de métadonnées si requis
- `audit` pour tracer les changements de diffusion sensibles
- `observability` pour expliquer les refus ou erreurs de publication métier

Les domaines suivants peuvent dépendre de `channels` :

- `integrations`
- `dashboarding`
- `analytics`
- `marketing`
- `search` dans certains cas de diffusion interne/externe si le modèle l’exige

## Capabilities activables liées

Le domaine `channels` est directement lié à :

- `productChannels`
- `googleShopping`
- `metaCatalog`

### Effet si `productChannels` est activée

Le domaine devient exploitable pour projeter le catalogue vers des canaux externes.

### Effet si `productChannels` est désactivée

Le domaine reste structurellement présent, mais aucune diffusion canal n’est effectivement active.

### Effet si `googleShopping` est activée

Le domaine peut exposer des projections et statuts spécifiques à Google Shopping.

### Effet si `metaCatalog` est activée

Le domaine peut exposer des projections et statuts spécifiques à Meta Catalog.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `catalog_manager`
- `marketing_manager` en lecture ou usage partiel selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `channels.read`
- `channels.write`
- `catalog.read`
- `pricing.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `channel.publication.requested`
- `channel.publication.status.changed`
- `channel.item.eligibility.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `product.published`
- `product.updated`
- `sales_policy.item.sellability.changed`
- `store.capabilities.updated`
- `pricing.*` si certaines projections doivent être recalculées après changement de données diffusables

Il doit toutefois rester maître de sa propre décision d’éligibilité et de statut canal.

## Intégrations externes

Le domaine `channels` ne parle pas directement aux systèmes externes.

Les appels vers :

- Google Shopping
- Meta Catalog
- autres canaux externes futurs

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `channels` reste la source de vérité interne de la projection canal et du statut métier de diffusion.

## Données sensibles / sécurité

Le domaine `channels` ne porte pas de secrets techniques directs, mais il porte une donnée métier sensible : la diffusion externe du catalogue.

Points de vigilance :

- contrôle strict des droits d’écriture
- protection des changements de publication par canal
- séparation entre décision métier de publication et exécution technique provider
- cohérence avec les capabilities actives de la boutique

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un produit est éligible ou non à un canal
- quel statut de diffusion a été retenu
- quelle règle a bloqué la publication
- si une non-publication vient d’un problème métier ou d’un problème d’intégration

### Audit

Il faut tracer :

- les changements de statut de publication canal significatifs
- les activations ou désactivations de diffusion par canal
- les opérations humaines déclenchant ou bloquant une projection canal

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Channel` : définition interne d’un canal de diffusion
- `ChannelEligibilityDecision` : décision d’éligibilité à un canal
- `ChannelPublicationStatus` : statut de diffusion interne par canal
- `ChannelCatalogProjection` : vue catalogue projetée pour un canal
- `ChannelRejectionReason` : raison explicite d’exclusion ou de refus

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- le catalogue source reste porté par `products`
- l’éligibilité canal ne se confond pas avec la seule existence catalogue
- l’éligibilité canal ne se confond pas avec la seule vendabilité brute sans contexte
- les appels provider ne sont pas réalisés dans `channels`
- un canal activé par capability ne signifie pas que tout le catalogue est automatiquement diffusable
- les raisons de refus ou d’exclusion doivent pouvoir être explicitées

## Cas d’usage principaux

1. Déterminer si un produit est diffusable sur Google Shopping
2. Déterminer si un produit est diffusable sur Meta Catalog
3. Lire le statut de diffusion d’un produit sur un canal donné
4. Construire une projection interne du catalogue pour un canal donné
5. Bloquer la diffusion d’un item non éligible
6. Exposer à l’admin une lecture claire de l’état de diffusion par canal

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- canal inconnu
- capability canal désactivée
- produit introuvable
- projection canal impossible à construire
- item catalogue publié mais non éligible au canal demandé
- conflit entre règles canal et capacités actives de la boutique

## Décisions d’architecture

Les choix structurants du domaine sont :

- `channels` porte la diffusion métier vers des canaux externes
- `channels` est distinct de `products`
- `channels` est distinct de `integrations`
- `channels` consomme `sales-policy` au lieu de redéfinir localement la vendabilité
- `channels` expose des projections et statuts internes, puis `integrations` exécute les appels externes
- les changements de diffusion canal significatifs doivent être explicables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la diffusion Google Shopping ou Meta relève de `channels` au niveau métier
- l’exécution technique provider relève de `integrations`
- le domaine `products` ne diffuse pas directement vers les canaux externes
- `channels` ne remplace ni `products`, ni `sales-policy`, ni `integrations`
- une capability canal active ne supprime pas le besoin d’une vraie décision d’éligibilité interne
