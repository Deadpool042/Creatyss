"use client";

import Image from "next/image";
import Link from "next/link";

import { FavoriteButton } from "@/features/storefront/favorites/components/favorite-button";

type FavoriteProductCardProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: string | null;
    availabilityStatus: "in-stock" | "made-to-order" | "unavailable";
    primaryImage: { filePath: string; altText: string | null } | null;
    shortDescription: string | null;
  };
  uploadsPublicPath: string;
  initialFavoriteProductIds: readonly string[];
};

function getAvailabilityLabel(
  status: "in-stock" | "made-to-order" | "unavailable"
): { label: string; className: string } {
  if (status === "in-stock") {
    return {
      label: "En stock",
      className: "text-feedback-success-foreground",
    };
  }

  if (status === "made-to-order") {
    return {
      label: "Sur commande",
      className: "text-brand",
    };
  }

  return {
    label: "Indisponible",
    className: "text-text-muted-soft",
  };
}

export function FavoriteProductCard({
  product,
  uploadsPublicPath,
  initialFavoriteProductIds,
}: FavoriteProductCardProps) {
  const availability = getAvailabilityLabel(product.availabilityStatus);
  const imageUrl =
    product.primaryImage !== null
      ? `${uploadsPublicPath}/${product.primaryImage.filePath}`
      : null;
  const imageAlt =
    product.primaryImage?.altText ?? product.name;

  return (
    <article className="group relative grid content-start gap-2 rounded-xl border border-surface-border-subtle/75 bg-surface-panel/42 p-1.5 transition-colors hover:border-control-border-strong hover:bg-control-surface-hover/72">
      <Link
        href={`/boutique/${product.slug}`}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
        aria-label={product.name}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface-panel">
          {imageUrl !== null ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-xs text-text-muted-soft">Aucune image</span>
            </div>
          )}
        </div>
      </Link>

      <FavoriteButton
        productId={product.id}
        initialFavoriteProductIds={initialFavoriteProductIds}
        className="absolute right-2 top-2 z-10"
      />

      <div className="grid gap-0.5 px-0.5 pb-0.5">
        <Link
          href={`/boutique/${product.slug}`}
          className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background rounded"
          tabIndex={-1}
          aria-hidden
        >
          {product.name}
        </Link>

        <div className="flex items-center justify-between gap-2">
          {product.price !== null && (
            <span className="text-sm font-semibold text-foreground">
              {product.price}
            </span>
          )}

          <span className={`text-xs ${availability.className}`}>
            {availability.label}
          </span>
        </div>
      </div>
    </article>
  );
}
