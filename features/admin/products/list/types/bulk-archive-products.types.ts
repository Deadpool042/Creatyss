export type BulkArchiveProductsInput = {
  productIds: string[];
};

export type BulkArchiveProductsResult = {
  status: "success" | "error";
  message: string;
  updatedCount?: number;
};
