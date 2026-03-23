# Domaine scheduling

## Rôle

Le domaine `scheduling` porte la planification métier temporelle du socle.

Il structure les dates, fenêtres, échéances, activations différées et occurrences planifiées qui doivent être interprétées comme des intentions temporelles métier, sans absorber l’exécution asynchrone des traitements, les workflows, les événements publics ou les intégrations providers externes.

## Responsabilités

Le domaine `scheduling` prend en charge :

- les planifications métier
- les dates d’activation ou de désactivation différées
- les fenêtres temporelles d’exposition
- les échéances métier
- les occurrences planifiées
- la lecture de l’état temporel d’une action ou d’un objet planifié
- la base temporelle exploitable par `marketing`, `newsletter`, `social`, `events`, `workflow`, `jobs` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `scheduling` ne doit pas :

- porter l’exécution asynchrone, qui relève de `jobs`
- porter l’orchestration complète des processus, qui relève de `workflow`
- porter les événements publics métier, qui relèvent de `events`
- porter les publications sociales elles-mêmes, qui relèvent de `social`
- porter les campagnes newsletter elles-mêmes, qui relèvent de `newsletter`
- devenir un simple cron technique ou un moteur de file d’attente masqué
- devenir un calendrier universel sans langage métier explicite

Le domaine `scheduling` porte l’intention temporelle métier. Il ne remplace ni `jobs`, ni `workflow`, ni `events`, ni les domaines source.

## Sous-domaines

- `plans` : planifications métier structurées
- `windows` : fenêtres temporelles d’activation, d’exposition ou de validité
- `occurrences` : occurrences planifiées ou dates d’effet
- `policies` : règles de planification et d’interprétation temporelle

## Entrées

Le domaine reçoit principalement :

- des demandes de planification ou déplanification d’une action métier
- des demandes de lecture de l’état temporel d’un objet ou d’une campagne
- des changements de fenêtre de validité ou de date d’effet
- des contextes boutique, fuseau, scope, acteur et calendrier utile à l’interprétation
- des demandes d’évaluation de ce qui est actif, à venir, expiré ou hors fenêtre

## Sorties

Le domaine expose principalement :

- des planifications structurées
- des fenêtres temporelles explicites
- des occurrences ou échéances
- des lectures exploitables par `jobs`, `workflow`, `marketing`, `newsletter`, `social`, `events`, `dashboarding` et certaines couches d’administration
- des signaux logiques indiquant qu’un objet devient actif, expiré, planifié ou non encore exécutable

## Dépendances vers autres domaines

Le domaine `scheduling` peut dépendre de :

- `stores` pour certains contextes boutique, fuseaux ou politiques locales
- `audit` pour tracer certaines modifications sensibles de planification
- `observability` pour expliquer pourquoi une activation a eu lieu, a été différée ou n’a pas encore été déclenchée

Les domaines suivants peuvent dépendre de `scheduling` :

- `marketing`
- `newsletter`
- `social`
- `events`
- `workflow`
- `jobs`
- `dashboarding`
- certaines couches d’administration plateforme et boutique

## Capabilities activables liées

Le domaine `scheduling` n’est pas une capability métier optionnelle au sens strict du noyau, mais il devient particulièrement utile lorsque certaines fonctions temporelles sont actives.

Exemples de capabilities liées :

- `marketingCampaigns`
- `newsletter`
- `socialPublishing`
- `automaticSocialPosting`
- `publicEvents`
- `conversionFlows`

### Règle

Le domaine `scheduling` reste structurellement présent même si peu de fonctions planifiées sont activées.

Il constitue le cadre commun des activations et fenêtres temporelles métier quand un domaine source ne doit pas gérer seul toute la sémantique temporelle.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- `content_editor` selon le type d’objet planifié
- certains opérateurs dédiés selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `scheduling.read`
- `scheduling.write`
- `marketing.write`
- `newsletter.write`
- `social.write`
- `events.write`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `schedule.created`
- `schedule.updated`
- `schedule.cancelled`
- `schedule.window.opened`
- `schedule.window.closed`
- `schedule.occurrence.reached`
- `schedule.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `marketing.campaign.created`
- `newsletter.campaign.created`
- `social.publication.created`
- `event.created`
- `workflow.started`
- `store.capabilities.updated`
- certaines actions administratives structurées de planification ou replanification

Il doit toutefois rester maître de sa propre logique temporelle métier.

## Intégrations externes

Le domaine `scheduling` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut fournir à `jobs` ou à d’autres domaines la lecture de quand une action devient exécutable, mais :

- la vérité de la planification reste dans `scheduling`
- l’exécution différée reste dans `jobs`
- les échanges providers externes restent dans `integrations`

## Données sensibles / sécurité

Le domaine `scheduling` manipule des informations de calendrier, de fenêtres d’activation et parfois de diffusion sensible.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre intention temporelle et exécution effective
- protection des modifications sensibles de dates, fenêtres et occurrences
- prise en compte explicite du fuseau et du contexte boutique
- audit des replanifications et changements sensibles

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelle planification est en vigueur
- quelle fenêtre temporelle s’applique
- pourquoi un objet est actif, à venir, expiré ou inactif
- quel changement a modifié la date d’effet
- si une activation n’a pas eu lieu à cause d’une fenêtre non ouverte, d’une capability off ou d’une autre règle métier

### Audit

Il faut tracer :

- la création d’une planification sensible
- la modification d’une planification sensible
- la replanification d’une activation importante
- certaines annulations ou déprogrammations significatives
- certaines consultations sensibles si le modèle final les retient explicitement

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `SchedulePlan` : planification métier structurée
- `ScheduleWindow` : fenêtre temporelle d’activation ou de validité
- `ScheduleOccurrence` : occurrence ou date d’effet planifiée
- `ScheduleStatus` : état temporel courant de la planification
- `SchedulePolicy` : règle d’interprétation temporelle
- `ScheduleSubjectRef` : référence vers l’objet ou l’action planifié

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une planification possède un identifiant stable et un statut explicite
- une occurrence ou une fenêtre est rattachée à un sujet explicite
- `scheduling` ne se confond pas avec `jobs`
- `scheduling` ne se confond pas avec `workflow`
- `scheduling` ne se confond pas avec `events`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de planification métier quand le cadre commun `scheduling` existe
- une action ne devient temporellement exécutable que si ses règles de fenêtre, de date d’effet et de contexte sont satisfaites

## Cas d’usage principaux

1. Planifier l’activation d’une campagne marketing
2. Planifier l’envoi ou l’ouverture d’une campagne newsletter
3. Planifier une publication sociale
4. Définir une fenêtre d’exposition pour un événement ou une opération
5. Fournir à `jobs` ou au domaine source la lecture fiable du moment où une action devient exécutable
6. Exposer à l’admin une lecture claire des planifications actives, à venir ou expirées

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- planification introuvable
- fenêtre temporelle invalide ou incohérente
- occurrence impossible ou mal définie
- fuseau ou contexte temporel incohérent
- tentative de replanification non autorisée
- permission ou scope insuffisant
- tentative d’exposition d’un détail sensible dans un contexte non autorisé

## Décisions d’architecture

Les choix structurants du domaine sont :

- `scheduling` porte la planification temporelle métier du socle
- `scheduling` est distinct de `jobs`
- `scheduling` est distinct de `workflow`
- `scheduling` est distinct de `events`
- les domaines source délèguent la sémantique temporelle à `scheduling` sans lui déléguer leur vérité métier complète
- l’exécution effective après échéance reste hors du domaine `scheduling`
- les planifications, fenêtres et replanifications sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la planification temporelle métier relève de `scheduling`
- l’exécution asynchrone structurée relève de `jobs`
- l’orchestration de processus relève de `workflow`
- les événements publics relèvent de `events`
- `scheduling` ne remplace ni `jobs`, ni `workflow`, ni `events`, ni les domaines métier source
