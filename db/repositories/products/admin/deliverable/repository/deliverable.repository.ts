import { prisma } from "@db/prisma-client";

import {
  createProductDeliverableInTx,
  updateProductDeliverableInTx,
} from "@db-products/helpers/transactions";
import {
  parseCreateAdminProductDeliverableInput,
  parseUpdateAdminProductDeliverableInput,
} from "@db-products/helpers/validation";
import {
  findAdminProductDeliverableRowById,
  listAdminProductDeliverableRowsByProductId,
} from "@db-products/queries/deliverable";
import type { ProductDeliverableRow } from "@db-products/types/rows";
import {
  AdminProductDeliverableRepositoryError,
  type AdminProductDeliverableSummary,
  type UpdateAdminProductDeliverableInput,
  type AdminProductDeliverableDetail,
  type CreateAdminProductDeliverableInput,
} from "@db-products/admin/deliverable";

function mapAdminProductDeliverable(row: ProductDeliverableRow): AdminProductDeliverableDetail {
  return {
    id: row.id,
    productId: row.productId,
    mediaAssetId: row.mediaAssetId,
    name: row.name,
    kind: row.kind,
    isPrimary: row.isPrimary,
    sortOrder: row.sortOrder,
    requiresPurchase: row.requiresPurchase,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapDeliverableTransactionError(error: unknown): never {
  if (error instanceof Error && error.message === "PRODUCT_DELIVERABLE_PRODUCT_NOT_FOUND") {
    throw new AdminProductDeliverableRepositoryError(
      "product_deliverable_product_not_found",
      "Produit du livrable introuvable."
    );
  }

  if (error instanceof Error && error.message === "PRODUCT_DELIVERABLE_MEDIA_INVALID") {
    throw new AdminProductDeliverableRepositoryError(
      "product_deliverable_media_invalid",
      "Média du livrable invalide."
    );
  }

  if (error instanceof Error && error.message === "PRODUCT_DELIVERABLE_KIND_MISMATCH") {
    throw new AdminProductDeliverableRepositoryError(
      "product_deliverable_kind_mismatch",
      "Les livrables sont interdits pour un produit physique."
    );
  }

  throw error;
}

export async function findAdminProductDeliverableById(
  id: string
): Promise<AdminProductDeliverableDetail | null> {
  const row = await findAdminProductDeliverableRowById(id);
  return row ? mapAdminProductDeliverable(row) : null;
}

export async function listAdminProductDeliverablesByProductId(
  productId: string
): Promise<AdminProductDeliverableSummary[]> {
  const rows = await listAdminProductDeliverableRowsByProductId(productId);
  return rows.map(mapAdminProductDeliverable);
}

export async function createAdminProductDeliverable(
  input: CreateAdminProductDeliverableInput
): Promise<AdminProductDeliverableDetail> {
  const parsedInput = parseCreateAdminProductDeliverableInput(input);

  try {
    const deliverableId = await prisma.$transaction((tx) =>
      createProductDeliverableInTx(tx, parsedInput)
    );

    const row = await findAdminProductDeliverableRowById(deliverableId);

    if (!row) {
      throw new AdminProductDeliverableRepositoryError(
        "product_deliverable_not_found",
        "Livrable introuvable."
      );
    }

    return mapAdminProductDeliverable(row);
  } catch (error) {
    mapDeliverableTransactionError(error);
  }
}

export async function updateAdminProductDeliverable(
  input: UpdateAdminProductDeliverableInput
): Promise<AdminProductDeliverableDetail | null> {
  const parsedInput = parseUpdateAdminProductDeliverableInput(input);

  try {
    const updated = await prisma.$transaction((tx) =>
      updateProductDeliverableInTx(tx, parsedInput)
    );

    if (!updated) {
      return null;
    }

    const row = await findAdminProductDeliverableRowById(parsedInput.id);
    return row ? mapAdminProductDeliverable(row) : null;
  } catch (error) {
    mapDeliverableTransactionError(error);
  }
}

export async function deleteAdminProductDeliverable(id: string): Promise<boolean> {
  const deleted = await prisma.productDeliverable.deleteMany({
    where: { id },
  });

  return deleted.count > 0;
}
