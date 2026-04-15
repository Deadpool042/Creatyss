"use client";

import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";

import { AdminDataTableEmptyState } from "@/components/admin/tables/admin-data-table-empty-state";
import { Checkbox } from "@/components/ui/checkbox";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { hasRealImage } from "@/core/media";
import { toggleProductFeaturedAction } from "@/features/admin/products/list/actions/toggle-product-featured.action";
import type { ProductTableItem } from "@/features/admin/products/list/types/product-table.types";
import { ProductStatusBadge } from "@/features/admin/products/components/shared/product-status-badge";
import { AdminProductsCategoryCell } from "./admin-products-category-cell";
import { AdminProductsPriceCell } from "./admin-products-price-cell";
import { ProductFeaturedToggle } from "./product-featured-toggle";
import { ProductStockBadge } from "./product-stock-badge";
import { ProductTableRowActions } from "./product-table-row-actions";

type ProductListView = "active" | "trash";

type ProductTableDesktopProps = {
  products: ProductTableItem[];
  selectedProductIds: string[];
  areAllCurrentPageSelected: boolean;
  onToggleProductSelection: (productId: string) => void;
  onToggleSelectAllCurrentPage: () => void;
  view: ProductListView;
  onConfirmArchive?: (slug: string) => void | Promise<void>;
  onConfirmRestore?: (slug: string) => void | Promise<void>;
  onConfirmPermanentDelete?: (slug: string) => void | Promise<void>;
};

function getVariantLabel(variantCount: number): string {
  if (variantCount <= 1) return "Simple";
  return `${variantCount} variantes`;
}

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
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-surface-border bg-card shadow-card ">
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow>
              <TableHead className="w-12">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={areAllCurrentPageSelected}
                    onCheckedChange={() => onToggleSelectAllCurrentPage()}
                    aria-label="Sélectionner les produits de la page"
                  />
                </div>
              </TableHead>
              <TableHead className="w-16" />
              <TableHead>Produit</TableHead>
              <TableHead className="w-14 text-center">★</TableHead>
              <TableHead className="w-32">Statut</TableHead>
              <TableHead className="w-36">Disponibilité</TableHead>
              <TableHead className="w-40">Prix</TableHead>
              <TableHead className="w-52">Catégorie</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="p-0">
                  <AdminDataTableEmptyState
                    message={
                      view === "trash"
                        ? "Aucun produit dans la corbeille."
                        : "Aucun produit trouvé."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);

                return (
                  <TableRow key={product.id} className="group">
                    <TableCell className="p-2.5">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => onToggleProductSelection(product.id)}
                          aria-label={`Sélectionner ${product.name}`}
                        />
                      </div>
                    </TableCell>

                    <TableCell className="p-2.5">
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-surface-border bg-surface-panel-soft">
                        {hasRealImage(product.primaryImageUrl) ? (
                          <Image
                            src={product.primaryImageUrl!}
                            alt={product.primaryImageAlt ?? product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <PlaceholderImage
                            alt={product.primaryImageAlt ?? product.name}
                            className="bg-muted"
                            imageClassName="opacity-15"
                          />
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/admin/products/${product.slug}/edit`}
                        className="group/link block"
                      >
                        <span className="font-semibold leading-snug group-hover/link:underline">
                          {product.name}
                        </span>
                        <div className="mt-1">
                          <span className="inline-flex items-center rounded-md border border-surface-border bg-surface-panel-soft px-2 py-0.5 text-[11px] text-muted-foreground">
                            {getVariantLabel(product.variantCount)}
                          </span>
                        </div>
                      </Link>
                    </TableCell>

                    <TableCell className="text-center">
                      <ProductFeaturedToggle
                        productId={product.id}
                        isFeatured={product.isFeatured}
                        onToggle={toggleProductFeaturedAction}
                      />
                    </TableCell>

                    <TableCell>
                      <ProductStatusBadge status={product.status} />
                    </TableCell>

                    <TableCell>
                      <ProductStockBadge
                        state={product.stockState}
                        quantity={product.stockQuantity}
                      />
                    </TableCell>

                    <TableCell>
                      <AdminProductsPriceCell
                        priceLabel={product.priceLabel}
                        compareAtPriceLabel={product.compareAtPriceLabel}
                        hasPromotion={product.hasPromotion}
                      />
                    </TableCell>

                    <TableCell>
                      <AdminProductsCategoryCell label={product.categoryPathLabel} />
                    </TableCell>

                    <TableCell className="p-2">
                      <ProductTableRowActions
                        slug={product.slug}
                        productName={product.name}
                        view={view}
                        {...(onConfirmArchive ? { onConfirmArchive } : {})}
                        {...(onConfirmRestore ? { onConfirmRestore } : {})}
                        {...(onConfirmPermanentDelete ? { onConfirmPermanentDelete } : {})}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
