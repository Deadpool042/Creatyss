import type { AdminProductActionResult } from "@/features/admin/products/types";

export type AdminProductVariantStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type AdminProductAvailabilityStatus =
  | "available"
  | "unavailable"
  | "preorder"
  | "backorder"
  | "discontinued"
  | "archived";

export type AdminProductVariantAvailability = {
  status: AdminProductAvailabilityStatus;
  isSellable: boolean;
  backorderAllowed: boolean;
  sellableFrom: string | null;
  sellableUntil: string | null;
  preorderStartsAt: string | null;
  preorderEndsAt: string | null;
};

export type AdminProductVariantInventory = {
  onHandQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  hasInventoryRecord: boolean;
};

export type AdminProductVariantOptionValue = {
  optionName: string;
  value: string;
  optionValueId: string;
  optionId: string;
};

export type AdminProductOptionValueItem = {
  id: string;
  code: string;
  value: string;
  label: string | null;
  sortOrder: number;
};

export type AdminProductOptionItem = {
  id: string;
  code: string;
  name: string;
  sortOrder: number;
  isVariantAxis: boolean;
  values: AdminProductOptionValueItem[];
};

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
  availability: AdminProductVariantAvailability;
  inventory: AdminProductVariantInventory;
  optionValues: AdminProductVariantOptionValue[];
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
  currencyCode: string;
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
  optionValueIds: string[];
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
      | "depthMm"
      | "optionValues",
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

export type SetDefaultProductVariantResult = AdminProductActionResult;

export type DeleteProductVariantInput = {
  productId: string;
  variantId: string;
};

export type DeleteProductVariantResult = AdminProductActionResult;
