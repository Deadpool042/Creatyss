# Domaine blog

## Rôle

Le domaine `blog` porte les articles éditoriaux structurés du socle.

Il organise les articles, catégories éditoriales, états de publication et structures de contenu du blog de la boutique, sans absorber les pages éditoriales génériques, les événements publics, les médias, les templates réutilisables, le SEO transverse ou la logique UI de rendu.

## Responsabilités

Le domaine `blog` prend en charge :

- les articles de blog structurés
- les catégories ou taxonomies éditoriales du blog
- les états de brouillon, publication, archivage ou dépublication
- la structure éditoriale d’un article
- la lecture gouvernée des articles actifs ou en préparation
- la base de contenu blog consommable par le storefront, `seo`, `marketing`, `newsletter`, `social`, `dashboarding` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `blog` ne doit pas :

- porter les pages éditoriales génériques, qui relèvent de `pages`
- porter les événements publics, qui relèvent de `events`
- porter les médias source, qui relèvent de `media`
- porter les templates réutilisables, qui relèvent de `template-system`
- porter la logique de rendu UI applicative, qui relève des couches de présentation
- porter le SEO transverse complet, qui relève de `seo`
- devenir un CMS universel absorbant tous les autres domaines éditoriaux

Le domaine `blog` porte les articles éditoriaux structurés. Il ne remplace ni `pages`, ni `events`, ni `media`, ni `template-system`, ni `seo`.

## Sous-domaines

- `posts` : articles de blog structurés
- `categories` : catégories ou taxonomies éditoriales du blog
- `publication` : états de publication, archivage ou dépublication
- `policies` : règles d’exposition, d’édition ou de publication des articles

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour d’articles
- des changements de structure, contenu, taxonomie ou métadonnées d’un article
- des demandes de lecture d’un article ou d’une liste d’articles dans un contexte donné
- des demandes de publication, dépublication ou archivage
- des contextes de boutique, langue, audience, route ou canal d’exposition
- des demandes d’évaluation de l’état éditorial d’un article

## Sorties

Le domaine expose principalement :

- des articles de blog structurés
- des catégories éditoriales
- des états de publication d’article
- des lectures exploitables par le storefront, `seo`, `marketing`, `newsletter`, `social`, `dashboarding` et certaines couches d’administration
- des structures de contenu de blog prêtes à être rendues par les couches UI autorisées

## Dépendances vers autres domaines

Le domaine `blog` peut dépendre de :

- `media` pour référencer des ressources média utilisées dans les articles
- `template-system` pour certains gabarits ou structures réutilisables si le modèle retenu le prévoit
- `seo` pour certaines métadonnées ou règles d’exposition référentielle, sans absorber sa responsabilité
- `approval` si certaines publications d’articles nécessitent validation préalable
- `workflow` si le cycle de vie d’un article suit un processus structuré
- `audit` pour tracer certains changements sensibles d’article ou de publication
- `observability` pour expliquer pourquoi un article a été publié, filtré, archivé ou non exposé
- `store` pour le contexte boutique, langue ou politiques locales

Les domaines suivants peuvent dépendre de `blog` :

- `seo`
- `marketing`
- `newsletter`
- `social`
- `dashboarding`
- le storefront
- certaines couches d’administration

## Capabilities activables liées

Le domaine `blog` n’est pas une capability métier optionnelle au sens strict du noyau, mais il devient particulièrement important lorsque la boutique expose un contenu éditorial blog administrable.

Exemples de capabilities liées :

- `multiLanguage`
- `marketingCampaigns`
- `newsletter`
- `socialPublishing`

### Règle

Le domaine `blog` reste structurellement présent même si peu d’articles sont activement administrés.

Il constitue le cadre commun des contenus éditoriaux de type blog.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `content_editor`
- `marketing_manager` en lecture ou contribution partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `blog.read`
- `blog.write`
- `blog.publish`
- `media.read`
- `seo.read`
- `marketing.read`
- `newsletter.read`
- `social.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `blog.post.created`
- `blog.post.updated`
- `blog.post.published`
- `blog.post.unpublished`
- `blog.post.archived`
- `blog.category.updated`
- `blog.post.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `store.capabilities.updated`
- `approval.approved`
- `workflow.completed`
- certaines actions administratives structurées de publication ou de dépublication

Il doit toutefois rester maître de sa propre logique éditoriale d’article.

## Intégrations externes

Le domaine `blog` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut fournir du contenu à des domaines ou couches qui exposent ensuite ce contenu, mais :

- la vérité des articles internes reste dans `blog`
- les DTO providers externes restent dans `integrations`
- le rendu effectif reste dans les couches UI ou domaines consommateurs autorisés

## Données sensibles / sécurité

Le domaine `blog` peut manipuler des contenus non publiés, des brouillons ou des articles sensibles pour l’image et la cohérence de la boutique.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre brouillon, publié, archivé et dépublié
- protection des articles non publics
- limitation de l’exposition selon le rôle, le scope, la langue et le statut éditorial
- audit des changements significatifs de contenu, structure, taxonomie ou publication

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel article a été sélectionné dans un contexte donné
- quel statut éditorial est en vigueur
- quelles catégories ou variantes sont actives
- pourquoi un article a été publié, dépublié, archivé ou filtré
- si un article n’est pas exposé à cause d’un statut non publié, d’une capability off, d’un contexte non compatible ou d’une règle applicable

### Audit

Il faut tracer :

- la création d’un article
- la modification significative d’un article
- la publication ou la dépublication d’un article sensible
- les changements significatifs de taxonomie ou de structure
- certaines consultations sensibles si le modèle final les retient explicitement

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `BlogPost` : article de blog structuré
- `BlogCategory` : catégorie ou taxonomie éditoriale
- `BlogPostStatus` : état éditorial de l’article
- `BlogPostRoute` : route ou identifiant d’exposition de l’article
- `BlogPolicy` : règle d’exposition, d’édition ou de publication
- `BlogPostVariant` : variante d’article selon contexte, langue ou audience si le modèle final l’expose

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un article possède un identifiant stable, une route explicite et un statut explicite
- une catégorie éditoriale possède un identifiant stable et une signification explicite
- `blog` ne se confond pas avec `pages`
- `blog` ne se confond pas avec `events`
- `blog` ne se confond pas avec `media`
- `blog` ne se confond pas avec `template-system`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de contenu blog quand le cadre commun `blog` existe
- un article non publié ne doit pas être exposé hors règle explicite

## Cas d’usage principaux

1. Définir un article de blog administrable
2. Structurer et catégoriser un article
3. Publier ou dépublier un article
4. Exposer une liste d’articles ou un article public dans le storefront
5. Alimenter `seo`, `newsletter`, `social` ou `marketing` avec la lecture d’un article publié
6. Exposer à l’admin une lecture claire des articles, catégories et statuts disponibles

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- article introuvable
- route d’article invalide ou en conflit
- catégorie invalide ou incompatible
- article non publié ou archivé
- capability ou contexte non compatible
- tentative de lecture ou d’exposition non autorisée
- conflit entre plusieurs règles d’exposition ou de priorité

## Décisions d’architecture

Les choix structurants du domaine sont :

- `blog` porte les articles éditoriaux structurés du socle
- `blog` est distinct de `pages`
- `blog` est distinct de `events`
- `blog` est distinct de `media`
- `blog` est distinct de `template-system`
- les couches UI et domaines consommateurs lisent la vérité du blog via `blog`, sans la recréer localement
- les contenus, statuts et publications sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les articles de blog structurés relèvent de `blog`
- les pages éditoriales structurées relèvent de `pages`
- les événements publics relèvent de `events`
- les médias source relèvent de `media`
- les gabarits réutilisables relèvent de `template-system`
- `blog` ne remplace ni `pages`, ni `events`, ni `media`, ni `template-system`, ni `integrations`
