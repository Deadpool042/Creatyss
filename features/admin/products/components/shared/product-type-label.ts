type ProductTypeLabelCopy = {
  typeSimple: string;
  typeVariable: string;
  typeHistorical?: string;
};

type ProductTypeOptionLike = {
  code: string;
  name: string;
  slug?: string;
};

export function getProductTypeLabel(
  option: ProductTypeOptionLike,
  copy: ProductTypeLabelCopy
): string {
  const normalizedCode = option.code.trim().toLowerCase();
  const normalizedName = option.name.trim().toLowerCase();
  const normalizedSlug = option.slug?.trim().toLowerCase() ?? "";

  if (normalizedCode === "simple") {
    return copy.typeSimple;
  }

  if (normalizedCode === "variable") {
    return copy.typeVariable;
  }

  if (
    copy.typeHistorical &&
    (normalizedCode.includes("woo") ||
      normalizedSlug.includes("woo") ||
      normalizedName.includes("woo") ||
      normalizedCode.includes("import") ||
      normalizedSlug.includes("import") ||
      normalizedName.includes("import"))
  ) {
    return copy.typeHistorical;
  }

  return option.name;
}
