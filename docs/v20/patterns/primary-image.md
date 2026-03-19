# Pattern — Image primaire produit

## Source de vérité actuelle

La source de vérité actuelle est le helper privé du catalogue :

- `comparePrimaryProductImages`
- `selectPrimaryProductImage`

dans `db/repositories/catalog/catalog.repository.ts`

## Règle exacte

L'ordre de priorité appliqué dans le code est :

1. `variant_id === null`
2. `is_primary === true`
3. `sort_order ASC`
4. `id ASC`

Cette règle est déterministe.

## Où cette règle est utilisée

Dans l'état actuel du code, elle est utilisée pour :

- `listHomepageFeaturedProducts`
- `listPublishedProducts`
- `listRecentPublishedProducts`
- `getPublishedProductBySlug`
- `listHomepageFeaturedCategories` via la reconstruction d'image représentative

## Ce que cette règle signifie

- une image produit parent est préférée à une image de déclinaison
- parmi les candidates du même niveau, `is_primary` fait foi
- à défaut, `sort_order`
- à défaut, `id`

## Domaines qui n'utilisent pas exactement ce helper

### `admin-category`

`admin-category.repository.ts` n'utilise pas le helper du catalogue.

Le domaine applique une règle plus restreinte :

- uniquement des images produit
- uniquement `is_primary = true`
- uniquement `variant_id = null`

Cette différence est réelle et cohérente avec le contrat `AdminCategory`.

### `admin-product-image`

`admin-product-image.repository.ts` ne lit pas l'image primaire publique. Il gère les écritures et le maintien du flag `is_primary` dans deux scopes distincts :

- scope produit
- scope déclinaison

## Lecture V20

Toute extraction future doit préserver une source de vérité unique pour le storefront.

Si le helper sort de `catalog.repository.ts`, il doit rester :

- purement technique
- déterministe
- réutilisé partout dans le catalogue
