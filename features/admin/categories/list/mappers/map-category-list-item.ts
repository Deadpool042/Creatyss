import { CategoryStatus } from "@/prisma-generated/client";

import type {
  AdminCategoryCardItem,
  AdminCategoryStatus,
} from "@/features/admin/categories/list/types/admin-category-card-item.types";

type CategoryListItemSource = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
  status: CategoryStatus;
  primaryImage: {
    publicUrl: string | null;
    altText: string | null;
  } | null;
};

function mapCategoryStatus(status: CategoryStatus): AdminCategoryStatus {
  switch (status) {
    case CategoryStatus.ACTIVE:
      return "active";
    case CategoryStatus.INACTIVE:
      return "inactive";
    case CategoryStatus.ARCHIVED:
      return "archived";
    case CategoryStatus.DRAFT:
    default:
      return "draft";
  }
}

export function mapCategoryListItem(category: CategoryListItemSource): AdminCategoryCardItem {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    isFeatured: category.isFeatured,
    status: mapCategoryStatus(category.status),
    primaryImageUrl: category.primaryImage?.publicUrl ?? null,
    primaryImageAlt: category.primaryImage?.altText ?? null,
  };
}
