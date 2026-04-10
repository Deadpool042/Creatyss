export type UpdateProductImageAltTextInput = {
  productId: string;
  imageId: string;
  altText: string;
};

export type UpdateProductImageAltTextResult = {
  status: "success" | "error";
  message: string;
};
