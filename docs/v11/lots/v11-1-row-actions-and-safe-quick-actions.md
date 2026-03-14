# V11-1 — Row actions et confirmations sûres

## Prérequis

V10-2 terminé : `components/ui/data-table.tsx`, `components/ui/table.tsx`, `@tanstack/react-table` en place.
V10-3 terminé : colonnes DataTable commandes et produits définies dans `order-columns.tsx` et `product-columns.tsx`.

Composants shadcn disponibles sans installation supplémentaire :
- `components/ui/alert-dialog.tsx`
- `components/ui/dropdown-menu.tsx`

## Objectif

Poser les deux patterns fondateurs de V11 et corriger immédiatement les deux vulnérabilités les plus critiques du repo.

**Pattern 1 — Colonne d'actions avec DropdownMenu**
Chaque DataTable doit exposer une colonne "Actions" à droite, avec un bouton déclencheur `⋮` (MoreHorizontal) qui ouvre un `DropdownMenu`. Chaque item du menu correspond à une action ou un lien métier.

**Pattern 2 — Confirmation destructive avec AlertDialog**
Toute action irréversible doit passer par un `AlertDialog` avant d'atteindre le Server Action. Ce composant s'intercale entre le déclencheur et l'action, sans modifier le Server Action existant.

## Lot 1 — Correction : "Annuler la commande"

### État actuel

`app/admin/(protected)/orders/[id]/order-detail-actions-card.tsx` — lignes concernées :

```tsx
<Button
  variant={nextStatus === "cancelled" ? "destructive" : "outline"}
  type="submit">
  {getOrderTransitionLabel(nextStatus)}
</Button>
```

Pour `nextStatus === "cancelled"`, ce bouton soumet immédiatement un `<form action={updateOrderStatusAction}>` sans aucune étape intermédiaire. L'annulation est irréversible pour le client (restock automatique, statut figé).

### Cible

Le bouton "Annuler la commande" déclenche un `AlertDialog` avec :
- **Titre :** "Annuler cette commande ?"
- **Description :** "Cette action est irréversible. La commande sera annulée et le stock des articles sera rétabli."
- **Bouton confirmer :** "Annuler la commande" (variant destructive)
- **Bouton annuler :** "Garder la commande"

Sur confirmation, le formulaire existant est soumis (`updateOrderStatusAction` inchangé).

### Structure cible

Créer un composant client colocalisé :

```
app/admin/(protected)/orders/[id]/
└── order-cancel-confirm-dialog.tsx   ← "use client"
```

```tsx
// order-cancel-confirm-dialog.tsx
"use client";

import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { updateOrderStatusAction } from "@/features/admin/orders/actions/update-order-status-action";

type OrderCancelConfirmDialogProps = {
  orderId: string;
};

export function OrderCancelConfirmDialog({ orderId }: OrderCancelConfirmDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={updateOrderStatusAction}>
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="nextStatus" value="cancelled" />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" type="button">
            Annuler la commande
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler cette commande ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La commande sera annulée et le stock
              des articles sera rétabli automatiquement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Garder la commande</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => formRef.current?.requestSubmit()}>
              Annuler la commande
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
```

`OrderDetailActionsCard` reste un composant serveur. Il importe `OrderCancelConfirmDialog` uniquement pour le cas `nextStatus === "cancelled"`. Les autres boutons de transition (`"preparing"`) conservent leur formulaire direct — ils ne sont pas destructifs.

### Ce qui ne change pas

- `updateOrderStatusAction` — inchangé
- Le redirect vers `?order_status=updated` — inchangé
- Les autres boutons de transition — inchangés
- `order-detail-actions-card.tsx` — modification minimale : remplacer le bouton "cancelled" par `<OrderCancelConfirmDialog orderId={order.id} />`

## Lot 2 — Correction : "Supprimer le produit"

### État actuel

`app/admin/(protected)/products/[id]/product-danger-zone-section.tsx` :

```tsx
<form action={deleteProductAction}>
  <input name="productId" type="hidden" value={productId} />
  <Button className="w-full sm:w-fit" variant="destructive" type="submit">
    Supprimer le produit
  </Button>
</form>
```

Suppression immédiate sans confirmation. Conséquences : produit supprimé avec toutes ses catégories associées, déclinaisons, images.

### Cible

Le bouton "Supprimer le produit" déclenche un `AlertDialog` avec :
- **Titre :** "Supprimer ce produit ?"
- **Description :** "Cette action est irréversible. Le produit sera supprimé avec ses déclinaisons et ses images."
- **Bouton confirmer :** "Supprimer le produit" (variant destructive)
- **Bouton annuler :** "Conserver le produit"

### Structure cible

Créer un composant client colocalisé :

```
app/admin/(protected)/products/[id]/
└── product-delete-confirm-dialog.tsx   ← "use client"
```

Même pattern que `OrderCancelConfirmDialog` — un `useRef<HTMLFormElement>` pour soumettre le formulaire existant après confirmation dans l'`AlertDialogAction`.

`ProductDangerZoneSection` importe ce nouveau composant. `deleteProductAction` reste inchangé.

## Lot 3 — Définition du pattern DropdownMenu pour les DataTable

### Principe

Ce lot définit le pattern de colonne d'actions qui sera utilisé en V11-2 et V11-3. Il ne l'implémente pas encore sur les DataTable — c'est V11-2 et V11-3 qui le font. L'objectif ici est de documenter le pattern et de créer le helper partagé si nécessaire.

### Pattern colonne d'actions

```tsx
// Colonne à ajouter dans columns.tsx (order-columns.tsx, product-columns.tsx)
{
  id: "actions",
  header: "",
  cell: ({ row }) => <EntityRowActions entity={row.original} />,
}
```

Le composant `EntityRowActions` est un Client Component colocalisé :

```tsx
"use client";

import { MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Exemple générique — chaque entité a son propre composant
export function EntityRowActions({ entity }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontalIcon className="size-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* items métier spécifiques à chaque entité */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Règles du DropdownMenu

- Le déclencheur est un bouton icon ghost (`MoreHorizontal`), accessible avec un `sr-only` label
- `align="end"` pour éviter le débordement hors de la table à droite
- Un `DropdownMenuItem` par action, avec une icône optionnelle (Lucide)
- Les items destructifs utilisent la classe `text-destructive focus:text-destructive`
- Si l'item déclenche un `AlertDialog`, il doit passer par le pattern `ref + requestSubmit` décrit ci-dessus
- Pas de `DropdownMenuSeparator` si la liste contient moins de 4 items

### Règles de décision : bouton inline vs DropdownMenu

| Cas | Pattern recommandé |
|-----|--------------------|
| 1 action par ligne | Lien ou bouton inline — pas de menu |
| 2 actions homogènes | Peut rester inline si elles tiennent dans la cellule |
| 2+ actions dont une destructive | `DropdownMenu` |
| 3+ actions | `DropdownMenu` systématique |

## Travail à réaliser dans ce lot

1. Créer `order-cancel-confirm-dialog.tsx` colocalisé
2. Modifier `order-detail-actions-card.tsx` — remplacer le bouton `cancelled` par le composant
3. Créer `product-delete-confirm-dialog.tsx` colocalisé
4. Modifier `product-danger-zone-section.tsx` — remplacer le bouton `deleteProductAction` par le composant
5. Documenter le pattern DropdownMenu pour V11-2 et V11-3 (ce document suffit)

## Vérifications

- `pnpm run typecheck`
- `pnpm exec playwright test tests/e2e/admin/orders.spec.ts tests/e2e/admin/products.spec.ts`
- Navigation manuelle : vérifier que "Annuler la commande" affiche bien l'AlertDialog
- Navigation manuelle : vérifier que "Supprimer le produit" affiche bien l'AlertDialog
- Navigation manuelle : vérifier que les autres boutons de transition (preparing) fonctionnent toujours directement

## Non-inclus dans ce lot

- Implémentation des colonnes d'actions dans les DataTable (V11-2, V11-3)
- Quick actions depuis les listes (V11-2, V11-3)
- Blog (V11-4)
- Modification des Server Actions existants
