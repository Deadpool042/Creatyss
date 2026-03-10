# Architecture V1

## Objectif

Poser une base V1 simple, maintenable et dockerisée pour la boutique Creatyss.

Cette V1 couvre uniquement :

- catalogue produits
- variantes couleur
- images liées aux variantes
- catégories
- blog
- homepage éditable
- admin simple
- uploads locaux
- SEO de base
- auth admin simple

## Principes

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker Compose en local
- séparation claire entre UI, métier, accès aux données et validation
- Server Components par défaut
- Client Components uniquement si nécessaire
- Server Actions seulement quand elles simplifient réellement le flux

## Structure cible

```text
app/
components/
features/
domain/
db/
lib/
public/
scripts/
```

## Rôle des dossiers

### `app/`

Contient les routes, layouts, pages, erreurs et points d’entrée HTTP de l’application.

Ne doit pas contenir :

- logique métier complexe
- accès direct à la base partout sans couche dédiée

### `components/`

Composants UI réutilisables.

Ne doit pas contenir :

- logique métier
- accès base
- validations métier profondes

### `features/`

Organisation par cas d’usage métier.

Exemples futurs :

- `features/products/`
- `features/categories/`
- `features/blog/`
- `features/homepage/`
- `features/admin/`

Contient en priorité :

- services métier
- formulaires
- actions ciblées
- logique applicative par domaine

### `domain/`

Types métier, règles métier pures, contrats et modèles conceptuels.

Ne doit pas contenir :

- UI
- dépendances framework inutiles
- logique de rendu

### `db/`

Schéma base de données, migrations, accès PostgreSQL, repositories.

Ne doit pas contenir :

- UI
- composants React

### `lib/`

Helpers techniques transverses :

- configuration
- auth
- utilitaires
- erreurs applicatives
- formatage générique

### `public/`

Assets publics.
Les uploads locaux pourront être servis via une stratégie simple en V1.

### `scripts/`

Scripts techniques utiles :

- seed
- initialisation locale
- maintenance de développement

## Séparation des responsabilités

### UI

Dans `components/` et `app/`.
La UI affiche et collecte les entrées utilisateur.
Elle ne porte pas la logique métier.

### Logique métier

Dans `features/` et `domain/`.
Elle applique les règles métier :

- gestion produit
- variantes couleur
- publication blog
- édition homepage

### Accès aux données

Dans `db/`.
Toute lecture/écriture PostgreSQL doit être centralisée.

### Validation

Schémas proches des cas d’usage dans `features/` ou dans un sous-dossier dédié.
La validation serveur est obligatoire.

### Admin

Routes sous `app/admin/`.
Expérience simple, claire, pensée pour une utilisatrice non technique.

### Front public

Routes publiques séparées des routes admin.
Aucune logique admin dans les pages publiques.

## Modèle de données V1

### `admins`

Utilisateurs d’administration.

Champs minimaux :

- `id`
- `email`
- `password_hash`
- `display_name`
- `is_active`
- `created_at`
- `updated_at`

Contraintes :

- `email` unique
- timestamps obligatoires

### `categories`

Catégories de sacs.

Champs minimaux :

- `id`
- `name`
- `slug`
- `description`
- `is_featured`
- `created_at`
- `updated_at`

Contraintes :

- `slug` unique

### `products`

Produit parent.

Champs minimaux :

- `id`
- `name`
- `slug`
- `short_description`
- `description`
- `status`
- `is_featured`
- `seo_title`
- `seo_description`
- `created_at`
- `updated_at`

Contraintes :

- `slug` unique
- `status` borné (`draft`, `published`)

### `product_categories`

Relation produit / catégorie.

Champs minimaux :

- `product_id`
- `category_id`

Contraintes :

- clé composite unique

### `product_variants`

Variantes par couleur.

Champs minimaux :

- `id`
- `product_id`
- `name`
- `color_name`
- `color_hex`
- `sku`
- `price`
- `compare_at_price`
- `is_default`
- `status`
- `created_at`
- `updated_at`

Contraintes :

- FK vers `products`
- `sku` unique si utilisé
- une variante par produit peut être marquée par défaut

### `product_images`

Images produit et images de variante.

Champs minimaux :

- `id`
- `product_id`
- `variant_id` nullable
- `file_path`
- `alt_text`
- `sort_order`
- `is_primary`
- `created_at`

Logique :

- image liée au produit parent si `variant_id` est `null`
- image liée à une variante si `variant_id` est renseigné
- une image primaire possible au niveau produit
- possibilité de définir l’image principale d’une variante

### `blog_posts`

Articles de blog.

Champs minimaux :

- `id`
- `title`
- `slug`
- `excerpt`
- `content`
- `cover_image_path`
- `status`
- `published_at`
- `seo_title`
- `seo_description`
- `created_at`
- `updated_at`

Contraintes :

- `slug` unique
- `status` borné (`draft`, `published`)

### `homepage_content`

Contenu structuré de la homepage.

Option V1 simple :
une seule table avec une ligne active.

Champs minimaux :

- `id`
- `hero_title`
- `hero_text`
- `hero_image_path`
- `editorial_title`
- `editorial_text`
- `featured_product_ids` ou relation dédiée plus tard
- `featured_category_ids` ou relation dédiée plus tard
- `featured_blog_post_ids` ou relation dédiée plus tard
- `status`
- `updated_at`

Contraintes :

- `status` borné (`draft`, `published`)

## Routes principales prévues

### Public

- `/`
- `/boutique`
- `/boutique/[slug]`
- `/categories/[slug]`
- `/blog`
- `/blog/[slug]`

### Admininistration

- `/admin`
- `/admin/login`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]`
- `/admin/categories`
- `/admin/categories/new`
- `/admin/categories/[id]`
- `/admin/blog`
- `/admin/blog/new`
- `/admin/blog/[id]`
- `/admin/homepage`

## Docker local

Le setup local devra inclure au minimum :

- un service `app`
- un service `db`

### `app`

Application Next.js en développement local via Docker.

### `db`

PostgreSQL avec volume persistant.

### Volumes

- volume persistant pour PostgreSQL
- volume local pour uploads si nécessaire en V1

### Lancement

Le projet doit être piloté via un `Makefile`.

Commande d’entrée cible :

```bash
make up
```

Le `Makefile` centralisera ensuite les commandes Docker et développement.

## Variables d’environnement minimales

- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `UPLOAD_DIR`

## Décisions V1

### Inclus

- base catalogue
- variantes couleur
- blog
- homepage éditable
- admin simple

### Exclus

- coupons complexes
- promos avancées
- recommandations sophistiquées
- IA
- analytics avancés
- multi-langue
- auth client
- paiement avancé

## Philosophie

Cette V1 doit rester :

- simple
- robuste
- lisible
- locale d’abord
- prête à évoluer sans refonte complète
