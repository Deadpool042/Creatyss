# Domaine events

## Rôle

Le domaine `events` porte les événements publics du socle.

Il structure les événements visibles ou exploitables par la boutique et ses utilisateurs, comme les marchés, ateliers, salons, lancements, inscriptions, réservations ou autres formats événementiels, sans absorber les domain events internes du système, les notifications, la newsletter, le scheduling global ou les intégrations externes.

## Responsabilités

Le domaine `events` prend en charge :

- les événements publics
- les fiches événementielles
- les dates, horaires et lieux d’événements
- les inscriptions à un événement
- les réservations liées à un événement
- les états métier d’un événement
- la lecture exploitable des participants, inscrits ou réservations selon les capacités actives
- la base événementielle consommable par le storefront, l’admin, `notifications`, `newsletter`, `social`, `analytics` et d’autres domaines consommateurs

## Ce que le domaine ne doit pas faire

Le domaine `events` ne doit pas :

- porter les domain events internes, qui relèvent de `domain-events`
- porter les notifications transactionnelles, qui relèvent de `notifications`
- porter la newsletter, qui relève de `newsletter`
- porter la publication sociale, qui relève de `social`
- porter le scheduling transverse du socle, qui relève de `scheduling`
- porter les intégrations externes ou la billetterie/provider externe, qui relèvent de `integrations`
- devenir un CMS générique ou un agenda technique global sans responsabilité métier claire

Le domaine `events` porte les événements publics métier. Il ne remplace ni `domain-events`, ni `notifications`, ni `newsletter`, ni `social`, ni `integrations`.

## Sous-domaines

- `catalog` : fiches événementielles publiques
- `registrations` : inscriptions à un événement
- `reservations` : réservations liées à un événement
- `publication` : état public de l’événement

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour d’événements publics
- des créations ou mises à jour d’inscriptions
- des créations ou mises à jour de réservations
- des demandes de lecture des événements actifs ou passés
- des demandes de publication ou dépublication d’événements
- des contextes boutique, client, utilisateur, temporel ou de capacité utile au fonctionnement événementiel

## Sorties

Le domaine expose principalement :

- des événements publics structurés
- des statuts d’événement
- des inscriptions
- des réservations
- une lecture exploitable par le storefront, l’admin, `notifications`, `newsletter`, `social`, `analytics`, `dashboarding` et d’autres domaines consommateurs

## Dépendances vers autres domaines

Le domaine `events` peut dépendre de :

- `stores` pour le contexte boutique et les capabilities actives
- `customers` pour certaines inscriptions ou réservations liées à un client métier
- `users` pour certains acteurs administratifs ou de gestion interne
- `pages` ou `media` pour certains contenus ou visuels associés
- `workflow` ou `approval` si certaines publications événementielles nécessitent une validation
- `audit` pour tracer les changements sensibles
- `observability` pour expliquer pourquoi un événement est publié, bloqué, complet, clôturé ou non réservable

Les domaines suivants peuvent dépendre de `events` :

- `notifications`
- `newsletter`
- `social`
- `analytics`
- `dashboarding`
- `subscriptions`
- `crm`

## Capabilities activables liées

Le domaine `events` est directement lié à :

- `publicEvents`
- `eventRegistrations`
- `eventReservations`
- `notifications`
- `newsletter`
- `socialPublishing`

### Effet si `publicEvents` est activée

Le domaine devient exploitable pour publier et exposer des événements publics.

### Effet si `publicEvents` est désactivée

Le domaine reste structurellement présent, mais aucun événement public ne doit être exposé côté boutique.

### Effet si `eventRegistrations` est activée

Le domaine peut gérer des inscriptions à des événements.

### Effet si `eventRegistrations` est désactivée

Aucune inscription ne doit être possible.

### Effet si `eventReservations` est activée

Le domaine peut gérer des réservations liées aux événements.

### Effet si `eventReservations` est désactivée

Aucune réservation ne doit être possible.

### Effet si `notifications`, `newsletter` ou `socialPublishing` est activée

Les événements publics peuvent alimenter des usages aval de diffusion ou d’information, sans que `events` absorbe ces domaines.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- `content_editor`
- `customer_support`
- `customer` pour ses propres inscriptions ou réservations selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `events.read`
- `events.write`
- `events.publish`
- `customers.read`
- `marketing.read`
- `newsletter.read`
- `social.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `event.created`
- `event.updated`
- `event.published`
- `event.cancelled`
- `event.registration.created`
- `event.registration.cancelled`
- `event.reservation.created`
- `event.reservation.cancelled`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `subscription.created` si certains abonnements concernent les nouveautés événementielles
- `store.capabilities.updated`
- événements de workflow, approval ou scheduling liés à la publication ou clôture d’un événement

Il doit toutefois rester maître de sa propre vérité événementielle publique.

## Intégrations externes

Le domaine `events` ne doit pas parler directement aux systèmes externes.

Les échanges avec :

- plateformes d’événementiel
- outils de réservation externes
- systèmes CRM externes
- providers emailing ou social pour la diffusion

relèvent de :

- `integrations`
- `newsletter`
- `social`
- éventuellement `jobs`

Le domaine `events` reste la source de vérité interne des événements publics du socle.

## Données sensibles / sécurité

Le domaine `events` manipule des données publiques et relationnelles potentiellement sensibles, notamment via les inscriptions ou réservations.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- validation stricte des états de publication
- protection des données d’inscription ou réservation
- séparation claire entre événement public et communications aval
- audit des changements significatifs

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un événement est publié ou non
- pourquoi une inscription ou une réservation est acceptée, refusée ou clôturée
- quel capability ou contexte a influencé la disponibilité d’un événement
- si une absence de diffusion aval vient d’une capability off, d’une règle métier ou d’un domaine consommateur non activé

### Audit

Il faut tracer :

- la création d’un événement
- la modification d’un événement
- la publication ou dépublication d’un événement
- les changements significatifs d’inscriptions ou de réservations
- les interventions manuelles importantes

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `PublicEvent` : événement public structuré
- `EventPublicationStatus` : état public de l’événement
- `EventRegistration` : inscription à un événement
- `EventReservation` : réservation liée à un événement
- `EventAudienceStatus` : état d’ouverture ou de clôture des inscriptions/réservations

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un événement public possède un identifiant stable et un état explicite
- `events` ne se confond pas avec `domain-events`
- une inscription ou réservation est rattachée explicitement à un événement valide
- `events` ne se confond pas avec `notifications`, `newsletter` ou `social`
- les autres domaines ne doivent pas recréer leur propre vérité divergente des événements publics structurés
- les diffusions aval restent distinctes de la vérité interne du domaine événementiel

## Cas d’usage principaux

1. Créer un événement public
2. Modifier un événement public
3. Publier ou dépublier un événement
4. Ouvrir ou fermer les inscriptions à un événement
5. Ouvrir ou fermer les réservations liées à un événement
6. Lire les événements à venir ou passés
7. Exposer les événements au storefront et à l’admin
8. Alimenter newsletter, notifications et social à partir d’un événement publié

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- événement introuvable
- événement invalide
- capability publicEvents désactivée
- capability eventRegistrations ou eventReservations désactivée
- inscription ou réservation impossible dans l’état courant
- capacité ou disponibilité événementielle atteinte selon la politique retenue
- tentative de publication non autorisée

## Décisions d’architecture

Les choix structurants du domaine sont :

- `events` porte les événements publics métier du socle
- `events` est distinct de `domain-events`
- `events` est distinct de `notifications`
- `events` est distinct de `newsletter`
- `events` est distinct de `social`
- `events` est distinct de `integrations`
- les domaines aval consomment les événements publics, sans que `events` exécute lui-même toute la diffusion externe
- les publications et changements sensibles d’événements doivent être auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les événements publics relèvent de `events`
- les domain events internes relèvent de `domain-events`
- la diffusion newsletter relève de `newsletter`
- la diffusion sociale relève de `social`
- `events` ne remplace ni `domain-events`, ni `notifications`, ni `newsletter`, ni `social`, ni `integrations`
