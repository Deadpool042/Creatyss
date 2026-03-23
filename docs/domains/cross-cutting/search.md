# Domaine search

## Rôle

Le domaine `search` porte la recherche structurée du socle.

Il organise les capacités de recherche, de filtrage, de facettisation, d’autocomplétion et de restitution de résultats sur les objets exposables de la boutique ou de l’administration, sans absorber les domaines source eux-mêmes, le catalogue, le blog, les pages, les événements, le SEO ou l’analytics.

## Responsabilités

Le domaine `search` prend en charge :

- les requêtes de recherche structurées
- les index ou vues de recherche au niveau métier
- les filtres et facettes de recherche
- l’autocomplétion ou les suggestions de recherche si le modèle retenu le prévoit
- les résultats de recherche classés selon des règles explicites
- la lecture gouvernée de ce qui est searchable dans un contexte donné
- la base de recherche consommable par le storefront, `products`, `pages`, `blog`, `events`, `dashboarding` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `search` ne doit pas :

- porter les produits publiés, qui relèvent de `products`
- porter les pages éditoriales, qui relèvent de `pages`
- porter les articles de blog, qui relèvent de `blog`
- porter les événements publics, qui relèvent de `events`
- porter le SEO transverse, qui relève de `seo`
- porter l’analytics de performance de recherche, qui relève de `analytics` ou `tracking`
- devenir un simple moteur technique opaque déconnecté du langage métier du socle

Le domaine `search` porte la recherche structurée du socle. Il ne remplace ni `products`, ni `pages`, ni `blog`, ni `events`, ni `seo`, ni `analytics`.

## Sous-domaines

- `queries` : requêtes de recherche structurées
- `results` : résultats de recherche restitués
- `facets` : filtres, facettes et contraintes de recherche
- `suggestions` : suggestions ou autocomplétion si le modèle final l’expose
- `policies` : règles d’indexation, de ranking, de visibilité ou d’exposition des résultats

## Entrées

Le domaine reçoit principalement :

- des objets source exposables issus de `products`, `pages`, `blog`, `events` ou d’autres domaines searchable
- des demandes de recherche structurée
- des paramètres de filtre, tri, facettisation, pagination ou contexte de recherche
- des demandes d’autocomplétion ou de suggestion
- des contextes de boutique, langue, audience, canal ou surface d’exposition
- des signaux internes utiles à l’indexabilité ou à la visibilité d’un objet dans la recherche

## Sorties

Le domaine expose principalement :

- des requêtes de recherche structurées
- des résultats de recherche classés
- des facettes, suggestions ou filtres applicables
- des lectures exploitables par le storefront, `products`, `pages`, `blog`, `events`, `dashboarding` et certaines couches d’administration
- des structures de recherche prêtes à être rendues par les couches UI autorisées

## Dépendances vers autres domaines

Le domaine `search` peut dépendre de :

- `products` pour certains objets catalogue exposables à la recherche
- `pages` pour certaines pages éditoriales exposables
- `blog` pour certains articles exposables
- `events` pour certains événements publics exposables
- `seo` pour certaines métadonnées ou règles de visibilité référentielle sans absorber sa responsabilité
- `stores` pour le contexte boutique, langue, audience ou politiques locales de recherche
- `audit` pour tracer certains changements sensibles de politique de recherche
- `observability` pour expliquer pourquoi un objet est searchable, filtré, masqué ou absent d’un résultat

Les domaines suivants peuvent dépendre de `search` :

- le storefront
- `dashboarding`
- certaines couches d’administration
- certains domaines catalogue ou éditoriaux ayant besoin d’une lecture transverse des résultats

## Capabilities activables liées

Le domaine `search` n’est pas une capability métier optionnelle au sens strict du noyau, mais il devient particulièrement important dès qu’une surface de recherche transverse est exposée.

Exemples de capabilities liées :

- `multiLanguage`
- `publicEvents`
- `bundles`

### Règle

Le domaine `search` reste structurellement présent même si la recherche exposée reste simple dans la V1.

Il constitue le cadre commun de recherche transverse sur les objets exposables du socle.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `content_editor` en lecture partielle selon la politique retenue
- `catalog_manager` en lecture partielle selon la politique retenue
- `customer` ou visiteur public côté storefront selon le scope public retenu

### Permissions

Exemples de permissions concernées :

- `search.read`
- `catalog.read`
- `pages.read`
- `blog.read`
- `events.read`
- `seo.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `search.query.executed`
- `search.result.generated`
- `search.indexability.changed`
- `search.policy.updated`
- `search.suggestion.generated`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `product.published`
- `page.published`
- `blog.post.published`
- `event.published`
- `seo.metadata.updated`
- `store.capabilities.updated`
- certaines actions administratives structurées de mise à jour de visibilité ou de politique de recherche

Il doit toutefois rester maître de sa propre logique de recherche structurée.

## Intégrations externes

Le domaine `search` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être appuyé techniquement par `integrations` ou par une infrastructure de recherche externe, mais :

- la vérité de la recherche métier interne reste dans `search`
- les DTO providers externes restent dans `integrations`
- les objets source restent dans leurs domaines respectifs

## Données sensibles / sécurité

Le domaine `search` manipule des règles de visibilité et de restitution qui peuvent exposer ou masquer des objets sensibles selon le contexte.

Points de vigilance :

- contrôle strict des droits de lecture selon le contexte public ou admin
- séparation claire entre objet source, indexabilité, visibilité et restitution de résultat
- protection des objets non publiés, non exposables ou non autorisés
- limitation de l’exposition selon le rôle, le scope, la langue et le canal
- audit des changements significatifs de politique de recherche ou de visibilité

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelle requête a été exécutée
- quels filtres ou facettes ont été appliqués
- pourquoi un objet apparaît, est masqué ou est absent d’un résultat
- quelle politique de recherche ou de visibilité est en vigueur
- si un objet n’est pas searchable à cause d’un statut non publié, d’une capability off, d’un contexte non compatible ou d’une règle applicable

### Audit

Il faut tracer :

- les changements significatifs de politique de recherche
- les modifications sensibles de visibilité ou d’indexabilité
- certaines consultations sensibles si le modèle final les retient explicitement
- certaines modifications manuelles importantes de règles de filtre, facette ou ranking

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `SearchQuery` : requête de recherche structurée
- `SearchResultItem` : résultat individuel restitué
- `SearchResultSet` : ensemble ordonné de résultats
- `SearchFacet` : facette ou filtre applicable
- `SearchSuggestion` : suggestion ou autocomplétion
- `SearchPolicy` : règle d’indexation, de ranking ou d’exposition
- `SearchSubjectRef` : référence vers l’objet source searchable

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un résultat de recherche est rattaché à un objet source explicite
- une politique de recherche possède une signification explicite
- `search` ne se confond pas avec `products`
- `search` ne se confond pas avec `pages`
- `search` ne se confond pas avec `blog`
- `search` ne se confond pas avec `events`
- `search` ne se confond pas avec `seo`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de recherche transverse quand le cadre commun `search` existe
- un objet non exposable ou non autorisé ne doit pas être restitué hors règle explicite

## Cas d’usage principaux

1. Rechercher un produit, une page, un article ou un événement public
2. Filtrer les résultats par facette ou catégorie
3. Proposer une autocomplétion ou une suggestion de recherche
4. Exposer des résultats classés dans le storefront
5. Fournir à l’admin une lecture transverse des objets trouvables dans un contexte donné
6. Maintenir une cohérence de visibilité et de restitution des objets exposables

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- requête de recherche invalide
- filtre ou facette incompatible
- contexte de recherche non autorisé
- objet source introuvable ou non searchable
- tentative d’exposition d’un résultat non autorisé
- permission ou scope insuffisant
- conflit entre plusieurs règles de visibilité, de ranking ou de facettisation

## Décisions d’architecture

Les choix structurants du domaine sont :

- `search` porte la recherche transverse structurée du socle
- `search` est distinct de `products`
- `search` est distinct de `pages`
- `search` est distinct de `blog`
- `search` est distinct de `events`
- `search` est distinct de `seo`
- les couches UI et domaines consommateurs lisent la vérité de recherche via `search`, sans la recréer localement
- les règles de visibilité, de facettisation et de ranking sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la recherche transverse structurée relève de `search`
- les produits publiés relèvent de `products`
- les pages éditoriales relèvent de `pages`
- les articles de blog relèvent de `blog`
- les événements publics relèvent de `events`
- la structuration SEO relève de `seo`
- `search` ne remplace ni `products`, ni `pages`, ni `blog`, ni `events`, ni `seo`, ni `integrations`, ni `analytics`
