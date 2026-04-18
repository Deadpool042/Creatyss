"use client";

import { useEffect, useState } from "react";

import { archiveProductBySlugAction } from "@/features/admin/products/shared/actions/archive-product.action";
import { bulkArchiveProductsAction } from "@/features/admin/products/list/actions/bulk-archive-products.action";
import { bulkDeleteProductsPermanentlyAction } from "@/features/admin/products/list/actions/bulk-delete-products-permanently.action";
import { bulkRestoreProductsAction } from "@/features/admin/products/list/actions/bulk-restore-products.action";
import { bulkUpdateProductFeaturedAction } from "@/features/admin/products/list/actions/bulk-update-product-featured.action";
import { bulkUpdateProductStatusAction } from "@/features/admin/products/list/actions/bulk-update-product-status.action";
import { deleteProductPermanentlyBySlugAction } from "@/features/admin/products/shared/actions/delete-product-permanently.action";
import { restoreProductBySlugAction } from "@/features/admin/products/shared/actions/restore-product.action";
import type { ProductTableStatus } from "@/features/admin/products/list/types/product-table.types";

type UseProductTableActionsInput = {
  currentPageProductIds: string[];
  mobileVisibleProductIds: string[];
};

type UseProductTableActionsResult = {
  selectedProductIds: string[];
  selectedCount: number;
  areAllCurrentPageSelected: boolean;
  bulkMessage: string | null;
  bulkError: string | null;
  isBulkPending: boolean;
  toggleProductSelection: (productId: string) => void;
  toggleSelectAllCurrentPage: () => void;
  toggleSelectAllMobileVisible: () => void;
  clearSelection: () => void;
  handleBulkStatusChange: (status: ProductTableStatus) => Promise<void>;
  handleBulkFeaturedChange: (isFeatured: boolean) => Promise<void>;
  handleBulkArchive: () => Promise<void>;
  handleBulkRestore: () => Promise<void>;
  handleBulkPermanentDelete: () => Promise<void>;
  handleArchiveOne: (productSlug: string) => Promise<void>;
  handleRestoreOne: (productSlug: string) => Promise<void>;
  handlePermanentDeleteOne: (productSlug: string) => Promise<void>;
};

export function useProductTableActions({
  currentPageProductIds,
  mobileVisibleProductIds,
}: UseProductTableActionsInput): UseProductTableActionsResult {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [isBulkPending, setIsBulkPending] = useState(false);

  useEffect(() => {
    if (bulkMessage === null && bulkError === null) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setBulkMessage(null);
      setBulkError(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [bulkMessage, bulkError]);

  const selectedCount = selectedProductIds.length;

  const areAllCurrentPageSelected =
    currentPageProductIds.length > 0 &&
    currentPageProductIds.every((productId) => selectedProductIds.includes(productId));

  // ── Selection handlers ────────────────────────────────────────────────────

  function toggleProductSelection(productId: string): void {
    setBulkMessage(null);
    setBulkError(null);

    setSelectedProductIds((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }

      return [...current, productId];
    });
  }

  function toggleSelectAllCurrentPage(): void {
    setBulkMessage(null);
    setBulkError(null);

    setSelectedProductIds((current) => {
      if (areAllCurrentPageSelected) {
        return current.filter((id) => !currentPageProductIds.includes(id));
      }

      const next = new Set(current);

      for (const productId of currentPageProductIds) {
        next.add(productId);
      }

      return Array.from(next);
    });
  }

  function toggleSelectAllMobileVisible(): void {
    setBulkMessage(null);
    setBulkError(null);

    const areAllVisibleSelected =
      mobileVisibleProductIds.length > 0 &&
      mobileVisibleProductIds.every((productId) => selectedProductIds.includes(productId));

    setSelectedProductIds((current) => {
      if (areAllVisibleSelected) {
        return current.filter((id) => !mobileVisibleProductIds.includes(id));
      }

      const next = new Set(current);

      for (const productId of mobileVisibleProductIds) {
        next.add(productId);
      }

      return Array.from(next);
    });
  }

  function clearSelection(): void {
    setSelectedProductIds([]);
    setBulkMessage(null);
    setBulkError(null);
  }

  // ── Bulk action handlers ──────────────────────────────────────────────────

  async function handleBulkStatusChange(status: ProductTableStatus): Promise<void> {
    if (selectedProductIds.length === 0 || isBulkPending) return;

    setIsBulkPending(true);
    setBulkMessage(null);
    setBulkError(null);

    const result = await bulkUpdateProductStatusAction({
      productIds: selectedProductIds,
      status,
    });

    if (result.status === "success") {
      setBulkMessage(result.message);
      setSelectedProductIds([]);
    } else {
      setBulkError(result.message);
    }

    setIsBulkPending(false);
  }

  async function handleBulkFeaturedChange(isFeatured: boolean): Promise<void> {
    if (selectedProductIds.length === 0 || isBulkPending) return;

    setIsBulkPending(true);
    setBulkMessage(null);
    setBulkError(null);

    const result = await bulkUpdateProductFeaturedAction({
      productIds: selectedProductIds,
      isFeatured,
    });

    if (result.status === "success") {
      setBulkMessage(result.message);
      setSelectedProductIds([]);
    } else {
      setBulkError(result.message);
    }

    setIsBulkPending(false);
  }

  async function handleBulkArchive(): Promise<void> {
    if (selectedProductIds.length === 0 || isBulkPending) return;

    setIsBulkPending(true);
    setBulkMessage(null);
    setBulkError(null);

    const result = await bulkArchiveProductsAction({
      productIds: selectedProductIds,
    });

    if (result.status === "success") {
      setBulkMessage(result.message);
      setSelectedProductIds([]);
    } else {
      setBulkError(result.message);
    }

    setIsBulkPending(false);
  }

  async function handleBulkRestore(): Promise<void> {
    if (selectedProductIds.length === 0 || isBulkPending) return;

    setIsBulkPending(true);
    setBulkMessage(null);
    setBulkError(null);

    const result = await bulkRestoreProductsAction({
      productIds: selectedProductIds,
    });

    if (result.status === "success") {
      setBulkMessage(result.message);
      setSelectedProductIds([]);
    } else {
      setBulkError(result.message);
    }

    setIsBulkPending(false);
  }

  async function handleBulkPermanentDelete(): Promise<void> {
    if (selectedProductIds.length === 0 || isBulkPending) return;

    setIsBulkPending(true);
    setBulkMessage(null);
    setBulkError(null);

    const result = await bulkDeleteProductsPermanentlyAction({
      productIds: selectedProductIds,
    });

    if (result.status === "success") {
      setBulkMessage(result.message);
      setSelectedProductIds([]);
    } else {
      setBulkError(result.message);
    }

    setIsBulkPending(false);
  }

  // ── Single-item action handlers ───────────────────────────────────────────

  async function handleArchiveOne(productSlug: string): Promise<void> {
    const result = await archiveProductBySlugAction(productSlug);

    if (result.status === "success") {
      setBulkMessage(result.message);
      setBulkError(null);
    } else {
      setBulkError(result.message);
      setBulkMessage(null);
    }
  }

  async function handleRestoreOne(productSlug: string): Promise<void> {
    const result = await restoreProductBySlugAction(productSlug);

    if (result.status === "success") {
      setBulkMessage(result.message);
      setBulkError(null);
    } else {
      setBulkError(result.message);
      setBulkMessage(null);
    }
  }

  async function handlePermanentDeleteOne(productSlug: string): Promise<void> {
    const result = await deleteProductPermanentlyBySlugAction({
      productSlug,
    });

    if (result.status === "success") {
      setBulkMessage(result.message);
      setBulkError(null);
    } else {
      setBulkError(result.message);
      setBulkMessage(null);
    }
  }

  return {
    selectedProductIds,
    selectedCount,
    areAllCurrentPageSelected,
    bulkMessage,
    bulkError,
    isBulkPending,
    toggleProductSelection,
    toggleSelectAllCurrentPage,
    toggleSelectAllMobileVisible,
    clearSelection,
    handleBulkStatusChange,
    handleBulkFeaturedChange,
    handleBulkArchive,
    handleBulkRestore,
    handleBulkPermanentDelete,
    handleArchiveOne,
    handleRestoreOne,
    handlePermanentDeleteOne,
  };
}
