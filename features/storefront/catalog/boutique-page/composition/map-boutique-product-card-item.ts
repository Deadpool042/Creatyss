import type { BoutiqueProductCardItem } from "@/features/storefront/catalog/boutique-page/types";
import type { CatalogProductListItem } from "@/features/storefront/catalog/types";

type MapBoutiqueProductCardItemInput = {
  product: CatalogProductListItem;
  uploadsPublicPath: string;
};

function buildImageUrl(uploadsPublicPath: string, filePath: string): string {
  return `${uploadsPublicPath}/${filePath.replace(/^\/+/, "")}`;
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
    discountLabel: null,
    isAvailable: input.product.isAvailable,
    isFeatured: input.product.isFeatured,
    availabilityStatus: input.product.availabilityStatus,
    variantCount: input.product.variantCount,
    colorCount: input.product.colorCount,
    summary: input.product.shortDescription ?? input.product.description,
    image: input.product.primaryImage
      ? {
          src: buildImageUrl(input.uploadsPublicPath, input.product.primaryImage.filePath),
          alt: input.product.primaryImage.altText ?? input.product.name,
        }
      : null,
  };
}
