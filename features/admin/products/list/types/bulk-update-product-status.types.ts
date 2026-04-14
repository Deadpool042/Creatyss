export type BulkUpdateProductStatusInput = {
  productIds: string[];
  status: "draft" | "active" | "inactive" | "archived";
};

export type BulkUpdateProductStatusResult = {
  status: "success" | "error";
  message: string;
  updatedCount?: number;
};
