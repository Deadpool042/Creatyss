# Domaine auth

## Rôle

Le domaine `auth` porte l’authentification structurée du socle.

Il organise les identités d’authentification, credentials, sessions, vérifications d’accès initiales et états d’authentification nécessaires pour permettre à un acteur autorisé d’ouvrir ou de maintenir une session, sans absorber les utilisateurs métier, les rôles, les permissions fines, les clients API machine-to-machine ou la logique métier des domaines protégés.

## Responsabilités

Le domaine `auth` prend en charge :

- les identités d’authentification
- les credentials d’authentification des acteurs humains
- les sessions d’authentification
- le login et le logout
- la vérification d’état d’authentification
- les mécanismes de rotation ou de réinitialisation de secret d’accès si le modèle retenu le prévoit
- le changement de mot de passe par un acteur déjà authentifié
- le verrouillage, throttling ou durcissement d’accès si le modèle retenu le prévoit
- la gestion du bootstrap du premier accès admin
- la gestion des sessions actives et de leur révocation
- la préparation éventuelle d’un second facteur pour les accès admin sensibles
- la base d’authentification consommable par `users`, `roles`, `permissions`, `audit`, `observability` et les couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `auth` ne doit pas :

- porter les utilisateurs métier complets, qui relèvent de `users`
- porter les rôles fonctionnels, qui relèvent de `roles`
- porter les permissions fines, qui relèvent de `permissions`
- porter les clients techniques machine-to-machine, qui relèvent de `api-clients`
- porter les connecteurs providers externes d’authentification ou d’identité comme vérité métier principale, ce qui relève d’une couche technique ou de `integrations` si nécessaire
- porter la logique métier des domaines protégés
- devenir un fourre-tout sécurité absorbant toute la gouvernance d’accès du socle
- devenir le domaine de vérité de l’autorisation métier fine

Le domaine `auth` porte l’authentification humaine structurée du socle. Il ne remplace ni `users`, ni `roles`, ni `permissions`, ni `api-clients`.

## Sous-domaines

- `identities` : identités d’authentification structurées
- `credentials` : secrets, mots de passe ou éléments d’authentification associés
- `sessions` : sessions d’authentification actives, expirées ou révoquées
- `recovery` : réinitialisation ou récupération d’accès si le modèle retenu le prévoit
- `mfa` : second facteur, méthodes associées et recovery codes si le modèle retenu le prévoit
- `bootstrap` : initialisation sécurisée du premier accès admin
- `security-policies` : règles de verrouillage, throttling, expiration ou durcissement d’accès

## Entrées

Le domaine reçoit principalement :

- des demandes de login ou logout
- des vérifications de session ou d’état d’authentification
- des demandes de création ou mise à jour d’identité d’authentification liées à un utilisateur interne
- des demandes de changement ou réinitialisation de credential
- des demandes de création, listing ou révocation de sessions
- des contextes de boutique, acteur, session, appareil, IP ou surface protégée lorsque le modèle retenu le prévoit
- des signaux internes utiles au verrouillage, au throttling, à la révocation ou à l’expiration d’une session
- des demandes d’initialisation du premier accès admin dans un contexte de bootstrap contrôlé
- des demandes d’activation, désactivation ou vérification d’un second facteur si le modèle retenu le prévoit

## Sorties

Le domaine expose principalement :

- des identités d’authentification structurées
- des sessions d’authentification
- des états de login, logout, session valide, session révoquée ou session expirée
- des états d’identité comme actif, verrouillé, suspendu, reset requis ou accès non finalisé
- des lectures exploitables par `users`, `roles`, `permissions`, `audit`, `observability` et les couches d’administration
- des structures d’authentification prêtes à être consommées par les couches serveur protégées

## Dépendances vers autres domaines

Le domaine `auth` peut dépendre de :

- `users` pour rattacher l’identité d’authentification à un compte humain interne
- `roles` pour enrichir certaines lectures de session ou d’accès initial, sans absorber sa responsabilité
- `permissions` pour certaines vérifications initiales ou explications d’accès, sans absorber sa responsabilité
- `approval` pour certains cas exceptionnels de réinitialisation, révocation ou restauration d’accès très sensibles si le modèle retenu le prévoit
- `audit` pour tracer les connexions, réinitialisations, révocations et événements sensibles d’authentification
- `observability` pour expliquer pourquoi un accès a été accepté, refusé, verrouillé ou révoqué
- `store` pour certains contextes boutique si une auth multi-boutique ou multi-scope est retenue

Les domaines suivants peuvent dépendre de `auth` :

- `users`
- `roles`
- `permissions`
- `audit`
- `observability`
- toutes les couches d’administration protégées

## Capabilities activables liées

Le domaine `auth` n’est pas une capability métier optionnelle au sens strict du noyau.

Il fait partie du socle structurel de sécurité de l’application.

En revanche, certaines formes d’authentification ou de durcissement peuvent dépendre de choix techniques ou de politiques activées, par exemple :

- `advancedPermissions`
- `auditTrail`
- certaines politiques de monitoring ou d’observabilité technique

### Règle

Le domaine `auth` reste présent même si la V1 garde une authentification simple.

Dans le cadre actuel du projet, l’authentification peut rester centrée sur l’admin interne, sans auth client avancée obligatoire.

### Fermetures explicites V1

Les points suivants sont retenus pour la V1 :

- authentification admin uniquement
- pas d’auth client avancée
- pas d’OAuth social
- pas de passwordless
- pas de machine-to-machine dans `auth`
- séparation stricte avec `api-clients`

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- certains rôles administratifs protégés selon la politique retenue

Les rôles publics ou clients n’ont pas vocation à administrer librement le domaine `auth`.

### Permissions

Exemples de permissions concernées :

- `auth.read`
- `auth.write`
- `users.read`
- `roles.read`
- `permissions.read`
- `audit.read`

Selon le niveau de détail retenu plus tard, des permissions plus fines sur les sessions, réinitialisations, révocations ou MFA pourront être ajoutées.

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `auth.identity.created`
- `auth.identity.updated`
- `auth.identity.locked`
- `auth.identity.unlocked`
- `auth.login.succeeded`
- `auth.login.failed`
- `auth.logout.completed`
- `auth.session.created`
- `auth.session.revoked`
- `auth.session.revoked_all`
- `auth.credential.updated`
- `auth.password.changed`
- `auth.recovery.requested`
- `auth.recovery.completed`
- `auth.bootstrap.completed`
- `auth.mfa.enabled`
- `auth.mfa.disabled`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `user.created`
- `user.disabled`
- `user.deleted`
- `role.updated` si certaines projections d’accès initial sont recalculées
- `permission.updated` si certaines projections d’accès initial sont recalculées
- `approval.approved` si certains flux sensibles d’accès passent par une approbation exceptionnelle
- certaines actions administratives structurées de création d’accès, révocation ou réinitialisation

Il doit toutefois rester maître de sa propre logique d’authentification.

## Intégrations externes

Le domaine `auth` ne doit pas devenir un domaine d’intégration provider-specific.

Une brique technique comme Auth.js / `next-auth` peut être utilisée comme infrastructure d’authentification avec Next.js, mais :

- la vérité métier de l’authentification interne reste dans `auth`
- les comptes humains restent dans `users`
- les rôles restent dans `roles`
- les permissions restent dans `permissions`
- les connecteurs providers externes éventuels restent hors du coeur métier, ou dans `integrations` s’ils deviennent un sujet explicite

## Données sensibles / sécurité

Le domaine `auth` manipule des secrets et états hautement sensibles.

Points de vigilance :

- jamais de secret exposé côté client
- contrôle strict des droits de lecture et d’écriture
- séparation claire entre identité, credential, session et autorisation
- hashage robuste des mots de passe
- cookies HttpOnly et sécurisés pour les sessions web
- limitation des tentatives, verrouillage ou throttling selon la politique retenue
- révocation des sessions après certaines opérations sensibles comme reset ou changement forcé de credential selon la politique retenue
- audit des réinitialisations, révocations et changements sensibles
- protection explicite des recovery codes ou secrets MFA si ces mécanismes sont activés

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelle identité a tenté de se connecter
- pourquoi un login a réussi ou échoué
- quelle session est active, expirée ou révoquée
- quelles métadonnées minimales de session sont disponibles, comme appareil, IP, dernier usage et date de création si le modèle retenu le prévoit
- si un accès est refusé à cause d’un credential invalide, d’un verrouillage, d’une révocation ou d’une politique applicable
- si une session est partielle ou invalide à cause d’un contexte, d’une expiration ou d’une règle de sécurité
- pourquoi un second facteur est exigé, refusé ou non configuré si ce mécanisme est activé

### Audit

Il faut tracer :

- les connexions réussies et échouées sensibles selon la politique retenue
- les créations ou révocations de sessions
- les changements de credential
- les demandes et finalisations de réinitialisation d’accès
- les verrouillages ou déverrouillages sensibles
- les changements MFA si le modèle final les active
- certaines consultations sensibles si le modèle final les retient explicitement

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `AuthIdentity` : identité d’authentification structurée
- `AuthCredential` : credential ou secret associé à l’identité
- `AuthSession` : session d’authentification active, expirée ou révoquée
- `AuthRecoveryRequest` : demande de réinitialisation ou récupération d’accès
- `AuthMfaEnrollment` : configuration de second facteur si le modèle retenu le prévoit
- `AuthSecurityPolicy` : règle de verrouillage, expiration ou durcissement
- `AuthSubjectRef` : référence vers l’utilisateur humain concerné

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une identité d’authentification possède un identifiant stable et un état explicite
- un credential est rattaché à une identité explicite
- une session est rattachée à une identité explicite
- une session valide n’implique jamais à elle seule une autorisation métier
- `auth` ne se confond pas avec `users`
- `auth` ne se confond pas avec `roles`
- `auth` ne se confond pas avec `permissions`
- `auth` ne se confond pas avec `api-clients`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente d’authentification quand le cadre commun `auth` existe
- une session invalide, expirée ou révoquée ne doit pas être traitée comme authentifiée hors règle explicite
- le bootstrap du premier accès admin ne doit être possible qu’une seule fois dans le cadre retenu

## Cas d’usage principaux

1. Authentifier un administrateur de la boutique
2. Créer une session sécurisée après login réussi
3. Vérifier l’état d’une session pour accéder à une route protégée
4. Révoquer une session unique ou toutes les sessions d’un acteur
5. Réinitialiser un accès admin en cas de perte de credential
6. Gérer le bootstrap sécurisé du premier accès admin
7. Préparer ou gérer un second facteur pour les accès sensibles si le modèle retenu l’active
8. Fournir aux couches protégées une lecture fiable de l’état d’authentification

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- identité d’authentification introuvable
- credential invalide
- session expirée ou révoquée
- verrouillage actif
- tentative de réinitialisation non autorisée
- bootstrap déjà réalisé
- second facteur requis mais non validé si ce mécanisme est activé
- permission ou scope insuffisant pour une action sensible sur le domaine auth
- conflit entre plusieurs règles de sécurité ou d’expiration

## Décisions d’architecture

Les choix structurants du domaine sont :

- `auth` porte l’authentification humaine structurée du socle
- `auth` est distinct de `users`
- `auth` est distinct de `roles`
- `auth` est distinct de `permissions`
- `auth` est distinct de `api-clients`
- une brique technique comme Auth.js / `next-auth` peut être utilisée comme implémentation, sans devenir la vérité métier du domaine
- la V1 reste admin-first et n’introduit pas d’auth client avancée
- l’impersonation n’est pas retenue par défaut dans le domaine `auth` tant qu’elle n’est pas explicitement gouvernée et auditée dans une décision dédiée
- les identités, sessions, réinitialisations, MFA éventuel et politiques sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- l’authentification humaine structurée relève de `auth`
- les comptes humains relèvent de `users`
- les rôles relèvent de `roles`
- les permissions fines relèvent de `permissions`
- les clients machine-to-machine relèvent de `api-clients`
- la V1 reste centrée sur l’admin interne
- Auth.js / `next-auth` peut être utilisé comme implémentation technique sans devenir la vérité métier
- `auth` ne remplace ni `users`, ni `roles`, ni `permissions`, ni `api-clients`, ni `integrations`
