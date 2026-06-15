<!-- docs/lots/2026-06-13-localization-boutique-page-cadrage.md -->

# Cadrage — Pilote `LocalizedValue` page boutique (3e pilote, lot 4 généralisation)

> Suite de `docs/lots/2026-06-13-localization-l4-generalisation-cadrage.md`.
> Pilotes précédents : `homepage` (lots 4.4/4.5), `product-page`
> (`docs/lots/2026-06-13-localization-product-page-cadrage.md`, fait).
> Ce document cadre le 3e pilote sur `boutique-copy.config.ts`, candidat
> retenu (page d'entrée catalogue, trafic élevé).

## État actuel

`features/storefront/catalog/boutique-page/config/boutique-copy.config.ts`
(39 lignes, `as const`) expose trois groupes :

- `header` : `defaultEyebrow`, `categoryEyebrowPrefix`, `intro` — 3 champs
  texte.
- `engagements` : `ariaLabel` — 1 champ texte (libellé ARIA, pas de
  contenu visible).
- `marketAside` : `ariaLabel`, `label`, `title`, `events` (tableau de
  3 champs × N entrées), `ctaLabel`, `uniqueBlock.{title,body}`.

Type exporté : `BoutiqueMarketEvent = (typeof boutiqueCopyConfig.marketAside.events)[number]`.

### Consommateurs (3)

| Fichier | Usage actuel |
|---|---|
| `components/header/boutique-page-header.tsx` | `const headerCopy = boutiqueCopyConfig.header` (module-level) → `headerCopy.defaultEyebrow`, `.categoryEyebrowPrefix`, `.intro` |
| `components/aside/boutique-market-aside.tsx` | `const asideCopy = boutiqueCopyConfig.marketAside` (module-level) → `.ariaLabel`, `.label`, `.title`, `.events`, `.ctaLabel`, `.uniqueBlock.{title,body}` |
| `components/boutique-page.tsx` | `boutiqueCopyConfig.engagements.ariaLabel` (inline) |

Page storefront : `app/(public)/boutique/page.tsx` → rend `<BoutiquePage model=... initialFavoriteProductIds=... />` (pas de prop copy aujourd'hui).

## Sous-lots (pattern lots 4.4/4.5, identique au pilote fiche produit)

### Sous-lot 0 — Thin contract `boutique-copy.config.ts`

- Créer `entities/languages/fr/boutique-page/boutique-page-copy_fr.ts` →
  `BOUTIQUE_PAGE_COPY_FR` (recopie exacte de `boutiqueCopyConfig`, `as const`).
- Réécrire `boutique-copy.config.ts` en thin contract via
  `resolveLocaleContent` (mêmes type/structure que `product-page-copy.config.ts`).
- `export type BoutiqueMarketEvent` dérivé du nouveau dictionnaire
  (`BoutiquePageCopy["marketAside"]["events"][number]`).
- Vérif : `tsc --noEmit`.

### Sous-lot 1 — Catalogue de champs `boutique-page-copy-fields.ts` + test

- `BOUTIQUE_PAGE_COPY_SUBJECT_TYPE`, `BOUTIQUE_PAGE_COPY_SUBJECT_ID`,
  `BoutiquePageCopyFieldDefinition`, `BOUTIQUE_PAGE_COPY_FIELDS`,
  `getBoutiquePageCopyFrValue`, `withBoutiquePageCopyOverrides`.
- Champs catalogués (scalaires, dotted-path) — voir décision ci-dessous
  pour `marketAside.events`.
- Test miroir `product-page-copy-fields.test.ts`.

### Sous-lot 2 — Query/action admin translations

- `list-boutique-page-translations.query.ts` + `set-boutique-page-translations.action.ts`
  (mêmes contrats que le pilote fiche produit, gated `multilingual`).
- `BoutiquePageTranslationsForm` (mirroir `ProductPageTranslationsForm`).

### Sous-lot 3 — Page admin translations

- Étendre `app/admin/(protected)/settings/advanced/@detail/[family]/localization/translations/page.tsx` :
  3e section "Page boutique", `Promise.all` à 3 queries.

### Sous-lot 4 — Query storefront `getLocalizedBoutiquePageCopy`

- Mirroir `getLocalizedProductPageCopy` / `getLocalizedHomepageCopy`.

### Sous-lot 5 — Câblage storefront

- `BoutiquePageHeader` : prop `copy?: BoutiquePageCopy["header"]`, défaut
  = config (remplace la constante module-level `headerCopy`).
- `BoutiqueMarketAside` : prop `copy?: BoutiquePageCopy["marketAside"]`,
  défaut = config (remplace `asideCopy`).
- `BoutiquePage` : prop `engagementsAriaLabel?: string` (ou `copy?: { engagements: ... }` —
  à trancher au sous-lot 5 selon cohérence avec les 2 props ci-dessus),
  + relai des `copy` vers `BoutiquePageHeader`/`BoutiqueMarketAside`.
- `app/(public)/boutique/page.tsx` : appel `getLocalizedBoutiquePageCopy()`
  (ajout au `Promise.all` existant), câblage vers `BoutiquePage`.
- Vérif : `tsc --noEmit`.

## Décision à trancher — `marketAside.events`

`marketAside.events` est un tableau d'objets (`dateLabel`, `name`,
`location`), commenté en l'état comme **placeholder** : *"Données
éditoriales marchés — à remplacer par une source CMS quand disponible."*

Le pattern `<Feature>CopyFieldDefinition` (sous-lots homepage/fiche produit)
cible des champs scalaires à `fieldName` dotted-path, pas des tableaux à
cardinalité variable.

**Proposition (recommandée) : `events` hors catalogue de champs pour ce
pilote.** Il reste dans le dictionnaire `BOUTIQUE_PAGE_COPY_FR` (donc
toujours présent dans `BoutiquePageCopy` et `BoutiqueMarketEvent`), mais
n'apparaît pas dans `BOUTIQUE_PAGE_COPY_FIELDS` ni dans le formulaire admin
translations — `withBoutiquePageCopyOverrides` le laisse inchangé. Sa
localisation/édition par l'admin reste un chantier ultérieur (probablement
au moment de la bascule vers une source CMS, cf. commentaire existant).

Alternative écartée : cataloguer `events[0].name`, `events[1].dateLabel`,
etc. — fragile (couplage à la cardinalité actuelle), hors doctrine "petits
changements sûrs".

## Hors périmètre (inchangé)

- Routing localisé / SEO multilingue (lot 5, en pause).
- Traduction automatique (IA).
- Multi-devise.
- `marketAside.events` (cf. décision ci-dessus) — reste statique.

## Prochaine étape

Confirmer la décision `marketAside.events`, puis exécuter sous-lots 0-5,
chacun vérifié par `tsc --noEmit`, dans l'ordre.

## Bilan d'exécution (2026-06-13)

Décision `marketAside.events` confirmée : hors catalogue (cf. ci-dessus).
Sous-lots 0→5 exécutés dans l'ordre, chacun vérifié `tsc --noEmit` (0 erreur).

### Fichiers créés

- `entities/languages/fr/boutique-page/boutique-page-copy_fr.ts` —
  `BOUTIQUE_PAGE_COPY_FR`, recopie exacte de l'ancien `boutiqueCopyConfig`.
- `entities/localization/boutique-page-copy-fields.ts` —
  `BOUTIQUE_PAGE_COPY_SUBJECT_TYPE`/`_SUBJECT_ID`, `BoutiquePageCopyFieldDefinition`,
  `BOUTIQUE_PAGE_COPY_FIELDS` (10 champs scalaires, `marketAside.events` exclu),
  `getBoutiquePageCopyFrValue`, `withBoutiquePageCopyOverrides` (généralisée
  profondeur ≥ 2, bail-out sur tableaux pour protéger `marketAside.events`).
- `tests/unit/entities/localization/boutique-page-copy-fields.test.ts` —
  miroir produit + cas spécifiques `marketAside.events` (non catalogué, non
  muté par un override hors-catalogue).
- `features/admin/settings/queries/list-boutique-page-translations.query.ts`
- `features/admin/settings/actions/set-boutique-page-translations.action.ts`
- `features/admin/settings/components/boutique-page-translations-form.tsx`
- `features/storefront/catalog/boutique-page/queries/get-localized-boutique-page-copy.query.ts`

### Fichiers modifiés

- `features/storefront/catalog/boutique-page/config/boutique-copy.config.ts` —
  thin contract via `resolveLocaleContent` (`BoutiquePageCopy`,
  `BoutiqueMarketEvent` dérivés du dictionnaire `fr`).
- `app/admin/(protected)/settings/advanced/@detail/[family]/localization/translations/page.tsx` —
  3e section "Page boutique" (`Promise.all` à 3 queries), conditionnelle sur
  `boutiquePageState.hasTargetLocale`.
- `features/admin/pilotage/components/settings-advanced/localization-module-shell.tsx` —
  description onglet "Traductions" : "Contenus traduits (accueil, fiche
  produit, page boutique)."
- `features/storefront/catalog/boutique-page/components/header/boutique-page-header.tsx` —
  prop `copy?: BoutiquePageCopy["header"]`, défaut config fr (remplace la
  constante module-level `headerCopy`).
- `features/storefront/catalog/boutique-page/components/aside/boutique-market-aside.tsx` —
  prop `copy?: BoutiquePageCopy["marketAside"]`, défaut config fr (remplace
  `asideCopy`) ; `events` toujours issu de `copy` (fr, hors catalogue).
- `features/storefront/catalog/boutique-page/components/boutique-page.tsx` —
  prop `copy?: BoutiquePageCopy` (défaut config fr), relayée à
  `BoutiquePageHeader`/`BoutiqueMarketAside`, et utilisée pour
  `engagements.ariaLabel`.
- `app/(public)/boutique/page.tsx` — ajout `getLocalizedBoutiquePageCopy()`
  au `Promise.all` existant, câblage `copy` vers `BoutiquePage`.

### Vérifications effectuées

- `tsc --noEmit -p tsconfig.json` : 0 erreur après chaque sous-lot et après
  le câblage final.
- Logique de `withBoutiquePageCopyOverrides` (override 2 et 3 niveaux,
  non-mutation de `base`, non-corruption de `marketAside.events`) vérifiée
  via script Node autonome (`npx vitest` indisponible en sandbox —
  `@rollup/rollup-linux-arm64-gnu` manquant, pré-existant).

### Non vérifié / hors périmètre

- `npx vitest run tests/unit/entities/localization/boutique-page-copy-fields.test.ts`
  non exécuté (environnement sandbox) — logique équivalente vérifiée
  manuellement (cf. ci-dessus).
- Pas de test e2e/visuel storefront ni admin.
- Pas de commit (sandbox sans accès `.git`).
- Routing localisé / SEO multilingue, traduction automatique, multi-devise,
  `marketAside.events` : toujours hors périmètre (inchangé).

### Écart restant

`docs/lots/2026-06-13-localization-l4-generalisation-cadrage.md` reste
non intégré (différé au lot suivant, décision antérieure) — 3 pilotes
(`homepage`, `product-page`, `boutique-page`) désormais terminés ; à mettre
à jour lors de l'intégration de ce document.
