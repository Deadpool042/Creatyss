# Domaine users

## Rôle

Le domaine `users` porte les comptes d’accès au socle.

Il représente l’identité technique et applicative d’un acteur capable de se connecter à l’application, qu’il s’agisse d’un acteur plateforme, d’un acteur boutique ou d’un client ayant un compte.

## Responsabilités

Le domaine `users` prend en charge :

- l’identité technique d’un compte utilisateur
- les mécanismes de rattachement d’un compte à un acteur applicatif
- les informations minimales nécessaires à l’authentification et à la connexion
- l’état d’activation ou de désactivation d’un compte
- le lien entre un compte et ses rôles applicatifs
- la base de lecture utilisée par le contrôle d’accès
- la distinction entre identité technique et profil métier

## Ce que le domaine ne doit pas faire

Le domaine `users` ne doit pas :

- porter le profil client métier complet, qui relève de `customers`
- porter la totalité des rôles et permissions, qui relèvent de `roles` et `permissions`
- porter la logique métier commerce des commandes, du panier ou du pricing
- devenir un domaine CRM
- devenir un fourre-tout regroupant toutes les données humaines d’un acteur

Le domaine `users` porte le compte d’accès, pas l’ensemble de la lecture métier de la personne.

## Sous-domaines

- `accounts` : compte technique et identité de connexion

## Entrées

Le domaine reçoit principalement :

- des créations de comptes
- des activations ou désactivations de comptes
- des rattachements à des rôles
- des lectures de compte pour le contrôle d’accès
- des opérations liées à l’existence technique d’un utilisateur dans l’application

## Sorties

Le domaine expose principalement :

- un compte utilisateur technique
- un identifiant utilisateur stable
- un état de compte
- les rattachements utiles au contrôle d’accès
- les informations minimales permettant à d’autres domaines de savoir qui agit

## Dépendances vers autres domaines

Le domaine `users` peut dépendre de :

- `roles` pour les profils globaux applicatifs
- `permissions` pour la lecture finale des droits
- `audit` pour tracer les changements sensibles
- `observability` pour diagnostiquer certains problèmes d’accès

Les domaines suivants peuvent dépendre de `users` :

- `roles`
- `permissions`
- `customers`
- `audit`
- `monitoring`
- `api-clients` si certains liens techniques doivent être établis

## Capabilities activables liées

Le domaine `users` n’est pas piloté par une capability métier centrale comme `shipping` ou `discounts`, mais il est impacté par certaines capabilities transverses.

Exemples :

- `advancedPermissions`
- `auditTrail`
- `technicalMonitoring`

### Effet si `advancedPermissions` est activée

Le domaine doit s’intégrer à un modèle de droits plus fin et plus structuré.

### Effet si `auditTrail` est activée

Les opérations sensibles liées aux comptes doivent être tracées plus finement.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`

Et, en lecture partielle selon la politique retenue :

- `store_owner`
- `store_manager`

### Permissions

Exemples de permissions concernées :

- `roles.read`
- `roles.write`
- `permissions.read`
- `permissions.write`
- `audit.read`

Selon le découpage retenu plus tard, des permissions dédiées à l’administration des comptes pourront être ajoutées.

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `user.created`
- `user.updated`
- `user.disabled`
- `user.reactivated`
- `user.roles.changed`

## Événements consommés

Le domaine `users` peut consommer certains événements d’administration ou de gouvernance, mais il doit rester faiblement couplé aux autres domaines métier.

Exemples possibles :

- validations d’approbation liées à l’accès
- événements de gouvernance sécurité si le modèle final l’exige

## Intégrations externes

Le domaine `users` ne doit pas porter directement les intégrations externes métier.

S’il existe des briques externes d’identité ou de provisioning plus tard, elles devront passer par :

- `integrations`
- et éventuellement `jobs`

Le domaine `users` reste la source de vérité interne du compte applicatif dans le socle.

## Données sensibles / sécurité

Le domaine `users` manipule des données sensibles de sécurité et d’accès.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- protection renforcée des opérations sensibles
- audit des changements critiques
- séparation stricte entre compte d’accès et profil métier
- limitation de l’exposition de certaines données selon le rôle

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel compte a été utilisé pour une action donnée
- quel état de compte était en vigueur
- quels rôles étaient associés à ce compte au moment d’une opération
- pourquoi un accès a été accepté ou refusé si le système d’explication le permet

### Audit

Il faut tracer :

- la création d’un compte
- l’activation ou désactivation d’un compte
- les changements de rattachement de rôles
- les modifications sensibles touchant à l’accès

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `UserAccount` : compte technique applicatif
- `UserStatus` : état du compte
- `UserRoleAssignment` : rattachement d’un compte à un ou plusieurs rôles

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un compte utilisateur possède un identifiant stable
- un compte utilisateur est distinct d’un client métier
- les changements d’état de compte sont explicites
- les rôles ne sont pas déduits implicitement d’un autre domaine
- `users` ne devient pas la source de vérité du client métier, qui relève de `customers`

## Cas d’usage principaux

1. Créer un compte utilisateur technique
2. Lire un compte utilisateur
3. Activer ou désactiver un compte
4. Rattacher un compte à des rôles applicatifs
5. Exposer l’identité technique de l’acteur courant pour audit et contrôle d’accès
6. Permettre à d’autres domaines de distinguer qui agit sans leur faire porter la logique d’identité

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- utilisateur introuvable
- compte déjà désactivé
- rattachement de rôle invalide
- tentative de modification non autorisée
- incohérence entre compte et rattachement attendu à un acteur métier

## Décisions d’architecture

Les choix structurants du domaine sont :

- `users` porte le compte applicatif, distinct du client métier
- `users` ne porte ni le CRM, ni le pricing, ni la logique commerce
- `users` collabore avec `roles` et `permissions`, sans les absorber
- les changements sensibles liés aux comptes doivent être auditables
- les intégrations d’identité externes éventuelles passent par `integrations`

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- le compte technique est distinct du client métier
- `users` ne remplace ni `customers`, ni `roles`, ni `permissions`
- les changements d’accès sensibles doivent être traçables
- le domaine `users` reste centré sur l’identité applicative et non sur toute la lecture métier de la personne
