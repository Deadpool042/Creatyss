export type ProductRelatedProductsFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<"productId" | "relatedProducts", string>>;
};

export const productRelatedProductsFormInitialState: ProductRelatedProductsFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductRelatedProductsFormAction = (
  prevState: ProductRelatedProductsFormState,
  formData: FormData
) => Promise<ProductRelatedProductsFormState>;
