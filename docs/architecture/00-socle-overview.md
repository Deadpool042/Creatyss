# Socle e-commerce premium+++ — vue d’ensemble

## Objectif

Ce socle a pour objectif de fournir une base e-commerce réutilisable, modulaire, robuste, strictement typée et exploitable à haut niveau de qualité.

Il ne s’agit pas d’un site unique codé pour un seul besoin.
Il s’agit d’un socle capable d’alimenter plusieurs boutiques, avec des fonctionnalités activables selon le contexte métier du projet.

Le socle doit permettre :

- une exploitation simple côté boutique
- une administration technique avancée côté créateur / plateforme
- une séparation nette des responsabilités métier
- une évolutivité forte sans transformer le code en usine à gaz

## Principes fondateurs

### 1. Domaine d’abord

Le découpage principal suit les responsabilités métier, pas les écrans ni les composants UI.

Chaque domaine doit avoir :

- un rôle clair
- des frontières stables
- une responsabilité propre
- des dépendances explicites

### 2. Options activables

Le socle est pensé d’emblée comme complet, mais toutes les fonctionnalités ne sont pas forcément actives pour toutes les boutiques.

Une fonctionnalité peut être :

- supportée par le socle
- activée ou non pour une boutique
- configurée par boutique

Exemples :

- multi-devises
- multi-transporteurs
- accises
- Google Shopping
- tracking marketing
- ERP / Chorus Pro
- événements publics
- newsletter
- social publishing

### 3. Séparation plateforme / boutique

Le socle distingue :

- l’espace technique plateforme
- l’espace métier boutique

L’espace plateforme permet au créateur / mainteneur technique de :

- piloter les capabilities
- gérer les intégrations
- superviser l’observabilité
- contrôler le monitoring
- gérer les permissions avancées
- configurer les domaines transverses

L’espace boutique permet à l’exploitant métier de :

- gérer le catalogue
- gérer le contenu
- gérer les commandes
- gérer les clients
- utiliser les fonctionnalités autorisées sans exposition à la complexité technique

### 4. Runtime interne avant intégrations externes

Les domaines internes restent la source de vérité métier.

Les systèmes externes ne pilotent pas la logique interne.
Ils sont intégrés via des adaptateurs dédiés.

Exemples :

- EBP
- Chorus Pro
- transporteurs
- Google Shopping
- Meta Catalog
- pixels / analytics providers

### 5. Estimation, validation, figé

Le socle distingue clairement :

- ce qui est estimé
- ce qui est validé
- ce qui est figé

Exemples :

- `pricing` estime
- `checkout` valide
- `orders` fige

### 6. Aucune logique critique dans l’UI

L’UI consomme le domaine, mais ne porte jamais la logique critique métier.

Les validations, règles de vendabilité, calculs, statuts et décisions métier restent côté serveur et dans les domaines concernés.

## Structure générale du socle

Le socle s’organise autour de plusieurs familles de domaines.

### Plateforme / configuration

- `store`
- `users`
- `customers`
- `roles`
- `permissions`
- `feature-flags`

### Commerce coeur

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

### Croissance / relation client

- `marketing`
- `conversion`
- `crm`
- `notifications`
- `subscriptions`
- `newsletter`
- `events`
- `social`

### Mesure / conformité / pilotage

- `domain-events`
- `tracking`
- `behavior`
- `consent`
- `analytics`
- `attribution`
- `observability`
- `monitoring`
- `audit`

### Expérience / contenu / international

- `search`
- `recommendations`
- `seo`
- `legal`
- `localization`
- `media`
- `pages`
- `blog`
- `email`

### Intégrations / exploitation

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

## Noyau obligatoire et options activables

Le socle comporte un noyau toujours présent, puis des domaines/fonctionnalités activables.

### Noyau obligatoire

Toujours présents dans toute boutique :

- `store`
- `users`
- `customers`
- `roles`
- `permissions`
- `products`
- `cart`
- `orders`
- `payments`
- `media`
- `pages`
- `blog`
- `email`
- `audit`

### Options activables

Peuvent être activées ou non selon la boutique :

- inventory
- sales-policy
- channels
- shipping
- discounts
- taxation
- pricing
- checkout
- returns
- documents
- marketing
- conversion
- crm
- notifications
- subscriptions
- newsletter
- events
- social
- tracking
- behavior
- consent
- analytics
- attribution
- search
- recommendations
- seo
- legal
- localization
- integrations
- jobs
- import
- export
- support
- fulfillment
- workflow
- approval
- scheduling
- webhooks
- api-clients
- loyalty
- gift-cards
- gifting
- fraud-risk
- bundles
- catalog-modeling
- dashboarding
- template-system

## Capabilities globales

Les capabilities globales sont portées par `store`.
Elles définissent ce qu’une boutique active effectivement dans le socle.

Exemples de capabilities :

- guest checkout
- customer checkout
- professional customers
- multi-currency
- multi-carrier
- pickup point delivery
- discounts
- coupon codes
- customer-specific pricing
- customer-group pricing
- volume pricing
- taxation
- excise tax
- backorders
- preorders
- gift options
- product channels
- Google Shopping
- Meta Catalog
- marketing campaigns
- conversion flows
- CRM
- tracking
- cookie consent
- analytics
- attribution
- marketing pixels
- server-side tracking
- notifications
- newsletter
- realtime notifications
- search
- recommendations
- advanced SEO
- localization
- audit trail
- business observability
- technical monitoring
- advanced permissions
- ERP integration
- EBP integration
- electronic invoicing
- Chorus Pro integration
- public events
- event registrations
- event reservations
- social publishing
- automatic social posting
- behavioral analytics
- product view tracking
- click tracking

## Rôles plateforme et rôles boutique

Le socle distingue les rôles plateforme et les rôles boutique.

### Rôles plateforme

Ils donnent accès à la gouvernance technique et transverse du socle.

Exemples :

- `platform_owner`
- `platform_engineer`

### Rôles boutique

Ils donnent accès à l’exploitation métier de la boutique.

Exemples :

- `store_owner`
- `store_manager`
- `catalog_manager`
- `content_editor`
- `order_manager`
- `customer_support`
- `marketing_manager`
- `observer`

### Cas d’usage cible

Le créateur du socle a accès à :

- la configuration technique
- les capabilities
- les intégrations
- l’audit
- l’observabilité
- le monitoring
- les permissions avancées

L’exploitant de la boutique a accès à :

- catalogue
- contenu
- commandes
- clients
- promotions autorisées
- événements autorisés
- newsletters autorisées

## Règles d’architecture non négociables

- aucun domaine ne doit devenir un fourre-tout
- `cart` ne porte pas toute la logique shipping/discounts/taxation/pricing
- `products` ne porte pas toute la politique de vente
- les intégrations externes sont séparées du coeur métier
- les traitements asynchrones passent par `jobs`
- les événements internes passent par `domain-events`
- l’explication du comportement passe par `observability`
- la surveillance opérationnelle passe par `monitoring`
- la traçabilité passe par `audit`
- les permissions sont fines, pas seulement basées sur un rôle unique
- les features activables sont pilotées depuis l’espace technique plateforme
- l’UI ne porte pas les décisions métier critiques

## Finalité du socle

Le socle doit permettre de construire des boutiques :

- élégantes côté expérience
- robustes côté métier
- pilotables côté exploitation
- supervisables côté technique
- réutilisables sur plusieurs projets
- configurables sans re-développement structurel systématique

Ce socle n’est pas conçu pour une seule boutique.
Il est conçu comme une base e-commerce premium, activable par capacités, avec une séparation forte entre métier, plateforme, diffusion, pilotage et intégrations.
