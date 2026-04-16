import type { AdminProductFeedItem, ProductTableItem } from "../../types";
import { mapAdminProductFeedItemToTableItem } from "../shared/map-admin-product-feed-item-to-table-item";

export function mapProductTableItem(item: AdminProductFeedItem): ProductTableItem {
  return mapAdminProductFeedItemToTableItem(item);
}
