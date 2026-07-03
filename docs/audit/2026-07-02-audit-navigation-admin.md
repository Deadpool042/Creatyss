# Audit navigation admin — Creatyss

**Date :** 2026-07-02
**Type :** Lecture seule — aucune modification de code effectuée
**Périmètre :** `features/admin/navigation/**`, `app/admin/(protected)/**`
**Lot associé :** `docs/roadmap/ux-admin-storefront/lot-audit-navigation-admin.md`

Ce document est un audit d'observation pur. Il ne contient aucune recommandation de restructuration — celles-ci relèvent du lot suivant (`lot-decision-ia-admin.md`), à trancher avec validation humaine explicite.

---

## 1. Cartographie de `admin-navigation.data.ts`

### 1.1 Groupes (`adminNavigationGroupDefinitions`)

8 groupes définis, tous `defaultOpen: false` :

| Clé           | Label           |
| ------------- | --------------- |
| `main`        | Tableau de bord |
| `catalog`     | Catalogue       |
| `commerce`    | Commerce        |
| `content`     | Contenu         |
| `marketing`   | Marketing       |
| `insights`    | Pilotage        |
| `maintenance` | Maintenance     |
| `settings`    | Réglages        |

### 1.2 Items (`adminNavigationItems`)

29 items recensés. Pour chaque item : clé, label, href, capability(ies), feature flag(s), visibilité.

**Groupe `main`**

| Clé         | Label   | Href     | Capability | Flag | Visibilité             |
| ----------- | ------- | -------- | ---------- | ---- | ---------------------- |
| `dashboard` | Accueil | `/admin` | —          | —    | sidebar, mobilePrimary |

**Groupe `catalog`**

| Clé                 | Label          | Href                                 | Capability            | Flag | Visibilité             |
| ------------------- | -------------- | ------------------------------------ | --------------------- | ---- | ---------------------- |
| `dashboard-catalog` | Vue d'ensemble | `/admin/catalog/overview`            | —                     | —    | sidebar, mobileMore    |
| `products`          | Produits       | `/admin/catalog/products`            | —                     | —    | sidebar, mobilePrimary |
| `categories`        | Catégories     | `/admin/catalog/categories/overview` | —                     | —    | sidebar, mobilePrimary |
| `media`             | Médias         | `/admin/catalog/media`               | —                     | —    | sidebar, mobilePrimary |
| `pricing`           | Tarification   | `/admin/catalog/pricing`             | `catalog.pricingRead` | —    | sidebar, mobileMore    |

**Groupe `commerce`**

| Clé                 | Label          | Href                              | Capability               | Flag                | Visibilité          |
| ------------------- | -------------- | --------------------------------- | ------------------------ | ------------------- | ------------------- |
| `commerce-overview` | Vue d'ensemble | `/admin/commerce/overview`        | —                        | —                   | sidebar, mobileMore |
| `orders`            | Commandes      | `/admin/commerce/orders/overview` | `commerce.ordersRead`    | —                   | sidebar, mobileMore |
| `customers`         | Clients        | `/admin/commerce/customers`       | `commerce.customersRead` | —                   | sidebar, mobileMore |
| `payments`          | Paiements      | `/admin/commerce/payments`        | `commerce.paymentsRead`  | `commerce.payments` | sidebar, mobileMore |
| `shipping`          | Livraisons     | `/admin/commerce/shipping`        | `commerce.shippingRead`  | `commerce.shipping` | sidebar, mobileMore |

**Groupe `content`**

| Clé                | Label          | Href                      | Capability             | Flag | Visibilité          |
| ------------------ | -------------- | ------------------------- | ---------------------- | ---- | ------------------- |
| `content-overview` | Vue d'ensemble | `/admin/content/overview` | —                      | —    | sidebar, mobileMore |
| `homepage`         | Page d'accueil | `/admin/content/homepage` | `content.homepageRead` | —    | sidebar, mobileMore |
| `pages`            | Pages          | `/admin/content/pages`    | `content.pagesRead`    | —    | sidebar, mobileMore |
| `blog`             | Blog           | `/admin/content/blog`     | `content.blogRead`     | —    | sidebar, mobileMore |
| `seo`              | SEO            | `/admin/content/seo`      | `content.seoRead`      | —    | sidebar, mobileMore |

**Groupe `marketing`**

| Clé                  | Label          | Href                           | Capability                  | Flag                     | Visibilité          |
| -------------------- | -------------- | ------------------------------ | --------------------------- | ------------------------ | ------------------- |
| `marketing-overview` | Vue d'ensemble | `/admin/marketing/overview`    | —                           | —                        | sidebar, mobileMore |
| `newsletter`         | Newsletter     | `/admin/marketing/newsletter`  | `marketing.newsletterRead`  | `engagement.newsletter`  | sidebar, mobileMore |
| `discounts`          | Réductions     | `/admin/marketing/discounts`   | `marketing.discountsRead`   | `commerce.discounts`     | sidebar, mobileMore |
| `automations`        | Automations    | `/admin/marketing/automations` | `marketing.automationsRead` | `engagement.automations` | sidebar, mobileMore |

**Groupe `insights`**

| Clé         | Label    | Href                        | Capability               | Flag                   | Visibilité          |
| ----------- | -------- | --------------------------- | ------------------------ | ---------------------- | ------------------- |
| `analytics` | Analyses | `/admin/insights/analytics` | `insights.analyticsRead` | `engagement.analytics` | sidebar, mobileMore |

**Groupe `maintenance`** (tous `internalOnly: true`)

| Clé                         | Label         | Href                               | Capability                 | Visibilité          |
| --------------------------- | ------------- | ---------------------------------- | -------------------------- | ------------------- |
| `maintenance-logs`          | Logs          | `/admin/maintenance/logs`          | `system.logsRead`          | sidebar, mobileMore |
| `maintenance-monitoring`    | Monitoring    | `/admin/maintenance/monitoring`    | `system.monitoringRead`    | sidebar, mobileMore |
| `maintenance-observability` | Observabilité | `/admin/maintenance/observability` | `system.observabilityRead` | sidebar, mobileMore |

**Groupe `settings`**

| Clé                  | Label          | Href                                | Capability                               | Visibilité          |
| -------------------- | -------------- | ----------------------------------- | ---------------------------------------- | ------------------- |
| `settings-overview`  | Vue d'ensemble | `/admin/settings`                   | —                                        | sidebar, mobileMore |
| `store-settings`     | Boutique       | `/admin/settings/store`             | `settings.storeRead`                     | sidebar, mobileMore |
| `catalog-settings`   | Catalogue      | `/admin/settings/catalog`           | `settings.catalogRead`                   | sidebar, mobileMore |
| `orders-settings`    | Commandes      | `/admin/settings/orders`            | `settings.ordersRead`                    | sidebar, mobileMore |
| `customers-settings` | Clients        | `/admin/settings/customers`         | `settings.customersRead`                 | sidebar, mobileMore |
| `media-settings`     | Médias         | `/admin/settings/media`             | `settings.mediaRead`                     | sidebar, mobileMore |
| `advanced-settings`  | Avancé         | `/admin/settings/advanced/overview` | `settings.advancedRead` (`internalOnly`) | sidebar, mobileMore |

**Constat "Vue d'ensemble" :** l'intitulé apparaît identique (au caractère apostrophe près — `marketing-overview` utilise `'` droit, les 4 autres `'` typographique, différence invisible à l'écran) dans 5 groupes : `catalog`, `commerce`, `content`, `marketing`, `settings`. Aucun des 5 items ne porte de texte différenciateur dans son `label`.

---

## 2. Cartographie des routes `app/admin/(protected)/**`

99 fichiers `page.tsx` recensés (hors `layout.tsx`, `default.tsx`, `route.ts`, `not-found.tsx`), comptés par `find app/admin/(protected) -name page.tsx`. Liste par domaine :

**`catalog/`** (27 pages) : `overview`, `pricing`, `media`, `categories` (`page`, `[slug]`, `new`, et parallel routes `@list` — `page`/`overview`/`[slug]` — et `@detail` — `page`/`overview`/`[slug]`/`new`), `products` (`page`, `new`, et `[slug]` avec 11 sous-routes : `page` racine, `edit`, `availability`, `categories`, `characteristics`, `inventory`, `media`, `preview`, `pricing`, `related`, `seo`, `variants` — soit 12 fichiers `page.tsx` sous `[slug]/`).

**`commerce/`** (16 pages) : `overview`, `payments`, `shipping`, `taxation`, `customers` (`page`, `[customer]`), `orders` (`page`, `[id]`, et parallel routes `@list` — `page`/`overview`/`[id]`/`[id]/documents` — et `@detail` — idem). Note : `commerce/documents/[documentId]/pdf/route.ts` existe mais est un handler d'API (génération PDF), pas une page navigable — exclu du décompte de pages.

**`content/`** (8 pages) : `overview`, `homepage`, `seo`, `pages` (+ `[id]`), `blog` (+ `[id]`, `new`).

**`marketing/`** (7 pages) : `overview`, `discounts` (+ `[discount]`), `automations`, `newsletter` (+ `campaigns`, `campaigns/[id]`).

**`insights/`** (1 page) : `analytics`.

**`maintenance/`** (3 pages) : `logs`, `monitoring`, `observability`.

**`settings/`** (35 pages) : `page` racine (hub à 13 cartes, cf. section 3), `general`, `store`, `catalog`, `orders`, `customers`, `media`, `payments`, `shipping`, `notifications`, `seo`, `team`, `api-clients`, `ai`, `channels`, `integrations`, `search`, `webhooks`, `localization` (+ `translations`), `advanced` (`page` + parallel routes `@list`/`@detail` avec `overview`/`[family]`/`[family]/[flagSlug]`/`[family]/localization`/`[family]/localization/settings`/`[family]/localization/translations`).

**Racine** : `page` (dashboard), `[...not-found]`.

### 2.1 Routes sans item de navigation associé

13 routes `settings/*` existent sur le disque sans item correspondant dans `adminNavigationItems` (donc absentes de la sidebar, accessibles uniquement via un lien direct ou le hub `/admin/settings`) : `general`, `payments`, `shipping`, `notifications`, `seo`, `team`, `api-clients`, `ai`, `channels`, `integrations`, `search`, `webhooks`, `localization`. Ces routes sont référencées par 12 des 13 cartes de `app/admin/(protected)/settings/page.tsx` (cf. section 3) — la 13e carte du hub pointe vers `advanced/overview`, qui a lui un item sidebar.

---

## 3. Duplications observées

### 3.1 Duplication structurelle sidebar `settings` vs hub `/admin/settings`

Deux taxonomies distinctes coexistent pour "Réglages" :

- **Sidebar** (`adminNavigationItems`, groupe `settings`) : 7 items — Vue d'ensemble, Boutique, Catalogue, Commandes, Clients, Médias, Avancé.
- **Hub `/admin/settings/page.tsx`** (`SETTINGS_CARDS`, tableau en dur dans le composant, indépendant de `admin-navigation.data.ts`) : 13 cartes — Général, Boutique, Catalogue, Commandes, Paiements, Livraison, Médias, Notifications, SEO, Clients, Équipe, API clients, Avancé.

Les deux listes ne sont pas synchronisées : 6 entrées du hub (Général, Paiements, Livraison, Notifications, SEO, Équipe, API clients — 7 en réalité) n'ont pas d'équivalent dans la sidebar. Le hub est sa propre source de vérité, un tableau local (`SETTINGS_CARDS`), séparé de `admin-navigation.data.ts`.

### 3.2 Duplication domaine "gestion" vs `settings/*` "configuration"

Chaque paire ci-dessous a été vérifiée : les deux pages existent et ont un contenu distinct (l'une gère des données métier, l'autre configure des paramètres), mais partagent le même mot-clé de domaine et sont accessibles depuis des groupes de navigation différents.

| Gestion (domaine)                                               | Configuration (`settings/*`)                         |
| --------------------------------------------------------------- | ---------------------------------------------------- |
| `/admin/catalog/*` (produits, catégories, médias, tarification) | `/admin/settings/catalog`                            |
| `/admin/commerce/orders/*`                                      | `/admin/settings/orders`                             |
| `/admin/commerce/customers/*`                                   | `/admin/settings/customers` (stub `AdminComingSoon`) |
| `/admin/catalog/media`                                          | `/admin/settings/media`                              |
| `/admin/commerce/payments`                                      | `/admin/settings/payments`                           |
| `/admin/commerce/shipping`                                      | `/admin/settings/shipping`                           |

Ce constat rejoint celui déjà noté dans `docs/audit/2026-06-07-audit-architecture-modulaire.md` ("Deux pages quasi-identiques pour Paiements et Livraison, présentes en `commerce/` et en `settings/`") — confirmé toujours présent au 2026-07-02, et étendu ici à 6 paires au lieu de 2.

### 3.3 Duplication `localization`

`localization` apparaît à trois emplacements distincts sur le disque :

- `/admin/settings/localization` (+ `/translations`) — route top-level autonome.
- `/admin/settings/advanced/@list/[family]/localization` et `@detail/[family]/localization` — sous-arborescence du système de feature flags (famille `localization` dans `settings/advanced`), avec ses propres sous-routes `settings` et `translations`.

Deux chemins d'accès distincts mènent donc à des écrans de configuration `localization`, l'un dédié, l'autre imbriqué dans le système générique de feature flags.

### 3.4 Pages settings sans item de navigation, non-`AdminComingSoon`, au contenu minimal

4 pages (`ai`, `channels`, `integrations`, `search`, ~60 lignes chacune) ne sont ni de vrais formulaires de configuration ni le composant `AdminComingSoon` : elles affichent un texte expliquant que la fonctionnalité n'est pas ouverte, avec un lien "Revenir aux réglages avancés". `webhooks` (100 lignes) a un contenu plus étoffé, non vérifié en détail dans cet audit.

---

## 4. Profondeur des écrans

Profondeur = nombre de segments de route après `/admin`.

| Route                                                         | Profondeur | Note                                    |
| ------------------------------------------------------------- | ---------- | --------------------------------------- |
| `/admin`                                                      | 0          | dashboard                               |
| `/admin/catalog/products`                                     | 2          | liste produits                          |
| `/admin/catalog/products/[slug]`                              | 3          | fiche produit racine                    |
| `/admin/catalog/products/[slug]/edit`                         | 4          |                                         |
| `/admin/catalog/products/[slug]/availability`                 | 4          |                                         |
| `/admin/catalog/products/[slug]/categories`                   | 4          |                                         |
| `/admin/catalog/products/[slug]/characteristics`              | 4          |                                         |
| `/admin/catalog/products/[slug]/inventory`                    | 4          |                                         |
| `/admin/catalog/products/[slug]/media`                        | 4          |                                         |
| `/admin/catalog/products/[slug]/preview`                      | 4          |                                         |
| `/admin/catalog/products/[slug]/pricing`                      | 4          |                                         |
| `/admin/catalog/products/[slug]/related`                      | 4          |                                         |
| `/admin/catalog/products/[slug]/seo`                          | 4          |                                         |
| `/admin/catalog/products/[slug]/variants`                     | 4          |                                         |
| `/admin/settings/advanced/[family]/localization/settings`     | 5          | via parallel route `@list` ou `@detail` |
| `/admin/settings/advanced/[family]/localization/translations` | 5          | idem                                    |
| `/admin/commerce/orders/[id]/documents`                       | 4          | via parallel route                      |

**Profondeur maximale observée : 5 niveaux**, sur `settings/advanced/[family]/localization/{settings,translations}`. La fiche produit plafonne à 4 niveaux (11 sous-routes possibles à ce même niveau 4, pas d'empilement supplémentaire au-delà).

---

## 5. Routes en parallel routes (`@list`/`@detail`)

3 emplacements identifiés, tous avec la même paire `@list`/`@detail` :

- `catalog/categories/` — `@list` et `@detail` couvrant chacun `overview`, `[slug]`.
- `commerce/orders/` — `@list` et `@detail` couvrant chacun `overview`, `[id]`, `[id]/documents`.
- `settings/advanced/` — `@list` et `@detail` couvrant chacun `overview`, `[family]`, `[family]/[flagSlug]`, `[family]/localization`, `[family]/localization/settings`, `[family]/localization/translations`.

Pattern Next.js : les deux slots (`@list`, `@detail`) sont rendus simultanément par le même `layout.tsx` du segment parent, typiquement pour afficher une liste et un panneau de détail côte à côte (split view) sans navigation complète de page. Chaque route existe donc en double dans l'arborescence fichier (une fois par slot), avec un contenu par ailleurs identique ou quasi identique entre les deux slots pour un même chemin (`overview`, `[id]`/`[slug]`), sans que cet audit ait vérifié si le contenu réel des deux copies diverge.

---

## 6. Résumé chiffré

| Mesure                                                   | Valeur    |
| -------------------------------------------------------- | --------- |
| Groupes de navigation (sidebar)                          | 8         |
| Items de navigation (sidebar)                            | 29        |
| Pages (`page.tsx`) sous `app/admin/(protected)/**`       | 99        |
| Routes `settings/*` sans item sidebar                    | 13        |
| Paires "gestion vs configuration" dupliquées identifiées | 6         |
| Emplacements distincts pour `localization`               | 2         |
| Groupes avec label "Vue d'ensemble" répété               | 5         |
| Profondeur maximale observée                             | 5 niveaux |
| Emplacements de parallel routes `@list`/`@detail`        | 3         |

---

## 7. Limites de cet audit

- Le contenu détaillé de `webhooks` (100 lignes) et des formulaires "réels" de `settings/*` n'a pas été vérifié champ par champ — seule la distinction stub/non-stub a été établie.
- La divergence de contenu entre slots `@list` et `@detail` pour une même route n'a pas été vérifiée ligne à ligne.
- Aucune recommandation n'est formulée ici — cf. `lot-decision-ia-admin.md` pour la suite.
