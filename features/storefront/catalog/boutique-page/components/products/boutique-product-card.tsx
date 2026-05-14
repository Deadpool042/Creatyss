"use client";

import Image from "next/image";
import Link from "next/link";

import { PlaceholderImage } from "@/components/shared/placeholder-image";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";
import { FavoriteButton } from "@/features/storefront/favorites";
import { cn } from "@/lib/utils";

type BoutiqueProductCardProps = {
  product: BoutiquePageViewModel["products"][number];
  initialFavoriteProductIds: readonly string[];
};

type AvailabilityTone = "available" | "made-to-order" | "unavailable";
type ProductBadgeTone = "new" | "promo" | "discount";

function getAvailabilityLabel(
  availabilityStatus: BoutiquePageViewModel["products"][number]["availabilityStatus"]
): string {
  if (availabilityStatus === "in-stock") {
    return "En stock";
  }

  if (availabilityStatus === "made-to-order") {
    return "Sur commande";
  }

  return "Indisponible";
}

function getAvailabilityTone(
  availabilityStatus: BoutiquePageViewModel["products"][number]["availabilityStatus"]
): AvailabilityTone {
  if (availabilityStatus === "in-stock") {
    return "available";
  }

  if (availabilityStatus === "made-to-order") {
    return "made-to-order";
  }

  return "unavailable";
}

function getProductBadge(product: BoutiquePageViewModel["products"][number]): {
  label: string;
  tone: ProductBadgeTone;
} | null {
  if (product.discountLabel) {
    return {
      label: product.discountLabel,
      tone: "discount",
    };
  }

  if (product.promoLabel) {
    return {
      label: product.promoLabel,
      tone: "promo",
    };
  }

  if (product.isFeatured) {
    return {
      label: "Nouveau",
      tone: "new",
    };
  }

  return null;
}

export function BoutiqueProductCard({
  product,
  initialFavoriteProductIds,
}: BoutiqueProductCardProps) {
  const availabilityLabel = getAvailabilityLabel(product.availabilityStatus);
  const availabilityTone = getAvailabilityTone(product.availabilityStatus);
  const productHref = `/boutique/${product.slug}`;
  const productBadge = getProductBadge(product);

  const variantLabel =
    product.colorCount > 1
      ? `${product.colorCount} coloris`
      : product.variantCount > 1
        ? `${product.variantCount} variantes`
        : null;

  return (
    <article className="group/card min-w-0 grid grid-rows-[auto_1fr] overflow-hidden rounded-[var(--radius-xl)] border border-surface-border-subtle bg-surface-panel shadow-card transition-all hover:border-brand/42 hover:-translate-y-px hover:shadow-raised">
      <div className="relative grid min-w-0">
        <Link className="block rounded-[inherit] outline-none focus-visible:ring-[2px] focus-visible:ring-inset focus-visible:ring-focus-ring/72" href={productHref}>
          <div className="relative aspect-square overflow-hidden bg-media-surface border-b border-brand/26">
            {productBadge ? (
              <span
                className={cn(
                  "absolute top-[0.55rem] left-[0.55rem] z-10 inline-flex min-h-5 items-center rounded-full px-[0.52rem] text-[0.64rem] font-bold leading-none tracking-[0.1em] uppercase backdrop-blur-[8px]",
                  productBadge.tone === "new" && "bg-brand/[0.12] text-brand",
                  productBadge.tone === "promo" && "bg-feedback-warning-foreground/[0.12] text-feedback-warning-foreground",
                  productBadge.tone === "discount" && "bg-feedback-success-foreground/[0.12] text-feedback-success-foreground"
                )}
              >
                {productBadge.label}
              </span>
            ) : null}

            {product.image ? (
              <Image
                alt={product.image.alt}
                className="absolute inset-0 size-full object-cover transition-transform group-hover/card:scale-[1.014]"
                height={500}
                loading="lazy"
                sizes="(min-width: 1441px) 22vw, (min-width: 1024px) 28vw, (min-width: 640px) 30vw, 50vw"
                src={product.image.src}
                width={500}
              />
            ) : (
              <PlaceholderImage
                alt=""
                className="bg-media-surface"
                imageClassName="opacity-20"
                fit="contain"
              />
            )}
          </div>
        </Link>

        <div className="absolute top-[0.9rem] right-[0.9rem] z-10 inline-flex items-center justify-center rounded-full bg-surface-floating/70 backdrop-blur-[10px]">
          <FavoriteButton
            productId={product.id}
            initialFavoriteProductIds={initialFavoriteProductIds}
          />
        </div>
      </div>

      <div className="grid gap-[0.4rem] border-t border-brand/20 bg-surface-panel px-[0.72rem] pt-[0.72rem] pb-[0.78rem] min-[48rem]:max-[63.99rem]:gap-[0.35rem] min-[48rem]:max-[63.99rem]:px-[0.6rem] min-[48rem]:max-[63.99rem]:pt-[0.55rem] min-[48rem]:max-[63.99rem]:pb-[0.65rem] max-[47.99rem]:px-[0.62rem] max-[47.99rem]:pt-[0.62rem] max-[47.99rem]:pb-[0.7rem]">
        <div className="flex min-w-0 flex-col items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="m-0 text-sm font-semibold leading-tight text-foreground">
              <Link className="inline rounded-sm text-inherit no-underline outline-none transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/50" href={productHref}>
                {product.name}
              </Link>
            </h3>
          </div>

          <div className="flex min-w-max items-end justify-end gap-4">
            {product.price ? (
              <p
                className={cn(
                  "m-0 shrink-0 text-right text-[0.91rem] font-bold leading-tight text-brand",
                  product.compareAtPrice && "text-feedback-success"
                )}
              >
                {product.price}
              </p>
            ) : null}

            {product.compareAtPrice ? (
              <p className="m-0 text-[0.74rem] font-medium leading-[1.2] text-[var(--text-muted)]">
                <del>{product.compareAtPrice}</del>
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[0.76rem] leading-[1.35] text-text-muted-strong">
          <span className="inline-flex items-center gap-[0.35rem] text-text-muted-strong">
            <span
              aria-hidden="true"
              className={cn(
                "size-[0.58rem] shrink-0 rounded-full bg-text-muted-strong/72",
                availabilityTone === "available" && "bg-feedback-success",
                availabilityTone === "made-to-order" && "bg-brand",
                availabilityTone === "unavailable" && "bg-feedback-error"
              )}
            />
            {availabilityLabel}
          </span>

          {variantLabel ? (
            <>
              <span className="text-text-muted-strong">{variantLabel}</span>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
