import { queryFirst, queryRows } from "@/db/client";

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

export type AdminBlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImagePath: string | null;
  status: AdminBlogPostStatus;
  publishedAt: string | null;
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

function isValidBlogPostId(id: string): boolean {
  return /^[0-9]+$/.test(id);
}

function isPostgreSqlErrorLike(error: unknown): error is PostgreSqlErrorLike {
  if (!(error instanceof Error)) {
    return false;
  }

  const candidate = error as Error & {
    code?: unknown;
    constraint?: unknown;
  };

  return typeof candidate.code === "string";
}

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function mapAdminBlogPostSummary(
  row: AdminBlogPostSummaryRow
): AdminBlogPostSummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    coverImagePath: row.cover_image_path,
    status: row.status,
    publishedAt:
      row.published_at === null ? null : toIsoTimestamp(row.published_at),
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

function mapAdminBlogPostDetail(row: AdminBlogPostRow): AdminBlogPostDetail {
  return {
    ...mapAdminBlogPostSummary(row),
    content: row.content,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description
  };
}

function mapRepositoryError(error: unknown): never {
  if (
    isPostgreSqlErrorLike(error) &&
    error.code === "23505" &&
    error.constraint === "blog_posts_slug_key"
  ) {
    throw new AdminBlogRepositoryError(
      "slug_taken",
      "Blog post slug already exists."
    );
  }

  if (isPostgreSqlErrorLike(error) && error.code === "23503") {
    throw new AdminBlogRepositoryError(
      "blog_post_referenced",
      "Blog post is still referenced by other records."
    );
  }

  throw error;
}

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
        created_at,
        updated_at
      from blog_posts
      order by updated_at desc, id desc
    `
  );

  return rows.map(mapAdminBlogPostSummary);
}

export async function findAdminBlogPostById(
  id: string
): Promise<AdminBlogPostDetail | null> {
  if (!isValidBlogPostId(id)) {
    return null;
  }

  const row = await queryFirst<AdminBlogPostRow>(
    `
      select
        id::text as id,
        title,
        slug,
        excerpt,
        content,
        seo_title,
        seo_description,
        cover_image_path,
        status,
        published_at,
        created_at,
        updated_at
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
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          case
            when $8 = 'published' then now()
            else null
          end
        )
        returning
          id::text as id,
          title,
          slug,
          excerpt,
          content,
          seo_title,
          seo_description,
          cover_image_path,
          status,
          published_at,
          created_at,
          updated_at
      `,
      [
        input.title,
        input.slug,
        input.excerpt,
        input.content,
        input.seoTitle,
        input.seoDescription,
        input.coverImagePath,
        input.status
      ]
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
          published_at = case
            when $9 = 'published' then coalesce(published_at, now())
            else null
          end
        where id = $1::bigint
        returning
          id::text as id,
          title,
          slug,
          excerpt,
          content,
          seo_title,
          seo_description,
          cover_image_path,
          status,
          published_at,
          created_at,
          updated_at
      `,
      [
        input.id,
        input.title,
        input.slug,
        input.excerpt,
        input.content,
        input.seoTitle,
        input.seoDescription,
        input.coverImagePath,
        input.status
      ]
    );

    if (row === null) {
      return null;
    }

    return mapAdminBlogPostDetail(row);
  } catch (error) {
    mapRepositoryError(error);
  }
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
