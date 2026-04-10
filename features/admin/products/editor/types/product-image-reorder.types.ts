export type ProductImageReorderDirection = "up" | "down";

export type ReorderProductImageInput = {
  productId: string;
  imageId: string;
  sortOrder: number;
};

export type ReorderProductImageResult = {
  status: "success" | "error";
  message: string;
};
