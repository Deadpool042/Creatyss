import type { AdminProductFeedItem } from "@/features/admin/products/list/types";

export type AdminProductListItem = AdminProductFeedItem;

export function mapProductListItem(item: AdminProductFeedItem): AdminProductListItem {
  return item;
}
