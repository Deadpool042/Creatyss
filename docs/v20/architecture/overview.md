# Vue d'ensemble de `db/`

## Structure réelle

Arborescence observable dans le repository :

```text
db/
├── health.ts
├── migrations/
├── prisma-client.ts
├── repositories/
│   ├── admin-blog.repository.ts
│   ├── admin-blog.types.ts
│   ├── admin-category.repository.ts
│   ├── admin-category.types.ts
│   ├── admin-homepage.repository.ts
│   ├── admin-homepage.types.ts
│   ├── admin-media.repository.ts
│   ├── admin-media.types.ts
│   ├── admin-users.repository.ts
│   ├── admin-users.types.ts
│   ├── catalog/
│   │   ├── catalog.mappers.ts
│   │   ├── catalog.repository.ts
│   │   └── catalog.types.ts
│   ├── guest-cart.repository.ts
│   ├── guest-cart.types.ts
│   ├── order-email.repository.ts
│   ├── order-email.types.ts
│   ├── order.repository.ts
│   ├── order.types.ts
│   ├── payment.repository.ts
│   ├── payment.types.ts
│   └── products/
│       ├── admin-product-image.repository.ts
│       ├── admin-product-image.types.ts
│       ├── admin-product-variant.repository.ts
│       ├── admin-product-variant.types.ts
│       ├── admin-product.repository.ts
│       ├── admin-product.types.ts
│       └── simple-product-compat.ts
└── seeds/
```

## Principes globaux visibles dans le code

- `db/prisma-client.ts` est le point d'entrée unique Prisma.
- `db/health.ts` expose un health check minimal de connectivité Prisma via `prisma.$connect()`.
- `db/repositories/**` concentre les accès base, les transactions et les mappings de persistance.
- Les contrats publics sont majoritairement déplacés dans des fichiers `*.types.ts`.
- Les domaines les plus complexes utilisent du batch loading explicite à l'intérieur du repository plutôt qu'une abstraction générique.
- La logique métier reste hors `db/`, principalement dans `entities/`.

## Ce que V19 a réellement laissé en place

### Ce qui est homogène

- Prisma only dans tout `db/`
- plus de `db/client.ts`
- plus de `db/catalog.ts`
- plus de raw SQL runtime
- transactions Prisma explicites sur `payment`, `order`, `admin-homepage`, `admin-blog`, `admin-product*`
- types publics explicites dans la majorité des domaines

### Ce qui reste hétérogène

- arborescence mixte :
  - `catalog/` et `products/` sont découpés
  - `order`, `payment`, `guest-cart`, `admin-*` restent à plat
- deux exceptions au pattern “repository runtime only” :
  - `admin-category.repository.ts` ré-exporte encore `AdminCategory` et `AdminCategoryRepositoryError`
  - `catalog.repository.ts` ré-exporte encore ses types publics
- un hub feature reste branché sur un repository :
  - `features/homepage/types.ts`

## Taille actuelle des zones sensibles

- `db/repositories/catalog/catalog.repository.ts` : 878 lignes
- `db/repositories/order.repository.ts` : 728 lignes
- `db/repositories/products/admin-product.repository.ts` : 592 lignes
- `db/repositories/guest-cart.repository.ts` : 449 lignes
- `db/repositories/admin-homepage.repository.ts` : 425 lignes
- `db/repositories/admin-category.repository.ts` : 365 lignes

Ces tailles ne sont pas un problème de contrat public. Elles sont surtout un problème de lisibilité interne et de découpage.

## Sous-domaines actuels

### Repositories storefront

- `catalog/**` : homepage publique, boutique, détail produit public, blog public
- `guest-cart.repository.ts` : panier invité et brouillon checkout
- `order.repository.ts` : commande publique + admin
- `payment.repository.ts` : démarrage et finalisation de paiement Stripe
- `order-email.repository.ts` : journalisation des emails transactionnels, traité aujourd'hui comme sous-domaine satellite de `order`

### Repositories admin

- `admin-blog`
- `admin-category`
- `admin-homepage`
- `admin-media`
- `admin-users`
- `products/**` : admin produit, déclinaisons, images, compatibilité simple product

## Rôle de `products/**` dans la structure réelle

`products/**` n'est pas un domaine annexe. C'est l'une des principales zones de complexité de `db/`.

On y trouve :

- `admin-product.repository.ts`
- `admin-product-variant.repository.ts`
- `admin-product-image.repository.ts`
- `simple-product-compat.ts`

Cette arborescence est déjà un premier découpage interne, mais elle reste centrée sur des gros fichiers repository et des `*.types.ts` plats.

## Repositories sans fiche dédiée dans cette doc V20

Deux zones n'ont pas de fiche propre dans l'arborescence documentaire demandée :

- `products/**`
- `order-email.repository.ts`

Elles restent néanmoins couvertes par :

- cette vue d'ensemble
- les règles V20
- les patterns transverses
- la fiche [order](../repositories/order.md) pour `order-email`

## Ce que V20 cherche à stabiliser

V20 ne remet pas en cause les choix suivants :

- Prisma comme seule couche d'accès aux données
- repositories comme façade publique de `db/`
- `entities/` comme lieu des règles métier
- batch loading explicite pour les cas complexes

V20 prépare surtout :

- l'introduction de `queries` internes
- l'extraction de `helpers` techniques par domaine
- le découpage des types publics trop larges
- une arborescence de repositories plus homogène
