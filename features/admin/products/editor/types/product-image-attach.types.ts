export type AttachProductImagesInput = {
  productId: string;
  assetIds: string[];
};

export type AttachProductImagesResult = {
  status: "success" | "error";
  message: string;
};
