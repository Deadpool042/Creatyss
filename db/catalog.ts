import {
  resolveSimpleProductOffer,
  type SimpleProductOffer,
  type SimpleProductOfferFields,
} from "@/entities/product/simple-product-offer";
import { queryFirst, queryRows } from "./client";

export type DbId = string;
export type MoneyAmount = string;

export type FeaturedCategory = {
  id: DbId;
  name: string;
  slug: string;
  description: string | null;
  representativeImage: { filePath: string; altText: string | null } | null;
  createdAt: string;
  updatedAt: string;
};

export type CatalogFilterCategory = {
  id: DbId;
  name: string;
  slug: string;
};

export type PublishedProductListFilters = {
  searchQuery: string | null;
  categorySlug: string | null;
  onlyAvailable: boolean;
};

export type PublishedProductSummary = {
  id: DbId;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  productType: "simple" | "variable";
  isFeatured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  primaryImage: PublishedProductImage | null;
};

export type PublishedCatalogProductSummary = PublishedProductSummary & {
  isAvailable: boolean;
  simpleOffer: SimpleProductOffer | null;
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
  simpleOffer: SimpleProductOffer | null;
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
  rep_image_file_path: string | null;
  rep_image_alt_text: string | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type CatalogFilterCategoryRow = {
  id: DbId;
  name: string;
  slug: string;
};

type ProductSimpleFieldsRow = {
  simple_sku: string | null;
  simple_price: MoneyAmount | null;
  simple_compare_at_price: MoneyAmount | null;
  simple_stock_quantity: number | null;
};

type ProductSummaryRow = ProductSimpleFieldsRow & {
  id: DbId;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  product_type: "simple" | "variable";
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;

  primary_image_id: DbId | null;
  primary_image_product_id: DbId | null;
  primary_image_variant_id: DbId | null;
  primary_image_file_path: string | null;
  primary_image_alt_text: string | null;
  primary_image_sort_order: number | null;
  primary_image_is_primary: boolean | null;
  primary_image_created_at: TimestampValue | null;
  primary_image_updated_at: TimestampValue | null;
};

type ProductCatalogSummaryRow = ProductSummaryRow & {
  is_available: boolean;
  legacy_exploitable_variant_count: number;
  legacy_variant_sku: string | null;
  legacy_variant_price: MoneyAmount | null;
  legacy_variant_compare_at_price: MoneyAmount | null;
  legacy_variant_stock_quantity: number | null;
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
    representativeImage:
      row.rep_image_file_path !== null
        ? { filePath: row.rep_image_file_path, altText: row.rep_image_alt_text }
        : null,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapCatalogFilterCategory(row: CatalogFilterCategoryRow): CatalogFilterCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
  };
}

function mapPrimaryProductImage(row: ProductSummaryRow): PublishedProductImage | null {
  if (
    row.primary_image_id === null ||
    row.primary_image_product_id === null ||
    row.primary_image_file_path === null ||
    row.primary_image_sort_order === null ||
    row.primary_image_is_primary === null ||
    row.primary_image_created_at === null ||
    row.primary_image_updated_at === null
  ) {
    return null;
  }

  return {
    id: row.primary_image_id,
    productId: row.primary_image_product_id,
    variantId: row.primary_image_variant_id,
    filePath: row.primary_image_file_path,
    altText: row.primary_image_alt_text,
    sortOrder: row.primary_image_sort_order,
    isPrimary: row.primary_image_is_primary,
    createdAt: toIsoTimestamp(row.primary_image_created_at),
    updatedAt: toIsoTimestamp(row.primary_image_updated_at),
  };
}

function mapProductSummary(row: ProductSummaryRow): PublishedProductSummary {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    productType: row.product_type,
    isFeatured: row.is_featured,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
    primaryImage: mapPrimaryProductImage(row),
  };
}

function getNativeSimpleOfferFields(row: ProductSimpleFieldsRow): SimpleProductOfferFields {
  return {
    sku: row.simple_sku,
    price: row.simple_price,
    compareAtPrice: row.simple_compare_at_price,
    stockQuantity: row.simple_stock_quantity,
  };
}

function resolvePublishedSimpleOffer(input: {
  productType: "simple" | "variable";
  native: SimpleProductOfferFields;
  legacyOffers: readonly SimpleProductOfferFields[];
}): SimpleProductOffer | null {
  if (input.productType !== "simple") {
    return null;
  }

  return resolveSimpleProductOffer({
    native: input.native,
    legacyOffers: input.legacyOffers,
  });
}

function getCatalogLegacySimpleOffers(row: ProductCatalogSummaryRow): SimpleProductOfferFields[] {
  if (row.legacy_exploitable_variant_count !== 1) {
    return [];
  }

  return [
    {
      sku: row.legacy_variant_sku,
      price: row.legacy_variant_price,
      compareAtPrice: row.legacy_variant_compare_at_price,
      stockQuantity: row.legacy_variant_stock_quantity,
    },
  ];
}

function mapCatalogProductSummary(row: ProductCatalogSummaryRow): PublishedCatalogProductSummary {
  const simpleOffer = resolvePublishedSimpleOffer({
    productType: row.product_type,
    native: getNativeSimpleOfferFields(row),
    legacyOffers: getCatalogLegacySimpleOffers(row),
  });

  return {
    ...mapProductSummary(row),
    isAvailable: row.is_available,
    simpleOffer,
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
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function getVariantSimpleOfferFields(row: ProductVariantRow): SimpleProductOfferFields {
  return {
    sku: row.sku,
    price: row.price,
    compareAtPrice: row.compare_at_price,
    stockQuantity: row.stock_quantity,
  };
}

function mapPublishedProductVariant(
  row: ProductVariantRow,
  images: PublishedProductImage[]
): PublishedProductVariant {
  return {
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
    images,
  };
}

function groupVariantImagesByVariantId(
  rows: readonly ProductImageRow[]
): Map<DbId, PublishedProductImage[]> {
  const imagesByVariantId = new Map<DbId, PublishedProductImage[]>();

  for (const row of rows) {
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

  return imagesByVariantId;
}

function getPublishedProductAvailability(input: {
  productType: "simple" | "variable";
  simpleOffer: SimpleProductOffer | null;
  variants: readonly PublishedProductVariant[];
}): boolean {
  if (input.productType === "simple") {
    return input.simpleOffer?.isAvailable ?? false;
  }

  return input.variants.some((variant) => variant.isAvailable);
}

function mapBlogPostSummary(row: BlogPostSummaryRow): PublishedBlogPostSummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    coverImagePath: row.cover_image_path,
    publishedAt: toNullableIsoTimestamp(row.published_at),
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
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
        c.updated_at,
        rep_img.file_path as rep_image_file_path,
        rep_img.alt_text  as rep_image_alt_text
      from homepage_featured_categories hfc
      join categories c
        on c.id = hfc.category_id
      left join lateral (
        select pi.file_path, pi.alt_text
        from product_categories pc
        join products p  on p.id  = pc.product_id
        join product_images pi on pi.product_id = p.id and pi.is_primary = true
        where pc.category_id = c.id
          and p.status = 'published'
        order by p.created_at desc
        limit 1
      ) rep_img on true
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
        p.product_type,
        p.simple_sku,
        p.simple_price::text as simple_price,
        p.simple_compare_at_price::text as simple_compare_at_price,
        p.simple_stock_quantity,
        p.is_featured,
        p.seo_title,
        p.seo_description,
        p.created_at,
        p.updated_at,
        primary_image.id::text as primary_image_id,
        primary_image.product_id::text as primary_image_product_id,
        primary_image.variant_id::text as primary_image_variant_id,
        primary_image.file_path as primary_image_file_path,
        primary_image.alt_text as primary_image_alt_text,
        primary_image.sort_order as primary_image_sort_order,
        primary_image.is_primary as primary_image_is_primary,
        primary_image.created_at as primary_image_created_at,
        primary_image.updated_at as primary_image_updated_at
      from homepage_featured_products hfp
      join products p
        on p.id = hfp.product_id
      left join lateral (
        select
          pi.id,
          pi.product_id,
          pi.variant_id,
          pi.file_path,
          pi.alt_text,
          pi.sort_order,
          pi.is_primary,
          pi.created_at,
          pi.updated_at
        from product_images pi
        left join product_variants pv
          on pv.id = pi.variant_id
        where pi.product_id = p.id
          and (
            pi.variant_id is null
            or pv.status = 'published'
          )
        order by
          case when pi.variant_id is null then 0 else 1 end asc,
          pi.is_primary desc,
          pi.sort_order asc,
          pi.id asc
        limit 1
      ) as primary_image on true
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

  const [featuredProducts, featuredCategories, featuredBlogPosts] = await Promise.all([
    listHomepageFeaturedProducts(homepageRow.id),
    listHomepageFeaturedCategories(homepageRow.id),
    listHomepageFeaturedBlogPosts(homepageRow.id),
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
    featuredBlogPosts,
  };
}

export async function listPublishedFeaturedCategories(): Promise<FeaturedCategory[]> {
  const homepageRow = await getPublishedHomepageRow();

  if (homepageRow === null) {
    return [];
  }

  return listHomepageFeaturedCategories(homepageRow.id);
}

export async function listCatalogFilterCategories(): Promise<CatalogFilterCategory[]> {
  const rows = await queryRows<CatalogFilterCategoryRow>(
    `
      select
        c.id::text as id,
        c.name,
        c.slug
      from categories c
      join product_categories pc
        on pc.category_id = c.id
      join products p
        on p.id = pc.product_id
      where p.status = 'published'
      group by c.id, c.name, c.slug
      order by c.name asc, c.id asc
    `
  );

  return rows.map(mapCatalogFilterCategory);
}

async function listPublishedCatalogProductRows(
  filters: PublishedProductListFilters
): Promise<ProductCatalogSummaryRow[]> {
  return queryRows<ProductCatalogSummaryRow>(
    `
      select
        catalog_products.id,
        catalog_products.name,
        catalog_products.slug,
        catalog_products.short_description,
        catalog_products.description,
        catalog_products.product_type,
        catalog_products.simple_sku,
        catalog_products.simple_price,
        catalog_products.simple_compare_at_price,
        catalog_products.simple_stock_quantity,
        catalog_products.is_featured,
        catalog_products.is_available,
        catalog_products.legacy_exploitable_variant_count,
        catalog_products.legacy_variant_sku,
        catalog_products.legacy_variant_price,
        catalog_products.legacy_variant_compare_at_price,
        catalog_products.legacy_variant_stock_quantity,
        catalog_products.seo_title,
        catalog_products.seo_description,
        catalog_products.created_at,
        catalog_products.updated_at,
        catalog_products.primary_image_id,
        catalog_products.primary_image_product_id,
        catalog_products.primary_image_variant_id,
        catalog_products.primary_image_file_path,
        catalog_products.primary_image_alt_text,
        catalog_products.primary_image_sort_order,
        catalog_products.primary_image_is_primary,
        catalog_products.primary_image_created_at,
        catalog_products.primary_image_updated_at
      from (
        select
          p.id::text as id,
          p.name,
          p.slug,
          p.short_description,
          p.description,
          p.product_type,
          p.simple_sku,
          p.simple_price::text as simple_price,
          p.simple_compare_at_price::text as simple_compare_at_price,
          p.simple_stock_quantity,
          p.is_featured,
          case
            when p.product_type = 'simple' then
              case
                when p.simple_sku is not null
                  and btrim(p.simple_sku) <> ''
                  and p.simple_price is not null
                  and p.simple_stock_quantity is not null
                then p.simple_stock_quantity > 0
                when coalesce(legacy_simple_offer.legacy_exploitable_variant_count, 0) = 1
                  and legacy_simple_offer.legacy_variant_sku is not null
                  and btrim(legacy_simple_offer.legacy_variant_sku) <> ''
                  and legacy_simple_offer.legacy_variant_price is not null
                  and legacy_simple_offer.legacy_variant_stock_quantity is not null
                then legacy_simple_offer.legacy_variant_stock_quantity > 0
                else false
              end
            else coalesce(published_variants.has_available_variant, false)
          end as is_available,
          coalesce(legacy_simple_offer.legacy_exploitable_variant_count, 0)
            as legacy_exploitable_variant_count,
          legacy_simple_offer.legacy_variant_sku,
          legacy_simple_offer.legacy_variant_price,
          legacy_simple_offer.legacy_variant_compare_at_price,
          legacy_simple_offer.legacy_variant_stock_quantity,
          p.seo_title,
          p.seo_description,
          p.created_at,
          p.updated_at,
          primary_image.id::text as primary_image_id,
          primary_image.product_id::text as primary_image_product_id,
          primary_image.variant_id::text as primary_image_variant_id,
          primary_image.file_path as primary_image_file_path,
          primary_image.alt_text as primary_image_alt_text,
          primary_image.sort_order as primary_image_sort_order,
          primary_image.is_primary as primary_image_is_primary,
          primary_image.created_at as primary_image_created_at,
          primary_image.updated_at as primary_image_updated_at
        from products p
        left join lateral (
          select
            pi.id,
            pi.product_id,
            pi.variant_id,
            pi.file_path,
            pi.alt_text,
            pi.sort_order,
            pi.is_primary,
            pi.created_at,
            pi.updated_at
          from product_images pi
          left join product_variants pv
            on pv.id = pi.variant_id
          where pi.product_id = p.id
            and (
              pi.variant_id is null
              or pv.status = 'published'
            )
          order by
            case when pi.variant_id is null then 0 else 1 end asc,
            pi.is_primary desc,
            pi.sort_order asc,
            pi.id asc
          limit 1
        ) as primary_image on true
        left join lateral (
          select
            count(*)::int as legacy_exploitable_variant_count,
            (
              array_agg(pv.sku order by pv.is_default desc, pv.id asc)
            )[1] as legacy_variant_sku,
            (
              array_agg(pv.price::text order by pv.is_default desc, pv.id asc)
            )[1] as legacy_variant_price,
            (
              array_agg(
                pv.compare_at_price::text
                order by pv.is_default desc, pv.id asc
              )
            )[1] as legacy_variant_compare_at_price,
            (
              array_agg(pv.stock_quantity order by pv.is_default desc, pv.id asc)
            )[1] as legacy_variant_stock_quantity
          from product_variants pv
          where pv.product_id = p.id
            and pv.status = 'published'
            and pv.sku is not null
            and btrim(pv.sku) <> ''
            and pv.price is not null
            and pv.stock_quantity is not null
        ) as legacy_simple_offer on true
        left join lateral (
          select
            coalesce(bool_or(pv.stock_quantity > 0), false) as has_available_variant
          from product_variants pv
          where pv.product_id = p.id
            and pv.status = 'published'
        ) as published_variants on true
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
          and (
            $2::text is null
            or exists (
              select 1
              from product_categories pc
              join categories c
                on c.id = pc.category_id
              where pc.product_id = p.id
                and c.slug = $2
            )
          )
      ) as catalog_products
      where not $3::boolean or catalog_products.is_available
      order by
        case
          when $1::text is null
            and $2::text is null
            and not $3::boolean
            and catalog_products.is_featured
          then 0
          else 1
        end asc,
        catalog_products.created_at desc,
        catalog_products.id desc
    `,
    [filters.searchQuery, filters.categorySlug, filters.onlyAvailable]
  );
}

async function getPublishedProductRowBySlug(slug: string): Promise<ProductSummaryRow | null> {
  return queryFirst<ProductSummaryRow>(
    `
      select
        p.id::text as id,
        p.name,
        p.slug,
        p.short_description,
        p.description,
        p.product_type,
        p.simple_sku,
        p.simple_price::text as simple_price,
        p.simple_compare_at_price::text as simple_compare_at_price,
        p.simple_stock_quantity,
        p.is_featured,
        p.seo_title,
        p.seo_description,
        p.created_at,
        p.updated_at,
        primary_image.id::text as primary_image_id,
        primary_image.product_id::text as primary_image_product_id,
        primary_image.variant_id::text as primary_image_variant_id,
        primary_image.file_path as primary_image_file_path,
        primary_image.alt_text as primary_image_alt_text,
        primary_image.sort_order as primary_image_sort_order,
        primary_image.is_primary as primary_image_is_primary,
        primary_image.created_at as primary_image_created_at,
        primary_image.updated_at as primary_image_updated_at
      from products p
      left join lateral (
        select
          pi.id,
          pi.product_id,
          pi.variant_id,
          pi.file_path,
          pi.alt_text,
          pi.sort_order,
          pi.is_primary,
          pi.created_at,
          pi.updated_at
        from product_images pi
        left join product_variants pv
          on pv.id = pi.variant_id
        where pi.product_id = p.id
          and (
            pi.variant_id is null
            or pv.status = 'published'
          )
        order by
          case when pi.variant_id is null then 0 else 1 end asc,
          pi.is_primary desc,
          pi.sort_order asc,
          pi.id asc
        limit 1
      ) as primary_image on true
      where p.status = 'published'
        and p.slug = $1
      limit 1
    `,
    [slug]
  );
}

async function listPublishedParentProductImages(productId: DbId): Promise<ProductImageRow[]> {
  return queryRows<ProductImageRow>(
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
    [productId]
  );
}

async function listPublishedProductVariants(productId: DbId): Promise<ProductVariantRow[]> {
  return queryRows<ProductVariantRow>(
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
    [productId]
  );
}

async function listPublishedVariantImages(productId: DbId): Promise<ProductImageRow[]> {
  return queryRows<ProductImageRow>(
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
    [productId]
  );
}

export async function listPublishedProducts(
  filters: PublishedProductListFilters
): Promise<PublishedCatalogProductSummary[]> {
  const rows = await listPublishedCatalogProductRows(filters);

  return rows.map(mapCatalogProductSummary);
}

export async function getPublishedProductBySlug(
  slug: string
): Promise<PublishedProductDetail | null> {
  const productRow = await getPublishedProductRowBySlug(slug);

  if (productRow === null) {
    return null;
  }

  const [parentImageRows, variantRows, variantImageRows] = await Promise.all([
    listPublishedParentProductImages(productRow.id),
    listPublishedProductVariants(productRow.id),
    listPublishedVariantImages(productRow.id),
  ]);

  const imagesByVariantId = groupVariantImagesByVariantId(variantImageRows);
  const variants: PublishedProductVariant[] = variantRows.map((row) =>
    mapPublishedProductVariant(row, imagesByVariantId.get(row.id) ?? [])
  );
  const simpleOffer = resolvePublishedSimpleOffer({
    productType: productRow.product_type,
    native: getNativeSimpleOfferFields(productRow),
    legacyOffers: variantRows.map(getVariantSimpleOfferFields),
  });

  return {
    ...mapProductSummary(productRow),
    isAvailable: getPublishedProductAvailability({
      productType: productRow.product_type,
      simpleOffer,
      variants,
    }),
    simpleOffer,
    images: parentImageRows.map(mapProductImage),
    variants,
  };
}

export async function listRecentPublishedProducts(
  limit: number
): Promise<PublishedProductSummary[]> {
  const rows = await queryRows<ProductSummaryRow>(
    `
      select
        p.id::text as id,
        p.name,
        p.slug,
        p.short_description,
        p.description,
        p.product_type,
        p.simple_sku,
        p.simple_price::text as simple_price,
        p.simple_compare_at_price::text as simple_compare_at_price,
        p.simple_stock_quantity,
        p.is_featured,
        p.seo_title,
        p.seo_description,
        p.created_at,
        p.updated_at,
        primary_image.id::text as primary_image_id,
        primary_image.product_id::text as primary_image_product_id,
        primary_image.variant_id::text as primary_image_variant_id,
        primary_image.file_path as primary_image_file_path,
        primary_image.alt_text as primary_image_alt_text,
        primary_image.sort_order as primary_image_sort_order,
        primary_image.is_primary as primary_image_is_primary,
        primary_image.created_at as primary_image_created_at,
        primary_image.updated_at as primary_image_updated_at
      from products p
      left join lateral (
        select
          pi.id,
          pi.product_id,
          pi.variant_id,
          pi.file_path,
          pi.alt_text,
          pi.sort_order,
          pi.is_primary,
          pi.created_at,
          pi.updated_at
        from product_images pi
        left join product_variants pv
          on pv.id = pi.variant_id
        where pi.product_id = p.id
          and (
            pi.variant_id is null
            or pv.status = 'published'
          )
        order by
          case when pi.variant_id is null then 0 else 1 end asc,
          pi.is_primary desc,
          pi.sort_order asc,
          pi.id asc
        limit 1
      ) as primary_image on true
      where p.status = 'published'
      order by p.created_at desc
      limit $1
    `,
    [limit]
  );

  return rows.map(mapProductSummary);
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
    seoDescription: row.seo_description,
  };
}
