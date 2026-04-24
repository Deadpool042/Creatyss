export type AdminProductCharacteristicItem = {
  id: string;
  label: string;
  value: string;
  sortOrder: number;
};

export type ProductCharacteristicsFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<"productId" | "characteristics", string>>;
  rowErrors: Record<number, Partial<Record<"label" | "value", string>>>;
};

export const productCharacteristicsFormInitialState: ProductCharacteristicsFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
  rowErrors: {},
};

export type ProductCharacteristicsFormAction = (
  prevState: ProductCharacteristicsFormState,
  formData: FormData
) => Promise<ProductCharacteristicsFormState>;
