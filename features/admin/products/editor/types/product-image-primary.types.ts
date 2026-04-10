export type SetProductPrimaryImageInput = {
  productId: string;
  mediaAssetId: string | null;
};

export type SetProductPrimaryImageResult = {
  status: "success" | "error";
  message: string;
};
