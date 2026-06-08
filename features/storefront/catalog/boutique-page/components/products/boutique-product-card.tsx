"use client";

import Image from "next/image";
import Link from "next/link";

import { PlaceholderImage } from "@/components/shared/media";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";
import { FavoriteButton } from "@/features/storefront/favorites";
import { cn } from "@/lib/utils";

function toPlainText(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type BoutiqueProductCardProps = {
  product: BoutiquePageViewModel["products"][number];
  initialFavoriteProductIds: readonly string[];
  isFirst?: boolean;
};

type AvailabilityTone = "available" | "made-to-order" | "unavailable";
type ProductBadgeTone = "new" | "promo" | "discount";

function getAvailabilityLabel(
  availabilityStatus: BoutiquePageViewModel["products"][number]["availabilityStatus"]
): string {
  if (availabilityStatus === "in-stock") return "En stock";
  if (availabilityStatus === "made-to-order") return "Sur commande";
  return "Indisponible";
}

function getAvailabilityTone(
  availabilityStatus: BoutiquePageViewModel["products"][number]["availabilityStatus"]
): AvailabilityTone {
  if (availabilityStatus === "in-stock") return "available";
  if (availabilityStatus === "made-to-order") return "made-to-order";
  return "unavailable";
}

function getProductBadge(product: BoutiquePageViewModel["products"][number]): {
  label: string;
  tone: ProductBadgeTone;
} | null {
  if (product.discountLabel) return { label: product.discountLabel, tone: "discount" };
  if (product.promoLabel) return { label: product.promoLabel, tone: "promo" };
  if (product.isFeatured) return { label: "Sélection", tone: "new" };
  return null;
}

export function BoutiqueProductCard({
  product,
  initialFavoriteProductIds,
  isFirst = false,
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
    <article
      aria-label={product.name}
      className="group/card min-w-0 grid grid-rows-[auto_1fr] rounded-xl border border-surface-border-subtle bg-surface-panel shadow-card transition-all hover:-translate-y-px hover:border-surface-border hover:shadow-raised"
    >
      {/* Zone image — overflow-hidden ici, pas sur l'article, pour ne pas clipper les rings */}
      <div className="relative">
        <Link
          className="block outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring rounded-t-xl"
          href={productHref}
          tabIndex={0}
        >
          <div className="relative aspect-3/4 overflow-hidden rounded-t-xl bg-media-surface">
            {product.image ? (
              <Image
                alt={product.image.alt}
                className="absolute inset-0 size-full object-cover transition-transform duration-300 ease-out group-hover/card:scale-[1.03]"
                height={500}
                loading={isFirst ? "eager" : "lazy"}
                sizes="(min-width: 90rem) 15vw, (min-width: 64rem) 20vw, (min-width: 48rem) 25vw, (min-width: 40rem) 32vw, 48vw"
                src={product.image.src}
                width={500}
              />
            ) : (
              <PlaceholderImage
                alt=""
                className="bg-media-surface"
                imageClassName="opacity-10"
                fit="cover"
              />
            )}
          </div>
        </Link>

        {/* Badge — hors du <Link> pour éviter la concaténation avec l'alt par les AT */}
        {productBadge ? (
          <span
            className={cn(
              "pointer-events-none absolute top-2 left-2 z-10 inline-flex min-h-5 items-center rounded-full px-2 text-[0.625rem] font-semibold leading-none tracking-[0.08em] uppercase backdrop-blur-sm",
              productBadge.tone === "new" && "bg-brand text-brand-foreground",
              productBadge.tone === "promo" &&
                "border border-feedback-warning-border bg-feedback-warning-surface text-feedback-warning-foreground",
              productBadge.tone === "discount" &&
                "border border-feedback-success-border bg-feedback-success-surface text-feedback-success-foreground"
            )}
          >
            {productBadge.label}
          </span>
        ) : null}

        {/* Favori */}
        <div className="absolute top-2 right-2 z-10 inline-flex items-center justify-center rounded-full bg-surface-floating/70 backdrop-blur-[10px]">
          <FavoriteButton
            productId={product.id}
            initialFavoriteProductIds={initialFavoriteProductIds}
          />
        </div>
      </div>

      {/* Infos produit */}
      <div className="grid gap-2.5 border-t border-surface-border-subtle px-3 pt-3 pb-3.5">
        <div className="grid gap-1">
          <h3 className="m-0 text-sm font-semibold leading-snug text-foreground">
            <Link
              className="rounded-sm outline-none transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
              href={productHref}
            >
              {product.name}
            </Link>
          </h3>

          {product.summary !== null ? (
            <p className="m-0 line-clamp-2 text-xs leading-relaxed text-text-muted-strong">
              {toPlainText(product.summary)}
            </p>
          ) : null}
        </div>

        <div className="flex min-w-0 items-baseline gap-2">
          {product.price ? (
            <span
              className={cn(
                "text-sm font-bold leading-tight",
                product.compareAtPrice ? "text-feedback-success" : "text-foreground"
              )}
            >
              {product.price}
            </span>
          ) : null}

          {product.compareAtPrice ? (
            <span className="text-xs text-text-muted-strong">
              <del>
                <span className="sr-only">Ancien prix : </span>
                {product.compareAtPrice}
              </del>
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-muted-strong">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cn(
                "size-2 shrink-0 rounded-full",
                availabilityTone === "available" && "bg-feedback-success",
                availabilityTone === "made-to-order" && "bg-brand",
                availabilityTone === "unavailable" && "bg-feedback-error"
              )}
            />
            {availabilityLabel}
          </span>
          {variantLabel ? <span>{variantLabel}</span> : null}
        </div>
      </div>
    </article>
  );
}
