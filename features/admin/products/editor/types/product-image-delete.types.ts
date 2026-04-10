export type DeleteProductImageInput = {
  productId: string;
  imageId: string;
};

export type DeleteProductImageResult = {
  status: "success" | "error";
  message: string;
};
