"use client";

import type { JSX } from "react";

import { AdminDataTableEmptyState } from "@/components/admin/tables/admin-data-table-empty-state";
import { ProductCompactCard } from "./product-compact-card";
import { ProductCollectionCard } from "./product-collection-card";
import { ProductMobileCard } from "./product-mobile-card";
import { ProductMobileFeed } from "./product-mobile-feed";
import type { ProductTableItem } from "@/features/admin/products/list/types/product-table.types";
import type { AdminProductFeedItem } from "@/features/admin/products/list/types/admin-product-feed.types";

type ProductTableMobileProps =
  | {
      mode?: "paged";
      products: ProductTableItem[];
    }
  | {
      mode: "infinite";
      products: AdminProductFeedItem[];
      hasMore: boolean;
      isLoading: boolean;
      error: string | null;
      onLoadMore: () => Promise<void>;
    };

export function ProductTableMobile(props: ProductTableMobileProps): JSX.Element {
  if (props.mode === "infinite") {
    if (props.products.length === 0) {
      return <AdminDataTableEmptyState message="Aucun produit trouvé." mobile />;
    }

    return (
      <ProductMobileFeed
        products={props.products}
        hasMore={props.hasMore}
        isLoading={props.isLoading}
        error={props.error}
        onLoadMore={props.onLoadMore}
      />
    );
  }

  return (
    <div className="min-h-0">
      <div
        className={[
          "grid grid-cols-1 gap-3 pb-2 pt-1.5",
          "md:grid-cols-2",
          "[@media(max-height:480px)]:grid-cols-1",
          "[@media(max-height:480px)]:gap-2",
        ].join(" ")}
      >
        {props.products.length === 0 ? (
          <div className="md:col-span-2 [@media(max-height:480px)]:col-span-1">
            <AdminDataTableEmptyState message="Aucun produit trouvé." mobile />
          </div>
        ) : (
          props.products.map((product) => (
            <div key={product.id} className="min-w-0">
              <div className="block md:hidden [@media(max-height:480px)]:hidden">
                <ProductMobileCard product={product} />
              </div>

              <div className="hidden md:block [@media(max-height:480px)]:hidden">
                <ProductCollectionCard product={product} />
              </div>

              <div className="hidden [@media(max-height:480px)]:block">
                <ProductCompactCard product={product} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
