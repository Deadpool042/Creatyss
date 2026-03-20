import { prisma } from "@/db/prisma-client";
import {
  mapCatalogFilterCategory,
  mapBlogPostSummary,
} from "./catalog.mappers";
import {
  loadRepresentativeImagesByCategoryIds,
} from "./helpers/category-representative-image";
import {
  loadPrimaryProductImagesByProductIds,
} from "./helpers/primary-image";
import { mapPublishedProductSummaryRecord } from "./helpers/product-summary";
import {
  getPublishedBlogPostRowBySlug,
  listPublishedBlogPostRows,
} from "./queries/blog.queries";
import {
  getPublishedHomepageRow as readPublishedHomepageRow,
  listHomepageFeaturedBlogPostRows as readHomepageFeaturedBlogPostRows,
  listHomepageFeaturedCategoryRecords as readHomepageFeaturedCategoryRecords,
  listHomepageFeaturedProductRows as readHomepageFeaturedProductRows,
  type FeaturedCategoryRecord,
} from "./queries/homepage.queries";
import {
  listRecentPublishedProductRows,
} from "./queries/recent-products.queries";
import {
  listPublishedProductRows,
} from "./queries/catalog-listing.queries";
import {
  getPublishedProductDetailBySlug,
} from "./queries/product-detail.queries";

import type {
  DbId,
  FeaturedCategory,
  CatalogFilterCategory,
  PublishedProductListFilters,
  PublishedProductSummary,
  PublishedCatalogProductSummary,
  PublishedProductDetail,
  PublishedBlogPostSummary,
  PublishedBlogPostDetail,
  PublishedHomepageContent,
} from "./catalog.types";

export type {
  DbId,
  MoneyAmount,
  FeaturedCategory,
  CatalogFilterCategory,
  PublishedProductListFilters,
  PublishedProductImage,
  PublishedProductSummary,
  PublishedCatalogProductSummary,
  PublishedProductVariant,
  PublishedProductDetail,
  PublishedBlogPostSummary,
  PublishedBlogPostDetail,
  PublishedHomepageContent,
} from "./catalog.types";

function toDbId(id: bigint): DbId {
  return id.toString();
}

function mapFeaturedCategoryRecord(
  category: FeaturedCategoryRecord,
  representativeImage: FeaturedCategory["representativeImage"]
): FeaturedCategory {
  return {
    id: toDbId(category.id),
    name: category.name,
    slug: category.slug,
    description: category.description,
    representativeImage,
    createdAt: category.created_at.toISOString(),
    updatedAt: category.updated_at.toISOString(),
  };
}

// --- Homepage reads ---

async function getPublishedHomepageRow() {
  return readPublishedHomepageRow();
}

async function listHomepageFeaturedCategories(
  homepageContentId: string
): Promise<FeaturedCategory[]> {
  const categories = await readHomepageFeaturedCategoryRecords(homepageContentId);
  const representativeImagesByCategoryId = await loadRepresentativeImagesByCategoryIds(
    categories.map((category) => category.id)
  );

  return categories.map((category) =>
    mapFeaturedCategoryRecord(
      category,
      representativeImagesByCategoryId.get(toDbId(category.id)) ?? null
    )
  );
}

async function listHomepageFeaturedProducts(
  homepageContentId: string
): Promise<PublishedProductSummary[]> {
  const products = await readHomepageFeaturedProductRows(homepageContentId);
  const primaryImagesByProductId = await loadPrimaryProductImagesByProductIds(
    products.map((product) => product.id)
  );

  return products.map((product) =>
    mapPublishedProductSummaryRecord(
      product,
      primaryImagesByProductId.get(toDbId(product.id)) ?? null
    )
  );
}

async function listHomepageFeaturedBlogPosts(
  homepageContentId: string
): Promise<PublishedBlogPostSummary[]> {
  const rows = await readHomepageFeaturedBlogPostRows(homepageContentId);
  return rows.map((row) => mapBlogPostSummary(row.blog_posts));
}

export async function getPublishedHomepageContent(): Promise<PublishedHomepageContent | null> {
  const homepageRow = await getPublishedHomepageRow();

  if (homepageRow === null) {
    return null;
  }

  const homepageId = homepageRow.id.toString();

  const [featuredProducts, featuredCategories, featuredBlogPosts] = await Promise.all([
    listHomepageFeaturedProducts(homepageId),
    listHomepageFeaturedCategories(homepageId),
    listHomepageFeaturedBlogPosts(homepageId),
  ]);

  return {
    id: homepageId,
    heroTitle: homepageRow.hero_title,
    heroText: homepageRow.hero_text,
    heroImagePath: homepageRow.hero_image_path,
    editorialTitle: homepageRow.editorial_title,
    editorialText: homepageRow.editorial_text,
    createdAt: homepageRow.created_at.toISOString(),
    updatedAt: homepageRow.updated_at.toISOString(),
    featuredProducts,
    featuredCategories,
    featuredBlogPosts,
  };
}

export async function listPublishedFeaturedCategories(): Promise<FeaturedCategory[]> {
  const homepageRow = await getPublishedHomepageRow();

  if (homepageRow === null) {
    return [];
  }

  return listHomepageFeaturedCategories(homepageRow.id.toString());
}

// --- Catalog reads ---

export async function listCatalogFilterCategories(): Promise<CatalogFilterCategory[]> {
  const rows = await prisma.categories.findMany({
    where: {
      product_categories: {
        some: { products: { status: "published" } },
      },
    },
    select: { id: true, name: true, slug: true },
    orderBy: [{ name: "asc" }, { id: "asc" }],
  });

  return rows.map(mapCatalogFilterCategory);
}

export async function listPublishedProducts(
  filters: PublishedProductListFilters
): Promise<PublishedCatalogProductSummary[]> {
  return listPublishedProductRows(filters);
}

// --- Product detail reads ---

export async function getPublishedProductBySlug(
  slug: string
): Promise<PublishedProductDetail | null> {
  return getPublishedProductDetailBySlug(slug);
}

export async function listRecentPublishedProducts(
  limit: number
): Promise<PublishedProductSummary[]> {
  const products = await listRecentPublishedProductRows(limit);
  const primaryImagesByProductId = await loadPrimaryProductImagesByProductIds(
    products.map((product) => product.id)
  );

  return products.map((product) =>
    mapPublishedProductSummaryRecord(
      product,
      primaryImagesByProductId.get(toDbId(product.id)) ?? null
    )
  );
}

// --- Blog reads ---

export async function listPublishedBlogPosts(): Promise<PublishedBlogPostSummary[]> {
  const rows = await listPublishedBlogPostRows();

  return rows.map(mapBlogPostSummary);
}

export async function getPublishedBlogPostBySlug(
  slug: string
): Promise<PublishedBlogPostDetail | null> {
  const row = await getPublishedBlogPostRowBySlug(slug);

  if (row === null) {
    return null;
  }

  return {
    ...mapBlogPostSummary(row),
    content: row.content,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}
