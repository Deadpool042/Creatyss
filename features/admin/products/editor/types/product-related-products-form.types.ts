export type ProductRelatedProductsFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export const productRelatedProductsFormInitialState: ProductRelatedProductsFormState = {
  status: "idle",
  message: null,
};

export type ProductRelatedProductsFormAction = (
  prevState: ProductRelatedProductsFormState,
  formData: FormData
) => Promise<ProductRelatedProductsFormState>;
