# Domaine `stores`

## Objectif

Ce document décrit le domaine `stores` dans la doctrine courante du socle.

Il précise :

- le rôle du domaine ;
- sa place dans la modularité du socle ;
- sa source de vérité ;
- ses capabilities activables ;
- ses niveaux éventuels ;
- ses objets métier ;
- ses invariants ;
- son cycle de vie ;
- ses règles de cohérence ;
- ses implications de maintenance, d’exploitation et de coût.

Le domaine `stores` est structurant pour la réutilisabilité du socle, car il porte le contexte de boutique à partir duquel sont activés :

- les capabilities ;
- les niveaux de sophistication ;
- les profils de comportement ;
- certaines politiques fonctionnelles.

Le domaine `stores` ne doit pas être pensé comme un simple “tenant label”.
Il porte le **contexte de composition du projet** au niveau métier/runtime.

---

## Position dans la doctrine de modularité

Le domaine `stores` est classé comme :

- `domaine coeur non toggleable`

Le domaine existe dans tous les projets du socle.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- une identité de boutique ;
- un contexte de capabilities activées ;
- un profil d’exploitation et de configuration ;
- une gouvernance minimale des paramètres structurants.

### Ce qui est activable / désactivable par capability

Le domaine `stores` n’est pas lui-même une capability métier optionnelle.
Il porte le contexte des capabilities des autres domaines.

### Ce qui relève d’un niveau

Le domaine peut porter ou référencer :

- le profil solution ;
- les niveaux fonctionnels activés ;
- le niveau de maintenance cible ;
- les capabilities activées par boutique.

### Ce qui relève d’un provider ou d’une intégration externe

Les providers restent dans `integrations`.
Le domaine `stores` ne les exécute pas.
Il porte le contexte qui autorise ou non leur activation.

---

## Rôle

Le domaine `stores` porte le contexte de boutique du socle.

Il constitue la source de vérité interne pour :

- l’identité de la boutique ;
- son statut ;
- son profil fonctionnel ;
- ses capabilities activées ;
- certaines politiques globales de projet.

Le domaine est distinct :

- de `products`, `pricing`, `availability`, `cart`, etc. ;
- de `integrations`, qui porte les connecteurs ;
- de `auth`, qui porte l’accès ;
- de `customers`, qui porte les clients.

---

## Responsabilités

Le domaine `stores` prend en charge :

- la création et gestion de la boutique ;
- l’activation ou désactivation de capabilities ;
- le rattachement du projet à un profil de solution ;
- le contexte métier global utilisé par les autres domaines ;
- certaines politiques transverses de comportement.

---

## Ce que le domaine ne doit pas faire

Le domaine `stores` ne doit pas :

- absorber les métiers des autres domaines ;
- devenir le lieu où toute logique est recodée ;
- remplacer `integrations` pour les providers ;
- devenir un simple fichier de config sans logique métier explicite.

---

## Source de vérité

Le domaine `stores` est la source de vérité pour :

- l’identité de la boutique ;
- son statut global ;
- ses capabilities activées ;
- son profil de solution ;
- certaines politiques transverses.

Le domaine n’est pas la source de vérité pour :

- les produits ;
- les prix ;
- les commandes ;
- les paiements ;
- les connecteurs externes ;
- l’authentification.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `Store`
- `StoreStatus`
- `StoreCapability`
- `StoreProfile`
- `StorePolicy`
- `StoreMaintenanceTarget`

---

## Capabilities activables liées

Le domaine `stores` porte le contexte d’activation des capabilities des autres domaines.

Exemples :

- `guestCheckout`
- `paymentProvider.paypal`
- `paymentMode.installments`
- `multiCountryTaxation`
- `exciseTax`
- `blog`
- `reviews`
- `returns`
- `b2bCommerce`

### Effet si une capability est activée

Le domaine concerné peut l’exploiter.

### Effet si une capability est désactivée

Le domaine concerné doit se comporter en mode plus simple ou refuser les parcours dépendants.

---

## Niveaux de sophistication du domaine

Le domaine `stores` ne porte pas principalement une sophistication métier propre.
Il porte la matrice des niveaux des autres domaines.

---

## Entrées

Le domaine reçoit principalement :

- des commandes de création ou mise à jour de boutique ;
- des commandes d’activation / désactivation de capabilities ;
- des choix de profil solution ;
- des politiques globales.

---

## Sorties

Le domaine expose principalement :

- un contexte de boutique ;
- un set de capabilities activées ;
- un profil de solution ;
- des signaux de changement structurants pour les autres domaines.

---

## Dépendances vers autres domaines

Le domaine `stores` dépend de :

- `audit`
- `observability`

Les domaines suivants dépendent de `stores` :

- `products`
- `pricing`
- `availability`
- `cart`
- `checkout`
- `orders`
- `payments`
- `taxation`
- `integrations`
- `documents`
- `blog`
- tous les domaines à capabilities toggleables

---

## Dépendances vers providers / intégrations

Le domaine `stores` ne dépend pas directement d’un provider.
Il ne fait qu’autoriser ou non l’usage de certains connecteurs via capabilities.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`

### Permissions

Exemples de permissions concernées :

- `stores.read`
- `stores.write`
- `stores.capabilities.manage`
- `stores.profile.manage`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `store.created`
- `store.updated`
- `store.capabilities.updated`
- `store.profile.changed`
- `store.status.changed`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- certains événements administratifs structurants de plateforme si le socle en prévoit.

---

## Données sensibles / sécurité

Le domaine `stores` porte une donnée structurante et sensible du point de vue de la gouvernance.

Points de vigilance :

- les capabilities activées ont un impact direct sur le comportement métier ;
- une mauvaise configuration de store peut dégrader plusieurs domaines à la fois ;
- les changements de capabilities doivent être contrôlés et auditables.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelles capabilities sont actives ;
- quel profil solution est retenu ;
- quel changement de contexte explique un comportement métier ;
- quelle boutique est concernée.

### Audit

Il faut tracer :

- création de boutique ;
- changements de statut ;
- changements de capabilities ;
- changement de profil solution ;
- changements de politiques globales.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une boutique possède une identité stable ;
- une boutique possède un contexte de capabilities explicite ;
- les autres domaines lisent le contexte store, ils ne le redéfinissent pas ;
- une capability désactivée ne doit pas être supposée active par un domaine dépendant ;
- le domaine `stores` reste la source de vérité du contexte projet/boutique.

---

## Lifecycle et gouvernance des données

### États principaux

Les états principaux incluent typiquement :

- `ACTIVE`
- `DISABLED`
- `ARCHIVED`

### Transitions autorisées

Exemples :

- `ACTIVE -> DISABLED`
- `DISABLED -> ACTIVE`
- `ACTIVE -> ARCHIVED`

### Transitions interdites

Exemples :

- réactivation implicite d’une boutique archivée ;
- changement silencieux de capabilities sans traçabilité.

### Règles de conservation / archivage / suppression

- les boutiques et leurs historiques structurants restent auditables ;
- les changements de capability doivent rester compréhensibles ;
- la suppression physique n’est pas le comportement par défaut.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’une boutique ;
- changement de statut ;
- activation / désactivation d’une capability ;
- changement de profil ;
- écriture des événements `store.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- projections admin ;
- synchronisations externes ;
- analytics ;
- notifications opératoires.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les changements structurants ;
- une seule vérité de configuration par boutique ;
- version logique du set de capabilities si nécessaire.

Les conflits attendus sont :

- double changement de capabilities ;
- changement concurrent de profil ;
- désactivation concurrente de fonctionnalités utilisées.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `upsert-store` : clé d’intention = `(storeRef, changeIntentId)`
- `set-store-capabilities` : clé d’intention = `(storeId, capabilitySetVersion, changeIntentId)`
- `change-store-profile` : clé d’intention = `(storeId, targetProfile, changeIntentId)`

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `store.created`
- `store.updated`
- `store.capabilities.updated`
- `store.profile.changed`
- `store.status.changed`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- synchronisation externe ;
- analytics ;
- notifications.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` minimum ;
- `M2` recommandé dès que plusieurs capabilities sensibles sont pilotées.

### Pourquoi

Le domaine `stores` pilote le comportement de nombreux autres domaines.
Une erreur ici a un impact transverse.

### Points d’exploitation à surveiller

- changements de capabilities ;
- profils activés ;
- dérive entre configuration et comportement réel ;
- cohérence entre capacité active et usage effectif.

---

## Impact coût / complexité

Le coût du domaine `stores` monte principalement avec :

- la richesse des capabilities pilotées ;
- le nombre de profils ;
- la complexité de gouvernance du contexte boutique.

Lecture relative du coût :

- niveau courant : `C1` à `C2`

---

## Cas d’usage principaux

1. Créer une boutique
2. Définir son profil solution
3. Activer / désactiver des capabilities
4. Exposer un contexte de configuration stable au reste du socle

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- boutique introuvable ;
- capability incohérente ;
- profil incompatible ;
- changement concurrent de configuration ;
- divergence entre expected config et comportement effectif.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `stores` est un domaine coeur non toggleable ;
- il porte le contexte de composition du projet ;
- les capabilities sont activées au niveau de la boutique ;
- les autres domaines consomment ce contexte ;
- les providers restent hors de ce domaine ;
- les changements de capabilities sont structurants et auditables.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `stores` appartient au coeur du socle ;
- le domaine ne se réduit pas à un simple tenant name ;
- les capabilities sont pilotées par le contexte boutique ;
- le domaine structure la composabilité du projet ;
- les autres domaines ne redéfinissent pas localement ce contexte ;
- les changements de store sont des changements structurants.
