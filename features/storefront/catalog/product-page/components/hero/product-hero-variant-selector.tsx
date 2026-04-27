import type { OfferVariant } from "@/features/storefront/catalog/types/product-offer-variant.types";

type ProductHeroVariantSelectorProps = {
  variableVariants: OfferVariant[] | undefined;
  selectedVariableVariant: OfferVariant | null;
  onSelectVariantId: (id: string) => void;
};

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
}: ProductHeroVariantSelectorProps) {
  if (!variableVariants || variableVariants.length <= 1) {
    return null;
  }

  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-meta-label text-brand">Choix principal</p>
        {selectedVariableVariant ? (
          <p className="text-micro-copy reading-compact text-foreground-muted">
            {getVariantSelectionLabel(selectedVariableVariant)}
          </p>
        ) : null}
      </div>

      <p className="max-w-2xl text-secondary-copy reading-relaxed text-foreground-muted">
        Définissez ici la déclinaison à privilégier.
      </p>

      <div className="flex flex-wrap gap-2.5">
        {variableVariants.map((variant) => {
          const isSelected = variant.id === selectedVariableVariant?.id;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelectVariantId(variant.id)}
              className={[
                "rounded-full border px-4 py-2 text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35",
                isSelected
                  ? "border-control-border-strong bg-interactive-selected text-foreground"
                  : "border-control-border bg-transparent text-foreground-muted hover:bg-interactive-hover hover:text-foreground",
              ].join(" ")}
            >
              {getVariantSelectionLabel(variant)}
            </button>
          );
        })}
      </div>
    </section>
  );
}
