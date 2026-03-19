# V7 — Documentation admin UI/UX

## Ce qu'est V7

V7 est un prolongement de V6 centré sur la modernisation de l'interface d'administration interne. Son périmètre est strictement limité à `app/admin/`. Il ne touche ni le front public, ni le tunnel d'achat, ni les règles métier.

Trois axes :

1. **Shell admin** — sidebar fixe desktop, header fixe, contenu scrollable, navigation mobile via `Sheet` / drawer.
2. **Couche `components/admin/`** — faire de cette couche la référence pour les patterns admin, construits prioritairement avec shadcn/ui + Tailwind.
3. **Découpage des pages volumineuses** — réduire `page.tsx` à un rôle d'orchestration.

## Ce que V7 ne change pas

- Aucune règle métier, validation, repository, schéma ni route.
- Aucun vocabulaire visible dans l'admin (sauf correctif explicite).
- Aucune page hors `app/admin/` (front public, tunnel, paiement, authentification).

## Documents V7

| Fichier                                   | Rôle                                        |
| ----------------------------------------- | ------------------------------------------- |
| `admin-ui-ux-doctrine.md`                 | Cadre général, stable et transversal        |
| `admin-ui-ux-roadmap.md`                  | Stratégie de migration, ordre des chantiers |
| `lots/v7-1-shell-admin.md`                | Lot V7-1 — fondation shell admin            |
| `lots/v7-2-pages-listes.md`               | Lot V7-2 — pages listes simples             |
| `lots/v7-3-formulaires-intermediaires.md` | Lot V7-3 — formulaires intermédiaires       |
| `lots/v7-4-detail-commande.md`            | Lot V7-4 — détail commande                  |
| `lots/v7-5-detail-produit.md`             | Lot V7-5 — détail produit                   |

## Ordre de lecture conseillé

1. `admin-ui-ux-doctrine.md` — pour comprendre le cadre
2. `admin-ui-ux-roadmap.md` — pour situer les lots dans la progression
3. Le fichier `lots/v7-X-*.md` du lot concerné — pour implémenter

## Documents de référence V6 prolongés

- `docs/v6/admin-language-and-ux.md` — vocabulaire, structure d'écran, règles de formulation
- `docs/v6/glossary.md` — terminologie métier officielle
- `docs/v6/tailwind-shadcn-migration.md` — règles de migration Tailwind/shadcn

La doctrine V7 prolonge ces documents sans les contredire.
