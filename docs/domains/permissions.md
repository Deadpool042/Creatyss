# Domaine permissions

## Rôle

Le domaine `permissions` porte les droits fins du socle.

Il définit les actions réellement autorisées sur les ressources applicatives, avec un niveau de granularité supérieur aux simples rôles.

Il constitue la base effective du contrôle d’accès, tandis que `roles` fournit une lecture fonctionnelle de haut niveau.

## Responsabilités

Le domaine `permissions` prend en charge :

- la définition des permissions fines
- la structuration des permissions par ressource et action
- l’expression explicite des droits applicatifs
- la lecture fine du contrôle d’accès
- la combinaison entre permissions, rôles et scopes
- la base décisionnelle permettant de savoir si une action est autorisée
- la gouvernance des permissions sensibles

## Ce que le domaine ne doit pas faire

Le domaine `permissions` ne doit pas :

- porter les comptes utilisateurs, qui relèvent de `users`
- porter les rôles de haut niveau, qui relèvent de `roles`
- porter les capabilities boutique, qui relèvent de `store`
- porter la logique métier détaillée des domaines commerce
- devenir un endroit où la logique métier est recodée sous forme de permissions ambiguës

Le domaine `permissions` exprime des droits d’accès, pas la totalité de la logique métier.

## Sous-domaines

Le domaine peut rester simple au départ, avec :

- un référentiel de permissions
- une lecture des assignations ou associations de permissions aux rôles ou aux utilisateurs selon le modèle retenu
- une lecture de scope appliqué aux permissions

## Entrées

Le domaine reçoit principalement :

- des définitions de permissions
- des changements de gouvernance d’accès
- des rattachements logiques de permissions à des rôles
- des demandes d’évaluation d’un droit sur une ressource ou une action
- des demandes de lecture des permissions disponibles

## Sorties

Le domaine expose principalement :

- les permissions définies dans le socle
- leur signification explicite
- leur rattachement logique à des rôles ou à des profils
- leur portée éventuelle via un scope
- le résultat d’une lecture fine des droits applicatifs

## Dépendances vers autres domaines

Le domaine `permissions` peut dépendre de :

- `roles` pour la lecture combinée rôle + permissions
- `users` pour savoir à quel compte les permissions s’appliquent indirectement ou directement
- `audit` pour tracer les changements sensibles
- `observability` pour diagnostiquer certains refus d’accès si le modèle d’explication le permet

Les domaines suivants peuvent dépendre de `permissions` :

- l’ensemble des couches d’administration
- `store`
- les domaines coeur et transverses lorsqu’une action d’écriture ou de lecture sensible doit être autorisée ou refusée

## Capabilities activables liées

Le domaine `permissions` est particulièrement lié à :

- `advancedPermissions`
- `auditTrail`

### Effet si `advancedPermissions` est activée

Le modèle de permissions fines devient pleinement actif et structurant.

### Effet si `advancedPermissions` est désactivée

Le système peut fonctionner de manière plus simple, mais le domaine reste conceptuellement présent et la structure du socle ne change pas.

### Effet si `auditTrail` est activée

Les changements de permissions sensibles doivent être tracés de manière renforcée.

## Rôles/permissions concernés

### Rôles principalement concernés

- `platform_owner`
- `platform_engineer`

Les rôles boutique ne doivent pas administrer librement les permissions profondes du socle.

### Permissions de gouvernance liées

Exemples de permissions concernées :

- `permissions.read`
- `permissions.write`
- `roles.read`
- `roles.write`
- `audit.read`

## Exemples de permissions de référence

Le domaine `permissions` porte notamment des permissions comme :

### Catalogue / contenu

- `catalog.read`
- `catalog.write`
- `catalog.publish`
- `categories.read`
- `categories.write`
- `media.read`
- `media.write`
- `pages.read`
- `pages.write`
- `blog.read`
- `blog.write`
- `blog.publish`

### Commerce

- `cart.read`
- `orders.read`
- `orders.write`
- `payments.read`
- `returns.read`
- `returns.write`
- `documents.read`
- `documents.write`

### Clients / CRM

- `customers.read`
- `customers.write`
- `crm.read`
- `crm.write`
- `subscriptions.read`
- `subscriptions.write`
- `newsletter.read`
- `newsletter.write`

### Marketing / conversion / diffusion

- `marketing.read`
- `marketing.write`
- `conversion.read`
- `conversion.write`
- `discounts.read`
- `discounts.write`
- `pricing.read`
- `events.read`
- `events.write`
- `events.publish`
- `social.read`
- `social.write`
- `channels.read`
- `channels.write`

### Shipping / inventaire / fiscalité

- `inventory.read`
- `inventory.write`
- `shipping.read`
- `shipping.write`
- `taxation.read`
- `taxation.write`

### Pilotage / plateforme

- `analytics.read`
- `tracking.read`
- `tracking.write`
- `attribution.read`
- `audit.read`
- `observability.read`
- `monitoring.read`
- `dashboarding.read`
- `store.settings.read`
- `store.settings.write`
- `capabilities.read`
- `capabilities.write`
- `integrations.read`
- `integrations.write`
- `webhooks.read`
- `webhooks.write`
- `api_clients.read`
- `api_clients.write`

## Scope

Le domaine `permissions` doit être capable d’exprimer qu’une permission ne s’applique pas toujours partout.

Les niveaux minimaux retenus sont :

### Scope plateforme

S’applique à l’ensemble de la plateforme.

### Scope boutique

S’applique à une boutique donnée.

### Scope domaine

S’applique à un domaine précis, éventuellement dans une boutique donnée.

La décision finale d’autorisation doit reposer sur :

- la permission
- le rôle
- le scope
- le contexte d’exécution
- les capabilities actives si elles conditionnent la fonctionnalité

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `permission.created`
- `permission.updated`
- `role.permissions.changed`
- `user.permissions.changed`

## Événements consommés

Le domaine peut consommer certains événements de gouvernance liés :

- à la création d’un rôle
- à la création d’un utilisateur
- à l’approbation d’une modification sensible d’accès

Il doit toutefois rester centré sur son propre langage de contrôle d’accès.

## Intégrations externes

Le domaine `permissions` ne doit pas dépendre directement d’un fournisseur externe.

Si une synchronisation d’accès externe existe un jour, elle devra passer par :

- `integrations`
- et éventuellement `jobs`

Le domaine `permissions` reste la source de vérité interne des droits fins.

## Données sensibles / sécurité

Le domaine `permissions` manipule des données de gouvernance hautement sensibles.

Points de vigilance :

- écriture réservée à des rôles très restreints
- audit obligatoire des changements critiques
- validation forte des modifications
- séparation nette entre rôle, permission et capability
- prévention des escalades implicites de privilèges

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une action a été autorisée ou refusée
- quelles permissions ont été prises en compte
- quel scope a été appliqué
- quel rôle a contribué à la décision finale

### Audit

Il faut tracer :

- la création d’une permission
- la modification d’une permission
- les rattachements de permissions
- les changements sensibles affectant les droits effectifs

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `PermissionDefinition` : définition d’une permission
- `PermissionScope` : portée d’application de la permission
- `RolePermissionAssignment` : rattachement d’une permission à un rôle
- `UserPermissionView` : lecture consolidée des permissions effectives d’un utilisateur

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une permission possède un identifiant stable et explicite
- une permission n’est pas un rôle
- une permission n’est pas une capability
- le contrôle d’accès final ne repose pas sur une seule dimension isolée
- les permissions sensibles ne doivent pas être modifiées sans gouvernance stricte
- une capability désactivée peut neutraliser l’usage d’une permission liée, même si la permission existe

## Cas d’usage principaux

1. Définir des permissions fines du socle
2. Lire le référentiel de permissions
3. Associer des permissions à un rôle
4. Évaluer si une action est autorisée dans un contexte donné
5. Exposer une lecture consolidée des droits effectifs d’un utilisateur
6. Contrôler des accès sensibles côté plateforme et boutique

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- permission introuvable
- permission invalide
- scope incohérent
- tentative de rattachement non autorisée
- conflit de gouvernance sur une permission critique
- action refusée malgré un rôle de haut niveau, faute de permission explicite ou à cause d’une capability désactivée

## Décisions d’architecture

Les choix structurants du domaine sont :

- `permissions` porte les droits fins du socle
- `permissions` est distinct de `roles`
- `permissions` est distinct de `users`
- la décision finale d’accès dépend du couple rôles + permissions + scope + contexte
- les capabilities peuvent neutraliser certaines possibilités fonctionnelles sans supprimer la structure du domaine `permissions`
- les changements sensibles de permissions doivent être auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les permissions sont distinctes des rôles
- les permissions sont distinctes des capabilities
- `permissions` ne remplace ni `roles`, ni `users`, ni `store`
- le contrôle d’accès ne repose pas sur un simple rôle unique de type `admin`
- la gouvernance des permissions est une responsabilité hautement sensible
