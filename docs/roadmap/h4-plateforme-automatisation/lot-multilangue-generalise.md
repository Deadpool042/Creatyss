# Lot — Multilangue généralisé

## Statut

Champs métier produit (`name`, `shortDescription`, `description`) livrés côté code le 2026-07-22 — sujet dynamique `product` branché sur `LocalizedValue`, en miroir du pattern blog. Recette manuelle navigateur exécutée le 2026-07-22 (parcours visiteur multi-locale réel + admin traductions) — cf. section « Vérifications » ci-dessous. Un correctif d'hydratation a été appliqué sur `product-translations-form.tsx` pendant la recette.

Champs SEO produit (`metaTitle`, `metaDescription`, `openGraphTitle`, `openGraphDescription`, `twitterTitle`, `twitterDescription`) livrés côté code le 2026-07-23 — sujet dynamique `product-seo`, corrige l'écart repéré pendant la recette du 2026-07-22 (`<title>` non localisé quand un `seoTitle` custom existe). Recette manuelle navigateur exécutée le 2026-07-23 — cf. « Poursuite proposée » ci-dessous.

Cartes de produits associés (`relatedFrom`) livrées côté code le 2026-07-23 — réutilisation du sujet `product` existant, aucun nouveau sujet ni écran admin. Recette manuelle navigateur exécutée le 2026-07-23.

Champs métier catégorie (`name`, `shortDescription`, `description`) livrés côté code le 2026-07-23 — sujet dynamique `category` (`entities/localization/category-copy-fields.ts`), miroir strict du pattern `product`. Résolution storefront (`resolve-localized-category-copy.ts`), branchée dans `listCatalogFilterCategories`. Admin : section « Localisation » sur la page d'édition catégorie (`app/admin/(protected)/catalog/categories/@detail/[slug]/page.tsx`), même gate `meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual")`. Recette manuelle navigateur non encore exécutée (typecheck/lint/tests unitaires verts).

Emails transactionnels de commande (`order_created`, `payment_succeeded`, `order_shipped`) livrés côté code le 2026-07-23, cadrage préalable par `architect-review` (migration `Order.localeCode String?` nullable, capturée une seule fois au checkout — `create-order-action.ts`, seul point du cycle de vie de la commande en contexte requête client — puis relue par les envois ultérieurs sans contexte requête, ex. webhook Stripe `payment_succeeded`). Sujet fixe par événement (`order_email` / `subjectId` = code d'événement, convention homepage, pas la convention produit) dans `entities/localization/order-email-copy-fields.ts` : seules les chaînes littérales terminales des templates sont traduisibles, la logique conditionnelle (mode de paiement, présence de tracking) reste en TypeScript dans `order-email-templates.ts`. Résolution sans cookie (`resolve-localized-order-email-copy.ts`), locale explicite = `order.localeCode ?? store.defaultLocaleCode`, jamais de `null` propagé.

Écart connu par rapport au cadrage : le `subject` de l'email (objet, pas le `<h1>` HTML) reste codé en dur, non branché sur le catalogue de traductions — seul le titre HTML (`title`) est traduisible. Aucune régression (comportement identique à avant), mais incomplet ; à corriger dans un lot suivant si jugé nécessaire.

Aucun écran admin de traduction dédié dans ce lot (traductions à saisir via seed ou lot admin suivant). Périmètre explicitement limité aux 3 événements de commande — automation marketing et newsletter hors périmètre, probable même défaut structurel à auditer séparément. Recette manuelle non exécutée (typecheck/lint/tests unitaires verts, 89 tests sur `features/email`+`features/commerce`).

**Chantier mis en pause le 2026-07-23** (décision utilisateur) après ce lot. Repères pour une reprise :

- Reste explicitement hors périmètre et non traité : pages statiques additionnelles, emails d'automation marketing, newsletter.
- Écart connu à trancher à la reprise : `subject` d'email non traduisible (cf. ci-dessus).
- Migration `20260723120000_add_order_locale_code` écrite et mergée mais **pas encore appliquée** sur les bases dev/staging/prod (`prisma migrate deploy` à faire).
- Recettes manuelles navigateur non exécutées pour les lots catégorie et emails (contrairement au lot produit).

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
- Produits associés livrés côté code (2026-07-23) :
  - `relatedFrom` sur la fiche produit (`get-published-product-by-slug/index.ts`) : `name`/`shortDescription` de chaque `targetProduct` résolus via `resolveLocalizedProductCopy` (batch), sans nouveau sujet dynamique ni nouvel écran admin — les traductions déjà saisies sur la fiche propre de chaque produit associé (sujet `product`) s'appliquent automatiquement aux cartes qui le référencent
  - recetté manuellement le 2026-07-23 (`cabas-atelier` → carte `bandouliere-rivoli`, `en-GB` : nom traduit affiché, retombe sur le nom canonique en locale par défaut)

Poursuite proposée :

- réutiliser le pattern existant sans le redessiner

SEO produit livré côté code le 2026-07-23 :

- sujet dynamique `product-seo` (`entities/localization/product-seo-copy-fields.ts`) : `metaTitle`, `metaDescription`, `openGraphTitle`, `openGraphDescription`, `twitterTitle`, `twitterDescription` — `subjectId` = `Product.id`, même convention que `SeoMetadata.subjectId` pour un produit
- résolution storefront (`resolve-localized-product-seo-copy.ts`), branchée dans `getPublishedProductBySlug` — couvre `<title>`, `<meta description>`, Open Graph, Twitter Card et JSON-LD en un seul point d'injection
- admin `/admin/catalog/products/[slug]/seo` : section « Traductions SEO » (`ProductTranslationsForm` généralisé avec une prop `action`, réutilisé pour les deux sujets dynamiques `product` et `product-seo`)
- corrige l'écart repéré pendant la recette du 2026-07-22 : un `seoTitle` custom priorisait toujours la version canonique même en locale secondaire — recetté manuellement le 2026-07-23 (`cabas-atelier`, `en-GB` : titre traduit affiché, fallback vérifié sur champ vidé)
- hors périmètre : `metaKeywords`, `canonicalPath`, `indexingMode`, images OG/Twitter (non textuels)

## Hors périmètre

- Traduction automatique (machine translation via API)
- Workflow collaboratif de traduction (rôles traducteur, validation)
- Multilangue pour les autres pages statiques et les emails transactionnels (peuvent suivre lot par lot)
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

- `pnpm run typecheck` — exécuté le 2026-07-22, vert (après correctif d'hydratation)
- `pnpm run lint` — exécuté le 2026-07-22, vert (après correctif d'hydratation)
- `pnpm run test` (ciblé : `tests/unit/features/storefront/catalog`, `tests/unit/features/admin/products`, `tests/unit/features/admin/blog`, `tests/unit/entities/localization`) — exécuté le 2026-07-22, 105 tests verts
- Test manuel navigateur (Playwright, `pnpm dev` local, store Creatyss avec locales `fr-FR` par défaut / `en-GB` secondaire) — exécuté le 2026-07-22 :
  - Prérequis d'environnement : le niveau d'activation local de `platform.localization` était sur « Géré » (`managed`), donc la section « Traductions » de l'édition produit et les copies traduites côté storefront étaient invisibles avant recette. Relevé via `/admin/settings/advanced/optional/localization`, niveau temporairement monté à « Multilingue » pour la durée de la recette, puis redescendu à « Géré » en fin de session pour restituer l'état initial de la base locale.
  - Admin `/admin/catalog/products/[slug]/edit` → section Traductions : saisie `name` + `shortDescription` pour deux produits (`cabas-atelier`, `bandouliere-rivoli`), enregistrement, toast de succès, persistance confirmée après rechargement complet de la page.
  - Storefront, locale visiteur `en-GB` : fiche produit (H1, tagline canonique conservée hors périmètre, description courte traduits), `<title>` et JSON-LD alimentés par le même objet localisé pour un produit sans `SeoMetadata.metaTitle` custom (`bandouliere-rivoli` → « Rivoli Shoulder Bag »), listing boutique (`/boutique`) et favoris (`/favoris`) affichant le nom traduit.
  - Fallback : traduction `name` vidée et ré-enregistrée pour `bandouliere-rivoli` → fiche produit, `<title>` et listing repassent immédiatement à la valeur canonique française, sans passage par `null`.
  - Constat hors périmètre (non un bug de ce lot) : pour un produit disposant d'un `SeoMetadata.metaTitle` custom (`cabas-atelier`), le `<title>` reste sur ce titre SEO non traduit même en locale `en-GB`, car `generateMetadata` priorise `product.seoTitle` sur `product.name` (`app/(public)/boutique/[slug]/page.tsx:54`). `SeoMetadata` n'a jamais été dans le périmètre de ce lot (aucune mention dans « Périmètre » ni « Hors périmètre ») — à documenter comme lot séparé si la localisation des métadonnées SEO custom devient un besoin produit.

## Correctif appliqué pendant la recette

- **Bug reproduit** : `features/admin/products/components/editor/product-translations-form.tsx` passait un `<div>` comme `description` à `AdminFormField`, qui le rend dans un `<p>` (`components/ui/field.tsx` → `FieldDescription`). Nesting HTML invalide (`<p><div>…</div></p>`) → erreur d'hydratation React confirmée en console sur `/admin/catalog/products/[slug]/edit` (section Traductions visible).
- **Correctif** : wrapper changé de `<div>` à `<span className="flex flex-wrap items-center gap-2">` (contenu déjà 100 % inline : `<span>`, `<code>`, `<Badge>` qui rend un `<span>`). Rechargement de la page après correctif : 0 erreur console.
- **Portée du correctif** : initialement limité au fichier livré par ce lot. Le même correctif (`<div>` → `<span>` sur le prop `description` de `AdminFormField`) a été généralisé le 2026-07-22 aux 6 formulaires de traduction pré-existants qui portaient le même bug (`blog-post-translations-form.tsx`, `homepage-translations-form.tsx`, `contact-page-translations-form.tsx`, `content-page-translations-form.tsx`, `boutique-page-translations-form.tsx`, `product-page-translations-form.tsx`) — micro-lot dédié, sans impact sur les autres formulaires (`a-propos-page-translations-form.tsx`, `les-marches-page-translations-form.tsx` : pattern absent, non concernés).

## Critères de fin

- Une nouvelle cible de contenu au-delà des pilotes actuels est branchée sur `LocalizedValue` — **fait** : `Product.name` / `shortDescription` / `description`
- Le storefront ou la surface concernée affiche la traduction correcte selon la locale active, avec fallback — **fait, recetté manuellement le 2026-07-22** (fiche produit, listing, favoris, metadata/JSON-LD pour un produit sans SEO custom, fallback vérifié)
- Les formulaires admin permettent la saisie des traductions pour cette cible — **fait et recetté** (`/admin/catalog/products/[slug]/edit`, enregistrement + persistance confirmés)
- Les données existantes sont préservées après migration si des champs métier sont touchés — **sans objet** : aucune migration Prisma, les colonnes `Product` canoniques ne sont pas modifiées
- `typecheck` et `lint` passent sans erreur — **fait**

## Agent recommandé

`next-feature-builder` pour l'implémentation, après vérification du pattern de migration de données avec `prisma-architect`.
