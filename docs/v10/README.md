# V10 — Admin pilotage & vues de données

## Positionnement

V8 a posé les fondations du design system admin (tokens, sidebar, shell). V9 a consolidé le front public (namespace CSS, tokens shell, cohérence structurelle). V10 rend l'admin **opérationnellement utile** : il doit permettre de piloter la boutique au quotidien, pas seulement de naviguer dans des pages vides.

Deux axes complémentaires :

1. **Pilotage** — Le dashboard admin affiche enfin des signaux concrets : commandes récentes, stocks bas, statuts de paiement. Ce n'est pas de l'analytics ; c'est l'essentiel pour gérer une commande dès le matin.

2. **Vues de données** — Les pages de liste admin passent d'une grille de cartes à des tables et DataTables là où c'est justifié. L'objectif est de gagner en densité et en capacité de tri/filtre, pas d'uniformiser mécaniquement.

## Ce que V10 n'est pas

- Une refonte complète de l'admin.
- Un framework DataTable universel appliqué à toutes les entités.
- Un tableau de bord analytics avec graphiques et KPIs.
- Une migration simultanée de toutes les pages.

## Structure

```
docs/v10/
├── README.md                                    ← ce fichier
├── admin-pilotage-and-data-views-doctrine.md    ← doctrine et principes
├── admin-pilotage-and-data-views-roadmap.md     ← inventaire et lot sequence
└── lots/
    ├── v10-1-dashboard-foundation.md            ← dashboard opérationnel
    ├── v10-2-table-pattern-foundation.md        ← socle Table + DataTable
    ├── v10-3-orders-and-products-list-views.md  ← commandes + produits
    └── v10-4-blog-and-categories-list-views.md  ← blog + catégories
```

## Séquence des lots

| Lot    | Titre                              | Dépendances   |
|--------|------------------------------------|---------------|
| V10-1  | Dashboard foundation               | aucune        |
| V10-2  | Table pattern foundation           | aucune        |
| V10-3  | Orders + products list views       | V10-2         |
| V10-4  | Blog + categories list views       | V10-2         |

V10-1 et V10-2 sont parallélisables. V10-3 et V10-4 requièrent V10-2.

## Critères de clôture V10

- [ ] Dashboard affiche au moins : dernières commandes, stock bas, total du mois
- [ ] `table.tsx` et `data-table.tsx` présents dans `components/ui/`
- [ ] Page commandes : DataTable avec filtre par statut fonctionnel
- [ ] Page produits : DataTable avec tri par nom et prix
- [ ] Page articles de blog : Table simple (lecture seule, pas de TanStack)
- [ ] Page catégories : inchangée (cartes conservées)
- [ ] `pnpm run typecheck` passe sans erreur
- [ ] Tests e2e admin passent
