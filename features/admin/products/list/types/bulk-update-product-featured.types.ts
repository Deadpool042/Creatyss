export type BulkUpdateProductFeaturedInput = {
  productIds: string[];
  isFeatured: boolean;
};

export type BulkUpdateProductFeaturedResult = {
  status: "success" | "error";
  message: string;
  updatedCount?: number;
};
