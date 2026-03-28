import Link from "next/link";

import { ProductsShell } from "@/features/admin/products/components/shared/products-shell";
import { ProductsToolbar } from "@/features/admin/products/components/shared/products-toolbar";
import {
  type ProductsPageParams,
  buildProductDetailsHref,
  buildProductEditorHref,
} from "@/features/admin/products/navigation";
import type { AdminProductListItem } from "@/features/admin/products/list";
import type { JSX } from "react";

type ProductsListPanelProps = {
  params: ProductsPageParams;
  products: AdminProductListItem[];
  selectedSlug?: string | null;
};

function formatStatus(status: AdminProductListItem["status"]): string {
  switch (status) {
    case "published":
      return "Publié";
    case "archived":
      return "Archivé";
    default:
      return "Brouillon";
  }
}

function getStatusBadgeClass(status: AdminProductListItem["status"]): string {
  switch (status) {
    case "published":
      return "border-green-500/30 bg-green-500/10 text-green-200";
    case "archived":
      return "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";
    default:
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  }
}

function formatProductType(type: AdminProductListItem["productType"]): string {
  return type === "variable" ? "Variable" : "Simple";
}

function formatPrice(product: AdminProductListItem): string {
  if (!product.amount) {
    return "Prix à définir";
  }

  return product.amount.includes("€") ? product.amount : `${product.amount} €`;
}

function getDiagnosticsLabel(product: AdminProductListItem): string | null {
  if (product.diagnostics.missingPrimaryImage && product.diagnostics.missingPrice) {
    return "Image et prix à compléter";
  }

  if (product.diagnostics.missingPrimaryImage) {
    return "Image à compléter";
  }

  if (product.diagnostics.missingPrice) {
    return "Prix à compléter";
  }

  return null;
}

function ProductListThumbnail({ product }: { product: AdminProductListItem }): JSX.Element {
  if (product.primaryImageUrl) {
    return (
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-muted/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.primaryImageUrl}
          alt={product.primaryImageAlt ?? product.name}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border bg-muted/20 text-[10px] uppercase tracking-wide text-muted-foreground">
      Sans image
    </div>
  );
}

export function ProductsListPanel({
  params,
  products,
  selectedSlug = null,
}: ProductsListPanelProps): JSX.Element {
  return (
    <ProductsShell toolbar={<ProductsToolbar params={params} />}>
      <div className="divide-y">
        {products.length === 0 ? (
          <div className="space-y-2 p-6">
            <p className="text-sm font-medium">Aucun produit trouvé</p>
            <p className="text-sm text-muted-foreground">
              Ajuste la recherche ou les filtres pour élargir les résultats.
            </p>
          </div>
        ) : (
          products.map((product) => {
            const isSelected = selectedSlug === product.slug;
            const diagnosticsLabel = getDiagnosticsLabel(product);

            return (
              <div
                key={product.id}
                className={
                  isSelected
                    ? "border-l-2 border-l-primary bg-muted/40"
                    : "border-l-2 border-l-transparent"
                }
              >
                <div className="flex items-start gap-4 p-4">
                  <ProductListThumbnail product={product} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={buildProductDetailsHref(params, product.slug)}
                            className="truncate text-sm font-semibold hover:underline"
                          >
                            {product.name}
                          </Link>

                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${getStatusBadgeClass(
                              product.status
                            )}`}
                          >
                            {formatStatus(product.status)}
                          </span>

                          <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                            {formatProductType(product.productType)}
                          </span>

                          {product.isFeatured ? (
                            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-primary">
                              Vedette
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {product.shortDescription ?? "Sans description courte"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium">{formatPrice(product)}</p>
                        {product.compareAtAmount ? (
                          <p className="text-xs text-muted-foreground line-through">
                            {product.compareAtAmount} €
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        {product.variantCount} variante{product.variantCount > 1 ? "s" : ""}
                      </span>
                      {product.primaryCategory ? <span>{product.primaryCategory.name}</span> : null}
                      {diagnosticsLabel ? (
                        <span className="text-amber-300">{diagnosticsLabel}</span>
                      ) : (
                        <span className="text-green-300">Complet</span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Link
                        href={buildProductDetailsHref(params, product.slug)}
                        className={
                          isSelected
                            ? "rounded-md border bg-muted px-3 py-1.5 text-xs font-medium"
                            : "rounded-md border px-3 py-1.5 text-xs font-medium"
                        }
                      >
                        Voir
                      </Link>

                      <Link
                        href={buildProductEditorHref(params, product.slug)}
                        className="rounded-md border px-3 py-1.5 text-xs font-medium"
                      >
                        Éditer
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </ProductsShell>
  );
}
