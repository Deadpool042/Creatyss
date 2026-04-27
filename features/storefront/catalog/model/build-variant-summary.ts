type VariantAvailabilityCarrier = {
  isAvailable: boolean;
};

export function buildVariantSummary<T extends VariantAvailabilityCarrier>(input: {
  productType: "simple" | "variable";
  variants: T[];
}): { total: number; available: number } | null {
  const { productType, variants } = input;

  if (productType === "simple") {
    return null;
  }

  return {
    total: variants.length,
    available: variants.filter((variant) => variant.isAvailable).length,
  };
}
