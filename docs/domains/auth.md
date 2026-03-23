# Domaine `auth`

## Rôle

Le domaine `auth` porte l’authentification humaine structurée du socle.
Il organise les identités d’authentification, credentials, sessions, recovery, MFA et états d’accès nécessaires pour permettre à un acteur autorisé d’ouvrir, maintenir ou perdre une session.

## Responsabilités

Le domaine `auth` prend en charge :

- les identités d’authentification
- les credentials de mot de passe
- les sessions d’authentification
- le login et le logout
- la révocation de session
- le bootstrap admin
- les demandes de recovery
- le changement de mot de passe
- l’activation MFA
- le verrouillage et durcissement d’accès

## Ce que le domaine ne doit pas faire

Le domaine `auth` ne doit pas :

- porter les utilisateurs métier complets
- porter les rôles fonctionnels
- porter les permissions fines
- porter les clients techniques machine-to-machine
- devenir un domaine généraliste de sécurité absorbant toute la gouvernance d’accès
- prendre un provider externe d’identité comme vérité primaire du socle

Le domaine `auth` porte l’authentification humaine structurée.
Il ne remplace ni `users`, ni `roles`, ni `permissions`, ni `api-clients`, ni `integrations`.

## Sous-domaines

- `identities` : identités d’authentification
- `credentials` : mot de passe et versionnement
- `sessions` : sessions actives, expirées ou révoquées
- `recovery` : demandes et codes de récupération
- `mfa` : enrollment MFA
- `bootstrap` : initialisation du premier accès admin

## Entrées

Le domaine reçoit principalement :

- des commandes de création d’identité
- des demandes de login et logout
- des demandes de changement de mot de passe
- des demandes de recovery
- des commandes de révocation de session
- des actions d’activation ou désactivation MFA

## Sorties

Le domaine expose principalement :

- une `AuthIdentity`
- une `AuthPasswordCredential`
- une `AuthSession`
- une `AuthRecoveryRequest`
- une `AuthMfaEnrollment`
- un état d’authentification exploitable par les domaines protégés

## Dépendances vers autres domaines

Le domaine `auth` dépend de :

- `users` pour le rattachement d’identité
- `roles` et `permissions` pour certains contrôles d’accès initiaux
- `audit` pour tracer les opérations sensibles
- `observability` pour diagnostiquer les refus ou anomalies
- `notifications` pour les emails de recovery après commit
- `integrations` si un provider externe d’identité est utilisé comme connecteur technique

Les domaines suivants dépendent de `auth` :

- tous les domaines protégés
- `admin`
- `audit`
- `observability`

## Capabilities activables liées

Le domaine `auth` est lié à :

- `adminBootstrap`
- `passwordRecovery`
- `mfa`
- `sessionManagement`

### Effet si `mfa` est activée

Le domaine exige ou supporte une vérification MFA selon la politique retenue.

### Effet si `passwordRecovery` est activée

Le domaine permet des recovery requests structurées et traçables.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `security_operator`
- tout acteur humain authentifié

### Permissions

Exemples de permissions concernées :

- `auth.read`
- `auth.write`
- `auth.session.revoke`
- `auth.password.reset`
- `auth.mfa.manage`
- `audit.read`

## Événements émis

Le domaine émet les domain events internes suivants :

- `auth.identity.created`
- `auth.identity.locked`
- `auth.identity.unlocked`
- `auth.login.succeeded`
- `auth.login.failed`
- `auth.session.created`
- `auth.session.revoked`
- `auth.password.changed`
- `auth.recovery.requested`
- `auth.recovery.completed`
- `auth.mfa.enabled`
- `auth.mfa.disabled`
- `auth.bootstrap.completed`

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `user.created`
- `user.disabled`
- `user.deleted`
- `role.updated`
- `permission.updated`
- certaines actions administratives structurées de création, verrouillage ou réinitialisation d’accès

## Intégrations externes

Le domaine `auth` ne dépend pas d’un provider externe comme vérité primaire.
Si un provider externe existe, il est intégré via `integrations` et traduit dans le langage interne du socle.

Le domaine `auth` reste la source de vérité interne de l’état d’authentification humaine.

## Données sensibles / sécurité

Le domaine `auth` manipule des données hautement sensibles.

Points de vigilance :

- hash strict des mots de passe, tokens et recovery codes
- contrôle fort des changements de secret
- rotation et révocation de session traçables
- limitation des tentatives et verrouillage explicite
- interdiction de fuite d’informations sensibles dans les logs

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un login a réussi ou échoué
- pourquoi une identité est active, verrouillée, suspendue ou désactivée
- quelles sessions sont actives ou révoquées
- pourquoi une demande de recovery a été créée, consommée ou révoquée
- quel événement a déclenché un changement d’état

### Audit

Il faut tracer :

- la création d’identité
- les verrouillages et déverrouillages
- les logins et échecs significatifs
- les créations et révocations de session
- les changements de mot de passe
- les opérations MFA
- les recoveries

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `AuthIdentity`
- `AuthPasswordCredential`
- `AuthSession`
- `AuthRecoveryRequest`
- `AuthMfaEnrollment`
- `AuthRecoveryCode`

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une identité d’auth est rattachée à un utilisateur unique
- une session active appartient à une identité existante
- un token ou secret n’est jamais stocké en clair
- une identité verrouillée ou désactivée n’ouvre pas de nouvelle session
- une opération sensible d’auth laisse une trace exploitable

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’une identité et de son credential initial
- changement de mot de passe et invalidation des éléments nécessaires
- création d’une session après login réussi
- révocation d’une session
- révocation de toutes les sessions d’une identité
- création et consommation d’une demande de recovery
- activation ou désactivation MFA
- écriture des events `auth.*` correspondants

### Ce qui peut être eventual consistency

Les traitements suivants ont lieu après commit :

- envoi d’email de recovery
- notification de changement de mot de passe
- analytics sécurité
- webhook sortant
- synchronisation externe de sécurité

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- une transaction applicative pour chaque mutation sensible
- une seule identité d’auth par utilisateur
- un seul credential courant par identité
- une garde stricte sur le statut de l’identité avant login ou mutation
- l’invalidation cohérente des sessions lors des opérations qui l’exigent

Les conflits attendus sont :

- deux logins concurrents
- deux changements de mot de passe concurrents
- consommation concurrente du même recovery token
- activation MFA concurrente
- révocation et login concurrents

### Idempotence

Les commandes métier suivantes sont idempotentes :

- `revoke-session` : clé d’idempotence = `sessionId`
- `revoke-all-sessions` : clé d’idempotence = `(identityId, revokeIntentId)`
- `complete-recovery` : clé d’idempotence = `(recoveryRequestId, completionIntentId)`

Un retry ne doit jamais produire deux changements de secret divergents ni des révocations inconsistantes.

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `auth.identity.created`
- `auth.identity.locked`
- `auth.identity.unlocked`
- `auth.login.succeeded`
- `auth.login.failed`
- `auth.session.created`
- `auth.session.revoked`
- `auth.password.changed`
- `auth.recovery.requested`
- `auth.recovery.completed`
- `auth.mfa.enabled`
- `auth.mfa.disabled`
- `auth.bootstrap.completed`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- email de recovery
- notification utilisateur
- webhook sortant
- intégration sécurité externe
- analytics sécurité

## Cas d’usage principaux

1. Créer une identité d’authentification
2. Ouvrir une session après login réussi
3. Révoquer une session ou toutes les sessions
4. Changer un mot de passe
5. Créer et consommer une demande de recovery
6. Activer ou désactiver MFA

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- identité introuvable
- identité verrouillée ou désactivée
- mot de passe invalide
- session introuvable ou déjà révoquée
- token de recovery expiré
- token de recovery déjà consommé
- tentative MFA invalide
- conflit concurrent sur une opération sensible

## Décisions d’architecture

Les choix structurants du domaine sont :

- `auth` porte l’authentification humaine du socle
- les secrets sont stockés sous forme protégée
- les mutations sensibles sont transactionnelles
- les événements `auth.*` passent par l’outbox
- les notifications partent après commit
- les providers externes éventuels sont confinés à `integrations`

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- l’authentification humaine relève de `auth`
- les utilisateurs métier relèvent de `users`
- les rôles et permissions relèvent de leurs domaines dédiés
- les clients machine-to-machine relèvent de `api-clients`
- les opérations sensibles d’auth sont atomiques et auditables
- les effets externes partent après commit
