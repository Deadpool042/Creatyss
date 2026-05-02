"use client";

import Image from "next/image";
import Link from "next/link";

import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueProductCardProps = {
  product: BoutiquePageViewModel["products"][number];
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

export function BoutiqueProductCard({ product }: BoutiqueProductCardProps) {
  const availabilityLabel = getAvailabilityLabel(product.availabilityStatus);
  const availabilityToneClass = getAvailabilityToneClass(product.availabilityStatus);

  return (
    <article className="group grid grid-rows-[auto_1fr] overflow-hidden rounded-xl border border-surface-border-subtle/70 bg-surface-panel/44 transition-all duration-300 hover:border-control-border hover:bg-surface-panel/58 sm:max-[899px]:landscape:rounded-lg desktop:rounded-xl">
      <Link className="block" href={`/boutique/${product.slug}`} tabIndex={-1}>
        {product.image ? (
          <figure className="relative aspect-10/9 overflow-hidden bg-media-surface sm:max-[899px]:landscape:aspect-video min-[900px]:max-[1199px]:landscape:aspect-16/10 desktop:aspect-square">
            {product.isFeatured ? (
              <span className="absolute left-2 top-2 z-10 rounded-full border border-control-border-strong bg-surface-panel/82 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand backdrop-blur-sm sm:max-[899px]:landscape:left-1.5 sm:max-[899px]:landscape:top-1.5 sm:max-[899px]:landscape:px-1.5 sm:max-[899px]:landscape:text-[9px] min-[900px]:max-[1199px]:landscape:text-[9px] desktop:left-2.5 desktop:top-2.5 desktop:px-2.5 desktop:text-[9px]">
                Nouveau
              </span>
            ) : null}
            <Image
              alt={product.image.alt}
              className="absolute inset-0 block h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              src={product.image.src}
              width={500}
              height={500}
            />
          </figure>
        ) : (
          <div className="flex aspect-10/9 items-center justify-center bg-media-surface/80 text-media-foreground sm:max-[899px]:landscape:aspect-video min-[900px]:max-[1199px]:landscape:aspect-16/10 desktop:aspect-square">
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted-strong/80 sm:max-[899px]:landscape:text-[10px]">
              {product.name}
            </span>
          </div>
        )}
      </Link>

      <div className="grid gap-1 p-2.5 min-[700px]:gap-1.5 min-[700px]:p-3 sm:max-[899px]:landscape:gap-0.5 sm:max-[899px]:landscape:p-1.5 min-[900px]:max-[1199px]:landscape:gap-1 min-[900px]:max-[1199px]:landscape:p-2.5 desktop:gap-1 desktop:p-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted-strong sm:max-[899px]:landscape:text-[8px] min-[900px]:max-[1199px]:landscape:text-[9px] desktop:text-[9px] desktop:tracking-[0.06em]">
          {product.variantCount > 1 ? "Variantes" : "Produit"}
        </span>

        <h3 className="m-0 line-clamp-2 text-sm font-medium leading-snug min-[700px]:text-[0.92rem] sm:max-[899px]:landscape:line-clamp-1 sm:max-[899px]:landscape:text-[0.76rem] sm:max-[899px]:landscape:leading-tight min-[900px]:max-[1199px]:landscape:text-[0.84rem] desktop:text-[0.88rem]">
          <Link
            className="transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/60"
            href={`/boutique/${product.slug}`}
          >
            {product.name}
          </Link>
        </h3>

        {product.price ? (
          <p className="m-0 text-sm font-semibold text-foreground sm:max-[899px]:landscape:text-[0.75rem] sm:max-[899px]:landscape:leading-tight min-[900px]:max-[1199px]:landscape:text-[0.8rem] desktop:text-[0.84rem]">
            {product.price}
          </p>
        ) : null}

        <div className="grid gap-0.5">
          <span
            className={`text-xs sm:max-[899px]:landscape:text-[9px] sm:max-[899px]:landscape:leading-tight min-[900px]:max-[1199px]:landscape:text-[11px] desktop:text-[11px] ${availabilityToneClass}`}
          >
            {availabilityLabel}
          </span>

          {product.variantCount > 1 || product.colorCount > 1 ? (
            <span className="text-[11px] text-text-muted-strong sm:max-[899px]:landscape:text-[8px] sm:max-[899px]:landscape:leading-tight min-[900px]:max-[1199px]:landscape:text-[9px] desktop:text-[10px]">
              {product.colorCount > 1
                ? `${product.colorCount} coloris`
                : `${product.variantCount} variantes`}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
