import type { Prisma } from "@prisma/client";

export const productDeliverableSelect = {
  id: true,
  productId: true,
  mediaAssetId: true,
  name: true,
  kind: true,
  isPrimary: true,
  sortOrder: true,
  requiresPurchase: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductDeliverableSelect;

export type ProductDeliverableRow = Prisma.ProductDeliverableGetPayload<{
  select: typeof productDeliverableSelect;
}>;
