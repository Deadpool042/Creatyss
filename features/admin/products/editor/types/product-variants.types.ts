export type AdminProductVariantStatus = "draft" | "published" | "archived";

export type AdminProductVariantListItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  sku: string;
  status: AdminProductVariantStatus;
  isDefault: boolean;
  sortOrder: number;
  primaryImageId: string | null;
  primaryImageUrl: string | null;
  primaryImageAlt: string | null;
  amount: string | null;
  compareAtAmount: string | null;
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
  status: "draft" | "published";
  isDefault: boolean;
  sortOrder: string;
  priceListId: string;
  amount: string;
  compareAtAmount: string;
  primaryImageId: string;
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
      | "priceListId"
      | "amount"
      | "compareAtAmount"
      | "primaryImageId",
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
