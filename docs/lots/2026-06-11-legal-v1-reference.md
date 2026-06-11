# Legal V1 — Référence d'implémentation

**Date :** 2026-06-11
**Type :** Référence d'implémentation — lecture seule
**Périmètre :** identité légale de la boutique, textes légaux (pages système), routes publiques légales, publication gouvernée

---

## 1. Objectif fonctionnel

Donner à la boutique une base légale complète et administrable :

- l'identité légale structurée (nom légal, SIRET, TVA, adresse, contact) vit dans les réglages généraux ;
- les 4 textes légaux longs (mentions légales, CGV, confidentialité, retours) vivent dans des **Pages système** éditées depuis Contenu > Pages ;
- 4 routes publiques servent ces textes ;
- la publication est gouvernée : un texte contenant un marqueur `[TODO …]` ne peut pas être publié.

---

## 2. Modèle de données

Aucun nouveau modèle. Deux ajouts au modèle `Store` (migration `20260611081334_add_store_legal_identity`) :

| Champ | Type | Rôle |
| --- | --- | --- |
| `siret` | `String?` | SIRET affiché dans l'admin et les mentions légales |
| `vatNumber` | `String?` | TVA intracommunautaire |

Les textes légaux utilisent le modèle `Page` existant (`prisma/core/content/pages.prisma`) :

| Invariant | Valeur |
| --- | --- |
| `isSystemPage` | `true` |
| `code` (unique par store) | `legal-notice`, `terms-of-sale`, `privacy-policy`, `returns-policy` |
| `slug` | `= code` (anglais, figé — les routes publiques sont statiques FR, le slug Prisma ne route rien en V1) |
| `body` | texte brut, max 50 000 caractères, vide → `null` |
| `status` | `DRAFT` (non publié) ou `ACTIVE` (public) |

---

## 3. Surfaces admin

### Réglages généraux — `/admin/settings/general`

Identité légale (legalName, siret, vatNumber, adresse, contact) dans le formulaire store existant. Capabilities `admin.settings.general.*`.

### Contenu > Pages — `/admin/content/pages`

| Capability | Usage |
| --- | --- |
| `admin.content.pages.read` | Navigation |
| `admin.content.pages.write` | Édition du corps + publication/dépublication |

| Fichier | Rôle |
| --- | --- |
| `app/admin/(protected)/content/pages/page.tsx` | Liste réelle : badges « Page système » et « À compléter », statut, tri système d'abord |
| `app/admin/(protected)/content/pages/[id]/page.tsx` | Détail : form body (pages système), badge statut, bouton Publier/Dépublier |
| `features/admin/pages/queries/get-admin-pages-list.query.ts` | Liste sans filtre de statut, ne crée rien |
| `features/admin/pages/queries/get-admin-page-detail.query.ts` | Détail par id |
| `features/admin/pages/actions/update-admin-page-body.action.ts` | Met à jour **uniquement** `body` ; pages système seulement |
| `features/admin/pages/actions/toggle-admin-page-status.action.ts` | ACTIVE ⇄ DRAFT ; refuse la publication si body vide ou contenant `[TODO` |
| `features/admin/pages/constants/public-legal-paths.ts` | Mapping code → route publique (revalidation) |

Verrous : pour une page système, `title`, `code`, `slug` ne sont jamais modifiables ; les pages éditoriales (non système) ne sont ni créables ni éditables — voir §7.

L'ancienne page `/admin/settings/legal` (Lot 3) a été décommissionnée ; les capabilities `admin.settings.legal.*` ont été retirées de la policy et du seed.

---

## 4. Storefront

| Route publique | Code Page |
| --- | --- |
| `/mentions-legales` | `legal-notice` |
| `/conditions-generales-de-vente` | `terms-of-sale` |
| `/politique-confidentialite` | `privacy-policy` |
| `/politique-retour` | `returns-policy` |

- Query : `features/storefront/content/pages/queries/get-public-system-page.query.ts` — lit par code, filtre `isSystemPage=true` + `status=ACTIVE`, retourne `null` si body vide → la route fait `notFound()`.
- Rendu : `components/storefront/legal/legal-page-template.tsx` — texte brut découpé en paragraphes sur les lignes vides, pas de markdown, pas de HTML injecté.
- Footer : 4 liens légaux dans la barre basse de `footer-public.tsx`.
- Sitemap : 4 URLs statiques (`yearly`, priorité 0.3).
- Les codes légaux sont volontairement dupliqués côté storefront (pas de dépendance storefront → features/admin).

---

## 5. Seed — `prisma/seed/legal-pages.seed.ts`

Textes importés de l'ancien site (creatyss.com) sans réécriture juridique :

| Page | Source |
| --- | --- |
| CGV | ancienne page conditions-generales-de-ventes (texte intégral) |
| Confidentialité | ancienne page politique-confidentialite (texte intégral) |
| Mentions légales | composées des informations confirmées uniquement (pas de page source) |
| Retours | sections rétractation/échange extraites des CGV |

Règles du seed :

- idempotent, upsert par `storeId + code` ;
- ne **jamais** écraser un body non vide (contenu admin prioritaire) ;
- `resolveLegalPageStatus` : body contenant `[TODO` → `DRAFT`, sinon `ACTIVE` ;
- les passages obsolètes de l'ancien site (hébergeur, TVA art. 293 B vs n° TVA, PSP « XXXX », cookies WordPress, email DPO, mention « bijoux ») sont conservés avec des marqueurs `[TODO …]` à valider humainement.

Diagnostic lecture seule : `pnpm tsx scripts/diagnose-pages.ts` (DATABASE_URL masquée, stores, pages).

---

## 6. Cycle de vie d'un texte légal

1. `pnpm run db:seed` → page créée (DRAFT si TODO, ACTIVE sinon) ;
2. admin : Contenu > Pages → édition du corps, traitement des `[TODO …]` ;
3. admin : bouton **Publier** → refusé tant qu'un `[TODO` subsiste ou que le corps est vide ;
4. publication → revalidation de la route publique correspondante ;
5. **Dépublier** → la route publique repasse en 404.

---

## 7. Décisions et limites assumées

- **Pas de mini-CMS** : la création libre de pages éditoriales a été implémentée puis retirée le jour même, en application de `docs/domains/optional/pages.md` (« pas de conteneur flou de contenu libre sans structure ni gouvernance »). La route stub `content/pages/new` a été supprimée.
- **Slugs Prisma anglais vs routes publiques FR** : incohérence dormante sans effet tant qu'aucune route publique `[slug]` n'existe. Toute future route dynamique devra exclure `isSystemPage=true`.
- **Liens footer vers pages non publiées** : 404 attendu tant que les textes ne sont pas validés/publiés — préférable à la publication de TODO.
- **Duplications volontaires** : codes légaux (schema admin supprimé en 5c → storefront + seed) et mapping code→route (storefront + `constants/public-legal-paths.ts`) — frontières admin/storefront respectées ; à consolider dans `entities/content` si une duplication supplémentaire apparaît.
- **Redirects anciennes URLs creatyss.com** : hors périmètre, en attente de confirmation des slugs WordPress réels.
- `tsconfig.db.json` est cassé (références `db/repositories/**` disparues) — constat hors périmètre, non corrigé.

---

## 8. QA manuelle

1. `pnpm run db:seed` → log `[legal-pages] …` ×4 puis `pages en base : 4` ;
2. `/admin/settings/general` → identité légale présente ;
3. `/admin/content/pages` → 4 pages système (3 Brouillon, retours Actif) ;
4. publier une page avec TODO → erreur explicite ;
5. purger les TODO, publier → route publique en ligne ;
6. dépublier → 404 ;
7. footer : 4 liens ; `/sitemap.xml` : 4 URLs légales.
