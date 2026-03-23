# Domaine analytics

## Rôle

Le domaine `analytics` porte l’analyse métier consolidée du socle.

Il structure les vues, agrégats, indicateurs et lectures analytiques utiles au pilotage commercial, marketing, catalogue, événementiel et opérationnel de la boutique, sans absorber le tracking brut, l’attribution, l’observabilité technique ou le monitoring.

## Responsabilités

Le domaine `analytics` prend en charge :

- les indicateurs métier consolidés
- les agrégats de performance commerciale
- les vues analytiques catalogue
- les vues analytiques commandes et revenus
- les vues analytiques marketing et conversion
- les vues analytiques événements, newsletter et social lorsque les domaines amont sont actifs
- la base analytique exploitable par l’admin, le pilotage boutique, `dashboarding` et certains domaines consommateurs

## Ce que le domaine ne doit pas faire

Le domaine `analytics` ne doit pas :

- porter les signaux bruts de mesure, qui relèvent de `tracking`
- porter l’attribution marketing, qui relève de `attribution`
- porter l’observabilité technique, qui relève de `observability`
- porter le monitoring technique, qui relève de `monitoring`
- porter les providers externes analytics, qui relèvent de `integrations`
- recalculer les vérités métier sources de manière divergente par rapport aux domaines coeur
- devenir un entrepôt flou regroupant sans structure logs, événements, tracking et reporting

Le domaine `analytics` porte la lecture analytique consolidée. Il ne remplace ni `tracking`, ni `attribution`, ni `observability`, ni `monitoring`.

## Sous-domaines

- `sales` : analytics commerciales et revenus
- `catalog` : analytics catalogue et performance produit
- `marketing` : analytics marketing et conversion consolidées
- `engagement` : analytics liées à newsletter, social, events ou interactions selon les capabilities actives

## Entrées

Le domaine reçoit principalement :

- des signaux structurés issus de `tracking`
- des données durables issues de `orders`, `payments`, `returns`, `documents`
- des données catalogue issues de `products`
- des objets ou statuts issus de `marketing`, `conversion`, `newsletter`, `events`, `social`
- des contextes boutique, temporels, canal ou campagne utiles à la consolidation analytique
- des demandes de lecture analytique par période, scope ou dimension

## Sorties

Le domaine expose principalement :

- des indicateurs analytiques consolidés
- des vues agrégées par période, produit, campagne, canal ou autre dimension métier utile
- des métriques exploitables par `dashboarding`, l’admin boutique, le pilotage plateforme et certains domaines consommateurs
- une lecture claire des tendances, performances et comparaisons métier

## Dépendances vers autres domaines

Le domaine `analytics` peut dépendre de :

- `tracking` pour les signaux de mesure structurés
- `orders` pour les commandes durables
- `payments` pour certains états ou montants utiles au pilotage
- `returns` pour certains indicateurs post-commande
- `products` pour les lectures catalogue
- `marketing`, `conversion`, `newsletter`, `events`, `social` pour les objets amont utiles à la consolidation analytique
- `stores` pour le contexte boutique et les capabilities actives
- `audit` pour certaines corrélations sensibles si nécessaire
- `observability` pour certaines analyses croisées, sans absorber sa responsabilité

Les domaines suivants peuvent dépendre de `analytics` :

- `dashboarding`
- `marketing`
- `conversion`
- `crm`
- `stores`
- certaines couches d’administration plateforme ou boutique

## Capabilities activables liées

Le domaine `analytics` est directement ou indirectement lié à :

- `analytics`
- `tracking`
- `behavioralAnalytics`
- `productViewTracking`
- `clickTracking`
- `marketingCampaigns`
- `conversionFlows`
- `newsletter`
- `publicEvents`
- `socialPublishing`

### Effet si `analytics` est activée

Le domaine devient pleinement exploitable pour produire des vues analytiques métier consolidées.

### Effet si `analytics` est désactivée

Le domaine reste structurellement présent, mais aucune vue analytique métier non indispensable ne doit être exposée côté boutique.

### Effet si `tracking` ou certaines capabilities de comportement sont activées

Le domaine peut consolider des indicateurs plus riches à partir des signaux fournis par `tracking`.

### Effet si `marketingCampaigns`, `conversionFlows`, `newsletter`, `publicEvents` ou `socialPublishing` est activée

Le domaine peut intégrer ces objets et états amont dans ses consolidations analytiques.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- `order_manager`
- certains rôles de support ou pilotage en lecture selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `analytics.read`
- `dashboarding.read`
- `tracking.read`
- `attribution.read`
- `orders.read`
- `payments.read`
- `returns.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `analytics.snapshot.generated`
- `analytics.metric.updated`
- `analytics.view.refreshed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `order.created`
- `payment.captured`
- `return.closed`
- `product.published`
- `marketing.campaign.activated`
- `newsletter.campaign.sent`
- `event.published`
- `social.publication.published`
- `tracking.event.created`
- `store.capabilities.updated`

Il doit toutefois rester maître de sa propre logique de consolidation analytique.

## Intégrations externes

Le domaine `analytics` ne doit pas parler directement aux providers externes comme source de vérité principale.

Les échanges avec :

- plateformes analytics externes
- BI externes
- data warehouses externes
- providers publicitaires ou marketing externes

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `analytics` reste la source de vérité interne des lectures analytiques consolidées du socle.

## Données sensibles / sécurité

Le domaine `analytics` manipule des données agrégées potentiellement sensibles commercialement.

Points de vigilance :

- contrôle strict des droits de lecture
- limitation des vues selon le rôle et le scope
- distinction claire entre analytique métier, tracking brut et observabilité technique
- protection des consolidations sensibles liées au chiffre d’affaires, aux performances ou aux comportements
- audit des changements significatifs de configuration analytique si le modèle final les expose

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelles sources ont alimenté une vue analytique
- pourquoi un indicateur a évolué
- si une vue est partielle à cause d’une capability off, d’une source absente ou d’un retard de consolidation
- quelles dimensions métier ont été utilisées pour agréger les données

### Audit

Le domaine `analytics` n’a pas vocation à auditer chaque recalcul ou chaque agrégat produit.

En revanche, certaines modifications sensibles doivent pouvoir être tracées, notamment :

- les changements significatifs de configuration analytique
- certaines régénérations ou corrections manuelles importantes
- certaines modifications de périmètre ou d’exposition des vues analytiques

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `AnalyticsMetric` : indicateur analytique consolidé
- `AnalyticsView` : vue analytique structurée
- `AnalyticsDimension` : dimension d’analyse (temps, produit, campagne, canal, etc.)
- `AnalyticsSnapshot` : snapshot d’un état analytique à un instant donné
- `AnalyticsScope` : périmètre de lecture analytique

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une vue analytique s’appuie sur des sources identifiées et explicites
- `analytics` ne se confond pas avec `tracking`
- `analytics` ne se confond pas avec `attribution`
- `analytics` ne se confond pas avec `observability` ou `monitoring`
- les agrégats analytiques ne doivent pas redéfinir de manière divergente la vérité métier source
- les autres domaines ne doivent pas recréer leur propre vérité divergente des vues analytiques consolidées lorsqu’une lecture analytique commune existe

## Cas d’usage principaux

1. Lire le chiffre d’affaires consolidé sur une période
2. Lire les performances catalogue ou produit
3. Lire la performance d’une campagne, d’un flux conversion ou d’une newsletter
4. Lire les performances d’événements publics ou de publications sociales si les domaines amont sont actifs
5. Alimenter `dashboarding` avec des vues analytiques consolidées
6. Exposer à l’admin boutique ou plateforme une lecture claire des performances métier

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- vue analytique introuvable
- métrique inconnue
- source amont absente ou incompatible
- capability analytics désactivée
- scope de lecture non autorisé
- agrégation impossible ou incohérente à partir des données disponibles

## Décisions d’architecture

Les choix structurants du domaine sont :

- `analytics` porte les lectures analytiques consolidées du socle
- `analytics` est distinct de `tracking`
- `analytics` est distinct de `attribution`
- `analytics` est distinct de `observability`
- `analytics` est distinct de `integrations`
- les vues analytiques sont construites à partir de sources métier et de mesure identifiées, sans absorber la responsabilité de ces domaines source
- les expositions analytiques sensibles doivent être contrôlées, auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les lectures analytiques consolidées relèvent de `analytics`
- les signaux de mesure relèvent de `tracking`
- l’attribution relève de `attribution`
- l’observabilité technique relève de `observability`
- les providers externes relèvent de `integrations`
- `analytics` ne remplace ni `tracking`, ni `attribution`, ni `observability`, ni `monitoring`, ni `integrations`
