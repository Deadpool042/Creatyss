type ReferenceVariant = {
  isDefault: boolean;
};

export function resolveReferenceVariant<T extends ReferenceVariant>(input: {
  productType: "simple" | "variable";
  variants: T[];
}): T | null {
  const { productType, variants } = input;

  if (variants.length === 0) {
    return null;
  }

  if (productType === "simple") {
    return variants[0] ?? null;
  }

  return variants.find((variant) => variant.isDefault) ?? variants[0] ?? null;
}
