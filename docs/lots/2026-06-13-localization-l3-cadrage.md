<!-- docs/lots/2026-06-13-localization-l3-cadrage.md -->

# Cadrage — `localization` niveau `localized-routing` (lot 5)

> **Statut : sous-lot 1 implémenté (2026-06-16).** Sous-lots 2 et 3 à faire.
> Référence : `docs/lots/2026-06-12-localization-l1-cadrage.md`,
> `docs/lots/2026-06-13-localization-l2-cadrage.md` (lots 1-4 faits),
> `docs/domains/cross-cutting/localization.md`,
> `docs/domains/cross-cutting/seo.md`.

## Objectif

Le lot 5 (« L3 `localized-routing` ») est le dernier niveau gradué de
`platform.localization` : routing localisé (`/en-GB/...`) et SEO
multilingue (hreflang, sitemaps par locale).

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
  `resolvePreferredLocaleCode`. Aucune URL ne varie selon la locale.

## Décisions tranchées (2026-06-16)

| # | Décision | Choix retenu |
|---|---|---|
| D1 | Routing par préfixe requis ? | **Oui** — hreflang et sitemap multilingue nécessitent des URLs distinctes par locale. |
| D2 | Convention de préfixe | **Locale par défaut (`fr`) non préfixée** — `/boutique` reste `/boutique`, locales secondaires préfixées `/en-GB/boutique`. Préserve les URLs actuelles et leur valeur SEO. |
| D3 | Périmètre v1 + approche | **Middleware Edge** (rewrite + headers, pas de `[locale]` dans `app/`). Scope : toutes les routes storefront (pas d'approche pilote partiel — cohérence routing). Admin et API exclus. |
| D4 | Cookie vs préfixe URL | **Les deux** — cookie = préférence persistante, préfixe URL = source de vérité par requête. Le middleware injecte `x-next-locale` dans les headers request. |
| D5 | Flag `localized-routing` pendant la transition | **Le flag gate l'exposition du contenu** aux URLs `/[locale]/...` (redirect vers défaut si inactif). La structure middleware existe dès le déploiement. |

## Architecture retenue (sous-lot 1)

```
/en-GB/boutique  →  middleware rewrite  →  /boutique  (x-next-locale: en-GB)
/fr/boutique     →  middleware redirect 301  →  /boutique
```

- **`middleware.ts`** (Edge runtime) : rewrite interne + injection des headers
  `x-next-locale` et `x-next-path-without-locale`. Aucun appel Prisma.
- **`core/localization/supported-locales.ts`** : config Edge-safe
  (`DEFAULT_LOCALE_CODE = "fr"`, `SECONDARY_LOCALE_CODES = ["en-GB"]`).
  À étendre lors de l'ajout d'une nouvelle locale active.
- **`app/layout.tsx`** : lit `x-next-locale` via `headers()`, injecte
  `<html lang={locale}>`, et redirige vers `pathWithoutLocale` si la locale
  est secondaire mais que `localized-routing` n'est pas actif (gate L3).

## Sous-lots

### Sous-lot 1 — Middleware + locale context ✅ (2026-06-16)

**Fichiers créés :**
- `core/localization/supported-locales.ts`
- `middleware.ts`

**Fichiers modifiés :**
- `app/layout.tsx` : async, `<html lang={locale}>` dynamique, gate L3

**Testable :** lancer `pnpm dev`. Accéder à `/en-GB/boutique` quand
`localized-routing` est DRAFT → redirigé vers `/boutique`. Quand actif →
servi en `lang="en-GB"`.

---

### Sous-lot 2 — Alternates + hreflang + sitemap ✅ (2026-06-16)

**Fichiers modifiés :**
- `middleware.ts` : pass-through injecte maintenant `x-next-path-without-locale`
  pour toutes les routes storefront (nécessaire aux alternates de la locale par défaut).
- `app/layout.tsx` : `export const metadata` remplacé par
  `export async function generateMetadata()`. Génère `alternates.languages`
  (hreflang fr + en-GB + x-default) quand L3 est actif. Utilise `cache()` de React
  pour mémoïser `meetsLocalizationLevel` par requête (shared avec `RootLayout`).
- `app/sitemap.ts` : entrées locale secondaire ajoutées en fin de sitemap quand L3
  est actif (`/en-GB/boutique`, `/en-GB/blog/<slug>`, etc.). Catégories exclues des
  variantes localisées (URLs avec `?category=` — hors périmètre v1).

---

### Sous-lot 3 — Sélecteur de langue + action ✅ (2026-06-16)

**Fichiers modifiés :**
- `features/localization/actions/set-locale-preference.action.ts` : quand L3
  actif, `redirect` vers `/${localeCode}${pathWithoutLocale}` (locale secondaire)
  ou `${pathWithoutLocale}` (locale par défaut). `revalidatePath` conservé si L3 inactif.
- `components/storefront/topbar/locale-selector.tsx` : lit
  `x-next-path-without-locale` depuis `headers()` et le passe à `LocaleSelectorForm`.
- `components/storefront/topbar/locale-selector-form.tsx` : prop
  `pathWithoutLocale?: string` (défaut `"/"`), champ hidden `pathWithoutLocale`
  dans le `<form>`.

**Migration Next.js 16 (bonus) :**
- `middleware.ts` → `proxy.ts` + renommage de la fonction `middleware` → `proxy`
  (cf. https://nextjs.org/docs/messages/middleware-to-proxy).
- Note : en Next.js 16, proxy tourne en Node.js runtime par défaut (plus Edge).
  Prisma serait techniquement accessible, mais on conserve l'approche sans DB
  pour garder le proxy minimal et réversible.
- `middleware.ts` vidé (commentaire seulement). À supprimer manuellement :
  `git rm middleware.ts`.

---

## Hors périmètre (inchangé)

- Multi-devise.
- Traduction automatique (IA).
- Migration des configs copy restantes vers la convention dictionnaires.
