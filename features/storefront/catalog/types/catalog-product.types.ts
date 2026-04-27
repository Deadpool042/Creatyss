import type { CatalogImage } from "@/features/storefront/catalog/helpers/catalog-images";

export type CatalogVariantOptionValue = {
  optionId: string;
  optionName: string;
  valueId: string;
  valueLabel: string;
};

export type CatalogVariant = {
  id: string;
  sku: string;
  name: string;
  colorName: string | null;
  colorHex: string | null;
  isDefault: boolean;
  isAvailable: boolean;
  price: string;
  compareAtPrice: string | null;
  images: CatalogImage[];
  barcode: string | null;
  externalReference: string | null;
  weightGrams: number | null;
  widthMm: number | null;
  heightMm: number | null;
  depthMm: number | null;
  optionValues: CatalogVariantOptionValue[];
};

export type CatalogProductCharacteristic = {
  id: string;
  label: string;
  value: string;
};

export type CatalogRelatedProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  imageFilePath: string | null;
  imageAltText: string | null;
};

export type CatalogRelatedProductGroup = {
  type: "related" | "cross_sell" | "up_sell" | "accessory" | "similar";
  label: string;
  products: CatalogRelatedProduct[];
};

export type CatalogProductDetail = {
  id: string;
  slug: string;
  name: string;
  marketingHook: string | null;
  shortDescription: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoIndexingMode: "INDEX_FOLLOW" | "INDEX_NOFOLLOW" | "NOINDEX_FOLLOW" | "NOINDEX_NOFOLLOW" | null;
  seoCanonicalPath: string | null;
  seoOpenGraphTitle: string | null;
  seoOpenGraphDescription: string | null;
  seoOpenGraphImageUrl: string | null;
  seoTwitterTitle: string | null;
  seoTwitterDescription: string | null;
  seoTwitterImageUrl: string | null;
  productType: "simple" | "variable";
  isAvailable: boolean;
  images: CatalogImage[];
  variants: CatalogVariant[];
  relatedProductGroups: CatalogRelatedProductGroup[];
  characteristics: CatalogProductCharacteristic[];
};

export type CatalogProductListItem = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  isFeatured: boolean;
  isAvailable: boolean;
  primaryImage: {
    filePath: string;
    altText: string | null;
  } | null;
};
