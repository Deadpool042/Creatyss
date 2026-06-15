<!-- docs/lots/2026-06-13-localization-l4-generalisation-cadrage.md -->

# Cadrage — Généraliser `LocalizedValue` à un second pilote (reprise lot 4)

> **Statut : 2 pilotes faits, 1 candidat restant.** Décision 2026-06-13
> (suite à `docs/roadmap/2026-06-13-audit-catalogue-modules.md`) : ne pas
> lancer `localized-routing` (lot 5, `docs/lots/2026-06-13-localization-l3-cadrage.md`,
> toujours en pause) — reprendre plutôt le chantier en généralisant la
> convention `entities/languages/<locale>/...` + `LocalizedValue` à un
> contenu autre que `homepage`, sur le pattern des sous-lots 4.4/4.5
> (`docs/lots/2026-06-13-localization-l2-cadrage.md`).
>
> Pilotes réalisés : `product-page-copy.config.ts`
> (`docs/lots/2026-06-13-localization-product-page-cadrage.md`, fait) et
> `boutique-copy.config.ts`
> (`docs/lots/2026-06-13-localization-boutique-page-cadrage.md`, fait).
> Candidat restant : `content-pages-copy.config.ts` (cf. tableau ci-dessous).

## Rappel du pattern (lots 4.4-4.5, fait pour `homepage`)

1. Dictionnaire `entities/languages/fr/<zone>/<feature>-copy_fr.ts` (contenu
   de référence, recopie la config existante).
2. Catalogue de champs traduisibles `entities/localization/<feature>-copy-fields.ts`
   (`subjectType`/`subjectId`/`fieldName` pointé, `withXCopyOverrides`).
3. Query admin `list-X-translations.query.ts` + action
   `set-X-translations.action.ts` (gated `meetsLocalizationLevel("multilingual")`).
4. Page admin `/admin/settings/localization/translations` (étendre la page
   existante ou nouvelle section).
5. Query storefront `getLocalizedXCopy` (fallback config si `multilingual`
   inactif / <2 locales / locale = défaut) + câblage dans le(s) composant(s)
   concerné(s) (`copy?: XCopy`, défaut = config existante).

Chaque étape est un sous-lot testable, réversible, flag `multilingual`
toujours DRAFT par défaut → zéro impact si non activé.

## Candidats (configs copy existantes, R1)

| Config | Lignes | Pages/composants consommateurs | Note | Statut |
|---|---|---|---|---|
| `features/storefront/catalog/product-page/config/product-page-copy.config.ts` | 29 | fiche produit (`app/(public)/boutique/[slug]`) | le plus petit ; un seul écran storefront | **Fait** (`docs/lots/2026-06-13-localization-product-page-cadrage.md`) |
| `features/storefront/catalog/boutique-page/config/boutique-copy.config.ts` | 39 | page boutique (listing) | page d'entrée catalogue, trafic élevé | **Fait** (`docs/lots/2026-06-13-localization-boutique-page-cadrage.md`) |
| `features/storefront/content/config/content-pages-copy.config.ts` | 68 | `a-propos`, `les-marchés`, `contact` (3 pages) | plus gros, 3 sous-sujets — candidat à découper en 3 pilotes successifs si retenu | À cadrer |

## Bilan (2026-06-13)

Les 2 premiers pilotes (`product-page`, `boutique-page`) ont validé que le
pattern lots 4.4/4.5 se généralise sans ajustement majeur, avec une
extension notable pour `boutique-page` :
`withBoutiquePageCopyOverrides` généralisé aux chemins pointés de
profondeur ≥ 2 (`marketAside.uniqueBlock.title`), avec bail-out sur les
champs tableau (`marketAside.events`, hors catalogue).

Reste `content-pages-copy.config.ts` (3 sous-sujets `a-propos`,
`les-marchés`, `contact`) — plus gros, à cadrer séparément (probablement
3 pilotes successifs comme suggéré initialement).

## Hors périmètre (inchangé)

- Routing localisé / SEO multilingue (lot 5, toujours en pause).
- Traduction automatique (IA).
- Multi-devise.

## Prochaine étape proposée

Cadrer `content-pages-copy.config.ts` (4e pilote) si le chantier de
généralisation L4 se poursuit, sur le même pattern (sous-lots 0-5, un par
sous-sujet ou mutualisés selon le cadrage).
