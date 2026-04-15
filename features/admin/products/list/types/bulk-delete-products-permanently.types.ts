export type BulkDeleteProductsPermanentlyInput = {
  productIds: string[];
};

export type BulkDeleteProductsPermanentlyResult = {
  status: "success" | "error";
  message: string;
  deletedCount?: number;
};
