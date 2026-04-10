export type AdminProductDisplayStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type AdminProductDisplayType = "simple" | "variable" | "typed";

export type AdminProductDetailsCategory = {
  id: string;
  slug: string;
  name: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type AdminProductDetailsVariantOptionValue = {
  optionName: string;
  value: string;
};

export type AdminProductDetailsVariant = {
  id: string;
  slug: string;
  name: string | null;
  sku: string;
  status: AdminProductDisplayStatus;
  primaryImageUrl: string | null;
  primaryImageAlt: string | null;
  amount: string | null;
  compareAtAmount: string | null;
  optionValues: AdminProductDetailsVariantOptionValue[];
};

export type AdminProductDetailsDiagnostics = {
  missingPrimaryImage: boolean;
  missingPrice: boolean;
  missingCategory: boolean;
};

export type AdminProductDetails = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  status: AdminProductDisplayStatus;
  isFeatured: boolean;
  productType: AdminProductDisplayType;
  productTypeCode: string | null;
  updatedAt: string;
  primaryImageUrl: string | null;
  primaryImageAlt: string | null;
  categories: AdminProductDetailsCategory[];
  primaryCategory: AdminProductDetailsCategory | null;
  amount: string | null;
  compareAtAmount: string | null;
  variantCount: number;
  variants: AdminProductDetailsVariant[];
  diagnostics: AdminProductDetailsDiagnostics;
};
