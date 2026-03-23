# Domaine `users`

## Objectif

Ce document décrit le domaine `users` dans la doctrine courante du socle.

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
- ses frontières externes ;
- ses implications de maintenance, d’exploitation et de coût.

Le domaine `users` est structurant pour le socle, car il porte l’identité applicative des personnes qui utilisent la plateforme ou l’administration d’une boutique.

Le domaine `users` ne doit pas être confondu avec :

- `auth`, qui porte les credentials et les sessions ;
- `customers`, qui porte le client métier d’une boutique ;
- `roles` et `permissions`, qui portent l’autorisation ;
- `api-clients`, qui porte les accès machine-to-machine.

Le domaine `users` porte la **vérité humaine interne de l’acteur applicatif**.

---

## Position dans la doctrine de modularité

Le domaine `users` est classé comme :

- `domaine coeur non toggleable`

Le domaine existe dans tous les projets sérieux du socle, car il faut une identité humaine applicative claire pour gouverner l’administration, l’exploitation et certaines interactions métier internes.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- une identité utilisateur stable ;
- une distinction claire entre user applicatif et client métier ;
- un rattachement explicite aux rôles d’autorisation ;
- un cycle de vie lisible ;
- une articulation claire avec `auth`.

### Ce qui est activable / désactivable par capability

Le domaine `users` n’est pas principalement piloté par des capabilities métier optionnelles.
Il est structurel.

En revanche, certains enrichissements peuvent dépendre des capabilities de la plateforme, comme :

- multi-boutiques ;
- délégation d’administration ;
- profils opérateurs plus riches ;
- B2B backoffice plus structuré.

### Ce qui relève d’un niveau

Le domaine varie surtout par richesse de profil, gouvernance, rattachements et organisation interne, pas par existence.

### Ce qui relève d’un provider ou d’une intégration externe

Un annuaire externe ou provider d’identité éventuel relève de `integrations`.
Il ne remplace pas la vérité interne du domaine `users`.

---

## Rôle

Le domaine `users` porte l’identité applicative des personnes qui utilisent la plateforme ou le backoffice.

Il constitue la source de vérité interne pour :

- l’existence d’un utilisateur humain ;
- son profil applicatif ;
- son statut ;
- son rattachement à une ou plusieurs boutiques si le modèle le prévoit ;
- son articulation avec `auth`, `roles` et `permissions`.

Le domaine est distinct :

- de `auth`, qui porte l’accès ;
- de `customers`, qui porte le client boutique ;
- de `roles`, qui portent les agrégats d’autorisation ;
- de `permissions`, qui portent les droits atomiques.

---

## Responsabilités

Le domaine `users` prend en charge :

- la création et gestion des utilisateurs applicatifs ;
- les informations de profil utiles à l’application ;
- le statut d’un utilisateur ;
- la relation utilisateur <-> boutique si le modèle le prévoit ;
- la distinction entre opérateur, propriétaire, manager ou support selon les rôles associés ;
- la source de vérité du user utilisé par les autres domaines internes.

---

## Ce que le domaine ne doit pas faire

Le domaine `users` ne doit pas :

- porter les credentials ou sessions ;
- porter les permissions atomiques ;
- porter la logique de client boutique ;
- devenir un annuaire externe générique ;
- confondre user interne et contact client ;
- laisser les autres domaines redéfinir l’identité utilisateur applicative.

---

## Source de vérité

Le domaine `users` est la source de vérité pour :

- l’identité utilisateur applicative ;
- son statut ;
- ses métadonnées applicatives ;
- son rattachement organisationnel interne.

Le domaine n’est pas la source de vérité pour :

- le mot de passe, les recovery requests ou les sessions ;
- les permissions atomiques ;
- le client métier d’une boutique ;
- les connecteurs d’annuaire externes.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `User`
- `UserStatus`
- `UserProfile`
- `UserStoreMembership`
- `UserType`

---

## Capabilities activables liées

Le domaine `users` n’est pas principalement capability-driven, mais il est influencé par le contexte du socle, notamment :

- `multiStorefront`
- `b2bCommerce`
- `adminDelegation`
- `customerAccounts`

### Effet des capabilities de plateforme

Ces capabilities enrichissent le contexte d’un utilisateur, sans changer la nature du domaine.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

- identité utilisateur simple ;
- statut ;
- profil léger ;
- rattachement minimal.

### Niveau 2 — standard

- meilleur profil utilisateur ;
- rattachement plus clair à une ou plusieurs boutiques ;
- meilleur support administratif.

### Niveau 3 — avancé

- gouvernance plus riche ;
- délégation ;
- memberships plus structurés ;
- exploitation plus fine.

### Niveau 4 — expert / multi-contraintes

- organisation applicative plus dense ;
- plusieurs scopes internes ;
- gouvernance et audit plus poussés.

---

## Entrées

Le domaine reçoit principalement :

- des commandes de création ou mise à jour d’utilisateur ;
- des rattachements à des boutiques ;
- des changements de statut ;
- des résultats d’intégration traduits si un annuaire externe est branché.

---

## Sorties

Le domaine expose principalement :

- un utilisateur applicatif ;
- son statut ;
- son profil ;
- ses rattachements internes ;
- des événements liés au cycle de vie utilisateur.

---

## Dépendances vers autres domaines

Le domaine `users` dépend de :

- `stores`
- `auth`
- `audit`
- `observability`

Les domaines suivants dépendent de `users` :

- `roles`
- `permissions`
- `admin`
- `audit`
- `customer-support`
- tous les domaines nécessitant un acteur interne identifié

---

## Dépendances vers providers / intégrations

Le domaine `users` peut consommer des résultats externes traduits via `integrations`, mais garde une vérité locale.

Un annuaire externe ne remplace pas le domaine `users`.
Il l’alimente ou le synchronise sous contrôle explicite.

---

## Rôles / permissions concernés

### Rôles

Les rôles concernés sont notamment :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `customer_support`
- `finance_manager`
- `security_operator`

### Permissions

Exemples de permissions concernées :

- `users.read`
- `users.write`
- `users.memberships.manage`
- `roles.assign`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `user.created`
- `user.updated`
- `user.disabled`
- `user.reactivated`
- `user.membership.updated`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `auth.identity.created`
- `auth.identity.locked`
- `auth.identity.unlocked`
- `integration.user.result.translated`
- `store.created`

---

## Données sensibles / sécurité

Le domaine `users` porte une donnée sensible du point de vue organisationnel et d’accès.

Points de vigilance :

- un utilisateur applicatif doit être distinct d’un client boutique ;
- ses rattachements doivent rester cohérents avec les droits attribués ;
- les changements de statut doivent être auditables ;
- les imports externes ne doivent pas créer de doubles vérités.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- qui est l’utilisateur ;
- quel est son statut ;
- à quelles boutiques il est rattaché ;
- pourquoi il a été désactivé ou réactivé ;
- quel lien il entretient avec son identité `auth`.

### Audit

Il faut tracer :

- les créations ;
- les désactivations ;
- les réactivations ;
- les changements de rattachement ;
- les imports structurants.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un utilisateur possède une identité stable ;
- un utilisateur applicatif est distinct d’un client boutique ;
- `users` reste distinct de `auth` ;
- un utilisateur désactivé n’est pas traité comme pleinement actif par les autres domaines ;
- les autres domaines utilisent l’identité utilisateur, ils ne la redéfinissent pas.

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

- réactivation implicite d’un utilisateur archivé ;
- suppression silencieuse de l’utilisateur alors qu’il est référencé par audit ou opérations.

### Règles de conservation / archivage / suppression

- les utilisateurs restent traçables ;
- les références d’audit doivent rester compréhensibles ;
- l’archivage est préférable à la suppression implicite.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’un utilisateur ;
- changement de statut ;
- création ou mise à jour d’un membership ;
- écriture des événements `user.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- synchronisation externe ;
- analytics ;
- notifications opératoires.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les changements structurants ;
- unicité logique de l’utilisateur ;
- validation des memberships.

Les conflits attendus sont :

- double création logique ;
- changement concurrent de statut ;
- membership concurrent incohérent.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `upsert-user` : clé d’intention = `(userRef, changeIntentId)`
- `set-user-status` : clé d’intention = `(userId, targetStatus, changeIntentId)`
- `upsert-user-membership` : clé d’intention = `(userId, storeId, membershipIntentId)`

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `user.created`
- `user.updated`
- `user.disabled`
- `user.reactivated`
- `user.membership.updated`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- sync annuaire externe ;
- notifications ;
- analytics.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` minimum ;
- `M2` recommandé dès qu’il y a plusieurs rôles, memberships ou gouvernance plus riche ;
- `M3` pour organisation plus dense ou synchronisations externes fréquentes.

### Pourquoi

Le domaine `users` structure l’identité opérateur et impacte directement sécurité, audit et administration.

### Points d’exploitation à surveiller

- utilisateurs désactivés ;
- memberships incohérents ;
- divergence `users` / `auth` ;
- imports externes.

---

## Impact coût / complexité

Le coût du domaine `users` monte principalement avec :

- memberships multi-boutiques ;
- profils plus riches ;
- synchronisations externes ;
- gouvernance interne plus dense.

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Créer un utilisateur applicatif
2. Le rattacher à une boutique
3. Le désactiver ou le réactiver
4. Exposer un acteur interne fiable au reste du socle

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- utilisateur introuvable ;
- double identité logique ;
- membership invalide ;
- utilisateur archivé modifié ;
- divergence `auth` / `users`.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `users` est un domaine coeur non toggleable ;
- il porte l’identité applicative humaine ;
- il reste distinct de `auth`, `customers`, `roles` et `permissions` ;
- il sert de base organisationnelle aux autres domaines internes ;
- les annuaires externes éventuels restent dans `integrations`.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `users` appartient au noyau du socle ;
- il ne se confond ni avec `auth`, ni avec `customers` ;
- il porte l’identité applicative, pas le credential ;
- les memberships et statuts sont structurants ;
- la gouvernance utilisateur doit rester auditable.
