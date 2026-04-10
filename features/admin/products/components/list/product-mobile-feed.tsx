"use client";

import type { JSX } from "react";

import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { Button } from "@/components/ui/button";
import { mapAdminProductFeedItemToTableItem } from "@/features/admin/products/list/mappers/shared";
import type { AdminProductFeedItem } from "@/features/admin/products/list/types/admin-product-feed.types";
import {
  PRODUCT_CARD_COLLECTION_ONLY_CLASS_NAME,
  PRODUCT_CARD_FULL_WIDTH_CLASS_NAME,
  PRODUCT_CARD_MOBILE_ONLY_CLASS_NAME,
  PRODUCT_CARD_TWO_COLUMN_CLASS_NAME,
} from "./mobile/product-card-layout";
import { ProductCollectionCard } from "./product-collection-card";
import { ProductFeedSentinel } from "./product-feed-sentinel";
import { ProductMobileCard } from "./product-mobile-card";

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
        className={["grid grid-cols-1 gap-3 pb-4 pt-1", PRODUCT_CARD_TWO_COLUMN_CLASS_NAME].join(
          " "
        )}
      >
        {products.map((product) => {
          const tableItem = mapAdminProductFeedItemToTableItem(product);

          return (
            <div key={product.id} className="min-w-0 h-full">
              <div className={["h-full", PRODUCT_CARD_MOBILE_ONLY_CLASS_NAME].join(" ")}>
                <ProductMobileCard product={tableItem} />
              </div>

              <div className={["h-full", PRODUCT_CARD_COLLECTION_ONLY_CLASS_NAME].join(" ")}>
                <ProductCollectionCard product={tableItem} />
              </div>
            </div>
          );
        })}

        {hasMore ? (
          <>
            <div className={PRODUCT_CARD_FULL_WIDTH_CLASS_NAME}>
              <ProductFeedSentinel disabled={isLoading} onIntersect={onLoadMore} />
            </div>

            <div
              className={["flex justify-center pt-1", PRODUCT_CARD_FULL_WIDTH_CLASS_NAME].join(" ")}
            >
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
          <div className={PRODUCT_CARD_FULL_WIDTH_CLASS_NAME}>
            <AdminFormMessage tone="error" message={error} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
