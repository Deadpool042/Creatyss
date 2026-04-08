export type DeleteProductImageInput = {
  productId: string;
  assetId: string;
};

export type DeleteProductImageResult = {
  status: "success" | "error";
  message: string;
};
