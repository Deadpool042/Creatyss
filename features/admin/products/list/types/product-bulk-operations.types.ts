import type { AdminProductActionResult } from "@/features/admin/products/types";

// ─── Toggle featured ──────────────────────────────────────────────────────────

export type ToggleProductFeaturedInput = {
  productId: string;
};

export type ToggleProductFeaturedResult = AdminProductActionResult & {
  isFeatured?: boolean;
};

// ─── Bulk archive ─────────────────────────────────────────────────────────────

export type BulkArchiveProductsInput = {
  productIds: string[];
};

export type BulkArchiveProductsResult = AdminProductActionResult & {
  updatedCount?: number;
};

// ─── Bulk delete permanently ──────────────────────────────────────────────────

export type BulkDeleteProductsPermanentlyInput = {
  productIds: string[];
};

export type BulkDeleteProductsPermanentlyResult = AdminProductActionResult & {
  deletedCount?: number;
};

// ─── Bulk restore ─────────────────────────────────────────────────────────────

export type BulkRestoreProductsInput = {
  productIds: string[];
};

export type BulkRestoreProductsResult = AdminProductActionResult & {
  updatedCount?: number;
};

// ─── Bulk update featured ─────────────────────────────────────────────────────

export type BulkUpdateProductFeaturedInput = {
  productIds: string[];
  isFeatured: boolean;
};

export type BulkUpdateProductFeaturedResult = AdminProductActionResult & {
  updatedCount?: number;
};

// ─── Bulk update status ───────────────────────────────────────────────────────

export type BulkUpdateProductStatusInput = {
  productIds: string[];
  status: "draft" | "active" | "inactive" | "archived";
};

export type BulkUpdateProductStatusResult = AdminProductActionResult & {
  updatedCount?: number;
};
