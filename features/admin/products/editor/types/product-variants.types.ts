export type AdminProductVariantStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type AdminProductVariantListItem = {
  id: string;
  slug: string | null;
  sku: string;
  name: string | null;
  status: AdminProductVariantStatus;
  isDefault: boolean;
  sortOrder: number;
  barcode: string | null;
  externalReference: string | null;
  weightGrams: string | null;
  widthMm: string | null;
  heightMm: string | null;
  depthMm: string | null;
  primaryImageId: string | null;
  primaryImageUrl: string | null;
  primaryImageStorageKey: string | null;
  primaryImageAltText: string | null;
};

export type AdminProductVariantEditorData = {
  productId: string;
  productSlug: string;
  variants: AdminProductVariantListItem[];
};

export type AdminPriceListOption = {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
};

export type ProductVariantFormValues = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  sku: string;
  status: "draft" | "active" | "inactive";
  isDefault: boolean;
  sortOrder: string;
  primaryImageId: string;
  barcode: string;
  externalReference: string;
  weightGrams: string;
  widthMm: string;
  heightMm: string;
  depthMm: string;
};

export type ProductVariantFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<
    Record<
      | "id"
      | "productId"
      | "name"
      | "slug"
      | "sku"
      | "status"
      | "isDefault"
      | "sortOrder"
      | "primaryImageId"
      | "barcode"
      | "externalReference"
      | "weightGrams"
      | "widthMm"
      | "heightMm"
      | "depthMm",
      string
    >
  >;
};

export const productVariantFormInitialState: ProductVariantFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductVariantFormAction = (
  prevState: ProductVariantFormState,
  formData: FormData
) => Promise<ProductVariantFormState>;

export type SetDefaultProductVariantInput = {
  productId: string;
  variantId: string;
};

export type SetDefaultProductVariantResult = {
  status: "success" | "error";
  message: string;
};

export type DeleteProductVariantInput = {
  productId: string;
  variantId: string;
};

export type DeleteProductVariantResult = {
  status: "success" | "error";
  message: string;
};
