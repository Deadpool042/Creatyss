export type ProductImageReorderDirection = "up" | "down";

export type ReorderProductImageInput = {
  productId: string;
  assetId: string;
  direction: ProductImageReorderDirection;
};

export type ReorderProductImageResult = {
  status: "success" | "error";
  message: string;
};
