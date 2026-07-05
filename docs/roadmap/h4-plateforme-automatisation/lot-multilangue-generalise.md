# Lot — Multilangue généralisé

## Statut

En cours — pilotes `product-page`, `boutique-page`, pages de contenu et blog observés, généralisation métier produit restante

## Objectif

Poursuivre la généralisation de la convention `LocalizedValue` au-delà des pilotes déjà observés (`homepage`, `product-page-copy`, `boutique-page-copy`), en l'étendant aux prochains contenus métier pertinents. Le routing localisé est observé comme complet (`platform.localization` L3, lot 5 `localized-routing` fait en 2026-06-16).

## Périmètre

État observé au 2026-07-05 :

- `entities/languages/resolve-locale-content.ts` — convention existante observée et déjà réutilisée
- Pilotes déjà livrés :
  - `homepage`
  - `features/storefront/catalog/product-page/**` + admin translations associées
  - `features/storefront/catalog/boutique-page/**` + admin translations associées
- Pilote pages de contenu livré côté code :
  - `contact` : lecture storefront localisée + édition admin
  - `a-propos` : lecture storefront localisée + édition admin
  - `les-marches` : lecture storefront localisée + édition admin
- Pilote blog livré côté code :
  - admin `/admin/content/blog/[id]` : édition des traductions `title` / `excerpt` / `content`
  - storefront `app/(public)/blog/**` : listing + détail localisés avec fallback
- Cibles restantes non observées :
  - contenus métier produit au sens large (`name`, `description`, `shortDescription`)

Poursuite proposée :

- réutiliser le pattern existant sans le redessiner
- poursuivre sur les vrais champs produit avec un cadrage de migration dédié

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

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` — vérifier que les tests existants sur les produits et le blog restent verts
- Test manuel : blog et fiche produit affichés dans chaque locale gérée, fallback vérifié si traduction absente

## Critères de fin

- Une nouvelle cible de contenu au-delà des pilotes actuels est branchée sur `LocalizedValue`, ou le lot est explicitement clos après le pilote blog
- Le storefront ou la surface concernée affiche la traduction correcte selon la locale active, avec fallback
- Les formulaires admin permettent la saisie des traductions pour cette cible
- Les données existantes sont préservées après migration si des champs métier sont touchés
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`next-feature-builder` pour l'implémentation, après vérification du pattern de migration de données avec `prisma-architect`.
