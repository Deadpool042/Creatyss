# Cartographie des domaines du socle

## Objectif

Ce document fixe la cartographie des domaines du socle e-commerce premium+++.

Il définit :

- les domaines de référence
- leur regroupement logique
- leur rôle global dans l’architecture
- les grandes frontières entre eux

Ce document sert de base de lecture transversale avant les fiches détaillées par domaine.

## Regroupement des domaines

Le socle est structuré en plusieurs familles cohérentes.

### 1. Plateforme / configuration

Ces domaines portent l’identité, la gouvernance, la configuration et l’accès.

- `store`
- `auth`
- `users`
- `customers`
- `roles`
- `permissions`
- `feature-flags`

### 2. Commerce coeur

Ces domaines portent la logique e-commerce centrale.

- `products`
- `categories`
- `inventory`
- `sales-policy`
- `channels`
- `cart`
- `shipping`
- `discounts`
- `taxation`
- `pricing`
- `checkout`
- `orders`
- `payments`
- `returns`
- `documents`

### 3. Croissance / relation client

Ces domaines portent l’animation commerciale, la relation client et la diffusion relationnelle.

- `marketing`
- `conversion`
- `crm`
- `notifications`
- `subscriptions`
- `newsletter`
- `events`
- `social`

### 4. Mesure / conformité / pilotage

Ces domaines portent la mesure, la traçabilité, la compréhension et la conformité.

- `domain-events`
- `tracking`
- `behavior`
- `consent`
- `analytics`
- `attribution`
- `observability`
- `monitoring`
- `audit`

### 5. Expérience / contenu / international

Ces domaines portent l’expérience, le contenu et l’adaptation internationale.

- `search`
- `recommendations`
- `seo`
- `legal`
- `localization`
- `media`
- `pages`
- `blog`
- `email`

### 6. Intégrations / exploitation

Ces domaines portent les connexions externes, les traitements asynchrones et l’exploitation avancée.

- `integrations`
- `jobs`
- `import`
- `export`
- `support`
- `fulfillment`
- `workflow`
- `approval`
- `scheduling`
- `webhooks`
- `api-clients`
- `loyalty`
- `gift-cards`
- `gifting`
- `fraud-risk`
- `bundles`
- `catalog-modeling`
- `dashboarding`
- `template-system`

## Vue synthétique par domaine

### Plateforme / configuration

#### `store`

Profil et configuration globale de la boutique.

#### `auth`

Authentification humaine structure du socle.

#### `users`

Comptes d’accès et identité technique.

#### `customers`

Clients métier et profils commerciaux.

#### `roles`

Rôles globaux de plateforme et de boutique.

#### `permissions`

Droits fins par action, ressource et scope.

#### `feature-flags`

Activation progressive indépendante des capabilities.

### Commerce coeur

#### `products`

Catalogue source.

#### `categories`

Taxonomie de navigation et de classement du catalogue.

#### `inventory`

Disponibilité quantitative.

#### `sales-policy`

Vendabilité contextuelle.

#### `channels`

Diffusion catalogue externe.

#### `cart`

Panier pur.

#### `shipping`

Livraison.

#### `discounts`

Remises, promotions, coupons.

#### `taxation`

Fiscalité, taxes, accises.

#### `pricing`

Orchestration monétaire.

#### `checkout`

Validation finale avant commande.

#### `orders`

Commande figée.

#### `payments`

Paiement.

#### `returns`

Retours et SAV.

#### `documents`

Documents commerciaux et fiscaux.

### Croissance / relation client

#### `marketing`

Campagnes et animation commerciale.

#### `conversion`

Mécaniques de conversion.

#### `crm`

Relation client enrichie.

#### `notifications`

Notifications in-app et email.

#### `subscriptions`

Abonnements aux sujets.

#### `newsletter`

Listes et campagnes newsletter.

#### `events`

Événements publics / marchés / inscriptions / réservations.

#### `social`

Publication et diffusion sociale.

### Mesure / conformité / pilotage

#### `domain-events`

Événements internes structurés.

#### `tracking`

Pixels, tags, tracking server-side.

#### `behavior`

Faits d’interaction utilisateur.

#### `consent`

Consentements et activation conditionnelle.

#### `analytics`

Lecture business agrégée.

#### `attribution`

Origine et rattachement marketing.

#### `observability`

Compréhension détaillée du comportement métier/technique.

#### `monitoring`

Surveillance opérationnelle.

#### `audit`

Traçabilité des actions et décisions.

### Expérience / contenu / international

#### `search`

Recherche et découverte.

#### `recommendations`

Produits liés, upsell, cross-sell.

#### `seo`

SEO transverse.

#### `legal`

Textes juridiques et acceptations.

#### `localization`

Langues, traductions, formats.

#### `media`

Assets médias.

#### `pages`

Pages éditoriales/CMS.

#### `blog`

Contenu éditorial blog.

#### `email`

Email transverse et templates.

### Intégrations / exploitation

#### `integrations`

Adaptateurs externes.

#### `jobs`

Traitements asynchrones métier.

#### `import`

Entrée de données.

#### `export`

Sortie de données.

#### `support`

Support client et tickets.

#### `fulfillment`

Exécution logistique.

#### `workflow`

États et transitions de publication / traitement.

#### `approval`

Demandes et validations sensibles.

#### `scheduling`

Planification temporelle.

#### `webhooks`

Événements sortants exposés.

#### `api-clients`

Clés API et accès applicatifs externes.

#### `loyalty`

Fidélité.

#### `gift-cards`

Cartes cadeaux.

#### `gifting`

Options cadeau.

#### `fraud-risk`

Risque et signaux fraude.

#### `bundles`

Lots et packs.

#### `catalog-modeling`

Modélisation structurée du catalogue.

#### `dashboarding`

Vues synthétiques métier et techniques.

#### `template-system`

Système transverse de templates.

## Frontières structurantes

## `auth` vs `users`

- `auth` authentifie
- `users` porte les comptes humains internes

## `products` vs `categories`

- `products` porte les produits du catalogue
- `categories` porte la taxonomie de classement et de navigation

## `products` vs `inventory`

- `products` décrit le catalogue
- `inventory` décrit la disponibilité quantitative

## `products` vs `sales-policy`

- `products` décrit
- `sales-policy` décide si c’est vendable dans un contexte donné

## `cart` vs `pricing`

- `cart` porte le panier
- `pricing` calcule les montants estimés

## `cart` vs `shipping`

- `cart` consomme une décision de livraison
- `shipping` décide méthodes, zones, quotes et sélection

## `cart` vs `discounts`

- `cart` porte les lignes
- `discounts` décide les remises applicables

## `checkout` vs `orders`

- `checkout` valide
- `orders` fige

## `documents` vs `integrations`

- `documents` produit les objets documentaires internes
- `integrations` parle aux systèmes externes comme EBP ou Chorus Pro

## `domain-events` vs `events`

- `domain-events` = événements internes du système
- `events` = événements publics / marchés / inscriptions / réservations

## `tracking` vs `analytics`

- `tracking` capture et dispatch
- `analytics` restitue et agrège

## `observability` vs `monitoring`

- `observability` explique
- `monitoring` surveille

## `roles` vs `permissions`

- `roles` regroupent des profils
- `permissions` définissent les droits réels

## `feature-flags` vs capabilities

- `feature-flags` pilotent un rollout
- les capabilities pilotent ce qu’une boutique peut réellement activer

## Règles de découpage

- un domaine ne doit pas devenir un point d’agrégation de tout ce qui l’entoure
- un domaine doit avoir une responsabilité centrale lisible
- un domaine peut consommer d’autres domaines, sans absorber leur logique
- les intégrations externes ne doivent jamais dicter le modèle interne
- les comportements activables doivent être pilotés par `store` et les capabilities
- les traitements différés doivent passer par `jobs`
- les événements internes doivent passer par `domain-events`

## Façades de lecture agrégées (distinctes des domaines métier)

Certains points d’entrée de lecture storefront agrègent plusieurs domaines métier sous-jacents sans constituer eux-mêmes un domaine métier autonome. Ils ne doivent pas être documentés comme domaines métier.

### `catalog` — façade de lecture storefront

`catalog` est une façade de lecture agrégée storefront. Elle expose des lectures publiques sur `homepage`, `categories`, `products` et `blog`.

État actuel :

- `db/repositories/products/catalog/` est un dossier vide (placeholder) dans la structure actuelle du code
- la façade de lecture storefront est assurée par `db/repositories/products/public/product.repository.ts` et les repositories du domaine `categories`
- `catalog` ne constitue pas un domaine métier autonome et ne figure pas dans la cartographie de référence des domaines

La doctrine complète sur cette distinction est dans `docs/v21/doctrine.md`.

## État actuel de `db/repositories/`

Chaque domaine de la cartographie dispose d'un dossier dédié dans `db/repositories/`. La structure interne de chaque domaine suit le modèle V21 (façades `*.repository.ts`, sous-dossiers `queries/`, `helpers/`, `types/`).

Points notables de l'état actuel :

- `categories` : domaine de premier niveau avec ses propres repositories (`category.repository.ts`, `admin-category.repository.ts`) dans `db/repositories/categories/`
- `products` : domaine structuré avec `admin/` (sous-domaines product, variant, image, deliverable, pattern), `public/`, et des dossiers partagés (`helpers/`, `queries/`, `types/`)
- `cart` : domaine structuré avec sous-domaines (`core/`, `guest/`, `customer/`, `checkout/`, `discounts/`, `pricing/`, `shipping/`, `taxation/`, `merge/`, `capabilities/`)
- `orders` : dossier `db/repositories/orders/` avec `order.repository.ts` et `order.types.ts` comme façades publiques
- `auth` : domaine avec schéma Prisma propre (`prisma/auth.prisma`) mais sans repository dédié dans `db/repositories/` à ce stade
- `users` : inclut `role.repository.ts` et `admin-user.repository.ts` en plus de `user.repository.ts`
- `email` : inclut `newsletter.repository.ts`, `email-template.repository.ts`, `order-email.repository.ts`

Les dossiers vides (`products/catalog/`, `products/categories/`, `products/images/`, `products/variants/`, `products/deliverables/`, `products/publication/`, `users/accounts/`) sont des placeholders structurels non encore peuplés.

## Cartographie de référence

La cartographie officielle du socle est la suivante :

- `store`
- `auth`
- `users`
- `customers`
- `roles`
- `permissions`
- `feature-flags`
- `products`
- `categories`
- `inventory`
- `sales-policy`
- `channels`
- `cart`
- `shipping`
- `discounts`
- `taxation`
- `pricing`
- `checkout`
- `orders`
- `payments`
- `returns`
- `documents`
- `marketing`
- `conversion`
- `crm`
- `notifications`
- `subscriptions`
- `newsletter`
- `events`
- `social`
- `domain-events`
- `tracking`
- `behavior`
- `consent`
- `analytics`
- `attribution`
- `observability`
- `monitoring`
- `audit`
- `search`
- `recommendations`
- `seo`
- `legal`
- `localization`
- `integrations`
- `jobs`
- `import`
- `export`
- `support`
- `fulfillment`
- `workflow`
- `approval`
- `scheduling`
- `webhooks`
- `api-clients`
- `loyalty`
- `gift-cards`
- `gifting`
- `fraud-risk`
- `bundles`
- `catalog-modeling`
- `dashboarding`
- `template-system`
- `media`
- `pages`
- `blog`
- `email`

## Finalité

Cette cartographie a pour but de :

- garder une architecture lisible
- éviter les domaines monolithiques
- rendre le socle réutilisable
- permettre des activations sélectives par boutique
- préparer une exploitation métier simple et une exploitation technique avancée
