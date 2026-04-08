import { mapProductToListItemDTO } from "@/features/products/mappers";
import { findProductsPage } from "@/features/products/repository";
import type {
  ProductFeedPageResult,
  ProductFeedQuery,
  ProductListItemDTO,
} from "@/features/products/types";

export async function getProductsFeed(
  input: ProductFeedQuery
): Promise<ProductFeedPageResult<ProductListItemDTO>> {
  const page = await findProductsPage(input);

  return {
    items: page.items.map(mapProductToListItemDTO),
    nextCursor: page.nextCursor,
    hasMore: page.hasMore,
  };
}
