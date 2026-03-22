# Rôles et permissions

## Objectif

Ce document fixe le modèle d’accès du socle e-commerce premium+++.

Il définit :

- la séparation entre rôles plateforme et rôles boutique
- la place des permissions fines
- la différence entre rôle, permission et scope
- les accès attendus pour le créateur de la plateforme et pour l’exploitant d’une boutique

Le système ne repose pas sur un simple couple `admin/customer`.
Il doit permettre un contrôle fin, lisible, maintenable et sécurisé.

## Principes fondateurs

### 1. Un rôle ne suffit pas

Un rôle est un profil global, mais ce n’est pas l’unité de vérité finale.

Le système doit distinguer :

- le rôle
- la permission
- le scope
- éventuellement le niveau plateforme ou le niveau boutique

### 2. Les permissions sont la base réelle du contrôle

Un utilisateur n’agit pas parce qu’il « est admin ».
Il agit parce qu’il possède un ensemble de permissions explicites.

### 3. Il existe deux plans d’administration

Le socle distingue clairement :

- l’administration plateforme
- l’administration boutique

Cette séparation est obligatoire.

### 4. Les capacités profondes ne sont pas pilotées par la boutique

L’exploitant métier d’une boutique ne doit pas avoir accès par défaut :

- aux capabilities profondes
- au monitoring technique
- aux permissions avancées
- aux intégrations sensibles
- aux réglages plateforme

### 5. Toute action sensible doit être traçable

Les changements sur :

- permissions
- rôles
- capabilities
- intégrations
- publication critique
- prix
- promotions

Doivent être auditables.

## Concepts

### Rôle

Un rôle représente un profil fonctionnel global.

Exemples :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `catalog_manager`

### Permission

Une permission représente un droit précis sur une ressource/action.

Exemples :

- `catalog.read`
- `catalog.write`
- `orders.read`
- `orders.write`
- `audit.read`

### Scope

Le scope détermine où la permission s’applique.

Exemples :

- global plateforme
- boutique spécifique
- domaine spécifique
- ressource spécifique plus tard si nécessaire

## Modèle cible

### Rôles plateforme

Ces rôles donnent accès aux fonctions transverses, techniques et de gouvernance.

```ts
export type PlatformRole = "platform_owner" | "platform_engineer";
```

### Rôles boutique

Ces rôles donnent accès à l’exploitation métier d’une boutique.

```ts
export type StoreRole =
  | "store_owner"
  | "store_manager"
  | "catalog_manager"
  | "content_editor"
  | "order_manager"
  | "customer_support"
  | "marketing_manager"
  | "observer";
```

### Rôle client

```ts
export type CustomerRole = "customer";
```

### Rôle utilisateur global

```ts
export type UserRole = PlatformRole | StoreRole | CustomerRole;
```

## Rôle attendu par profil

### Créateur / mainteneur du socle

Profil attendu :

- `platform_owner` ou `platform_engineer`

Accès attendu :

- toutes les boutiques
- capabilities
- rôles
- permissions
- observability
- monitoring
- audit
- intégrations
- channels
- tracking
- documents électroniques
- sécurité et gouvernance

### Exploitant métier de la boutique

Profil attendu :

- `store_owner` ou `store_manager`

Accès attendu :

- catalogue
- contenu
- commandes
- clients
- campagnes autorisées
- événements boutique
- newsletters autorisées
- canaux autorisés selon configuration

Accès refusé par défaut :

- monitoring technique
- observability technique avancée
- modification de capabilities profondes
- gestion profonde des permissions
- intégrations sensibles
- configuration plateforme globale

## Modèle de permissions

Le modèle doit être orienté `ressource.action`.

## Exemples de permissions de référence

### Catalogue / contenu

- `catalog.read`
- `catalog.write`
- `catalog.publish`
- `categories.read`
- `categories.write`
- `media.read`
- `media.write`
- `pages.read`
- `pages.write`
- `blog.read`
- `blog.write`
- `blog.publish`

### Commerce

- `cart.read`
- `orders.read`
- `orders.write`
- `payments.read`
- `returns.read`
- `returns.write`
- `documents.read`
- `documents.write`

### Clients / CRM

- `customers.read`
- `customers.write`
- `crm.read`
- `crm.write`
- `subscriptions.read`
- `subscriptions.write`
- `newsletter.read`
- `newsletter.write`

### Marketing / conversion

- `marketing.read`
- `marketing.write`
- `conversion.read`
- `conversion.write`
- `discounts.read`
- `discounts.write`
- `pricing.read`

### Événements / social / diffusion

- `events.read`
- `events.write`
- `events.publish`
- `social.read`
- `social.write`
- `channels.read`
- `channels.write`

### Shipping / fiscalité / inventaire

- `inventory.read`
- `inventory.write`
- `shipping.read`
- `shipping.write`
- `taxation.read`
- `taxation.write`

### Pilotage / analyse

- `analytics.read`
- `attribution.read`
- `tracking.read`
- `tracking.write`
- `audit.read`
- `observability.read`
- `monitoring.read`
- `dashboarding.read`

### Gouvernance / plateforme

- `store.settings.read`
- `store.settings.write`
- `capabilities.read`
- `capabilities.write`
- `roles.read`
- `roles.write`
- `permissions.read`
- `permissions.write`
- `feature_flags.read`
- `feature_flags.write`
- `integrations.read`
- `integrations.write`
- `api_clients.read`
- `api_clients.write`
- `webhooks.read`
- `webhooks.write`

## Scope des permissions

Le modèle doit permettre au minimum trois niveaux de scope.

### 1. Scope plateforme

S’applique à toute la plateforme.

Exemples :

- gestion des rôles globaux
- monitoring technique
- observability globale
- capabilities globales
- intégrations sensibles

### 2. Scope boutique

S’applique à une boutique donnée.

Exemples :

- éditer le catalogue d’une boutique
- publier un article sur une boutique
- consulter les commandes d’une boutique

### 3. Scope domaine

Permet de limiter certains accès à un domaine précis dans une boutique ou à l’échelle plateforme.

Exemples :

- contenu seulement
- commandes seulement
- marketing seulement

## Matrice conceptuelle des rôles

### `platform_owner`

Peut :

- tout voir
- tout configurer
- gérer les capabilities
- gérer rôles et permissions
- voir audit / observability / monitoring
- piloter les intégrations
- gérer sécurité et gouvernance

### `platform_engineer`

Peut :

- superviser techniquement
- configurer intégrations et capabilities selon politique
- accéder audit / observability / monitoring
- gérer webhooks / api-clients / jobs
- intervenir sur les boutiques

Peut être plus restreint que `platform_owner` sur certaines gouvernances critiques si souhaité.

### `store_owner`

Peut :

- gérer la boutique métier
- voir commandes / catalogue / contenu / clients
- utiliser les fonctionnalités autorisées par capabilities
- gérer certains managers de boutique

Ne peut pas par défaut :

- modifier les capabilities profondes
- accéder au monitoring technique
- administrer les permissions globales

### `store_manager`

Peut :

- gérer l’exploitation quotidienne
- agir sur catalogue / commandes / contenu selon permissions allouées

### `catalog_manager`

Peut :

- gérer produits, catégories, médias liés au catalogue

### `content_editor`

Peut :

- gérer pages, blog, contenu éditorial

### `order_manager`

Peut :

- voir et traiter commandes, retours, états liés

### `customer_support`

Peut :

- voir clients, support, commandes utiles au support, CRM utile au support

### `marketing_manager`

Peut :

- gérer campagnes, discounts autorisées, newsletter, social, SEO utile au marketing, analytics métier

### `observer`

Peut :

- consulter certaines données sans écrire

### `customer`

Peut :

- accéder à son propre compte et à ses propres opérations côté boutique

## Règles de sécurité

### 1. Le rôle `admin` unique n’est pas retenu

Le modèle `admin/customer` est insuffisant.

### 2. Les actions sensibles doivent être explicitement protégées

Exemples :

- modification prix
- publication promo
- activation capability
- gestion permissions
- configuration intégration
- accès audit / monitoring / observability

### 3. Les permissions sensibles peuvent exiger approbation

Le socle doit pouvoir supporter des workflows d’approbation pour certaines actions critiques.

### 4. Les accès plateforme sont distincts des accès boutique

Un utilisateur peut avoir :

- un rôle plateforme
- et/ou un rôle sur une ou plusieurs boutiques

## Cas d’usage cibles

### Cas 1 — créateur du socle

Le créateur du socle doit pouvoir :

- accéder à toutes les boutiques
- activer/désactiver des capabilities
- voir monitoring / observability / audit
- gérer rôles, permissions, intégrations

### Cas 2 — exploitante de la boutique

L’exploitante métier doit pouvoir :

- gérer son catalogue
- gérer son contenu
- gérer ses commandes
- gérer ses clients
- gérer ses campagnes autorisées
- publier des événements autorisés

Sans accéder :

- aux réglages plateforme
- aux détails monitoring/observability techniques
- aux permissions globales

### Cas 3 — collaborateur contenu

Peut :

- éditer pages/blog/contenus

Ne peut pas :

- toucher catalogue/commandes/permissions

### Cas 4 — collaborateur commandes

Peut :

- traiter commandes/retours/support

Ne peut pas :

- modifier contenu, catalogue, capabilities

## Couplage avec les capabilities

Les permissions ne suffisent pas si la capability liée est désactivée.

Exemple :

- un utilisateur a `channels.write`
- mais `googleShopping = false`

Alors :

- il ne doit pas pouvoir publier vers Google Shopping
- l’interface liée ne doit pas être exposée
- le backend doit bloquer l’action

## Audit et observability

Toute modification sur :

- rôles
- permissions
- capabilities
- intégrations
- actions critiques métier

doit être :

- auditée
- corrélable côté observability si nécessaire

## Décisions closes

- le modèle `admin/customer` est abandonné
- les rôles plateforme et boutique sont distincts
- les permissions sont la base réelle du contrôle d’accès
- les capabilities profondes sont pilotées par l’espace technique plateforme
- l’espace boutique reste métier et non technique
- les actions critiques doivent être traçables
- le scope fait partie intégrante du modèle d’autorisation
