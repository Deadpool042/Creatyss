"use client";

import type { JSX } from "react";

import { AdminDataTableEmptyState } from "@/components/admin/tables/admin-data-table-empty-state";
import type { AdminProductFeedItem } from "@/features/admin/products/list/types/admin-product-feed.types";
import { ProductMobileFeed } from "./product-mobile-feed";

type ProductTableMobileProps = {
  products: AdminProductFeedItem[];
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  onLoadMore: () => Promise<void>;
};

export function ProductTableMobile({
  products,
  hasMore,
  isLoading,
  error,
  onLoadMore,
}: ProductTableMobileProps): JSX.Element {
  if (products.length === 0) {
    return <AdminDataTableEmptyState message="Aucun produit trouvé." mobile />;
  }

  return (
    <ProductMobileFeed
      products={products}
      hasMore={hasMore}
      isLoading={isLoading}
      error={error}
      onLoadMore={onLoadMore}
    />
  );
}
