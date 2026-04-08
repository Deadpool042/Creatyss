"use client";

import Image from "next/image";
import Link from "next/link";
import type { JSX, ReactNode } from "react";
import { Eye, MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  ProductStockBadge,
} from "@/features/admin/products/components/list";
import { toggleProductFeaturedAction } from "@/features/admin/products/list/actions/toggle-product-featured.action";
import type { ProductTableItem } from "@/features/admin/products/list/types";
import { stripHtml } from "@/features/admin/products/list/utils";
import { ProductFeaturedToggle } from "./product-featured-toggle";

type ProductMobileCardProps = {
  product: ProductTableItem;
  onConfirmDelete?: (slug: string) => void | Promise<void>;
};

function InfoTile({ label, children }: { label: string; children: ReactNode }): JSX.Element {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-panel-soft px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <div className="mt-1.5 min-h-8 text-sm">{children}</div>
    </div>
  );
}

export function ProductMobileCard({
  product,
  onConfirmDelete,
}: ProductMobileCardProps): JSX.Element {
  const shortDescription = product.shortDescription ? stripHtml(product.shortDescription) : null;
  const primaryImageUrl = product.primaryImageUrl;
  const primaryImageAlt = product.primaryImageAlt ?? product.name;

  return (
    <Card className="overflow-hidden rounded-2xl border border-surface-border bg-card shadow-card">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link href={`/admin/products/${product.slug}/edit`} className="block">
              <h2 className="line-clamp-2 text-2xl font-semibold leading-tight tracking-tight text-foreground">
                {product.name}
              </h2>
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
                  className="h-8 w-8 rounded-full border border-surface-border bg-surface-panel-soft text-muted-foreground"
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

        <div className="flex items-start gap-3">
          <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-lg border border-surface-border bg-muted">
            {primaryImageUrl && hasRealImage(primaryImageUrl) ? (
              <Image
                src={primaryImageUrl}
                alt={primaryImageAlt}
                fill
                sizes="72px"
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

          <div className="min-w-0 flex-1 pt-0.5">
            {shortDescription ? (
              <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                {shortDescription}
              </p>
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">-</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ProductStatusBadge status={product.status} />
          <ProductStockBadge state={product.stockState} quantity={product.stockQuantity} />

          <span className="inline-flex h-6 items-center rounded-full border border-surface-border bg-surface-panel-soft px-2.5 text-xs font-medium leading-none text-muted-foreground">
            {product.variantCount} variante{product.variantCount > 1 ? "s" : ""}
          </span>

          {product.isFeatured ? (
            <span className="inline-flex h-6 items-center gap-1 rounded-full border border-surface-border bg-surface-panel-soft px-2.5 text-xs font-medium leading-none text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-current text-primary" />
              Mis en avant
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-2">
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
      </CardContent>
    </Card>
  );
}
