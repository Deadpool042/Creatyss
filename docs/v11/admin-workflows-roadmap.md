# Roadmap — Admin workflows métier (V11)

## État actuel après V10

### Ce qui fonctionne bien

- DataTable commandes : colonnes claires, filtre statut, filtre texte, tri par date
- DataTable produits : colonnes métier, tri, filtre nom
- Table blog : lecture propre, lien "Modifier l'article"
- Fiche commande : actions de transition bien structurées dans `OrderDetailActionsCard`
- Fiche produit : sections bien découpées, danger zone identifiable
- Server Actions : solidement isolés dans `features/admin/*/actions/`

### Ce qui crée de la friction ou du risque

| Point                  | Page / Composant                  | Problème                                                                |
| ---------------------- | --------------------------------- | ----------------------------------------------------------------------- |
| "Annuler la commande"  | `order-detail-actions-card.tsx`   | Aucune confirmation — action irréversible en un clic                    |
| "Supprimer le produit" | `product-danger-zone-section.tsx` | Aucune confirmation — suppression définitive en un clic                 |
| Paid → Preparing       | Liste commandes                   | 3 étapes : liste → fiche → bouton. Transition la plus fréquente en prod |
| Publier / Dépublier    | Liste produits                    | Nécessite la fiche complète pour un simple toggle de statut             |
| Publier un article     | Table blog                        | Nécessite la fiche pour un simple changement de statut                  |
| Actions par ligne      | DataTable commandes               | Colonne "Voir le détail" uniquement — pas d'action contextuelle         |
| Actions par ligne      | DataTable produits                | Cellule nom avec lien — pas de colonne d'actions dédiée                 |

## Composants shadcn disponibles pour V11

Tous déjà installés dans `components/ui/` :

| Composant           | Usage                             |
| ------------------- | --------------------------------- |
| `alert-dialog.tsx`  | Confirmations destructives        |
| `dropdown-menu.tsx` | Row actions multi-choix           |
| `sonner.tsx`        | Feedback succès léger (optionnel) |

Aucune nouvelle installation de composant shadcn n'est requise pour V11.

## Séquence des lots

### V11-1 — Row actions + confirmations sûres (fondation)

**Dépendance :** V10-2 (DataTable en place)
**Priorité :** critique
**Périmètre :** patterns fondateurs et corrections de vulnérabilités existantes

Ce lot définit les deux patterns fondateurs de V11 :

1. Le pattern `DropdownMenu` pour les colonnes d'actions dans les DataTable
2. Le pattern `AlertDialog` pour les confirmations destructives

Ce lot applique immédiatement ces patterns aux deux vulnérabilités actuelles les plus critiques :

- `AlertDialog` sur "Annuler la commande" (order detail)
- `AlertDialog` sur "Supprimer le produit" (product detail)

### V11-2 — Workflows opérationnels commandes

**Dépendance :** V11-1
**Priorité :** haute
**Périmètre :** DataTable commandes — colonne d'actions + quick transition

Ce lot ajoute à la DataTable commandes une colonne d'actions par ligne :

- Lien vers le détail (toujours)
- Quick action contextuelle selon statut : pour une commande payée, transition directe vers "en préparation" depuis la liste
- `AlertDialog` pour "Annuler" si exposée depuis la liste

L'expédition reste sur la fiche — elle nécessite la saisie de la référence de suivi.

### V11-3 — Gestion rapide produits

**Dépendance :** V11-1
**Priorité :** haute
**Périmètre :** DataTable produits — colonne d'actions + toggle statut + suppression depuis liste

Ce lot ajoute à la DataTable produits une colonne d'actions par ligne :

- Lien "Modifier" vers la fiche (toujours)
- Toggle Publier / Brouillon — action directe, feedback via redirect
- Supprimer — avec `AlertDialog` obligatoire, depuis la liste

Un nouveau Server Action ciblé peut être nécessaire pour le toggle de statut.

### V11-4 — Blog quick management + feedback admin

**Dépendance :** V11-1
**Priorité :** normale
**Périmètre :** Table blog quick publish + revue pattern feedback

Ce lot complète V11 :

- Table blog : colonne d'actions avec toggle Publier / Brouillon + lien "Modifier"
- Revue du pattern de feedback : documenter quand redirect-searchParams, quand Sonner
- Identification d'éventuelles frictions résiduelles hors commandes/produits/blog

## Critères de clôture V11

### Conformité pattern

- [ ] `AlertDialog` utilisé systématiquement pour toute action irréversible
- [ ] `DropdownMenu` utilisé pour les colonnes multi-actions dans les DataTable
- [ ] Aucune action destructive accessible sans confirmation après V11

### Fonctionnel commandes

- [ ] Transition paid → preparing accessible depuis la liste commandes
- [ ] "Annuler une commande" protégée par `AlertDialog` sur la fiche
- [ ] Colonne d'actions présente dans la DataTable commandes

### Fonctionnel produits

- [ ] Toggle statut accessible depuis la liste produits
- [ ] "Supprimer le produit" protégée par `AlertDialog` sur la fiche
- [ ] Colonne d'actions présente dans la DataTable produits

### Fonctionnel blog

- [ ] Toggle statut accessible depuis la Table blog

### Technique

- [ ] `pnpm run typecheck` passe sans erreur
- [ ] Tests e2e ciblés passent (orders, products, blog)
- [ ] Aucun composant Server Component transformé inutilement en Client Component

## Non-inclus dans V11

- Bulk actions sur les listes (sélection multi-lignes)
- Modifications du schéma PostgreSQL
- Modifications des Server Actions existants (sauf ajout si strictement nécessaire)
- Modifications des repositories
- Pagination serveur
- Export CSV ou données
- Analytics et KPIs
- Changements shell ou navigation
- Refonte des fiches de détail
- Modifications front public
