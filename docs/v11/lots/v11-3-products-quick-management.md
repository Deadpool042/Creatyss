# V11-3 — Gestion rapide produits

## Prérequis

V11-1 terminé : patterns `DropdownMenu` et `AlertDialog` définis et testés.
V10-3 terminé : DataTable produits avec `product-columns.tsx` et `products-list-table.tsx`.

## Objectif

Deux actions fréquentes sur les produits nécessitent aujourd'hui de naviguer sur la fiche complète :
1. Publier ou dépublier un produit
2. Supprimer un produit

V11-3 rend ces deux actions accessibles depuis la liste, avec les protections appropriées.

## Analyse des actions produit

### Actions existantes (Server Actions dans `features/admin/products/actions/`)

| Action | Fichier | Usage actuel |
|--------|---------|-------------|
| `createProductAction` | `create-product-action.ts` | Formulaire création |
| `updateProductAction` | `update-product-action.ts` | Formulaire édition général |
| `deleteProductAction` | `delete-product-action.ts` | Fiche produit, danger zone |
| `updateSimpleProductOfferAction` | `update-simple-product-offer-action.ts` | Section vente |
| (variantes, images…) | autres fichiers | Fiche produit |

### Ce que V11-3 ajoute

**Toggle de statut** (`draft ↔ published`) :

Une nouvelle Server Action ciblée est nécessaire : `toggleProductStatusAction`. Cette action reçoit un `productId` et bascule le statut du produit sans recharger le formulaire complet. Elle ne modifie aucune autre propriété.

Cette action est justifiée car `updateProductAction` requiert tous les champs du formulaire général (nom, slug, catégories, etc.) — elle ne peut pas être appelée depuis une cellule DataTable qui ne dispose pas de ces données.

**Suppression depuis la liste** :

`deleteProductAction` existe déjà. V11-3 l'expose depuis la liste avec `AlertDialog` de confirmation, exactement comme le fait V11-1 depuis la fiche. Ce n'est pas une duplication — c'est le même Server Action, accessible depuis un nouveau point d'entrée.

## Nouveau Server Action : `toggleProductStatusAction`

### Contrat

```typescript
// features/admin/products/actions/toggle-product-status-action.ts
"use server";

// Entrée : productId (FormData)
// Comportement : lit le statut actuel, bascule draft↔published, sauvegarde
// Sortie : redirect vers /admin/products/${productId}?product_status=updated
//          ou /admin/products?error=missing_product si produit introuvable

export async function toggleProductStatusAction(formData: FormData): Promise<void>
```

### Contraintes

- Lit le statut actuel depuis la base (ne fait pas confiance à un statut passé en FormData — évite les manipulations)
- Applique la bascule : `published → draft`, `draft → published`
- Redirige vers la fiche produit après succès (pour voir le résultat)
- Redirige vers la liste avec erreur si le produit n'existe pas
- Ne modifie aucune autre propriété du produit

### Repository

Cette action peut appeler une nouvelle fonction de repository ou réutiliser une requête SQL simple. Elle ne passe pas par `updateAdminProduct` (trop lourd — charge toutes les catégories, etc.).

Une fonction légère est suffisante :

```typescript
// Dans admin-product.repository.ts
export async function toggleAdminProductStatus(id: string): Promise<"draft" | "published" | null>
// Retourne le nouveau statut si succès, null si produit introuvable
```

## Structure cible

### Fichiers à créer / modifier

```
app/admin/(protected)/products/
├── product-columns.tsx                    ← modifier : ajouter colonne "actions"
├── products-list-table.tsx                ← inchangé
└── product-row-actions.tsx                ← créer : "use client"

features/admin/products/actions/
└── toggle-product-status-action.ts        ← créer : "use server"

db/repositories/
└── admin-product.repository.ts            ← modifier : ajouter toggleAdminProductStatus
```

### `product-row-actions.tsx`

```tsx
// app/admin/(protected)/products/product-row-actions.tsx
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
import type { AdminProductSummary } from "@/db/repositories/admin-product.repository";
import { toggleProductStatusAction } from "@/features/admin/products/actions/toggle-product-status-action";
import { deleteProductAction } from "@/features/admin/products/actions/delete-product-action";

type ProductRowActionsProps = {
  product: AdminProductSummary;
};

export function ProductRowActions({ product }: ProductRowActionsProps) {
  const toggleFormRef = useRef<HTMLFormElement>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);

  const toggleLabel = product.status === "published" ? "Passer en brouillon" : "Publier";

  return (
    <>
      <form ref={toggleFormRef} action={toggleProductStatusAction}>
        <input type="hidden" name="productId" value={product.id} />
      </form>
      <form ref={deleteFormRef} action={deleteProductAction}>
        <input type="hidden" name="productId" value={product.id} />
      </form>

      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontalIcon className="size-4" />
              <span className="sr-only">Actions produit {product.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}`}>Modifier</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toggleFormRef.current?.requestSubmit()}>
              {toggleLabel}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Supprimer
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer « {product.name} » ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit sera supprimé avec ses
              déclinaisons et ses images.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Conserver le produit</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteFormRef.current?.requestSubmit()}>
              Supprimer le produit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

### Colonne dans `product-columns.tsx`

Ajouter en dernière position du tableau `productColumns` :

```tsx
{
  id: "actions",
  header: "",
  enableSorting: false,
  cell: ({ row }) => <ProductRowActions product={row.original} />,
}
```

## Feedback

**Toggle de statut** : redirige vers `/admin/products/${productId}?product_status=updated`. L'admin arrive sur la fiche avec le statut mis à jour visible.

**Suppression depuis la liste** : redirige vers `/admin/products?status=deleted` (même redirect que la suppression depuis la fiche).

Ces redirects s'appuient sur les messages déjà définis dans `products/page.tsx` (`getStatusMessage`) — aucune modification de page nécessaire.

## Sélecteurs e2e à préserver

`tests/e2e/admin/products.spec.ts` utilise :
- `page.locator("article.admin-product-card")` — dans la cellule `name` de `product-columns.tsx`
- `productCards.first().getByRole("link", { name: "Modifier le produit" })` — lien dans la cellule nom

Ces sélecteurs portent sur la cellule `name`, pas sur la colonne `actions`. Ils ne sont pas affectés.

Le lien "Modifier le produit" dans la cellule `name` reste intact. Le lien "Modifier" dans le DropdownMenu est un accès supplémentaire, pas un remplacement.

## Travail à réaliser

1. Ajouter `toggleAdminProductStatus` dans `admin-product.repository.ts`
2. Créer `toggle-product-status-action.ts` dans `features/admin/products/actions/`
3. Créer `product-row-actions.tsx` colocalisé dans la page produits
4. Modifier `product-columns.tsx` — ajouter la colonne `actions`
5. Vérifier que `product-danger-zone-section.tsx` expose toujours la suppression avec AlertDialog (posé en V11-1 — les deux points d'entrée coexistent)

## Vérifications

- `pnpm run typecheck`
- `pnpm exec playwright test tests/e2e/admin/products.spec.ts`
- Navigation manuelle `/admin/products` :
  - Produit publié : menu expose "Modifier", "Passer en brouillon", "Supprimer"
  - Produit brouillon : menu expose "Modifier", "Publier", "Supprimer"
  - "Supprimer" ouvre bien l'AlertDialog
  - Le toggle de statut met à jour le badge dans la liste après redirect

## Non-inclus dans ce lot

- Modification des catégories depuis la liste
- Gestion des variantes depuis la liste
- Gestion des images depuis la liste
- Duplication de produit
- Bulk actions
