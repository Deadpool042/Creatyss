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
- `users`
- `customers`
- `roles`
- `permissions`
- `feature-flags`

### 2. Commerce coeur

Ces domaines portent la logique e-commerce centrale.

- `products`
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

## Cartographie de référence

La cartographie officielle du socle est la suivante :

- `store`
- `users`
- `customers`
- `roles`
- `permissions`
- `feature-flags`
- `products`
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
