<!-- docs/lots/2026-06-13-localization-product-page-cadrage.md -->

# Cadrage — Pilote `LocalizedValue` n°2 : fiche produit (`product-page-copy.config.ts`)

> **Statut : proposition.** Suite à `docs/lots/2026-06-13-localization-l4-generalisation-cadrage.md`,
> candidat confirmé (2026-06-13) : **fiche produit**. Ce document découpe le
> pattern lots 4.4/4.5 en sous-lots pour ce pilote.

## État actuel (audit du périmètre)

`features/storefront/catalog/product-page/config/product-page-copy.config.ts`
(29 lignes) est **un objet `as const` plat**, pas encore migré vers la
convention `resolveLocaleContent` + dictionnaire (contrairement à `homepage`,
qui a eu cette migration en lot 3). Une étape supplémentaire est donc
nécessaire avant d'appliquer le pattern 4.4/4.5.

4 consommateurs identifiés :

| Fichier | Type | Champs utilisés |
|---|---|---|
| `components/sections/product-editorial-section.tsx` | Server component, rendu par `ProductPageTemplate` sans props copy aujourd'hui | `editorial.*` (eyebrow, titleLine1/2, body, ctaLabel, ctaHref) |
| `components/hero/mobile/product-hero-section-mobile-portrait.tsx` | Client component (`"use client"`), reçoit `ProductHeroResolvedProps` | `heroBadges.location`, `heroBadges.uniqueness` |
| `components/hero/mobile/product-hero-section-landscape.tsx` | Client component (`"use client"`), reçoit `ProductHeroResolvedProps` | `heroBadges.location`, `heroBadges.uniquenessCompact` |
| `model/build-product-json-ld.ts` | Fonction pure, appelée dans `app/(public)/boutique/[slug]/page.tsx` | `jsonLdDefaultDescription` |

**Différence avec le pilote `homepage`** : homepage était 6 composants tous
câblés directement depuis `app/page.tsx` via un seul prop `copy`. Ici, les
deux variantes hero mobile reçoivent leurs props via le type partagé
`ProductHeroResolvedProps` (consommé aussi par les variantes desktop/tablet
qui n'utilisent pas `heroBadges`). Ajouter `copy` à ce type partagé a un
blast radius plus large que pour homepage (cf. décision à trancher ci-dessous).

## Sous-lots proposés

### Sous-lot 0 — Migration dictionnaire (équivalent lot 3 homepage)

- Créer `entities/languages/fr/<zone>/product-page-copy_fr.ts` (recopie du
  contenu actuel de `product-page-copy.config.ts`).
- Réécrire `product-page-copy.config.ts` en "contrat fin" via
  `resolveLocaleContent`, sur le modèle de `features/homepage/config/homepage-copy.config.ts`.
- Aucun changement de comportement (même valeurs, même shape exporté).
- Vérification : `tsc --noEmit`, lecture des 4 consommateurs inchangée.

### Sous-lot 1 — Catalogue de champs traduisibles (= étape 2 du pattern)

- `entities/localization/product-page-copy-fields.ts` : `PRODUCT_PAGE_COPY_SUBJECT_TYPE`,
  `PRODUCT_PAGE_COPY_SUBJECT_ID`, `ProductPageCopyFieldDefinition`,
  `PRODUCT_PAGE_COPY_FIELDS` (8 champs : editorial.* ×5, heroBadges.* ×3 ;
  `jsonLdDefaultDescription` hors périmètre traduction — texte technique SEO,
  à confirmer).
- `getProductPageCopyFrValue` / `withProductPageCopyOverrides` (purs, testés).

### Sous-lot 2 — Query + action admin (= étape 3)

- `list-product-page-translations.query.ts`, `set-product-page-translations.action.ts`
  (gated `meetsLocalizationLevel("multilingual")`), même forme que homepage.

### Sous-lot 3 — Page admin (= étape 4)

- Étendre `/admin/settings/localization/translations` avec une section
  "Fiche produit" (ou nouvelle sous-page), réutilisant le composant de
  formulaire homepage généralisé si possible.

### Sous-lot 4 — Query storefront `getLocalizedProductPageCopy` (= étape 5a)

- `features/storefront/catalog/product-page/queries/get-localized-product-page-copy.query.ts`,
  fallback config si `multilingual` inactif / <2 locales / locale = défaut,
  même garde que `getLocalizedHomepageCopy`.

### Sous-lot 5 — Câblage storefront (= étape 5b)

- `app/(public)/boutique/[slug]/page.tsx` appelle `getLocalizedProductPageCopy`
  et passe `copy` :
  - à `ProductPageTemplate` → `ProductEditorialSection` (prop `copy?: ProductPageCopy["editorial"]`, défaut = config) — direct, pas de blast radius.
  - à `buildProductJsonLd` (paramètre `jsonLdDefaultDescription`, défaut = config) — direct.
  - aux variantes hero mobile pour `heroBadges.*` — **cf. décision ci-dessous**.

## Décision tranchée (2026-06-13)

Pour `heroBadges.*` (sous-lot 5) : **option 1 retenue** — props ciblées
mobile-only (`heroLocationLabel`, `heroUniquenessLabel`,
`heroUniquenessCompactLabel`) sur les 2 variantes mobile, sans toucher
`ProductHeroResolvedProps`.

<details>
<summary>Options envisagées</summary>

Pour `heroBadges.*` (sous-lot 5), deux options :

1. **Ajouter `copy: { heroBadges: ... }` à `ProductHeroResolvedProps`** (type
   partagé par les 4 variantes hero — mobile portrait/landscape + desktop/tablet,
   ces 2 dernières ne l'utilisant pas). Cohérent avec le pattern homepage
   (un seul objet `copy` threadé), mais élargit un type partagé à des
   composants qui n'en ont pas besoin.
2. **Props ciblées** (`heroLocationLabel`, `heroUniquenessLabel`,
   `heroUniquenessCompactLabel`) ajoutées uniquement aux 2 variantes mobile
   qui les utilisent, sans toucher `ProductHeroResolvedProps`. Moins
   uniforme avec homepage, mais respecte mieux "limiter le churn" /
   "préserver les contrats publics" (AGENTS.md) en ne touchant pas un type
   partagé desktop+mobile pour un besoin mobile-only.

</details>

## Hors périmètre (inchangé)

- Routing localisé / SEO multilingue (lot 5, toujours en pause).
- Traduction automatique (IA).
- Multi-devise.
- `jsonLdDefaultDescription` : à confirmer si traduisible (texte technique SEO,
  candidat pour rester hors catalogue de champs).

## Prochaine étape

Trancher la décision ci-dessus, puis exécuter sous-lots 0→5 un par un,
vérification + commit logique par sous-lot.
