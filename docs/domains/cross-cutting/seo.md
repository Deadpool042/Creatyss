# Domaine seo

## Rôle

Le domaine `seo` porte la structuration SEO du socle.

Il organise les métadonnées de référencement, les règles d’indexation, les canoniques, les signaux d’exposition référentielle et la cohérence SEO transverse des objets publiés, sans absorber les contenus source eux-mêmes, les pages, le blog, le catalogue, le tracking ou l’analytics.

## Responsabilités

Le domaine `seo` prend en charge :

- les métadonnées SEO structurées
- les titres SEO, descriptions SEO et autres attributs référentiels utiles
- les règles d’indexation ou de non-indexation
- les URLs canoniques et signaux de canonicalisation
- la cohérence SEO des objets exposés publiquement
- la lecture gouvernée de l’état SEO applicable à un objet donné
- la base SEO consommable par `pages`, `blog`, `products`, `events`, `marketing`, `dashboarding` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `seo` ne doit pas :

- porter les pages éditoriales, qui relèvent de `pages`
- porter les articles de blog, qui relèvent de `blog`
- porter le catalogue produit, qui relève de `products`
- porter les événements publics, qui relèvent de `events`
- porter le tracking ou l’analyse de performance SEO, qui relèvent de `tracking`, `analytics` ou `attribution`
- porter la logique de rendu UI applicative, qui relève des couches de présentation
- devenir un CMS éditorial parallèle ou un simple sac de champs dispersés sans langage métier commun

Le domaine `seo` porte la structuration référentielle transverse. Il ne remplace ni `pages`, ni `blog`, ni `products`, ni `events`, ni `analytics`.

## Sous-domaines

- `metadata` : métadonnées SEO structurées
- `indexing` : règles d’indexation, d’exclusion ou de non-indexation
- `canonical` : règles et URLs canoniques
- `policies` : règles globales d’exposition référentielle et de cohérence SEO

## Entrées

Le domaine reçoit principalement :

- des objets source publiables issus de `pages`, `blog`, `products`, `events` ou d’autres domaines exposables
- des créations ou mises à jour de métadonnées SEO
- des demandes de lecture de l’état SEO d’un objet donné
- des changements de politique d’indexation, de canonicalisation ou d’exposition
- des contextes de boutique, langue, route, audience ou exposition publique
- des demandes d’évaluation de l’état SEO applicable à une ressource publique

## Sorties

Le domaine expose principalement :

- des métadonnées SEO structurées
- des règles d’indexation ou de non-indexation
- des URLs canoniques ou signaux de canonicalisation
- des lectures exploitables par `pages`, `blog`, `products`, `events`, `marketing`, `dashboarding` et certaines couches d’administration
- des structures SEO prêtes à être utilisées par les couches UI ou domaines consommateurs autorisés

## Dépendances vers autres domaines

Le domaine `seo` peut dépendre de :

- `pages` pour certaines pages éditoriales exposées publiquement
- `blog` pour certains articles publiés
- `products` pour certains objets catalogue exposés publiquement
- `events` pour certains événements publics exposés publiquement
- `stores` pour le contexte boutique, langue, domaine ou politiques locales
- `approval` si certaines publications SEO sensibles nécessitent validation préalable
- `workflow` si certaines modifications SEO suivent un processus structuré
- `audit` pour tracer certains changements sensibles de métadonnées ou de politiques SEO
- `observability` pour expliquer pourquoi un objet est indexable, non indexable, canonique ou filtré

Les domaines suivants peuvent dépendre de `seo` :

- `pages`
- `blog`
- `products`
- `events`
- `marketing`
- `dashboarding`
- le storefront
- certaines couches d’administration

## Capabilities activables liées

Le domaine `seo` n’est pas une capability métier optionnelle au sens strict du noyau, mais il devient particulièrement important dès qu’un contenu public indexable existe dans la boutique.

Exemples de capabilities liées :

- `multiLanguage`
- `publicEvents`
- `marketingCampaigns`

### Règle

Le domaine `seo` reste structurellement présent même si peu d’objets publics sont activement optimisés.

Il constitue le cadre commun de cohérence référentielle pour les objets exposés publiquement.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `content_editor`
- `marketing_manager`
- `catalog_manager` en lecture ou contribution partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `seo.read`
- `seo.write`
- `pages.read`
- `blog.read`
- `catalog.read`
- `events.read`
- `marketing.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `seo.metadata.updated`
- `seo.indexing.updated`
- `seo.canonical.updated`
- `seo.policy.updated`
- `seo.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `page.published`
- `blog.post.published`
- `product.published`
- `event.published`
- `store.capabilities.updated`
- `approval.approved`
- `workflow.completed`
- certaines actions administratives structurées de publication ou de modification SEO

Il doit toutefois rester maître de sa propre logique de structuration SEO.

## Intégrations externes

Le domaine `seo` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut fournir des structures SEO à des couches ou flux d’exposition publique, mais :

- la vérité SEO interne reste dans `seo`
- les DTO providers externes restent dans `integrations`
- la mesure de performance SEO reste hors du domaine `seo`

## Données sensibles / sécurité

Le domaine `seo` manipule des règles d’exposition publique qui peuvent être sensibles pour l’image, la visibilité ou la cohérence de la boutique.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre objet source, métadonnée SEO et exposition publique effective
- protection des objets non publiés ou non indexables
- limitation de l’exposition selon le rôle, le scope, la langue et le statut public
- audit des changements significatifs de métadonnées, de canonicalisation ou de politiques d’indexation

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel état SEO est appliqué à un objet donné
- quelle canonicalisation est en vigueur
- quelle règle d’indexation s’applique
- pourquoi un objet est indexable, non indexable ou filtré
- si un objet n’est pas exposé ou indexable à cause d’un statut non publié, d’une capability off, d’un contexte non compatible ou d’une règle applicable

### Audit

Il faut tracer :

- la modification significative d’une métadonnée SEO sensible
- la modification d’une règle d’indexation ou de canonicalisation
- certaines consultations sensibles si le modèle final les retient explicitement
- certaines modifications manuelles importantes de politique SEO

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `SeoMetadata` : métadonnées SEO structurées
- `SeoIndexingRule` : règle d’indexation ou de non-indexation
- `SeoCanonicalRef` : référence ou URL canonique
- `SeoPolicy` : règle globale de cohérence ou d’exposition référentielle
- `SeoStatus` : état SEO applicable à un objet donné
- `SeoSubjectRef` : référence vers l’objet source concerné

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une donnée SEO est rattachée à un objet source explicite
- une règle d’indexation possède une signification explicite
- `seo` ne se confond pas avec `pages`
- `seo` ne se confond pas avec `blog`
- `seo` ne se confond pas avec `products`
- `seo` ne se confond pas avec `events`
- `seo` ne se confond pas avec `analytics`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de structuration SEO quand le cadre commun `seo` existe
- un objet non publiable ou explicitement non indexable ne doit pas être exposé comme indexable hors règle explicite

## Cas d’usage principaux

1. Définir les métadonnées SEO d’une page ou d’un article
2. Définir qu’un objet public est indexable ou non indexable
3. Définir une URL canonique pour un objet exposé
4. Fournir aux couches UI la lecture SEO applicable à un objet public
5. Maintenir la cohérence référentielle entre plusieurs objets publiés
6. Exposer à l’admin une lecture claire des états SEO et politiques d’indexation

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- objet source introuvable
- métadonnée SEO invalide ou incohérente
- règle d’indexation invalide
- canonicalisation incompatible ou contradictoire
- objet non publié ou non exposable dans le contexte courant
- tentative de lecture ou d’exposition non autorisée
- conflit entre plusieurs règles SEO ou d’exposition

## Décisions d’architecture

Les choix structurants du domaine sont :

- `seo` porte la structuration référentielle transverse du socle
- `seo` est distinct de `pages`
- `seo` est distinct de `blog`
- `seo` est distinct de `products`
- `seo` est distinct de `events`
- `seo` est distinct de `analytics`
- les domaines consommateurs lisent la vérité SEO via `seo`, sans la recréer localement
- les métadonnées, règles d’indexation et canonicalisations sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la structuration SEO transverse relève de `seo`
- les pages éditoriales relèvent de `pages`
- les articles de blog relèvent de `blog`
- le catalogue produit relève de `products`
- les événements publics relèvent de `events`
- la mesure de performance relève de `tracking`, `analytics` ou `attribution` selon le besoin
- `seo` ne remplace ni `pages`, ni `blog`, ni `products`, ni `events`, ni `analytics`, ni `integrations`
