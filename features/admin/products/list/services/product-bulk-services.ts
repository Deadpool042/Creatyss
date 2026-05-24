import { withTransaction } from "@/core/db";
import { ProductStatus } from "@/prisma-generated/client";
import { deleteProductCatalogByIdInTx } from "@/features/admin/products/services";
import type {
  BulkArchiveProductsInput,
  BulkRestoreProductsInput,
  BulkDeleteProductsPermanentlyInput,
  BulkUpdateProductFeaturedInput,
  BulkUpdateProductStatusInput,
} from "../types";

// ── bulkArchiveProducts ──────────────────────────────────────────────────────

type BulkArchiveProductsServiceResult = {
  updatedCount: number;
};

export async function bulkArchiveProducts(
  input: BulkArchiveProductsInput
): Promise<BulkArchiveProductsServiceResult> {
  return withTransaction(async (tx) => {
    const result = await tx.product.updateMany({
      where: {
        id: {
          in: input.productIds,
        },
        archivedAt: null,
      },
      data: {
        archivedAt: new Date(),
      },
    });

    return {
      updatedCount: result.count,
    };
  });
}

// ── bulkRestoreProducts ──────────────────────────────────────────────────────

type BulkRestoreProductsServiceResult = {
  updatedCount: number;
};

export async function bulkRestoreProducts(
  input: BulkRestoreProductsInput
): Promise<BulkRestoreProductsServiceResult> {
  return withTransaction(async (tx) => {
    const result = await tx.product.updateMany({
      where: {
        id: {
          in: input.productIds,
        },
        archivedAt: {
          not: null,
        },
      },
      data: {
        archivedAt: null,
        status: ProductStatus.DRAFT,
        publishedAt: null,
      },
    });

    return {
      updatedCount: result.count,
    };
  });
}

// ── bulkDeleteProductsPermanently ────────────────────────────────────────────

type BulkDeleteProductsPermanentlyServiceResult = {
  deletedCount: number;
};

export async function bulkDeleteProductsPermanently(
  input: BulkDeleteProductsPermanentlyInput
): Promise<BulkDeleteProductsPermanentlyServiceResult> {
  return withTransaction(async (tx) => {
    const products = await tx.product.findMany({
      where: {
        id: {
          in: input.productIds,
        },
        archivedAt: {
          not: null,
        },
      },
      select: {
        id: true,
      },
    });

    if (products.length === 0) {
      throw new Error("products_not_found");
    }

    for (const product of products) {
      await deleteProductCatalogByIdInTx(tx, product.id);
    }

    return {
      deletedCount: products.length,
    };
  });
}

// ── bulkUpdateProductFeatured ────────────────────────────────────────────────

type BulkUpdateProductFeaturedServiceResult = {
  updatedCount: number;
};

export async function bulkUpdateProductFeatured(
  input: BulkUpdateProductFeaturedInput
): Promise<BulkUpdateProductFeaturedServiceResult> {
  return withTransaction(async (tx) => {
    const result = await tx.product.updateMany({
      where: {
        id: {
          in: input.productIds,
        },
      },
      data: {
        isFeatured: input.isFeatured,
      },
    });

    return {
      updatedCount: result.count,
    };
  });
}

// ── bulkUpdateProductStatus ──────────────────────────────────────────────────

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
