export type AttachProductImagesInput = {
  images: Array<{
    productId: string;
    mediaAssetId: string;
    subjectType: "product" | "product_variant";
    subjectId: string;
    role: "gallery" | "thumbnail" | "other";
    sortOrder: number;
    isPrimary: boolean;
  }>;
};

export type AttachProductImagesResult = {
  status: "success" | "error";
  message: string;
};
