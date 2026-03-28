export type AdminProductListStatus = "draft" | "published" | "archived";

export type AdminProductListType = "simple" | "variable";

export type AdminProductListCategory = {
  id: string;
  slug: string;
  name: string;
};

export type AdminProductListDiagnostics = {
  missingPrimaryImage: boolean;
  missingPrice: boolean;
};

export type AdminProductListItem = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  status: AdminProductListStatus;
  isFeatured: boolean;
  productType: AdminProductListType;
  variantCount: number;
  categoryCount: number;
  primaryCategory: AdminProductListCategory | null;
  primaryImageUrl: string | null;
  primaryImageAlt: string | null;
  amount: string | null;
  compareAtAmount: string | null;
  updatedAt: string;
  diagnostics: AdminProductListDiagnostics;
};
