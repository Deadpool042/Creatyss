"use client";

import type { JSX } from "react";

import { Button } from "@/components/ui/button";

import type { AdminProductFeedItem } from "@/features/admin/products/list/types/admin-product-feed.types";
import { ProductFeedSentinel } from "./product-feed-sentinel";
import { ProductCompactCard } from "./product-compact-card";
import { ProductCollectionCard } from "./product-collection-card";
import { ProductMobileCard } from "./product-mobile-card";
import { mapAdminProductFeedItemToTableItem } from "@/features/admin/products/list/mappers/shared";

type ProductMobileFeedProps = {
  products: AdminProductFeedItem[];
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  onLoadMore: () => Promise<void>;
};

export function ProductMobileFeed({
  products,
  hasMore,
  isLoading,
  error,
  onLoadMore,
}: ProductMobileFeedProps): JSX.Element {
  return (
    <div className="min-h-0">
      <div
        className={[
          "grid grid-cols-1 gap-3 pb-4 pt-1",
          "md:grid-cols-2",
          "[@media(max-height:480px)]:grid-cols-1",
          "[@media(max-height:480px)]:gap-2",
        ].join(" ")}
      >
        {products.map((product) => {
          const tableItem = mapAdminProductFeedItemToTableItem(product);

          return (
            <div key={product.id} className="min-w-0">
              <div className="block md:hidden [@media(max-height:480px)]:hidden">
                <ProductMobileCard product={tableItem} />
              </div>

              <div className="hidden md:block [@media(max-height:480px)]:hidden">
                <ProductCollectionCard product={tableItem} />
              </div>

              <div className="hidden [@media(max-height:480px)]:block">
                <ProductCompactCard product={tableItem} />
              </div>
            </div>
          );
        })}

        {hasMore ? (
          <>
            <div className="md:col-span-2 [@media(max-height:480px)]:col-span-1">
              <ProductFeedSentinel disabled={isLoading} onIntersect={onLoadMore} />
            </div>

            <div className="flex justify-center pt-1 md:col-span-2 [@media(max-height:480px)]:col-span-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void onLoadMore();
                }}
                disabled={isLoading}
              >
                {isLoading ? "Chargement..." : "Charger plus"}
              </Button>
            </div>
          </>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive md:col-span-2 [@media(max-height:480px)]:col-span-1">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
