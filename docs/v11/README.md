# V11 — Admin workflows métier

## Positionnement

V8 a stabilisé l'admin visuellement. V9 a consolidé le front public. V10 a rendu l'admin lisible et pilotable : dashboard opérationnel, DataTable commandes et produits, Table blog.

V11 complète le cycle opérationnel : une fois que l'on **voit** les données efficacement, l'étape suivante est d'**agir** dessus sans friction inutile ni risque involontaire.

Le cycle complet d'un admin métier : **voir → décider → agir**. V11 pose la troisième jambe.

## Ce que V11 est

- Des actions contextuelles directement accessibles depuis les listes
- Des confirmations sobres pour les actions destructives — aujourd'hui absentes
- Moins d'allers-retours inutiles entre liste et fiche pour les transitions courantes
- Un pattern de feedback clair et cohérent
- Un admin plus rapide au quotidien, sans magie

## Ce que V11 n'est pas

- Une refonte du shell ou du design system
- Une phase analytics ou charts
- Un redesign du front public
- Une extension bulk actions complexes
- Un fourre-tout de fonctionnalités secondaires

## Structure

```
docs/v11/
├── README.md                                    ← ce fichier
├── admin-workflows-doctrine.md                  ← doctrine et principes
├── admin-workflows-roadmap.md                   ← inventaire et séquence
└── lots/
    ├── v11-1-row-actions-and-safe-quick-actions.md  ← fondation patterns
    ├── v11-2-orders-operational-workflow.md         ← commandes
    ├── v11-3-products-quick-management.md           ← produits
    └── v11-4-admin-feedback-and-friction-reduction.md  ← blog + feedback
```

## Séquence des lots

| Lot   | Titre                                       | Dépendances |
| ----- | ------------------------------------------- | ----------- |
| V11-1 | Row actions + confirmations sûres           | V10-2       |
| V11-2 | Workflows opérationnels commandes           | V11-1       |
| V11-3 | Gestion rapide produits                     | V11-1       |
| V11-4 | Feedback admin + réduction friction restant | V11-1       |

V11-1 est la fondation. V11-2, V11-3 et V11-4 peuvent être parallélisés après V11-1.

## Critères de clôture V11

- [ ] "Annuler la commande" présente une confirmation `AlertDialog` avant exécution
- [ ] "Supprimer le produit" présente une confirmation `AlertDialog` avant exécution
- [ ] La DataTable commandes expose une colonne d'actions avec `DropdownMenu`
- [ ] La transition paid → preparing est accessible depuis la liste commandes
- [ ] La DataTable produits expose une colonne d'actions avec `DropdownMenu`
- [ ] Le statut produit est modifiable directement depuis la liste
- [ ] Le statut article blog est modifiable directement depuis la Table blog
- [ ] Le pattern de feedback est documenté et cohérent
- [ ] `pnpm run typecheck` passe sans erreur
- [ ] Tests e2e ciblés passent
