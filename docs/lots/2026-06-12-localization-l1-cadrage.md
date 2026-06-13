<!-- docs/lots/2026-06-12-localization-l1-cadrage.md -->

# Cadrage — `localization` graduée (proposition à valider)

> **Statut : proposition.** Aucun code de ce cadrage n'est implémenté.
> Référence doctrine : `docs/domains/cross-cutting/localization.md` (fiche),
> `feature-governance.md` (gradation), roadmap Horizon 4 (pattern canonique).

## Objectif

Faire de `localization` la première capacité graduée de référence : elle
valide le pattern complet — toggle DB, niveaux, guard gradué, prérequis socle
— et ouvre le multilangue sans refonte.

## Acquis (prérequis socle, faits au 2026-06-12)

- Copy extrait des composants : `core/config/brand.ts` +
  `features/<domaine>/config/*.config.ts` (storefront, homepage, catalogue,
  pages de contenu) ; garde anti-régression unitaire.
- Mécanisme de gradation porté par le schéma (`FeatureFlag.allowedLevels`,
  `defaultLevel`, `Override.level`) + règles pures
  (`entities/feature-flags/feature-level.ts`), testées.
- Modèles `LocalizationLocale` / `LocalizedValue` déjà en base
  (`prisma/optional/platform/localization.prisma`), `Store.defaultLocaleCode`
  existant.
- Embryon de dictionnaire par locale :
  `entities/languages/fr/admin/dashboard/dashboard_fr.ts`.

## Niveaux proposés (flag `platform.localization`)

`allowedLevels = ["managed", "multilingual", "localized-routing"]`

| État | Comportement |
| --- | --- |
| désactivé | Mono-langue implicite : le copy vit dans les configs/dictionnaires de la locale par défaut. Zéro impact. État actuel. |
| `managed` (L1) | Les locales deviennent une donnée gérée : `LocalizationLocale` administrée, locale par défaut explicite et cohérente avec `Store.defaultLocaleCode`. Une seule locale active. Pas de routing. |
| `multilingual` (L2) | Plusieurs locales actives : dictionnaires UI par locale, `LocalizedValue` pour le contenu métier (produits, pages, homepage), fallbacks vers la locale par défaut. Sélecteur de langue sans routing dédié. |
| `localized-routing` (L3) | Routing localisé (`/fr`, `/en`), SEO multilingue (hreflang, sitemaps par locale). |

## Décision préalable à trancher — convention de copy unique

Deux conventions coexistent :

1. `features/<domaine>/config/*.config.ts` — copy par feature, neutre en
   locale (posée aujourd'hui, R1/R2) ;
2. `entities/languages/<locale>/<zone>/<feature>_<locale>.ts` — dictionnaire
   par locale (embryon existant).

Proposition de convergence : les configs de feature restent le **contrat**
(forme et clés du copy, consommées par les composants) ; à l'activation L2,
leur **contenu** est résolu par locale via les dictionnaires
`entities/languages/<locale>/`, la config actuelle devenant le dictionnaire
de la locale par défaut. Ainsi R1/R2 ne sont pas du travail jeté et les
composants ne changent pas une seconde fois.

À valider avant le lot 3.

## Lots séquencés

1. **Flag + guard gradué** (petit) — **fait (2026-06-13)** : seed du flag
   `platform.localization` (DRAFT, `allowedLevels` ci-dessus), query guard
   `get-localization-feature-state` branchant `resolveEffectiveLevel` /
   `meetsRequiredLevel`. Premier guard gradué du repo — valide le mécanisme.
2. **L1 `managed`** (moyen) — **fait (2026-06-13)** : admin minimal des
   locales (liste + défaut) sous `/admin/settings/localization`, gardé par
   `meetsLocalizationLevel("managed")` ; `Store.defaultLocaleCode` et
   `LocalizationLocale.isDefault` maintenus cohérents (seed + action
   `set-default-localization-locale`).
3. **Convention copy unifiée** (moyen, après décision) — **fait (2026-06-13,
   mécanisme + pilote)** : convention validée appliquée via
   `entities/languages/resolve-locale-content.ts` (fonction pure, testée) ;
   pilote `homepage` migré — contenu déplacé vers
   `entities/languages/fr/homepage/homepage-copy_fr.ts`
   (`HOMEPAGE_COPY_FR`), `features/homepage/config/homepage-copy.config.ts`
   devient le contrat et résout `homepageCopyConfig` via
   `resolveLocaleContent` (locale par défaut `fr`, même chemin qu'une future
   locale secondaire). Forme et valeurs de `homepageCopyConfig` inchangées :
   aucun composant homepage modifié. Les autres configs copy (boutique,
   fiche produit, pages de contenu, admin) restent en l'état — migration
   incrémentale au fil des prochains lots, pas de bascule large non
   demandée.
4. **L2 `multilingual`** (gros) : `LocalizedValue` câblé en lecture pour le
   contenu métier, fallbacks, sélecteur de langue, admin de traduction.
5. **L3 `localized-routing`** (gros) : segments de route localisés, SEO.

Chaque lot suit le pattern Horizon 4 : activation explicite, testable
indépendamment, invariants cœur préservés, fiche domaine mise à jour.

## Hors périmètre

- Multi-devise (hors périmètre assumé de la roadmap).
- Traduction automatique (IA) — capacité distincte.
- Localisation du pricing, du légal source, des emails transactionnels
  (extensions ultérieures, chacune via son domaine propriétaire).
