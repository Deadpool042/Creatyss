import { db } from "@/core/db";

type CatalogImage = {
  id: string;
  filePath: string;
  altText: string | null;
  isPrimary: boolean;
};

type CatalogVariant = {
  id: string;
  sku: string;
  name: string;
  colorName: string | null;
  colorHex: string | null;
  isDefault: boolean;
  isAvailable: boolean;
  price: string;
  compareAtPrice: string | null;
  images: CatalogImage[];
};

type CatalogProductDetail = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  productType: "simple" | "variable";
  isAvailable: boolean;
  images: CatalogImage[];
  variants: CatalogVariant[];
};

type CatalogProductListItem = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  isFeatured: boolean;
  isAvailable: boolean;
  primaryImage: {
    filePath: string;
    altText: string | null;
  } | null;
};

type CatalogCategoryFilterItem = {
  id: string;
  slug: string;
  name: string;
};

type CatalogBlogListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
};

type CatalogBlogDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  coverImagePath: string | null;
};

function formatMoney(value: { toString(): string } | null): string {
  if (value === null) {
    return "";
  }

  const parsed = Number.parseFloat(value.toString());

  if (!Number.isFinite(parsed)) {
    return value.toString();
  }

  return `${parsed.toFixed(2)} €`;
}

function getVariantAvailability(variant: {
  inventoryItems: Array<{
    onHandQuantity: number;
    reservedQuantity: number;
  }>;
}): boolean {
  return variant.inventoryItems.some(
    (item) => item.onHandQuantity - item.reservedQuantity > 0
  );
}

function mapImage(input: {
  id: string;
  storageKey: string;
  altText: string | null;
}): CatalogImage {
  return {
    id: input.id,
    filePath: input.storageKey,
    altText: input.altText,
    isPrimary: true,
  };
}

export async function listPublishedBlogPosts(): Promise<CatalogBlogListItem[]> {
  const posts = await db.blogPost.findMany({
    where: {
      status: "ACTIVE",
      archivedAt: null,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
    },
  });

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
  }));
}

export async function getPublishedBlogPostBySlug(
  slug: string
): Promise<CatalogBlogDetail | null> {
  const post = await db.blogPost.findFirst({
    where: {
      slug,
      status: "ACTIVE",
      archivedAt: null,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      body: true,
      publishedAt: true,
      coverImage: {
        select: {
          storageKey: true,
        },
      },
    },
  });

  if (post === null) {
    return null;
  }

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.body,
    seoTitle: null,
    seoDescription: null,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    coverImagePath: post.coverImage?.storageKey ?? null,
  };
}

export async function listCatalogFilterCategories(): Promise<CatalogCategoryFilterItem[]> {
  const categories = await db.category.findMany({
    where: {
      status: "ACTIVE",
      archivedAt: null,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
    },
  });

  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
  }));
}

export async function listPublishedProducts(input: {
  searchQuery: string | null;
  categorySlug: string | null;
  onlyAvailable: boolean;
}): Promise<CatalogProductListItem[]> {
  const products = await db.product.findMany({
    where: {
      status: "ACTIVE",
      archivedAt: null,
      ...(input.searchQuery
        ? {
            OR: [
              { name: { contains: input.searchQuery, mode: "insensitive" } },
              { slug: { contains: input.searchQuery, mode: "insensitive" } },
              { shortDescription: { contains: input.searchQuery, mode: "insensitive" } },
              { description: { contains: input.searchQuery, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(input.categorySlug
        ? {
            productCategories: {
              some: {
                category: {
                  slug: input.categorySlug,
                },
              },
            },
          }
        : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      shortDescription: true,
      description: true,
      isFeatured: true,
      primaryImage: {
        select: {
          storageKey: true,
          altText: true,
        },
      },
      variants: {
        where: {
          status: "ACTIVE",
          archivedAt: null,
        },
        select: {
          inventoryItems: {
            where: {
              status: "ACTIVE",
              archivedAt: null,
            },
            select: {
              onHandQuantity: true,
              reservedQuantity: true,
            },
          },
        },
      },
    },
  });

  const mapped = products.map((product) => {
    const isAvailable = product.variants.some(getVariantAvailability);

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      isFeatured: product.isFeatured,
      isAvailable,
      primaryImage: product.primaryImage
        ? {
            filePath: product.primaryImage.storageKey,
            altText: product.primaryImage.altText,
          }
        : null,
    };
  });

  return input.onlyAvailable ? mapped.filter((product) => product.isAvailable) : mapped;
}

export async function getPublishedProductBySlug(
  slug: string
): Promise<CatalogProductDetail | null> {
  const product = await db.product.findFirst({
    where: {
      slug,
      status: "ACTIVE",
      archivedAt: null,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      shortDescription: true,
      description: true,
      isStandalone: true,
      primaryImage: {
        select: {
          id: true,
          storageKey: true,
          altText: true,
        },
      },
      variants: {
        where: {
          status: "ACTIVE",
          archivedAt: null,
        },
        orderBy: [{ isDefault: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          sku: true,
          name: true,
          isDefault: true,
          primaryImage: {
            select: {
              id: true,
              storageKey: true,
              altText: true,
            },
          },
          inventoryItems: {
            where: {
              status: "ACTIVE",
              archivedAt: null,
            },
            select: {
              onHandQuantity: true,
              reservedQuantity: true,
            },
          },
          prices: {
            where: {
              isActive: true,
              archivedAt: null,
            },
            orderBy: {
              createdAt: "asc",
            },
            take: 1,
            select: {
              amount: true,
              compareAtAmount: true,
            },
          },
        },
      },
    },
  });

  if (product === null) {
    return null;
  }

  const variants: CatalogVariant[] = product.variants.map((variant) => {
    const activePrice = variant.prices[0] ?? null;
    const image = variant.primaryImage ? [mapImage(variant.primaryImage)] : [];

    return {
      id: variant.id,
      sku: variant.sku,
      name: variant.name ?? product.name,
      colorName: null,
      colorHex: null,
      isDefault: variant.isDefault,
      isAvailable: getVariantAvailability(variant),
      price: formatMoney(activePrice?.amount ?? null),
      compareAtPrice: formatMoney(activePrice?.compareAtAmount ?? null) || null,
      images: image,
    };
  });

  const images = product.primaryImage ? [mapImage(product.primaryImage)] : [];
  const isAvailable = variants.some((variant) => variant.isAvailable);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    seoTitle: null,
    seoDescription: null,
    productType: product.isStandalone ? "simple" : "variable",
    isAvailable,
    images,
    variants,
  };
}
