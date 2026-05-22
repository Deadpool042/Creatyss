import { CategoryStatus } from "@/prisma-generated/client";

import type {
  AdminCategoryCardItem,
  AdminCategoryStatus,
} from "@/features/admin/categories/types";

type CategoryListItemSource = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
  status: CategoryStatus;
  sortOrder: number;
  createdAt: Date;
  parent: { name: string } | null;
  primaryImage: {
    publicUrl: string | null;
    altText: string | null;
  } | null;
  _count: {
    productLinks: number;
    children: number;
  };
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
    parentName: category.parent?.name ?? null,
    primaryImageUrl: category.primaryImage?.publicUrl ?? null,
    primaryImageAlt: category.primaryImage?.altText ?? null,
    productCount: category._count.productLinks,
    childrenCount: category._count.children,
    sortOrder: category.sortOrder,
    createdAt: category.createdAt,
  };
}
