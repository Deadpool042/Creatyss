export type DeleteProductPermanentlyInput = {
  productSlug: string;
};

export type DeleteProductPermanentlyResult = {
  status: "success" | "error";
  message: string;
};
