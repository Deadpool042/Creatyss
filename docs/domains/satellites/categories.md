# Domaine categories

## Rôle

Le domaine `categories` porte la taxonomie de navigation et de classement du catalogue.

Il définit la structure arborescente dans laquelle les produits sont classés, exposés et navigables côté storefront et côté administration boutique.

## Responsabilités

Le domaine `categories` prend en charge :

- les catégories de classification du catalogue
- la hiérarchie et l'arborescence des catégories
- les slugs et identifiants stables de catégories
- les statuts de visibilité des catégories
- les images représentatives des catégories
- la lecture catalogue des catégories côté storefront
- la gestion des catégories côté administration boutique

## Ce que le domaine ne doit pas faire

Le domaine `categories` ne doit pas :

- porter les produits eux-mêmes, ce qui relève de `products`
- décider de la vendabilité des produits dans une catégorie, ce qui relève de `sales-policy`
- porter la logique de recherche transverse, ce qui relève de `search`
- devenir un moteur CMS générique

Le domaine `categories` décrit la taxonomie de navigation. Il ne remplace ni `products`, ni `search`, ni `sales-policy`.

## Sous-domaines

Néant à ce stade. Le domaine `categories` est traité comme un domaine plat avec :

- une façade de lecture storefront (`category.repository.ts`)
- une façade d'administration boutique (`admin-category.repository.ts`)

## Entrées

Le domaine reçoit principalement :

- des créations de catégories
- des mises à jour de catégories
- des rattachements ou détachements d'images représentatives
- des changements de hiérarchie
- des changements de statut de visibilité
- des demandes de lecture de la taxonomie côté storefront et côté admin

## Sorties

Le domaine expose principalement :

- des catégories avec identifiant stable et slug
- une arborescence de catégories navigable
- des images représentatives
- des statuts de visibilité catalogue
- des listes de catégories exploitables par `products`, `search`, `seo` et le storefront

## Dépendances vers autres domaines

Le domaine `categories` peut dépendre de :

- `media` pour les images représentatives si les assets sont gérés centralement
- `audit` pour tracer les modifications significatives de la taxonomie
- `observability` pour diagnostiquer certaines incohérences de classement

Les domaines suivants peuvent dépendre de `categories` :

- `products` pour le classement catalogue
- `search` pour la navigation par catégorie
- `seo` pour les métadonnées des pages de catégorie
- `recommendations` pour la logique de produits liés par catégorie
- `analytics` pour les analyses de performance par catégorie

## Capabilities activables liées

- `advancedSeo` : permet d'enrichir les métadonnées des pages de catégorie
- `localization` : permet de traduire les libellés et contenus de catégorie

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `catalog_manager`

### Permissions

Exemples de permissions concernées :

- `categories.read`
- `categories.write`
- `catalog.read`
- `catalog.write`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `category.created`
- `category.updated`
- `category.published`
- `category.archived`

## Événements consommés

Le domaine `categories` ne consomme pas d'événements d'autres domaines dans l'état actuel.

## Intégrations externes

Le domaine `categories` ne parle pas directement aux systèmes externes.

Les diffusions éventuelles de la taxonomie vers des canaux externes relèvent de `channels` et `integrations`.

## Données sensibles / sécurité

Le domaine `categories` ne porte pas de données sensibles au sens sécurité strict.

Points de vigilance :

- contrôle des permissions d'écriture sur la taxonomie
- audit des modifications structurantes de la taxonomie

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelle catégorie est visible ou masquée à un instant donné
- pourquoi un produit n'apparaît pas dans une catégorie attendue

### Audit

Il faut tracer :

- la création et la modification des catégories
- les changements de hiérarchie significatifs
- la modification du statut de visibilité

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Category` : catégorie catalogue avec identifiant stable, slug, statut et hiérarchie
- `CategoryRepresentativeImage` : image représentative d'une catégorie

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une catégorie possède un identifiant stable
- un slug de catégorie doit être unique lorsqu'il est exposé publiquement
- le domaine `categories` reste la source de vérité de la taxonomie interne
- les autres domaines ne recréent pas leur propre taxonomie divergente

## Cas d'usage principaux

1. Créer une catégorie catalogue
2. Modifier une catégorie catalogue
3. Définir une image représentative pour une catégorie
4. Organiser la hiérarchie des catégories
5. Publier ou masquer une catégorie côté storefront
6. Lire la taxonomie côté storefront et côté admin

## Cas limites / erreurs métier

Quelques cas d'erreur typiques :

- catégorie introuvable
- slug déjà utilisé
- incohérence hiérarchique
- tentative de suppression d'une catégorie contenant des produits rattachés

## Décisions d'architecture

Les choix structurants du domaine sont :

- `categories` est un domaine de premier niveau distinct de `products`
- `categories` dispose de ses propres repositories dans `db/repositories/categories/`
- la taxonomie de navigation relève de `categories`, pas de `products`
- `categories` ne porte pas les produits eux-mêmes

## État actuel dans `db/repositories/`

Le domaine `categories` est implémenté dans `db/repositories/categories/` avec :

- `category.repository.ts` : façade publique de lecture storefront
- `category.types.ts` : types publics
- `admin-category.repository.ts` : façade d'administration boutique
- `admin-category.types.ts` : types publics admin
- `queries/` : lectures Prisma internes (`category.queries.ts`, `admin-category.queries.ts`)
- `helpers/` : helpers internes (`mappers.ts`, `validation.ts`)
- `types/` : types internes (`internal.ts`, `rows.ts`)

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la taxonomie de navigation relève de `categories`
- les produits relèvent de `products`
- `categories` n'est pas un sous-domaine de `products` dans l'implémentation actuelle
