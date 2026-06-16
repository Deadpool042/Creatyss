# Localization

## Rôle

Le domaine `localization` porte l’adaptation localisée transverse du système.

Il définit :

- ce qu’est une locale du point de vue du système ;
- comment sont portées les langues, variantes locales, valeurs localisées, règles d’applicabilité et fallbacks ;
- comment ce domaine se distingue des contenus source eux-mêmes, du pricing, du SEO, des pages, des contenus juridiques et des intégrations externes ;
- comment le système reste maître de sa vérité interne sur les structures localisées.

Le domaine existe pour fournir une représentation explicite de la localisation transverse, distincte :

- des pages éditoriales portées par `pages` ;
- des articles de blog portés par `blog` ;
- des produits publiés portés par `products` ;
- du pricing et des devises portés par `pricing` ou un domaine monétaire dédié ;
- du SEO porté par `seo` ;
- des contenus juridiques source portés par `legal` ;
- des DTO providers externes portés par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`oui`

Le domaine `localization` est activable.
Lorsqu’il est activé, il devient structurant pour les langues, variantes locales, fallbacks et expositions multilingues ou multi-marchés.

---

## Source de vérité

Le domaine `localization` est la source de vérité pour :

- les locales supportées ;
- les variantes locales ou marchés lorsqu’ils sont portés ici ;
- les valeurs localisées structurées ;
- les règles d’applicabilité, de fallback ou d’exposition locale ;
- les politiques de publication ou d’activation des localisations ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `localization` n’est pas la source de vérité pour :

- les pages éditoriales, qui relèvent de `pages` ;
- les articles de blog, qui relèvent de `blog` ;
- les produits publiés, qui relèvent de `products` ;
- les prix ou devises, qui relèvent de `pricing` ;
- le SEO transverse lui-même, qui relève de `seo` ;
- les contenus juridiques source eux-mêmes, qui relèvent de `legal` ;
- les DTO providers externes.

Une localisation est une adaptation transverse gouvernée.
Elle ne doit pas être confondue avec :

- le contenu source complet ;
- une simple traduction libre hors contexte ;
- une règle de pricing ;
- une règle SEO ;
- un dictionnaire technique global sans langage métier.

---

## Responsabilités

Le domaine `localization` est responsable de :

- définir ce qu’est une locale dans le système ;
- porter les langues et variantes locales supportées ;
- porter les valeurs ou contenus localisés structurés lorsqu’ils sont gouvernés transversalement ;
- porter les règles d’applicabilité, de fallback et d’exposition locale ;
- exposer une lecture gouvernée de ce qui est localisé et applicable dans un contexte donné ;
- publier les événements significatifs liés à la vie d’une localisation ;
- protéger le système contre les structures localisées implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- locales par boutique ;
- marchés locaux ;
- traductions de champs transverses ;
- fallbacks de langue ;
- variantes par marché ;
- politiques de publication locale ;
- activation ou désactivation de localisations ;
- cohérence de l’exposition multilingue.

---

## Non-responsabilités

Le domaine `localization` n’est pas responsable de :

- porter les pages éditoriales ;
- porter les articles de blog ;
- porter les produits publiés ;
- porter les prix ou devises ;
- porter le SEO transverse lui-même ;
- porter les contenus juridiques source ;
- exécuter les intégrations provider-specific ;
- devenir un simple dictionnaire technique global sans rattachement aux objets du système.

Le domaine `localization` ne doit pas devenir :

- un doublon de `pages` ;
- un doublon de `blog` ;
- un doublon de `products` ;
- un doublon de `pricing` ;
- un doublon de `seo` ;
- un conteneur flou de traductions sans gouvernance de contexte.

---

## Invariants

Les invariants minimaux sont les suivants :

- une valeur localisée est rattachée à un objet source explicite et à une locale explicite ;
- une règle de fallback ou d’exposition possède une signification explicite ;
- `localization` ne se confond pas avec `pages` ;
- `localization` ne se confond pas avec `blog` ;
- `localization` ne se confond pas avec `products` ;
- `localization` ne se confond pas avec `pricing` ;
- `localization` ne se confond pas avec `seo` ;
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de localisation transverse quand le cadre commun `localization` existe ;
- une valeur localisée inapplicable, inactive ou non publiée ne doit pas être exposée hors règle explicite.

Le domaine protège la cohérence de l’adaptation localisée transverse.

---

## Dépendances

### Dépendances métier

Le domaine `localization` interagit fortement avec :

- `stores`
- `pages`
- `blog`
- `products`
- `seo`
- `legal`
- `template-system`
- `search`

### Dépendances transverses

Le domaine dépend également de :

- `approval`, si certaines publications localisées nécessitent validation préalable
- `workflow`, si certaines localisations suivent un processus structuré
- `audit`
- `observability`
- `dashboarding`

### Dépendances externes

Le domaine peut être relié indirectement à :

- services de traduction ;
- CMS de traduction ;
- référentiels marchés externes ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `localization` porte l’adaptation localisée transverse.
Il ne doit pas absorber :

- les contenus source ;
- le pricing ;
- le SEO lui-même ;
- les contenus juridiques source ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `localization` publie ou peut publier des événements significatifs tels que :

- locale créée ;
- locale mise à jour ;
- valeur localisée mise à jour ;
- règle de localisation mise à jour ;
- politique de localisation mise à jour ;
- statut de localisation modifié.

Le domaine peut consommer des signaux liés à :

- capability boutique modifiée ;
- page mise à jour ;
- article de blog mis à jour ;
- produit mis à jour ;
- métadonnée SEO mise à jour ;
- document juridique mis à jour ;
- approbation accordée ;
- workflow terminé ;
- action administrative structurée de publication ou de correction de localisation.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `localization` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- active ;
- inactive ;
- publiée, si pertinent ;
- archivée, si pertinent.

Des états supplémentaires peuvent exister :

- brouillon ;
- en révision ;
- fallback ;
- restreinte ;
- expirée.

Le domaine doit éviter :

- les localisations “fantômes” ;
- les changements silencieux de fallback ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `localization` expose principalement :

- des locales structurées ;
- des valeurs ou contenus localisés structurés ;
- des règles de fallback ou d’applicabilité locale ;
- des lectures exploitables par `pages`, `blog`, `products`, `seo`, `legal`, `template-system`, `search`, `dashboarding` et certaines couches d’administration ;
- des structures localisées prêtes à être consommées par les couches UI ou domaines opérationnels autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de locales supportées ;
- des demandes de traduction ou de mise à jour de valeurs localisées ;
- des demandes de lecture d’une valeur localisée applicable dans un contexte donné ;
- des changements de règles de fallback, de disponibilité ou d’exposition locale ;
- des contextes de boutique, langue, pays, marché, audience, canal ou surface d’exposition ;
- des signaux internes utiles à l’activation, la désactivation ou la substitution d’une localisation.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `localization` peut être exposé à des contraintes telles que :

- multi-langues ;
- multi-boutiques ;
- multi-marchés ;
- fallback de langue ;
- publication différée ;
- dépendance à des contextes locaux ;
- synchronisation avec systèmes externes ;
- rétrocompatibilité des locales ou politiques.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des structures localisées reste dans `localization` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une localisation incohérente ne doit pas être promue silencieusement ;
- les conflits entre locale, fallback, statut et exposition doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `localization` manipule des contenus susceptibles d’impacter fortement l’exposition publique, la cohérence juridique ou la compréhension fonctionnelle de la boutique.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre objet source, valeur localisée, règle de fallback et politique d’exposition ;
- protection des localisations non publiées, incomplètes ou réservées à certains contextes ;
- limitation de l’exposition selon le rôle, le scope, la langue, le marché et le statut ;
- audit des changements significatifs de traduction, de fallback ou de politique locale.

---

## Observabilité et audit

Le domaine `localization` doit rendre visibles au minimum :

- quelle locale est en vigueur ;
- quelle valeur localisée a été retenue ;
- quelle règle de fallback ou d’applicabilité a été utilisée ;
- pourquoi une valeur localisée est absente, remplacée, fallbackée ou non exposée ;
- si une localisation n’est pas disponible à cause d’une capability inactive, d’un statut inactif, d’un contexte non compatible ou d’une règle applicable.

L’audit doit permettre de répondre à des questions comme :

- quelle locale ou valeur localisée a été créée ou modifiée ;
- quand ;
- selon quelle origine ;
- avec quelle règle de fallback ou politique appliquée ;
- avec quelle action manuelle significative ;
- avec quel impact sur l’exposition locale.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- locale non supportée ;
- valeur localisée absente ;
- règle de fallback incohérente ;
- exposition refusée ;
- contexte non compatible.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `LocaleDefinition` : langue, variante locale ou marché supporté ;
- `LocalizedValue` : valeur localisée structurée ;
- `LocalizationRule` : règle d’applicabilité, de fallback ou d’exposition locale ;
- `LocalizationPolicy` : règle de gouvernance ou de publication des localisations ;
- `LocalizationStatus` : état d’une localisation ou d’une locale ;
- `LocalizationSubjectRef` : référence vers l’objet source concerné.

---

## Impact de maintenance / exploitation

Le domaine `localization` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il structure l’exposition multilingue et multi-marchés ;
- ses erreurs dégradent compréhension, cohérence publique et parfois conformité ;
- il se situe à la frontière entre plusieurs domaines source ;
- il nécessite une forte explicabilité des fallbacks et statuts ;
- il dépend souvent de capacités activables et de contextes multiples.

En exploitation, une attention particulière doit être portée à :

- la cohérence des locales ;
- la validité des valeurs localisées ;
- les fallbacks incohérents ;
- la traçabilité des changements ;
- la cohérence avec les domaines source ;
- les effets de bord sur storefront, SEO, juridique et template-system.

Le domaine doit être considéré comme structurant dès qu’une exposition localisée réelle existe.

---

## Limites du domaine

Le domaine `localization` s’arrête :

- avant les contenus source ;
- avant le pricing et les devises ;
- avant le SEO transverse lui-même ;
- avant les contenus juridiques source ;
- avant les intégrations externes ;
- avant les DTO providers externes.

Le domaine `localization` porte l’adaptation localisée transverse du système.
Il ne doit pas devenir un simple dictionnaire technique global ni un doublon des domaines source.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `localization` et `pages` ;
- la frontière exacte entre `localization` et `products` ;
- la frontière exacte entre `localization` et `seo` ;
- la part exacte des fallbacks réellement supportés ;
- la gouvernance des marchés vs langues ;
- la hiérarchie entre vérité interne et services externes de traduction éventuels.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## État d'implémentation

> **Lots 1-5 implémentés (2026-06-16).** Le flag `platform.localization`
> couvre désormais les niveaux `managed`, `multilingual` et
> `localized-routing`. Le routing localisé (lot 5 / L3) est fonctionnel :
> `proxy.ts` (migration Next.js 16 depuis `middleware.ts`) gère les rewrites
> et redirects de locale, le layout injecte `lang` dynamiquement et gate L3,
> `generateMetadata` produit les alternates hreflang, `app/sitemap.ts` expose
> les URLs localisées quand L3 est actif, et le sélecteur de langue redirige
> vers l'URL localisée (ou non préfixée) selon l'état du flag.
> Reste hors périmètre : migration des configs copy restantes (cf.
> `docs/lots/2026-06-13-localization-l4-generalisation-cadrage.md`),
> câblage multilingue de `HomepageEventsSection`.
> Configuration Edge-safe : `core/localization/supported-locales.ts`
> (`DEFAULT_LOCALE_CODE = "fr"`, `SECONDARY_LOCALE_CODES = ["en-GB"]`).
> À supprimer manuellement : `git rm middleware.ts`.

Référence : `docs/lots/2026-06-12-localization-l1-cadrage.md`.

- **Lot 1 (2026-06-13)** : flag `platform.localization` seedé en DRAFT
  (`allowedLevels = ["managed", "multilingual", "localized-routing"]`,
  `defaultLevel = "managed"`) ; premier guard gradué du repo
  (`getLocalizationFeatureState` / `meetsLocalizationLevel`, cf.
  `features/localization/queries/get-localization-feature-state.query.ts`).
- **Lot 2 (2026-06-13)** : niveau `managed` câblé — `LocalizationLocale`
  devient une donnée gérée. La locale par défaut du store est seedée
  (`prisma/seed/localization-locales.seed.ts`, cohérente avec
  `Store.defaultLocaleCode`). Admin minimal (`/admin/settings/localization`,
  gardé par `meetsLocalizationLevel("managed")`) : liste des locales du store
  et action « définir par défaut »
  (`features/admin/settings/actions/set-default-localization-locale.action.ts`)
  qui maintient `LocalizationLocale.isDefault` et `Store.defaultLocaleCode`
  cohérents dans une même transaction.

- **Lot 3 (2026-06-13, mécanisme + pilote)** : convention copy unifiée
  appliquée (cf. cadrage, « Décision préalable » — convergence configs ↔
  dictionnaires validée). Mécanisme pur
  `entities/languages/resolve-locale-content.ts` (testé) : résout le
  dictionnaire de la locale demandée, sinon celui de la locale par défaut.
  Pilote `homepage` : contenu déplacé vers
  `entities/languages/fr/homepage/homepage-copy_fr.ts` (`HOMEPAGE_COPY_FR`) ;
  `features/homepage/config/homepage-copy.config.ts` reste le contrat
  (forme/clés) et résout `homepageCopyConfig` via `resolveLocaleContent`
  (locale par défaut `fr`, même chemin qu'une future locale secondaire à
  L2). Aucun composant homepage modifié. Les autres configs copy
  (storefront boutique/fiche produit/pages de contenu, admin) restent en
  l'état — migration incrémentale, hors périmètre de ce lot.

- **Lot 4 sous-lot 1 (2026-06-13)** : seconde `LocalizationLocale` gérée
  (`en-GB`, `ACTIVE`, `isDefault: false`) seedée pour le store
  (`prisma/seed/localization-locales.seed.ts`), en plus de la locale par
  défaut — premier cas concret multi-locales, zéro impact comportemental
  (flag DRAFT). Reste à appliquer via `pnpm run db:seed` localement.
- **Lot 4 sous-lot 2 (2026-06-13)** : mécanisme de lecture `LocalizedValue`
  avec fallback (cf. `docs/lots/2026-06-13-localization-l2-cadrage.md`).
  Règle pure `entities/localization/resolve-localized-value.ts`
  (`resolveLocalizedValue`, testée) — une valeur `ACTIVE` de la locale
  demandée est retenue, sinon celle de la locale par défaut (fallback
  explicite), sinon `null`. Query
  `features/localization/queries/get-localized-value.query.ts`
  (`getLocalizedValue`) résout les locales du store courant et applique la
  règle. Mécanisme seul — non branché sur un écran.

- **Lot 4 sous-lot 3 (2026-06-13)** : sélecteur de langue storefront, sans
  routing (cf. `docs/lots/2026-06-13-localization-l2-cadrage.md`). Règle
  pure `entities/localization/resolve-preferred-locale.ts`
  (`resolvePreferredLocaleCode`, testée) : retient la préférence du cookie
  si elle correspond à une locale active, sinon la locale par défaut.
  Préférence portée par un cookie visiteur non signé
  (`core/sessions/locale-preference.ts`, `creatyss_locale`) — pas de donnée
  sensible, revalidée systématiquement contre les locales actives. Query
  `features/localization/queries/list-active-localization-locales.query.ts`
  (locales `ACTIVE` storefront) et
  `features/localization/queries/get-locale-selector-state.query.ts`
  (combine `meetsLocalizationLevel("multilingual")`, ≥2 locales actives,
  résolution cookie). Action
  `features/localization/actions/set-locale-preference.action.ts`
  (`setLocalePreferenceAction`) valide et écrit la préférence. Composant
  serveur `components/storefront/topbar/locale-selector.tsx`
  (`LocaleSelector`, `null` si non visible) intégré au layout storefront
  partagé via `app/layout.tsx` → `PublicSiteShell` (prop
  `localeSelector?: ReactNode`) → `TopbarPublic` (rendu dans
  `DesktopTopbar` et `MobileTopbar`). Niveau `multilingual` du flag
  toujours DRAFT — sélecteur invisible par défaut, zéro impact visuel.

- **Lot 4 sous-lot 4 (2026-06-13)** : admin de traduction minimal, pilote
  homepage (cf. `docs/lots/2026-06-13-localization-l2-cadrage.md`).
  Catalogue `entities/localization/homepage-copy-fields.ts`
  (`HOMEPAGE_COPY_FIELDS`, 17 champs des 7 sections de `HOMEPAGE_COPY_FR` ;
  `getHomepageCopyFrValue`, testée). Query
  `features/admin/settings/queries/list-homepage-translations.query.ts`
  (`listHomepageTranslations`) résout la locale secondaire `ACTIVE` du
  store et combine le catalogue avec les `LocalizedValue` existantes
  (`{hasTargetLocale: false}` si aucune locale secondaire). Action
  `features/admin/settings/actions/set-homepage-translations.action.ts`
  (`setHomepageTranslationsAction`, gated `meetsLocalizationLevel
  ("multilingual")`) upsert un `LocalizedValue` par champ
  (`subjectType="homepage_copy"`, `subjectId="homepage"`) — `ACTIVE` si
  valeur non vide, `INACTIVE` sinon. Page admin
  `/admin/settings/localization/translations`
  (`HomepageTranslationsForm`, regroupée par section, référence fr en
  description de champ), reliée depuis `/admin/settings/localization`
  lorsque `multilingual` est actif. CRUD limité au pilote homepage —
  référence pour les autres sujets. Pas encore de câblage lecture
  multilingue (sous-lot 5) : les traductions saisies ne sont pas encore
  consommées par la homepage.

- **Lot 4 sous-lot 5 (2026-06-13)** : câblage lecture multilingue du pilote
  homepage (cf. `docs/lots/2026-06-13-localization-l2-cadrage.md`), pilote
  affiché (6 sections rendues sur `/`). Fonction pure
  `withHomepageCopyOverrides` (`entities/localization/homepage-copy-fields.ts`,
  testée) construit une copie de `HOMEPAGE_COPY_FR` avec overrides par
  chemin pointé. Query
  `features/homepage/queries/get-localized-homepage-copy.query.ts`
  (`getLocalizedHomepageCopy`) : si `multilingual` inactif, store sans
  locale par défaut, moins de deux locales actives, ou locale visiteur =
  locale par défaut → retourne `homepageCopyConfig` inchangé ; sinon résout
  les `LocalizedValue` ACTIVE du pilote (`HOMEPAGE_COPY_FIELDS`) pour la
  locale visiteur (cookie `creatyss_locale` + fallback) et n'applique en
  override que les valeurs non-fallback. `app/page.tsx` appelle cette query
  et passe `copy` (prop optionnelle `copy?: HomepageCopy`, défaut
  `homepageCopyConfig`) à `HomepageHeroSection`,
  `HomepageEditorialSection`, `HomepageSavoirFaireSection`,
  `HomepageJournalSection`, `HomepageAboutSection`,
  `HomepageCollectionsSection`. `HomepageEventsSection` (non rendue sur `/`)
  reste hors périmètre. Comportement par défaut inchangé : flag
  `multilingual` toujours DRAFT → `getLocalizedHomepageCopy` retourne
  `homepageCopyConfig` tel quel.

Reste hors périmètre : routing localisé (lot 5 — niveau
`localized-routing`), migration des configs copy restantes vers la
convention dictionnaires, câblage multilingue de `HomepageEventsSection` et
des sujets hors pilote homepage.
Le flag restant en DRAFT, l'admin et l'entrée de navigation associée ne sont
pas visibles tant qu'une décision produit n'active pas la feature.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/foundation/stores.md`
- `../optional/pages.md`
- `../optional/blog.md`
- `../core/catalog/products.md`
- `seo.md`
- `legal.md`
- `template-system.md`
- `search.md`
- `approval.md`
- `workflow.md`
- `audit.md`
- `observability.md`
- `dashboarding.md`
- `../core/commerce/pricing.md`
- `../optional/platform/integrations.md`
