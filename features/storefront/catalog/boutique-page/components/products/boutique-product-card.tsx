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
    <article className="boutique-product-card group">
      <div className="boutique-product-card-inner">
        <Link className="boutique-product-card-link" href={productHref}>
          <div className="boutique-product-card-media">
            {productBadge ? (
              <span className="boutique-product-card-badge" data-tone={productBadge.tone}>
                {productBadge.label}
              </span>
            ) : null}

            {product.image ? (
              <Image
                alt={product.image.alt}
                className="boutique-product-card-image"
                height={500}
                loading="lazy"
                sizes="(min-width: 1441px) 22vw, (min-width: 1024px) 28vw, (min-width: 640px) 30vw, 50vw"
                src={product.image.src}
                width={500}
              />
            ) : (
              <PlaceholderImage
                alt=""
                className="boutique-product-card-placeholder"
                imageClassName="boutique-product-card-placeholder-image"
                fit="contain"
              />
            )}
          </div>
        </Link>

        <div className="boutique-product-card-favorite">
          <FavoriteButton
            productId={product.id}
            initialFavoriteProductIds={initialFavoriteProductIds}
          />
        </div>
      </div>

      <div className="boutique-product-card-content">
        <div className="boutique-product-card-main">
          <div className="boutique-product-card-copy">
            <h3 className="boutique-product-card-title">
              <Link className="boutique-product-card-title-link" href={productHref}>
                {product.name}
              </Link>
            </h3>
          </div>

          <div className="boutique-product-card-pricing">
            {product.price ? (
              <p
                className={cn(
                  "boutique-product-card-price",
                  product.compareAtPrice && "boutique-product-card-price-has-compare-at-price"
                )}
              >
                {product.price}
              </p>
            ) : null}

            {product.compareAtPrice ? (
              <p className="boutique-product-card-price-compare">
                <del>{product.compareAtPrice}</del>
              </p>
            ) : null}
          </div>
        </div>

        <div className="boutique-product-card-meta">
          <span className="boutique-product-card-availability" data-tone={availabilityTone}>
            {availabilityLabel}
          </span>

          {variantLabel ? (
            <>
              <span className="boutique-product-card-variant">{variantLabel}</span>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
