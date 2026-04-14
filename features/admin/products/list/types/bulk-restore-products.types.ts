export type BulkRestoreProductsInput = {
  productIds: string[];
};

export type BulkRestoreProductsResult = {
  status: "success" | "error";
  message: string;
  updatedCount?: number;
};
