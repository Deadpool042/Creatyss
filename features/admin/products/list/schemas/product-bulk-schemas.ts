import { z } from "zod";

// ── bulkArchiveProducts ──────────────────────────────────────────────────────

export const bulkArchiveProductsSchema = z.object({
  productIds: z.array(z.string().trim().min(1)).min(1, "Aucun produit sélectionné."),
});

export type BulkArchiveProductsSchema = z.infer<typeof bulkArchiveProductsSchema>;

// ── bulkRestoreProducts ──────────────────────────────────────────────────────

export const bulkRestoreProductsSchema = z.object({
  productIds: z.array(z.string().trim().min(1)).min(1, "Aucun produit sélectionné."),
});

export type BulkRestoreProductsSchema = z.infer<typeof bulkRestoreProductsSchema>;

// ── bulkDeleteProductsPermanently ────────────────────────────────────────────

export const bulkDeleteProductsPermanentlySchema = z.object({
  productIds: z.array(z.string().trim().min(1)).min(1),
});

export type BulkDeleteProductsPermanentlySchema = z.infer<
  typeof bulkDeleteProductsPermanentlySchema
>;

// ── bulkUpdateProductFeatured ────────────────────────────────────────────────

export const bulkUpdateProductFeaturedSchema = z.object({
  productIds: z.array(z.string().trim().min(1)).min(1, "Aucun produit sélectionné."),
  isFeatured: z.boolean(),
});

export type BulkUpdateProductFeaturedSchema = z.infer<typeof bulkUpdateProductFeaturedSchema>;

// ── bulkUpdateProductStatus ──────────────────────────────────────────────────

export const bulkUpdateProductStatusSchema = z.object({
  productIds: z.array(z.string().trim().min(1)).min(1, "Aucun produit sélectionné."),
  status: z.enum(["draft", "active", "inactive", "archived"]),
});

export type BulkUpdateProductStatusSchema = z.infer<typeof bulkUpdateProductStatusSchema>;

// ── deleteProductPermanently ─────────────────────────────────────────────────

export const deleteProductPermanentlySchema = z.object({
  productSlug: z.string().trim().min(1, "Le slug produit est requis."),
});

export type DeleteProductPermanentlySchema = z.infer<typeof deleteProductPermanentlySchema>;
