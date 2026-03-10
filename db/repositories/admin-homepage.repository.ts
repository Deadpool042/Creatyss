import { type PoolClient } from "pg";
import { db, queryFirst, queryRows } from "@/db/client";

type TimestampValue = Date | string;

type HomepageStatus = "draft" | "published";

type AdminHomepageRow = {
  id: string;
  hero_title: string | null;
  hero_text: string | null;
  hero_image_path: string | null;
  editorial_title: string | null;
  editorial_text: string | null;
  status: HomepageStatus;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type ProductOptionRow = {
  id: string;
  name: string;
  slug: string;
};

type CategoryOptionRow = {
  id: string;
  name: string;
  slug: string;
};

type BlogPostOptionRow = {
  id: string;
  title: string;
  slug: string;
};

type HomepageFeaturedProductRow = {
  product_id: string;
  sort_order: number;
};

type HomepageFeaturedCategoryRow = {
  category_id: string;
  sort_order: number;
};

type HomepageFeaturedBlogPostRow = {
  blog_post_id: string;
  sort_order: number;
};

type CountRow = {
  matched_count: number;
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

type RepositoryErrorCode =
  | "homepage_missing"
  | "product_missing"
  | "category_missing"
  | "blog_post_missing";

export type AdminHomepageFeaturedProductSelection = {
  productId: string;
  sortOrder: number;
};

export type AdminHomepageFeaturedCategorySelection = {
  categoryId: string;
  sortOrder: number;
};

export type AdminHomepageFeaturedBlogPostSelection = {
  blogPostId: string;
  sortOrder: number;
};

export type AdminHomepageProductOption = {
  id: string;
  name: string;
  slug: string;
};

export type AdminHomepageCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type AdminHomepageBlogPostOption = {
  id: string;
  title: string;
  slug: string;
};

export type AdminHomepageDetail = {
  id: string;
  heroTitle: string | null;
  heroText: string | null;
  heroImagePath: string | null;
  editorialTitle: string | null;
  editorialText: string | null;
  status: HomepageStatus;
  createdAt: string;
  updatedAt: string;
  featuredProducts: AdminHomepageFeaturedProductSelection[];
  featuredCategories: AdminHomepageFeaturedCategorySelection[];
  featuredBlogPosts: AdminHomepageFeaturedBlogPostSelection[];
};

export type AdminHomepageEditorData = {
  homepage: AdminHomepageDetail;
  productOptions: AdminHomepageProductOption[];
  categoryOptions: AdminHomepageCategoryOption[];
  blogPostOptions: AdminHomepageBlogPostOption[];
};

export class AdminHomepageRepositoryError extends Error {
  readonly code: RepositoryErrorCode;

  constructor(code: RepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

function isValidNumericId(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function mapProductOption(row: ProductOptionRow): AdminHomepageProductOption {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug
  };
}

function mapCategoryOption(
  row: CategoryOptionRow
): AdminHomepageCategoryOption {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug
  };
}

function mapBlogPostOption(
  row: BlogPostOptionRow
): AdminHomepageBlogPostOption {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug
  };
}

function mapHomepageDetail(
  row: AdminHomepageRow,
  featuredProducts: AdminHomepageFeaturedProductSelection[],
  featuredCategories: AdminHomepageFeaturedCategorySelection[],
  featuredBlogPosts: AdminHomepageFeaturedBlogPostSelection[]
): AdminHomepageDetail {
  return {
    id: row.id,
    heroTitle: row.hero_title,
    heroText: row.hero_text,
    heroImagePath: row.hero_image_path,
    editorialTitle: row.editorial_title,
    editorialText: row.editorial_text,
    status: row.status,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
    featuredProducts,
    featuredCategories,
    featuredBlogPosts
  };
}

function normalizeUniqueIds(ids: readonly string[]): string[] {
  return [...new Set(ids)];
}

async function getPublishedHomepageRow(): Promise<AdminHomepageRow | null> {
  return queryFirst<AdminHomepageRow>(
    `
      select
        hc.id::text as id,
        hc.hero_title,
        hc.hero_text,
        hc.hero_image_path,
        hc.editorial_title,
        hc.editorial_text,
        hc.status,
        hc.created_at,
        hc.updated_at
      from homepage_content hc
      where hc.status = 'published'
      limit 1
    `
  );
}

async function listHomepageFeaturedProducts(
  homepageId: string
): Promise<AdminHomepageFeaturedProductSelection[]> {
  const rows = await queryRows<HomepageFeaturedProductRow>(
    `
      select
        hfp.product_id::text as product_id,
        hfp.sort_order
      from homepage_featured_products hfp
      where hfp.homepage_content_id = $1::bigint
      order by hfp.sort_order asc, hfp.product_id asc
    `,
    [homepageId]
  );

  return rows.map((row) => ({
    productId: row.product_id,
    sortOrder: row.sort_order
  }));
}

async function listHomepageFeaturedCategories(
  homepageId: string
): Promise<AdminHomepageFeaturedCategorySelection[]> {
  const rows = await queryRows<HomepageFeaturedCategoryRow>(
    `
      select
        hfc.category_id::text as category_id,
        hfc.sort_order
      from homepage_featured_categories hfc
      where hfc.homepage_content_id = $1::bigint
      order by hfc.sort_order asc, hfc.category_id asc
    `,
    [homepageId]
  );

  return rows.map((row) => ({
    categoryId: row.category_id,
    sortOrder: row.sort_order
  }));
}

async function listHomepageFeaturedBlogPosts(
  homepageId: string
): Promise<AdminHomepageFeaturedBlogPostSelection[]> {
  const rows = await queryRows<HomepageFeaturedBlogPostRow>(
    `
      select
        hfbp.blog_post_id::text as blog_post_id,
        hfbp.sort_order
      from homepage_featured_blog_posts hfbp
      where hfbp.homepage_content_id = $1::bigint
      order by hfbp.sort_order asc, hfbp.blog_post_id asc
    `,
    [homepageId]
  );

  return rows.map((row) => ({
    blogPostId: row.blog_post_id,
    sortOrder: row.sort_order
  }));
}

async function ensureHomepageExists(
  client: PoolClient,
  homepageId: string
): Promise<void> {
  const result = await client.query<{ id: string }>(
    `
      select id::text as id
      from homepage_content
      where id = $1::bigint
        and status = 'published'
      limit 1
    `,
    [homepageId]
  );

  if (result.rows.length === 0) {
    throw new AdminHomepageRepositoryError(
      "homepage_missing",
      "Published homepage was not found."
    );
  }
}

async function ensurePublishedProductsExist(
  client: PoolClient,
  selections: readonly AdminHomepageFeaturedProductSelection[]
): Promise<void> {
  const productIds = normalizeUniqueIds(
    selections.map((selection) => selection.productId)
  );

  if (productIds.length === 0) {
    return;
  }

  const result = await client.query<CountRow>(
    `
      select count(*)::int as matched_count
      from products
      where id = any($1::bigint[])
        and status = 'published'
    `,
    [productIds]
  );

  const matchedCount = result.rows[0]?.matched_count ?? 0;

  if (matchedCount !== productIds.length) {
    throw new AdminHomepageRepositoryError(
      "product_missing",
      "At least one selected product is missing or unpublished."
    );
  }
}

async function ensureCategoriesExist(
  client: PoolClient,
  selections: readonly AdminHomepageFeaturedCategorySelection[]
): Promise<void> {
  const categoryIds = normalizeUniqueIds(
    selections.map((selection) => selection.categoryId)
  );

  if (categoryIds.length === 0) {
    return;
  }

  const result = await client.query<CountRow>(
    `
      select count(*)::int as matched_count
      from categories
      where id = any($1::bigint[])
    `,
    [categoryIds]
  );

  const matchedCount = result.rows[0]?.matched_count ?? 0;

  if (matchedCount !== categoryIds.length) {
    throw new AdminHomepageRepositoryError(
      "category_missing",
      "At least one selected category is missing."
    );
  }
}

async function ensurePublishedBlogPostsExist(
  client: PoolClient,
  selections: readonly AdminHomepageFeaturedBlogPostSelection[]
): Promise<void> {
  const blogPostIds = normalizeUniqueIds(
    selections.map((selection) => selection.blogPostId)
  );

  if (blogPostIds.length === 0) {
    return;
  }

  const result = await client.query<CountRow>(
    `
      select count(*)::int as matched_count
      from blog_posts
      where id = any($1::bigint[])
        and status = 'published'
    `,
    [blogPostIds]
  );

  const matchedCount = result.rows[0]?.matched_count ?? 0;

  if (matchedCount !== blogPostIds.length) {
    throw new AdminHomepageRepositoryError(
      "blog_post_missing",
      "At least one selected blog post is missing or unpublished."
    );
  }
}

async function replaceHomepageFeaturedProducts(
  client: PoolClient,
  homepageId: string,
  selections: readonly AdminHomepageFeaturedProductSelection[]
): Promise<void> {
  await client.query(
    `
      delete from homepage_featured_products
      where homepage_content_id = $1::bigint
    `,
    [homepageId]
  );

  if (selections.length === 0) {
    return;
  }

  await client.query(
    `
      insert into homepage_featured_products (
        homepage_content_id,
        product_id,
        sort_order
      )
      select
        $1::bigint,
        selections.product_id,
        selections.sort_order
      from unnest($2::bigint[], $3::integer[]) as selections(product_id, sort_order)
    `,
    [
      homepageId,
      selections.map((selection) => selection.productId),
      selections.map((selection) => selection.sortOrder)
    ]
  );
}

async function replaceHomepageFeaturedCategories(
  client: PoolClient,
  homepageId: string,
  selections: readonly AdminHomepageFeaturedCategorySelection[]
): Promise<void> {
  await client.query(
    `
      delete from homepage_featured_categories
      where homepage_content_id = $1::bigint
    `,
    [homepageId]
  );

  if (selections.length === 0) {
    return;
  }

  await client.query(
    `
      insert into homepage_featured_categories (
        homepage_content_id,
        category_id,
        sort_order
      )
      select
        $1::bigint,
        selections.category_id,
        selections.sort_order
      from unnest($2::bigint[], $3::integer[]) as selections(category_id, sort_order)
    `,
    [
      homepageId,
      selections.map((selection) => selection.categoryId),
      selections.map((selection) => selection.sortOrder)
    ]
  );
}

async function replaceHomepageFeaturedBlogPosts(
  client: PoolClient,
  homepageId: string,
  selections: readonly AdminHomepageFeaturedBlogPostSelection[]
): Promise<void> {
  await client.query(
    `
      delete from homepage_featured_blog_posts
      where homepage_content_id = $1::bigint
    `,
    [homepageId]
  );

  if (selections.length === 0) {
    return;
  }

  await client.query(
    `
      insert into homepage_featured_blog_posts (
        homepage_content_id,
        blog_post_id,
        sort_order
      )
      select
        $1::bigint,
        selections.blog_post_id,
        selections.sort_order
      from unnest($2::bigint[], $3::integer[]) as selections(blog_post_id, sort_order)
    `,
    [
      homepageId,
      selections.map((selection) => selection.blogPostId),
      selections.map((selection) => selection.sortOrder)
    ]
  );
}

export async function getAdminHomepageEditorData(): Promise<AdminHomepageEditorData | null> {
  const homepageRow = await getPublishedHomepageRow();

  if (homepageRow === null) {
    return null;
  }

  const [
    featuredProducts,
    featuredCategories,
    featuredBlogPosts,
    productRows,
    categoryRows,
    blogPostRows
  ] = await Promise.all([
    listHomepageFeaturedProducts(homepageRow.id),
    listHomepageFeaturedCategories(homepageRow.id),
    listHomepageFeaturedBlogPosts(homepageRow.id),
    queryRows<ProductOptionRow>(
      `
        select
          id::text as id,
          name,
          slug
        from products
        where status = 'published'
        order by lower(name) asc, id asc
      `
    ),
    queryRows<CategoryOptionRow>(
      `
        select
          id::text as id,
          name,
          slug
        from categories
        order by lower(name) asc, id asc
      `
    ),
    queryRows<BlogPostOptionRow>(
      `
        select
          id::text as id,
          title,
          slug
        from blog_posts
        where status = 'published'
        order by coalesce(published_at, created_at) desc, id desc
      `
    )
  ]);

  return {
    homepage: mapHomepageDetail(
      homepageRow,
      featuredProducts,
      featuredCategories,
      featuredBlogPosts
    ),
    productOptions: productRows.map(mapProductOption),
    categoryOptions: categoryRows.map(mapCategoryOption),
    blogPostOptions: blogPostRows.map(mapBlogPostOption)
  };
}

export async function updateAdminHomepage(
  input: UpdateAdminHomepageInput
): Promise<AdminHomepageDetail | null> {
  if (!isValidNumericId(input.id)) {
    return null;
  }

  const client = await db.connect();

  try {
    await client.query("begin");

    await ensureHomepageExists(client, input.id);
    await ensurePublishedProductsExist(client, input.featuredProducts);
    await ensureCategoriesExist(client, input.featuredCategories);
    await ensurePublishedBlogPostsExist(client, input.featuredBlogPosts);

    const result = await client.query<AdminHomepageRow>(
      `
        update homepage_content
        set
          hero_title = $2,
          hero_text = $3,
          hero_image_path = $4,
          editorial_title = $5,
          editorial_text = $6
        where id = $1::bigint
          and status = 'published'
        returning
          id::text as id,
          hero_title,
          hero_text,
          hero_image_path,
          editorial_title,
          editorial_text,
          status,
          created_at,
          updated_at
      `,
      [
        input.id,
        input.heroTitle,
        input.heroText,
        input.heroImagePath,
        input.editorialTitle,
        input.editorialText
      ]
    );

    const homepageRow = result.rows[0];

    if (!homepageRow) {
      await client.query("rollback");
      return null;
    }

    await replaceHomepageFeaturedProducts(client, input.id, input.featuredProducts);
    await replaceHomepageFeaturedCategories(
      client,
      input.id,
      input.featuredCategories
    );
    await replaceHomepageFeaturedBlogPosts(
      client,
      input.id,
      input.featuredBlogPosts
    );

    await client.query("commit");

    return mapHomepageDetail(
      homepageRow,
      input.featuredProducts,
      input.featuredCategories,
      input.featuredBlogPosts
    );
  } catch (error) {
    await client.query("rollback");

    if (error instanceof AdminHomepageRepositoryError) {
      throw error;
    }

    throw error;
  } finally {
    client.release();
  }
}
