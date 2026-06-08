import type { OfferVariant } from "@/features/storefront/catalog/types/product-offer-variant.types";

type ProductHeroMetaDensity = "compact" | "cozy" | "default";

function computeDiscountLabel(price: string | null, compareAtPrice: string | null): string | null {
  if (price === null || compareAtPrice === null) return null;
  const priceVal = parseFloat(price);
  const compareVal = parseFloat(compareAtPrice);
  if (!Number.isFinite(priceVal) || !Number.isFinite(compareVal) || compareVal <= 0) return null;
  const pct = Math.round(((compareVal - priceVal) / compareVal) * 100);
  return pct > 0 ? `−${pct}%` : null;
}

type ProductHeroPricingMetaProps = {
  resolvedHeroVariant: OfferVariant;
  isSimpleProduct: boolean;
  variablePriceLabel: string | null;
  variableSummaryText: string | null;
  density?: ProductHeroMetaDensity;
  includeShippingHint?: boolean;
};

type ProductHeroAvailabilityMetaProps = {
  resolvedAvailabilityStatus: "in-stock" | "made-to-order" | "unavailable";
  resolvedIsAvailable: boolean;
  density?: ProductHeroMetaDensity;
};

function getStorefrontAvailabilityLabel(
  availabilityStatus: "in-stock" | "made-to-order" | "unavailable"
): string {
  if (availabilityStatus === "in-stock") {
    return "En stock";
  }

  if (availabilityStatus === "made-to-order") {
    return "Sur commande";
  }

  return "Indisponible";
}

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
  const discountLabel = computeDiscountLabel(
    resolvedHeroVariant.price,
    resolvedHeroVariant.compareAtPrice
  );

  return (
    <div className={["grid", getPricingGapClass(density)].join(" ")}>
      {resolvedHeroVariant.compareAtPrice ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest leading-snug text-brand">Ancien prix</span>
          <span
            className={[
              "leading-snug font-medium line-through text-foreground-muted",
              isCompact ? "text-sm" : "text-sm",
            ].join(" ")}
          >
            {resolvedHeroVariant.compareAtPrice}
          </span>
          {discountLabel ? (
            <span className="inline-flex items-center rounded-full border border-feedback-success-border bg-feedback-success-surface px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-widest leading-none text-feedback-success-foreground">
              {discountLabel}
            </span>
          ) : null}
        </div>
      ) : null}

      {!isSimpleProduct ? (
        <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-brand">
          {variablePriceLabel && variablePriceLabel.trim().length > 0 ? variablePriceLabel : "Prix"}
        </p>
      ) : null}

      <p className="font-serif text-3xl md:text-4xl font-bold leading-none tracking-tight tabular-nums text-foreground">
        {resolvedHeroVariant.price || "—"}
      </p>

      {!isSimpleProduct && variableSummaryText ? (
        <p className="text-xs leading-snug text-foreground-muted">
          {variableSummaryText}
        </p>
      ) : null}

      {includeShippingHint ? (
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-control-border bg-control-surface px-2.5 py-1 text-xs leading-snug font-medium text-text-muted-strong">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-feedback-success" />
          <span>Livraison incluse</span>
        </div>
      ) : null}
    </div>
  );
}

export function ProductHeroAvailabilityMeta({
  resolvedAvailabilityStatus,
  resolvedIsAvailable,
  density = "default",
}: ProductHeroAvailabilityMetaProps) {
  const isMadeToOrder = resolvedAvailabilityStatus === "made-to-order";
  const availabilityTextClass = !resolvedIsAvailable
    ? "text-feedback-error-foreground"
    : isMadeToOrder
      ? "text-brand"
      : "text-feedback-success-foreground";

  return (
    <section className={["grid", getAvailabilityGapClass(density)].join(" ")}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-brand">Disponibilité</p>
        <span
          className={[
            "flex items-center gap-1.5 text-sm font-medium",
            availabilityTextClass,
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className={[
              "h-1.5 w-1.5 rounded-full",
              resolvedIsAvailable
                ? isMadeToOrder
                  ? "bg-brand"
                  : "bg-feedback-success"
                : "bg-feedback-error",
            ].join(" ")}
          />
          {getStorefrontAvailabilityLabel(resolvedAvailabilityStatus)}
        </span>
      </div>
      {isMadeToOrder ? (
        <p className="text-xs leading-snug text-foreground-muted">
          Création ou préparation sur demande
        </p>
      ) : null}
    </section>
  );
}
