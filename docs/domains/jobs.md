# Domaine jobs

## Rôle

Le domaine `jobs` porte l’exécution asynchrone, différée et rejouable du socle.

Il structure les traitements qui ne doivent pas être exécutés dans le flux synchrone principal ou qui nécessitent une reprise, des retries, une planification ou une exécution résiliente, sans absorber la logique métier coeur des domaines qui déclenchent ces traitements.

## Responsabilités

Le domaine `jobs` prend en charge :

- les jobs asynchrones
- les files logiques d’exécution
- les retries
- les reprises
- les statuts d’exécution
- les tentatives et erreurs d’exécution
- la planification différée d’un traitement
- la lecture exploitée des jobs en attente, en cours, échoués, réussis ou abandonnés
- la base d’exécution consommable par `integrations`, `webhooks`, `notifications`, `newsletter`, `social`, `dashboarding`, `monitoring` et `observability`

## Ce que le domaine ne doit pas faire

Le domaine `jobs` ne doit pas :

- porter la logique métier coeur du traitement, qui relève du domaine source
- remplacer les `domain-events`, qui portent les faits métier internes
- porter les adaptateurs providers externes, qui relèvent de `integrations`
- porter les webhooks sortants eux-mêmes, qui relèvent de `webhooks`
- devenir un fourre-tout où toute logique applicative est déplacée sans frontière claire
- devenir un simple scheduler technique déconnecté du langage métier du socle

Le domaine `jobs` porte l’exécution asynchrone et résiliente. Il ne remplace ni les domaines coeur, ni `domain-events`, ni `integrations`, ni `webhooks`.

## Sous-domaines

- `queue` : files logiques d’exécution
- `execution` : exécution et tentative des jobs
- `retries` : politique de retry et reprise
- `scheduling` : planification différée des jobs

## Entrées

Le domaine reçoit principalement :

- des demandes de planification ou d’exécution asynchrone issues de domaines métier ou transverses
- des événements internes exploitables comme déclencheurs
- des paramètres d’exécution nécessaires au job
- des demandes de reprise ou de relance d’un job échoué
- des demandes de lecture d’état ou d’historique d’exécution

## Sorties

Le domaine expose principalement :

- des jobs structurés
- des statuts d’exécution
- des tentatives de job
- des erreurs d’exécution structurées
- des lectures exploitables par `integrations`, `webhooks`, `newsletter`, `social`, `dashboarding`, `monitoring` et `observability`

## Dépendances vers autres domaines

Le domaine `jobs` peut dépendre de :

- `domain-events` pour certains déclencheurs internes
- `audit` pour tracer certaines reprises ou actions sensibles
- `observability` pour corréler et expliquer les échecs ou retards
- `monitoring` pour l’exposition de l’état de santé des files et exécutions
- `store` pour certains contextes boutique ou multi-boutiques

Les domaines suivants peuvent dépendre de `jobs` :

- `integrations`
- `webhooks`
- `notifications`
- `newsletter`
- `social`
- `documents`
- `dashboarding`
- `monitoring`
- `observability`

Et les domaines déclencheurs typiques incluent notamment :

- `products`
- `orders`
- `payments`
- `returns`
- `documents`
- `events`
- `marketing`
- `conversion`

## Capabilities activables liées

Le domaine `jobs` n’est pas une capability métier optionnelle au sens classique.

Il fait partie de l’architecture structurante du socle.

En revanche, de nombreux jobs ne sont utiles que si certains domaines ou capabilities consommateurs sont actifs, par exemple :

- `newsletter`
- `socialPublishing`
- `automaticSocialPosting`
- `erpIntegration`
- `electronicInvoicing`
- `notifications`
- `serverSideTracking`

### Règle

Le domaine `jobs` reste présent même si certains traitements spécialisés sont désactivés.

Exemple :

- le moteur de jobs existe
- mais aucun job social ne doit être planifié si `socialPublishing = false`
- aucun job newsletter ne doit être planifié si `newsletter = false`

## Rôles/permissions concernés

### Rôles

Le domaine `jobs` est principalement gouverné et observé par :

- `platform_owner`
- `platform_engineer`

Éventuellement, certains rôles support avancé ou observateurs techniques peuvent avoir une lecture partielle selon la politique retenue.

Les rôles boutique ne doivent pas administrer librement les files et politiques d’exécution transverses du socle.

### Permissions

Exemples de permissions concernées :

- `monitoring.read`
- `observability.read`
- `integrations.read`
- `integrations.write`
- `audit.read`

Selon le niveau de détail retenu plus tard, des permissions plus spécifiques au pilotage ou à la reprise manuelle des jobs pourront être ajoutées.

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `job.created`
- `job.started`
- `job.succeeded`
- `job.failed`
- `job.retry.scheduled`
- `job.cancelled`
- `job.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `product.published`
- `order.created`
- `invoice.generated`
- `event.published`
- `newsletter.campaign.scheduled`
- `social.publication.scheduled`
- `store.capabilities.updated`

Il peut également consommer des demandes directes d’orchestration asynchrone provenant de domaines source, sans que ces demandes deviennent elles-mêmes la vérité métier du domaine.

## Intégrations externes

Le domaine `jobs` ne doit pas parler directement aux providers externes comme source de vérité principale.

Les jobs peuvent exécuter des traitements qui s’appuient sur :

- `integrations`
- `webhooks`
- d’autres domaines consommateurs

Mais `jobs` reste responsable du cadre d’exécution asynchrone, pas du protocole provider lui-même.

## Données sensibles / sécurité

Le domaine `jobs` peut porter des paramètres techniques et métier sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’action sur les jobs
- protection des reprises manuelles, annulations ou relances sensibles
- séparation claire entre statut du job, erreur technique et erreur métier source
- limitation de l’exposition des payloads ou paramètres sensibles selon le rôle et le scope
- audit des interventions manuelles importantes

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel job a été créé
- pourquoi il a été planifié
- quel domaine ou événement l’a déclenché
- combien de tentatives ont eu lieu
- pourquoi une tentative a échoué
- quand une reprise ou un retry est prévu
- si un job n’est pas planifié à cause d’une capability off ou d’une règle métier

### Audit

Le domaine `jobs` n’a pas vocation à auditer chaque tentative technique de faible importance comme une trace de conformité autonome.

En revanche, certaines actions sensibles doivent pouvoir être tracées, notamment :

- les reprises manuelles
- les annulations manuelles
- les changements significatifs de politique de retry ou de planification
- certaines interventions administratives importantes

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Job` : traitement asynchrone structuré
- `JobQueue` : file logique d’exécution
- `JobStatus` : état du job
- `JobAttempt` : tentative d’exécution
- `JobError` : erreur structurée d’exécution
- `JobSchedule` : planification ou prochain passage prévu
- `JobTriggerRef` : référence vers le déclencheur logique du job

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un job possède un type explicite et un statut explicite
- `jobs` ne se confond pas avec `domain-events`
- `jobs` ne se confond pas avec `integrations`
- l’exécution d’un job reste distincte du fait métier qui l’a déclenché
- les autres domaines ne doivent pas recréer librement leur propre moteur d’exécution asynchrone divergent quand le cadre commun `jobs` existe
- une capability désactivée peut empêcher la planification d’un type de job sans supprimer la structure du domaine

## Cas d’usage principaux

1. Planifier une synchronisation ERP différée
2. Retenter une publication sociale échouée
3. Exécuter l’envoi d’une campagne newsletter en différé
4. Gérer un envoi webhook avec retry
5. Générer un document lourd hors flux synchrone principal
6. Exposer à l’admin technique une lecture claire des jobs en attente, en cours ou échoués

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- job introuvable
- type de job inconnu ou invalide
- file logique inconnue
- tentative de reprise non autorisée
- policy de retry invalide
- capability nécessaire désactivée
- erreur répétée sans possibilité de reprise automatique

## Décisions d’architecture

Les choix structurants du domaine sont :

- `jobs` porte le cadre d’exécution asynchrone, différé et rejouable du socle
- `jobs` est distinct de `domain-events`
- `jobs` est distinct de `integrations`
- `jobs` est distinct de `webhooks`
- les domaines source déclenchent des jobs sans déléguer leur vérité métier au domaine `jobs`
- les jobs exécutent des traitements consommateurs ou transverses dans un cadre résilient commun
- les reprises et exécutions sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- l’exécution asynchrone structurée relève de `jobs`
- les faits métier internes relèvent de `domain-events`
- les providers externes relèvent de `integrations`
- les webhooks sortants relèvent de `webhooks`
- `jobs` ne remplace ni `domain-events`, ni `integrations`, ni `webhooks`, ni les domaines métier source
