export type DeleteProductVariantInput = {
  productId: string;
  variantId: string;
};

export type DeleteProductVariantResult = {
  status: "success" | "error";
  message: string;
};
