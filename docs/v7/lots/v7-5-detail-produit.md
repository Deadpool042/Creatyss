# Lot V7-5 — Détail produit

Cadre général : `docs/v7/admin-ui-ux-doctrine.md`
Roadmap : `docs/v7/admin-ui-ux-roadmap.md`

---

## Objectif

Découper `products/[id]/page.tsx` (~1 663 lignes) en composants de section colocalisés. C'est le chantier le plus lourd de V7. Réduire `page.tsx` à moins de 200 lignes.

---

## Périmètre

- `app/admin/(protected)/products/[id]/page.tsx`
- Composants colocalisés dans `app/admin/(protected)/products/[id]/`
- Promotion vers `components/admin/` pour les patterns communs avec d'autres pages

### Sections cibles

- Informations générales (nom, slug, description courte, description longue)
- Images (image principale, galerie)
- Organisation (catégories, mise en avant)
- Informations de vente (produit simple) / Déclinaisons (produit avec déclinaisons)
- Publication et SEO
- Actions dangereuses (suppression du produit)

### Responsabilités de `page.tsx`

Le `page.tsx` se limite à :

- charger les données du produit
- résoudre les params et search params
- mapper les messages de statut ou d'erreur
- déléguer chaque section à son composant

---

## Hors périmètre

- Aucun changement de comportement
- Aucun changement de wording métier (produit simple, produit avec déclinaisons, informations de vente, déclinaisons — voir `docs/v6/admin-language-and-ux.md`)
- Aucune modification de repository, de schéma ou de Server Action
- Les `<article>` de déclinaisons et d'images sont préservés (`getByRole("article")` dans les tests)

---

## Contraintes UI/UX

- Les sections extraites gardent une densité maîtrisée et une hiérarchie claire malgré la complexité de la page
- Les nouveaux patterns extraits suivent la base prioritaire shadcn/ui + Tailwind
- Les composants locaux à ce seul produit restent colocalisés ; les patterns communs montent dans `components/admin/`

---

## Vérifications

```bash
pnpm run typecheck
pnpm exec playwright test tests/e2e/admin/product-stock.spec.ts tests/e2e/admin/product-type.spec.ts tests/e2e/admin/product-images.spec.ts
```

---

## Critères de validation

- Le comportement de la page est identique avant et après le découpage
- Aucun heading métier visible n'est renommé
- Les `<article>` de déclinaisons et d'images sont préservés
- Les sections extraites gardent une densité maîtrisée et une hiérarchie claire
- Les nouveaux patterns suivent la base prioritaire shadcn/ui + Tailwind
- `products/[id]/page.tsx` fait moins de 200 lignes après le lot
- `pnpm run typecheck` passe sans erreur
- Les tests e2e ciblés passent sans régression
