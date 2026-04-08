//features/admin/products/editor/types/product-categories-form.types.ts
export type ProductCategoriesFormValues = {
  id: string;
  categoryIds: string[];
  primaryCategoryId: string;
};

export type ProductCategoriesFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<"id" | "categoryIds" | "primaryCategoryId", string>>;
};

export const productCategoriesFormInitialState: ProductCategoriesFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductCategoriesFormAction = (
  prevState: ProductCategoriesFormState,
  formData: FormData
) => Promise<ProductCategoriesFormState>;
