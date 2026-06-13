<!-- docs/lots/2026-06-13-localization-l3-cadrage.md -->

# Cadrage — `localization` niveau `localized-routing` (lot 5, proposition à valider)

> **Statut : proposition.** Aucun code de ce cadrage n'est implémenté.
> Référence : `docs/lots/2026-06-12-localization-l1-cadrage.md`,
> `docs/lots/2026-06-13-localization-l2-cadrage.md` (lots 1-4 faits),
> `docs/domains/cross-cutting/localization.md`,
> `docs/domains/cross-cutting/seo.md`.
>
> **Chantier en pause (2026-06-13)** — décisions 1-5 ci-dessous non
> tranchées, aucun sous-lot proposé. À reprendre après le chantier en
> cours sur un autre périmètre.

## Objectif

Le lot 5 (« L3 `localized-routing` ») est le dernier niveau gradué de
`platform.localization` : routing localisé (`/fr`, `/en`, …) et SEO
multilingue (hreflang, sitemaps par locale). Il est sizé « gros » dans le
cadrage initial. Ce cadrage fait l'état des lieux du repo réel et identifie
la décision d'architecture préalable avant tout découpage en sous-lots —
**aucun sous-lot d'implémentation n'est proposé à ce stade**.

## Acquis (lots 1-4, faits au 2026-06-13)

- Flag `platform.localization` gradué (DRAFT), guard
  `meetsLocalizationLevel`, niveaux `managed` et `multilingual` faits.
- `LocalizationLocale` gérée (locale par défaut + une locale secondaire
  `en-GB` seedée), admin `/admin/settings/localization`.
- Convention copy unifiée (`entities/languages/<locale>/...` +
  `resolveLocaleContent`), pilote `homepage`.
- `LocalizedValue` câblé en lecture pour le pilote homepage, avec admin de
  traduction et fallback vers la locale par défaut.
- Sélecteur de langue storefront **sans routing** (lot 4 sous-lot 3) : la
  locale active est portée par un cookie visiteur non signé
  (`creatyss_locale`, `core/sessions/locale-preference.ts`), résolue par
  `resolvePreferredLocaleCode` (préférence cookie si locale active, sinon
  locale par défaut du store). Aucune URL ne varie selon la locale.

## État des lieux (constat factuel)

- **Routing storefront** : `app/` ne contient aucun segment dynamique de
  type `app/[locale]/...`. Le storefront vit sous `app/(public)/` (group
  de routes, préfixe non visible dans l'URL) + fichiers racine (`page.tsx`,
  `layout.tsx`, `error.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts`).
  L'admin vit sous `app/admin/`.
- **Middleware** : aucun `middleware.ts`, ni à la racine ni dans `app/`.
  Aucune détection ou redirection de locale au niveau requête.
- **`next.config.ts`** : pas de config `i18n` (Pages Router legacy), pas de
  `rewrites`/`redirects` liés à la locale. Seuls les `instanceRedirects`
  (hors sujet localisation) sont configurés.
- **`app/layout.tsx`** : `<html lang="fr">` codé en dur, ne dépend d'aucune
  locale runtime. `<LocaleSelector />` (lot 4.3) est rendu dans
  `PublicSiteShell`, mais ne change aucune URL — uniquement le cookie
  `creatyss_locale` puis `revalidatePath("/", "layout")`.
- **SEO** : `docs/domains/cross-cutting/seo.md` ne mentionne ni `hreflang`
  ni `alternate links` ni sitemap par locale. `app/sitemap.ts` et
  `app/robots.ts` produisent une sortie unique, sans variation de locale ;
  les URLs du sitemap (`/boutique`, `/blog/<slug>`, etc.) n'ont pas
  d'équivalent par locale.
- **Aucun code runtime** n'implémente `hreflang`, `alternate`, segment
  `[locale]` ou logique de routing localisé. Les seules mentions de
  `localized-routing` sont dans la doc de cadrage et dans le catalogue de
  features (`allowedLevels` du flag).

## Enjeu et risque

Un routing localisé par préfixe d'URL (`/fr/...`, `/en/...`) implique, pour
être cohérent :

- déplacer l'ensemble de `app/(public)/` (et les fichiers racine
  `page.tsx`, `layout.tsx`, `sitemap.ts`, `robots.ts`, `error.tsx`,
  `not-found.tsx`) sous un segment `app/[locale]/...` ;
- introduire un `middleware.ts` de détection/redirection de locale (premier
  middleware du repo) ;
- décider du traitement de la locale par défaut (préfixée comme les autres,
  ou non préfixée — deux conventions i18n courantes aux implications SEO et
  de routing différentes) ;
- faire calculer `<html lang>` dynamiquement par locale active ;
- générer des sitemaps et des balises `hreflang`/`alternate` par locale,
  pour des URLs qui n'existent pas encore aujourd'hui ;
- garantir que `app/admin/**` et `app/api/**` restent **hors** du segment
  `[locale]` (aucun changement d'URL admin/API).

C'est une refonte structurelle qui touche **toutes** les routes storefront
existantes (catalogue, fiches produit, blog, pages légales, checkout,
compte client, etc.), à fort risque de régression de routing — directement
en tension avec les règles de prudence du repo (« plus petits changements
sûrs », « pas de refactor opportuniste hors périmètre », « ne jamais
modifier silencieusement un contrat public »). Toutes les routes
storefront sont des contrats publics (URLs indexées, partagées, en
production).

## Décision préalable à trancher (avant tout sous-lot)

Aucun sous-lot d'implémentation n'est proposé avant que les points suivants
soient explicitement tranchés côté produit :

1. **Le routing par préfixe est-il réellement requis pour ce lot ?**
   `hreflang` et un sitemap multilingue n'ont de sens que s'il existe des
   URLs distinctes par locale. Sans décision de créer ces URLs (`/fr/...`,
   `/en/...` ou équivalent), le volet « SEO multilingue » du niveau
   `localized-routing` n'est pas réalisable indépendamment du routing —
   contrairement aux lots 1-4 qui ont pu avancer sans changement d'URL.

2. **Si oui, quelle convention de préfixe ?**
   - toutes les locales préfixées, y compris la locale par défaut
     (`/fr/...`, `/en/...`) — cohérent, mais change toutes les URLs
     actuelles (rupture de contrat public, nécessite des redirections
     permanentes `/boutique` → `/fr/boutique`) ;
   - locale par défaut non préfixée (`/boutique`), locales secondaires
     préfixées (`/en/boutique`) — préserve les URLs actuelles pour la
     locale par défaut, mais introduit une asymétrie de routing entre
     locale par défaut et secondaires.

3. **Quel périmètre v1 ?**
   Routing complet du storefront en une fois, ou pilote sur un sous-ensemble
   de routes (à l'image du pilote homepage des lots 4.4/4.5) avant
   généralisation ? Un pilote partiel sur le routing pose la question de la
   cohérence (certaines URLs préfixées, d'autres non) pendant la transition.

4. **Devenir du sélecteur de langue cookie (lot 4.3)** : conservé en
   complément (détection initiale / redirection), remplacé par le
   préfixe d'URL comme source de vérité de la locale active, ou les deux
   (cookie = préférence, préfixe = état courant) ?

5. **Statut du flag `localized-routing` pendant la transition** : le flag
   `platform.localization` reste DRAFT (comme aujourd'hui) — mais un
   routing par préfixe, une fois introduit, n'est pas un comportement
   « invisible si le flag est DRAFT » comme les lots précédents : changer
   la structure de `app/` a un impact même si le niveau gradué n'est pas
   activé pour un store donné (sauf à dupliquer le routing, ce qui est
   hors de question). Ce point doit être clarifié : le flag gradué
   gouverne-t-il encore un comportement runtime, ou seulement l'activation
   du *contenu* multilingue (lot 4) une fois le routing en place pour
   tous ?

## Hors périmètre (rappel, inchangé)

- Multi-devise.
- Traduction automatique (IA).
- Migration des configs copy restantes vers la convention dictionnaires
  (incrémentale, indépendante de ce lot).

## Prochaine étape proposée

Obtenir une décision explicite sur les points 1-5 ci-dessus (probablement
via un échange produit dédié, pas un cadrage technique supplémentaire). Une
fois ces points tranchés, revenir à `architect-review` pour découper le lot
5 en sous-lots séquencés selon le pattern Horizon 4 (chacun testable,
réversible, fiche domaine mise à jour) — sur le même modèle que
`docs/lots/2026-06-13-localization-l2-cadrage.md`.
