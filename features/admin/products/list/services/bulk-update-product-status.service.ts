import { withTransaction } from "@/core/db";
import { ProductStatus } from "@/prisma-generated/client";
import type { BulkUpdateProductStatusInput } from "../types";

type BulkUpdateProductStatusServiceResult = {
  updatedCount: number;
};

function mapTableStatusToPrismaStatus(
  status: BulkUpdateProductStatusInput["status"]
): ProductStatus {
  switch (status) {
    case "draft":
      return ProductStatus.DRAFT;
    case "active":
      return ProductStatus.ACTIVE;
    case "inactive":
      return ProductStatus.INACTIVE;
    case "archived":
      return ProductStatus.ARCHIVED;
  }
}

export async function bulkUpdateProductStatus(
  input: BulkUpdateProductStatusInput
): Promise<BulkUpdateProductStatusServiceResult> {
  return withTransaction(async (tx) => {
    const prismaStatus = mapTableStatusToPrismaStatus(input.status);

    const result = await tx.product.updateMany({
      where: {
        id: {
          in: input.productIds,
        },
      },
      data: {
        status: prismaStatus,
        publishedAt: input.status === "active" ? new Date() : null,
      },
    });

    return {
      updatedCount: result.count,
    };
  });
}
