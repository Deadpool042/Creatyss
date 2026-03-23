# Domaine `permissions`

## Objectif

Ce document décrit le domaine `permissions` dans la doctrine courante du socle.

Il précise :

- le rôle du domaine ;
- sa place dans la modularité du socle ;
- sa source de vérité ;
- ses objets métier ;
- ses invariants ;
- son cycle de vie ;
- ses règles de cohérence ;
- ses implications de maintenance, d’exploitation et de coût.

Le domaine `permissions` porte les droits atomiques du socle.

Il ne doit pas être confondu avec :

- `roles`, qui les agrègent ;
- `auth`, qui authentifie ;
- `users`, qui portent les sujets humains ;
- `api-clients`, qui portent des sujets techniques.

---

## Position dans la doctrine de modularité

Le domaine `permissions` est classé comme :

- `domaine coeur non toggleable`

Le domaine existe dans tout socle sérieux, car les autorisations doivent reposer sur un vocabulaire explicite et stable.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- un référentiel de permissions ;
- des codes stables ;
- une gouvernance explicite de création et d’évolution ;
- une articulation claire avec `roles`.

---

## Rôle

Le domaine `permissions` porte les droits atomiques du socle.

Il constitue la source de vérité interne pour :

- l’existence d’une permission ;
- son code ;
- son périmètre logique ;
- son statut ;
- sa description.

Le domaine est distinct :

- de `roles`, qui composent ces permissions ;
- de `users`, qui reçoivent indirectement des permissions via rôles ou policy ;
- de `auth`, qui authentifie les sujets ;
- de `api-clients`, qui peuvent se voir attribuer un scope de permissions.

---

## Responsabilités

Le domaine `permissions` prend en charge :

- la définition des permissions atomiques ;
- leur nommage stable ;
- leur description ;
- leur cycle de vie ;
- leur lisibilité pour les autres domaines.

---

## Ce que le domaine ne doit pas faire

Le domaine `permissions` ne doit pas :

- porter les rôles ;
- porter les utilisateurs ;
- porter les sessions ;
- devenir un système d’authentification ;
- laisser des permissions implicites exister hors du référentiel.

---

## Source de vérité

Le domaine `permissions` est la source de vérité pour :

- les permissions atomiques ;
- leur identité ;
- leur statut ;
- leur description fonctionnelle.

Le domaine n’est pas la source de vérité pour :

- les rôles ;
- les assignations ;
- les utilisateurs ;
- les clients API ;
- les sessions.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `Permission`
- `PermissionStatus`
- `PermissionScope`

---

## Capabilities activables liées

Le domaine `permissions` est structurel.
Il n’est pas piloté par des capabilities optionnelles.

Sa richesse augmente avec celle du socle, mais son existence n’est pas optionnelle.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

- référentiel simple ;
- codes stables ;
- peu de scopes.

### Niveau 2 — standard

- meilleure structuration ;
- descriptions plus complètes ;
- couverture plus large des domaines.

### Niveau 3 — avancé

- scopes plus fins ;
- gouvernance plus forte ;
- meilleure organisation par sous-domaines.

### Niveau 4 — expert / multi-contraintes

- matrice de permissions très dense ;
- gouvernance plus lourde ;
- forte exigence de stabilité et d’audit.

---

## Entrées

Le domaine reçoit principalement :

- des commandes de création ou mise à jour de permission ;
- des changements de statut ;
- des besoins d’extension du référentiel.

---

## Sorties

Le domaine expose principalement :

- un référentiel de permissions ;
- des permissions actives ou inactives ;
- des événements de changement du référentiel.

---

## Dépendances vers autres domaines

Le domaine `permissions` dépend de :

- `audit`
- `observability`

Les domaines suivants dépendent de `permissions` :

- `roles`
- `authz`
- `api-clients`
- `admin`
- tous les domaines protégés

---

## Dépendances vers providers / intégrations

Le domaine `permissions` ne dépend d’aucun provider externe comme vérité primaire.

---

## Rôles / permissions concernés

### Rôles

Les rôles de gouvernance concernés sont notamment :

- `platform_owner`
- `platform_engineer`
- `security_operator`

### Permissions

Exemples de permissions concernées :

- `permissions.read`
- `permissions.write`
- `roles.write`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `permission.created`
- `permission.updated`
- `permission.disabled`

---

## Événements consommés

Le domaine consomme peu d’événements.
Il peut réagir à certains changements de gouvernance plateforme si le modèle le prévoit.

---

## Données sensibles / sécurité

Le domaine `permissions` porte une donnée critique de sécurité.

Points de vigilance :

- une permission mal définie propage un risque à tout le système ;
- les changements doivent être auditables ;
- le référentiel doit rester stable et lisible.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelles permissions existent ;
- lesquelles sont actives ;
- pourquoi une permission a changé.

### Audit

Il faut tracer :

- création ;
- modification ;
- désactivation.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une permission possède un code stable ;
- une permission appartient au référentiel du socle ;
- les permissions implicites sont interdites ;
- les rôles agrègent des permissions existantes ;
- une permission désactivée n’est pas considérée comme active.

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

- réactivation implicite d’une permission archivée ;
- suppression silencieuse d’une permission encore référencée.

### Règles de conservation / archivage / suppression

- le référentiel reste auditables ;
- les changements historiques doivent rester compréhensibles ;
- l’archivage est préférable à la suppression implicite des droits structurants.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’une permission ;
- mise à jour structurante ;
- changement de statut ;
- écriture des événements `permission.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- projections admin ;
- analytics sécurité ;
- notifications opératoires.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les changements structurants ;
- unicité des codes ;
- refus des doubles créations logiques.

Les conflits attendus sont :

- création concurrente du même code ;
- changement concurrent de statut ;
- renommage incohérent.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `upsert-permission` : clé d’intention = `(permissionCode, changeIntentId)`
- `set-permission-status` : clé d’intention = `(permissionCode, targetStatus, changeIntentId)`

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `permission.created`
- `permission.updated`
- `permission.disabled`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- sync annuaire externe ;
- notifications ;
- analytics.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` minimum ;
- `M2` recommandé pour un socle avec plusieurs domaines protégés ;
- `M3` si la matrice de permissions devient plus dense.

### Pourquoi

Le domaine `permissions` influence toute l’autorisation du socle.
Sa stabilité est critique.

### Points d’exploitation à surveiller

- permissions non utilisées ;
- permissions désactivées encore référencées ;
- doublons logiques ;
- dérive entre rôle et référentiel.

---

## Impact coût / complexité

Le coût du domaine `permissions` monte principalement avec :

- le volume du référentiel ;
- la finesse des scopes ;
- la densité de gouvernance.

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Définir une permission
2. La désactiver
3. L’utiliser dans un rôle
4. Maintenir un référentiel stable

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- code permission dupliqué ;
- permission archivée réutilisée ;
- renommage incohérent ;
- suppression implicite interdite.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `permissions` est un domaine coeur non toggleable ;
- il porte le référentiel atomique d’autorisation ;
- il reste distinct de `roles`, `users`, `auth` et `api-clients` ;
- les permissions implicites sont interdites ;
- le référentiel reste stable et gouverné.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `permissions` appartient au noyau du socle ;
- une permission n’est ni un rôle, ni un user ;
- le référentiel doit rester explicite ;
- la stabilité des codes est non négociable ;
- la gouvernance d’autorisation est une responsabilité de premier rang.
