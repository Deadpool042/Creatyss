# Domaine workflow

## Rôle

Le domaine `workflow` porte l’orchestration structurée des processus métier du socle.

Il organise les enchaînements d’étapes, transitions, blocages, préconditions, déclenchements et états de progression lorsque plusieurs actions métier doivent être coordonnées dans un ordre explicite, sans absorber la vérité métier des domaines source, ni se confondre avec les approbations, les jobs asynchrones ou les domain events.

## Responsabilités

Le domaine `workflow` prend en charge :

- les workflows métier structurés
- les étapes d’un processus
- les transitions entre étapes
- les états de progression d’un workflow
- les préconditions et blocages d’avancement
- les déclenchements d’actions ou d’étapes suivantes
- la lecture gouvernée d’un processus en cours
- la base d’orchestration exploitable par `approval`, `orders`, `documents`, `integrations`, `dashboarding`, `observability` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `workflow` ne doit pas :

- porter la vérité métier du domaine source orchestré
- porter les décisions d’approbation, qui relèvent de `approval`
- porter le moteur asynchrone et rejouable, qui relève de `jobs`
- porter les faits métier internes, qui relèvent de `domain-events`
- devenir un moteur générique opaque où toute logique applicative est déplacée sans langage métier clair
- se substituer aux invariants métiers des domaines source

Le domaine `workflow` porte l’enchaînement et la coordination des processus. Il ne remplace ni `approval`, ni `jobs`, ni `domain-events`, ni les domaines source.

## Sous-domaines

- `definitions` : définitions de workflows et de leurs étapes
- `instances` : instances concrètes d’exécution d’un workflow
- `transitions` : transitions et règles de passage d’une étape à l’autre
- `guards` : préconditions, blocages et contrôles d’avancement

## Entrées

Le domaine reçoit principalement :

- des demandes de démarrage de workflow
- des événements internes ou actions source déclenchant une transition
- des décisions d’approbation consommables depuis `approval`
- des demandes de lecture de l’état d’un workflow ou d’une instance
- des contextes acteur, ressource, boutique, scope et instant d’exécution
- des demandes de reprise ou d’avancement manuel si la politique retenue l’autorise

## Sorties

Le domaine expose principalement :

- des définitions de workflow
- des instances de workflow et leurs états
- des étapes, transitions et blocages explicites
- des lectures exploitables par `approval`, `audit`, `observability`, `dashboarding` et les domaines source consommateurs
- des déclenchements d’actions ou d’étapes suivantes consommables par les autres couches du socle

## Dépendances vers autres domaines

Le domaine `workflow` peut dépendre de :

- `approval` pour certaines validations préalables
- `domain-events` pour certains déclencheurs internes
- `audit` pour tracer certaines transitions sensibles ou avancements manuels
- `observability` pour expliquer pourquoi un workflow progresse, bloque ou échoue à avancer
- `stores` pour certains contextes boutique ou politiques locales

Les domaines suivants peuvent dépendre de `workflow` :

- `products`
- `marketing`
- `events`
- `documents`
- `integrations`
- `dashboarding`
- certaines couches d’administration plateforme et boutique

## Capabilities activables liées

Le domaine `workflow` n’est pas une capability métier optionnelle au sens strict du noyau, mais il devient particulièrement utile lorsque certaines fonctions multi-étapes ou sensibles sont actives.

Exemples de capabilities liées :

- `marketingCampaigns`
- `publicEvents`
- `electronicInvoicing`
- `erpIntegration`
- `socialPublishing`
- `auditTrail`
- `advancedPermissions`

### Règle

Le domaine `workflow` reste structurellement présent même si peu de processus orchestrés sont activés.

Il constitue le cadre commun des enchaînements multi-étapes lorsqu’un domaine source ne doit pas porter seul toute la coordination du processus.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- `content_editor` selon le type de workflow
- certains opérateurs ou approbateurs dédiés selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `workflow.read`
- `workflow.write`
- `approval.read`
- `audit.read`
- `marketing.write`
- `events.publish`
- `catalog.publish`
- `documents.write`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `workflow.started`
- `workflow.step.entered`
- `workflow.transition.completed`
- `workflow.blocked`
- `workflow.completed`
- `workflow.failed`
- `workflow.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `approval.approved`
- `approval.rejected`
- `product.updated`
- `marketing.campaign.created`
- `event.updated`
- `document.export.generated`
- `store.capabilities.updated`
- certaines actions administratives structurées d’avancement ou de reprise

Il doit toutefois rester maître de sa propre logique d’orchestration.

## Intégrations externes

Le domaine `workflow` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut coordonner des étapes qui conduisent ensuite à des échanges externes via `integrations`, mais :

- la vérité du workflow reste dans `workflow`
- les échanges provider-specific restent dans `integrations`
- les exécutions asynchrones restent dans `jobs`

## Données sensibles / sécurité

Le domaine `workflow` manipule des états de processus et parfois des décisions de progression sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre définition, instance, transition et action source
- protection des avancements manuels, forçages ou reprises sensibles
- traçabilité des transitions critiques
- limitation de l’exposition selon le rôle, le scope et la nature du processus

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel workflow est en cours
- quelle étape est active
- pourquoi une transition a été autorisée, refusée ou bloquée
- quel événement, quelle approbation ou quelle action a déclenché l’avancement
- si un workflow reste bloqué à cause d’une précondition non satisfaite, d’un refus d’approbation ou d’une règle applicable

### Audit

Il faut tracer :

- le démarrage d’un workflow sensible
- les transitions significatives
- les blocages majeurs
- les avancements ou reprises manuelles sensibles
- les changements significatifs de définition ou de politique de workflow si le modèle final les expose explicitement

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `WorkflowDefinition` : définition structurée d’un workflow
- `WorkflowInstance` : instance concrète d’exécution
- `WorkflowStep` : étape du processus
- `WorkflowTransition` : passage autorisé entre deux étapes
- `WorkflowStatus` : état courant du workflow
- `WorkflowGuard` : précondition ou règle bloquante
- `WorkflowSubjectRef` : référence vers l’objet ou l’action orchestré

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une instance de workflow possède un identifiant stable et un statut explicite
- une transition de workflow est rattachée à une instance et à des étapes explicites
- `workflow` ne se confond pas avec `approval`
- `workflow` ne se confond pas avec `jobs`
- `workflow` ne se confond pas avec `domain-events`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de coordination multi-étapes quand le cadre commun `workflow` existe
- une étape ne peut progresser que si ses préconditions et règles applicables sont satisfaites

## Cas d’usage principaux

1. Orchestrer la publication multi-étapes d’un produit
2. Orchestrer une campagne marketing avec validation préalable et activation finale
3. Orchestrer la publication d’un événement public avec contrôle d’étapes
4. Orchestrer un flux documentaire nécessitant plusieurs validations ou passages
5. Fournir à un domaine source une lecture fiable de l’état de progression d’un processus
6. Exposer à l’admin une lecture claire des workflows en cours, bloqués ou terminés

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- définition de workflow introuvable
- instance de workflow introuvable
- transition invalide pour l’état courant
- précondition non satisfaite
- approbation requise absente ou refusée
- tentative d’avancement non autorisée
- permission ou scope insuffisant
- tentative d’exposition d’un détail sensible dans un contexte non autorisé

## Décisions d’architecture

Les choix structurants du domaine sont :

- `workflow` porte l’orchestration structurée des processus du socle
- `workflow` est distinct de `approval`
- `workflow` est distinct de `jobs`
- `workflow` est distinct de `domain-events`
- les domaines source délèguent la coordination multi-étapes à `workflow` sans lui déléguer leur vérité métier complète
- les transitions, blocages et reprises sensibles doivent être observables et auditables
- l’exécution asynchrone ou provider-specific reste hors du domaine `workflow`

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- l’orchestration structurée des processus relève de `workflow`
- les validations préalables relèvent de `approval`
- l’exécution asynchrone structurée relève de `jobs`
- les faits métier internes relèvent de `domain-events`
- `workflow` ne remplace ni `approval`, ni `jobs`, ni `domain-events`, ni les domaines métier source
