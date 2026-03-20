import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  ensureCategoriesExistInTx,
  ensureHomepageExistsInTx,
  ensurePublishedBlogPostsExistInTx,
  ensurePublishedProductsExistInTx,
} from "./admin-homepage/helpers/transaction-guards";
import {
  replaceHomepageFeaturedBlogPostsInTx,
  replaceHomepageFeaturedCategoriesInTx,
  replaceHomepageFeaturedProductsInTx,
} from "./admin-homepage/helpers/transaction-writes";
import { loadHomepageFeaturedSelections } from "./admin-homepage/queries/featured-selections.queries";
import { loadHomepageOptions } from "./admin-homepage/queries/homepage-options.queries";
import {
  AdminHomepageRepositoryError,
  type AdminHomepageDetail,
  type AdminHomepageEditorData,
  type AdminHomepageFeaturedBlogPostSelection,
  type AdminHomepageFeaturedCategorySelection,
  type AdminHomepageFeaturedProductSelection,
  type AdminHomepageStatus,
  type UpdateAdminHomepageInput,
} from "./admin-homepage.types";

// --- Internal types ---

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

// --- Internal utilities ---

function isValidNumericId(value: string): boolean {
  return /^[0-9]+$/.test(value);
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
    status: row.status as AdminHomepageStatus,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    featuredProducts,
    featuredCategories,
    featuredBlogPosts,
  };
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
