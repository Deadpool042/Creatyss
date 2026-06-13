<!-- docs/lots/2026-06-13-localization-l2-cadrage.md -->

# Cadrage — `localization` niveau `multilingual` (lot 4, proposition à valider)

> **Statut : proposition.** Aucun code de ce cadrage n'est implémenté.
> Référence : `docs/lots/2026-06-12-localization-l1-cadrage.md` (lots 1-3
> faits), `docs/domains/cross-cutting/localization.md`.
>
> **Chantier en pause (2026-06-13)** — sous-lots 1-5 faits (cf. fiche
> domaine, « État d'implémentation »), niveau `multilingual` repassé à
> `managed` en attendant la suite. Reprise : généraliser `LocalizedValue`
> à d'autres contenus sur le pattern homepage.

## Objectif

Le lot 4 (« L2 `multilingual` ») est sizé « gros » dans le cadrage initial :
`LocalizedValue` câblé en lecture pour le contenu métier, fallbacks,
sélecteur de langue, admin de traduction. C'est trop large pour un seul lot
sûr — ce cadrage le découpe en sous-lots séquencés, chacun testable et
réversible indépendamment.

## Acquis (lots 1-3, faits au 2026-06-13)

- Flag `platform.localization` gradué (DRAFT), guard
  `meetsLocalizationLevel`.
- `LocalizationLocale` gérée : une seule locale active (défaut), admin
  `/admin/settings/localization` (liste + définir par défaut).
- Convention copy unifiée : `entities/languages/<locale>/...` (dictionnaires
  UI) + `resolveLocaleContent`. Pilote `homepage` migré.
- `LocalizedValue` modélisé en base, non consommé.

## Sous-lots proposés

1. **Activer une seconde locale (managed)** — petit — **fait
   (2026-06-13)** : `prisma/seed/localization-locales.seed.ts` seed une
   seconde `LocalizationLocale` (`en-GB`, `ACTIVE`, `isDefault: false`) pour
   le store, en plus de la locale par défaut. Idempotent et non destructif
   (`update: {}` — ne touche pas une locale déjà présente, par ex. promue
   par défaut ensuite via `set-default-localization-locale`). Premier cas
   concret d'une boutique multi-locales gérées, nécessaire pour exercer le
   fallback de `resolveLocalizedValue`. Zéro impact comportemental — flag
   `platform.localization` toujours DRAFT, aucun écran ne lit
   `LocalizedValue`. Reste à appliquer : `pnpm run db:seed` localement.

2. **Mécanisme de lecture `LocalizedValue` + fallback** — moyen —
   **fait (2026-06-13)** : règle pure
   `entities/localization/resolve-localized-value.ts`
   (`resolveLocalizedValue`, testée — valeur ACTIVE locale demandée,
   fallback locale par défaut, statuts non-ACTIVE ignorés, absence → null) ;
   query DB `features/localization/queries/get-localized-value.query.ts`
   (`getLocalizedValue`) qui résout les locales (par défaut + demandée) du
   store courant et applique la règle. Pas encore branché sur un écran.

3. **Sélecteur de langue storefront (sans routing)** — moyen, après 1-2 —
   **fait (2026-06-13)** : règle pure
   `entities/localization/resolve-preferred-locale.ts`
   (`resolvePreferredLocaleCode`, testée — cookie disponible, fallback
   locale par défaut si absent/invalide) ; cookie visiteur non signé
   `core/sessions/locale-preference.ts` (`creatyss_locale`,
   `readLocalePreferenceCookie` / `writeLocalePreferenceCookie`) ; queries
   `features/localization/queries/list-active-localization-locales.query.ts`
   (locales `ACTIVE` storefront) et
   `features/localization/queries/get-locale-selector-state.query.ts`
   (combine guard `meetsLocalizationLevel("multilingual")`, ≥2 locales
   actives, résolution cookie) ; action
   `features/localization/actions/set-locale-preference.action.ts`
   (`setLocalePreferenceAction`, valide `localeCode` contre les locales
   actives, écrit le cookie, `revalidatePath("/", "layout")`) ; composant
   serveur `components/storefront/topbar/locale-selector.tsx`
   (`LocaleSelector`, rend `null` si `!isVisible`) + formulaire client
   `locale-selector-form.tsx`. Intégré au layout storefront partagé :
   `app/layout.tsx` rend `<LocaleSelector />` et le passe à
   `PublicSiteShell` (nouvelle prop `localeSelector?: ReactNode`), qui le
   transmet à `TopbarPublic` (rendu dans `DesktopTopbar` et
   `MobileTopbar`). Niveau `multilingual` du flag toujours DRAFT par
   défaut — le sélecteur reste invisible (zéro impact visuel) tant qu'une
   décision produit explicite ne l'active pas.

4. **Admin de traduction minimal (pilote)** — moyen à gros, après 2 —
   **fait (2026-06-13)** : catalogue de champs
   `entities/localization/homepage-copy-fields.ts`
   (`HOMEPAGE_COPY_FIELDS`, 17 champs des 7 sections du dictionnaire
   `HOMEPAGE_COPY_FR` du lot 3, avec `label`/`group`/`multiline` ;
   `getHomepageCopyFrValue`, lecture pointée de la valeur de référence fr,
   testée) ; query
   `features/admin/settings/queries/list-homepage-translations.query.ts`
   (`listHomepageTranslations`, résout la locale secondaire `ACTIVE` du
   store et combine `HOMEPAGE_COPY_FIELDS` avec les `LocalizedValue`
   existantes — `{hasTargetLocale: false}` si aucune locale secondaire) ;
   action
   `features/admin/settings/actions/set-homepage-translations.action.ts`
   (`setHomepageTranslationsAction`, gated `meetsLocalizationLevel
   ("multilingual")`, upsert `LocalizedValue` par champ — `ACTIVE` si valeur
   non vide, `INACTIVE` sinon, clé `subjectType="homepage_copy"` /
   `subjectId="homepage"`) ; page admin
   `/admin/settings/localization/translations` (formulaire
   `HomepageTranslationsForm`, regroupé par section, référence fr en
   description de champ, état vide si pas de locale secondaire), reliée
   depuis `/admin/settings/localization`. CRUD limité au pilote homepage —
   référence pour les autres sujets (migration incrémentale ultérieure).
   Pas encore de câblage lecture multilingue (sous-lot 5).

5. **Câblage lecture multilingue du pilote** — moyen, après 2-4 — **fait
   (2026-06-13)**, pilote affiché (6 sections rendues sur `/`) : fonction
   pure `withHomepageCopyOverrides`
   (`entities/localization/homepage-copy-fields.ts`, testée) applique des
   overrides par chemin pointé sur `HOMEPAGE_COPY_FR`. Query
   `features/homepage/queries/get-localized-homepage-copy.query.ts`
   (`getLocalizedHomepageCopy`) : retombe sur `homepageCopyConfig` si
   `multilingual` inactif, store sans locale par défaut, < 2 locales actives,
   ou locale visiteur = locale par défaut ; sinon résout les
   `LocalizedValue` ACTIVE (`HOMEPAGE_COPY_FIELDS`) pour la locale visiteur
   (cookie + fallback `resolvePreferredLocaleCode`) et n'applique en
   override que les valeurs non-fallback via `resolveLocalizedValue`.
   `app/page.tsx` appelle la query et passe `copy` (prop optionnelle
   `copy?: HomepageCopy`, défaut `homepageCopyConfig`) à
   `HomepageHeroSection`, `HomepageEditorialSection`,
   `HomepageSavoirFaireSection`, `HomepageJournalSection`,
   `HomepageAboutSection`, `HomepageCollectionsSection`.
   `HomepageEventsSection` (non rendue sur `/`) reste hors périmètre. Flag
   `multilingual` toujours DRAFT → comportement par défaut inchangé.

Chaque sous-lot suit le pattern Horizon 4 : activation explicite, testable
indépendamment, invariants cœur préservés, fiche domaine mise à jour.

## Hors périmètre (rappel)

- Routing localisé (`/fr`, `/en`), SEO multilingue → lot 5
  (`localized-routing`).
- Migration des configs copy restantes (boutique, fiche produit, pages de
  contenu, admin) vers la convention dictionnaires.
- Traduction automatique (IA).
