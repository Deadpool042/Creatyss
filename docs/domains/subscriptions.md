# Domaine subscriptions

## Rôle

Le domaine `subscriptions` porte les abonnements fonctionnels du socle.

Il structure l’inscription d’un acteur à des sujets, catégories ou préférences d’abonnement internes, sans absorber la newsletter marketing, les notifications transactionnelles, les rôles d’accès ou les campagnes marketing.

## Responsabilités

Le domaine `subscriptions` prend en charge :

- les sujets d’abonnement
- les préférences d’abonnement par acteur
- l’état d’inscription ou de désinscription à un sujet
- la lecture structurée des abonnements actifs
- la base d’abonnement exploitable par `newsletter`, `notifications`, `events` et d’autres domaines consommateurs selon le sujet concerné

## Ce que le domaine ne doit pas faire

Le domaine `subscriptions` ne doit pas :

- porter la newsletter elle-même, qui relève de `newsletter`
- porter les notifications transactionnelles, qui relèvent de `notifications`
- porter les campagnes marketing, qui relèvent de `marketing`
- porter le compte technique, qui relève de `users`
- porter la relation client enrichie, qui relève de `crm`
- devenir un fourre-tout regroupant tout consentement ou toute préférence utilisateur, ce qui peut aussi concerner `consent` selon la nature de la préférence

Le domaine `subscriptions` porte les abonnements fonctionnels à des sujets internes. Il ne remplace ni `newsletter`, ni `notifications`, ni `consent`.

## Sous-domaines

- `topics` : sujets d’abonnement disponibles
- `preferences` : état d’abonnement d’un acteur par sujet

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour de sujets d’abonnement
- des demandes d’abonnement ou désabonnement
- des lectures d’abonnements actifs par acteur
- un contexte boutique, utilisateur ou client
- des demandes de vérification de préférence d’abonnement pour un sujet donné

## Sorties

Le domaine expose principalement :

- des sujets d’abonnement
- des abonnements actifs ou inactifs
- des préférences d’abonnement structurées
- une lecture exploitable par `newsletter`, `notifications`, `events`, `analytics`, `dashboarding` et l’admin

## Dépendances vers autres domaines

Le domaine `subscriptions` peut dépendre de :

- `users` pour certains abonnements liés à un compte applicatif
- `customers` pour certains abonnements liés à un client métier
- `store` pour le contexte boutique et les capabilities actives
- `audit` pour tracer les changements sensibles
- `observability` pour expliquer pourquoi un abonnement est actif, inactif ou ignoré

Les domaines suivants peuvent dépendre de `subscriptions` :

- `newsletter`
- `notifications`
- `events`
- `analytics`
- `dashboarding`

## Capabilities activables liées

Le domaine `subscriptions` est directement ou indirectement lié à :

- `newsletter`
- `notifications`
- `publicEvents`

### Effet si `newsletter` est activée

Le domaine peut porter des sujets d’abonnement liés à des communications newsletter, sans absorber le domaine `newsletter` lui-même.

### Effet si `notifications` est activée

Le domaine peut porter des préférences liées à certains sujets de notification, sans absorber la logique de notification transactionnelle.

### Effet si `publicEvents` est activée

Le domaine peut porter des sujets d’abonnement liés aux événements publics ou aux nouveautés de ce domaine.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- `customer_support`
- `customer` pour ses propres abonnements selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `subscriptions.read`
- `subscriptions.write`
- `newsletter.read`
- `notifications.read`
- `customers.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `subscription.topic.created`
- `subscription.created`
- `subscription.updated`
- `subscription.cancelled`
- `subscription.preference.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `customer.created`
- `user.created`
- `store.capabilities.updated`
- `event.published` si certains abonnements peuvent être créés ou exploités en lien avec un sujet événementiel

Il doit toutefois rester maître de sa propre vérité d’abonnement.

## Intégrations externes

Le domaine `subscriptions` ne doit pas parler directement aux systèmes externes.

Les interactions avec :

- plateformes emailing
- providers de messaging
- outils externes d’abonnement

relèvent de :

- `newsletter`
- `notifications`
- `integrations`
- éventuellement `jobs`

Le domaine `subscriptions` reste la source de vérité interne des abonnements fonctionnels du socle.

## Données sensibles / sécurité

Le domaine `subscriptions` manipule des préférences de communication et d’abonnement potentiellement sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- distinction claire entre abonnement fonctionnel, communication marketing et consentement réglementaire
- protection des changements d’état sensibles
- audit des interventions manuelles importantes

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un acteur est abonné ou non à un sujet
- quel sujet d’abonnement est concerné
- si une préférence est ignorée à cause d’une capability off, d’un état inactif ou d’une règle métier
- quel événement a déclenché un changement d’abonnement si cela est modélisé dans le socle

### Audit

Il faut tracer :

- la création d’un sujet d’abonnement
- les abonnements et désabonnements significatifs
- les changements manuels sensibles de préférences
- les interventions administratives importantes

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `SubscriptionTopic` : sujet d’abonnement
- `SubscriptionPreference` : préférence d’abonnement d’un acteur pour un sujet
- `SubscriptionStatus` : état de l’abonnement
- `SubscriptionActor` : acteur logique concerné par l’abonnement

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un abonnement est rattaché à un sujet explicite
- un abonnement est rattaché à un acteur explicite
- `subscriptions` ne se confond pas avec `newsletter`, `notifications` ou `consent`
- les autres domaines ne doivent pas recréer leur propre vérité divergente des abonnements structurés
- l’exécution d’une communication aval reste distincte de la vérité interne d’abonnement

## Cas d’usage principaux

1. Définir un sujet d’abonnement
2. Abonner un acteur à un sujet
3. Désabonner un acteur d’un sujet
4. Lire les abonnements actifs d’un acteur
5. Permettre à `newsletter` ou `notifications` de vérifier une préférence d’abonnement
6. Exposer à l’admin une lecture claire des sujets et abonnements actifs

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- sujet d’abonnement introuvable
- acteur introuvable
- abonnement déjà actif
- abonnement déjà inactif
- capability liée désactivée
- tentative de modification non autorisée
- conflit entre préférence d’abonnement et autre règle applicative plus forte

## Décisions d’architecture

Les choix structurants du domaine sont :

- `subscriptions` porte les abonnements fonctionnels du socle
- `subscriptions` est distinct de `newsletter`
- `subscriptions` est distinct de `notifications`
- `subscriptions` est distinct de `consent`
- les domaines consommateurs lisent la vérité d’abonnement via `subscriptions`, sans la recréer localement
- les changements sensibles d’abonnement doivent être auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les abonnements fonctionnels relèvent de `subscriptions`
- la newsletter relève de `newsletter`
- les notifications transactionnelles relèvent de `notifications`
- les consentements réglementaires relèvent de `consent`
- `subscriptions` ne remplace ni `newsletter`, ni `notifications`, ni `consent`, ni `integrations`
