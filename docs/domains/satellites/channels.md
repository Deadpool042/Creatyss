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

# Canaux

## Rôle

Le domaine `channels` porte la projection commerciale interne vers des canaux de diffusion ou de vente distincts du catalogue source.

Il définit :

- ce qu’est un canal du point de vue du système ;
- comment un produit, une variante ou une offre devient diffusable sur un canal ;
- comment sont portés l’état, l’éligibilité et le statut de publication par canal ;
- comment ce domaine se distingue du catalogue source, des intégrations externes et des règles générales de vente ;
- comment le système reste maître de sa vérité interne de diffusion.

Le domaine existe pour fournir une représentation métier des canaux et de la diffusion catalogue, distincte :

- du catalogue source porté par `products` ;
- de l’exécution technique des appels provider, qui relève de `integrations` ;
- des règles générales de vendabilité ou de politique commerciale, qui peuvent relever de `sales-policy` ;
- de la recherche ;
- du marketing social ou éditorial ;
- de la simple configuration de boutique.

---

## Classification

### Catégorie documentaire

`satellites`

### Criticité architecturale

`satellite structurant`

### Activable

`oui`

Le domaine `channels` est activable.
Lorsqu’il est activé, il devient structurant pour la diffusion catalogue, la projection multi-canal et certaines lectures métier de publication.

---

## Source de vérité

Le domaine `channels` est la source de vérité pour :

- la définition interne d’un canal reconnu par le système ;
- les règles métier de projection vers un canal ;
- l’éligibilité interne d’un item à un canal ;
- le statut métier de diffusion par canal ;
- les raisons métier d’exclusion, de refus ou de non-publication ;
- la représentation interne d’une projection canal lorsque cette responsabilité est portée ici.

Le domaine `channels` n’est pas la source de vérité pour :

- le catalogue source, qui relève de `products` ;
- la vendabilité générale, qui peut relever de `sales-policy` ;
- les prix de référence, qui relèvent de `pricing` ;
- les taxes et remises, qui relèvent de `taxation` et `discounts` ;
- l’exécution technique provider, qui relève de `integrations` ;
- la publication sociale au sens large, qui peut relever de `social` ;
- la simple capability de boutique, qui relève de `stores`.

Un canal est un objet métier de diffusion ou de vente.
Il ne doit pas être confondu avec :

- un provider externe ;
- une simple capability ;
- un flux technique ;
- une boutique ;
- une landing page éditoriale.

---

## Responsabilités

Le domaine `channels` est responsable de :

- définir ce qu’est un canal dans le système ;
- porter la notion d’éligibilité canal ;
- structurer la projection interne du catalogue vers un canal ;
- porter les statuts de publication par canal ;
- exposer une lecture claire de ce qui est diffusable, publié, refusé ou exclu ;
- expliciter les raisons métier de refus ou d’exclusion ;
- coordonner la diffusion métier avec `products`, `sales-policy`, `pricing`, `stores`, `seo` et `integrations` ;
- publier les événements significatifs liés à la vie d’une diffusion canal.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- sous-modèles de canaux spécifiques comme Google Shopping ou Meta Catalog ;
- règles de projection propres à certains canaux ;
- slugs, identifiants ou attributs de projection propres au canal ;
- pilotage de publication manuelle ou semi-automatique ;
- statuts de synchronisation métier lisibles, sans absorber l’exécution technique complète.

---

## Non-responsabilités

Le domaine `channels` n’est pas responsable de :

- définir le catalogue source ;
- recalculer la vendabilité générale ;
- recalculer les prix, taxes ou remises ;
- exécuter directement les appels externes vers Google, Meta ou un autre provider ;
- porter toute la logique sociale ou éditoriale ;
- gouverner la recherche ;
- devenir un simple dossier de flux techniques sans responsabilité métier claire.

Le domaine `channels` ne doit pas devenir :

- un doublon de `products` ;
- un doublon de `integrations` ;
- un moteur global de règles commerciales ;
- un fourre-tout de statuts provider non interprétables métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- un canal doit avoir une identité interne stable ;
- un canal doit être interprétable sans ambiguïté ;
- l’éligibilité canal ne doit pas être confondue avec l’existence du produit ;
- l’éligibilité canal ne doit pas être confondue avec la vendabilité brute sans contexte ;
- une capability canal active ne signifie pas que tout le catalogue est automatiquement diffusable ;
- un statut de publication par canal doit être lisible et traçable ;
- les raisons de refus ou d’exclusion doivent pouvoir être explicitées ;
- les appels provider ne doivent pas être réalisés dans `channels` ;
- une projection canal doit rester reconstruisible à partir de la vérité interne.

Le domaine protège la cohérence de diffusion métier, pas simplement un statut technique.

---

## Dépendances

### Dépendances métier

Le domaine `channels` interagit fortement avec :

- `products`
- `sales-policy`
- `stores`
- `pricing`
- `seo`
- `integrations`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `jobs`, si certaines projections ou synchronisations sont différées
- `dashboarding`, pour certaines lectures consolidées

### Dépendances externes

Le domaine peut être relié indirectement à :

- Google Shopping ;
- Meta Catalog ;
- marketplaces futures ;
- autres canaux de diffusion externes.

### Règle de frontière

Le domaine `channels` porte la diffusion métier vers les canaux.
Il ne doit pas absorber :

- le catalogue source ;
- la logique provider ;
- la vendabilité générale ;
- ni la publication sociale au sens large.

---

## Événements significatifs

Le domaine `channels` publie ou peut publier des événements significatifs tels que :

- publication canal demandée ;
- statut de publication canal modifié ;
- éligibilité canal modifiée ;
- projection canal reconstruite ;
- item canal exclu ;
- item canal refusé ;
- diffusion canal suspendue.

Le domaine peut consommer des signaux liés à :

- produit publié ;
- produit mis à jour ;
- vendabilité modifiée ;
- capabilities de boutique modifiées ;
- prix ou données diffusables modifiés ;
- synchronisation ou action opératoire externe.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `channels` possède un cycle de vie partiel au niveau des projections et statuts de publication.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- en attente ;
- éligible ;
- non éligible ;
- publié ;
- refusé ;
- exclu ;
- suspendu, si pertinent ;
- archivé, si pertinent.

Le domaine doit éviter :

- les statuts ambigus ;
- les projections “fantômes” ;
- les changements silencieux de publication ;
- les états purement techniques non interprétables côté métier.

---

## Interfaces et échanges

Le domaine `channels` expose principalement :

- une lecture de l’éligibilité par canal ;
- une projection diffusable du catalogue interne ;
- un statut de publication par canal ;
- des raisons explicites de refus ou d’exclusion ;
- des lectures exploitables par `integrations`, `dashboarding`, `observability` et l’admin boutique si autorisé.

Le domaine reçoit principalement :

- des produits et variantes issus de `products` ;
- des décisions de vendabilité issues de `sales-policy` ;
- des données monétaires lisibles pour le canal concerné ;
- des capacités actives de boutique issues de `stores` ;
- des demandes de lecture de statut de diffusion ou d’éligibilité ;
- des changements de publication ou de règles canal.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `channels` peut être exposé à des contraintes telles que :

- multi-canal ;
- capacités activables ;
- règles spécifiques par provider ;
- projections catalogue différentes selon canal ;
- publication différée ;
- divergences entre statut interne et statut provider ;
- synchronisation partielle ;
- besoin de reconstruction ou de reprise.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la projection interne doit rester distincte de l’exécution provider ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une divergence provider ne doit pas corrompre silencieusement la vérité interne ;
- les refus et exclusions doivent être explicables ;
- l’évaluation métier de diffusion doit rester déterministe à contexte identique.

---

## Données sensibles / sécurité

Le domaine `channels` ne porte pas de secrets techniques directs, mais il porte une donnée métier sensible : la diffusion externe du catalogue.

Points de vigilance :

- contrôle strict des droits d’écriture ;
- protection des changements de publication par canal ;
- séparation entre décision métier de publication et exécution technique provider ;
- cohérence avec les capabilities actives de la boutique ;
- visibilité des actions humaines bloquant ou déclenchant la diffusion.

---

## Observabilité et audit

Le domaine `channels` doit rendre visibles au minimum :

- pourquoi un produit est éligible ou non à un canal ;
- quel statut de diffusion a été retenu ;
- quelle règle a bloqué la publication ;
- si une non-publication vient d’un problème métier ou d’un problème d’intégration ;
- les changements de statut significatifs ;
- les divergences entre projection interne et retour provider, si cette lecture est portée.

L’audit doit permettre de répondre à des questions comme :

- quel item a changé de statut de diffusion ;
- quand ;
- selon quelle origine ;
- pour quel canal ;
- avec quelle raison métier ;
- avec quelle action humaine éventuelle.

L’observabilité doit distinguer :

- refus métier ;
- exclusion métier ;
- erreur technique d’intégration ;
- divergence provider ;
- capability inactive ;
- projection canal invalide.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Channel` : définition interne d’un canal de diffusion ;
- `ChannelEligibilityDecision` : décision d’éligibilité à un canal ;
- `ChannelPublicationStatus` : statut de diffusion interne par canal ;
- `ChannelCatalogProjection` : vue catalogue projetée pour un canal ;
- `ChannelRejectionReason` : raison explicite d’exclusion ou de refus.

---

## Impact de maintenance / exploitation

Le domaine `channels` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il gouverne la diffusion externe du catalogue ;
- ses erreurs affectent la visibilité commerciale ;
- il se situe à la frontière entre métier et intégration ;
- il peut être multi-canal et dépendre de capacités activables ;
- ses statuts doivent rester lisibles pour l’exploitation.

En exploitation, une attention particulière doit être portée à :

- la cohérence entre produit, vendabilité et diffusion ;
- les blocages de publication ;
- les divergences provider ;
- la lisibilité des statuts ;
- la traçabilité des changements humains ;
- la reconstruction des projections canal.

Le domaine doit être considéré comme structurant dès qu’une diffusion externe catalogue existe réellement.

---

## Limites du domaine

Le domaine `channels` s’arrête :

- avant le catalogue source ;
- avant la vendabilité générale ;
- avant le pricing de base ;
- avant les taxes et remises ;
- avant l’exécution technique provider ;
- avant la publication sociale au sens large ;
- avant la simple capability de boutique.

Le domaine `channels` porte la diffusion métier vers des canaux.
Il ne doit pas devenir un moteur technique de synchronisation ni un doublon de catalogue.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `channels` et `sales-policy` ;
- la frontière exacte entre `channels` et `social` ;
- la liste canonique des canaux réellement supportés ;
- la part de projection spécifique par canal ;
- la hiérarchie entre vérité interne et retour provider ;
- la gestion multi-boutiques ou multi-capabilities ;
- la place exacte de Google Shopping et Meta Catalog dans le modèle interne.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/products.md`
- `sales-policy.md`
- `../core/stores.md`
- `../core/integrations.md`
- `../cross-cutting/seo.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
