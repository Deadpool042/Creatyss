import type { SortableColumnConfig } from "@/components/admin/tables";
import type { CategorySortOption } from "@/features/admin/categories/list";

import { CATEGORY_TABLE_COPY } from "./category-list.config";

export const CATEGORY_SORTABLE_COLUMNS = {
  category: {
    label: CATEGORY_TABLE_COPY.columns.category,
    asc: "name-asc",
    desc: "name-desc",
    className: "min-w-56",
  },
  updatedAt: {
    label: CATEGORY_TABLE_COPY.columns.updatedAt,
    asc: "updated-asc",
    desc: "updated-desc",
    className: "hidden xl:table-cell w-28",
  },
} satisfies Record<string, SortableColumnConfig<CategorySortOption>>;
