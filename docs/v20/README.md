# V20 — Doctrine modulaire de `db/`

## Résumé

V20 ne décrit pas une nouvelle migration technologique. Prisma est déjà la seule couche d'accès aux données active dans `db/`.

Le rôle de cette documentation est différent :

- figer l'état réel de `db/` après V19
- expliciter les responsabilités par domaine
- formaliser les patterns transverses déjà présents dans le code
- préparer une modularisation interne sûre de la couche `db/`
- servir de référence opérationnelle pour les prochains refactors internes

Cette documentation distingue toujours :

- l'état actuel observé dans le code
- la cible de modularisation V20 quand elle n'est pas encore implémentée

## Objectifs

- documenter l'architecture réelle de `db/`
- formaliser le pattern repository actuel
- décrire l'usage réel de Prisma, des transactions et du batch loading
- expliciter les frontières `db` / `entities` / `features`
- documenter les domaines critiques (`catalog`, `order`, `guest-cart`, `payment`, `admin/*`)
- poser des règles strictes pour l'évolution de `db/` sans régression de contrat ni de comportement
- préparer le découpage futur en `queries`, `helpers` et `types/` modulaires

## Comment utiliser cette documentation

- Lire [overview](./architecture/overview.md) pour la vue d'ensemble réelle.
- Lire [repository-pattern](./architecture/repository-pattern.md) et [prisma-usage](./architecture/prisma-usage.md) avant tout refactor interne.
- Lire les fiches domaine dans [`repositories/`](./repositories/) avant de modifier un repository précis.
- Lire les patterns transverses dans [`patterns/`](./patterns/) avant de toucher à une logique partagée.
- Lire les règles dans [`rules/`](./rules/) avant de créer une nouvelle structure interne.
- Lire [`migration/from-v19.md`](./migration/from-v19.md) et [`codex/guardrails.md`](./codex/guardrails.md) avant d'ouvrir un chantier de refactor.

## Navigation

### Architecture

- [Vue d'ensemble](./architecture/overview.md)
- [Pattern repository](./architecture/repository-pattern.md)
- [Usage réel de Prisma](./architecture/prisma-usage.md)
- [Frontières de responsabilité](./architecture/boundaries.md)

### Repositories

- [Catalog](./repositories/catalog.md)
- [Order](./repositories/order.md)
- [Payment](./repositories/payment.md)
- [Guest-cart](./repositories/guest-cart.md)
- [Admin blog](./repositories/admin/blog.md)
- [Admin category](./repositories/admin/category.md)
- [Admin homepage](./repositories/admin/homepage.md)
- [Admin media](./repositories/admin/media.md)
- [Admin users](./repositories/admin/users.md)

### Patterns transverses

- [Batch loading](./patterns/batch-loading.md)
- [Image primaire produit](./patterns/primary-image.md)
- [Disponibilité](./patterns/availability.md)
- [Gestion des erreurs](./patterns/error-handling.md)

### Règles d'évolution

- [Dos and don'ts](./rules/dos-and-donts.md)
- [Types](./rules/types.md)
- [Queries](./rules/queries.md)

### Migration et décisions

- [Depuis V19](./migration/from-v19.md)
- [Décisions structurantes](./migration/decisions.md)

### Codex

- [Prompt V20](./codex/prompt-v20.md)
- [Guardrails](./codex/guardrails.md)

## Portée de la documentation

Cette arborescence documente explicitement les domaines listés ci-dessus.

Deux zones n'ont pas de fiche dédiée dans cette structure V20, parce que l'arborescence demandée ne prévoit pas encore leur découpage documentaire propre :

- `db/repositories/products/**`
- `db/repositories/order-email.repository.ts`

Elles sont documentées de manière transversale dans :

- [overview](./architecture/overview.md)
- [repository-pattern](./architecture/repository-pattern.md)
- [types](./rules/types.md)
- [queries](./rules/queries.md)
- [from-v19](./migration/from-v19.md)

Cette asymétrie reflète l'état actuel du code :

- `products/**` existe comme sous-arborescence réelle, mais reste encore trop couplé à ses compatibilités internes pour être considéré comme un domaine documentaire déjà stabilisé
- `order-email.repository.ts` agit comme repository satellite du domaine `order`, principalement pour compléter `AdminOrderDetail` et les flux transactionnels email
