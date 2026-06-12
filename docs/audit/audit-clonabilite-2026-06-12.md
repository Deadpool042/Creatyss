<!-- docs/audit/audit-clonabilite-2026-06-12.md -->

# Audit de clonabilité — 2026-06-12

## Objectif

Vérifier l'écart entre l'identité du socle (`AGENTS.md` : codebase unique,
architecture modulaire, « réutilisable pour d'autres projets e-commerce »)
et l'état réel du code, au regard du critère opérationnel défini :
**cloner le repo et ne changer « que » le front**.

Audit en lecture seule. Aucun code modifié.

## Critère de clonabilité

Un clone du repo doit pouvoir devenir une autre boutique en intervenant
uniquement sur : la présentation storefront (thème, composants publics),
le contenu (DB : produits, pages, homepage), et la configuration
(env, réglages boutique). Toute occurrence de la marque Creatyss en dur
dans le code hors de ces zones est un point de friction.

---

## Ce qui est déjà clonable (état réel, vérifié)

- **Pages légales** : servies par la DB via `getPublicSystemPage`
  (`legal-notice`, etc.) et un template générique
  (`LegalPageTemplate`). Le clone change le contenu en base, pas le code.
- **Réglages boutique** : le modèle `Store` porte déjà l'essentiel de
  l'identité opérationnelle — `legalName`, `siret`, `vatNumber`,
  `supportEmail/Phone`, adresse, réseaux sociaux, `orderNumberPrefix`,
  options paiement et email, `replyToEmail` — édité via l'admin settings.
- **Homepage** : éditoriale, persistée en DB, éditable admin.
- **Thème** : tokens centralisés (`app/styles/theme.css`, mapping
  Tailwind v4 `@theme`), composants consommateurs. Un re-skin passe par
  les fichiers de tokens, pas par les composants.
- **Email** : provider abstrait (`mailpit`/`brevo`), expéditeur via env.
- **Import Woo** : statut clarifié — outillage de **bootstrap ponctuel**
  propre à Creatyss (récupération rapide de contenu), pas une capacité du
  socle. La capacité durable pour les clones est l'import en masse
  générique (CSV ou autre), déjà modélisé
  (`prisma/optional/platform/import.prisma`, fiche
  `docs/domains/cross-cutting/import.md`) et non encore implémenté.

---

## Points de friction au clonage (inventaire)

Environ 114 occurrences de marque (« Creatyss », « Saint-Étienne »,
« stéphanois », « sans cuir ») dans `app/`, `features/`, `components/`,
`core/`. Par zone, de la plus structurante à la moins :

### F1 — Copy de marque en dur dans des composants du socle

- `app/layout.tsx` : metadata racine (title default/template, description).
- `components/storefront/footer/footer-public.tsx` : baseline, liste
  « L'atelier » (Saint-Étienne, Sans cuir…), copyright.
- `features/storefront/catalog/product-page/components/sections/product-editorial-section.tsx` :
  bloc savoir-faire (« mon atelier stéphanois ») affiché sur toute fiche produit.
- `features/storefront/catalog/boutique-page/data/boutique-reassurance-items.ts` :
  items de réassurance.
- `components/storefront/topbar/*`, `orientation-guard.tsx`,
  `features/homepage/components/*` (alt texts, fallbacks comme
  `FALLBACK_SUBTITLE = "— Creatyss, fabrication française"`).
- `features/email/order/order-email-templates.ts` : signature « Creatyss »
  en dur (4 occurrences) alors que `EMAIL_FROM_NAME` existe en env et que
  `Store.name` existe en DB.

### F2 — Pages de contenu codées en dur (incohérence avec les légales)

`app/(public)/a-propos/page.tsx` (79 l.), `les-marches/page.tsx` (66 l.),
`contact/page.tsx` (196 l.) portent leur contenu dans le code, alors que
les pages légales passent déjà par le domaine `pages`
(`prisma/core/content/pages.prisma`). Deux régimes coexistent pour la même
responsabilité.

### F3 — Résolution de boutique par code en dur

`CANONICAL_STORE_CODE = "creatyss"` dupliqué dans 4 fichiers
(`features/homepage/queries/get-storefront-homepage.query.ts`,
`features/admin/homepage/{queries,services}/…`). Le reste du code résout la
boutique par « premier store » (`findFirst orderBy createdAt`) — deux
conventions de résolution coexistent.

### F4 — Configuration applicative spécifique à l'instance

- `next.config.ts` : redirects WordPress/Woo historiques de creatyss.com
  (slugs vérifiés sur l'ancien site) — purement instance.
- `.env.example` : variables `WC_*` (bootstrap uniquement).
- `package.json` : `seed:dev` enchaîne bootstrap + import Woo.

### F5 — SEO structuré

`features/storefront/catalog/product-page/model/build-product-json-ld.ts`
référence la marque (à vérifier en détail lors du lot : devrait dériver de
`Store`).

---

## Recommandations (lots candidats, ordre de dépendance)

1. **R1 — Source de marque unique** (fondation). Première marche sobre :
   un module de configuration de marque consommé par metadata racine,
   footer, topbar, emails, JSON-LD, réassurance. Décision à cadrer :
   constantes centralisées (`core/config/brand`) vs extension du modèle
   `Store` (déjà riche) — le choix DB rend la marque éditable admin mais
   touche Prisma. Sans R1, toute autre extraction reproduit la dispersion.
2. **R2 — Unifier le régime des pages de contenu** : basculer
   `a-propos`, `les-marches`, `contact` (contenu) vers le domaine `pages`
   comme les légales. Le clone édite ses pages en admin.
3. **R3 — Extraire le copy storefront restant** (éditorial produit,
   réassurance, fallbacks homepage) vers R1 ou vers du contenu éditable.
4. **R5 — Une seule convention de résolution de boutique** :
   `CANONICAL_STORE_CODE` → env ou résolution unique documentée.
5. **R6 — Redirects d'instance hors du socle** : extraire les redirects
   Woo de `next.config.ts` vers une configuration propre à l'instance.
6. **R4 — Statut explicite de l'outillage Woo** : marquer
   `scripts/import-woocommerce` comme bootstrap Creatyss (README du
   dossier), sortir `WC_*` du runtime documenté, découpler `seed:dev`.
   L'import générique CSV reste une capacité optionnelle à activer plus
   tard, hors périmètre de la clonabilité de base.

## Hors périmètre de cet audit

- La décision `availability`/`inventory` (frontière cœur commerce),
  signalée par ailleurs — préalable à toute extension commerce, pas à la
  clonabilité.
- L'implémentation de l'import générique CSV.
- Tout refactor : cet audit inventorie, il ne modifie rien.
