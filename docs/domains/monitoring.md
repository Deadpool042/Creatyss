# Domaine monitoring

## Rôle

Le domaine `monitoring` porte la supervision technique et l’état de santé opérationnelle du socle.

Il structure les vues, statuts, alertes et signaux de santé technique permettant de savoir si les composants critiques du système fonctionnent correctement, sans absorber l’observabilité explicative, l’analytics métier, les dashboards métier ou les domaines source eux-mêmes.

## Responsabilités

Le domaine `monitoring` prend en charge :

- l’état de santé technique des composants critiques
- les alertes techniques
- les statuts de disponibilité ou de dégradation
- la supervision des jobs, intégrations et composants transverses au niveau santé
- les signaux techniques exploitables par les équipes plateforme
- la base de supervision consommable par `dashboarding`, `observability`, `jobs`, `integrations` et les espaces d’administration plateforme

## Ce que le domaine ne doit pas faire

Le domaine `monitoring` ne doit pas :

- porter l’explicabilité des flux, qui relève de `observability`
- porter l’analytics métier, qui relève de `analytics`
- porter les dashboards de pilotage métier, qui relèvent de `dashboarding`
- porter les domaines source comme `jobs`, `integrations`, `orders` ou `payments`
- devenir un simple agrégat de logs bruts sans modèle de santé explicite
- absorber les workflows de reprise ou de correction, qui relèvent des domaines concernés

Le domaine `monitoring` porte la santé technique et la supervision. Il ne remplace ni `observability`, ni `dashboarding`, ni les domaines source.

## Sous-domaines

- `health` : états de santé des composants et services
- `alerts` : alertes techniques et états d’alerte
- `status` : statuts synthétiques de disponibilité, dégradation ou incident
- `checks` : contrôles et vérifications de supervision structurés

## Entrées

Le domaine reçoit principalement :

- des statuts techniques issus de `jobs`, `integrations`, `webhooks`, `api-clients` ou d’autres briques transverses
- des résultats de checks structurés
- des demandes de lecture d’état de santé ou d’alerte
- des contextes plateforme, boutique ou périmètre de supervision
- des signaux techniques nécessaires à l’évaluation de l’état de santé global ou partiel

## Sorties

Le domaine expose principalement :

- des états de santé structurés
- des alertes techniques
- des statuts synthétiques de supervision
- des vues consommables par `dashboarding`, `observability`, les espaces d’administration plateforme et certains domaines techniques consommateurs

## Dépendances vers autres domaines

Le domaine `monitoring` peut dépendre de :

- `jobs` pour les états d’exécution et files critiques
- `integrations` pour les statuts de synchronisation et incidents externes
- `webhooks` pour certains états de livraison critiques
- `observability` pour certaines corrélations explicatives, sans absorber sa responsabilité
- `audit` pour certaines corrélations sensibles si nécessaire
- `store` pour certains contextes de supervision multi-boutiques

Les domaines suivants peuvent dépendre de `monitoring` :

- `dashboarding`
- `observability`
- les couches d’administration plateforme

## Capabilities activables liées

Le domaine `monitoring` est directement ou indirectement lié à :

- `technicalMonitoring`
- `businessObservability`
- `erpIntegration`
- `electronicInvoicing`
- `newsletter`
- `socialPublishing`
- `tracking`

### Effet si `technicalMonitoring` est activée

Le domaine devient pleinement exploitable pour exposer des vues et alertes de supervision technique.

### Effet si `technicalMonitoring` est désactivée

Le domaine reste structurellement présent, mais aucune vue de supervision avancée non indispensable ne doit être exposée côté plateforme hors besoins internes strictement cadrés.

### Effet si certaines capabilities métier ou d’intégration sont activées

Le domaine peut superviser plus finement les flux ou composants correspondants au niveau santé technique, sans absorber leur logique fonctionnelle.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- certains rôles observateurs techniques en lecture selon la politique retenue

Les rôles boutique ne doivent pas accéder librement à la supervision technique transverse du socle.

### Permissions

Exemples de permissions concernées :

- `monitoring.read`
- `observability.read`
- `integrations.read`
- `jobs.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `monitoring.health.updated`
- `monitoring.alert.created`
- `monitoring.alert.resolved`
- `monitoring.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `job.status.changed`
- `integration.sync.status.changed`
- `webhook.delivery.failed`
- `tracking.event.projected`
- `store.capabilities.updated`

Il doit toutefois rester maître de sa propre logique de supervision et de synthèse d’état.

## Intégrations externes

Le domaine `monitoring` ne doit pas parler directement aux providers externes comme source de vérité principale.

Les projections éventuelles vers :

- outils de monitoring externes
- plateformes de supervision externes
- systèmes d’alerte externes

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `monitoring` reste la source de vérité interne des états de santé et alertes structurés du socle.

## Données sensibles / sécurité

Le domaine `monitoring` peut exposer des informations sensibles sur la santé du système, les dégradations, les incidents et certaines dépendances critiques.

Points de vigilance :

- contrôle strict des droits de lecture
- séparation nette entre supervision plateforme et exposition boutique
- limitation des détails techniques selon le rôle, le scope et la sensibilité
- protection contre la fuite d’informations sur l’architecture ou les incidents
- audit des changements significatifs de configuration de supervision ou d’exposition d’alertes

## Observability / audit

### Observability

Le domaine doit permettre de comprendre :

- quel composant ou périmètre est considéré sain, dégradé ou incidenté
- pourquoi une alerte est active ou résolue
- quelles sources ont alimenté l’état de supervision
- si une vue est partielle à cause d’une capability off, d’une source absente ou d’un retard de remontée

### Audit

Le domaine `monitoring` n’a pas vocation à auditer chaque variation technique mineure.

En revanche, certaines modifications sensibles doivent pouvoir être tracées, notamment :

- les changements significatifs de règles ou de périmètre de supervision
- certaines interventions manuelles importantes sur les alertes ou statuts exposés
- certains changements de visibilité des informations de monitoring

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `MonitoringHealthState` : état de santé d’un composant ou périmètre
- `MonitoringAlert` : alerte technique structurée
- `MonitoringStatus` : statut synthétique de supervision
- `MonitoringCheckResult` : résultat d’un check structuré
- `MonitoringScope` : périmètre de supervision ou de lecture

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une vue de monitoring s’appuie sur des sources identifiées et explicites
- `monitoring` ne se confond pas avec `observability`
- `monitoring` ne se confond pas avec `analytics`
- `monitoring` ne se confond pas avec `dashboarding`
- les vues de supervision ne doivent pas redéfinir de manière divergente la vérité des domaines source
- les autres couches ne doivent pas recréer librement des vues de monitoring divergentes quand une lecture commune de supervision existe

## Cas d’usage principaux

1. Exposer l’état de santé global des intégrations critiques
2. Exposer l’état de santé des jobs ou files critiques
3. Signaler une dégradation ou un incident technique
4. Exposer une alerte de livraison webhook en échec répété
5. Alimenter `dashboarding` avec des synthèses de supervision technique
6. Fournir aux équipes plateforme une lecture claire et actionnable de la santé du système

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- alerte introuvable
- périmètre de supervision inconnu
- source amont absente ou non disponible
- capability nécessaire désactivée
- permission ou scope insuffisant
- tentative d’exposition de détails trop sensibles dans un contexte non autorisé

## Décisions d’architecture

Les choix structurants du domaine sont :

- `monitoring` porte la supervision technique et la santé opérationnelle du socle
- `monitoring` est distinct de `observability`
- `monitoring` est distinct de `analytics`
- `monitoring` est distinct de `dashboarding`
- `monitoring` consomme les domaines source au lieu de redéfinir leurs vérités techniques ou métier
- les expositions plateforme et boutique restent strictement distinctes
- les alertes et états de santé sensibles doivent être contrôlés, auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la supervision technique relève de `monitoring`
- l’explicabilité et la corrélation relèvent de `observability`
- l’analytics consolidée relève de `analytics`
- les vues de pilotage relèvent de `dashboarding`
- les providers externes relèvent de `integrations`
- `monitoring` ne remplace ni `observability`, ni `analytics`, ni `dashboarding`, ni `integrations`
