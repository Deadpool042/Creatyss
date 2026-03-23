# Domaine media

## Rôle

Le domaine `media` porte les ressources média structurées du socle.

Il organise les images, fichiers, variants, métadonnées et usages médias nécessaires aux contenus, au catalogue, aux pages, au blog, aux événements et à d’autres domaines consommateurs, sans absorber la logique éditoriale des domaines source, le rendu UI, les templates réutilisables ou une intégration provider-specific de stockage externe.

## Responsabilités

Le domaine `media` prend en charge :

- les ressources média structurées
- les images, fichiers et autres actifs médias gérés par le socle
- les métadonnées médias
- les variantes ou dérivés média si le modèle retenu le prévoit
- les rattachements ou références de médias à des objets métier consommateurs
- la lecture gouvernée des médias actifs, archivés ou non exposables
- la base média consommable par `products`, `pages`, `blog`, `events`, `marketing`, `template-system`, `seo` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `media` ne doit pas :

- porter le catalogue produit, qui relève de `products`
- porter les pages éditoriales, qui relèvent de `pages`
- porter les articles de blog, qui relèvent de `blog`
- porter les événements publics, qui relèvent de `events`
- porter les templates réutilisables, qui relèvent de `template-system`
- porter le rendu UI applicatif, qui relève des couches de présentation
- devenir un DAM universel ou un système de stockage externe provider-specific absorbant toute la logique d’intégration

Le domaine `media` porte les ressources média structurées du socle. Il ne remplace ni `products`, ni `pages`, ni `blog`, ni `events`, ni `template-system`, ni `integrations`.

## Sous-domaines

- `assets` : ressources média structurées
- `variants` : variantes, formats ou dérivés média
- `metadata` : métadonnées descriptives, techniques ou éditoriales
- `references` : rattachements logiques entre médias et objets consommateurs
- `policies` : règles d’exposition, de conservation, d’édition ou d’archivage des médias

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour de ressources média
- des demandes de lecture d’un média ou d’un ensemble de médias
- des changements de métadonnées, de statut ou de rattachement
- des demandes de génération ou de gestion de variantes média si le modèle final l’expose
- des contextes de boutique, langue, usage, canal, audience ou objet consommateur
- des demandes d’évaluation de l’état ou de l’exposabilité d’un média

## Sorties

Le domaine expose principalement :

- des médias structurés
- des métadonnées média
- des variantes ou dérivés média
- des références vers les objets consommateurs
- des lectures exploitables par `products`, `pages`, `blog`, `events`, `marketing`, `template-system`, `seo`, `dashboarding` et certaines couches d’administration
- des structures média prêtes à être utilisées par les couches UI ou domaines consommateurs autorisés

## Dépendances vers autres domaines

Le domaine `media` peut dépendre de :

- `stores` pour le contexte boutique, langue, branding ou politiques locales
- `approval` si certaines publications ou utilisations de médias nécessitent validation préalable
- `workflow` si le cycle de vie d’un média suit un processus structuré
- `audit` pour tracer certains changements sensibles de média, de référence ou de statut
- `observability` pour expliquer pourquoi un média a été retenu, filtré, archivé ou non exposé

Les domaines suivants peuvent dépendre de `media` :

- `products`
- `pages`
- `blog`
- `events`
- `marketing`
- `template-system`
- `seo`
- `dashboarding`
- le storefront
- certaines couches d’administration

## Capabilities activables liées

Le domaine `media` n’est pas une capability métier optionnelle au sens strict du noyau, mais il devient particulièrement important dès qu’un contenu visuel ou fichier administrable est utilisé dans la boutique.

Exemples de capabilities liées :

- `marketingCampaigns`
- `publicEvents`
- `multiLanguage`
- `socialPublishing`

### Règle

Le domaine `media` reste structurellement présent même si peu de ressources média sont activement administrées.

Il constitue le cadre commun des actifs médias internes du socle.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `content_editor`
- `catalog_manager`
- `marketing_manager` en lecture ou contribution partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `media.read`
- `media.write`
- `catalog.read`
- `pages.read`
- `blog.read`
- `events.read`
- `marketing.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `media.asset.created`
- `media.asset.updated`
- `media.asset.archived`
- `media.asset.status.changed`
- `media.variant.generated`
- `media.reference.updated`
- `media.metadata.updated`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `store.capabilities.updated`
- `approval.approved`
- `workflow.completed`
- certaines actions administratives structurées de rattachement, d’archivage ou d’activation

Il doit toutefois rester maître de sa propre logique de gestion média.

## Intégrations externes

Le domaine `media` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être appuyé par `integrations` pour certains backends de stockage ou traitements externes, mais :

- la vérité des médias internes reste dans `media`
- les DTO providers externes restent dans `integrations`
- les domaines consommateurs lisent des références et métadonnées internes stabilisées

## Données sensibles / sécurité

Le domaine `media` peut manipuler des ressources non publiées, sensibles pour l’image de la boutique ou techniquement contraintes.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre média actif, brouillon, archivé ou non exposable selon le modèle retenu
- protection des médias non publics ou internes
- limitation de l’exposition selon le rôle, le scope, le statut et l’usage
- audit des changements significatifs de métadonnées, variantes, références ou archivage

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel média a été sélectionné ou rattaché à un objet donné
- quel statut média est en vigueur
- quelles variantes ou métadonnées sont actives
- pourquoi un média a été archivé, filtré ou non exposé
- si un média n’est pas disponible à cause d’un statut, d’une capability off, d’un contexte non compatible ou d’une règle applicable

### Audit

Il faut tracer :

- la création d’un média sensible
- la modification significative d’un média
- l’archivage ou la désactivation d’un média sensible
- les changements significatifs de métadonnées, de références ou de variantes
- certaines consultations sensibles si le modèle final les retient explicitement

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `MediaAsset` : ressource média structurée
- `MediaVariant` : variante ou dérivé média
- `MediaMetadata` : métadonnées descriptives, techniques ou éditoriales
- `MediaReference` : rattachement logique à un objet consommateur
- `MediaStatus` : état du média
- `MediaPolicy` : règle d’exposition, d’édition ou d’archivage

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un média possède un identifiant stable et un statut explicite
- une variante média est rattachée à une ressource explicite
- une référence média est rattachée à un média et à un objet consommateur explicites
- `media` ne se confond pas avec `products`
- `media` ne se confond pas avec `pages`
- `media` ne se confond pas avec `blog`
- `media` ne se confond pas avec `events`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de ressource média quand le cadre commun `media` existe
- un média non exposable ne doit pas être servi hors règle explicite

## Cas d’usage principaux

1. Gérer les images d’un produit ou de ses variantes
2. Gérer les visuels d’une page éditoriale ou d’un article de blog
3. Rattacher un média à un événement public
4. Exposer des références média utilisables par le storefront
5. Gérer des variantes ou dérivés média selon les besoins du modèle
6. Exposer à l’admin une lecture claire des médias, statuts, références et métadonnées disponibles

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- média introuvable
- variante invalide ou incompatible
- métadonnée invalide
- référence média incohérente ou orpheline
- média archivé, non exposable ou non accessible dans le contexte courant
- tentative de lecture ou d’exposition non autorisée
- conflit entre plusieurs règles d’usage ou d’exposition

## Décisions d’architecture

Les choix structurants du domaine sont :

- `media` porte les ressources média structurées du socle
- `media` est distinct de `products`
- `media` est distinct de `pages`
- `media` est distinct de `blog`
- `media` est distinct de `events`
- `media` est distinct de `template-system`
- les domaines consommateurs lisent la vérité média via `media`, sans la recréer localement
- les ressources, variantes, références et métadonnées sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les ressources média structurées relèvent de `media`
- le catalogue produit relève de `products`
- les pages éditoriales relèvent de `pages`
- les articles de blog relèvent de `blog`
- les événements publics relèvent de `events`
- les gabarits réutilisables relèvent de `template-system`
- `media` ne remplace ni `products`, ni `pages`, ni `blog`, ni `events`, ni `template-system`, ni `integrations`
