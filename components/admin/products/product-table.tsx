"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductStatusBadge, type ProductStatus } from "./product-status-badge";
import { ProductTableRowActions } from "./product-table-row-actions";
import type { ProductListItemData } from "./product-list-item";

const PAGE_SIZE = 20;

type StatusFilter = "all" | ProductStatus;

type ProductTableProps = {
  products: ProductListItemData[];
};

export function ProductTable({ products }: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.shortDescription?.toLowerCase().includes(q) ?? false);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = search !== "" || statusFilter !== "all";

  function reset() {
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setStatusFilter(value as StatusFilter);
    setPage(1);
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Toolbar — shrink-0 : reste visible lors du scroll */}
      <div className="flex shrink-0 items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-40 text-sm">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="published">Publié</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground">
            <X className="mr-1.5 h-3.5 w-3.5" />
            Réinitialiser
          </Button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table — flex-1 min-h-0 : absorbe l'espace restant sans déborder */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
        <div className="overflow-y-auto">
          <Table>
            {/* sticky top-0 : le thead reste visible pendant le scroll du tbody */}
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead className="w-12" />
                <TableHead>Produit</TableHead>
                <TableHead className="w-32">Statut</TableHead>
                <TableHead className="w-28">Prix</TableHead>
                <TableHead className="w-36">Catégorie</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    Aucun produit trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="p-2">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border bg-muted">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">–</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/products/${product.slug}/edit`}
                        className="group block"
                      >
                        <span className="font-medium group-hover:underline">{product.name}</span>
                        {product.shortDescription && (
                          <span className="block max-w-sm truncate text-xs text-muted-foreground">
                            {product.shortDescription}
                          </span>
                        )}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <ProductStatusBadge status={product.status} />
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {product.price ?? (
                        <span className="text-muted-foreground">–</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {product.category ?? "–"}
                    </TableCell>
                    <TableCell className="p-2">
                      <ProductTableRowActions slug={product.slug} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination — shrink-0 : reste visible en bas, pas de scroll nécessaire */}
      {totalPages > 1 && (
        <div className="flex shrink-0 items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {currentPage} sur {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
