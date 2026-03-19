import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  mapCatalogFilterCategory,
  mapPrismaProductImage,
  mapPrismaProductVariant,
  getVariantSimpleOfferFields,
  groupVariantImagesByVariantId,
  getPublishedProductAvailability,
  resolvePublishedSimpleOffer,
  mapBlogPostSummary,
} from "./catalog.mappers";
import {
  loadRepresentativeImagesByCategoryIds,
} from "./helpers/category-representative-image";
import {
  loadPrimaryProductImagesByProductIds,
  primaryProductImageSelect,
  selectPrimaryProductImage,
} from "./helpers/primary-image";
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
  publishedProductSummarySelect,
  type PublishedProductSummaryRecord,
} from "./queries/recent-products.queries";

import type {
  DbId,
  FeaturedCategory,
  CatalogFilterCategory,
  PublishedProductImage,
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

const publishedVariantOfferSelect = Prisma.validator<Prisma.product_variantsSelect>()({
  product_id: true,
  sku: true,
  price: true,
  compare_at_price: true,
  stock_quantity: true,
});

type PublishedVariantOfferRecord = Prisma.product_variantsGetPayload<{
  select: typeof publishedVariantOfferSelect;
}>;

const publishedVariantDetailSelect = Prisma.validator<Prisma.product_variantsSelect>()({
  id: true,
  product_id: true,
  name: true,
  color_name: true,
  color_hex: true,
  sku: true,
  price: true,
  compare_at_price: true,
  stock_quantity: true,
  is_default: true,
  created_at: true,
  updated_at: true,
});

type PublishedVariantDetailRecord = Prisma.product_variantsGetPayload<{
  select: typeof publishedVariantDetailSelect;
}>;

type SimpleOfferNativeSource = Pick<
  PublishedProductSummaryRecord,
  "simple_sku" | "simple_price" | "simple_compare_at_price" | "simple_stock_quantity"
>;

function uniqueBigIntIds(ids: readonly bigint[]): bigint[] {
  const seen = new Set<string>();
  const uniqueIds: bigint[] = [];

  for (const id of ids) {
    const key = id.toString();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    uniqueIds.push(id);
  }

  return uniqueIds;
}

function toDbId(id: bigint): DbId {
  return id.toString();
}

function toPublishedProductType(value: string): PublishedProductSummary["productType"] {
  return value as PublishedProductSummary["productType"];
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

function mapPublishedProductSummaryRecord(
  product: PublishedProductSummaryRecord,
  primaryImage: PublishedProductImage | null
): PublishedProductSummary {
  return {
    id: toDbId(product.id),
    name: product.name,
    slug: product.slug,
    shortDescription: product.short_description,
    description: product.description,
    productType: toPublishedProductType(product.product_type),
    isFeatured: product.is_featured,
    seoTitle: product.seo_title,
    seoDescription: product.seo_description,
    createdAt: product.created_at.toISOString(),
    updatedAt: product.updated_at.toISOString(),
    primaryImage,
  };
}

async function loadPublishedVariantOffersByProductIds(
  productIds: readonly bigint[]
): Promise<Map<DbId, PublishedVariantOfferRecord[]>> {
  const uniqueProductIds = uniqueBigIntIds(productIds);
  const variantRowsByProductId = new Map<DbId, PublishedVariantOfferRecord[]>();

  if (uniqueProductIds.length === 0) {
    return variantRowsByProductId;
  }

  const variantRows = await prisma.product_variants.findMany({
    where: {
      product_id: { in: uniqueProductIds },
      status: "published",
    },
    select: publishedVariantOfferSelect,
  });

  for (const variantRow of variantRows) {
    const productId = toDbId(variantRow.product_id);
    const productVariants = variantRowsByProductId.get(productId);

    if (productVariants) {
      productVariants.push(variantRow);
      continue;
    }

    variantRowsByProductId.set(productId, [variantRow]);
  }

  return variantRowsByProductId;
}

function getNativeSimpleOfferFields(source: SimpleOfferNativeSource) {
  return {
    sku: source.simple_sku,
    price: source.simple_price?.toString() ?? null,
    compareAtPrice: source.simple_compare_at_price?.toString() ?? null,
    stockQuantity: source.simple_stock_quantity,
  };
}

async function getPublishedProductIdsMatchingVariantColor(
  searchQuery: string
): Promise<bigint[]> {
  const rows = await prisma.product_variants.findMany({
    where: {
      status: "published",
      color_name: {
        contains: searchQuery,
        mode: "insensitive",
      },
    },
    select: { product_id: true },
  });

  return uniqueBigIntIds(rows.map((row) => row.product_id));
}

async function buildPublishedProductsWhere(
  filters: PublishedProductListFilters
): Promise<Prisma.productsWhereInput> {
  const where: Prisma.productsWhereInput = {
    status: "published",
  };
  const andClauses: Prisma.productsWhereInput[] = [];

  if (filters.searchQuery !== null) {
    const matchingVariantProductIds = await getPublishedProductIdsMatchingVariantColor(
      filters.searchQuery
    );

    andClauses.push({
      OR: [
        {
          name: {
            contains: filters.searchQuery,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: filters.searchQuery,
            mode: "insensitive",
          },
        },
        {
          product_categories: {
            some: {
              categories: {
                OR: [
                  {
                    name: {
                      contains: filters.searchQuery,
                      mode: "insensitive",
                    },
                  },
                  {
                    slug: {
                      contains: filters.searchQuery,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            },
          },
        },
        ...(matchingVariantProductIds.length > 0
          ? [
              {
                id: {
                  in: matchingVariantProductIds,
                },
              },
            ]
          : []),
      ],
    });
  }

  if (filters.categorySlug !== null) {
    andClauses.push({
      product_categories: {
        some: {
          categories: {
            slug: filters.categorySlug,
          },
        },
      },
    });
  }

  if (andClauses.length > 0) {
    where.AND = andClauses;
  }

  return where;
}

function getPublishedProductsOrderBy(
  filters: PublishedProductListFilters
): Prisma.productsOrderByWithRelationInput[] {
  if (
    filters.searchQuery === null &&
    filters.categorySlug === null &&
    !filters.onlyAvailable
  ) {
    return [{ is_featured: "desc" }, { created_at: "desc" }, { id: "desc" }];
  }

  return [{ created_at: "desc" }, { id: "desc" }];
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
  const where = await buildPublishedProductsWhere(filters);
  const products = await prisma.products.findMany({
    where,
    orderBy: getPublishedProductsOrderBy(filters),
    select: publishedProductSummarySelect,
  });
  const productIds = products.map((product) => product.id);
  const [primaryImagesByProductId, variantOffersByProductId] = await Promise.all([
    loadPrimaryProductImagesByProductIds(productIds),
    loadPublishedVariantOffersByProductIds(productIds),
  ]);

  const publishedProducts = products.map((product) => {
    const productId = toDbId(product.id);
    const publishedVariantOffers = variantOffersByProductId.get(productId) ?? [];
    const simpleOffer = resolvePublishedSimpleOffer({
      productType: toPublishedProductType(product.product_type),
      native: getNativeSimpleOfferFields(product),
      legacyOffers: publishedVariantOffers.map(getVariantSimpleOfferFields),
    });
    const isAvailable =
      product.product_type === "simple"
        ? simpleOffer?.isAvailable ?? false
        : publishedVariantOffers.some((variant) => variant.stock_quantity > 0);

    return {
      ...mapPublishedProductSummaryRecord(
        product,
        primaryImagesByProductId.get(productId) ?? null
      ),
      isAvailable,
      simpleOffer,
    } satisfies PublishedCatalogProductSummary;
  });

  if (!filters.onlyAvailable) {
    return publishedProducts;
  }

  return publishedProducts.filter((product) => product.isAvailable);
}

// --- Product detail reads ---

export async function getPublishedProductBySlug(
  slug: string
): Promise<PublishedProductDetail | null> {
  const productRow = await prisma.products.findFirst({
    where: {
      status: "published",
      slug,
    },
    select: publishedProductSummarySelect,
  });

  if (productRow === null) {
    return null;
  }

  const productId = productRow.id;

  const [parentImageRows, variantRows, variantImageRows] = await Promise.all([
    prisma.product_images.findMany({
      where: { product_id: productId, variant_id: null },
      orderBy: [{ sort_order: "asc" }, { id: "asc" }],
      select: primaryProductImageSelect,
    }),
    prisma.product_variants.findMany({
      where: { product_id: productId, status: "published" },
      orderBy: [{ is_default: "desc" }, { id: "asc" }],
      select: publishedVariantDetailSelect,
    }),
    prisma.product_images.findMany({
      where: {
        product_id: productId,
        variant_id: { not: null },
        product_variants: { status: "published" },
      },
      orderBy: [{ sort_order: "asc" }, { id: "asc" }],
      select: primaryProductImageSelect,
    }),
  ]);

  const allVariantImages = variantImageRows.map(mapPrismaProductImage);
  const imagesByVariantId = groupVariantImagesByVariantId(allVariantImages);
  const variants = variantRows.map((pv: PublishedVariantDetailRecord) =>
    mapPrismaProductVariant(pv, imagesByVariantId.get(pv.id.toString()) ?? [])
  );
  const simpleOffer = resolvePublishedSimpleOffer({
    productType: toPublishedProductType(productRow.product_type),
    native: getNativeSimpleOfferFields(productRow),
    legacyOffers: variantRows.map(getVariantSimpleOfferFields),
  });
  const primaryImage = selectPrimaryProductImage([...parentImageRows, ...variantImageRows]);

  return {
    ...mapPublishedProductSummaryRecord(productRow, primaryImage),
    isAvailable: getPublishedProductAvailability({
      productType: toPublishedProductType(productRow.product_type),
      simpleOffer,
      variants,
    }),
    simpleOffer,
    images: parentImageRows.map(mapPrismaProductImage),
    variants,
  };
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
