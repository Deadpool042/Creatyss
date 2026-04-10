"use client";

import type { JSX } from "react";

import { AdminDataTablePagination } from "@/components/admin/tables/admin-data-table-pagination";
import { AdminDataTableShell } from "@/components/admin/tables/admin-data-table-shell";
import { useAdminProductFeed } from "@/features/admin/products/hooks";
import { useProductTableFilters } from "@/features/admin/products/list/hooks/use-product-table-filters";
import type { AdminProductFeedItem } from "@/features/admin/products/list/types/admin-product-feed.types";
import type {
  ProductFilterCategoryOption,
  ProductTableItem,
} from "@/features/admin/products/list/types/product-table.types";
import { ProductTableDesktop } from "./product-table-desktop";
import { ProductTableMobile } from "./product-table-mobile";
import { ProductTableToolbar } from "./product-table-toolbar";

type ProductTableProps = {
  products: ProductTableItem[];
  categoryOptions: ProductFilterCategoryOption[];
  initialMobileFeed: {
    items: AdminProductFeedItem[];
    nextCursor: {
      updatedAt: string;
      id: string;
    } | null;
    hasMore: boolean;
  };
};

export function ProductTable({
  products,
  categoryOptions,
  initialMobileFeed,
}: ProductTableProps): JSX.Element {
  const state = useProductTableFilters({
    products,
    categoryOptions,
  });

  const {
    items: mobileItems,
    hasMore: mobileHasMore,
    isLoading: mobileIsLoading,
    error: mobileError,
    loadMore: loadMoreMobileFeed,
  } = useAdminProductFeed({
    initialItems: initialMobileFeed.items,
    initialNextCursor: initialMobileFeed.nextCursor,
    initialHasMore: initialMobileFeed.hasMore,
    search: state.search,
    limit: 12,
  });

  return (
    <AdminDataTableShell
      toolbar={<ProductTableToolbar categoryOptions={categoryOptions} state={state} />}
      mobileToolbar={<ProductTableToolbar categoryOptions={categoryOptions} state={state} />}
      desktop={<ProductTableDesktop products={state.paginated} />}
      mobile={
        <ProductTableMobile
          products={mobileItems}
          hasMore={mobileHasMore}
          isLoading={mobileIsLoading}
          error={mobileError}
          onLoadMore={loadMoreMobileFeed}
        />
      }
      pagination={
        <div className="hidden lg:block [@media(max-height:480px)]:hidden">
          <AdminDataTablePagination
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            onPrevious={state.goPrevious}
            onNext={state.goNext}
            previousDisabled={state.currentPage === 1}
            nextDisabled={state.currentPage === state.totalPages}
          />
        </div>
      }
    />
  );
}
