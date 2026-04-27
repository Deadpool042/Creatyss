import type { OfferVariant } from "@/features/storefront/catalog/types/product-offer-variant.types";

type CatalogVariantSource = {
  id: string;
  name: string;
  price: string;
  compareAtPrice: string | null;
  isAvailable: boolean;
  isDefault: boolean;
  sku: string;
  colorName: string | null;
  colorHex: string | null;
  images: { src: string; alt: string | null }[];
  barcode?: string | null;
  externalReference?: string | null;
  weightGrams?: number | null;
  widthMm?: number | null;
  heightMm?: number | null;
  depthMm?: number | null;
  optionValues?: Array<{
    optionId: string;
    optionName: string;
    valueId: string;
    valueLabel: string;
  }>;
};

export function normalizeOfferVariants(
  variants: CatalogVariantSource[]
): OfferVariant[] {
  return variants.map((variant) => {
    const variantDisplayImage = variant.images[0] ?? null;

    return {
      id: variant.id,
      name: variant.name,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      isAvailable: variant.isAvailable,
      isDefault: variant.isDefault,
      sku: variant.sku,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      displayImage: variantDisplayImage
        ? {
            src: variantDisplayImage.src,
            alt: variantDisplayImage.alt ?? variant.name,
          }
        : null,
      images: variant.images.map((image) => ({
        src: image.src,
        alt: image.alt ?? null,
      })),
      barcode: variant.barcode ?? null,
      externalReference: variant.externalReference ?? null,
      weightGrams: variant.weightGrams ?? null,
      widthMm: variant.widthMm ?? null,
      heightMm: variant.heightMm ?? null,
      depthMm: variant.depthMm ?? null,
      optionValues: (variant.optionValues ?? []).map((item) => ({
        optionId: item.optionId,
        optionName: item.optionName,
        valueId: item.valueId,
        valueLabel: item.valueLabel,
      })),
    };
  });
}
