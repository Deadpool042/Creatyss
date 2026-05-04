//features/storefront/catalog/boutique-page/components/products/boutique-product-card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

import { PlaceholderImage } from "@/components/shared/placeholder-image";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";
import { FavoriteButton } from "@/features/storefront/favorites";

type BoutiqueProductCardProps = {
  product: BoutiquePageViewModel["products"][number];
  initialFavoriteProductIds: readonly string[];
};

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

function getAvailabilityToneClass(
  availabilityStatus: BoutiquePageViewModel["products"][number]["availabilityStatus"]
): string {
  if (availabilityStatus === "in-stock") {
    return "text-feedback-success-foreground";
  }

  if (availabilityStatus === "made-to-order") {
    return "text-brand";
  }

  return "text-text-muted-strong";
}

export function BoutiqueProductCard({
  product,
  initialFavoriteProductIds,
}: BoutiqueProductCardProps) {
  const availabilityLabel = getAvailabilityLabel(product.availabilityStatus);
  const availabilityToneClass = getAvailabilityToneClass(product.availabilityStatus);
  const productHref = `/boutique/${product.slug}`;

  const productKindLabel = product.variantCount > 1 ? "Variantes" : "Produit";
  const variantLabel =
    product.colorCount > 1
      ? `${product.colorCount} coloris`
      : product.variantCount > 1
        ? `${product.variantCount} variantes`
        : null;

  return (
    <article className="group ">
      <div className="relative ">
        <Link
          className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          href={productHref}
        >
          <div className="boutique-product-card-media relative aspect-square overflow-hidden rounded-2xl bg-media-surface">
            {product.isFeatured ? (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-surface-panel/85 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand shadow-sm backdrop-blur">
                Nouveau
              </span>
            ) : null}

            {product.image ? (
              <Image
                alt={product.image.alt}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.015]"
                height={500}
                loading="lazy"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 34vw, 50vw"
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

        <div className="absolute right-3 top-3 z-10">
          <FavoriteButton
            productId={product.id}
            initialFavoriteProductIds={initialFavoriteProductIds}
          />
        </div>
      </div>

      <div className="boutique-product-card-content pt-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="mb-0.5 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-text-muted-strong">
              {productKindLabel}
            </p>

            <h3 className="m-0 line-clamp-2 text-[0.8rem] font-medium leading-snug text-foreground">
              <Link
                className="rounded-sm transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/60"
                href={productHref}
              >
                {product.name}
              </Link>
            </h3>
          </div>

          {product.price ? (
            <p className="shrink-0 text-[0.8rem] font-semibold text-foreground">{product.price}</p>
          ) : null}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.7rem]">
          <span className={availabilityToneClass}>{availabilityLabel}</span>

          {variantLabel ? (
            <>
              <span className="text-text-muted-strong/50" aria-hidden="true">
                ·
              </span>
              <span className="text-text-muted-strong">{variantLabel}</span>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
