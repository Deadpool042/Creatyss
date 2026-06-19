# Lot — Multilangue généralisé

## Statut

A faire

## Objectif

Étendre la convention `LocalizedValue` aux produits et au blog, en suivant le pattern établi sur la homepage (pilote observé). Le routing localisé est observé comme complet (`platform.localization` L3, lot 5 `localized-routing` fait en 2026-06-16).

## Périmètre

Proposition — non observé comme implémenté à ce jour pour les produits et le blog :

- `entities/languages/resolve-locale-content.ts` — convention existante (observée) à réutiliser sans modification
- `features/products/` — migration des champs texte produit (`name`, `description`, `shortDescription`) vers `LocalizedValue` avec fallback
- `features/admin/products/` — formulaires d'édition étendus avec onglet de traduction par locale gérée
- `features/admin/blog/` — migration des champs article (`title`, `excerpt`, `content`) vers `LocalizedValue` avec fallback
- Storefront produit et blog : lecture de la locale active via le mécanisme existant (`x-next-locale`)
- Admin localization existant : vérifier si les interfaces de traduction de la homepage sont réutilisables

## Hors périmètre

- Traduction automatique (machine translation via API)
- Workflow collaboratif de traduction (rôles traducteur, validation)
- Multilangue pour les catégories, les pages de contenu statiques et les emails transactionnels (peuvent suivre lot par lot)
- Ajout de nouvelles locales (la gestion des locales supportées est dans `core/localization/supported-locales.ts`, hors périmètre de ce lot)

## Dépendances

- `platform.localization` L3 complet et routing localisé observés comme prérequis (déjà satisfaits)
- Convention `LocalizedValue` et `resolve-locale-content.ts` observées (base existante à ne pas modifier)
- Décision produit : quels champs produit et blog sont traduits en priorité

## Invariants

- Le fallback sur la locale par défaut doit être préservé pour tout champ `LocalizedValue` — aucun champ ne doit retourner `null` si une valeur existe dans la locale par défaut
- La migration des champs texte existants (string → LocalizedValue) doit préserver les données actuelles comme valeur de la locale par défaut
- La convention `resolve-locale-content.ts` ne doit pas être modifiée — elle est la source de vérité du mécanisme de résolution

## Risques

- Migration de données : les produits et articles existants ont des champs `string` — la migration vers `LocalizedValue` (JSONB ou relation) doit être faite avec une migration Prisma ou un script de backfill sans perte de données
- Impact SEO : si les URLs localisées pour les fiches produit ne sont pas gérées via les hreflang existants, le SEO peut être dégradé
- Formulaires admin : l'édition multilingue complexifie l'UX des formulaires — le pattern de la homepage doit être réutilisé plutôt que réinventé

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` — vérifier que les tests existants sur les produits et le blog restent verts
- Test manuel : fiche produit affichée dans chaque locale gérée, fallback vérifié si traduction absente

## Critères de fin

- Les champs texte des produits et des articles de blog sont traduisibles par locale
- Le storefront affiche la traduction correcte selon la locale active, avec fallback sur la locale par défaut
- Les formulaires admin permettent la saisie des traductions
- Les données existantes sont préservées après migration (aucune perte de contenu)
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`next-feature-builder` pour l'implémentation, après vérification du pattern de migration de données avec `prisma-architect`.
