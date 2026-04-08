export type SetProductPrimaryImageInput = {
  productId: string;
  assetId: string;
};

export type SetProductPrimaryImageResult = {
  status: "success" | "error";
  message: string;
};
