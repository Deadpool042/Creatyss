import type { OfferVariant } from "@/features/storefront/catalog/components/product-offers-section";
import { buildProductImages } from "@/features/storefront/catalog/model/build-product-images";
import { buildTechnicalSpecs } from "@/features/storefront/catalog/model/build-technical-specs";
import { buildVariantSummary } from "@/features/storefront/catalog/model/build-variant-summary";
import { normalizeOfferVariants } from "@/features/storefront/catalog/model/normalize-offer-variants";
import { resolveReferenceVariant } from "@/features/storefront/catalog/model/resolve-reference-variant";

type ProductPageViewModelVariant = {
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
  barcode: string | null;
  externalReference: string | null;
  weightGrams: number | null;
  widthMm: number | null;
  heightMm: number | null;
  depthMm: number | null;
  optionValues?: Array<{
    optionId: string;
    optionName: string;
    valueId: string;
    valueLabel: string;
  }>;
};

type ProductPageViewModelProduct = {
  productType: "simple" | "variable";
  images: { src: string; alt: string | null }[];
  variants: ProductPageViewModelVariant[];
};

export type ProductPageViewModel = {
  isSimpleProduct: boolean;
  singleOffer: OfferVariant | null;
  productImages: { src: string; alt: string | null }[];
  variantsNormalized: OfferVariant[];
  technicalSpecs: Array<{ label: string; value: string }>;
  variantSummary: { total: number; available: number } | null;
};

export function buildProductPageViewModel(
  product: ProductPageViewModelProduct
): ProductPageViewModel {
  const isSimpleProduct = product.productType === "simple";

  const referenceVariant = resolveReferenceVariant({
    productType: product.productType,
    variants: product.variants,
  });

  const productImages = buildProductImages({
    baseImages: product.images.map((image) => ({
      src: image.src,
      alt: image.alt ?? null,
    })),
    referenceVariant,
  });

  const variantsNormalized = normalizeOfferVariants(product.variants);

  const variantSummary = buildVariantSummary({
    productType: product.productType,
    variants: product.variants,
  });

  const technicalSpecs = buildTechnicalSpecs(referenceVariant);

  const singleOffer =
    isSimpleProduct && variantsNormalized.length === 1
      ? (variantsNormalized[0] ?? null)
      : null;

  return {
    isSimpleProduct,
    singleOffer,
    productImages,
    variantsNormalized,
    technicalSpecs,
    variantSummary,
  };
}
