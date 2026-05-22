"use client";

import type { JSX } from "react";

import { Star } from "lucide-react";

import {
  AdminDataTableEmptyState,
  AdminTable,
  AdminTableBody,
  AdminTableHead,
  AdminTableHeader,
} from "@/components/admin/tables";
import { Checkbox } from "@/components/ui/checkbox";
import { PRODUCT_SELECTION_COPY, PRODUCT_TABLE_COPY } from "@/features/admin/products/config";
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

const TH_BASE = "h-9 px-4 text-left align-middle text-[0.62rem] font-medium tracking-[0.08em] text-muted-foreground/70 uppercase";

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
    <AdminTable wrapperClassName="hidden lg:flex">
      <AdminTableHeader className="backdrop-blur-xl">
        <tr className="border-b border-surface-border/50">
          {/* Checkbox sélection tout */}
          <AdminTableHead className={`${TH_BASE} w-12`}>
            <div className="flex items-center justify-center">
              <Checkbox
                checked={areAllCurrentPageSelected}
                onCheckedChange={() => onToggleSelectAllCurrentPage()}
                aria-label={PRODUCT_SELECTION_COPY.selectPageAriaLabel}
              />
            </div>
          </AdminTableHead>

          {/* Image */}
          <AdminTableHead className={`${TH_BASE} w-16`} />

          {/* Produit */}
          <AdminTableHead className={`${TH_BASE} min-w-52`}>
            {PRODUCT_TABLE_COPY.columns.product}
          </AdminTableHead>

          {/* Mise en avant */}
          <AdminTableHead
            className={`${TH_BASE} w-12 text-center`}
            aria-label={PRODUCT_TABLE_COPY.columns.featuredAria}
          >
            <Star className="mx-auto h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          </AdminTableHead>

          {/* Statut */}
          <AdminTableHead className={`${TH_BASE} w-28`}>
            {PRODUCT_TABLE_COPY.columns.status}
          </AdminTableHead>

          {/* Disponibilité */}
          <AdminTableHead className={`${TH_BASE} w-32`}>
            {PRODUCT_TABLE_COPY.columns.stock}
          </AdminTableHead>

          {/* Prix — masqué à lg, visible à xl */}
          <AdminTableHead className={`hidden xl:table-cell ${TH_BASE} w-36`}>
            {PRODUCT_TABLE_COPY.columns.price}
          </AdminTableHead>

          {/* Catégorie — masquée à lg, visible à xl */}
          <AdminTableHead className={`hidden xl:table-cell ${TH_BASE} w-44`}>
            {PRODUCT_TABLE_COPY.columns.category}
          </AdminTableHead>

          {/* Actions */}
          <AdminTableHead className={`${TH_BASE} w-12`} />
        </tr>
      </AdminTableHeader>

      <AdminTableBody className="[&_tr:last-child]:border-0">
        {products.length === 0 ? (
          <tr>
            <td colSpan={9} className="p-0">
              <AdminDataTableEmptyState
                message={
                  view === "trash"
                    ? PRODUCT_TABLE_COPY.emptyTrash
                    : PRODUCT_TABLE_COPY.emptyFiltered
                }
              />
            </td>
          </tr>
        ) : (
          products.map((product) => (
            <ProductTableDesktopRow
              key={product.id}
              product={product}
              isSelected={selectedProductIds.includes(product.id)}
              onToggleProductSelection={onToggleProductSelection}
              view={view}
              {...(onConfirmArchive ? { onConfirmArchive } : {})}
              {...(onConfirmRestore ? { onConfirmRestore } : {})}
              {...(onConfirmPermanentDelete ? { onConfirmPermanentDelete } : {})}
            />
          ))
        )}
      </AdminTableBody>
    </AdminTable>
  );
}
