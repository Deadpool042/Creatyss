import { normalizeSeoText } from "@/entities/seo";

export function buildProductSeoPublicPath(productSlug: string): string {
  return `/products/${productSlug}`;
}

export function resolveProductSeoFallbackTitle(productName: string): string {
  return normalizeSeoText(productName);
}

export function resolveProductSeoFallbackDescription(
  productShortDescription: string | null
): string {
  if (productShortDescription === null) {
    return "";
  }

  return normalizeSeoText(productShortDescription);
}

export function resolveProductSeoFallbackOpenGraphImageUrl(
  primaryImageUrl: string | null
): string | null {
  if (primaryImageUrl === null) {
    return null;
  }

  const normalized = primaryImageUrl.trim();
  return normalized.length > 0 ? normalized : null;
}
