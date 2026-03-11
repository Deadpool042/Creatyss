import { queryFirst, queryRows } from "./client";

export type DbId = string;
export type MoneyAmount = string;

export type FeaturedCategory = {
  id: DbId;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublishedProductSummary = {
  id: DbId;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  isFeatured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublishedProductImage = {
  id: DbId;
  productId: DbId;
  variantId: DbId | null;
  filePath: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PublishedProductVariant = {
  id: DbId;
  productId: DbId;
  name: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  price: MoneyAmount;
  compareAtPrice: MoneyAmount | null;
  stockQuantity: number;
  isDefault: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  images: PublishedProductImage[];
};

export type PublishedProductDetail = PublishedProductSummary & {
  isAvailable: boolean;
  images: PublishedProductImage[];
  variants: PublishedProductVariant[];
};

export type PublishedBlogPostSummary = {
  id: DbId;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImagePath: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublishedBlogPostDetail = PublishedBlogPostSummary & {
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type PublishedHomepageContent = {
  id: DbId;
  heroTitle: string | null;
  heroText: string | null;
  heroImagePath: string | null;
  editorialTitle: string | null;
  editorialText: string | null;
  createdAt: string;
  updatedAt: string;
  featuredProducts: PublishedProductSummary[];
  featuredCategories: FeaturedCategory[];
  featuredBlogPosts: PublishedBlogPostSummary[];
};

type TimestampValue = Date | string;

type HomepageContentRow = {
  id: DbId;
  hero_title: string | null;
  hero_text: string | null;
  hero_image_path: string | null;
  editorial_title: string | null;
  editorial_text: string | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type CategoryRow = {
  id: DbId;
  name: string;
  slug: string;
  description: string | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type ProductSummaryRow = {
  id: DbId;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type ProductImageRow = {
  id: DbId;
  product_id: DbId;
  variant_id: DbId | null;
  file_path: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type ProductVariantRow = {
  id: DbId;
  product_id: DbId;
  name: string;
  color_name: string;
  color_hex: string | null;
  sku: string;
  price: MoneyAmount;
  compare_at_price: MoneyAmount | null;
  stock_quantity: number;
  is_default: boolean;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type BlogPostSummaryRow = {
  id: DbId;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_path: string | null;
  published_at: TimestampValue | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type BlogPostDetailRow = BlogPostSummaryRow & {
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function toNullableIsoTimestamp(value: TimestampValue | null): string | null {
  if (value === null) {
    return null;
  }

  return toIsoTimestamp(value);
}

function mapCategory(row: CategoryRow): FeaturedCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

function mapProductSummary(row: ProductSummaryRow): PublishedProductSummary {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    isFeatured: row.is_featured,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

function mapProductImage(row: ProductImageRow): PublishedProductImage {
  return {
    id: row.id,
    productId: row.product_id,
    variantId: row.variant_id,
    filePath: row.file_path,
    altText: row.alt_text,
    sortOrder: row.sort_order,
    isPrimary: row.is_primary,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

function mapBlogPostSummary(
  row: BlogPostSummaryRow
): PublishedBlogPostSummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    coverImagePath: row.cover_image_path,
    publishedAt: toNullableIsoTimestamp(row.published_at),
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

async function getPublishedHomepageRow(): Promise<HomepageContentRow | null> {
  return queryFirst<HomepageContentRow>(
    `
      select
        hc.id::text as id,
        hc.hero_title,
        hc.hero_text,
        hc.hero_image_path,
        hc.editorial_title,
        hc.editorial_text,
        hc.created_at,
        hc.updated_at
      from homepage_content hc
      where hc.status = 'published'
      limit 1
    `
  );
}

async function listHomepageFeaturedCategories(
  homepageContentId: DbId
): Promise<FeaturedCategory[]> {
  const rows = await queryRows<CategoryRow>(
    `
      select
        c.id::text as id,
        c.name,
        c.slug,
        c.description,
        c.created_at,
        c.updated_at
      from homepage_featured_categories hfc
      join categories c
        on c.id = hfc.category_id
      where hfc.homepage_content_id = $1::bigint
      order by hfc.sort_order asc, c.id asc
    `,
    [homepageContentId]
  );

  return rows.map(mapCategory);
}

async function listHomepageFeaturedProducts(
  homepageContentId: DbId
): Promise<PublishedProductSummary[]> {
  const rows = await queryRows<ProductSummaryRow>(
    `
      select
        p.id::text as id,
        p.name,
        p.slug,
        p.short_description,
        p.description,
        p.is_featured,
        p.seo_title,
        p.seo_description,
        p.created_at,
        p.updated_at
      from homepage_featured_products hfp
      join products p
        on p.id = hfp.product_id
      where hfp.homepage_content_id = $1::bigint
        and p.status = 'published'
      order by hfp.sort_order asc, p.id asc
    `,
    [homepageContentId]
  );

  return rows.map(mapProductSummary);
}

async function listHomepageFeaturedBlogPosts(
  homepageContentId: DbId
): Promise<PublishedBlogPostSummary[]> {
  const rows = await queryRows<BlogPostSummaryRow>(
    `
      select
        bp.id::text as id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.cover_image_path,
        bp.published_at,
        bp.created_at,
        bp.updated_at
      from homepage_featured_blog_posts hfbp
      join blog_posts bp
        on bp.id = hfbp.blog_post_id
      where hfbp.homepage_content_id = $1::bigint
        and bp.status = 'published'
      order by hfbp.sort_order asc, bp.id asc
    `,
    [homepageContentId]
  );

  return rows.map(mapBlogPostSummary);
}

export async function getPublishedHomepageContent(): Promise<PublishedHomepageContent | null> {
  const homepageRow = await getPublishedHomepageRow();

  if (homepageRow === null) {
    return null;
  }

  const [featuredProducts, featuredCategories, featuredBlogPosts] =
    await Promise.all([
      listHomepageFeaturedProducts(homepageRow.id),
      listHomepageFeaturedCategories(homepageRow.id),
      listHomepageFeaturedBlogPosts(homepageRow.id)
    ]);

  return {
    id: homepageRow.id,
    heroTitle: homepageRow.hero_title,
    heroText: homepageRow.hero_text,
    heroImagePath: homepageRow.hero_image_path,
    editorialTitle: homepageRow.editorial_title,
    editorialText: homepageRow.editorial_text,
    createdAt: toIsoTimestamp(homepageRow.created_at),
    updatedAt: toIsoTimestamp(homepageRow.updated_at),
    featuredProducts,
    featuredCategories,
    featuredBlogPosts
  };
}

export async function listPublishedFeaturedCategories(): Promise<FeaturedCategory[]> {
  const homepageRow = await getPublishedHomepageRow();

  if (homepageRow === null) {
    return [];
  }

  return listHomepageFeaturedCategories(homepageRow.id);
}

export async function listPublishedProducts(
  searchQuery?: string | null
): Promise<PublishedProductSummary[]> {
  const rows = await queryRows<ProductSummaryRow>(
    `
      select
        p.id::text as id,
        p.name,
        p.slug,
        p.short_description,
        p.description,
        p.is_featured,
        p.seo_title,
        p.seo_description,
        p.created_at,
        p.updated_at
      from products p
      where p.status = 'published'
        and (
          $1::text is null
          or p.name ilike '%' || $1 || '%'
          or p.slug ilike '%' || $1 || '%'
          or exists (
            select 1
            from product_categories pc
            join categories c
              on c.id = pc.category_id
            where pc.product_id = p.id
              and (
                c.name ilike '%' || $1 || '%'
                or c.slug ilike '%' || $1 || '%'
              )
          )
          or exists (
            select 1
            from product_variants pv
            where pv.product_id = p.id
              and pv.status = 'published'
              and pv.color_name ilike '%' || $1 || '%'
          )
        )
      order by p.created_at desc, p.id desc
    `,
    [searchQuery ?? null]
  );

  return rows.map(mapProductSummary);
}

export async function getPublishedProductBySlug(
  slug: string
): Promise<PublishedProductDetail | null> {
  const productRow = await queryFirst<ProductSummaryRow>(
    `
      select
        p.id::text as id,
        p.name,
        p.slug,
        p.short_description,
        p.description,
        p.is_featured,
        p.seo_title,
        p.seo_description,
        p.created_at,
        p.updated_at
      from products p
      where p.status = 'published'
        and p.slug = $1
      limit 1
    `,
    [slug]
  );

  if (productRow === null) {
    return null;
  }

  const [parentImageRows, variantRows, variantImageRows] = await Promise.all([
    queryRows<ProductImageRow>(
      `
        select
          pi.id::text as id,
          pi.product_id::text as product_id,
          pi.variant_id::text as variant_id,
          pi.file_path,
          pi.alt_text,
          pi.sort_order,
          pi.is_primary,
          pi.created_at,
          pi.updated_at
        from product_images pi
        where pi.product_id = $1::bigint
          and pi.variant_id is null
        order by pi.sort_order asc, pi.id asc
      `,
      [productRow.id]
    ),
    queryRows<ProductVariantRow>(
      `
        select
          pv.id::text as id,
          pv.product_id::text as product_id,
          pv.name,
          pv.color_name,
          pv.color_hex,
        pv.sku,
        pv.price::text as price,
        pv.compare_at_price::text as compare_at_price,
        pv.stock_quantity,
        pv.is_default,
        pv.created_at,
        pv.updated_at
        from product_variants pv
        where pv.product_id = $1::bigint
          and pv.status = 'published'
        order by pv.is_default desc, pv.id asc
      `,
      [productRow.id]
    ),
    queryRows<ProductImageRow>(
      `
        select
          pi.id::text as id,
          pi.product_id::text as product_id,
          pi.variant_id::text as variant_id,
          pi.file_path,
          pi.alt_text,
          pi.sort_order,
          pi.is_primary,
          pi.created_at,
          pi.updated_at
        from product_images pi
        join product_variants pv
          on pv.id = pi.variant_id
         and pv.product_id = pi.product_id
        where pi.product_id = $1::bigint
          and pi.variant_id is not null
          and pv.status = 'published'
        order by pi.sort_order asc, pi.id asc
      `,
      [productRow.id]
    )
  ]);

  const imagesByVariantId = new Map<DbId, PublishedProductImage[]>();

  for (const row of variantImageRows) {
    if (row.variant_id === null) {
      continue;
    }

    const image = mapProductImage(row);
    const variantImages = imagesByVariantId.get(row.variant_id);

    if (variantImages) {
      variantImages.push(image);
      continue;
    }

    imagesByVariantId.set(row.variant_id, [image]);
  }

  const variants: PublishedProductVariant[] = variantRows.map((row) => ({
    id: row.id,
    productId: row.product_id,
    name: row.name,
    colorName: row.color_name,
    colorHex: row.color_hex,
    sku: row.sku,
    price: row.price,
    compareAtPrice: row.compare_at_price,
    stockQuantity: row.stock_quantity,
    isDefault: row.is_default,
    isAvailable: row.stock_quantity > 0,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
    images: imagesByVariantId.get(row.id) ?? []
  }));

  return {
    ...mapProductSummary(productRow),
    isAvailable: variants.some((variant) => variant.isAvailable),
    images: parentImageRows.map(mapProductImage),
    variants
  };
}

export async function listPublishedBlogPosts(): Promise<PublishedBlogPostSummary[]> {
  const rows = await queryRows<BlogPostSummaryRow>(
    `
      select
        bp.id::text as id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.cover_image_path,
        bp.published_at,
        bp.created_at,
        bp.updated_at
      from blog_posts bp
      where bp.status = 'published'
      order by bp.published_at desc nulls last, bp.id desc
    `
  );

  return rows.map(mapBlogPostSummary);
}

export async function getPublishedBlogPostBySlug(
  slug: string
): Promise<PublishedBlogPostDetail | null> {
  const row = await queryFirst<BlogPostDetailRow>(
    `
      select
        bp.id::text as id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.content,
        bp.cover_image_path,
        bp.published_at,
        bp.seo_title,
        bp.seo_description,
        bp.created_at,
        bp.updated_at
      from blog_posts bp
      where bp.status = 'published'
        and bp.slug = $1
      limit 1
    `,
    [slug]
  );

  if (row === null) {
    return null;
  }

  return {
    ...mapBlogPostSummary(row),
    content: row.content,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description
  };
}
