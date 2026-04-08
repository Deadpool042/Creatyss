"use client";

import Image from "next/image";
import Link from "next/link";
import type { JSX, ReactNode } from "react";
import { Eye, MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { hasRealImage } from "@/core/media";
import { ProductStatusBadge } from "@/features/admin/products/components/shared";
import {
  AdminProductsCategoryCell,
  AdminProductsPriceCell,
  ProductFeaturedToggle,
  ProductStockBadge,
} from "@/features/admin/products/components/list";
import type { ProductTableItem } from "@/features/admin/products/list/types";
import { cn } from "@/lib/utils";
import { toggleProductFeaturedAction } from "@/features/admin/products/list/actions";

type ProductCollectionCardProps = {
  product: ProductTableItem;
  onConfirmDelete?: (slug: string) => void | Promise<void>;
};

function InfoTile({ label, children }: { label: string; children: ReactNode }): JSX.Element {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-panel-soft px-3 py-2.5">
      <p className="mb-1.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>

      <div className="min-h-12 text-sm leading-5">{children}</div>
    </div>
  );
}

export function ProductCollectionCard({
  product,
  onConfirmDelete,
}: ProductCollectionCardProps): JSX.Element {
  const primaryImageUrl = product.primaryImageUrl;
  const primaryImageAlt = product.primaryImageAlt ?? product.name;

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-surface-border bg-card p-3.5 shadow-card",
        "[@media(max-height:480px)]:p-3"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-surface-border bg-muted [@media(max-height:480px)]:h-12 [@media(max-height:480px)]:w-12">
          {primaryImageUrl && hasRealImage(primaryImageUrl) ? (
            <Image
              src={primaryImageUrl}
              alt={primaryImageAlt}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <PlaceholderImage
              alt={primaryImageAlt}
              className="bg-muted"
              imageClassName="opacity-15"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <Link href={`/admin/products/${product.slug}/edit`} className="block">
                <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-foreground [@media(max-height:480px)]:text-base">
                  {product.name}
                </h3>
              </Link>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <div className="rounded-full border border-surface-border bg-surface-panel-soft p-0.5">
                <ProductFeaturedToggle
                  productId={product.id}
                  isFeatured={product.isFeatured}
                  onToggle={toggleProductFeaturedAction}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full border border-surface-border bg-surface-panel-soft text-muted-foreground"
                    aria-label={`Actions pour ${product.name}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8} className="w-44 rounded-xl">
                  <DropdownMenuItem asChild>
                    <Link href={`/products/${product.slug}`} target="_blank" rel="noreferrer">
                      <Eye className="mr-2 h-4 w-4" />
                      Aperçu
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.slug}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={() => {
                      void onConfirmDelete?.(product.slug);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-1.5 flex min-h-0 flex-wrap items-start gap-1.5">
            <ProductStatusBadge status={product.status} />
            <ProductStockBadge state={product.stockState} quantity={product.stockQuantity} />

            <span className="inline-flex h-6 items-center rounded-full border border-surface-border bg-surface-panel-soft px-2 text-[11px] font-medium leading-none text-muted-foreground">
              {product.variantCount} variante{product.variantCount > 1 ? "s" : ""}
            </span>

            {product.isFeatured ? (
              <span className="inline-flex h-6 items-center gap-1 rounded-full border border-surface-border bg-surface-panel-soft px-2 text-[11px] font-medium leading-none text-muted-foreground">
                <Star className="h-3 w-3 fill-current" />
                Mis en avant
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-3 grid flex-1 grid-cols-2 gap-2 [@media(max-height:480px)]:mt-2.5">
        <InfoTile label="Prix">
          <AdminProductsPriceCell
            priceLabel={product.priceLabel}
            compareAtPriceLabel={product.compareAtPriceLabel}
            hasPromotion={product.hasPromotion}
          />
        </InfoTile>

        <InfoTile label="Catégorie">
          <AdminProductsCategoryCell label={product.categoryPathLabel} />
        </InfoTile>
      </div>
    </article>
  );
}
