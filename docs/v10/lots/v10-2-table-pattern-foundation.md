# V10-2 — Table pattern foundation

## Objectif

Installer le socle technique qui rend V10-3 et V10-4 possibles : composants Table shadcn, dépendance TanStack Table, et wrapper générique `data-table.tsx`. Ce lot ne migre aucune page — il pose uniquement les fondations.

## Transparence sur les sources

L'architecture de ce lot a été élaborée à partir de la documentation officielle shadcn/ui, consultée via le MCP shadcn disponible en session Claude Code. Éléments retenus :

- Structure `ColumnDef<T>[]` pour définir les colonnes par entité
- Hook `useReactTable` de `@tanstack/react-table`
- Rendu via `flexRender` pour les headers et cellules
- Pattern `data-table.tsx` générique + `columns.tsx` colocalisé

Ce qui n'a pas été exécuté en session de documentation : les commandes CLI et `pnpm add` ci-dessous. Elles font partie du travail d'implémentation de ce lot.

## Installation

### Étape 1 — Ajouter les composants Table shadcn

```bash
npx shadcn@latest add table
```

Génère dans `components/ui/` :

```
table.tsx   ← Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption
```

### Étape 2 — Installer TanStack Table

```bash
pnpm add @tanstack/react-table
```

## Écriture de `data-table.tsx`

Créer `components/ui/data-table.tsx` — wrapper générique TanStack Table :

```typescript
"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;        // colonne sur laquelle afficher un filtre texte
  filterPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder = "Filtrer...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters },
    initialState: { pagination: { pageSize: 20 } },
  });

  return (
    <div className="admin-data-table">
      {filterColumn ? (
        <div className="admin-data-table-toolbar">
          <input
            className="form-input admin-data-table-filter"
            placeholder={filterPlaceholder}
            value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.target.value)}
          />
        </div>
      ) : null}

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="admin-data-table-pagination">
        <button
          className="button link-subtle"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Précédent
        </button>
        <span className="form-note">
          Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <button
          className="button link-subtle"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
```

## CSS à ajouter dans `globals.css`

Dans le bloc admin (`/* — Admin area — */` ou équivalent) :

```css
/* — Admin : data table — */
.admin-data-table {
  display: grid;
  gap: 1rem;
}
.admin-data-table-toolbar {
  display: flex;
  gap: 0.75rem;
}
.admin-data-table-filter {
  max-width: 24rem;
}
.admin-data-table-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.5rem;
}
```

## Pattern `columns.tsx` (template)

Chaque entité qui utilise DataTable doit avoir son fichier `columns.tsx` colocalisé :

```typescript
// features/<entity>/columns.tsx
"use client"; // requis pour les accessorKey avec callbacks onClick

import type { ColumnDef } from "@tanstack/react-table";
import type { MonEntite } from "@/db/repositories/<entite>.repository";

export const colonnesMonEntite: ColumnDef<MonEntite>[] = [
  {
    accessorKey: "champ",
    header: "Label",
  },
  // ...
];
```

Note : `"use client"` n'est requis que si les colonnes contiennent des callbacks ou des composants client. Pour des colonnes purement déclaratives, il peut être omis.

## Travail à réaliser

1. `npx shadcn@latest add table` — génère `components/ui/table.tsx`
2. `pnpm add @tanstack/react-table`
3. Écrire `components/ui/data-table.tsx` (code ci-dessus, à adapter)
4. Ajouter les classes CSS dans `globals.css`
5. **Vérifications** :
   - `pnpm run typecheck` — doit passer sans erreur sur les nouveaux fichiers
   - Aucune page ne doit être modifiée dans ce lot
   - Vérifier que `data-table.tsx` compile avec un `ColumnDef<unknown>[]` vide

## Non-inclus dans ce lot

- Migration d'aucune page existante
- Filtres métier (statut commande, etc.) — c'est V10-3/V10-4
- Tri côté serveur — tout est côté client pour V10
- Export CSV ou autres fonctionnalités avancées
