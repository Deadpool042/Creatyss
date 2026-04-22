export type ProductGeneralFormValues = {
  productId: string;
  name: string;
  slug: string;
  skuRoot: string;
  marketingHook: string;
  shortDescription: string;
  description: string;
  status: "draft" | "active" | "inactive" | "archived";
  isFeatured: boolean;
  productTypeId: string;
  primaryImageId: string;
};

export type ProductGeneralFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<
    Record<
      | "productId"
      | "name"
      | "slug"
      | "skuRoot"
      | "marketingHook"
      | "shortDescription"
      | "description"
      | "status"
      | "isFeatured"
      | "productTypeId"
      | "primaryImageId",
      string
    >
  >;
};

export const productGeneralFormInitialState: ProductGeneralFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductGeneralFormAction = (
  prevState: ProductGeneralFormState,
  formData: FormData
) => Promise<ProductGeneralFormState>;
