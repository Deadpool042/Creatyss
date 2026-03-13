# Lot V7-1 — Fondation shell admin

Cadre général : `docs/v7/admin-ui-ux-doctrine.md`
Roadmap : `docs/v7/admin-ui-ux-roadmap.md`

---

## Objectif

Consolider la fondation du shell admin selon la doctrine V7 :

- sidebar fixe desktop avec groupes de navigation et lien actif
- header fixe du shell, distinct du `PageHeader` métier de chaque page
- contenu principal scrollable
- navigation mobile dédiée via `Sheet` / drawer
- dashboard simplifié maintenant que la navigation est persistante

La base du shell est déjà engagée (`AdminSidebar`, `AdminSidebarLink`, layout mis à jour). Ce lot vise à la stabiliser et à la rendre conforme à la doctrine premium V7 dans sa totalité.

---

## Périmètre

- `app/admin/(protected)/layout.tsx` — shell mis à jour : sidebar fixe + header fixe + zone de contenu scrollable
- `components/admin/AdminSidebar` — composant sidebar avec identité admin, groupes de liens, lien actif, déconnexion
- `components/admin/AdminSidebarLink` (ou équivalent) — lien avec détection d'état actif via `usePathname()`
- Navigation mobile via `Sheet` / drawer depuis le header fixe
- `app/admin/(protected)/page.tsx` — dashboard simplifié, allégé de la redondance avec la navigation persistante

---

## Hors périmètre

- Toutes les autres pages admin
- Les pages d'authentification (`/admin/login`, `/admin/logout`)
- Le front public
- Tout changement métier

---

## Contraintes UI/UX premium

- Sidebar fixe sur desktop : visible en permanence, ne défile pas avec le contenu
- Header fixe : ne doit pas être remplacé par un second système de titres ; il ne duplique pas le `PageHeader` métier
- Contenu scrollable : la zone `{children}` est la zone de scroll de référence
- Mobile : le pattern de référence est un `Sheet` / drawer piloté depuis le header fixe ; aucune navigation horizontale scrollable n'est acceptable
- Lien actif : détection via `usePathname()`, composants de navigation en Client Component
- Identité admin : `displayName` et `email` visibles dans la sidebar ; bouton "Se déconnecter" structurel
- Groupes de navigation :

| Groupe | Destinations |
| --- | --- |
| Catalogue | Produits, Catégories |
| Contenu | Page d'accueil, Blog |
| Opérations | Commandes, Médias |

"Accueil admin" reste un lien solo au-dessus des groupes.

- Construire le shell prioritairement avec shadcn/ui + Tailwind (`Sidebar`, `Sheet`, `ScrollArea`, `Separator`, `Tooltip` si utile)
- Éviter toute nouvelle classe CSS custom admin si un assemblage Tailwind suffit

---

## Vérifications

```bash
pnpm run typecheck
pnpm exec playwright test tests/e2e/admin/auth.spec.ts tests/e2e/admin/products.spec.ts tests/e2e/admin/categories.spec.ts tests/e2e/admin/orders.spec.ts
```

---

## Critères de validation

- La sidebar est visible sur toutes les pages admin protégées en desktop et reste fixe
- Le header du shell est fixe
- Le contenu principal est la zone scrollable de référence
- Sur mobile, la navigation passe par un `Sheet` / drawer ; aucune navigation horizontale scrollable n'est utilisée
- Le lien courant est visuellement distingué
- Les 7 destinations sont accessibles depuis la navigation
- Les 3 groupes (Catalogue, Contenu, Opérations) sont présents
- La déconnexion fonctionne
- Le dashboard ne duplique pas la structure de navigation
- Le shell exprime une qualité premium concrète : lisibilité, vitesse perçue, densité maîtrisée, cohérence
- `pnpm run typecheck` passe sans erreur
- Les tests e2e ciblés passent sans régression
