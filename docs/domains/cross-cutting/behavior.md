# Domaine behavior

## Rôle

Le domaine `behavior` porte la lecture comportementale structurée du socle.

Il organise les interprétations métier dérivées des interactions, parcours et signaux utilisateur lorsque l’on veut raisonner en termes de comportements observés, segments comportementaux, intentions probables ou états de parcours, sans absorber le tracking brut, l’attribution marketing, l’analytics consolidée, le CRM relationnel ou les consentements.

## Responsabilités

Le domaine `behavior` prend en charge :

- les lectures comportementales structurées
- les segments comportementaux
- les états de parcours observés
- les signaux d’intention ou d’intérêt dérivés
- les lectures de friction ou d’abandon au niveau comportemental
- les profils comportementaux exploitables par les autres domaines autorisés
- la base comportementale consommable par `conversion`, `crm`, `marketing`, `recommendations`, `analytics`, `dashboarding` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `behavior` ne doit pas :

- porter les signaux bruts de mesure, qui relèvent de `tracking`
- porter l’attribution marketing, qui relève de `attribution`
- porter l’analytics consolidée, qui relève de `analytics`
- porter la relation client enrichie, qui relève de `crm`
- porter les consentements, qui relèvent de `consent`
- porter les campagnes marketing ou les dispositifs de conversion eux-mêmes, qui relèvent de `marketing` et `conversion`
- devenir un fourre-tout mélangeant tracking, scoring opaque, ciblage marketing et profilage sans langage métier clair

Le domaine `behavior` porte l’interprétation comportementale structurée. Il ne remplace ni `tracking`, ni `analytics`, ni `attribution`, ni `crm`, ni `consent`.

## Sous-domaines

- `signals` : signaux comportementaux dérivés
- `segments` : segments comportementaux explicites
- `journeys` : états de parcours ou lectures de parcours observés
- `profiles` : profils comportementaux structurés
- `policies` : règles de dérivation, d’éligibilité ou d’exposition des lectures comportementales

## Entrées

Le domaine reçoit principalement :

- des signaux structurés issus de `tracking`
- des contextes de session, parcours, boutique, canal ou acteur
- des événements métier utiles à l’interprétation comportementale comme vues produit, interactions panier, débuts ou abandons de checkout, inscriptions ou retours de visite
- des demandes de lecture de segment ou de profil comportemental
- des demandes d’évaluation d’un état de parcours ou d’un niveau d’intérêt comportemental

## Sorties

Le domaine expose principalement :

- des segments comportementaux
- des profils comportementaux structurés
- des états de parcours observés
- des signaux d’intention ou de friction dérivés
- des lectures exploitables par `conversion`, `crm`, `marketing`, `recommendations`, `analytics`, `dashboarding` et certaines couches d’administration

## Dépendances vers autres domaines

Le domaine `behavior` peut dépendre de :

- `tracking` pour les signaux de mesure structurés
- `consent` pour vérifier si certaines dérivations comportementales sont autorisées dans le cadre retenu
- `customers` ou `users` pour rattacher certaines lectures à un acteur lorsque cela est permis
- `store` pour le contexte boutique et certaines politiques locales
- `audit` pour tracer certains changements sensibles de règles comportementales
- `observability` pour expliquer pourquoi un segment ou un état comportemental a été attribué, neutralisé ou non calculé

Les domaines suivants peuvent dépendre de `behavior` :

- `conversion`
- `crm`
- `marketing`
- `recommendations`
- `analytics`
- `dashboarding`
- certaines couches d’administration plateforme et boutique

## Capabilities activables liées

Le domaine `behavior` est directement ou indirectement lié à :

- `behavioralAnalytics`
- `tracking`
- `analytics`
- `conversionFlows`
- `marketingCampaigns`
- `productViewTracking`
- `clickTracking`

### Effet si `behavioralAnalytics` est activée

Le domaine devient pleinement exploitable pour produire des lectures comportementales structurées.

### Effet si `behavioralAnalytics` est désactivée

Le domaine reste structurellement présent, mais aucune lecture comportementale enrichie non indispensable ne doit être exposée côté boutique.

### Effet si `tracking`, `productViewTracking` ou `clickTracking` est activée

Le domaine peut s’appuyer sur des signaux de mesure plus riches pour dériver des lectures comportementales plus fines.

### Effet si `conversionFlows` ou `marketingCampaigns` est activée

Le domaine peut alimenter plus finement les usages aval en segmentation ou priorisation comportementale, sans absorber la responsabilité des domaines consommateurs.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- `customer_support` en lecture très partielle selon la politique retenue
- certains rôles analytiques ou d’observation en lecture selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `behavior.read`
- `behavior.write`
- `tracking.read`
- `analytics.read`
- `crm.read`
- `marketing.read`
- `consent.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `behavior.segment.assigned`
- `behavior.profile.updated`
- `behavior.journey.state.changed`
- `behavior.signal.derived`
- `behavior.policy.updated`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `tracking.event.created`
- `cart.updated`
- `checkout.readiness.changed`
- `order.created`
- `newsletter.subscribed`
- `event.registration.created`
- `store.capabilities.updated`
- certaines actions structurées de recalcul ou de réévaluation comportementale

Il doit toutefois rester maître de sa propre logique d’interprétation comportementale.

## Intégrations externes

Le domaine `behavior` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être consulté par `integrations` ou par des domaines consommateurs pour enrichir certains flux autorisés, mais :

- la vérité comportementale interne reste dans `behavior`
- les DTO providers externes restent dans `integrations`
- les signaux bruts restent dans `tracking`

## Données sensibles / sécurité

Le domaine `behavior` manipule des lectures potentiellement sensibles sur les parcours et comportements d’acteurs.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- respect du cadre de consentement applicable
- séparation claire entre signal brut, lecture comportementale et usage consommateur
- limitation de l’exposition selon le rôle, le scope et la sensibilité
- audit des changements sensibles de règles de segmentation ou de profilage comportemental

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel segment ou profil comportemental a été attribué
- à partir de quels signaux ou contextes
- pourquoi une lecture comportementale a été calculée, neutralisée ou non disponible
- si une absence de dérivation vient d’une capability off, d’un consentement absent, d’un signal insuffisant ou d’une règle applicable

### Audit

Il faut tracer :

- les changements significatifs de politiques comportementales
- certaines réaffectations ou recalculs sensibles
- certaines consultations sensibles si le modèle final les retient explicitement
- certaines modifications manuelles importantes des règles de segmentation ou de profil comportemental

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `BehaviorSignal` : signal comportemental dérivé
- `BehaviorSegment` : segment comportemental explicite
- `BehaviorJourneyState` : état observé d’un parcours
- `BehaviorProfile` : profil comportemental structuré
- `BehaviorPolicy` : règle de dérivation ou d’exposition
- `BehaviorActorRef` : référence vers l’acteur concerné lorsque cela est autorisé

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une lecture comportementale s’appuie sur des sources identifiées et explicites
- `behavior` ne se confond pas avec `tracking`
- `behavior` ne se confond pas avec `analytics`
- `behavior` ne se confond pas avec `crm`
- `behavior` ne se confond pas avec `consent`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de lecture comportementale quand le cadre commun `behavior` existe
- une dérivation comportementale peut être neutralisée par les règles de consentement, de capability ou d’exposition sans supprimer la structure du domaine

## Cas d’usage principaux

1. Identifier un intérêt élevé sur une catégorie ou un type de produit
2. Détecter un état de friction ou d’abandon de parcours
3. Segmenter des visiteurs ou clients selon des comportements observés
4. Alimenter `conversion` avec des signaux de relance ou de priorisation
5. Alimenter `crm` ou `marketing` avec des lectures comportementales autorisées
6. Exposer à l’admin une lecture claire des segments et profils comportementaux pertinents

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- segment comportemental introuvable
- profil comportemental introuvable
- signaux insuffisants ou incohérents
- capability behavioralAnalytics désactivée
- consentement requis absent selon la règle applicable
- tentative d’exposition d’une lecture comportementale dans un contexte non autorisé
- conflit entre plusieurs règles de dérivation comportementale

## Décisions d’architecture

Les choix structurants du domaine sont :

- `behavior` porte les lectures comportementales structurées du socle
- `behavior` est distinct de `tracking`
- `behavior` est distinct de `analytics`
- `behavior` est distinct de `crm`
- `behavior` est distinct de `consent`
- les domaines consommateurs lisent la vérité comportementale via `behavior`, sans la recréer localement
- les segmentations, profils et règles sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les lectures comportementales structurées relèvent de `behavior`
- les signaux de mesure relèvent de `tracking`
- l’analytics consolidée relève de `analytics`
- la relation client enrichie relève de `crm`
- les consentements réglementés relèvent de `consent`
- `behavior` ne remplace ni `tracking`, ni `analytics`, ni `crm`, ni `consent`, ni `integrations`
