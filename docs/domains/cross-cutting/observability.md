# Domaine observability

## Rôle

Le domaine `observability` porte l’explicabilité et la compréhension opérationnelle du socle.

Il structure les lectures permettant de comprendre ce qui s’est passé, pourquoi cela s’est produit, quelles corrélations existent entre flux métier et techniques, et où se situent les anomalies ou points de friction, sans absorber le monitoring, l’analytics métier, les domain events ou les logs bruts non structurés.

## Responsabilités

Le domaine `observability` prend en charge :

- les vues explicatives sur les flux métier
- les corrélations entre événements, jobs, intégrations et états métiers
- les diagnostics de parcours ou de workflow
- les traces de compréhension exploitables par les équipes plateforme
- certaines synthèses transverses utiles au support avancé et à l’exploitation
- la base d’explication exploitable par `dashboarding`, `audit`, `monitoring`, `jobs`, `integrations` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `observability` ne doit pas :

- porter le monitoring technique, qui relève de `monitoring`
- porter l’analytics métier consolidée, qui relève de `analytics`
- porter les domain events eux-mêmes, qui relèvent de `domain-events`
- porter les logs bruts comme unique modèle, sans structuration explicative
- porter les alertes de santé technique comme domaine principal, ce qui relève de `monitoring`
- devenir un fourre-tout mélangeant logs, reporting, analytics et audit sans responsabilité claire

Le domaine `observability` porte l’explication et la corrélation opérationnelle. Il ne remplace ni `monitoring`, ni `analytics`, ni `domain-events`, ni `audit`.

## Sous-domaines

- `flow-traces` : traces explicatives de flux métier ou transverses
- `correlations` : corrélations entre objets, événements, jobs et intégrations
- `diagnostics` : diagnostics lisibles des anomalies, blocages ou comportements inattendus
- `explanations` : vues explicatives orientées compréhension

## Entrées

Le domaine reçoit principalement :

- des événements structurés issus de `domain-events`
- des états et statuts issus de `jobs`, `integrations`, `orders`, `payments`, `returns`, `documents` ou d’autres domaines source
- des signaux de tracking ou de supervision utiles à la compréhension d’un flux
- des demandes de lecture explicative sur un objet, un parcours, un job, une intégration ou un incident
- des contextes boutique, scope, corrélation ou intervalle temporel

## Sorties

Le domaine expose principalement :

- des vues explicatives structurées
- des corrélations entre événements, actions et résultats
- des diagnostics exploitables par les équipes plateforme ou support avancé
- des lectures consommables par `dashboarding`, `monitoring`, `audit`, `jobs`, `integrations` et certaines couches d’administration

## Dépendances vers autres domaines

Le domaine `observability` peut dépendre de :

- `domain-events` pour les faits métier internes structurés
- `jobs` pour les états d’exécution et reprises
- `integrations` pour les statuts de synchronisation et erreurs provider traduites
- `orders`, `payments`, `returns`, `documents`, `events` et autres domaines métier pour les états source corrélés
- `tracking` pour certains signaux utiles à la compréhension de parcours
- `monitoring` pour certaines informations de santé technique corrélées, sans absorber sa responsabilité
- `audit` pour certaines corrélations sensibles si nécessaire
- `stores` pour le contexte boutique

Les domaines suivants peuvent dépendre de `observability` :

- `dashboarding`
- `monitoring`
- `audit`
- `support`
- les couches d’administration plateforme

## Capabilities activables liées

Le domaine `observability` est directement ou indirectement lié à :

- `businessObservability`
- `technicalMonitoring`
- `tracking`
- `erpIntegration`
- `electronicInvoicing`
- `newsletter`
- `socialPublishing`
- `publicEvents`

### Effet si `businessObservability` est activée

Le domaine devient pleinement exploitable pour exposer des vues explicatives riches sur les flux métier.

### Effet si `businessObservability` est désactivée

Le domaine reste structurellement présent, mais aucune vue d’explication avancée non indispensable ne doit être exposée côté boutique.

### Effet si `technicalMonitoring` est activée

Le domaine peut croiser plus finement certaines informations de santé technique, sans absorber `monitoring`.

### Effet si certaines capabilities métier ou d’intégration sont activées

Le domaine peut exposer des corrélations et diagnostics dédiés aux flux correspondants, sans absorber la logique source de ces domaines.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- certains rôles support avancé ou observateur technique en lecture selon la politique retenue

Les rôles boutique ne doivent pas voir librement toute l’observabilité transverse et technique du socle.

### Permissions

Exemples de permissions concernées :

- `observability.read`
- `monitoring.read`
- `audit.read`
- `tracking.read`
- `integrations.read`
- `jobs.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `observability.trace.generated`
- `observability.diagnostic.updated`
- `observability.correlation.detected`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `order.created`
- `payment.failed`
- `return.requested`
- `invoice.generated`
- `event.published`
- `tracking.event.created`
- `job.status.changed`
- `integration.sync.status.changed`
- `store.capabilities.updated`

Il doit toutefois rester maître de sa propre logique de corrélation et d’explication.

## Intégrations externes

Le domaine `observability` ne doit pas parler directement aux providers externes comme source de vérité principale.

Les éventuelles projections vers :

- plateformes d’observabilité externes
- outils de tracing externes
- cockpits techniques externes

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `observability` reste la source de vérité interne des lectures explicatives et corrélées du socle.

## Données sensibles / sécurité

Le domaine `observability` peut exposer des informations sensibles sur les flux internes, erreurs, états et corrélations système.

Points de vigilance :

- contrôle strict des droits de lecture
- séparation nette entre observabilité plateforme et exposition boutique
- limitation des données exposées selon le rôle, le scope et la sensibilité
- protection contre la fuite de détails techniques ou provider inutiles dans les espaces non techniques
- audit des changements significatifs de configuration d’exposition ou de corrélation

## Observability / audit

### Observability

Le domaine doit lui-même permettre de comprendre :

- quelles sources ont alimenté une vue explicative
- pourquoi un diagnostic a été produit
- quels événements, états ou erreurs ont été corrélés
- si une vue est partielle à cause d’une capability off, d’une source absente ou d’un retard de propagation

### Audit

Le domaine `observability` n’a pas vocation à devenir un journal de conformité universel.

En revanche, certaines modifications sensibles doivent pouvoir être tracées, notamment :

- les changements significatifs de règles d’exposition
- certaines corrections manuelles importantes d’une vue explicative
- certains changements de périmètre ou de visibilité des diagnostics

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ObservabilityTrace` : trace explicative structurée
- `ObservabilityCorrelation` : corrélation entre objets, événements ou états
- `ObservabilityDiagnostic` : diagnostic lisible d’un comportement ou incident
- `ObservabilityScope` : périmètre d’observation ou de lecture
- `ObservabilityExplanation` : vue explicative contextualisée

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une vue d’observabilité s’appuie sur des sources identifiées et explicites
- `observability` ne se confond pas avec `monitoring`
- `observability` ne se confond pas avec `analytics`
- `observability` ne se confond pas avec `audit`
- les vues explicatives ne doivent pas redéfinir de manière divergente la vérité des domaines source
- les autres couches ne doivent pas recréer librement des vues explicatives divergentes quand une lecture commune d’observabilité existe

## Cas d’usage principaux

1. Expliquer pourquoi une commande a échoué à progresser dans un flux donné
2. Corréler un événement métier, un job et un statut d’intégration
3. Expliquer pourquoi une notification, une newsletter ou une publication sociale n’a pas été exécutée
4. Exposer une vue de diagnostic sur un flux documentaire ou ERP
5. Alimenter `dashboarding` avec des synthèses explicatives
6. Fournir aux équipes plateforme une lecture claire et actionnable des corrélations métier/technique

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- trace introuvable
- corrélation impossible ou incomplète
- source amont absente ou non disponible
- capability nécessaire désactivée
- permission ou scope insuffisant
- tentative d’exposition de détails trop sensibles dans un contexte non autorisé

## Décisions d’architecture

Les choix structurants du domaine sont :

- `observability` porte les vues explicatives et corrélées du socle
- `observability` est distinct de `monitoring`
- `observability` est distinct de `analytics`
- `observability` est distinct de `audit`
- `observability` consomme les domaines source au lieu de redéfinir leurs vérités métier ou techniques
- les expositions plateforme et boutique restent distinctes
- les vues explicatives sensibles doivent être contrôlées, auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les vues explicatives et corrélées relèvent de `observability`
- le monitoring relève de `monitoring`
- l’analytics consolidée relève de `analytics`
- l’audit relève de `audit`
- les providers externes relèvent de `integrations`
- `observability` ne remplace ni `monitoring`, ni `analytics`, ni `audit`, ni `integrations`
