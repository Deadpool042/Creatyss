# Lot — Bundles

## Statut

A faire

## Objectif

Activer le domaine `commerce.bundles` : composition commerciale de plusieurs produits/variantes en une unité vendable cohérente. Le modèle Prisma est posé et le domaine est documenté comme `satellites` / `activable: oui`, mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/commerce/bundles.prisma` — modèles `Bundle`, `BundleItem` déjà posés (observés)
- Composition d'un bundle à partir de plusieurs produits/variantes du catalogue
- Exposition storefront d'un bundle comme unité vendable (fiche, panier, checkout)
- Admin : création et gestion des bundles
- Gating via `meetsFeatureLevel` — niveau(x) à définir en cadrage, cohérent avec `docs/domains/satellites/bundles.md`

## Hors périmètre

- Pricing dynamique du bundle (remise automatique liée à la composition) — relève de `commerce.pricing`/`commerce.discounts`, à cadrer séparément
- Vendabilité contextuelle du bundle — relève de `sales-policy` (cf. `docs/roadmap/h3-administration-avancee/lot-sales-policy.md`), non présumée par ce lot
- Gestion de stock consolidée au niveau du bundle (dépend de la stratégie de décrément retenue sur les composants)

## Dépendances

- Décision produit : la vente de bundles est-elle réellement prioritaire pour le business, ou le schéma Prisma a-t-il été posé par anticipation sans besoin confirmé ? — à trancher avant tout cadrage détaillé
- `catalog.products` actif comme source des composants du bundle
- `docs/domains/satellites/bundles.md` comme référence doctrinale du domaine (distinction avec `products`, `catalog-modeling`, `pricing`, `discounts`, `sales-policy`)

## Invariants

- Le système reste maître de la vérité sur la composition d'un bundle
- Distinction stricte avec les produits publiés (`products`), le pricing (`pricing`) et les remises (`discounts`) — cf. `docs/domains/satellites/bundles.md`
- Un bundle ne doit pas être vendable si un de ses composants ne l'est plus (cohérence avec la vendabilité des composants)

## Risques

- Incohérence de stock si le décrément des composants n'est pas transactionnel à l'achat d'un bundle
- Confusion fonctionnelle avec les remises groupées (`discounts`) si la frontière n'est pas explicitement tranchée

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur la composition d'un bundle et la cohérence de vendabilité de ses composants

## Critères de fin

- Un bundle peut être composé en admin et exposé comme unité vendable côté storefront
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la priorité produit et la frontière avec `pricing`/`discounts`/`sales-policy`, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
