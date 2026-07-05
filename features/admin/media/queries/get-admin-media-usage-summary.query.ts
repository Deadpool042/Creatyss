import { db } from "@/core/db";
import type { AdminMediaUsageSummary } from "@/features/admin/media/types/admin-media-list-item.types";

export async function getAdminMediaUsageSummary(assetId: string): Promise<AdminMediaUsageSummary> {
  const [
    productsCount,
    productVariantsCount,
    bundlesCount,
    categoriesPrimaryCount,
    categoriesCoverCount,
    pagesPrimaryCount,
    pagesCoverCount,
    pageSectionsPrimaryCount,
    pageSectionsCoverCount,
    pageBlocksPrimaryCount,
    pageBlocksSecondaryCount,
    blogPostsPrimaryCount,
    blogPostsCoverCount,
    blogCategoriesPrimaryCount,
    blogCategoriesCoverCount,
    homepageSectionsPrimaryCount,
    homepageSectionsSecondaryCount,
    publicEventsPrimaryCount,
    publicEventsCoverCount,
    storeLogosCount,
    seoOpenGraphCount,
    seoTwitterCount,
  ] = await Promise.all([
    db.product.count({ where: { primaryImageId: assetId, archivedAt: null } }),
    db.productVariant.count({ where: { primaryImageId: assetId, archivedAt: null } }),
    db.bundle.count({ where: { primaryImageId: assetId, archivedAt: null } }),
    db.category.count({ where: { primaryImageId: assetId, archivedAt: null } }),
    db.category.count({ where: { coverImageId: assetId, archivedAt: null } }),
    db.page.count({ where: { primaryImageId: assetId, archivedAt: null } }),
    db.page.count({ where: { coverImageId: assetId, archivedAt: null } }),
    db.pageSection.count({ where: { primaryImageId: assetId, archivedAt: null } }),
    db.pageSection.count({ where: { coverImageId: assetId, archivedAt: null } }),
    db.pageBlock.count({ where: { primaryImageId: assetId, archivedAt: null } }),
    db.pageBlock.count({ where: { secondaryImageId: assetId, archivedAt: null } }),
    db.blogPost.count({ where: { primaryImageId: assetId, archivedAt: null } }),
    db.blogPost.count({ where: { coverImageId: assetId, archivedAt: null } }),
    db.blogCategory.count({ where: { primaryImageId: assetId, archivedAt: null } }),
    db.blogCategory.count({ where: { coverImageId: assetId, archivedAt: null } }),
    db.homepageSection.count({ where: { primaryImageId: assetId, archivedAt: null } }),
    db.homepageSection.count({ where: { secondaryImageId: assetId, archivedAt: null } }),
    db.publicEvent.count({ where: { primaryImageId: assetId, archivedAt: null } }),
    db.publicEvent.count({ where: { coverImageId: assetId, archivedAt: null } }),
    db.store.count({ where: { logoImageId: assetId, archivedAt: null } }),
    db.seoMetadata.count({ where: { openGraphImageId: assetId, archivedAt: null } }),
    db.seoMetadata.count({ where: { twitterImageId: assetId, archivedAt: null } }),
  ]);

  return {
    productsCount: productsCount + productVariantsCount + bundlesCount,
    categoriesCount: categoriesPrimaryCount + categoriesCoverCount,
    contentCount:
      pagesPrimaryCount +
      pagesCoverCount +
      pageSectionsPrimaryCount +
      pageSectionsCoverCount +
      pageBlocksPrimaryCount +
      pageBlocksSecondaryCount +
      blogPostsPrimaryCount +
      blogPostsCoverCount +
      blogCategoriesPrimaryCount +
      blogCategoriesCoverCount +
      homepageSectionsPrimaryCount +
      homepageSectionsSecondaryCount +
      publicEventsPrimaryCount +
      publicEventsCoverCount,
    brandingCount: storeLogosCount,
    seoCount: seoOpenGraphCount + seoTwitterCount,
  };
}
