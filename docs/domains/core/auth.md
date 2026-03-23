# Domaine `auth`

## Objectif

Ce document décrit le domaine `auth` dans la doctrine courante du socle.

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

Le domaine `auth` est structurant pour la robustesse du socle, car il porte l’authentification humaine, les credentials, les sessions, les recoveries et les états d’accès.

Il n’est pas un détail technique.
Il fait partie du noyau non négociable du socle.

---

## Position dans la doctrine de modularité

Le domaine `auth` est classé comme :

- `domaine coeur à capabilities toggleables`

Le domaine existe dans tous les projets sérieux du socle.
En revanche, son niveau de sophistication varie selon les besoins de sécurité, d’exploitation et de conformité.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- une identité d’authentification explicite ;
- des credentials protégés ;
- des sessions structurées ;
- des transitions d’accès explicites ;
- des traces de sécurité utiles ;
- une séparation nette entre auth humaine et connecteurs techniques.

### Ce qui est activable / désactivable par capability

Le domaine `auth` est lié aux capabilities suivantes :

- `passwordRecovery`
- `mfa`
- `sessionManagement`
- `adminBootstrap`
- `loginThrottling`
- `securityNotifications`

### Ce qui relève d’un niveau

Le domaine porte plusieurs niveaux de sophistication de la sécurité d’accès.

### Ce qui relève d’un provider ou d’une intégration externe

Si un provider externe d’identité est utilisé, il reste :

- un connecteur ;
- géré via `integrations` ;
- traduit dans le langage interne.

Le domaine `auth` ne cède pas sa souveraineté interne à un provider externe.

---

## Rôle

Le domaine `auth` porte l’authentification humaine du socle.

Il constitue la source de vérité interne pour :

- les identités d’authentification ;
- les credentials d’accès ;
- les sessions ;
- les demandes de recovery ;
- l’activation de mécanismes supplémentaires comme MFA ;
- les états de verrouillage ou de révocation.

Le domaine est distinct :

- de `users`, qui porte l’utilisateur métier ;
- de `roles` et `permissions`, qui portent la gouvernance d’accès fonctionnelle ;
- de `api-clients`, qui porte les accès machine-to-machine ;
- de `integrations`, qui porte les connecteurs externes éventuels.

---

## Responsabilités

Le domaine `auth` prend en charge :

- la création d’identités d’authentification ;
- la gestion des credentials ;
- le login et le logout ;
- la création et la révocation de sessions ;
- les recoveries ;
- le changement de mot de passe ;
- l’activation ou la désactivation de MFA ;
- le verrouillage ou déverrouillage d’accès ;
- les événements de sécurité liés à l’auth.

---

## Ce que le domaine ne doit pas faire

Le domaine `auth` ne doit pas :

- porter les utilisateurs métier complets ;
- porter les rôles métier ou permissions fines ;
- porter les clients API techniques ;
- laisser un provider externe devenir la vérité interne ;
- stocker des secrets en clair ;
- transformer la sécurité en détail secondaire.

---

## Source de vérité

Le domaine `auth` est la source de vérité pour :

- l’identité d’authentification ;
- le credential d’accès ;
- la session ;
- la demande de recovery ;
- l’état verrouillé, révoqué ou actif de l’accès humain.

Le domaine n’est pas la source de vérité pour :

- l’utilisateur métier complet ;
- les permissions métiers ;
- les rôles ;
- les connecteurs techniques externes ;
- les clients machine-to-machine.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `AuthIdentity`
- `AuthPasswordCredential`
- `AuthSession`
- `AuthRecoveryRequest`
- `AuthMfaEnrollment`
- `AuthRecoveryCode`

---

## Capabilities activables liées

Le domaine `auth` est lié aux capabilities suivantes :

- `passwordRecovery`
- `mfa`
- `sessionManagement`
- `adminBootstrap`
- `loginThrottling`
- `securityNotifications`

### Effet si `passwordRecovery` est activée

Le domaine supporte un flux structuré de récupération d’accès.

### Effet si `mfa` est activée

Le domaine supporte une couche supplémentaire de vérification d’identité.

### Effet si `sessionManagement` est activée

Le domaine expose un contrôle plus riche sur les sessions.

### Effet si `adminBootstrap` est activée

Le domaine supporte un flux d’initialisation administrateur maîtrisé.

### Effet si `loginThrottling` est activée

Le domaine applique des règles plus strictes de limitation et de protection.

### Effet si `securityNotifications` est activée

Le domaine expose des événements utilisables pour informer l’utilisateur ou l’opérateur après commit.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

- identity + password credential ;
- login/logout ;
- session simple ;
- changement de mot de passe ;
- audit minimal.

### Niveau 2 — standard

- recovery structuré ;
- gestion plus claire des sessions ;
- meilleurs signaux de sécurité ;
- gouvernance plus lisible de l’accès.

### Niveau 3 — avancé

- MFA ;
- throttling plus riche ;
- révocation de toutes les sessions ;
- observability de sécurité plus forte ;
- meilleure discipline opératoire.

### Niveau 4 — expert / multi-contraintes

- exigences plus fortes d’audit, de contrôle d’accès, de gestion des incidents et de gouvernance sécurité.

---

## Entrées

Le domaine reçoit principalement :

- des commandes de création d’identité ;
- des demandes de login et logout ;
- des demandes de changement de mot de passe ;
- des demandes de recovery ;
- des commandes de révocation ;
- des activations ou désactivations MFA ;
- des signaux issus d’actions administratives structurées.

---

## Sorties

Le domaine expose principalement :

- une identité d’auth ;
- un credential courant ;
- une session ;
- un état de sécurité de l’accès ;
- des événements liés à l’auth ;
- des informations utilisables par les domaines protégés.

---

## Dépendances vers autres domaines

Le domaine `auth` dépend de :

- `users`
- `roles`
- `permissions`
- `audit`
- `observability`
- `notifications` pour certains usages post-commit
- `integrations` si un provider d’identité externe est branché comme connecteur

Les domaines suivants dépendent de `auth` :

- tous les domaines protégés ;
- `admin` ;
- `audit` ;
- `observability`

---

## Dépendances vers providers / intégrations

Le domaine `auth` ne dépend pas d’un provider externe comme vérité primaire.

S’il existe un provider externe d’identité, il est traité comme connecteur via `integrations`, puis traduit dans le langage du domaine.

Le domaine `auth` garde :

- sa propre identité interne ;
- ses propres règles de session ;
- ses propres transitions de sécurité ;
- son propre audit.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
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

---

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

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `user.created`
- `user.disabled`
- `user.deleted`
- `role.updated`
- `permission.updated`
- certains événements administratifs structurés de création, verrouillage ou réinitialisation d’accès

---

## Données sensibles / sécurité

Le domaine `auth` manipule une donnée hautement sensible.

Points de vigilance :

- aucun secret ne doit être stocké en clair ;
- les credentials et recovery tokens doivent être protégés ;
- les sessions doivent être révoquées ou expirées proprement ;
- les transitions de sécurité doivent être auditables ;
- les logs ne doivent pas exposer de secrets ;
- les providers externes éventuels ne doivent pas contourner la gouvernance interne.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un login a réussi ou échoué ;
- pourquoi une identité est active, verrouillée ou désactivée ;
- quelles sessions sont actives ou révoquées ;
- pourquoi une demande de recovery a été créée, consommée ou rejetée ;
- quel événement a déclenché une mutation sensible.

### Audit

Il faut tracer :

- la création d’identité ;
- les verrouillages et déverrouillages ;
- les logins significatifs ;
- les créations et révocations de session ;
- les changements de mot de passe ;
- les activations ou désactivations MFA ;
- les recoveries ;
- les bootstrap admin.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une identité d’auth est rattachée à un utilisateur unique ;
- une session active appartient à une identité existante ;
- les secrets ne sont jamais stockés comme de simples données ordinaires ;
- une identité verrouillée ou désactivée n’ouvre pas de nouvelle session ;
- une opération sensible d’auth laisse une trace exploitable ;
- un provider externe éventuel ne remplace pas la vérité interne du domaine.

---

## Lifecycle et gouvernance des données

### États principaux

Les états principaux pertinents incluent :

- identité `ACTIVE`, `LOCKED`, `DISABLED`
- session `ACTIVE`, `EXPIRED`, `REVOKED`
- recovery request `PENDING`, `COMPLETED`, `EXPIRED`, `REVOKED`

### Transitions autorisées

Exemples :

- `ACTIVE -> LOCKED`
- `LOCKED -> ACTIVE`
- `ACTIVE -> DISABLED`
- session `ACTIVE -> REVOKED`
- recovery `PENDING -> COMPLETED`
- recovery `PENDING -> EXPIRED`

### Transitions interdites

Exemples :

- une session révoquée redevient active sans nouvelle authentification ;
- un recovery consommé est réutilisé ;
- une identité désactivée ouvre une nouvelle session.

### Règles de conservation / archivage / suppression

- les transitions de sécurité restent traçables ;
- les sessions expirées ou révoquées restent compréhensibles selon la politique retenue ;
- les recovery requests sensibles ne sont pas supprimées implicitement sans gouvernance ;
- les secrets sont traités différemment des métadonnées auditables.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’une identité et de son credential initial ;
- changement de mot de passe ;
- création d’une session ;
- révocation d’une session ;
- révocation de toutes les sessions d’une identité ;
- création et consommation d’une demande de recovery ;
- activation ou désactivation MFA ;
- écriture des events `auth.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- email de recovery ;
- notification de sécurité ;
- webhook sortant ;
- analytics sécurité ;
- intégration externe de sécurité.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les mutations sensibles ;
- unicité logique de l’identité par utilisateur ;
- garde sur l’état de l’identité avant login ou mutation ;
- invalidation cohérente des sessions si nécessaire ;
- non-réutilisation des recoveries consommés ou révoqués.

Les conflits attendus sont :

- double login concurrent ;
- double changement de mot de passe ;
- consommation concurrente du même recovery ;
- activation MFA concurrente ;
- révocation et login concurrents.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `revoke-session` : clé d’intention = `sessionId`
- `revoke-all-sessions` : clé d’intention = `(identityId, revokeIntentId)`
- `complete-recovery` : clé d’intention = `(recoveryRequestId, completionIntentId)`
- `lock-identity` : clé d’intention = `(identityId, lockIntentId)`

Un retry ne doit jamais produire deux états de sécurité divergents.

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

- email de recovery ;
- notification de sécurité ;
- webhook sortant ;
- intégration externe ;
- analytics sécurité.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` minimum ;
- `M2` recommandé pour une exploitation normale ;
- `M3` dès qu’il y a MFA, gouvernance plus stricte ou contexte sensible ;
- `M4` en cas d’exigences très fortes de sécurité ou de conformité.

### Pourquoi

Le domaine `auth` appartient au socle critique.
Même dans un projet simple, il doit rester propre et sérieux.

### Points d’exploitation à surveiller

- échecs de login ;
- identités verrouillées ;
- sessions révoquées ;
- demandes de recovery ;
- activations MFA ;
- comportements anormaux de sécurité.

---

## Impact coût / complexité

Le coût du domaine `auth` monte principalement avec :

- `passwordRecovery`
- `mfa`
- `sessionManagement`
- `loginThrottling`
- `securityNotifications`
- exigences de sécurité et d’audit plus fortes.

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Créer une identité d’authentification
2. Ouvrir une session
3. Révoquer une session
4. Réinitialiser ou changer un mot de passe
5. Gérer un recovery
6. Activer ou désactiver MFA

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- identité introuvable ;
- identité verrouillée ou désactivée ;
- mot de passe invalide ;
- session introuvable ou déjà révoquée ;
- token de recovery expiré ;
- token déjà consommé ;
- tentative MFA invalide ;
- conflit concurrent sur une opération sensible.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `auth` est un domaine coeur à capabilities toggleables ;
- l’auth humaine du socle reste interne et souveraine ;
- les providers externes éventuels restent des connecteurs ;
- les secrets sont protégés et séparés ;
- les mutations sensibles sont transactionnelles, auditables et idempotentes ;
- les notifications de sécurité partent après commit ;
- le domaine ne se confond ni avec `users`, ni avec `roles`, ni avec `api-clients`.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `auth` appartient au noyau sérieux du socle ;
- l’auth n’est jamais une option ;
- les niveaux de sophistication de sécurité sont toggleables ;
- un provider externe éventuel ne remplace pas la vérité interne ;
- la sécurité d’accès ne doit jamais être sous-documentée ni traitée comme secondaire ;
- les opérations sensibles d’auth sont atomiques, tracées et reprises proprement.
