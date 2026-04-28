import { getProductAvailabilityLabel } from "@/entities/product/product-public-presentation";

import type { OfferVariant } from "@/features/storefront/catalog/types/product-offer-variant.types";

type ProductHeroMetaDensity = "compact" | "cozy" | "default";

type ProductHeroPricingMetaProps = {
  resolvedHeroVariant: OfferVariant;
  isSimpleProduct: boolean;
  variablePriceLabel: string | null;
  variableSummaryText: string | null;
  density?: ProductHeroMetaDensity;
  includeShippingHint?: boolean;
};

type ProductHeroAvailabilityMetaProps = {
  resolvedIsAvailable: boolean;
  density?: ProductHeroMetaDensity;
};

function getPricingGapClass(density: ProductHeroMetaDensity): string {
  if (density === "compact") {
    return "gap-1.5";
  }

  if (density === "cozy") {
    return "gap-3";
  }

  return "gap-4";
}

function getAvailabilityGapClass(density: ProductHeroMetaDensity): string {
  return density === "compact" ? "gap-2" : "gap-3";
}

export function ProductHeroPricingMeta({
  resolvedHeroVariant,
  isSimpleProduct,
  variablePriceLabel,
  variableSummaryText,
  density = "default",
  includeShippingHint = false,
}: ProductHeroPricingMetaProps) {
  const isCompact = density === "compact";

  return (
    <div className={["grid", getPricingGapClass(density)].join(" ")}>
      {resolvedHeroVariant.compareAtPrice ? (
        <div className="flex items-baseline gap-2">
          <span className="text-meta-label text-brand">Ancien prix</span>
          <span
            className={[
              "reading-compact font-medium line-through text-foreground-muted",
              isCompact ? "text-sm" : "text-secondary-copy",
            ].join(" ")}
          >
            {resolvedHeroVariant.compareAtPrice}
          </span>
        </div>
      ) : null}

      {!isSimpleProduct ? (
        <p className="text-meta-label text-brand">
          {variablePriceLabel && variablePriceLabel.trim().length > 0 ? variablePriceLabel : "Prix"}
        </p>
      ) : null}

      <p className="font-serif text-price-display text-foreground">
        {resolvedHeroVariant.price || "—"}
      </p>

      {!isSimpleProduct && variableSummaryText ? (
        <p className="text-micro-copy reading-compact text-foreground-muted">
          {variableSummaryText}
        </p>
      ) : null}

      {includeShippingHint ? (
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-control-border bg-control-surface px-2.5 py-1 text-micro-copy font-medium text-text-muted-strong">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-feedback-success" />
          <span>Livraison incluse</span>
        </div>
      ) : null}
    </div>
  );
}

export function ProductHeroAvailabilityMeta({
  resolvedIsAvailable,
  density = "default",
}: ProductHeroAvailabilityMetaProps) {
  return (
    <section className={["grid", getAvailabilityGapClass(density)].join(" ")}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-meta-label text-brand">Disponibilité</p>
        <span
          className={[
            "flex items-center gap-1.5 text-sm font-medium",
            resolvedIsAvailable
              ? "text-feedback-success-foreground"
              : "text-feedback-error-foreground",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className={[
              "h-1.5 w-1.5 rounded-full",
              resolvedIsAvailable ? "bg-feedback-success" : "bg-feedback-error",
            ].join(" ")}
          />
          {getProductAvailabilityLabel(resolvedIsAvailable)}
        </span>
      </div>
    </section>
  );
}
