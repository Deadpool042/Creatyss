# Domaine tracking

## Rôle

Le domaine `tracking` porte les événements de mesure technique et marketing du socle.

Il structure les signaux de tracking produits par le runtime interne afin d’alimenter la mesure produit, commerciale, marketing ou technique, sans absorber l’analytics métier, l’attribution, les domain events internes, les notifications, ni les intégrations providers externes.

## Responsabilités

Le domaine `tracking` prend en charge :

- les événements de tracking internes
- la normalisation du langage de tracking du socle
- la préparation des payloads de tracking internes ou projetés
- la lecture des destinations de tracking activées au niveau métier
- la séparation entre événement métier source et signal de mesure dérivé
- la base de tracking exploitable par `analytics`, `attribution`, `marketing`, `conversion`, `observability` et certaines `integrations`

## Ce que le domaine ne doit pas faire

Le domaine `tracking` ne doit pas :

- porter les domain events internes, qui relèvent de `domain-events`
- porter l’analytics métier consolidée, qui relève de `analytics`
- porter l’attribution marketing, qui relève de `attribution`
- porter les providers externes de tracking ou de pixels, qui relèvent de `integrations`
- devenir un fourre-tout regroupant logs techniques, consentements, webhooks et reporting
- décider seul de la stratégie marketing ou de conversion, qui relève d’autres domaines

Le domaine `tracking` porte les signaux de mesure. Il ne remplace ni `domain-events`, ni `analytics`, ni `attribution`, ni `integrations`.

## Sous-domaines

- `events` : événements de tracking structurés
- `destinations` : destinations logiques de tracking activées
- `projection` : projection des signaux internes vers des formats exploitables en aval

## Entrées

Le domaine reçoit principalement :

- des domain events internes ou faits métier exploitables
- des signaux de navigation ou d’interaction autorisés par le modèle retenu
- des demandes de création de signaux de tracking
- des contexts boutique, client, session ou parcours utiles à la mesure
- l’état des capabilities et du consentement applicables selon les domaines concernés

## Sorties

Le domaine expose principalement :

- des événements de tracking structurés
- des destinations logiques de tracking actives
- des projections exploitables par `analytics`, `attribution`, `integrations`, `dashboarding` et `observability`
- une lecture claire des signaux effectivement émis ou neutralisés

## Dépendances vers autres domaines

Le domaine `tracking` peut dépendre de :

- `domain-events` pour certains faits métier internes servant de déclencheurs
- `store` pour le contexte boutique et les capabilities actives
- `consent` pour la gouvernance de certains signaux de mesure si le modèle final le prévoit
- `customers` ou `users` pour certains contextes acteur, sans absorber leurs responsabilités
- `audit` pour tracer certains changements sensibles de configuration tracking
- `observability` pour expliquer pourquoi un signal a été émis, neutralisé ou projeté d’une certaine manière

Les domaines suivants peuvent dépendre de `tracking` :

- `analytics`
- `attribution`
- `marketing`
- `conversion`
- `dashboarding`
- `integrations`

## Capabilities activables liées

Le domaine `tracking` est directement lié à :

- `tracking`
- `analytics`
- `attribution`
- `marketingPixels`
- `serverSideTracking`
- `behavioralAnalytics`
- `productViewTracking`
- `clickTracking`

### Effet si `tracking` est activée

Le domaine devient pleinement exploitable pour produire des signaux de mesure structurés.

### Effet si `tracking` est désactivée

Le domaine reste structurellement présent, mais aucun signal de tracking non indispensable ne doit être émis côté boutique.

### Effet si `marketingPixels` est activée

Le domaine peut alimenter des projections aval vers des pixels ou destinations marketing via `integrations`.

### Effet si `serverSideTracking` est activée

Le domaine peut produire des signaux destinés à des flux server-side via `integrations`.

### Effet si `behavioralAnalytics`, `productViewTracking` ou `clickTracking` est activée

Le domaine peut formaliser plus finement certains signaux de comportement ou d’interaction.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- certains rôles de pilotage ou d’observabilité en lecture selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `tracking.read`
- `tracking.write`
- `analytics.read`
- `attribution.read`
- `integrations.read`
- `audit.read`
- `observability.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `tracking.event.created`
- `tracking.event.projected`
- `tracking.event.skipped`
- `tracking.destination.updated`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `product.published`
- `order.created`
- `payment.captured`
- `event.published`
- `conversion.offer.exposed`
- `store.capabilities.updated`
- certains signaux d’interface ou de parcours stabilisés par le modèle applicatif

Il doit toutefois rester maître de son propre langage de tracking.

## Intégrations externes

Le domaine `tracking` ne doit pas parler directement aux providers externes.

Les interactions avec :

- pixels marketing
- providers analytics
- destinations server-side
- outils publicitaires ou de mesure externes

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `tracking` reste la source de vérité interne des signaux de mesure structurés du socle.

## Données sensibles / sécurité

Le domaine `tracking` manipule des signaux potentiellement sensibles, notamment lorsqu’ils touchent au comportement utilisateur ou à la mesure marketing.

Points de vigilance :

- respect des capabilities actives et du cadre de consentement applicable
- contrôle strict des configurations et destinations sensibles
- séparation claire entre signal interne, destination logique et provider externe
- limitation de la collecte au strict cadre autorisé par le modèle retenu
- audit des changements sensibles de configuration tracking

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un signal de tracking a été émis ou non
- quel fait métier ou quel contexte a servi de déclencheur
- quelle destination logique a été visée
- si une neutralisation est due à une capability off, à un consentement absent, à une règle métier ou à une défaillance aval

### Audit

Il faut tracer :

- les changements de configuration tracking significatifs
- les activations ou désactivations de destinations sensibles
- certaines modifications manuelles importantes des règles de projection

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `TrackingEvent` : signal de tracking structuré
- `TrackingEventType` : type stable de signal de tracking
- `TrackingDestination` : destination logique de tracking
- `TrackingProjection` : projection interne vers un format aval
- `TrackingContext` : contexte associé à l’émission du signal

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un signal de tracking possède un type stable et explicite
- `tracking` ne se confond pas avec `domain-events`
- `tracking` ne se confond pas avec `analytics` ou `attribution`
- un signal interne de tracking reste distinct de sa projection provider externe
- les autres domaines ne doivent pas recréer leur propre vérité divergente des signaux de tracking structurés
- l’émission d’un signal peut être neutralisée par les capabilities ou règles applicables sans supprimer la structure du domaine

## Cas d’usage principaux

1. Produire un signal de vue produit
2. Produire un signal de clic significatif
3. Produire un signal lié à une commande ou un paiement
4. Projeter un signal vers une destination logique marketing ou analytics
5. Alimenter `analytics` et `attribution` à partir d’un langage de mesure commun
6. Exposer à l’admin ou aux équipes techniques une lecture claire des signaux et destinations actives

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- type de signal inconnu
- destination logique introuvable ou inactive
- capability tracking désactivée
- consentement requis absent selon la règle applicable
- projection invalide
- tentative de mesurer un signal non autorisé par le modèle retenu
- échec aval d’intégration provider

## Décisions d’architecture

Les choix structurants du domaine sont :

- `tracking` porte les signaux de mesure structurés du socle
- `tracking` est distinct de `domain-events`
- `tracking` est distinct de `analytics`
- `tracking` est distinct de `attribution`
- `tracking` est distinct de `integrations`
- les providers externes sont appelés via `integrations`, puis les états utiles sont remappés dans le langage interne du domaine si nécessaire
- les configurations et projections sensibles de tracking doivent être auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les signaux de mesure structurés relèvent de `tracking`
- les domain events internes relèvent de `domain-events`
- l’analytics consolidée relève de `analytics`
- l’attribution relève de `attribution`
- les providers externes relèvent de `integrations`
- `tracking` ne remplace ni `domain-events`, ni `analytics`, ni `attribution`, ni `integrations`
