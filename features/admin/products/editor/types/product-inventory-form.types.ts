export type ProductInventoryRowInput = {
  variantId: string;
  onHandQuantity: number;
};

export type ProductInventoryFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export const productInventoryFormInitialState: ProductInventoryFormState = {
  status: "idle",
  message: null,
};

export type ProductInventoryFormAction = (
  prevState: ProductInventoryFormState,
  formData: FormData
) => Promise<ProductInventoryFormState>;
