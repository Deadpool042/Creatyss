import type { ProductType } from "./product-input";

export type ProductPublishabilityErrorCode = "simple_product_incoherent_variants";

type ProductPublishabilityResult =
  | { ok: true }
  | { ok: false; code: ProductPublishabilityErrorCode };

export function getProductPublishability(
  productType: ProductType,
  variantCount: number
): ProductPublishabilityResult {
  if (productType === "simple" && variantCount > 1) {
    return { ok: false, code: "simple_product_incoherent_variants" };
  }

  return { ok: true };
}
