import { type ProductType } from "./product-input";

export type ProductTypeCompatibilityErrorCode =
  | "simple_product_single_variant_only"
  | "simple_product_requires_single_variant";

export function isProductType(value: string): value is ProductType {
  return value === "simple" || value === "variable";
}

export function canChangeProductTypeToSimple(variantCount: number): boolean {
  return variantCount <= 1;
}

export function canCreateVariantForProductType(
  productType: ProductType,
  existingVariantCount: number
): boolean {
  if (productType === "simple") {
    return existingVariantCount === 0;
  }

  return true;
}
