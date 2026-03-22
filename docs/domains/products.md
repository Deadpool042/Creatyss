# Domaine products

## Rôle

Le domaine `products` porte le catalogue source du socle.

Il décrit ce que la boutique vend ou expose commercialement à travers des produits, variantes, catégories, images et métadonnées catalogue.

Il constitue la source de vérité du catalogue interne, distincte des domaines qui gèrent ensuite :

- la disponibilité quantitative
- la vendabilité contextuelle
- la diffusion vers des canaux externes
- le pricing transverse

## Responsabilités

Le domaine `products` prend en charge :

- les produits parents
- les variantes produit
- les catégories produit
- les images et médias liés au catalogue
- les slugs catalogue
- les statuts catalogue
- la structure éditoriale minimale d’un produit
- les informations visibles dans le catalogue source
- la publication catalogue au sens interne
- les données nécessaires à la lecture catalogue par le storefront et l’admin boutique

## Ce que le domaine ne doit pas faire

Le domaine `products` ne doit pas :

- porter le stock quantitatif, qui relève de `inventory`
- décider seul si un produit est vendable dans un contexte donné, ce qui relève de `sales-policy`
- calculer les remises, taxes ou totaux, ce qui relève de `discounts`, `taxation` et `pricing`
- gérer la diffusion vers Google Shopping ou d’autres canaux externes, ce qui relève de `channels` et `integrations`
- devenir un moteur complet de CMS générique
- porter toute la logique checkout, cart ou order

Le domaine `products` décrit le catalogue interne. Il ne doit pas absorber les autres responsabilités commerce.

## Sous-domaines

- `catalog` : lecture et gestion du produit parent
- `variants` : variantes catalogue
- `images` : images et médias liés au catalogue
- `categories` : catégories produit
- `deliverables` : typologies ou objets catalogue spécifiques au métier si activés
- `publication` : statut et exposition catalogue interne

## Entrées

Le domaine reçoit principalement :

- des créations de produits
- des mises à jour de produits
- des créations ou mises à jour de variantes
- des rattachements d’images
- des changements de catégories
- des changements de statut catalogue
- des demandes de lecture catalogue côté boutique ou storefront

## Sorties

Le domaine expose principalement :

- des produits catalogue
- des variantes catalogue
- des catégories
- des images principales et secondaires
- des slugs et identifiants stables
- des statuts catalogue lisibles par les autres domaines

## Dépendances vers autres domaines

Le domaine `products` doit rester faiblement couplé.

Il peut dépendre de :

- `media` pour les assets réutilisables
- `audit` pour tracer les modifications sensibles
- `observability` pour diagnostiquer certaines incohérences catalogue
- `workflow` ou `approval` si certaines publications exigent une validation

Les domaines suivants peuvent dépendre de `products` :

- `inventory`
- `sales-policy`
- `cart`
- `search`
- `recommendations`
- `channels`
- `seo`
- `analytics`
- `orders`
- `documents`

## Capabilities activables liées

Le domaine `products` existe dans le noyau, mais certaines extensions peuvent être activables.

Exemples de capabilities liées :

- `productChannels`
- `googleShopping`
- `metaCatalog`
- `advancedSeo`
- `localization`

### Effet si `productChannels` est activée

Le catalogue peut être projeté vers des canaux externes via `channels`.

### Effet si `googleShopping` ou `metaCatalog` est activée

Des vues catalogue compatibles peuvent être diffusées via `channels` et `integrations`.

### Effet si `advancedSeo` est activée

Le catalogue peut exposer des métadonnées plus riches via `seo`.

### Effet si `localization` est activée

Le catalogue peut être enrichi de données traduisibles via `localization`.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `catalog_manager`
- `content_editor` en lecture ou contribution partielle selon politique retenue

### Permissions

Exemples de permissions concernées :

- `catalog.read`
- `catalog.write`
- `catalog.publish`
- `categories.read`
- `categories.write`
- `media.read`
- `media.write`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `product.created`
- `product.updated`
- `product.published`
- `product.archived`
- `product.variant.created`
- `product.variant.updated`
- `product.category.changed`

## Événements consommés

Le domaine `products` peut consommer certains événements de gouvernance ou de workflow.

Exemples possibles :

- validations d’approbation de publication
- événements de scheduling liés à une publication différée

Il ne doit pas dépendre fortement d’événements des domaines aval comme `cart` ou `orders`.

## Intégrations externes

Le domaine `products` ne parle pas directement aux systèmes externes.

Les diffusions vers :

- Google Shopping
- Meta Catalog
- réseaux sociaux
- exports catalogue externes

relèvent de :

- `channels`
- `social`
- `export`
- `integrations`

Le domaine `products` reste la source de vérité interne du catalogue.

## Données sensibles / sécurité

Le domaine `products` ne porte pas les données les plus sensibles en termes sécurité, mais il porte une donnée centrale métier.

Points de vigilance :

- contrôle strict des permissions d’écriture
- protection des actions de publication
- audit des modifications significatives
- cohérence entre produit parent, variantes et médias

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel produit a été publié
- quel statut catalogue était actif
- quelles variantes étaient liées à un produit
- pourquoi un produit est visible ou non à un instant donné si un workflow de publication existe

### Audit

Il faut tracer :

- la création d’un produit
- la modification d’un produit
- la publication ou dépublication d’un produit
- la modification des variantes
- les changements de catégorie significatifs

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Product` : produit parent catalogue
- `ProductVariant` : variante d’un produit
- `ProductCategory` : catégorie catalogue
- `ProductImage` : image liée au catalogue
- `ProductPublicationState` : état catalogue du produit

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un produit possède un identifiant stable
- un slug catalogue doit être unique lorsqu’il est exposé publiquement
- une variante appartient toujours à un produit parent explicite
- les médias catalogue sont rattachés explicitement
- le domaine `products` reste la source de vérité du catalogue interne
- les autres domaines ne doivent pas recréer leur propre définition divergente du produit catalogue

## Cas d’usage principaux

1. Créer un produit catalogue
2. Modifier un produit catalogue
3. Ajouter ou modifier des variantes
4. Rattacher des images à un produit ou une variante
5. Classer un produit dans une ou plusieurs catégories
6. Publier ou dépublier un produit au niveau catalogue interne
7. Lire le catalogue côté storefront et côté admin

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- produit introuvable
- variante introuvable
- slug déjà utilisé
- rattachement image invalide
- catégorie inconnue
- tentative de publication invalide
- incohérence entre produit parent et variantes

## Décisions d’architecture

Les choix structurants du domaine sont :

- `products` porte le catalogue source interne
- `products` est distinct de `inventory`Ò
- `products` est distinct de `sales-policy`
- `products` ne porte pas la diffusion externe, qui relève de `channels` et `integrations`
- `products` ne porte pas les calculs de pricing ou taxation
- les événements de publication catalogue peuvent déclencher des traitements secondaires via `domain-events`

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- le catalogue source relève de `products`
- le stock ne relève pas de `products`
- la vendabilité contextuelle ne relève pas de `products`
- la diffusion Google Shopping ou Meta ne relève pas directement de `products`
- `products` ne remplace ni `inventory`, ni `sales-policy`, ni `channels`, ni `pricing`
