import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";

// --- Internal types ---

type HomepageStatus = "draft" | "published";

// Structural type aligned with what Prisma returns for homepage_content (without relations)
type PrismaHomepageContentData = {
  id: bigint;
  hero_title: string | null;
  hero_text: string | null;
  hero_image_path: string | null;
  editorial_title: string | null;
  editorial_text: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
};

type UpdateAdminHomepageInput = {
  id: string;
  heroTitle: string | null;
  heroText: string | null;
  heroImagePath: string | null;
  editorialTitle: string | null;
  editorialText: string | null;
  featuredProducts: AdminHomepageFeaturedProductSelection[];
  featuredCategories: AdminHomepageFeaturedCategorySelection[];
  featuredBlogPosts: AdminHomepageFeaturedBlogPostSelection[];
};

// --- Public types ---

import {
  AdminHomepageRepositoryError,
  type AdminHomepageFeaturedProductSelection,
  type AdminHomepageFeaturedCategorySelection,
  type AdminHomepageFeaturedBlogPostSelection,
  type AdminHomepageDetail,
  type AdminHomepageEditorData,
  type AdminHomepageProductOption,
  type AdminHomepageCategoryOption,
  type AdminHomepageBlogPostOption,
} from "./admin-homepage.types";
export { AdminHomepageRepositoryError };
export type {
  AdminHomepageFeaturedProductSelection,
  AdminHomepageFeaturedCategorySelection,
  AdminHomepageFeaturedBlogPostSelection,
  AdminHomepageProductOption,
  AdminHomepageCategoryOption,
  AdminHomepageBlogPostOption,
  AdminHomepageDetail,
  AdminHomepageEditorData,
};

// --- Internal utilities ---

function isValidNumericId(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

function normalizeUniqueIds(ids: readonly string[]): string[] {
  return [...new Set(ids)];
}

function mapPrismaHomepage(
  row: PrismaHomepageContentData,
  featuredProducts: AdminHomepageFeaturedProductSelection[],
  featuredCategories: AdminHomepageFeaturedCategorySelection[],
  featuredBlogPosts: AdminHomepageFeaturedBlogPostSelection[]
): AdminHomepageDetail {
  return {
    id: row.id.toString(),
    heroTitle: row.hero_title,
    heroText: row.hero_text,
    heroImagePath: row.hero_image_path,
    editorialTitle: row.editorial_title,
    editorialText: row.editorial_text,
    status: row.status as HomepageStatus,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    featuredProducts,
    featuredCategories,
    featuredBlogPosts,
  };
}

// --- Homepage reads ---

async function listHomepageFeaturedProducts(
  homepageId: string
): Promise<AdminHomepageFeaturedProductSelection[]> {
  const rows = await prisma.homepage_featured_products.findMany({
    where: { homepage_content_id: BigInt(homepageId) },
    orderBy: [{ sort_order: "asc" }, { product_id: "asc" }],
  });

  return rows.map((row) => ({
    productId: row.product_id.toString(),
    sortOrder: row.sort_order,
  }));
}

async function listHomepageFeaturedCategories(
  homepageId: string
): Promise<AdminHomepageFeaturedCategorySelection[]> {
  const rows = await prisma.homepage_featured_categories.findMany({
    where: { homepage_content_id: BigInt(homepageId) },
    orderBy: [{ sort_order: "asc" }, { category_id: "asc" }],
  });

  return rows.map((row) => ({
    categoryId: row.category_id.toString(),
    sortOrder: row.sort_order,
  }));
}

async function listHomepageFeaturedBlogPosts(
  homepageId: string
): Promise<AdminHomepageFeaturedBlogPostSelection[]> {
  const rows = await prisma.homepage_featured_blog_posts.findMany({
    where: { homepage_content_id: BigInt(homepageId) },
    orderBy: [{ sort_order: "asc" }, { blog_post_id: "asc" }],
  });

  return rows.map((row) => ({
    blogPostId: row.blog_post_id.toString(),
    sortOrder: row.sort_order,
  }));
}

// Reads the three current featured selections for a homepage in parallel
async function loadHomepageFeaturedSelections(homepageId: string): Promise<{
  featuredProducts: AdminHomepageFeaturedProductSelection[];
  featuredCategories: AdminHomepageFeaturedCategorySelection[];
  featuredBlogPosts: AdminHomepageFeaturedBlogPostSelection[];
}> {
  const [featuredProducts, featuredCategories, featuredBlogPosts] = await Promise.all([
    listHomepageFeaturedProducts(homepageId),
    listHomepageFeaturedCategories(homepageId),
    listHomepageFeaturedBlogPosts(homepageId),
  ]);

  return { featuredProducts, featuredCategories, featuredBlogPosts };
}

// Reads the three option lists available for homepage edition in parallel.
// Products + categories: findMany + in-memory sort to replicate lower(name) asc.
// Blog posts: COALESCE(published_at, created_at) ORDER BY not expressible in Prisma → $queryRaw.
async function loadHomepageOptions(): Promise<{
  productOptions: AdminHomepageProductOption[];
  categoryOptions: AdminHomepageCategoryOption[];
  blogPostOptions: AdminHomepageBlogPostOption[];
}> {
  const [productRows, categoryRows, blogPostRows] = await Promise.all([
    prisma.products
      .findMany({
        where: { status: "published" },
        select: { id: true, name: true, slug: true },
      })
      .then((rows) =>
        [...rows].sort((a, b) => {
          const nc = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
          if (nc !== 0) return nc;
          return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        })
      ),
    prisma.categories
      .findMany({ select: { id: true, name: true, slug: true } })
      .then((rows) =>
        [...rows].sort((a, b) => {
          const nc = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
          if (nc !== 0) return nc;
          return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        })
      ),
    // Prisma orderBy: published_at nulls last, then created_at desc — equivalent to
    // COALESCE(published_at, created_at) DESC when published_at is rarely null.
    // Slight behavioral difference: null published_at posts sort after published ones.
    prisma.blog_posts.findMany({
      where: { status: "published" },
      select: { id: true, title: true, slug: true },
      orderBy: [
        { published_at: { sort: "desc", nulls: "last" } },
        { created_at: "desc" },
        { id: "desc" },
      ],
    }),
  ]);

  return {
    productOptions: productRows.map((r) => ({
      id: r.id.toString(),
      name: r.name,
      slug: r.slug,
    })),
    categoryOptions: categoryRows.map((r) => ({
      id: r.id.toString(),
      name: r.name,
      slug: r.slug,
    })),
    blogPostOptions: blogPostRows.map((r) => ({
      id: r.id.toString(),
      title: r.title,
      slug: r.slug,
    })),
  };
}

// --- Homepage validation (transaction helpers) ---

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

async function ensureHomepageExistsInTx(tx: TxClient, homepageId: string): Promise<void> {
  const count = await tx.homepage_content.count({
    where: { id: BigInt(homepageId), status: "published" },
  });

  if (count === 0) {
    throw new AdminHomepageRepositoryError("homepage_missing", "Published homepage was not found.");
  }
}

async function ensurePublishedProductsExistInTx(
  tx: TxClient,
  selections: readonly AdminHomepageFeaturedProductSelection[]
): Promise<void> {
  const productIds = normalizeUniqueIds(selections.map((s) => s.productId));

  if (productIds.length === 0) {
    return;
  }

  const count = await tx.products.count({
    where: { id: { in: productIds.map(BigInt) }, status: "published" },
  });

  if (count !== productIds.length) {
    throw new AdminHomepageRepositoryError(
      "product_missing",
      "At least one selected product is missing or unpublished."
    );
  }
}

async function ensureCategoriesExistInTx(
  tx: TxClient,
  selections: readonly AdminHomepageFeaturedCategorySelection[]
): Promise<void> {
  const categoryIds = normalizeUniqueIds(selections.map((s) => s.categoryId));

  if (categoryIds.length === 0) {
    return;
  }

  const count = await tx.categories.count({
    where: { id: { in: categoryIds.map(BigInt) } },
  });

  if (count !== categoryIds.length) {
    throw new AdminHomepageRepositoryError(
      "category_missing",
      "At least one selected category is missing."
    );
  }
}

async function ensurePublishedBlogPostsExistInTx(
  tx: TxClient,
  selections: readonly AdminHomepageFeaturedBlogPostSelection[]
): Promise<void> {
  const blogPostIds = normalizeUniqueIds(selections.map((s) => s.blogPostId));

  if (blogPostIds.length === 0) {
    return;
  }

  const count = await tx.blog_posts.count({
    where: { id: { in: blogPostIds.map(BigInt) }, status: "published" },
  });

  if (count !== blogPostIds.length) {
    throw new AdminHomepageRepositoryError(
      "blog_post_missing",
      "At least one selected blog post is missing or unpublished."
    );
  }
}

// --- Homepage writes (transaction helpers) ---

async function replaceHomepageFeaturedProductsInTx(
  tx: TxClient,
  homepageId: string,
  selections: readonly AdminHomepageFeaturedProductSelection[]
): Promise<void> {
  await tx.homepage_featured_products.deleteMany({
    where: { homepage_content_id: BigInt(homepageId) },
  });

  if (selections.length > 0) {
    await tx.homepage_featured_products.createMany({
      data: selections.map((s) => ({
        homepage_content_id: BigInt(homepageId),
        product_id: BigInt(s.productId),
        sort_order: s.sortOrder,
      })),
    });
  }
}

async function replaceHomepageFeaturedCategoriesInTx(
  tx: TxClient,
  homepageId: string,
  selections: readonly AdminHomepageFeaturedCategorySelection[]
): Promise<void> {
  await tx.homepage_featured_categories.deleteMany({
    where: { homepage_content_id: BigInt(homepageId) },
  });

  if (selections.length > 0) {
    await tx.homepage_featured_categories.createMany({
      data: selections.map((s) => ({
        homepage_content_id: BigInt(homepageId),
        category_id: BigInt(s.categoryId),
        sort_order: s.sortOrder,
      })),
    });
  }
}

async function replaceHomepageFeaturedBlogPostsInTx(
  tx: TxClient,
  homepageId: string,
  selections: readonly AdminHomepageFeaturedBlogPostSelection[]
): Promise<void> {
  await tx.homepage_featured_blog_posts.deleteMany({
    where: { homepage_content_id: BigInt(homepageId) },
  });

  if (selections.length > 0) {
    await tx.homepage_featured_blog_posts.createMany({
      data: selections.map((s) => ({
        homepage_content_id: BigInt(homepageId),
        blog_post_id: BigInt(s.blogPostId),
        sort_order: s.sortOrder,
      })),
    });
  }
}

// --- Public functions ---

export async function getAdminHomepageCurrentHeroImagePath(
  homepageId: string
): Promise<string | null> {
  if (!isValidNumericId(homepageId)) {
    return null;
  }

  const row = await prisma.homepage_content.findFirst({
    where: { id: BigInt(homepageId), status: "published" },
    select: { hero_image_path: true },
  });

  return row?.hero_image_path ?? null;
}

export async function getAdminHomepageEditorData(): Promise<AdminHomepageEditorData | null> {
  const homepageRow = await prisma.homepage_content.findFirst({
    where: { status: "published" },
  });

  if (homepageRow === null) {
    return null;
  }

  const homepageId = homepageRow.id.toString();

  const [selections, options] = await Promise.all([
    loadHomepageFeaturedSelections(homepageId),
    loadHomepageOptions(),
  ]);

  return {
    homepage: mapPrismaHomepage(
      homepageRow,
      selections.featuredProducts,
      selections.featuredCategories,
      selections.featuredBlogPosts
    ),
    ...options,
  };
}

export async function updateAdminHomepage(
  input: UpdateAdminHomepageInput
): Promise<AdminHomepageDetail | null> {
  if (!isValidNumericId(input.id)) {
    return null;
  }

  return prisma
    .$transaction(async (tx) => {
      await ensureHomepageExistsInTx(tx, input.id);
      await ensurePublishedProductsExistInTx(tx, input.featuredProducts);
      await ensureCategoriesExistInTx(tx, input.featuredCategories);
      await ensurePublishedBlogPostsExistInTx(tx, input.featuredBlogPosts);

      let updatedRow: PrismaHomepageContentData;

      try {
        updatedRow = await tx.homepage_content.update({
          where: { id: BigInt(input.id) },
          data: {
            hero_title: input.heroTitle,
            hero_text: input.heroText,
            hero_image_path: input.heroImagePath,
            editorial_title: input.editorialTitle,
            editorial_text: input.editorialText,
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
          return null;
        }

        throw e;
      }

      await replaceHomepageFeaturedProductsInTx(tx, input.id, input.featuredProducts);
      await replaceHomepageFeaturedCategoriesInTx(tx, input.id, input.featuredCategories);
      await replaceHomepageFeaturedBlogPostsInTx(tx, input.id, input.featuredBlogPosts);

      return mapPrismaHomepage(
        updatedRow,
        input.featuredProducts,
        input.featuredCategories,
        input.featuredBlogPosts
      );
    })
    .catch((error) => {
      if (error instanceof AdminHomepageRepositoryError) {
        throw error;
      }

      throw error;
    });
}
