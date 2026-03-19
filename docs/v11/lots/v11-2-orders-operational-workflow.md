# V11-2 — Workflows opérationnels commandes

## Prérequis

V11-1 terminé : patterns `DropdownMenu` et `AlertDialog` définis et testés.
V10-3 terminé : DataTable commandes avec `order-columns.tsx` et `orders-list-table.tsx`.

## Objectif

Réduire la friction de la gestion quotidienne des commandes. La transition la plus fréquente en production — commande payée → en préparation — nécessite aujourd'hui 3 étapes (liste → fiche → bouton). V11-2 la ramène à 1.

## Analyse des transitions actuelles

### Transitions autorisées (règles métier inchangées)

Définies dans `entities/order/order-status-transition.ts` :

| Statut actuel | Transitions disponibles  |
| ------------- | ------------------------ |
| `pending`     | `cancelled`              |
| `paid`        | `preparing`, `cancelled` |
| `preparing`   | `shipped`, `cancelled`   |
| `shipped`     | aucune                   |
| `cancelled`   | aucune                   |

### Décision par transition

| Transition              | Depuis la liste         | Raison                                         |
| ----------------------- | ----------------------- | ---------------------------------------------- |
| `paid → preparing`      | ✅ Quick action directe | La plus fréquente. Aucune saisie requise.      |
| `pending → cancelled`   | ⚠️ Avec AlertDialog     | Destructif. Toujours avec confirmation.        |
| `paid → cancelled`      | ⚠️ Avec AlertDialog     | Destructif. Toujours avec confirmation.        |
| `preparing → cancelled` | ⚠️ Avec AlertDialog     | Destructif. Toujours avec confirmation.        |
| `preparing → shipped`   | ❌ Fiche uniquement     | Nécessite la référence de suivi (champ texte). |

**La colonne d'actions depuis la liste expose uniquement les actions justifiées.** Les transitions non disponibles pour une commande donnée n'apparaissent pas.

## Structure cible

### Fichiers à créer / modifier

```
app/admin/(protected)/orders/
├── order-columns.tsx            ← modifier : ajouter colonne "actions"
├── orders-list-table.tsx        ← inchangé ou ajustement mineur
└── order-row-actions.tsx        ← créer : "use client"
```

### `order-row-actions.tsx`

```tsx
// app/admin/(protected)/orders/order-row-actions.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { MoreHorizontalIcon } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminOrderSummary } from "@/db/repositories/order.repository";
import { updateOrderStatusAction } from "@/features/admin/orders/actions/update-order-status-action";

type OrderRowActionsProps = {
  order: AdminOrderSummary;
};

export function OrderRowActions({ order }: OrderRowActionsProps) {
  const preparingFormRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLFormElement>(null);

  const canPrepare = order.status === "paid";
  const canCancel = ["pending", "paid", "preparing"].includes(order.status);

  return (
    <>
      {/* Formulaires cachés pour les Server Actions */}
      <form ref={preparingFormRef} action={updateOrderStatusAction}>
        <input type="hidden" name="orderId" value={order.id} />
        <input type="hidden" name="nextStatus" value="preparing" />
      </form>
      <form ref={cancelFormRef} action={updateOrderStatusAction}>
        <input type="hidden" name="orderId" value={order.id} />
        <input type="hidden" name="nextStatus" value="cancelled" />
      </form>

      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontalIcon className="size-4" />
              <span className="sr-only">Actions commande {order.reference}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/orders/${order.id}`}>Voir le détail</Link>
            </DropdownMenuItem>

            {canPrepare ? (
              <DropdownMenuItem onClick={() => preparingFormRef.current?.requestSubmit()}>
                Marquer en préparation
              </DropdownMenuItem>
            ) : null}

            {canCancel ? (
              <>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    Annuler la commande
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la commande {order.reference} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La commande sera annulée et le stock des articles sera
              rétabli automatiquement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Garder la commande</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => cancelFormRef.current?.requestSubmit()}
            >
              Annuler la commande
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

### Ajout de la colonne dans `order-columns.tsx`

Ajouter en dernière position du tableau `orderColumns` :

```tsx
{
  id: "actions",
  header: "",
  enableSorting: false,
  cell: ({ row }) => <OrderRowActions order={row.original} />,
}
```

Importer `OrderRowActions` depuis `"./order-row-actions"`.

## Règles métier conservées

- `updateOrderStatusAction` est appelé sans modification
- La validation de la transition est faite côté serveur (`resolveOrderStatusTransition`)
- Si la transition est refusée par le serveur, le redirect vers `?order_error=invalid_transition` se déclenche normalement
- Les statuts `shipped` et `cancelled` n'exposent aucune action depuis la liste — la cellule actions est vide ou réduite à "Voir le détail"

## Feedback

Le pattern de feedback reste identique à l'existant :

- Succès : redirect vers `/admin/orders/${orderId}?order_status=updated`
- Erreur : redirect vers `/admin/orders/${orderId}?order_error=invalid_transition`

La différence : on arrive sur la fiche de détail, pas sur la liste. Ce comportement est cohérent — après une transition, il est utile de voir l'état mis à jour sur la fiche.

## Cas particulier — "Voir le détail" depuis le menu

"Voir le détail" reste dans le `DropdownMenu` comme premier item, mais le lien texte dans la cellule de référence (colonne 1) reste également. Les deux coexistent : la cellule principale est la porte d'entrée naturelle, le menu est le point d'action contextuel.

Il ne faut pas supprimer le lien "Voir le détail" de la cellule référence — les e2e tests l'utilisent.

## Travail à réaliser

1. Créer `order-row-actions.tsx` colocalisé
2. Modifier `order-columns.tsx` — ajouter la colonne `actions` en fin de tableau
3. Vérifier que les e2e existants passent (ils utilisent `getByRole("article")` dans la cellule référence, pas la colonne actions)

## Vérifications

- `pnpm run typecheck`
- `pnpm exec playwright test tests/e2e/admin/orders.spec.ts`
- Navigation manuelle `/admin/orders` :
  - Commande `paid` : menu expose "Voir le détail" + "Marquer en préparation"
  - Commande `pending` : menu expose "Voir le détail" + "Annuler la commande" (avec AlertDialog)
  - Commande `shipped` : menu expose "Voir le détail" uniquement
  - Commande `cancelled` : menu expose "Voir le détail" uniquement
- Vérifier que la transition paid → preparing depuis la liste met bien à jour le statut

## Non-inclus dans ce lot

- Expédition depuis la liste (impossible sans champ de saisie)
- Modification des notes ou informations de commande
- Bulk actions sur les commandes
- Filtres supplémentaires
