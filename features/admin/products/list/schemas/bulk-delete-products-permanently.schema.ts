import { z } from "zod";

export const bulkDeleteProductsPermanentlySchema = z.object({
  productIds: z.array(z.string().trim().min(1)).min(1),
});

export type BulkDeleteProductsPermanentlySchema = z.infer<
  typeof bulkDeleteProductsPermanentlySchema
>;
