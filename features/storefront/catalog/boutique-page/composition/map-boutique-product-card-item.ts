import { localUploadExists } from "@/core/uploads/check-local-upload";
import type { BoutiqueProductCardItem } from "@/features/storefront/catalog/boutique-page/types";
import type { CatalogProductListItem } from "@/features/storefront/catalog/types";

type MapBoutiqueProductCardItemInput = {
  product: CatalogProductListItem;
  uploadsPublicPath: string;
};

function buildImageUrl(uploadsPublicPath: string, filePath: string): string {
  return `${uploadsPublicPath}/${filePath.replace(/^\/+/, "")}`;
}

function computeDiscountLabel(price: string | null, compareAtPrice: string | null): string | null {
  if (price === null || compareAtPrice === null) return null;
  const priceVal = parseFloat(price);
  const compareVal = parseFloat(compareAtPrice);
  if (!Number.isFinite(priceVal) || !Number.isFinite(compareVal) || compareVal <= 0) return null;
  const pct = Math.round(((compareVal - priceVal) / compareVal) * 100);
  return pct > 0 ? `−${pct}%` : null;
}

export function mapBoutiqueProductCardItem(
  input: MapBoutiqueProductCardItemInput
): BoutiqueProductCardItem {
  return {
    id: input.product.id,
    slug: input.product.slug,
    name: input.product.name,
    price: input.product.price,
    compareAtPrice: input.product.compareAtPrice,
    promoLabel: null,
    discountLabel: computeDiscountLabel(input.product.price, input.product.compareAtPrice),
    isAvailable: input.product.isAvailable,
    isFeatured: input.product.isFeatured,
    availabilityStatus: input.product.availabilityStatus,
    variantCount: input.product.variantCount,
    colorCount: input.product.colorCount,
    summary: input.product.shortDescription ?? input.product.description,
    image:
      input.product.primaryImage !== null &&
      localUploadExists(input.product.primaryImage.filePath)
        ? {
            src: buildImageUrl(input.uploadsPublicPath, input.product.primaryImage.filePath),
            alt: input.product.primaryImage.altText ?? input.product.name,
          }
        : null,
  };
}
