# Domaine `api-clients`

## Objectif

Ce document décrit le domaine `api-clients` dans la doctrine courante du socle.

Il précise :

- le rôle du domaine ;
- sa place dans la modularité du socle ;
- sa source de vérité ;
- ses capabilities activables ;
- ses objets métier ;
- ses invariants ;
- son cycle de vie ;
- ses règles de cohérence ;
- ses implications de maintenance, d’exploitation et de coût.

Le domaine `api-clients` porte les accès machine-to-machine du socle.

Il ne doit pas être confondu avec :

- `auth`, qui porte l’authentification humaine ;
- `users`, qui porte les acteurs humains ;
- `integrations`, qui porte les connecteurs provider-specific ;
- `permissions`, qui porte le référentiel de droits atomiques.

Le domaine `api-clients` porte la **vérité des sujets techniques internes ou partenaires autorisés à consommer certaines APIs du socle**.

---

## Position dans la doctrine de modularité

Le domaine `api-clients` est classé comme :

- `domaine coeur à capabilities toggleables`

Le domaine n’est pas nécessairement exposé dans tous les projets au démarrage, mais il doit exister comme brique claire dès qu’il y a des accès machine-to-machine structurés.

### Ce qui n’est jamais désactivé

Quand le domaine est activé, il conserve toujours :

- une identité client technique ;
- des credentials séparés ;
- un cycle de vie lisible ;
- un scope d’accès explicite ;
- une séparation nette avec les users humains et les integrations provider-specific.

### Ce qui est activable / désactivable par capability

Le domaine `api-clients` est lié aux capabilities suivantes :

- `apiClients`
- `scopedApiAccess`
- `apiClientRotation`
- `partnerApiAccess`

### Ce qui relève d’un niveau

Le domaine varie par richesse de gouvernance, rotation, scopes et audit.

### Ce qui relève d’un provider ou d’une intégration externe

Le domaine `api-clients` n’est pas un connecteur externe.
Il porte les consommateurs techniques autorisés du socle.

---

## Rôle

Le domaine `api-clients` porte les clients techniques autorisés à accéder à certaines APIs ou flux du socle.

Il constitue la source de vérité interne pour :

- l’existence d’un client technique ;
- son statut ;
- ses scopes ou permissions techniques ;
- ses secrets ou credentials techniques associés ;
- son cycle de rotation ou révocation.

Le domaine est distinct :

- de `auth`, qui porte l’accès humain ;
- de `users`, qui porte les personnes ;
- de `integrations`, qui porte les connecteurs sortants vers des providers ;
- de `permissions`, qui porte le référentiel atomique de droits.

---

## Responsabilités

Le domaine `api-clients` prend en charge :

- la création de clients API ;
- la gestion de leurs credentials techniques ;
- la gestion de leur statut ;
- la gestion de leur scope ;
- la rotation et la révocation des credentials ;
- la traçabilité des opérations sensibles sur ces clients techniques.

---

## Ce que le domaine ne doit pas faire

Le domaine `api-clients` ne doit pas :

- porter les users humains ;
- porter les rôles humains ;
- se confondre avec `integrations` ;
- stocker des secrets comme des données ordinaires ;
- laisser un client technique exister sans scope explicite.

---

## Source de vérité

Le domaine `api-clients` est la source de vérité pour :

- les clients techniques ;
- leur statut ;
- leurs scopes ;
- leurs credentials techniques ;
- leur rotation ou révocation.

Le domaine n’est pas la source de vérité pour :

- les users humains ;
- les connecteurs providers ;
- les sessions humaines ;
- le référentiel global de permissions.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `ApiClient`
- `ApiClientStatus`
- `ApiClientCredential`
- `ApiClientScope`
- `ApiCredentialRotation`

---

## Capabilities activables liées

Le domaine `api-clients` est lié aux capabilities suivantes :

- `apiClients`
- `scopedApiAccess`
- `apiClientRotation`
- `partnerApiAccess`

### Effet si `apiClients` est activée

Le socle supporte des clients techniques explicites.

### Effet si `scopedApiAccess` est activée

Le domaine porte des scopes ou permissions techniques plus précis.

### Effet si `apiClientRotation` est activée

Le domaine supporte des workflows de rotation et révocation plus riches.

### Effet si `partnerApiAccess` est activée

Le domaine peut porter certains clients techniques externes partenaires autorisés.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

- client technique simple ;
- credential ;
- statut ;
- scope limité.

### Niveau 2 — standard

- scopes plus précis ;
- meilleure rotation ;
- meilleure lisibilité de gouvernance.

### Niveau 3 — avancé

- partenaires externes ;
- rotation structurée ;
- meilleure observability de sécurité ;
- meilleure gouvernance des accès techniques.

### Niveau 4 — expert / multi-contraintes

- exigences plus fortes d’audit, révocation, rotation et isolation.

---

## Entrées

Le domaine reçoit principalement :

- des commandes de création de client API ;
- des demandes de rotation ;
- des demandes de révocation ;
- des changements de scope ;
- des signaux de sécurité ou d’administration.

---

## Sorties

Le domaine expose principalement :

- un client technique ;
- un statut ;
- un scope ;
- un credential technique ;
- des événements liés à la gouvernance des accès techniques.

---

## Dépendances vers autres domaines

Le domaine `api-clients` dépend de :

- `permissions`
- `audit`
- `observability`

Les domaines suivants dépendent de `api-clients` :

- `authz`
- `admin`
- certaines APIs internes protégées

---

## Dépendances vers providers / intégrations

Le domaine `api-clients` ne porte pas les connecteurs sortants.
Il porte les consommateurs techniques autorisés à entrer dans le socle.

Il reste distinct de `integrations`.

---

## Rôles / permissions concernés

### Rôles

Les rôles concernés sont notamment :

- `platform_owner`
- `platform_engineer`
- `security_operator`
- `integration_operator`

### Permissions

Exemples de permissions concernées :

- `api_clients.read`
- `api_clients.write`
- `api_clients.rotate`
- `api_clients.revoke`
- `permissions.read`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `api_client.created`
- `api_client.updated`
- `api_client.disabled`
- `api_client.credential.rotated`
- `api_client.credential.revoked`

---

## Événements consommés

Le domaine consomme principalement des événements administratifs ou de sécurité structurants si le socle en prévoit.

---

## Données sensibles / sécurité

Le domaine `api-clients` manipule une donnée hautement sensible.

Points de vigilance :

- les secrets techniques doivent être protégés ;
- la rotation doit être explicite ;
- les scopes doivent rester minimaux et audités ;
- la révocation doit être claire et exploitable ;
- un client technique compromis ne doit pas être traité comme un user humain.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quels clients API existent ;
- quels scopes ils portent ;
- lesquels sont actifs ou révoqués ;
- quand un credential a été tourné ou révoqué.

### Audit

Il faut tracer :

- création ;
- changement de scope ;
- rotation ;
- révocation ;
- désactivation ;
- réactivation.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un client API possède une identité stable ;
- un client API possède un scope explicite ;
- un credential technique révoqué n’est plus utilisable ;
- `api-clients` reste distinct de `users` et `integrations` ;
- les secrets techniques ne sont pas traités comme des données ordinaires.

---

## Lifecycle et gouvernance des données

### États principaux

Les états principaux incluent typiquement :

- `ACTIVE`
- `DISABLED`
- `REVOKED`
- `ARCHIVED`

Les credentials peuvent être :

- actifs ;
- rotated ;
- revoked.

### Transitions autorisées

Exemples :

- `ACTIVE -> DISABLED`
- `DISABLED -> ACTIVE`
- `ACTIVE -> REVOKED`
- credential actif -> rotated
- credential actif -> revoked

### Transitions interdites

Exemples :

- un client révoqué redevient actif sans flux explicite ;
- un credential révoqué redevient utilisable ;
- un scope disparaît silencieusement sans traçabilité.

### Règles de conservation / archivage / suppression

- les clients techniques et leurs changements sensibles restent auditables ;
- les credentials suivent une politique stricte ;
- l’archivage est préférable à la suppression implicite des sujets techniques structurants.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’un client API ;
- changement de scope ;
- rotation d’un credential ;
- révocation d’un credential ;
- changement de statut ;
- écriture des événements `api_client.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- notifications sécurité ;
- projections admin ;
- analytics sécurité ;
- synchronisation secondaire éventuelle.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les opérations sensibles ;
- unicité logique du client ;
- non-réutilisation d’un credential révoqué ;
- cohérence du scope actif.

Les conflits attendus sont :

- double rotation concurrente ;
- révocation et réactivation concurrentes ;
- changement de scope concurrent.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `upsert-api-client` : clé d’intention = `(apiClientRef, changeIntentId)`
- `rotate-api-client-credential` : clé d’intention = `(apiClientId, rotationIntentId)`
- `revoke-api-client` : clé d’intention = `(apiClientId, revokeIntentId)`
- `set-api-client-scope` : clé d’intention = `(apiClientId, scopeVersion, changeIntentId)`

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `api_client.created`
- `api_client.updated`
- `api_client.disabled`
- `api_client.credential.rotated`
- `api_client.credential.revoked`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- notification sécurité ;
- analytics ;
- sync secondaire ;
- monitoring externe.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M2` dès que le domaine est activé ;
- `M3` pour scopes riches ou partenaires externes ;
- `M4` pour exigences très fortes de rotation et audit.

### Pourquoi

Les accès machine-to-machine sont sensibles.
Ils exigent une gouvernance plus stricte qu’un simple paramètre technique.

### Points d’exploitation à surveiller

- clients API actifs ;
- rotations ;
- credentials révoqués ;
- scopes trop larges ;
- clients dormants ou incohérents.

---

## Impact coût / complexité

Le coût du domaine `api-clients` monte principalement avec :

- `scopedApiAccess`
- `apiClientRotation`
- `partnerApiAccess`
- les exigences de sécurité et d’audit.

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Créer un client API
2. Lui attribuer un scope
3. Tourner un credential
4. Révoquer un accès technique
5. Superviser des accès machine-to-machine

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- client API introuvable ;
- double création logique ;
- rotation concurrente ;
- scope incohérent ;
- credential révoqué réutilisé ;
- confusion entre client API et connecteur d’intégration.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `api-clients` est un domaine coeur à capabilities toggleables ;
- il porte les sujets techniques entrants du socle ;
- il reste distinct de `users`, `auth`, `permissions` et `integrations` ;
- les credentials techniques sont sensibles et gouvernés ;
- les scopes sont explicites ;
- la rotation et la révocation sont des opérations de premier rang.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `api-clients` ne se confond pas avec `integrations` ;
- un client API n’est pas un user humain ;
- les credentials techniques doivent être gouvernés comme des secrets ;
- le domaine devient indispensable dès qu’un accès machine-to-machine existe ;
- la gouvernance de ces accès doit être auditée.
