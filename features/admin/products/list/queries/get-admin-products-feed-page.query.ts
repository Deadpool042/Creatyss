import type { GetAdminProductsFeedPageInput, GetAdminProductsFeedPageResult } from "../types";
import { listAdminProducts } from "./list-admin-products.query";

export async function getAdminProductsFeedPage(
  input: GetAdminProductsFeedPageInput
): Promise<GetAdminProductsFeedPageResult> {
  const products = await listAdminProducts();

  const filtered = products.filter((product) => {
    if (input.search && !product.name.toLowerCase().includes(input.search.toLowerCase())) {
      return false;
    }

    if (input.status.length > 0 && !input.status.includes(product.status)) {
      return false;
    }

    if (input.featured === "featured" && !product.isFeatured) {
      return false;
    }

    if (input.featured === "standard" && product.isFeatured) {
      return false;
    }

    return true;
  });

  const items = filtered.slice(0, input.limit);
  const lastItem = items.at(-1) ?? null;

  return {
    items,
    nextCursor: lastItem
      ? {
          updatedAt: lastItem.updatedAt,
          id: lastItem.id,
        }
      : null,
    hasMore: filtered.length > input.limit,
  };
}
