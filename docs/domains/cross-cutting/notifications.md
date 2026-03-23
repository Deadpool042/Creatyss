# Domaine notifications

## Rôle

Le domaine `notifications` porte les notifications transactionnelles et opérationnelles du socle.

Il structure les messages adressés aux utilisateurs ou aux administrateurs dans le cadre du fonctionnement de la boutique, en distinguant les notifications in-app, email ou temps réel, sans absorber la newsletter, les campagnes marketing, le social publishing ou le simple tracking d’événements.

## Responsabilités

Le domaine `notifications` prend en charge :

- les notifications in-app
- les notifications email transactionnelles
- les préférences de notification
- la lecture des notifications émises, lues ou en attente
- les notifications temps réel ou quasi temps réel si la capability correspondante est active
- la structuration des messages opérationnels issus des domaines métier
- la base de notification exploitable par l’admin, le storefront, le support et certains domaines consommateurs

## Ce que le domaine ne doit pas faire

Le domaine `notifications` ne doit pas :

- porter la newsletter, qui relève de `newsletter`
- porter les campagnes marketing, qui relèvent de `marketing`
- porter la publication sociale, qui relève de `social`
- porter le template system global, qui relève de `template-system`
- porter le tracking ou l’analytics, qui relèvent de `tracking`, `behavior`, `analytics` et `attribution`
- porter directement les providers externes d’email ou de push, ce qui relève de `integrations`
- devenir un fourre-tout regroupant toute forme de communication sortante

Le domaine `notifications` porte les messages transactionnels et opérationnels du socle. Il ne remplace ni `newsletter`, ni `marketing`, ni `social`, ni `integrations`.

## Sous-domaines

- `in-app` : notifications visibles dans l’application
- `email` : notifications email transactionnelles
- `preferences` : préférences de notification par utilisateur ou par sujet

## Entrées

Le domaine reçoit principalement :

- des domain events internes issus des domaines métier
- des demandes explicites de création de notification
- des préférences de notification par acteur
- des demandes de lecture, marquage lu/non lu ou archivage logique selon le modèle retenu
- un contexte boutique, utilisateur ou client

## Sorties

Le domaine expose principalement :

- des notifications structurées
- des statuts de notification
- des préférences de notification
- une lecture exploitable par le storefront, l’admin, le support, `dashboarding` et certains domaines consommateurs
- des messages préparés pour exécution aval par `integrations` ou d’autres briques dédiées

## Dépendances vers autres domaines

Le domaine `notifications` peut dépendre de :

- `users` pour les comptes applicatifs destinataires
- `customers` pour certains destinataires métier
- `subscriptions` pour certains sujets ou préférences d’abonnement
- `stores` pour le contexte boutique et les capabilities actives
- `template-system` pour certains gabarits réutilisables si le modèle final l’exige
- `audit` pour tracer les opérations sensibles
- `observability` pour expliquer pourquoi une notification a été générée, envoyée, ignorée ou non exposée

Les domaines suivants peuvent dépendre de `notifications` :

- `orders`
- `payments`
- `returns`
- `events`
- `marketing`
- `conversion`
- `dashboarding`
- `analytics`

## Capabilities activables liées

Le domaine `notifications` est directement lié à :

- `notifications`
- `realtimeNotifications`
- `newsletter`

### Effet si `notifications` est activée

Le domaine devient pleinement exploitable pour les notifications transactionnelles et opérationnelles.

### Effet si `notifications` est désactivée

Le domaine reste structurellement présent, mais aucune notification transactionnelle ne doit être exposée ou envoyée côté boutique, hors besoin technique interne explicitement cadré.

### Effet si `realtimeNotifications` est activée

Le domaine peut exposer des notifications en temps réel ou quasi temps réel selon les mécanismes retenus.

### Effet si `newsletter` est activée

Certaines préférences ou sujets peuvent coexister avec la newsletter, sans que `notifications` absorbe la responsabilité newsletter.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `customer_support`
- `customer` pour ses propres notifications selon le scope retenu
- certains rôles métier boutique en lecture partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `notifications.read`
- `notifications.write`
- `customers.read`
- `orders.read`
- `newsletter.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `notification.created`
- `notification.sent`
- `notification.read`
- `notification.failed`
- `notification.preference.updated`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `order.created`
- `order.status.changed`
- `payment.captured`
- `payment.failed`
- `return.requested`
- `event.published`
- `conversion.recovery.triggered`
- `store.capabilities.updated`

Il doit toutefois rester maître de sa propre vérité de notification.

## Intégrations externes

Le domaine `notifications` ne doit pas parler directement aux providers externes.

Les interactions avec :

- providers email
- providers push
- providers de messaging temps réel

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `notifications` reste la source de vérité interne des notifications structurées du socle.

## Données sensibles / sécurité

Le domaine `notifications` manipule des données de communication potentiellement sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- respect des préférences de notification
- séparation claire entre communication transactionnelle et communication marketing
- protection des contenus internes ou réservés à certains rôles
- audit des opérations sensibles ou manuelles importantes

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une notification a été créée ou non
- quel événement métier l’a déclenchée
- pourquoi elle a été envoyée, ignorée, retardée ou échouée
- si une absence d’envoi vient d’une capability off, d’une préférence utilisateur, d’un problème d’intégration ou d’une règle métier

### Audit

Il faut tracer :

- certaines créations manuelles de notification
- les changements de préférences sensibles
- certaines notifications critiques côté boutique ou plateforme
- les interventions manuelles importantes sur les canaux ou contenus opérationnels

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Notification` : notification structurée
- `NotificationChannel` : canal interne de notification (`in_app`, `email`, `realtime`)
- `NotificationStatus` : état de la notification
- `NotificationPreference` : préférence de notification par acteur ou sujet
- `NotificationRecipient` : destinataire logique de la notification

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une notification est rattachée à un destinataire explicite
- une notification possède un canal explicite
- une notification transactionnelle ne se confond pas avec une newsletter ou une campagne marketing
- `notifications` ne se confond pas avec `newsletter`, `marketing` ou `social`
- les autres domaines ne doivent pas recréer leur propre vérité divergente des notifications structurées
- l’envoi provider externe reste distinct de la vérité interne de notification

## Cas d’usage principaux

1. Créer une notification in-app à partir d’un événement métier
2. Créer une notification email transactionnelle
3. Marquer une notification comme lue
4. Gérer les préférences de notification d’un utilisateur ou d’un client
5. Déclencher une notification temps réel si la capability correspondante est active
6. Exposer à l’admin et au support une lecture claire des notifications et de leur état

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- notification introuvable
- destinataire introuvable
- préférence incompatible ou restrictive
- capability notifications désactivée
- canal de notification invalide
- tentative d’exposition d’une notification à un acteur non autorisé
- échec aval d’intégration provider

## Décisions d’architecture

Les choix structurants du domaine sont :

- `notifications` porte les notifications transactionnelles et opérationnelles du socle
- `notifications` est distinct de `newsletter`
- `notifications` est distinct de `marketing`
- `notifications` est distinct de `social`
- `notifications` est distinct de `integrations`
- les providers externes sont appelés via `integrations`, puis les états utiles sont remappés dans le langage interne du domaine
- les notifications critiques et préférences sensibles doivent être auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les notifications transactionnelles relèvent de `notifications`
- la newsletter relève de `newsletter`
- les campagnes relèvent de `marketing`
- la publication sociale relève de `social`
- `notifications` ne remplace ni `newsletter`, ni `marketing`, ni `social`, ni `integrations`
