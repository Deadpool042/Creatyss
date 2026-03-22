import type {
  CreateAdminProductDeliverableInput,
  UpdateAdminProductDeliverableInput,
} from "@db-products/admin/deliverable";
import { productExistsInTx } from "@db-products/queries/product";
import type { ProductTxClient } from "@db-products/types/tx";
import { assertProductPublicationRulesInTx } from "./publication.transaction";
import { readProductKindInTx } from "./shared.transaction";
import { clearPrimaryDeliverableInTx } from "@db-products/helpers/invariants";

export async function createProductDeliverableInTx(
  tx: ProductTxClient,
  input: CreateAdminProductDeliverableInput
): Promise<string> {
  const exists = await productExistsInTx(tx, input.productId);

  if (!exists) {
    throw new Error("PRODUCT_DELIVERABLE_PRODUCT_NOT_FOUND");
  }

  const productKind = await readProductKindInTx(tx, input.productId);

  if (!productKind) {
    throw new Error("PRODUCT_DELIVERABLE_PRODUCT_NOT_FOUND");
  }

  if (productKind === "physical") {
    throw new Error("PRODUCT_DELIVERABLE_KIND_MISMATCH");
  }

  const media = await tx.mediaAsset.findUnique({
    where: { id: input.mediaAssetId },
    select: { id: true },
  });

  if (!media) {
    throw new Error("PRODUCT_DELIVERABLE_MEDIA_INVALID");
  }

  if (input.isPrimary === true) {
    await clearPrimaryDeliverableInTx(tx, input.productId);
  }

  const created = await tx.productDeliverable.create({
    data: {
      productId: input.productId,
      mediaAssetId: input.mediaAssetId,
      name: input.name,
      kind: input.kind,
      isPrimary: input.isPrimary ?? false,
      sortOrder: input.sortOrder ?? 0,
      requiresPurchase: input.requiresPurchase ?? true,
      isActive: input.isActive ?? true,
    },
    select: {
      id: true,
    },
  });

  return created.id;
}

export async function updateProductDeliverableInTx(
  tx: ProductTxClient,
  input: UpdateAdminProductDeliverableInput
): Promise<boolean> {
  const existing = await tx.productDeliverable.findUnique({
    where: { id: input.id },
    select: {
      id: true,
      productId: true,
    },
  });

  if (!existing) {
    return false;
  }

  const productRow = await tx.product.findUnique({
    where: {
      id: existing.productId,
    },
    select: {
      status: true,
      productKind: true,
    },
  });

  if (!productRow) {
    throw new Error("PRODUCT_DELIVERABLE_PRODUCT_NOT_FOUND");
  }

  if (productRow.productKind === "physical") {
    throw new Error("PRODUCT_DELIVERABLE_KIND_MISMATCH");
  }

  if (input.isPrimary === true) {
    await clearPrimaryDeliverableInTx(tx, existing.productId);
  }

  const deliverableData: {
    name: string;
    kind: "pattern_pdf" | "supply_list_pdf" | "instruction_pdf" | "bonus_file";
    isPrimary?: boolean;
    sortOrder?: number;
    requiresPurchase?: boolean;
    isActive?: boolean;
  } = {
    name: input.name,
    kind: input.kind,
  };

  if (input.isPrimary !== undefined) {
    deliverableData.isPrimary = input.isPrimary;
  }

  if (input.sortOrder !== undefined) {
    deliverableData.sortOrder = input.sortOrder;
  }

  if (input.requiresPurchase !== undefined) {
    deliverableData.requiresPurchase = input.requiresPurchase;
  }

  if (input.isActive !== undefined) {
    deliverableData.isActive = input.isActive;
  }

  await tx.productDeliverable.update({
    where: { id: input.id },
    data: deliverableData,
  });

  await assertProductPublicationRulesInTx(tx, {
    productId: existing.productId,
    status: productRow.status,
    productKind: productRow.productKind,
  });

  return true;
}
