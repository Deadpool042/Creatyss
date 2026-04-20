import type { AdminProductAvailabilityStatus } from "./product-variants.types";

export type ProductAvailabilityRowInput = {
  variantId: string;
  status: AdminProductAvailabilityStatus;
  isSellable: boolean;
  backorderAllowed: boolean;
  sellableFrom: Date | null;
  sellableUntil: Date | null;
  preorderStartsAt: Date | null;
  preorderEndsAt: Date | null;
};

export type ProductAvailabilityFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export const productAvailabilityFormInitialState: ProductAvailabilityFormState = {
  status: "idle",
  message: null,
};

export type ProductAvailabilityFormAction = (
  prevState: ProductAvailabilityFormState,
  formData: FormData
) => Promise<ProductAvailabilityFormState>;
