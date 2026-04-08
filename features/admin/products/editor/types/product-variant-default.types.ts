export type SetDefaultProductVariantInput = {
  productId: string;
  variantId: string;
};

export type SetDefaultProductVariantResult = {
  status: "success" | "error";
  message: string;
};
