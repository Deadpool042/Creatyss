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

const featuredCategorySelect = Prisma.validator<Prisma.categoriesSelect>()({
  id: true,
  name: true,
  slug: true,
  description: true,
  created_at: true,
  updated_at: true,
});

type FeaturedCategoryRecord = Prisma.categoriesGetPayload<{
  select: typeof featuredCategorySelect;
}>;

const publishedProductSummarySelect = Prisma.validator<Prisma.productsSelect>()({
  id: true,
  name: true,
  slug: true,
  short_description: true,
  description: true,
  product_type: true,
  simple_sku: true,
  simple_price: true,
  simple_compare_at_price: true,
  simple_stock_quantity: true,
  is_featured: true,
  seo_title: true,
  seo_description: true,
  created_at: true,
  updated_at: true,
});

type PublishedProductSummaryRecord = Prisma.productsGetPayload<{
  select: typeof publishedProductSummarySelect;
}>;

const primaryProductImageSelect = Prisma.validator<Prisma.product_imagesSelect>()({
  id: true,
  product_id: true,
  variant_id: true,
  file_path: true,
  alt_text: true,
  sort_order: true,
  is_primary: true,
  created_at: true,
  updated_at: true,
});

type PrimaryProductImageRecord = Prisma.product_imagesGetPayload<{
  select: typeof primaryProductImageSelect;
}>;

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

type ProductRecencyRecord = {
  id: bigint;
  created_at: Date;
};

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

function getRepresentativeImage(
  primaryImage: PublishedProductImage | null
): FeaturedCategory["representativeImage"] {
  if (primaryImage === null) {
    return null;
  }

  return {
    filePath: primaryImage.filePath,
    altText: primaryImage.altText,
  };
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

function compareBigIntAsc(left: bigint, right: bigint): number {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

function compareBigIntDesc(left: bigint, right: bigint): number {
  return compareBigIntAsc(right, left);
}

function comparePrimaryProductImages(
  left: PrimaryProductImageRecord,
  right: PrimaryProductImageRecord
): number {
  const leftVariantPriority = left.variant_id === null ? 0 : 1;
  const rightVariantPriority = right.variant_id === null ? 0 : 1;

  if (leftVariantPriority !== rightVariantPriority) {
    return leftVariantPriority - rightVariantPriority;
  }

  if (left.is_primary !== right.is_primary) {
    return left.is_primary ? -1 : 1;
  }

  if (left.sort_order !== right.sort_order) {
    return left.sort_order - right.sort_order;
  }

  return compareBigIntAsc(left.id, right.id);
}

function selectPrimaryProductImage(
  candidates: readonly PrimaryProductImageRecord[]
): PublishedProductImage | null {
  let selectedCandidate: PrimaryProductImageRecord | null = null;

  for (const candidate of candidates) {
    if (selectedCandidate === null || comparePrimaryProductImages(candidate, selectedCandidate) < 0) {
      selectedCandidate = candidate;
    }
  }

  return selectedCandidate === null ? null : mapPrismaProductImage(selectedCandidate);
}

async function loadPrimaryProductImagesByProductIds(
  productIds: readonly bigint[]
): Promise<Map<DbId, PublishedProductImage | null>> {
  const uniqueProductIds = uniqueBigIntIds(productIds);
  const imagesByProductId = new Map<DbId, PublishedProductImage | null>();

  if (uniqueProductIds.length === 0) {
    return imagesByProductId;
  }

  const imageRows = await prisma.product_images.findMany({
    where: {
      product_id: { in: uniqueProductIds },
      OR: [{ variant_id: null }, { product_variants: { status: "published" } }],
    },
    select: primaryProductImageSelect,
  });

  const candidatesByProductId = new Map<DbId, PrimaryProductImageRecord[]>();

  for (const imageRow of imageRows) {
    const productId = toDbId(imageRow.product_id);
    const productImages = candidatesByProductId.get(productId);

    if (productImages) {
      productImages.push(imageRow);
      continue;
    }

    candidatesByProductId.set(productId, [imageRow]);
  }

  for (const productId of uniqueProductIds) {
    const key = toDbId(productId);
    imagesByProductId.set(key, selectPrimaryProductImage(candidatesByProductId.get(key) ?? []));
  }

  return imagesByProductId;
}

function isMoreRecentProduct(
  candidate: ProductRecencyRecord,
  current: ProductRecencyRecord
): boolean {
  const createdAtDelta = candidate.created_at.getTime() - current.created_at.getTime();

  if (createdAtDelta !== 0) {
    return createdAtDelta > 0;
  }

  return compareBigIntDesc(candidate.id, current.id) < 0;
}

async function loadRepresentativeImagesByCategoryIds(
  categoryIds: readonly bigint[]
): Promise<Map<DbId, FeaturedCategory["representativeImage"]>> {
  const uniqueCategoryIds = uniqueBigIntIds(categoryIds);
  const representativeImagesByCategoryId = new Map<DbId, FeaturedCategory["representativeImage"]>();

  if (uniqueCategoryIds.length === 0) {
    return representativeImagesByCategoryId;
  }

  const productCategoryRows = await prisma.product_categories.findMany({
    where: { category_id: { in: uniqueCategoryIds } },
    select: {
      category_id: true,
      product_id: true,
    },
  });

  const productIds = uniqueBigIntIds(productCategoryRows.map((row) => row.product_id));

  if (productIds.length === 0) {
    return representativeImagesByCategoryId;
  }

  const publishedProducts = await prisma.products.findMany({
    where: {
      id: { in: productIds },
      status: "published",
    },
    select: {
      id: true,
      created_at: true,
    },
  });

  const publishedProductsById = new Map<DbId, ProductRecencyRecord>();

  for (const product of publishedProducts) {
    publishedProductsById.set(toDbId(product.id), product);
  }

  const latestProductByCategoryId = new Map<DbId, ProductRecencyRecord>();

  for (const row of productCategoryRows) {
    const categoryId = toDbId(row.category_id);
    const publishedProduct = publishedProductsById.get(toDbId(row.product_id));

    if (publishedProduct === undefined) {
      continue;
    }

    const currentProduct = latestProductByCategoryId.get(categoryId);

    if (currentProduct === undefined || isMoreRecentProduct(publishedProduct, currentProduct)) {
      latestProductByCategoryId.set(categoryId, publishedProduct);
    }
  }

  const representativeProductIds = uniqueBigIntIds(
    [...latestProductByCategoryId.values()].map((product) => product.id)
  );
  const primaryImagesByProductId = await loadPrimaryProductImagesByProductIds(representativeProductIds);

  for (const categoryId of uniqueCategoryIds) {
    const key = toDbId(categoryId);
    const latestProduct = latestProductByCategoryId.get(key);

    if (latestProduct === undefined) {
      representativeImagesByCategoryId.set(key, null);
      continue;
    }

    representativeImagesByCategoryId.set(
      key,
      getRepresentativeImage(primaryImagesByProductId.get(toDbId(latestProduct.id)) ?? null)
    );
  }

  return representativeImagesByCategoryId;
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
  return prisma.homepage_content.findFirst({
    where: { status: "published" },
  });
}

async function listHomepageFeaturedCategories(
  homepageContentId: string
): Promise<FeaturedCategory[]> {
  const rows = await prisma.homepage_featured_categories.findMany({
    where: { homepage_content_id: BigInt(homepageContentId) },
    orderBy: [{ sort_order: "asc" }, { category_id: "asc" }],
    select: {
      categories: {
        select: featuredCategorySelect,
      },
    },
  });
  const categories = rows.map((row) => row.categories);
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
  const rows = await prisma.homepage_featured_products.findMany({
    where: {
      homepage_content_id: BigInt(homepageContentId),
      products: { status: "published" },
    },
    orderBy: [{ sort_order: "asc" }, { product_id: "asc" }],
    select: {
      products: {
        select: publishedProductSummarySelect,
      },
    },
  });
  const products = rows.map((row) => row.products);
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
  const products = await prisma.products.findMany({
    where: { status: "published" },
    orderBy: [{ created_at: "desc" }],
    take: limit,
    select: publishedProductSummarySelect,
  });
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
