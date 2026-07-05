# Lot 10 — Blog : recherche et filtre statut sur la liste d'articles

## Statut

Livré — 2026-07-05. `typecheck`, `lint` passent. Vérifié navigateur (Playwright local) en 1440×900 et 390×844 : recherche (matche titre, slug, extrait et libellé de statut), filtre statut, aucun débordement horizontal.

## Notes de livraison

- Liste extraite de la page serveur vers `BlogPostsPanel` (client) ; la page conserve shell, CTA topbar, notices, stats tiles et l'état vide « aucun article ».
- Le formulaire de toggle publier/brouillon (server action importée dans le composant client) et la gradation `canPublishBlog` sont inchangés.
- Recherche alignée sur la décision du lot 9 : champs texte + libellés dérivés (« publié », « brouillon »).

## Objectif

Dernier écart identifié parmi les candidats de généralisation (blog, pricing, team, api-clients) : la liste des articles de `content/blog` n'offre ni recherche ni filtre statut, alors que le CTA de création est déjà en topbar et que `pricing`/`team`/`api-clients` sont déjà alignés (Dialog/Drawer en topbar, listes courtes). Appliquer la toolbar unifiée (pattern lot 9, sans Sheet — la création est une page éditeur dédiée).

## Périmètre

- `app/admin/(protected)/content/blog/page.tsx` — extraction de la liste vers un composant client, conservation du shell, du CTA topbar, des notices et des stats.
- Nouveau composant `features/admin/blog/components/blog-posts-panel.tsx` — `AdminConfigDataTableToolbar` (recherche + filtre statut Publié/Brouillon + compteur) et filtrage client-side.

## Hors périmètre

- Queries et actions blog inchangées (`listAdminBlogPosts`, `toggleBlogPostStatusAction`).
- Éditeur d'article, stats tiles, gradation `content.blog` (`publish`).
- Pagination serveur (liste chargée en entier aujourd'hui).

## Invariants

- Toggle publier/brouillon fonctionnel à l'identique (même server action, gradation `canPublishBlog` respectée).
- Rendu des lignes inchangé (icône statut, badge, actions).

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Navigateur : `/admin/content/blog` en 1440 et 390 — recherche, filtre statut, toggle statut, aucun débordement horizontal.
