# V10-3 — Orders + products list views

## Prérequis

V10-2 terminé : `components/ui/table.tsx`, `components/ui/data-table.tsx`, et `@tanstack/react-table` installés.

## Objectif

Migrer les pages commandes et produits de la grille de cartes vers la DataTable. Ces deux entités justifient TanStack Table : volume variable, besoin de filtre (commandes) et de tri (produits), densité opérationnelle nécessaire.

## Lot 1 — Page commandes

### État avant

`app/admin/commandes/page.tsx` : grille de cartes `AdminOrderCard`. Pas de filtre, pas de tri, pas de pagination.

### État cible

DataTable avec :

- Colonnes : référence, client (nom + email), statut commande, statut paiement, total, date de création
- Filtre texte sur la colonne référence ou email client
- Filtre par statut commande (sélecteur ou filtre de colonne)
- Tri par date (décroissant par défaut)
- Pagination 20 lignes par page

### Type de données

Déterminer le type retourné par le repository commandes pour la liste admin. Adapter ou créer une requête de liste si nécessaire :

```typescript
// db/repositories/order.repository.ts
export async function findAdminOrderList(): Promise<AdminOrderListItem[]>;

type AdminOrderListItem = {
  id: string;
  reference: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: string; // formaté
  createdAt: Date;
};
```

### Colonnes

```typescript
// features/orders/columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { AdminOrderListItem } from "@/db/repositories/order.repository";
import { getOrderStatusLabel, getPaymentStatusLabel } from "@/entities/order/order-status-presentation";

export const orderColumns: ColumnDef<AdminOrderListItem>[] = [
  {
    accessorKey: "reference",
    header: "Référence",
    cell: ({ row }) => (
      <Link href={`/admin/commandes/${row.original.id}`} className="link">
        {row.getValue("reference")}
      </Link>
    ),
  },
  {
    id: "client",
    header: "Client",
    cell: ({ row }) => (
      <div>
        <p>{row.original.customerFirstName} {row.original.customerLastName}</p>
        <p className="form-note">{row.original.customerEmail}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => getOrderStatusLabel(row.getValue("status")),
  },
  {
    accessorKey: "paymentStatus",
    header: "Paiement",
    cell: ({ row }) => getPaymentStatusLabel(row.getValue("paymentStatus")),
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" }).format(row.getValue("createdAt")),
    sortingFn: "datetime",
  },
];
```

### Page

```typescript
// app/admin/commandes/page.tsx (structure cible)
import { findAdminOrderList } from "@/db/repositories/order.repository";
import { DataTable } from "@/components/ui/data-table";
import { orderColumns } from "@/features/orders/columns";

export default async function AdminCommandesPage() {
  const orders = await findAdminOrderList();

  return (
    <div className="admin-page">
      {/* header existant conservé */}
      <DataTable
        columns={orderColumns}
        data={orders}
        filterColumn="reference"
        filterPlaceholder="Chercher par référence..."
      />
    </div>
  );
}
```

### Sort par défaut

Configurer `initialState` dans `DataTable` ou dans la page pour trier par `createdAt` décroissant :

```typescript
initialState: {
  sorting: [{ id: "createdAt", desc: true }],
  pagination: { pageSize: 20 }
}
```

---

## Lot 2 — Page produits

### État avant

`app/admin/produits/page.tsx` : grille de cartes `AdminProductCard`. Filtre par catégorie existant via `searchParams`. Pas de tri.

### État cible

DataTable avec :

- Colonnes : nom produit, catégorie, prix de base, nombre de variantes, statut (actif/inactif)
- Tri par nom (alpha)
- Tri par prix
- Filtre texte sur le nom du produit
- Pagination 20 lignes par page
- Lien vers la fiche produit admin depuis la colonne nom

**Décision filtre catégorie :** le filtre par catégorie actuel (via searchParams URL) peut être conservé côté serveur pour la première itération, ou migré en filtre de colonne TanStack. Préférer la continuité : conserver le filtre serveur existant, ajouter le tri client via DataTable. Cela évite de casser le comportement existant.

### Type de données

```typescript
// db/repositories/product.repository.ts (ou existant)
export async function findAdminProductList(categorySlug?: string): Promise<AdminProductListItem[]>;

type AdminProductListItem = {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  basePrice: string; // formaté
  variantCount: number;
  isActive: boolean;
};
```

### Colonnes

```typescript
// features/products/columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { AdminProductListItem } from "@/db/repositories/product.repository";

export const productColumns: ColumnDef<AdminProductListItem>[] = [
  {
    accessorKey: "name",
    header: "Produit",
    cell: ({ row }) => (
      <Link href={`/admin/produits/${row.original.slug}`} className="link">
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "categoryName",
    header: "Catégorie",
  },
  {
    accessorKey: "basePrice",
    header: "Prix de base",
  },
  {
    accessorKey: "variantCount",
    header: "Variantes",
  },
  {
    accessorKey: "isActive",
    header: "Statut",
    cell: ({ row }) => row.getValue("isActive") ? "Actif" : "Inactif",
  },
];
```

---

## Travail à réaliser

### Commandes

1. Vérifier/adapter le type `AdminOrderListItem` dans le repository
2. Créer `features/orders/columns.tsx`
3. Modifier `app/admin/commandes/page.tsx`
4. Supprimer `AdminOrderCard` si plus utilisée ailleurs (vérifier avec grep)

### Produits

1. Vérifier/adapter le type `AdminProductListItem` dans le repository
2. Créer `features/products/columns.tsx`
3. Modifier `app/admin/produits/page.tsx`
4. Conserver le filtre catégorie existant (searchParams)
5. Supprimer `AdminProductCard` si plus utilisée ailleurs (vérifier avec grep)

### Vérifications

- `pnpm run typecheck`
- Navigation manuelle vers `/admin/commandes` et `/admin/produits`
- Vérifier que le tri et le filtre fonctionnent
- Vérifier que les liens vers les fiches individuelles fonctionnent
- e2e ciblés si des tests admin existent

## Risques et garde-fous

- **`AdminOrderCard` / `AdminProductCard`** : vérifier avec grep avant de supprimer — elles peuvent être utilisées sur des pages de détail ou d'autres contextes.
- **Filtre catégorie produits** : ne pas casser le comportement existant. Si le filtre server-side est conservé, le searchParam doit continuer à être transmis.
- **Types existants** : ne pas supposer que les types correspondent — lire les repositories avant d'implémenter.

## Non-inclus dans ce lot

- Filtres avancés multi-critères
- Export des données
- Actions bulk (suppression en masse, etc.)
- Tri côté serveur
