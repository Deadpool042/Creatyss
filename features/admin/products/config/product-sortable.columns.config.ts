import type { SortableColumnConfig } from "@/components/admin/tables";

import { PRODUCT_TABLE_COPY } from "./product-list.config";

export const PRODUCT_SORTABLE_COLUMNS = {
  product: {
    label: PRODUCT_TABLE_COPY.columns.product,
    asc: "name-asc",
    desc: "name-desc",
    className: "min-w-48",
  },
  updatedAt: {
    label: PRODUCT_TABLE_COPY.columns.updatedAt,
    asc: "updated-asc",
    desc: "updated-desc",
    className: "w-28",
  },
} satisfies Record<string, SortableColumnConfig<string>>;
