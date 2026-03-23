# Domaine template-system

## Rôle

Le domaine `template-system` porte les gabarits structurés réutilisables du socle.

Il organise les modèles de contenu, de messages, de mises en forme ou de compositions réutilisables par différents domaines, sans absorber la logique métier des domaines consommateurs, les contenus éditoriaux eux-mêmes, les notifications, la newsletter ou la diffusion sociale.

## Responsabilités

Le domaine `template-system` prend en charge :

- les templates structurés réutilisables
- les variantes de template selon le contexte, la langue ou le canal si le modèle retenu le prévoit
- les slots, sections ou paramètres d’un template
- les règles de sélection d’un template applicable
- la lecture gouvernée des templates actifs
- la base de gabarits consommable par `notifications`, `newsletter`, `social`, `marketing`, `events`, `pages`, `documents` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `template-system` ne doit pas :

- porter les contenus éditoriaux source, qui relèvent de `pages`, `blog`, `events` ou d’autres domaines source
- porter les notifications transactionnelles, qui relèvent de `notifications`
- porter les campagnes newsletter, qui relèvent de `newsletter`
- porter les publications sociales, qui relèvent de `social`
- porter les campagnes marketing, qui relèvent de `marketing`
- devenir un CMS générique ou un moteur de rendu total absorbant la logique UI et métier
- devenir un simple stockage de HTML arbitraire sans modèle structuré et gouverné

Le domaine `template-system` porte les gabarits réutilisables. Il ne remplace ni `notifications`, ni `newsletter`, ni `social`, ni `marketing`, ni les domaines de contenu source.

## Sous-domaines

- `definitions` : définitions de templates structurés
- `variants` : variantes de templates selon contexte, langue, canal ou usage
- `slots` : zones, paramètres ou emplacements configurables d’un template
- `selection` : règles de choix du template applicable
- `policies` : règles d’activation, de publication ou d’exposition des templates

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour de templates
- des demandes de lecture d’un template applicable dans un contexte donné
- des changements de variantes, de slots ou de paramètres
- des contextes de canal, langue, boutique, acteur ou domaine consommateur
- des demandes de publication, activation, désactivation ou archivage d’un template

## Sorties

Le domaine expose principalement :

- des templates structurés
- des variantes de template
- des sélections de template applicables à un contexte donné
- des lectures exploitables par `notifications`, `newsletter`, `social`, `marketing`, `events`, `pages`, `documents` et certaines couches d’administration
- des structures de gabarit prêtes à être alimentées par les domaines consommateurs autorisés

## Dépendances vers autres domaines

Le domaine `template-system` peut dépendre de :

- `store` pour certains contextes boutique, langue, branding ou politiques locales
- `approval` si certaines publications de templates nécessitent validation préalable
- `workflow` si le cycle de vie d’un template suit un processus structuré
- `audit` pour tracer certains changements sensibles de templates ou de publication
- `observability` pour expliquer pourquoi un template a été sélectionné, filtré, refusé ou non publié

Les domaines suivants peuvent dépendre de `template-system` :

- `notifications`
- `newsletter`
- `social`
- `marketing`
- `events`
- `pages`
- `documents`
- certaines couches storefront et d’administration

## Capabilities activables liées

Le domaine `template-system` n’est pas une capability métier optionnelle au sens strict du noyau, mais il devient particulièrement utile lorsque plusieurs canaux ou usages éditoriaux réutilisent des gabarits communs.

Exemples de capabilities liées :

- `newsletter`
- `notifications`
- `socialPublishing`
- `marketingCampaigns`
- `publicEvents`
- `multiLanguage`

### Règle

Le domaine `template-system` reste structurellement présent même si peu de gabarits partagés sont activés.

Il constitue le cadre commun de réutilisation des modèles quand un domaine consommateur ne doit pas porter seul toute la structure du rendu ou du message.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- `content_editor`
- certains opérateurs dédiés selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `template_system.read`
- `template_system.write`
- `marketing.read`
- `newsletter.read`
- `notifications.read`
- `social.read`
- `documents.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `template.created`
- `template.updated`
- `template.published`
- `template.archived`
- `template.variant.updated`
- `template.selection.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `store.capabilities.updated`
- `approval.approved`
- `workflow.completed`
- certaines actions administratives structurées de publication ou d’activation de template

Il doit toutefois rester maître de sa propre logique de définition et de sélection des gabarits.

## Intégrations externes

Le domaine `template-system` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut fournir des gabarits à des domaines qui parlent ensuite à des systèmes externes, mais :

- la vérité des templates internes reste dans `template-system`
- les DTO providers externes restent dans `integrations`
- l’envoi ou la diffusion effective restent dans les domaines consommateurs et leurs couches d’exécution dédiées

## Données sensibles / sécurité

Le domaine `template-system` peut manipuler des modèles de messages ou de contenus sensibles pour l’image, la conformité ou la cohérence de la boutique.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre template, contenu injecté et diffusion effective
- protection des variantes sensibles ou non publiées
- limitation de l’exposition selon le rôle, le scope et le statut du template
- audit des changements significatifs de structure, de publication ou de sélection

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel template a été sélectionné
- à partir de quel contexte de canal, langue ou usage
- quelles variantes ou slots ont été retenus
- pourquoi un template a été publié, filtré, archivé ou ignoré
- si une absence de sélection vient d’une capability off, d’un statut non publié, d’un contexte non compatible ou d’une règle applicable

### Audit

Il faut tracer :

- la création d’un template
- la modification significative d’un template
- la publication ou l’archivage d’un template sensible
- les changements significatifs de sélection ou de variante
- certaines consultations sensibles si le modèle final les retient explicitement

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `TemplateDefinition` : définition structurée d’un template
- `TemplateVariant` : variante applicable selon un contexte donné
- `TemplateSlot` : zone ou paramètre configurable du template
- `TemplateSelection` : résultat de sélection du template applicable
- `TemplatePolicy` : règle d’activation, de publication ou d’exposition
- `TemplateUsageRef` : référence vers le domaine ou l’usage consommateur

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un template possède un identifiant stable et un statut explicite
- une variante de template est rattachée à une définition explicite
- `template-system` ne se confond pas avec `notifications`
- `template-system` ne se confond pas avec `newsletter`
- `template-system` ne se confond pas avec `social`
- `template-system` ne se confond pas avec `marketing`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de gabarit réutilisable quand le cadre commun `template-system` existe
- un template non actif ou non publié ne doit pas être sélectionné hors règle explicite

## Cas d’usage principaux

1. Définir un template email transactionnel réutilisable
2. Définir un template newsletter avec variantes par langue
3. Définir un template de publication sociale réutilisable
4. Fournir à un domaine consommateur le template applicable dans un contexte donné
5. Publier ou archiver un template sensible
6. Exposer à l’admin une lecture claire des templates, variantes et statuts disponibles

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- template introuvable
- variante introuvable ou incompatible
- slot ou paramètre invalide
- capability ou canal non compatible
- template non publié ou archivé
- tentative de sélection ou d’exposition non autorisée
- conflit entre plusieurs règles de sélection ou de priorité

## Décisions d’architecture

Les choix structurants du domaine sont :

- `template-system` porte les gabarits structurés réutilisables du socle
- `template-system` est distinct de `notifications`
- `template-system` est distinct de `newsletter`
- `template-system` est distinct de `social`
- `template-system` est distinct de `marketing`
- les domaines consommateurs lisent la vérité des templates via `template-system`, sans la recréer localement
- les structures, variantes et politiques sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les gabarits réutilisables relèvent de `template-system`
- les notifications transactionnelles relèvent de `notifications`
- la diffusion newsletter relève de `newsletter`
- la diffusion sociale relève de `social`
- les campagnes marketing relèvent de `marketing`
- `template-system` ne remplace ni `notifications`, ni `newsletter`, ni `social`, ni `marketing`, ni `integrations`
