# Domaine approval

## Rôle

Le domaine `approval` porte les validations explicites et approbations gouvernées du socle.

Il structure les demandes d’approbation, les décisions d’acceptation ou de refus, les étapes de validation et les statuts associés lorsqu’une action sensible, une publication, une opération commerciale ou une modification structurante ne doit pas être exécutée immédiatement sans contrôle préalable.

## Responsabilités

Le domaine `approval` prend en charge :

- les demandes d’approbation
- les décisions d’approbation ou de refus
- les statuts d’approbation
- les étapes de validation si le modèle retenu en prévoit plusieurs
- les acteurs approbateurs autorisés
- les motifs d’acceptation, de refus ou de demande de révision
- la lecture gouvernée de l’état d’une approbation
- la base de contrôle préalable exploitable par `workflow`, `marketing`, `events`, `products`, `documents`, `integrations` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `approval` ne doit pas :

- porter le workflow complet d’exécution, qui relève de `workflow`
- porter l’audit sensible, qui relève de `audit`
- porter les permissions fines, qui relèvent de `permissions`
- porter la logique métier complète des domaines source
- devenir un simple statut booléen recopié localement dans chaque domaine sans langage commun
- devenir un système RH ou organisationnel généraliste sans lien avec les validations du socle

Le domaine `approval` porte la décision gouvernée de validation préalable. Il ne remplace ni `workflow`, ni `audit`, ni `permissions`, ni les domaines source.

## Sous-domaines

- `requests` : demandes d’approbation structurées
- `decisions` : décisions d’acceptation, refus ou révision
- `stages` : étapes d’approbation si plusieurs validations sont requises
- `policies` : règles déterminant ce qui exige une approbation et qui peut l’accorder

## Entrées

Le domaine reçoit principalement :

- des demandes d’approbation émises par des domaines source
- des décisions d’acceptation, refus ou retour en révision
- des demandes de lecture d’état d’approbation
- des contextes acteur, ressource, boutique, scope, politique et instant de décision
- des changements de politique d’approbation

## Sorties

Le domaine expose principalement :

- des demandes d’approbation structurées
- des décisions d’approbation
- des statuts d’approbation
- des lectures exploitables par `workflow`, `audit`, `observability`, `dashboarding` et les couches d’administration
- des résultats de validation préalable consommables par les domaines source

## Dépendances vers autres domaines

Le domaine `approval` peut dépendre de :

- `users` pour identifier les acteurs approbateurs
- `roles` et `permissions` pour vérifier qui peut approuver quoi
- `store` pour certains contextes boutique ou politiques locales
- `audit` pour tracer les décisions sensibles
- `observability` pour expliquer pourquoi une approbation a été accordée, refusée ou bloquée

Les domaines suivants peuvent dépendre de `approval` :

- `workflow`
- `products`
- `marketing`
- `events`
- `documents`
- `integrations`
- `dashboarding`
- certaines couches d’administration plateforme et boutique

## Capabilities activables liées

Le domaine `approval` n’est pas une capability métier optionnelle au sens strict du noyau, mais il devient particulièrement utile lorsque certaines fonctions sensibles ou éditoriales sont actives.

Exemples de capabilities liées :

- `marketingCampaigns`
- `publicEvents`
- `electronicInvoicing`
- `erpIntegration`
- `socialPublishing`
- `advancedPermissions`
- `auditTrail`

### Règle

Le domaine `approval` reste structurellement présent même si toutes les politiques d’approbation ne sont pas activées.

Il constitue le cadre commun des validations préalables lorsqu’un domaine source ne doit pas exécuter une action sensible directement.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- `content_editor` selon le type de demande
- certains approbateurs dédiés selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `approval.read`
- `approval.write`
- `audit.read`
- `roles.read`
- `permissions.read`
- `marketing.write`
- `events.publish`
- `catalog.publish`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `approval.requested`
- `approval.approved`
- `approval.rejected`
- `approval.returned_for_revision`
- `approval.policy.updated`
- `approval.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `product.updated`
- `marketing.campaign.created`
- `event.updated`
- `document.export.generated` dans certains cas de validation aval
- `store.capabilities.updated`
- certaines actions administratives structurées de soumission à approbation

Il doit toutefois rester maître de sa propre logique de validation préalable.

## Intégrations externes

Le domaine `approval` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être consulté par `integrations` ou par des workflows transverses pour savoir si une action externe est autorisée à partir d’une décision préalable, mais :

- la vérité de l’approbation reste dans `approval`
- les échanges provider-specific restent dans `integrations`
- l’exécution orchestrée reste dans `workflow` ou dans le domaine source concerné

## Données sensibles / sécurité

Le domaine `approval` manipule des décisions de gouvernance potentiellement sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre demandeur, approbateur et exécuteur
- protection des décisions, motifs et statuts sensibles
- traçabilité des approbations critiques
- limitation de l’exposition selon le rôle, le scope et la nature de la demande

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelle demande d’approbation est en cours
- quel acteur a soumis ou décidé
- quel statut est en vigueur
- pourquoi une approbation a été accordée, refusée ou renvoyée en révision
- si une action source reste bloquée à cause d’une absence d’approbation, d’un refus ou d’une politique applicable

### Audit

Il faut tracer :

- la création d’une demande d’approbation
- la décision d’approbation ou de refus
- les changements significatifs de politique d’approbation
- les approbations sensibles à fort impact
- certaines consultations sensibles si le modèle final les retient explicitement

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ApprovalRequest` : demande d’approbation structurée
- `ApprovalDecision` : décision prise sur la demande
- `ApprovalStatus` : état courant de la demande
- `ApprovalStage` : étape de validation si applicable
- `ApprovalPolicy` : règle d’approbation applicable
- `ApprovalActorRef` : référence vers le demandeur ou l’approbateur
- `ApprovalSubjectRef` : référence vers l’objet ou l’action soumis à approbation

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une demande d’approbation possède un identifiant stable et un statut explicite
- une décision d’approbation est rattachée à une demande explicite
- `approval` ne se confond pas avec `workflow`
- `approval` ne se confond pas avec `audit`
- `approval` ne se confond pas avec `permissions`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente d’approbation quand le cadre commun `approval` existe
- une action nécessitant approbation peut rester bloquée tant qu’aucune décision valable n’a été rendue

## Cas d’usage principaux

1. Soumettre une publication produit à approbation
2. Soumettre une campagne marketing à validation préalable
3. Soumettre un événement public à approbation avant publication
4. Refuser une action sensible avec motif explicite
5. Renvoyer une demande en révision
6. Fournir à `workflow` ou au domaine source une lecture fiable de l’état d’approbation applicable

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- demande d’approbation introuvable
- approbateur non autorisé
- décision invalide pour le statut courant
- politique d’approbation absente ou incohérente
- tentative d’exécuter une action encore en attente d’approbation
- permission ou scope insuffisant
- tentative d’exposition d’un détail sensible dans un contexte non autorisé

## Décisions d’architecture

Les choix structurants du domaine sont :

- `approval` porte les validations préalables gouvernées du socle
- `approval` est distinct de `workflow`
- `approval` est distinct de `audit`
- `approval` est distinct de `permissions`
- les domaines source délèguent la décision préalable à `approval` sans lui déléguer leur vérité métier complète
- les demandes, décisions et politiques sensibles doivent être observables et auditables
- l’exécution concrète après approbation reste hors du domaine `approval`

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les validations préalables gouvernées relèvent de `approval`
- l’orchestration d’exécution relève de `workflow`
- la traçabilité sensible relève de `audit`
- les permissions fines relèvent de `permissions`
- `approval` ne remplace ni `workflow`, ni `audit`, ni `permissions`, ni les domaines métier source
