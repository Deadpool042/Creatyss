# Lot — Multilangue généralisé

## Statut

Champs métier produit (`name`, `shortDescription`, `description`) livrés côté code le 2026-07-22 — sujet dynamique `product` branché sur `LocalizedValue`, en miroir du pattern blog. Vérification manuelle navigateur (parcours visiteur multi-locale réel) **non exécutée** dans cette session — cf. section « Vérifications » ci-dessous.

## Objectif

Poursuivre la généralisation de la convention `LocalizedValue` au-delà des pilotes déjà observés (`homepage`, `product-page-copy`, `boutique-page-copy`), en l'étendant aux prochains contenus métier pertinents. Le routing localisé est observé comme complet (`platform.localization` L3, lot 5 `localized-routing` fait en 2026-06-16).

## Périmètre

État observé au 2026-07-22 :

- `entities/languages/resolve-locale-content.ts` — convention existante observée et déjà réutilisée
- Pilotes déjà livrés :
  - `homepage`
  - `features/storefront/catalog/product-page/**` + admin translations associées (copie statique de la fiche produit, dictionnaire `PRODUCT_PAGE_COPY_FIELDS` — distinct des champs métier `Product`)
  - `features/storefront/catalog/boutique-page/**` + admin translations associées (idem, dictionnaire de page)
- Pilote pages de contenu livré côté code :
  - `contact` : lecture storefront localisée + édition admin
  - `a-propos` : lecture storefront localisée + édition admin
  - `les-marches` : lecture storefront localisée + édition admin
- Pilote blog livré côté code :
  - admin `/admin/content/blog/[id]` : édition des traductions `title` / `excerpt` / `content`
  - storefront `app/(public)/blog/**` : listing + détail localisés avec fallback
- Champs métier produit livrés côté code (2026-07-22) :
  - sujet dynamique `product` (`entities/localization/product-copy-fields.ts`) : `name`, `shortDescription`, `description`
  - admin `/admin/catalog/products/[slug]/edit` : section « Traductions » (sœur du formulaire général, pas de nouvel onglet, pas de formulaire imbriqué)
  - storefront : fiche produit (`getPublishedProductBySlug`, alimente aussi `generateMetadata` et le JSON-LD via le même objet), listing boutique (`listPublishedProducts`, `listPublishedProductsPage`), favoris (`findFavoriteProductsByIds`) — tous via le résolveur en lot `resolveLocalizedProductCopy`
  - hors périmètre de ce lot : cartes de produits associés (`relatedFrom` sur la fiche produit) — restent en valeur canonique, non branchées sur `LocalizedValue`

Poursuite proposée :

- réutiliser le pattern existant sans le redessiner
- étendre si besoin aux produits associés (`RelatedProduct`) dans un lot dédié

## Hors périmètre

- Traduction automatique (machine translation via API)
- Workflow collaboratif de traduction (rôles traducteur, validation)
- Multilangue pour les catégories, les autres pages statiques et les emails transactionnels (peuvent suivre lot par lot)
- Ajout de nouvelles locales (la gestion des locales supportées est dans `core/localization/supported-locales.ts`, hors périmètre de ce lot)

## Dépendances

- `platform.localization` L3 complet et routing localisé observés comme prérequis (déjà satisfaits)
- Convention `LocalizedValue` et `resolve-locale-content.ts` observées (base existante à ne pas modifier)
- Décision produit : prioriser ou non la migration des vrais champs produit

## Invariants

- Le fallback sur la locale par défaut doit être préservé pour tout champ `LocalizedValue` — aucun champ ne doit retourner `null` si une valeur existe dans la locale par défaut
- La migration des champs texte existants (string → LocalizedValue) doit préserver les données actuelles comme valeur de la locale par défaut
- La convention `resolve-locale-content.ts` ne doit pas être modifiée — elle est la source de vérité du mécanisme de résolution

## Risques

- Migration de données : les vrais champs produit restent en `string` — leur passage à `LocalizedValue` demandera un backfill sans perte
- Impact SEO : la généralisation à des contenus indexés doit rester cohérente avec le routing localisé et les `hreflang` déjà observés
- Formulaires admin : l'édition multilingue complexifie l'UX — le pattern existant doit être prolongé, pas réinventé

## Vérifications

- `pnpm run typecheck` — exécuté le 2026-07-22, vert
- `pnpm run lint` — exécuté le 2026-07-22, vert
- `pnpm run test` (ciblé : `tests/unit/features/storefront/catalog`, `tests/unit/features/admin/products`, `tests/unit/features/admin/blog`, `tests/unit/entities/localization`) — exécuté le 2026-07-22, 105 tests verts
- Test manuel : blog et fiche produit affichés dans chaque locale gérée, fallback vérifié si traduction absente — **non exécuté** dans cette session (pas d'accès à un environnement navigateur/DB local dans ce lot ; couverture assurée par les tests unitaires du résolveur et de l'action d'écriture)

## Critères de fin

- Une nouvelle cible de contenu au-delà des pilotes actuels est branchée sur `LocalizedValue` — **fait** : `Product.name` / `shortDescription` / `description`
- Le storefront ou la surface concernée affiche la traduction correcte selon la locale active, avec fallback — **couvert par tests unitaires** (résolveur `resolveLocalizedProductCopy`) ; non revérifié manuellement en navigateur
- Les formulaires admin permettent la saisie des traductions pour cette cible — **fait** (`/admin/catalog/products/[slug]/edit`)
- Les données existantes sont préservées après migration si des champs métier sont touchés — **sans objet** : aucune migration Prisma, les colonnes `Product` canoniques ne sont pas modifiées
- `typecheck` et `lint` passent sans erreur — **fait**

## Agent recommandé

`next-feature-builder` pour l'implémentation, après vérification du pattern de migration de données avec `prisma-architect`.
