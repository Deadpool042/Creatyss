import type { OfferVariant } from "@/features/storefront/catalog/types/product-offer-variant.types";

type ProductHeroVariantSelectorProps = {
  variableVariants: OfferVariant[] | undefined;
  selectedVariableVariant: OfferVariant | null;
  onSelectVariantId: (id: string) => void;
  density?: "default" | "compact";
};

function isValidColorHex(value: string | null): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const normalized = value.trim();
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized);
}

function getVariantSelectionLabel(variant: {
  name: string;
  optionValues: { valueLabel: string }[];
}): string {
  const optionLabel = variant.optionValues
    .map((item) => item.valueLabel)
    .join(" · ")
    .trim();

  return optionLabel.length > 0 ? optionLabel : variant.name;
}

export function ProductHeroVariantSelector({
  variableVariants,
  selectedVariableVariant,
  onSelectVariantId,
  density = "default",
}: ProductHeroVariantSelectorProps) {
  if (!variableVariants || variableVariants.length <= 1) {
    return null;
  }

  const isCompact = density === "compact";

  return (
    <section className={isCompact ? "grid gap-2" : "grid gap-3"}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-brand">Votre sélection</p>
        {selectedVariableVariant ? (
          <p className="text-xs leading-snug text-foreground-muted">
            {getVariantSelectionLabel(selectedVariableVariant)}
          </p>
        ) : null}
      </div>

      {!isCompact ? (
        <p className="max-w-2xl leading-relaxed text-foreground-muted">
          Choisissez la déclinaison qui vous convient.
        </p>
      ) : null}

      <div className={isCompact ? "flex flex-wrap gap-2" : "flex flex-wrap gap-2.5"}>
        {variableVariants.map((variant) => {
          const isSelected = variant.id === selectedVariableVariant?.id;
          const swatchHex = isValidColorHex(variant.colorHex) ? variant.colorHex : null;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelectVariantId(variant.id)}
              className={[
                isCompact
                  ? "rounded-full border px-3 py-1.5 text-xs transition-colors"
                  : "rounded-full border px-4 py-2 text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35",
                isSelected
                  ? "border-control-border-strong bg-interactive-selected text-foreground"
                  : "border-control-border bg-transparent text-foreground-muted hover:bg-interactive-hover hover:text-foreground",
              ].join(" ")}
            >
              <span className="inline-flex items-center gap-2">
                {swatchHex ? (
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full border border-control-border-strong/80"
                    style={{ backgroundColor: swatchHex }}
                  />
                ) : null}
                <span>{getVariantSelectionLabel(variant)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
