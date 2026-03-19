# V7 — Roadmap et stratégie de migration

Ce document décrit l'ordre de migration V7, la logique de progression entre lots et les règles transversales de non-régression.

Pour le cadre général, voir `admin-ui-ux-doctrine.md`.

---

## Ordre des chantiers

| Lot   | Objet                                                          | État                 |
| ----- | -------------------------------------------------------------- | -------------------- |
| V7-1  | Fondation shell admin — sidebar, navigation mobile             | Engagé, à stabiliser |
| V7-2  | Pages listes simples — extraction des cartes de liste          | À faire              |
| V7-3  | Formulaires intermédiaires — découpage des sections            | À faire              |
| V7-4  | Détail commande — découpage de `orders/[id]/page.tsx`          | À faire              |
| V7-5  | Détail produit — découpage de `products/[id]/page.tsx`         | À faire              |
| V7-6+ | Cohérence et finitions — à définir selon les besoins constatés | Non planifié         |

La fondation shell (V7-1) est déjà engagée et sert de base de référence pour guider les lots suivants. Elle doit être stabilisée avant d'être considérée comme complète selon la doctrine.

Les composants admin réutilisables émergent au fil des lots 2 à 5 et sont promus dans `components/admin/` dès qu'ils s'appliquent à plusieurs pages.

---

## Résumé des lots V7-1 à V7-5

**V7-1 — Fondation shell admin**
Consolider le shell : sidebar fixe desktop, header fixe, contenu scrollable, navigation mobile via `Sheet` / drawer, dashboard simplifié.
→ Voir `lots/v7-1-shell-admin.md`

**V7-2 — Pages listes simples**
Extraire les patterns de carte récurrents des 4 pages liste (`orders`, `categories`, `blog`, `products`) vers `components/admin/`.
→ Voir `lots/v7-2-pages-listes.md`

**V7-3 — Formulaires intermédiaires**
Découper `homepage/page.tsx` et `products/new/page.tsx` en composants de section colocalisés ; poser la base de formulaire admin réutilisable.
→ Voir `lots/v7-3-formulaires-intermediaires.md`

**V7-4 — Détail commande**
Découper `orders/[id]/page.tsx` (441 lignes) en composants de section colocalisés.
→ Voir `lots/v7-4-detail-commande.md`

**V7-5 — Détail produit**
Découper `products/[id]/page.tsx` (1 663 lignes) en composants de section colocalisés. Chantier le plus lourd.
→ Voir `lots/v7-5-detail-produit.md`

**V7-6+ — Cohérence et finitions**
À définir selon les besoins constatés après les lots 1 à 5 : harmonisation des patterns restants, ajustements de densité, nouveaux composants shadcn si besoin concret.

---

## Règle de non-régression

Chaque lot doit passer :

- `pnpm run typecheck`
- les tests unitaires ciblés si le lot touche des entités
- les tests e2e ciblés sur les pages modifiées

Les headings métier et les sélecteurs e2e existants doivent être préservés sauf demande explicite.

Pour tout lot UI V7, vérifier aussi :

- la lisibilité desktop et mobile
- la cohérence du shell et des composants avec la base prioritaire shadcn/ui + Tailwind
- l'absence de navigation horizontale scrollable sur mobile

---

## Règle de stabilité des tests e2e

Les tests e2e ciblent les headings, les liens, les boutons et les rôles (`getByRole("article")`). Ne pas renommer ces éléments dans un lot de découpage structurel.

Si un renommage est nécessaire, il fait l'objet d'un lot séparé dédié au wording, pas au découpage.

---

## Rôle de `components/admin/`

La couche `components/admin/` est déjà engagée dans V7 et s'enrichit au fil des lots.

Elle accueille les composants admin réutilisables dès qu'un pattern est partagé sur plusieurs pages. Les composants strictement locaux à une page restent colocalisés tant qu'ils ne sont pas réutilisés.

Règle : un composant promu dans `components/admin/` doit avoir un usage réel sur au moins deux pages, ou être clairement destiné à être partagé. Ne pas créer une couche admin de composants fantômes jamais réutilisés.
