# Domaine dashboarding

## Rôle

Le domaine `dashboarding` porte les vues de pilotage et tableaux de bord du socle.

Il structure l’exposition lisible, actionnable et contextualisée des indicateurs, états, alertes et synthèses utiles aux acteurs plateforme et boutique, sans absorber l’analytics consolidée, l’observabilité technique, le monitoring, ni les domaines source eux-mêmes.

## Responsabilités

Le domaine `dashboarding` prend en charge :

- les tableaux de bord métier
- les vues de pilotage boutique
- les vues de pilotage plateforme
- les widgets et synthèses lisibles
- les indicateurs exposés à des rôles donnés
- les regroupements de métriques, états et alertes dans des vues cohérentes
- la base d’exposition UI de pilotage exploitée par les espaces admin plateforme et boutique

## Ce que le domaine ne doit pas faire

Le domaine `dashboarding` ne doit pas :

- porter l’analytics consolidée, qui relève de `analytics`
- porter l’observabilité technique, qui relève de `observability`
- porter le monitoring technique, qui relève de `monitoring`
- recalculer localement des métriques source de manière divergente
- devenir un domaine UI-only sans responsabilité métier explicite
- devenir un entrepôt flou regroupant toutes les données sans structure de pilotage claire

Le domaine `dashboarding` porte l’exposition de pilotage. Il ne remplace ni `analytics`, ni `observability`, ni `monitoring`, ni les domaines source.

## Sous-domaines

- `store-dashboards` : tableaux de bord orientés exploitation boutique
- `platform-dashboards` : tableaux de bord orientés gouvernance plateforme
- `widgets` : widgets, cartes, synthèses et blocs de pilotage réutilisables
- `alerts-view` : vues de synthèse des alertes ou signaux importants exposables en dashboard

## Entrées

Le domaine reçoit principalement :

- des indicateurs consolidés issus de `analytics`
- des états métier issus de `orders`, `payments`, `returns`, `events`, `newsletter`, `social` ou d’autres domaines source
- des états techniques ou de supervision issus de `observability`, `monitoring`, `jobs`, `integrations` selon le dashboard concerné
- des contextes de rôle, scope et boutique
- des demandes de lecture de tableau de bord ou de widget

## Sorties

Le domaine expose principalement :

- des dashboards structurés
- des widgets de synthèse
- des vues lisibles de pilotage
- des regroupements contextualisés de métriques, états et alertes
- une exposition cohérente consommable par les interfaces admin plateforme et boutique

## Dépendances vers autres domaines

Le domaine `dashboarding` peut dépendre de :

- `analytics` pour les indicateurs métier consolidés
- `orders`, `payments`, `returns`, `documents` pour certaines synthèses commerciales ou opérationnelles
- `marketing`, `conversion`, `newsletter`, `events`, `social` pour certaines synthèses de diffusion ou de performance
- `observability` pour certaines synthèses explicatives techniques ou transverses
- `monitoring` pour certaines synthèses d’état technique en espace plateforme
- `jobs` et `integrations` pour exposer certains statuts transverses utiles au pilotage
- `roles`, `permissions` et `stores` pour contrôler l’exposition selon le rôle, le scope et le contexte boutique

Les domaines suivants peuvent dépendre de `dashboarding` :

- les couches d’administration plateforme
- les couches d’administration boutique

## Capabilities activables liées

Le domaine `dashboarding` est directement ou indirectement lié à :

- `analytics`
- `businessObservability`
- `technicalMonitoring`
- `marketingCampaigns`
- `conversionFlows`
- `newsletter`
- `publicEvents`
- `socialPublishing`
- `erpIntegration`
- `electronicInvoicing`

### Effet si `analytics` est activée

Le domaine peut exposer des tableaux de bord métier enrichis à partir des indicateurs consolidés.

### Effet si `businessObservability` est activée

Le domaine peut exposer des synthèses explicatives plus riches sur les flux métier.

### Effet si `technicalMonitoring` est activée

Le domaine peut exposer des vues de supervision technique côté plateforme, sans absorber `monitoring`.

### Effet si certaines capabilities métier sont activées

Le domaine peut exposer des widgets ou tableaux de bord dédiés aux domaines correspondants, sans absorber leur logique.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- `order_manager`
- `customer_support` en lecture partielle selon la politique retenue
- `observer` pour des accès de lecture limités selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `dashboarding.read`
- `analytics.read`
- `observability.read`
- `monitoring.read`
- `orders.read`
- `payments.read`
- `returns.read`
- `marketing.read`
- `newsletter.read`
- `events.read`
- `social.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `dashboard.view.generated`
- `dashboard.widget.updated`
- `dashboard.alert.exposed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `analytics.view.refreshed`
- `order.created`
- `payment.captured`
- `return.closed`
- `newsletter.campaign.sent`
- `event.published`
- `social.publication.published`
- `integration.sync.status.changed` si ce langage interne est stabilisé
- `job.status.changed` si ce langage interne est stabilisé
- `store.capabilities.updated`

Il doit toutefois rester maître de sa propre logique d’exposition et de composition des dashboards.

## Intégrations externes

Le domaine `dashboarding` ne doit pas parler directement aux providers externes comme source de vérité principale.

Les éventuelles exportations ou projections vers :

- BI externes
- cockpits externes
- outils d’administration tiers

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `dashboarding` reste la source de vérité interne des vues de pilotage exposées dans le socle.

## Données sensibles / sécurité

Le domaine `dashboarding` expose potentiellement des données commerciales, relationnelles ou techniques sensibles.

Points de vigilance :

- contrôle strict des droits de lecture
- limitation des widgets et vues selon le rôle et le scope
- séparation stricte entre dashboard boutique et dashboard plateforme
- absence de fuite d’informations techniques sensibles vers l’espace boutique
- cohérence entre capabilities actives et exposition des vues

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelles sources ont alimenté un dashboard ou un widget
- pourquoi un bloc est visible ou masqué
- si une vue est partielle à cause d’une capability off, d’une permission absente ou d’une source non disponible
- quelle version de synthèse ou quel périmètre a été retenu pour l’exposition

### Audit

Le domaine `dashboarding` n’a pas vocation à auditer chaque rafraîchissement d’interface.

En revanche, certaines modifications sensibles doivent pouvoir être tracées, notamment :

- les changements de configuration d’exposition de dashboards
- les changements de périmètre d’un widget sensible
- certaines interventions manuelles importantes sur les vues de pilotage

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `DashboardView` : tableau de bord structuré
- `DashboardWidget` : widget ou bloc de synthèse
- `DashboardScope` : périmètre d’exposition du dashboard
- `DashboardAudience` : audience ou rôle cible d’un dashboard
- `DashboardAlertView` : vue de synthèse d’une alerte ou d’un signal important

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un dashboard s’appuie sur des sources identifiées et explicites
- `dashboarding` ne se confond pas avec `analytics`
- `dashboarding` ne se confond pas avec `observability` ou `monitoring`
- un dashboard plateforme et un dashboard boutique restent distincts par audience, contenu et permissions
- les vues de pilotage ne doivent pas redéfinir de manière divergente la vérité des domaines source
- les autres couches UI ne doivent pas recréer librement des dashboards divergents quand une lecture commune de pilotage existe

## Cas d’usage principaux

1. Exposer un dashboard boutique avec CA, commandes, nouveautés et campagnes
2. Exposer un dashboard plateforme avec santé globale, intégrations, jobs et supervision multi-boutiques
3. Exposer un widget commandes en attente ou paiements à problème
4. Exposer un widget campagnes newsletter ou événements à venir
5. Adapter l’exposition des dashboards selon le rôle et le scope
6. Fournir à l’admin une lecture claire, synthétique et actionnable des informations utiles au pilotage

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- dashboard introuvable
- widget inconnu ou incompatible
- source amont absente ou indisponible
- capability nécessaire désactivée
- permission ou scope insuffisant
- tentative d’exposition d’une vue plateforme dans un contexte boutique non autorisé

## Décisions d’architecture

Les choix structurants du domaine sont :

- `dashboarding` porte les vues de pilotage du socle
- `dashboarding` est distinct de `analytics`
- `dashboarding` est distinct de `observability`
- `dashboarding` est distinct de `monitoring`
- `dashboarding` consomme les domaines source au lieu de redéfinir leurs vérités métier ou techniques
- les dashboards plateforme et boutique sont distincts
- les expositions sensibles doivent être contrôlées, auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les vues de pilotage relèvent de `dashboarding`
- l’analytics consolidée relève de `analytics`
- l’observabilité relève de `observability`
- le monitoring relève de `monitoring`
- les providers externes relèvent de `integrations`
- `dashboarding` ne remplace ni `analytics`, ni `observability`, ni `monitoring`, ni `integrations`
