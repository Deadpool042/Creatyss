export type AdminPriceEntry = {
  id: string | null;
  priceListId: string;
  amount: string | null;
  compareAtAmount: string | null;
  costAmount: string | null;
  startsAt: string | null;
  endsAt: string | null;
};

export type AdminVariantPriceEntry = {
  variantId: string;
  variantName: string | null;
  variantSku: string;
  prices: AdminPriceEntry[];
};

export type AdminProductPricingData = {
  productId: string;
  productPrices: AdminPriceEntry[];
  variantPrices: AdminVariantPriceEntry[];
};

export type ProductPricingFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<string, string>>;
};

export const productPricingFormInitialState: ProductPricingFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductPricingFormAction = (
  prevState: ProductPricingFormState,
  formData: FormData
) => Promise<ProductPricingFormState>;
