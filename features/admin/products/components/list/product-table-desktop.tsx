"use client";

import type { JSX } from "react";

import { AdminDataTableEmptyState } from "@/components/admin/tables/admin-data-table-empty-state";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProductTableItem } from "@/features/admin/products/list/types/product-table.types";
import { ProductTableDesktopRow } from "./product-table-desktop-row";

type ProductListView = "active" | "trash";

type ProductTableDesktopProps = Readonly<{
  products: ProductTableItem[];
  selectedProductIds: string[];
  areAllCurrentPageSelected: boolean;
  onToggleProductSelection: (productId: string) => void;
  onToggleSelectAllCurrentPage: () => void;
  view: ProductListView;
  onConfirmArchive?: (slug: string) => void | Promise<void>;
  onConfirmRestore?: (slug: string) => void | Promise<void>;
  onConfirmPermanentDelete?: (slug: string) => void | Promise<void>;
}>;

export function ProductTableDesktop({
  products,
  selectedProductIds,
  areAllCurrentPageSelected,
  onToggleProductSelection,
  onToggleSelectAllCurrentPage,
  view,
  onConfirmArchive,
  onConfirmRestore,
  onConfirmPermanentDelete,
}: ProductTableDesktopProps): JSX.Element {
  return (
    <div className="hidden h-full min-h-0 lg:flex lg:flex-col overflow-hidden rounded-xl border border-surface-border bg-card shadow-card">
      {/* Zone de scroll interne — flex-1 + min-h-0 pour que le conteneur parent contrôle la hauteur */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <table className="w-full caption-bottom text-sm">
          <thead className="sticky top-0 z-10 bg-surface-panel-soft backdrop-blur-xl">
            <tr className="border-b border-surface-border/50">
              {/* Checkbox sélection tout */}
              <th className="h-9 px-4 text-left align-middle text-[0.62rem] font-medium tracking-[0.08em] text-muted-foreground/70 uppercase w-12">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={areAllCurrentPageSelected}
                    onCheckedChange={() => onToggleSelectAllCurrentPage()}
                    aria-label="Sélectionner les produits de la page"
                  />
                </div>
              </th>

              {/* Image */}
              <th className="h-9 px-4 text-left align-middle text-[0.62rem] font-medium tracking-[0.08em] text-muted-foreground/70 uppercase w-16" />

              {/* Produit */}
              <th className="h-9 px-4 text-left align-middle text-[0.62rem] font-medium tracking-[0.08em] text-muted-foreground/70 uppercase min-w-52">
                Produit
              </th>

              {/* Mise en avant */}
              <th className="h-9 px-4 text-center align-middle text-[0.62rem] font-medium tracking-[0.08em] text-muted-foreground/70 uppercase w-12">
                ★
              </th>

              {/* Statut */}
              <th className="h-9 px-4 text-left align-middle text-[0.62rem] font-medium tracking-[0.08em] text-muted-foreground/70 uppercase w-28">
                Statut
              </th>

              {/* Disponibilité */}
              <th className="h-9 px-4 text-left align-middle text-[0.62rem] font-medium tracking-[0.08em] text-muted-foreground/70 uppercase w-32">
                Disponibilité
              </th>

              {/* Prix — masqué à lg, visible à xl */}
              <th className="hidden xl:table-cell h-9 px-4 text-left align-middle text-[0.62rem] font-medium tracking-[0.08em] text-muted-foreground/70 uppercase w-36">
                Prix
              </th>

              {/* Catégorie — masquée à lg, visible à xl */}
              <th className="hidden xl:table-cell h-9 px-4 text-left align-middle text-[0.62rem] font-medium tracking-[0.08em] text-muted-foreground/70 uppercase w-44">
                Catégorie
              </th>

              {/* Actions */}
              <th className="h-9 px-4 text-left align-middle text-[0.62rem] font-medium tracking-[0.08em] text-muted-foreground/70 uppercase w-12" />
            </tr>
          </thead>

          <tbody className="[&_tr:last-child]:border-0">
            {products.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-0">
                  <AdminDataTableEmptyState
                    message={
                      view === "trash"
                        ? "Aucun produit dans la corbeille."
                        : "Aucun produit trouvé."
                    }
                  />
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);

                return (
                  <ProductTableDesktopRow
                    key={product.id}
                    product={product}
                    isSelected={isSelected}
                    onToggleProductSelection={onToggleProductSelection}
                    view={view}
                    {...(onConfirmArchive ? { onConfirmArchive } : {})}
                    {...(onConfirmRestore ? { onConfirmRestore } : {})}
                    {...(onConfirmPermanentDelete ? { onConfirmPermanentDelete } : {})}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
