import { queryFirst, queryRows } from "@/db/client";

// --- Internal types ---

// pg may return Date or string for timestamp columns depending on driver configuration
type TimestampValue = Date | string;

type AdminBlogPostStatus = "draft" | "published";

type AdminBlogPostSummaryRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_path: string | null;
  status: AdminBlogPostStatus;
  published_at: TimestampValue | null;
  has_content: boolean;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type AdminBlogPostRow = AdminBlogPostSummaryRow & {
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

type DeletedBlogPostRow = {
  id: string;
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

type PostgreSqlErrorLike = Error & {
  code: string;
  constraint?: string;
};

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

const PG_UNIQUE_VIOLATION = "23505";
const PG_FOREIGN_KEY_VIOLATION = "23503";
const BLOG_POST_SLUG_CONSTRAINT = "blog_posts_slug_key";

// Full column list for detail queries — shared by find, create (returning), and update (returning)
const BLOG_POST_DETAIL_COLUMNS =
  "id::text as id, title, slug, excerpt, content, seo_title, seo_description, cover_image_path, status, published_at, created_at, updated_at";

function isValidBlogPostId(id: string): boolean {
  return /^[0-9]+$/.test(id);
}

function isPostgreSqlErrorLike(error: unknown): error is PostgreSqlErrorLike {
  return error instanceof Error && typeof (error as { code?: unknown }).code === "string";
}

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function mapAdminBlogPostSummary(row: AdminBlogPostSummaryRow): AdminBlogPostSummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    coverImagePath: row.cover_image_path,
    status: row.status,
    publishedAt: row.published_at === null ? null : toIsoTimestamp(row.published_at),
    hasContent: row.has_content,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapAdminBlogPostDetail(row: AdminBlogPostRow): AdminBlogPostDetail {
  return {
    ...mapAdminBlogPostSummary(row),
    content: row.content,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}

// Builds the ordered parameter array shared by INSERT and UPDATE queries.
// Create: buildBlogPostWriteParams(input)          → $1=title … $8=status
// Update: [input.id, ...buildBlogPostWriteParams(input)] → $1=id, $2=title … $9=status
function buildBlogPostWriteParams(input: CreateAdminBlogPostInput): unknown[] {
  return [
    input.title,
    input.slug,
    input.excerpt,
    input.content,
    input.seoTitle,
    input.seoDescription,
    input.coverImagePath,
    input.status,
  ];
}

function mapRepositoryError(error: unknown): never {
  if (isPostgreSqlErrorLike(error)) {
    if (error.code === PG_UNIQUE_VIOLATION && error.constraint === BLOG_POST_SLUG_CONSTRAINT) {
      throw new AdminBlogRepositoryError("slug_taken", "Blog post slug already exists.");
    }

    if (error.code === PG_FOREIGN_KEY_VIOLATION) {
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
  const rows = await queryRows<AdminBlogPostSummaryRow>(
    `
      select
        id::text as id,
        title,
        slug,
        excerpt,
        cover_image_path,
        status,
        published_at,
        (content IS NOT NULL AND trim(content) != '') as has_content,
        created_at,
        updated_at
      from blog_posts
      order by updated_at desc, id desc
    `
  );

  return rows.map(mapAdminBlogPostSummary);
}

export async function findAdminBlogPostById(id: string): Promise<AdminBlogPostDetail | null> {
  if (!isValidBlogPostId(id)) {
    return null;
  }

  const row = await queryFirst<AdminBlogPostRow>(
    `
      select ${BLOG_POST_DETAIL_COLUMNS}
      from blog_posts
      where id = $1::bigint
      limit 1
    `,
    [id]
  );

  if (row === null) {
    return null;
  }

  return mapAdminBlogPostDetail(row);
}

export async function createAdminBlogPost(
  input: CreateAdminBlogPostInput
): Promise<AdminBlogPostDetail> {
  try {
    const row = await queryFirst<AdminBlogPostRow>(
      `
        insert into blog_posts (
          title,
          slug,
          excerpt,
          content,
          seo_title,
          seo_description,
          cover_image_path,
          status,
          published_at
        )
        values (
          $1, $2, $3, $4, $5, $6, $7, $8,
          case when $8 = 'published' then now() else null end
        )
        returning ${BLOG_POST_DETAIL_COLUMNS}
      `,
      buildBlogPostWriteParams(input)
    );

    if (row === null) {
      throw new Error("Failed to create blog post.");
    }

    return mapAdminBlogPostDetail(row);
  } catch (error) {
    mapRepositoryError(error);
  }
}

export async function updateAdminBlogPost(
  input: UpdateAdminBlogPostInput
): Promise<AdminBlogPostDetail | null> {
  if (!isValidBlogPostId(input.id)) {
    return null;
  }

  try {
    const row = await queryFirst<AdminBlogPostRow>(
      `
        update blog_posts
        set
          title = $2,
          slug = $3,
          excerpt = $4,
          content = $5,
          seo_title = $6,
          seo_description = $7,
          cover_image_path = $8,
          status = $9,
          -- coalesce preserves the original publication date when re-saving a published post
          published_at = case
            when $9 = 'published' then coalesce(published_at, now())
            else null
          end
        where id = $1::bigint
        returning ${BLOG_POST_DETAIL_COLUMNS}
      `,
      [input.id, ...buildBlogPostWriteParams(input)]
    );

    if (row === null) {
      return null;
    }

    return mapAdminBlogPostDetail(row);
  } catch (error) {
    mapRepositoryError(error);
  }
}

export async function toggleAdminBlogPostStatus(id: string): Promise<"draft" | "published" | null> {
  if (!isValidBlogPostId(id)) {
    return null;
  }

  const row = await queryFirst<{ status: "draft" | "published" }>(
    `
      update blog_posts
      set
        status = case when status = 'published' then 'draft' else 'published' end,
        published_at = case
          when status = 'published' then null
          else coalesce(published_at, now())
        end,
        updated_at = now()
      where id = $1::bigint
      returning status
    `,
    [id]
  );

  return row?.status ?? null;
}

export async function deleteAdminBlogPost(id: string): Promise<boolean> {
  if (!isValidBlogPostId(id)) {
    return false;
  }

  try {
    const row = await queryFirst<DeletedBlogPostRow>(
      `
        delete from blog_posts
        where id = $1::bigint
        returning id::text as id
      `,
      [id]
    );

    return row !== null;
  } catch (error) {
    mapRepositoryError(error);
  }
}
