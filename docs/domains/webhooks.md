# Domaine webhooks

## Rôle

Le domaine `webhooks` porte les notifications sortantes du socle vers des systèmes externes abonnés.

Il structure les abonnements webhook, les événements sortants éligibles, les livraisons, les retries et les statuts de diffusion vers des endpoints externes, sans absorber les domain events internes, les jobs d’exécution génériques, les intégrations providers spécialisées ou les événements publics métier.

## Responsabilités

Le domaine `webhooks` prend en charge :

- les abonnements webhook
- les endpoints webhook déclarés
- les événements sortants éligibles à diffusion
- les livraisons webhook
- les retries de livraison
- les statuts de livraison
- les signatures ou mécanismes de sécurisation des livraisons si le modèle final le prévoit
- la lecture exploitable des tentatives, succès, échecs et abandons de livraison
- la base de diffusion sortante consommable par `jobs`, `monitoring`, `observability`, `audit` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `webhooks` ne doit pas :

- porter les faits métier internes, qui relèvent de `domain-events`
- porter les événements publics métier, qui relèvent de `events`
- porter les intégrations providers spécialisées, qui relèvent de `integrations`
- porter le moteur asynchrone générique, qui relève de `jobs`
- devenir un bus interne du socle
- adopter les payloads providers externes comme langage central du système

Le domaine `webhooks` porte la notification sortante générique à destination de systèmes abonnés. Il ne remplace ni `domain-events`, ni `jobs`, ni `integrations`, ni `events`.

## Sous-domaines

- `subscriptions` : abonnements webhook et endpoints déclarés
- `deliveries` : livraisons webhook et statuts associés
- `security` : signature, secrets et sécurisation des livraisons
- `retries` : politique de reprise et relance des livraisons échouées

## Entrées

Le domaine reçoit principalement :

- des événements internes structurés émis par `domain-events`
- des demandes de création, mise à jour ou révocation d’abonnements webhook
- des demandes de lecture des abonnements, livraisons ou statuts
- des paramètres de sécurité nécessaires à la diffusion webhook
- des demandes de retry ou de relance d’une livraison échouée

## Sorties

Le domaine expose principalement :

- des abonnements webhook structurés
- des événements sortants éligibles à diffusion
- des livraisons webhook et leurs tentatives
- des statuts de succès, échec, retry ou abandon
- des lectures exploitables par `monitoring`, `observability`, `audit`, `dashboarding` et certaines couches d’administration

## Dépendances vers autres domaines

Le domaine `webhooks` peut dépendre de :

- `domain-events` pour les faits métier internes source
- `jobs` pour l’exécution différée, les retries et la résilience de livraison
- `audit` pour tracer les changements sensibles d’abonnement et certaines actions manuelles
- `observability` pour corréler et expliquer les échecs ou blocages de livraison
- `monitoring` pour exposer l’état de santé des livraisons et endpoints
- `store` pour certains contextes boutique ou multi-boutiques si le modèle le prévoit

Les domaines suivants peuvent dépendre de `webhooks` :

- `monitoring`
- `observability`
- `dashboarding`
- `audit`
- les couches d’administration plateforme

Et les domaines émetteurs source typiques incluent notamment :

- `products`
- `orders`
- `payments`
- `returns`
- `documents`
- `events`
- `newsletter`
- `social`

## Capabilities activables liées

Le domaine `webhooks` n’est pas une capability métier optionnelle au sens classique.

Il fait partie de l’architecture transverse du socle.

En revanche, certains événements ou usages webhook ne sont utiles que si certains domaines source sont actifs, par exemple :

- `newsletter`
- `publicEvents`
- `socialPublishing`
- `electronicInvoicing`
- `erpIntegration`

### Règle

Le domaine `webhooks` reste présent même si certains événements source ou usages spécialisés sont désactivés.

Exemple :

- le mécanisme webhook existe
- mais aucun événement newsletter ne doit être diffusé si `newsletter = false`
- aucun événement social ne doit être diffusé si `socialPublishing = false`

## Rôles/permissions concernés

### Rôles

Le domaine `webhooks` est principalement gouverné et observé par :

- `platform_owner`
- `platform_engineer`

Éventuellement, certains rôles observateurs techniques peuvent disposer d’une lecture partielle selon la politique retenue.

Les rôles boutique ne doivent pas administrer librement les abonnements et secrets webhook transverses du socle.

### Permissions

Exemples de permissions concernées :

- `webhooks.read`
- `webhooks.write`
- `integrations.read`
- `monitoring.read`
- `observability.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `webhook.subscription.created`
- `webhook.subscription.updated`
- `webhook.subscription.revoked`
- `webhook.delivery.created`
- `webhook.delivery.succeeded`
- `webhook.delivery.failed`
- `webhook.delivery.retry.scheduled`
- `webhook.delivery.abandoned`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `product.published`
- `order.created`
- `payment.captured`
- `invoice.generated`
- `event.published`
- `newsletter.campaign.sent`
- `store.capabilities.updated`

Il peut également consommer des actions administratives directes liées aux abonnements ou retries, sans que ces actions deviennent la vérité métier des domaines source.

## Intégrations externes

Le domaine `webhooks` parle à des endpoints externes abonnés, mais il ne doit pas devenir un domaine d’intégration provider spécialisée.

Les webhooks sont :

- des notifications sortantes génériques du socle
- basées sur des événements internes structurés
- livrées à des endpoints déclarés

À l’inverse, `integrations` porte :

- les adaptateurs spécialisés vers des systèmes externes nommés
- les DTO externes dédiés
- les protocoles et statuts providers spécifiques

## Données sensibles / sécurité

Le domaine `webhooks` manipule des données techniques et potentiellement sensibles.

Points de vigilance :

- contrôle strict des droits sur les abonnements et secrets
- validation stricte des endpoints et configurations déclarées
- séparation claire entre événement interne source, payload webhook diffusé et protocole externe
- protection des secrets de signature
- limitation de l’exposition des payloads ou headers sensibles selon le rôle et le scope
- audit des interventions manuelles importantes

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel événement interne a déclenché une livraison webhook
- à quel abonnement ou endpoint la livraison était destinée
- combien de tentatives ont eu lieu
- pourquoi une tentative a échoué
- quand un retry est prévu
- si une livraison n’a pas été produite à cause d’une capability off, d’un abonnement inactif ou d’une règle de filtrage

### Audit

Le domaine `webhooks` n’a pas vocation à transformer chaque tentative technique en trace de conformité autonome.

En revanche, certaines actions sensibles doivent pouvoir être tracées, notamment :

- la création ou révocation d’un abonnement webhook
- la rotation d’un secret
- les retries manuels
- les annulations manuelles
- certaines modifications sensibles de politique de livraison

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `WebhookSubscription` : abonnement webhook structuré
- `WebhookEndpoint` : endpoint déclaré
- `WebhookEventType` : type d’événement sortant éligible
- `WebhookDelivery` : livraison webhook
- `WebhookDeliveryAttempt` : tentative de livraison
- `WebhookDeliveryStatus` : état de la livraison
- `WebhookSecretRef` : référence de sécurisation ou secret associé

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un webhook est rattaché à un abonnement et à un endpoint explicites
- une livraison webhook dérive d’un événement interne structuré
- `webhooks` ne se confond pas avec `domain-events`
- `webhooks` ne se confond pas avec `jobs`
- `webhooks` ne se confond pas avec `integrations`
- la livraison sortante reste distincte du fait métier qui l’a déclenchée
- les autres domaines ne doivent pas recréer librement leur propre mécanisme webhook divergent quand le cadre commun `webhooks` existe

## Cas d’usage principaux

1. Déclarer un abonnement webhook sur `order.created`
2. Diffuser un payload sortant lors de la création d’une commande
3. Retenter une livraison webhook échouée
4. Révoquer un endpoint ou un abonnement compromis
5. Exposer à l’admin technique une lecture claire des abonnements, livraisons et échecs
6. Superviser les endpoints en erreur répétée

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- abonnement webhook introuvable
- endpoint invalide ou interdit
- type d’événement non supporté
- tentative de retry non autorisée
- secret invalide ou absent
- capability source désactivée
- erreur répétée sans possibilité de reprise automatique

## Décisions d’architecture

Les choix structurants du domaine sont :

- `webhooks` porte la notification sortante générique du socle vers des systèmes abonnés
- `webhooks` est distinct de `domain-events`
- `webhooks` est distinct de `jobs`
- `webhooks` est distinct de `integrations`
- les domaines source publient des faits métier internes, puis `webhooks` décide et exécute la diffusion sortante via son cadre dédié
- l’exécution résiliente de livraison peut s’appuyer sur `jobs` sans lui déléguer la responsabilité métier du webhook
- les abonnements, secrets et livraisons sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les notifications sortantes génériques vers systèmes abonnés relèvent de `webhooks`
- les faits métier internes relèvent de `domain-events`
- l’exécution asynchrone structurée relève de `jobs`
- les intégrations providers spécialisées relèvent de `integrations`
- `webhooks` ne remplace ni `domain-events`, ni `jobs`, ni `integrations`, ni les domaines métier source
