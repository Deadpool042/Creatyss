# Domaine `roles`

## Objectif

Ce document décrit le domaine `roles` dans la doctrine courante du socle.

Il précise :

- le rôle du domaine ;
- sa place dans la modularité du socle ;
- sa source de vérité ;
- ses objets métier ;
- ses invariants ;
- son cycle de vie ;
- ses règles de cohérence ;
- ses implications de maintenance, d’exploitation et de coût.

Le domaine `roles` porte les agrégats d’autorisation attribuables aux utilisateurs ou acteurs internes du socle.

Il ne doit pas être confondu avec :

- `permissions`, qui porte les droits atomiques ;
- `auth`, qui porte l’authentification ;
- `users`, qui porte l’identité applicative.

---

## Position dans la doctrine de modularité

Le domaine `roles` est classé comme :

- `domaine coeur non toggleable`

Le domaine existe dans tout socle sérieux, car l’autorisation ne doit pas être codée à la volée ni dispersée.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- une vérité interne des rôles ;
- un rattachement des permissions aux rôles ;
- une assignation explicite des rôles aux users ou scopes applicatifs ;
- un cycle de vie lisible.

---

## Rôle

Le domaine `roles` porte les rôles applicatifs du socle.

Il constitue la source de vérité interne pour :

- l’existence d’un rôle ;
- son nom technique ;
- son statut ;
- l’ensemble des permissions qu’il agrège ;
- les scopes d’application s’ils existent.

Le domaine est distinct :

- de `permissions`, qui porte les droits atomiques ;
- de `users`, qui porte les personnes ;
- de `auth`, qui porte les credentials et sessions.

---

## Responsabilités

Le domaine `roles` prend en charge :

- la création et gestion des rôles ;
- l’agrégation de permissions ;
- l’assignation de rôles aux users ou memberships ;
- le statut des rôles ;
- la lisibilité de la gouvernance d’accès.

---

## Ce que le domaine ne doit pas faire

Le domaine `roles` ne doit pas :

- porter l’authentification ;
- porter les utilisateurs eux-mêmes ;
- porter les droits atomiques comme vérité primaire ;
- coder des règles d’accès implicites disséminées ailleurs.

---

## Source de vérité

Le domaine `roles` est la source de vérité pour :

- les rôles ;
- leur statut ;
- leur composition en permissions ;
- leur assignation logique.

Le domaine n’est pas la source de vérité pour :

- les permissions atomiques elles-mêmes ;
- les utilisateurs ;
- les sessions ;
- les clients API.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `Role`
- `RoleStatus`
- `RoleAssignment`
- `RoleScope`

---

## Capabilities activables liées

Le domaine `roles` n’est pas principalement capability-driven.
Il reste structurel.

La richesse du modèle peut toutefois augmenter selon :

- `multiStorefront`
- `b2bCommerce`
- `adminDelegation`

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

- rôles simples ;
- peu de scopes ;
- assignation directe.

### Niveau 2 — standard

- meilleure granularité ;
- plusieurs contextes d’assignation ;
- rattachements plus riches.

### Niveau 3 — avancé

- rôles plus nombreux ;
- scopes plus fins ;
- gouvernance plus riche.

### Niveau 4 — expert / multi-contraintes

- matrices d’autorisation plus denses ;
- organisation plus complexe ;
- audit et gouvernance plus poussés.

---

## Entrées

Le domaine reçoit principalement :

- des commandes de création ou mise à jour de rôle ;
- des ajouts ou suppressions de permissions dans un rôle ;
- des assignations à des utilisateurs ou memberships.

---

## Sorties

Le domaine expose principalement :

- des rôles ;
- leurs permissions agrégées ;
- leurs assignations ;
- des événements liés à la gouvernance d’accès.

---

## Dépendances vers autres domaines

Le domaine `roles` dépend de :

- `permissions`
- `users`
- `audit`
- `observability`

Les domaines suivants dépendent de `roles` :

- `authz`
- `admin`
- tous les domaines protégés

---

## Dépendances vers providers / intégrations

Le domaine `roles` ne dépend pas d’un provider externe comme vérité primaire.

---

## Rôles / permissions concernés

### Rôles

Les rôles concernés sont auto-référentiels du point de vue gouvernance, par exemple :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `finance_manager`
- `customer_support`

### Permissions

Exemples de permissions concernées :

- `roles.read`
- `roles.write`
- `roles.assign`
- `permissions.read`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `role.created`
- `role.updated`
- `role.disabled`
- `role.assignment.updated`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `user.created`
- `user.disabled`
- `permission.created`
- `permission.updated`

---

## Données sensibles / sécurité

Le domaine `roles` porte une donnée critique de sécurité.

Points de vigilance :

- une mauvaise assignation de rôle crée immédiatement un risque d’accès ;
- les changements de rôle doivent être auditables ;
- les rôles ne doivent pas être modifiés sans contrôle.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quels rôles existent ;
- quelles permissions ils agrègent ;
- à qui ils sont assignés ;
- pourquoi un rôle a changé.

### Audit

Il faut tracer :

- création de rôle ;
- changement de composition ;
- assignation et retrait ;
- désactivation.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un rôle possède une identité stable ;
- un rôle agrège des permissions explicites ;
- une assignation de rôle est traçable ;
- un rôle désactivé n’est pas traité comme pleinement actif ;
- le domaine `roles` ne se confond pas avec `permissions`.

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

- réactivation implicite d’un rôle archivé ;
- suppression silencieuse d’un rôle encore référencé.

### Règles de conservation / archivage / suppression

- les rôles et assignations structurantes restent auditables ;
- l’archivage est préférable à la suppression implicite des éléments critiques.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’un rôle ;
- mise à jour d’un rôle ;
- changement de statut ;
- assignation ou retrait structurant ;
- écriture des événements `role.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- projections admin ;
- analytics sécurité ;
- notifications opératoires.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les changements structurants ;
- unicité logique des rôles ;
- validation des assignations.

Les conflits attendus sont :

- double assignation ;
- modification concurrente d’un rôle ;
- suppression / désactivation concurrente.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `upsert-role` : clé d’intention = `(roleCode, changeIntentId)`
- `assign-role` : clé d’intention = `(subjectRef, roleCode, assignIntentId)`
- `remove-role` : clé d’intention = `(subjectRef, roleCode, removeIntentId)`

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `role.created`
- `role.updated`
- `role.disabled`
- `role.assignment.updated`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- sync annuaire externe ;
- notification opératoire ;
- analytics.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` minimum ;
- `M2` recommandé dès qu’il y a plusieurs rôles réels ;
- `M3` pour gouvernance plus fine ou multi-scope.

### Pourquoi

Les rôles structurent l’accès au système.
Une erreur ici se propage partout.

### Points d’exploitation à surveiller

- rôles désactivés ;
- assignations incohérentes ;
- dérives rôle / permission ;
- changements fréquents.

---

## Impact coût / complexité

Le coût du domaine `roles` monte principalement avec :

- le nombre de rôles ;
- le nombre de scopes ;
- la richesse des assignations ;
- la densité de gouvernance.

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Créer un rôle
2. L’assigner à un utilisateur
3. Le désactiver
4. Faire évoluer sa composition

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- rôle introuvable ;
- assignation dupliquée ;
- rôle archivé réutilisé ;
- rôle sans cohérence de composition.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `roles` est un domaine coeur non toggleable ;
- il agrège des permissions ;
- il reste distinct de `users`, `permissions` et `auth` ;
- la gouvernance d’accès est explicite et auditable.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `roles` appartient au noyau du socle ;
- un rôle n’est pas une permission ;
- l’assignation de rôle est traçable ;
- la gouvernance d’accès ne doit pas être codée implicitement dans les domaines métier.
