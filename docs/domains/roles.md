# Domaine roles

## Rôle

Le domaine `roles` porte les rôles applicatifs du socle.

Il définit les profils globaux utilisés pour structurer les accès, les responsabilités et la lecture fonctionnelle des différents acteurs de la plateforme et des boutiques.

## Responsabilités

Le domaine `roles` prend en charge :

- la définition des rôles applicatifs
- la distinction entre rôles plateforme et rôles boutique
- la lisibilité fonctionnelle des profils d’accès
- le rattachement logique des rôles aux comptes utilisateurs
- la structuration des profils d’administration et d’exploitation
- le langage de haut niveau utilisé par l’administration pour comprendre qui peut faire quoi

## Ce que le domaine ne doit pas faire

Le domaine `roles` ne doit pas :

- porter la liste fine des permissions, qui relève de `permissions`
- porter le compte technique lui-même, qui relève de `users`
- porter les capacités métier d’une boutique, qui relèvent de `store`
- porter la logique métier commerce des domaines coeur
- devenir un système de permissions implicites non maîtrisé

Le domaine `roles` décrit des profils d’accès, mais ne remplace pas le moteur de permissions fines.

## Sous-domaines

Le domaine `roles` n’a pas nécessairement besoin d’un découpage complexe au départ.

Il peut rester simple avec :

- un sous-ensemble conceptuel de rôles plateforme
- un sous-ensemble conceptuel de rôles boutique

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour de définitions de rôles
- des rattachements logiques entre rôles et utilisateurs
- des demandes de lecture de rôles applicatifs
- des besoins d’explicitation du profil d’accès d’un utilisateur

## Sorties

Le domaine expose principalement :

- les rôles disponibles
- leur catégorie (`platform` ou `store`)
- leur signification fonctionnelle
- leur rattachement à des utilisateurs ou à des scopes

## Dépendances vers autres domaines

Le domaine `roles` peut dépendre de :

- `users` pour rattacher des rôles à des comptes
- `audit` pour tracer les changements sensibles
- `permissions` pour la lecture combinée finale du contrôle d’accès

Les domaines suivants peuvent dépendre de `roles` :

- `permissions`
- `users`
- `store`
- les couches d’administration plateforme et boutique

## Capabilities activables liées

Le domaine `roles` n’est pas une capability métier en soi, mais il est fortement concerné par :

- `advancedPermissions`
- `auditTrail`

### Effet si `advancedPermissions` est activée

Le domaine `roles` doit rester lisible tout en s’intégrant à un système de permissions fines plus avancé.

### Effet si `auditTrail` est activée

Les changements de rôles et rattachements doivent être tracés plus finement.

## Rôles/permissions concernés

### Rôles de référence

Les rôles de référence retenus à ce stade sont :

#### Rôles plateforme

- `platform_owner`
- `platform_engineer`

#### Rôles boutique

- `store_owner`
- `store_manager`
- `catalog_manager`
- `content_editor`
- `order_manager`
- `customer_support`
- `marketing_manager`
- `observer`

#### Rôle client

- `customer`

### Permissions concernées

Exemples de permissions liées à l’administration des rôles :

- `roles.read`
- `roles.write`
- `permissions.read`
- `permissions.write`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `role.created`
- `role.updated`
- `user.roles.changed`

## Événements consommés

Le domaine peut consommer certains événements de gouvernance liés aux comptes ou à l’approbation d’actions sensibles.

Exemples possibles :

- `user.created`
- événements d’approbation si le modèle final impose un contrôle supplémentaire sur certains changements d’accès

## Intégrations externes

Le domaine `roles` ne doit pas dépendre directement d’un provider externe.

Toute synchronisation éventuelle d’un référentiel d’accès externe devra passer par :

- `integrations`
- et éventuellement `jobs`

Le domaine `roles` reste la source de vérité interne des profils applicatifs.

## Données sensibles / sécurité

Le domaine `roles` manipule des éléments sensibles de gouvernance d’accès.

Points de vigilance :

- modification réservée à des rôles très restreints
- traçabilité obligatoire des changements critiques
- séparation nette entre rôle de haut niveau et permission fine
- prévention des dérives de type “admin implicite”

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quels rôles étaient attachés à un utilisateur donné
- quel profil d’accès de haut niveau était en vigueur lors d’une action
- comment un acteur était catégorisé dans l’application

### Audit

Il faut tracer :

- la création d’un rôle
- la modification d’un rôle
- le rattachement ou détachement d’un rôle à un utilisateur
- les changements sensibles touchant à la gouvernance d’accès

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `RoleDefinition` : définition d’un rôle applicatif
- `RoleCategory` : catégorie du rôle (`platform`, `store`, `customer`)
- `UserRoleAssignment` : rattachement d’un rôle à un utilisateur

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un rôle possède un identifiant stable et un sens explicite
- un rôle n’est pas une permission fine
- les rôles plateforme et boutique restent distingués
- un rôle ne doit pas embarquer de logique métier cachée implicite
- le contrôle d’accès final ne repose pas uniquement sur le rôle brut, mais sur le couple rôles + permissions + scope

## Cas d’usage principaux

1. Définir les rôles applicatifs du socle
2. Lire les rôles disponibles
3. Rattacher un rôle à un utilisateur
4. Distinguer les rôles plateforme des rôles boutique
5. Exposer une lecture claire du profil d’accès d’un acteur

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- rôle introuvable
- rôle invalide
- tentative de rattacher un rôle non autorisé
- conflit de gouvernance sur un rôle sensible
- tentative de suppression ou modification d’un rôle structurant sans autorisation suffisante

## Décisions d’architecture

Les choix structurants du domaine sont :

- `roles` porte les profils d’accès de haut niveau
- `roles` est distinct de `permissions`
- `roles` est distinct de `users`
- les rôles plateforme et boutique sont séparés
- le modèle `admin/customer` unique est abandonné
- les changements sensibles sur les rôles doivent être auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les rôles sont distincts des permissions
- les rôles plateforme et boutique sont distincts
- `roles` ne remplace ni `permissions`, ni `users`
- le socle ne repose pas sur un rôle unique `admin`
- la gouvernance des rôles est une responsabilité sensible et contrôlée
