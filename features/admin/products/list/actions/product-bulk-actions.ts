"use server";

import { refresh } from "next/cache";
import {
  bulkArchiveProductsSchema,
  bulkDeleteProductsPermanentlySchema,
  bulkRestoreProductsSchema,
  bulkUpdateProductFeaturedSchema,
  bulkUpdateProductStatusSchema,
} from "../schemas/product-bulk-schemas";
import {
  bulkArchiveProducts,
  bulkDeleteProductsPermanently,
  bulkRestoreProducts,
  bulkUpdateProductFeatured,
  bulkUpdateProductStatus,
} from "../services";
import type {
  BulkArchiveProductsInput,
  BulkArchiveProductsResult,
  BulkDeleteProductsPermanentlyInput,
  BulkDeleteProductsPermanentlyResult,
  BulkRestoreProductsInput,
  BulkRestoreProductsResult,
  BulkUpdateProductFeaturedInput,
  BulkUpdateProductFeaturedResult,
  BulkUpdateProductStatusInput,
  BulkUpdateProductStatusResult,
} from "../types";

// ─── bulkArchiveProductsAction ────────────────────────────────────────────────

function getArchiveSuccessMessage(updatedCount: number): string {
  return `${updatedCount} produit${updatedCount > 1 ? "s" : ""} mis à la corbeille.`;
}

export async function bulkArchiveProductsAction(
  input: BulkArchiveProductsInput
): Promise<BulkArchiveProductsResult> {
  const parsed = bulkArchiveProductsSchema.safeParse({
    productIds: input.productIds
      .map((productId) => productId.trim())
      .filter((productId) => productId.length > 0),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Sélection invalide.",
    };
  }

  try {
    const result = await bulkArchiveProducts(parsed.data);

    refresh();

    return {
      status: "success",
      message: getArchiveSuccessMessage(result.updatedCount),
      updatedCount: result.updatedCount,
    };
  } catch {
    return {
      status: "error",
      message: "Mise à la corbeille impossible.",
    };
  }
}

// ─── bulkDeleteProductsPermanentlyAction ──────────────────────────────────────

function getDeleteSuccessMessage(deletedCount: number): string {
  if (deletedCount <= 1) {
    return "1 produit supprimé définitivement.";
  }

  return `${deletedCount} produits supprimés définitivement.`;
}

export async function bulkDeleteProductsPermanentlyAction(
  input: BulkDeleteProductsPermanentlyInput
): Promise<BulkDeleteProductsPermanentlyResult> {
  const parsed = bulkDeleteProductsPermanentlySchema.safeParse({
    productIds: input.productIds
      .map((productId) => productId.trim())
      .filter((productId) => productId.length > 0),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Sélection invalide.",
    };
  }

  try {
    const result = await bulkDeleteProductsPermanently(parsed.data);

    refresh();

    return {
      status: "success",
      message: getDeleteSuccessMessage(result.deletedCount),
      deletedCount: result.deletedCount,
    };
  } catch {
    return {
      status: "error",
      message: "Suppression définitive groupée impossible.",
    };
  }
}

// ─── bulkRestoreProductsAction ────────────────────────────────────────────────

function getRestoreSuccessMessage(updatedCount: number): string {
  return `${updatedCount} produit${updatedCount > 1 ? "s" : ""} restauré${updatedCount > 1 ? "s" : ""}.`;
}

export async function bulkRestoreProductsAction(
  input: BulkRestoreProductsInput
): Promise<BulkRestoreProductsResult> {
  const parsed = bulkRestoreProductsSchema.safeParse({
    productIds: input.productIds
      .map((productId) => productId.trim())
      .filter((productId) => productId.length > 0),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Sélection invalide.",
    };
  }

  try {
    const result = await bulkRestoreProducts(parsed.data);

    refresh();

    return {
      status: "success",
      message: getRestoreSuccessMessage(result.updatedCount),
      updatedCount: result.updatedCount,
    };
  } catch {
    return {
      status: "error",
      message: "Restauration groupée impossible.",
    };
  }
}

// ─── bulkUpdateProductFeaturedAction ─────────────────────────────────────────

function getFeaturedSuccessMessage(
  updatedCount: number,
  isFeatured: BulkUpdateProductFeaturedInput["isFeatured"]
): string {
  const countLabel = `${updatedCount} produit${updatedCount > 1 ? "s" : ""}`;

  if (isFeatured) {
    return `${countLabel} mis en avant.`;
  }

  return `${countLabel} retiré${updatedCount > 1 ? "s" : ""} de la mise en avant.`;
}

export async function bulkUpdateProductFeaturedAction(
  input: BulkUpdateProductFeaturedInput
): Promise<BulkUpdateProductFeaturedResult> {
  const parsed = bulkUpdateProductFeaturedSchema.safeParse({
    productIds: input.productIds
      .map((productId) => productId.trim())
      .filter((productId) => productId.length > 0),
    isFeatured: input.isFeatured,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Sélection invalide.",
    };
  }

  try {
    const result = await bulkUpdateProductFeatured(parsed.data);

    refresh();

    return {
      status: "success",
      message: getFeaturedSuccessMessage(result.updatedCount, parsed.data.isFeatured),
      updatedCount: result.updatedCount,
    };
  } catch {
    return {
      status: "error",
      message: "Mise à jour groupée impossible.",
    };
  }
}

// ─── bulkUpdateProductStatusAction ───────────────────────────────────────────

function getStatusSuccessMessage(
  updatedCount: number,
  status: BulkUpdateProductStatusInput["status"]
): string {
  const countLabel = `${updatedCount} produit${updatedCount > 1 ? "s" : ""}`;

  switch (status) {
    case "draft":
      return `${countLabel} mis en brouillon.`;
    case "active":
      return `${countLabel} activé${updatedCount > 1 ? "s" : ""}.`;
    case "inactive":
      return `${countLabel} désactivé${updatedCount > 1 ? "s" : ""}.`;
    case "archived":
      return `${countLabel} archivé${updatedCount > 1 ? "s" : ""}.`;
  }
}

export async function bulkUpdateProductStatusAction(
  input: BulkUpdateProductStatusInput
): Promise<BulkUpdateProductStatusResult> {
  const parsed = bulkUpdateProductStatusSchema.safeParse({
    productIds: input.productIds
      .map((productId) => productId.trim())
      .filter((productId) => productId.length > 0),
    status: input.status,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Sélection ou statut invalide.",
    };
  }

  try {
    const result = await bulkUpdateProductStatus(parsed.data);

    refresh();

    return {
      status: "success",
      message: getStatusSuccessMessage(result.updatedCount, parsed.data.status),
      updatedCount: result.updatedCount,
    };
  } catch {
    return {
      status: "error",
      message: "Mise à jour groupée impossible.",
    };
  }
}
