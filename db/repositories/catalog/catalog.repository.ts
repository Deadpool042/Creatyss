import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  mapCategory,
  mapCatalogFilterCategory,
  mapProductSummaryRow,
  mapCatalogProductSummaryRow,
  mapPrismaProductImage,
  mapPrismaProductVariant,
  getVariantSimpleOfferFields,
  groupVariantImagesByVariantId,
  getPublishedProductAvailability,
  resolvePublishedSimpleOffer,
  mapBlogPostSummary,
  type CategoryRow,
  type ProductSummaryRow,
  type ProductCatalogSummaryRow,
} from "./catalog.mappers";

import type {
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

// --- Homepage reads ---

async function getPublishedHomepageRow() {
  return prisma.homepage_content.findFirst({
    where: { status: "published" },
  });
}

// $queryRaw requis : LEFT JOIN LATERAL n'est pas supporté par Prisma ORM.
// La representativeImage de chaque catégorie est sélectionnée par critère LATERAL
// (produit publié le plus récent dans la catégorie).
// Revoir si Prisma ajoute le support natif LATERAL.
async function listHomepageFeaturedCategories(
  homepageContentId: string
): Promise<FeaturedCategory[]> {
  const rows = await prisma.$queryRaw<CategoryRow[]>(
    Prisma.sql`
      SELECT
        c.id::text AS id,
        c.name,
        c.slug,
        c.description,
        c.created_at,
        c.updated_at,
        rep_img.file_path AS rep_image_file_path,
        rep_img.alt_text  AS rep_image_alt_text
      FROM homepage_featured_categories hfc
      JOIN categories c ON c.id = hfc.category_id
      LEFT JOIN LATERAL (
        SELECT pi.file_path, pi.alt_text
        FROM product_categories pc
        JOIN products p  ON p.id  = pc.product_id
        JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
        WHERE pc.category_id = c.id
          AND p.status = 'published'
        ORDER BY p.created_at DESC
        LIMIT 1
      ) rep_img ON TRUE
      WHERE hfc.homepage_content_id = ${BigInt(homepageContentId)}
      ORDER BY hfc.sort_order ASC, c.id ASC
    `
  );

  return rows.map(mapCategory);
}

// $queryRaw requis : LEFT JOIN LATERAL n'est pas supporté par Prisma ORM.
// La sélection de l'image primaire d'un produit suit un critère complexe de priorité
// (image produit > image variante publiée, is_primary, sort_order) non exprimable via include.
// Revoir si Prisma ajoute le support natif LATERAL.
async function listHomepageFeaturedProducts(
  homepageContentId: string
): Promise<PublishedProductSummary[]> {
  const rows = await prisma.$queryRaw<ProductSummaryRow[]>(
    Prisma.sql`
      SELECT
        p.id::text AS id,
        p.name,
        p.slug,
        p.short_description,
        p.description,
        p.product_type,
        p.simple_sku,
        p.simple_price::text AS simple_price,
        p.simple_compare_at_price::text AS simple_compare_at_price,
        p.simple_stock_quantity,
        p.is_featured,
        p.seo_title,
        p.seo_description,
        p.created_at,
        p.updated_at,
        primary_image.id::text AS primary_image_id,
        primary_image.product_id::text AS primary_image_product_id,
        primary_image.variant_id::text AS primary_image_variant_id,
        primary_image.file_path AS primary_image_file_path,
        primary_image.alt_text AS primary_image_alt_text,
        primary_image.sort_order AS primary_image_sort_order,
        primary_image.is_primary AS primary_image_is_primary,
        primary_image.created_at AS primary_image_created_at,
        primary_image.updated_at AS primary_image_updated_at
      FROM homepage_featured_products hfp
      JOIN products p ON p.id = hfp.product_id
      LEFT JOIN LATERAL (
        SELECT
          pi.id, pi.product_id, pi.variant_id,
          pi.file_path, pi.alt_text, pi.sort_order,
          pi.is_primary, pi.created_at, pi.updated_at
        FROM product_images pi
        LEFT JOIN product_variants pv ON pv.id = pi.variant_id
        WHERE pi.product_id = p.id
          AND (pi.variant_id IS NULL OR pv.status = 'published')
        ORDER BY
          CASE WHEN pi.variant_id IS NULL THEN 0 ELSE 1 END ASC,
          pi.is_primary DESC,
          pi.sort_order ASC,
          pi.id ASC
        LIMIT 1
      ) AS primary_image ON TRUE
      WHERE hfp.homepage_content_id = ${BigInt(homepageContentId)}
        AND p.status = 'published'
      ORDER BY hfp.sort_order ASC, p.id ASC
    `
  );

  return rows.map(mapProductSummaryRow);
}

async function listHomepageFeaturedBlogPosts(
  homepageContentId: string
): Promise<PublishedBlogPostSummary[]> {
  const rows = await prisma.homepage_featured_blog_posts.findMany({
    where: {
      homepage_content_id: BigInt(homepageContentId),
      blog_posts: { status: "published" },
    },
    orderBy: [{ sort_order: "asc" }, { blog_post_id: "asc" }],
    select: {
      blog_posts: {
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          cover_image_path: true,
          published_at: true,
          created_at: true,
          updated_at: true,
        },
      },
    },
  });

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

// $queryRaw requis : plusieurs LEFT JOIN LATERAL non supportés par Prisma ORM :
// - sélection image primaire avec priorité produit/variante (CASE WHEN + LATERAL)
// - calcul legacy_simple_offer via array_agg ordonné (LATERAL)
// - calcul is_available via bool_or (LATERAL)
// - filtrage onlyAvailable et ordering featured first non exprimables autrement
// Revoir si Prisma ajoute le support natif LATERAL et des agrégats ordonnés.
export async function listPublishedProducts(
  filters: PublishedProductListFilters
): Promise<PublishedCatalogProductSummary[]> {
  const rows = await prisma.$queryRaw<ProductCatalogSummaryRow[]>(
    Prisma.sql`
      SELECT
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
      FROM (
        SELECT
          p.id::text AS id,
          p.name,
          p.slug,
          p.short_description,
          p.description,
          p.product_type,
          p.simple_sku,
          p.simple_price::text AS simple_price,
          p.simple_compare_at_price::text AS simple_compare_at_price,
          p.simple_stock_quantity,
          p.is_featured,
          CASE
            WHEN p.product_type = 'simple' THEN
              CASE
                WHEN p.simple_sku IS NOT NULL
                  AND btrim(p.simple_sku) <> ''
                  AND p.simple_price IS NOT NULL
                  AND p.simple_stock_quantity IS NOT NULL
                THEN p.simple_stock_quantity > 0
                WHEN COALESCE(legacy_simple_offer.legacy_exploitable_variant_count, 0) = 1
                  AND legacy_simple_offer.legacy_variant_sku IS NOT NULL
                  AND btrim(legacy_simple_offer.legacy_variant_sku) <> ''
                  AND legacy_simple_offer.legacy_variant_price IS NOT NULL
                  AND legacy_simple_offer.legacy_variant_stock_quantity IS NOT NULL
                THEN legacy_simple_offer.legacy_variant_stock_quantity > 0
                ELSE FALSE
              END
            ELSE COALESCE(published_variants.has_available_variant, FALSE)
          END AS is_available,
          COALESCE(legacy_simple_offer.legacy_exploitable_variant_count, 0)
            AS legacy_exploitable_variant_count,
          legacy_simple_offer.legacy_variant_sku,
          legacy_simple_offer.legacy_variant_price,
          legacy_simple_offer.legacy_variant_compare_at_price,
          legacy_simple_offer.legacy_variant_stock_quantity,
          p.seo_title,
          p.seo_description,
          p.created_at,
          p.updated_at,
          primary_image.id::text AS primary_image_id,
          primary_image.product_id::text AS primary_image_product_id,
          primary_image.variant_id::text AS primary_image_variant_id,
          primary_image.file_path AS primary_image_file_path,
          primary_image.alt_text AS primary_image_alt_text,
          primary_image.sort_order AS primary_image_sort_order,
          primary_image.is_primary AS primary_image_is_primary,
          primary_image.created_at AS primary_image_created_at,
          primary_image.updated_at AS primary_image_updated_at
        FROM products p
        LEFT JOIN LATERAL (
          SELECT
            pi.id, pi.product_id, pi.variant_id,
            pi.file_path, pi.alt_text, pi.sort_order,
            pi.is_primary, pi.created_at, pi.updated_at
          FROM product_images pi
          LEFT JOIN product_variants pv ON pv.id = pi.variant_id
          WHERE pi.product_id = p.id
            AND (pi.variant_id IS NULL OR pv.status = 'published')
          ORDER BY
            CASE WHEN pi.variant_id IS NULL THEN 0 ELSE 1 END ASC,
            pi.is_primary DESC,
            pi.sort_order ASC,
            pi.id ASC
          LIMIT 1
        ) AS primary_image ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            COUNT(*)::int AS legacy_exploitable_variant_count,
            (ARRAY_AGG(pv.sku ORDER BY pv.is_default DESC, pv.id ASC))[1] AS legacy_variant_sku,
            (ARRAY_AGG(pv.price::text ORDER BY pv.is_default DESC, pv.id ASC))[1] AS legacy_variant_price,
            (ARRAY_AGG(pv.compare_at_price::text ORDER BY pv.is_default DESC, pv.id ASC))[1] AS legacy_variant_compare_at_price,
            (ARRAY_AGG(pv.stock_quantity ORDER BY pv.is_default DESC, pv.id ASC))[1] AS legacy_variant_stock_quantity
          FROM product_variants pv
          WHERE pv.product_id = p.id
            AND pv.status = 'published'
            AND pv.sku IS NOT NULL
            AND btrim(pv.sku) <> ''
            AND pv.price IS NOT NULL
            AND pv.stock_quantity IS NOT NULL
        ) AS legacy_simple_offer ON TRUE
        LEFT JOIN LATERAL (
          SELECT COALESCE(BOOL_OR(pv.stock_quantity > 0), FALSE) AS has_available_variant
          FROM product_variants pv
          WHERE pv.product_id = p.id AND pv.status = 'published'
        ) AS published_variants ON TRUE
        WHERE p.status = 'published'
          AND (
            ${filters.searchQuery}::text IS NULL
            OR p.name ILIKE '%' || ${filters.searchQuery} || '%'
            OR p.slug ILIKE '%' || ${filters.searchQuery} || '%'
            OR EXISTS (
              SELECT 1
              FROM product_categories pc
              JOIN categories c ON c.id = pc.category_id
              WHERE pc.product_id = p.id
                AND (
                  c.name ILIKE '%' || ${filters.searchQuery} || '%'
                  OR c.slug ILIKE '%' || ${filters.searchQuery} || '%'
                )
            )
            OR EXISTS (
              SELECT 1
              FROM product_variants pv
              WHERE pv.product_id = p.id
                AND pv.status = 'published'
                AND pv.color_name ILIKE '%' || ${filters.searchQuery} || '%'
            )
          )
          AND (
            ${filters.categorySlug}::text IS NULL
            OR EXISTS (
              SELECT 1
              FROM product_categories pc
              JOIN categories c ON c.id = pc.category_id
              WHERE pc.product_id = p.id AND c.slug = ${filters.categorySlug}
            )
          )
      ) AS catalog_products
      WHERE NOT ${filters.onlyAvailable} OR catalog_products.is_available
      ORDER BY
        CASE
          WHEN ${filters.searchQuery}::text IS NULL
            AND ${filters.categorySlug}::text IS NULL
            AND NOT ${filters.onlyAvailable}
            AND catalog_products.is_featured
          THEN 0
          ELSE 1
        END ASC,
        catalog_products.created_at DESC,
        catalog_products.id DESC
    `
  );

  return rows.map(mapCatalogProductSummaryRow);
}

// --- Product detail reads ---

// $queryRaw requis : LEFT JOIN LATERAL n'est pas supporté par Prisma ORM.
// Sélection de l'image primaire d'un produit avec priorité complexe.
// Revoir si Prisma ajoute le support natif LATERAL.
async function getPublishedProductSummaryRowBySlug(
  slug: string
): Promise<ProductSummaryRow | null> {
  const rows = await prisma.$queryRaw<ProductSummaryRow[]>(
    Prisma.sql`
      SELECT
        p.id::text AS id,
        p.name,
        p.slug,
        p.short_description,
        p.description,
        p.product_type,
        p.simple_sku,
        p.simple_price::text AS simple_price,
        p.simple_compare_at_price::text AS simple_compare_at_price,
        p.simple_stock_quantity,
        p.is_featured,
        p.seo_title,
        p.seo_description,
        p.created_at,
        p.updated_at,
        primary_image.id::text AS primary_image_id,
        primary_image.product_id::text AS primary_image_product_id,
        primary_image.variant_id::text AS primary_image_variant_id,
        primary_image.file_path AS primary_image_file_path,
        primary_image.alt_text AS primary_image_alt_text,
        primary_image.sort_order AS primary_image_sort_order,
        primary_image.is_primary AS primary_image_is_primary,
        primary_image.created_at AS primary_image_created_at,
        primary_image.updated_at AS primary_image_updated_at
      FROM products p
      LEFT JOIN LATERAL (
        SELECT
          pi.id, pi.product_id, pi.variant_id,
          pi.file_path, pi.alt_text, pi.sort_order,
          pi.is_primary, pi.created_at, pi.updated_at
        FROM product_images pi
        LEFT JOIN product_variants pv ON pv.id = pi.variant_id
        WHERE pi.product_id = p.id
          AND (pi.variant_id IS NULL OR pv.status = 'published')
        ORDER BY
          CASE WHEN pi.variant_id IS NULL THEN 0 ELSE 1 END ASC,
          pi.is_primary DESC,
          pi.sort_order ASC,
          pi.id ASC
        LIMIT 1
      ) AS primary_image ON TRUE
      WHERE p.status = 'published'
        AND p.slug = ${slug}
      LIMIT 1
    `
  );

  return rows[0] ?? null;
}

export async function getPublishedProductBySlug(
  slug: string
): Promise<PublishedProductDetail | null> {
  const productRow = await getPublishedProductSummaryRowBySlug(slug);

  if (productRow === null) {
    return null;
  }

  const productId = BigInt(productRow.id);

  const [parentImages, variantRows, variantImageRows] = await Promise.all([
    prisma.product_images.findMany({
      where: { product_id: productId, variant_id: null },
      orderBy: [{ sort_order: "asc" }, { id: "asc" }],
    }),
    prisma.product_variants.findMany({
      where: { product_id: productId, status: "published" },
      orderBy: [{ is_default: "desc" }, { id: "asc" }],
    }),
    prisma.product_images.findMany({
      where: {
        product_id: productId,
        variant_id: { not: null },
        product_variants: { status: "published" },
      },
      orderBy: [{ sort_order: "asc" }, { id: "asc" }],
    }),
  ]);

  const allVariantImages = variantImageRows.map(mapPrismaProductImage);
  const imagesByVariantId = groupVariantImagesByVariantId(allVariantImages);
  const variants = variantRows.map((pv) =>
    mapPrismaProductVariant(pv, imagesByVariantId.get(pv.id.toString()) ?? [])
  );
  const simpleOffer = resolvePublishedSimpleOffer({
    productType: productRow.product_type,
    native: {
      sku: productRow.simple_sku,
      price: productRow.simple_price,
      compareAtPrice: productRow.simple_compare_at_price,
      stockQuantity: productRow.simple_stock_quantity,
    },
    legacyOffers: variantRows.map(getVariantSimpleOfferFields),
  });

  return {
    ...mapProductSummaryRow(productRow),
    isAvailable: getPublishedProductAvailability({
      productType: productRow.product_type,
      simpleOffer,
      variants,
    }),
    simpleOffer,
    images: parentImages.map(mapPrismaProductImage),
    variants,
  };
}

// $queryRaw requis : LEFT JOIN LATERAL pour la sélection d'image primaire.
// Revoir si Prisma ajoute le support natif LATERAL.
export async function listRecentPublishedProducts(
  limit: number
): Promise<PublishedProductSummary[]> {
  const rows = await prisma.$queryRaw<ProductSummaryRow[]>(
    Prisma.sql`
      SELECT
        p.id::text AS id,
        p.name,
        p.slug,
        p.short_description,
        p.description,
        p.product_type,
        p.simple_sku,
        p.simple_price::text AS simple_price,
        p.simple_compare_at_price::text AS simple_compare_at_price,
        p.simple_stock_quantity,
        p.is_featured,
        p.seo_title,
        p.seo_description,
        p.created_at,
        p.updated_at,
        primary_image.id::text AS primary_image_id,
        primary_image.product_id::text AS primary_image_product_id,
        primary_image.variant_id::text AS primary_image_variant_id,
        primary_image.file_path AS primary_image_file_path,
        primary_image.alt_text AS primary_image_alt_text,
        primary_image.sort_order AS primary_image_sort_order,
        primary_image.is_primary AS primary_image_is_primary,
        primary_image.created_at AS primary_image_created_at,
        primary_image.updated_at AS primary_image_updated_at
      FROM products p
      LEFT JOIN LATERAL (
        SELECT
          pi.id, pi.product_id, pi.variant_id,
          pi.file_path, pi.alt_text, pi.sort_order,
          pi.is_primary, pi.created_at, pi.updated_at
        FROM product_images pi
        LEFT JOIN product_variants pv ON pv.id = pi.variant_id
        WHERE pi.product_id = p.id
          AND (pi.variant_id IS NULL OR pv.status = 'published')
        ORDER BY
          CASE WHEN pi.variant_id IS NULL THEN 0 ELSE 1 END ASC,
          pi.is_primary DESC,
          pi.sort_order ASC,
          pi.id ASC
        LIMIT 1
      ) AS primary_image ON TRUE
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT ${limit}
    `
  );

  return rows.map(mapProductSummaryRow);
}

// --- Blog reads ---

export async function listPublishedBlogPosts(): Promise<PublishedBlogPostSummary[]> {
  const rows = await prisma.blog_posts.findMany({
    where: { status: "published" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      cover_image_path: true,
      published_at: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: [{ published_at: { sort: "desc", nulls: "last" } }, { id: "desc" }],
  });

  return rows.map(mapBlogPostSummary);
}

export async function getPublishedBlogPostBySlug(
  slug: string
): Promise<PublishedBlogPostDetail | null> {
  const row = await prisma.blog_posts.findFirst({
    where: { status: "published", slug },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      cover_image_path: true,
      published_at: true,
      seo_title: true,
      seo_description: true,
      created_at: true,
      updated_at: true,
    },
  });

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
