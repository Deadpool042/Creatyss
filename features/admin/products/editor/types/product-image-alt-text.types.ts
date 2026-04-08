export type UpdateProductImageAltTextInput = {
  productId: string;
  assetId: string;
  altText: string;
};

export type UpdateProductImageAltTextResult = {
  status: "success" | "error";
  message: string;
};
