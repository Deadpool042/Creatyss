# Settings SEO V1 — Référence d'implémentation

**Date :** 2026-06-11
**Type :** Référence d'implémentation — lecture seule
**Périmètre :** métadonnées SEO globales de la homepage et politique d'indexation (`/admin/settings/seo`)

---

## 1. Objectif fonctionnel

Piloter les métadonnées SEO de la page d'accueil (sujet `HOMEPAGE` de `SeoMetadata`) et le mode d'indexation global : meta title/description/keywords, Open Graph, Twitter, `indexingMode`, inclusion sitemap.

---

## 2. Modèle

`SeoMetadata` (`prisma/cross-cutting/seo.prisma`), upsert par `storeId + subjectType + subjectId` avec `subjectType = "HOMEPAGE"`.

| Champ | Validation |
| --- | --- |
| `metaTitle` / `openGraphTitle` / `twitterTitle` | max 120 |
| `metaDescription` / OG / Twitter description | max 320 |
| `metaKeywords` | max 500 |
| `indexingMode` | enum `SEO_INDEXING_MODE_VALUES` (`entities/seo/seo-indexing-mode.ts`) — `getSeoRobotsFlags` mappe explicitement chaque mode vers `{index, follow}` |
| `sitemapIncluded` | booléen |

---

## 3. Capabilities et fichiers

Read `admin.settings.seo.read`, write `admin.settings.seo.write`.

| Fichier | Rôle |
| --- | --- |
| `app/admin/(protected)/settings/seo/page.tsx` | Page RSC |
| `features/admin/settings/components/seo-settings-form.tsx` | Form |
| `features/admin/settings/schemas/seo-settings.schema.ts` | Zod |
| `features/admin/settings/actions/update-seo-settings.action.ts` | Action (revalide `/admin/settings/seo`) |
| `features/admin/settings/queries/get-seo-settings.query.ts` | Lecture |

---

## 4. Consommation runtime

- `app/page.tsx` : metadata homepage + robots via `getSeoRobotsFlags` ;
- `app/sitemap.ts` : `sitemapIncluded` contrôle la présence de la homepage ;
- `app/(public)/boutique/[slug]` : SEO produit (sujet distinct, même modèle).

---

## 5. Limites assumées

SEO par page (hors homepage et produits/blog/catégories déjà couverts par leurs éditeurs respectifs) hors périmètre ; pas d'aperçu SERP en V1.
