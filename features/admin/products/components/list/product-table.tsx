"use client";

import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { useProductTableFilters } from "@/features/admin/products/list/hooks/use-product-table-filters";
import type {
  ProductFilterCategoryOption,
  ProductTableItem,
} from "@/features/admin/products/list/types/product-table.types";
import { ProductTableDesktop } from "./product-table-desktop";
import { ProductTableMobile } from "./product-table-mobile";
import { ProductTableToolbar } from "./product-table-toolbar";

type ProductTableProps = {
  products: ProductTableItem[];
  categoryOptions: ProductFilterCategoryOption[];
};

export function ProductTable({ products, categoryOptions }: ProductTableProps): JSX.Element {
  const state = useProductTableFilters({ products, categoryOptions });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 md:gap-4 lg:gap-5 [@media(max-height:480px)]:gap-2.5">
      <ProductTableToolbar categoryOptions={categoryOptions} state={state} />

      <div className="hidden min-h-0 flex-1 flex-col gap-3 md:flex">
        <div className="min-h-0 flex-1">
          <ProductTableDesktop products={state.paginated} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-surface-border bg-card px-4 py-3 shadow-card">
          <p className="text-sm text-muted-foreground">
            Page {state.currentPage} sur {state.totalPages}
            {state.totalPages > 1 ? (
              <span className="ml-2 opacity-60">
                · {state.filteredCount} produit{state.filteredCount !== 1 ? "s" : ""}
              </span>
            ) : null}
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={state.goPrevious}
              disabled={state.currentPage <= 1}
            >
              Précédent
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={state.goNext}
              disabled={state.currentPage >= state.totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>

      <div className="min-h-0 md:hidden">
        <ProductTableMobile products={state.allFilteredProducts} />
      </div>
    </div>
  );
}
