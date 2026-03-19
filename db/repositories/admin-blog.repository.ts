import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";

// --- Internal types ---

type AdminBlogPostStatus = "draft" | "published";

// Structural type aligned with what Prisma returns for blog_posts (without relations)
type PrismaBlogPostData = {
  id: bigint;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  cover_image_path: string | null;
  status: string;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

type CreateAdminBlogPostInput = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  coverImagePath: string | null;
  status: AdminBlogPostStatus;
};

type UpdateAdminBlogPostInput = CreateAdminBlogPostInput & {
  id: string;
};

type RepositoryErrorCode = "slug_taken" | "blog_post_referenced";

// --- Public types ---

export type AdminBlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImagePath: string | null;
  status: AdminBlogPostStatus;
  publishedAt: string | null;
  hasContent: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminBlogPostDetail = AdminBlogPostSummary & {
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export class AdminBlogRepositoryError extends Error {
  readonly code: RepositoryErrorCode;

  constructor(code: RepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

// --- Internal helpers ---

function isValidBlogPostId(id: string): boolean {
  return /^[0-9]+$/.test(id);
}

function mapPrismaBlogPostToSummary(row: PrismaBlogPostData): AdminBlogPostSummary {
  return {
    id: row.id.toString(),
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    coverImagePath: row.cover_image_path,
    status: row.status as AdminBlogPostStatus,
    publishedAt: row.published_at !== null ? row.published_at.toISOString() : null,
    // has_content is not a stored column — computed here to mirror the original SQL expression
    hasContent: row.content !== null && row.content.trim() !== "",
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function mapPrismaBlogPostToDetail(row: PrismaBlogPostData): AdminBlogPostDetail {
  return {
    ...mapPrismaBlogPostToSummary(row),
    content: row.content,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}

// Absorbs known Prisma errors and maps them to public domain errors.
// P2002: unique constraint violation — blog_posts has only one unique constraint (slug)
// P2003: foreign key constraint violation — post still referenced
function mapPrismaRepositoryError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new AdminBlogRepositoryError("slug_taken", "Blog post slug already exists.");
    }

    if (error.code === "P2003") {
      throw new AdminBlogRepositoryError(
        "blog_post_referenced",
        "Blog post is still referenced by other records."
      );
    }
  }

  throw error;
}

// --- Public functions ---

export async function listAdminBlogPosts(): Promise<AdminBlogPostSummary[]> {
  const rows = await prisma.blog_posts.findMany({
    orderBy: [{ updated_at: "desc" }, { id: "desc" }],
  });

  return rows.map(mapPrismaBlogPostToSummary);
}

export async function findAdminBlogPostById(id: string): Promise<AdminBlogPostDetail | null> {
  if (!isValidBlogPostId(id)) {
    return null;
  }

  const row = await prisma.blog_posts.findUnique({
    where: { id: BigInt(id) },
  });

  return row !== null ? mapPrismaBlogPostToDetail(row) : null;
}

export async function createAdminBlogPost(
  input: CreateAdminBlogPostInput
): Promise<AdminBlogPostDetail> {
  try {
    const row = await prisma.blog_posts.create({
      data: {
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        seo_title: input.seoTitle,
        seo_description: input.seoDescription,
        cover_image_path: input.coverImagePath,
        status: input.status,
        published_at: input.status === "published" ? new Date() : null,
      },
    });

    return mapPrismaBlogPostToDetail(row);
  } catch (error) {
    mapPrismaRepositoryError(error);
  }
}

export async function updateAdminBlogPost(
  input: UpdateAdminBlogPostInput
): Promise<AdminBlogPostDetail | null> {
  if (!isValidBlogPostId(input.id)) {
    return null;
  }

  try {
    // Fetch current published_at to preserve the original publication date
    // (mirrors COALESCE(published_at, now()) semantics from the original SQL)
    const existing = await prisma.blog_posts.findUnique({
      where: { id: BigInt(input.id) },
      select: { published_at: true },
    });

    if (existing === null) {
      return null;
    }

    const publishedAt =
      input.status === "published" ? (existing.published_at ?? new Date()) : null;

    const row = await prisma.blog_posts.update({
      where: { id: BigInt(input.id) },
      data: {
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        seo_title: input.seoTitle,
        seo_description: input.seoDescription,
        cover_image_path: input.coverImagePath,
        status: input.status,
        published_at: publishedAt,
      },
    });

    return mapPrismaBlogPostToDetail(row);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return null;
    }

    mapPrismaRepositoryError(error);
  }
}

export async function toggleAdminBlogPostStatus(id: string): Promise<"draft" | "published" | null> {
  if (!isValidBlogPostId(id)) {
    return null;
  }

  // Atomic toggle via $queryRaw — not expressible via Prisma ORM (row self-reference in SET clause)
  const rows = await prisma.$queryRaw<{ status: "draft" | "published" }[]>(Prisma.sql`
    UPDATE blog_posts
    SET
      status       = CASE WHEN status = 'published' THEN 'draft' ELSE 'published' END,
      published_at = CASE
        WHEN status = 'published' THEN NULL
        ELSE COALESCE(published_at, NOW())
      END,
      updated_at   = NOW()
    WHERE id = ${BigInt(id)}
    RETURNING status
  `);

  return rows[0]?.status ?? null;
}

export async function deleteAdminBlogPost(id: string): Promise<boolean> {
  if (!isValidBlogPostId(id)) {
    return false;
  }

  try {
    await prisma.blog_posts.delete({ where: { id: BigInt(id) } });

    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return false;
    }

    mapPrismaRepositoryError(error);
  }
}
