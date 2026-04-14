export type ProductInventoryRowInput = {
  variantId: string;
  onHandQuantity: number;
  reservedQuantity: number;
};

export type ProductInventoryFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<string, string>>;
};

export const productInventoryFormInitialState: ProductInventoryFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductInventoryFormAction = (
  prevState: ProductInventoryFormState,
  formData: FormData
) => Promise<ProductInventoryFormState>;
