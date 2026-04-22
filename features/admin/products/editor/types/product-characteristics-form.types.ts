export type AdminProductCharacteristicItem = {
  id: string;
  label: string;
  value: string;
  sortOrder: number;
};

export type ProductCharacteristicsFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const productCharacteristicsFormInitialState: ProductCharacteristicsFormState = {
  status: "idle",
  message: "",
};

export type ProductCharacteristicsFormAction = (
  prevState: ProductCharacteristicsFormState,
  formData: FormData
) => Promise<ProductCharacteristicsFormState>;
