import { db } from "@/core/db";

import type { CatalogOverviewStats } from "@/features/admin/catalog/types/catalog-overview.types";

export async function getCatalogOverviewStats(): Promise<CatalogOverviewStats> {
  const [
    productsTotal,
    productsActive,
    productsDraft,
    productsArchived,
    categoriesTotal,
    categoriesActive,
    categoriesDraft,
    categoriesArchived,
    mediaTotal,
    mediaArchived,
    productsWithoutCategories,
    productsWithoutImages,
    categoriesWithoutProducts,
  ] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { status: "ACTIVE" } }),
    db.product.count({ where: { status: "DRAFT" } }),
    db.product.count({ where: { status: "ARCHIVED" } }),
    db.category.count(),
    db.category.count({ where: { status: "ACTIVE" } }),
    db.category.count({ where: { status: "DRAFT" } }),
    db.category.count({ where: { status: "ARCHIVED" } }),
    db.mediaAsset.count(),
    db.mediaAsset.count({ where: { status: "ARCHIVED" } }),
    db.product.count({ where: { productCategories: { none: {} } } }),
    db.product.count({ where: { primaryImageId: null } }),
    db.category.count({ where: { productLinks: { none: {} } } }),
  ]);

  return {
    products: {
      total: productsTotal,
      active: productsActive,
      draft: productsDraft,
      archived: productsArchived,
    },
    categories: {
      total: categoriesTotal,
      active: categoriesActive,
      draft: categoriesDraft,
      archived: categoriesArchived,
    },
    media: {
      total: mediaTotal,
      archived: mediaArchived,
    },
    alerts: {
      productsWithoutImages,
      productsWithoutCategories,
      categoriesWithoutProducts,
    },
  };
}
