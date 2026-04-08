export type ProductSeoFormValues = {
  id: string;
  seoTitle: string;
  seoDescription: string;
};

export type ProductSeoFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<"id" | "seoTitle" | "seoDescription", string>>;
};

export const productSeoFormInitialState: ProductSeoFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductSeoFormAction = (
  prevState: ProductSeoFormState,
  formData: FormData
) => Promise<ProductSeoFormState>;
