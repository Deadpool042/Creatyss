# Lot V7-2 — Pages listes simples

Cadre général : `docs/v7/admin-ui-ux-doctrine.md`
Roadmap : `docs/v7/admin-ui-ux-roadmap.md`

---

## Objectif

Extraire les patterns de carte récurrents des pages liste vers `components/admin/`, en construisant ces patterns prioritairement avec shadcn/ui + Tailwind.

`page.tsx` conserve son rôle d'orchestration. Le JSX de chaque carte passe dans un composant dédié.

---

## Périmètre

| Page | Lignes | Composant admin cible |
| --- | --- | --- |
| `orders/page.tsx` | ~109 | `AdminOrderCard` |
| `categories/page.tsx` | ~108 | `AdminCategoryCard` |
| `blog/page.tsx` | ~119 | `AdminBlogPostCard` |
| `products/page.tsx` | ~130 | `AdminProductCard` |

Ces composants existent déjà dans `components/admin/`. Ce lot vise à vérifier leur cohérence avec la doctrine V7 et à les stabiliser si nécessaire.

---

## Hors périmètre

- Aucun changement de comportement
- Aucun changement de wording
- Aucune modification de repository
- Les balises sémantiques `<article>` et leurs attributs sont préservés (`getByRole("article")` ciblé dans les tests)

---

## Composants admin attendus

Les cartes de liste dans `components/admin/` doivent :

- être construites prioritairement avec shadcn/ui + Tailwind
- ne pas introduire de nouvelles classes CSS custom admin sans justification explicite
- présenter une hiérarchie visuelle claire et une densité maîtrisée
- préserver la sémantique `<article>` quand elle est nécessaire pour les tests e2e

---

## Vérifications

```bash
pnpm run typecheck
pnpm exec playwright test tests/e2e/admin/products.spec.ts tests/e2e/admin/categories.spec.ts tests/e2e/admin/orders.spec.ts tests/e2e/admin/blog.spec.ts
```

---

## Critères de validation

- Le comportement de chaque page liste est identique avant et après
- Les `<article>` sémantiques sont préservés ; `getByRole("article")` continue de fonctionner
- Les cartes extraites présentent une hiérarchie claire et une densité maîtrisée
- Les nouveaux patterns de liste utilisent prioritairement shadcn/ui + Tailwind ; aucune nouvelle classe CSS custom admin n'est introduite sans justification explicite
- `pnpm run typecheck` passe sans erreur
- Les tests e2e ciblés passent sans régression
