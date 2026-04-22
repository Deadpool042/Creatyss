import { db } from "@/core/db";
import { getUploadsPublicPath } from "@/core/uploads";

type CatalogImage = {
  src: string;
  alt: string | null;
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

export type CatalogProductCharacteristic = {
  id: string;
  label: string;
  value: string;
};

type CatalogProductDetail = {
  id: string;
  slug: string;
  name: string;
  marketingHook: string | null;
  shortDescription: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoIndexingMode: "INDEX_FOLLOW" | "INDEX_NOFOLLOW" | "NOINDEX_FOLLOW" | "NOINDEX_NOFOLLOW" | null;
  seoCanonicalPath: string | null;
  seoOpenGraphTitle: string | null;
  seoOpenGraphDescription: string | null;
  seoOpenGraphImageUrl: string | null;
  seoTwitterTitle: string | null;
  seoTwitterDescription: string | null;
  seoTwitterImageUrl: string | null;
  productType: "simple" | "variable";
  isAvailable: boolean;
  images: CatalogImage[];
  variants: CatalogVariant[];
  relatedProductGroups: CatalogRelatedProductGroup[];
  characteristics: CatalogProductCharacteristic[];
};

export type CatalogRelatedProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  imageFilePath: string | null;
  imageAltText: string | null;
};

export type CatalogRelatedProductGroup = {
  type: "related" | "cross_sell" | "up_sell" | "accessory" | "similar";
  label: string;
  products: CatalogRelatedProduct[];
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

type CatalogSitemapProduct = {
  slug: string;
  updatedAt: Date;
  sitemapIncluded: boolean;
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
  return variant.inventoryItems.some((item) => item.onHandQuantity - item.reservedQuantity > 0);
}

function mapImage(
  input: { storageKey: string; altText: string | null },
  uploadsPublicPath: string
): CatalogImage {
  return {
    src: `${uploadsPublicPath}/${input.storageKey.replace(/^\/+/, "")}`,
    alt: input.altText,
  };
}

export async function getPublishedProductsForSitemap(): Promise<CatalogSitemapProduct[]> {
  const products = await db.product.findMany({
    where: {
      status: "ACTIVE",
      archivedAt: null,
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      updatedAt: true,
    },
  });

  if (products.length === 0) {
    return [];
  }

  const productIds = products.map((p) => p.id);

  const seoMetadataList = await db.seoMetadata.findMany({
    where: {
      subjectType: "PRODUCT",
      subjectId: { in: productIds },
      archivedAt: null,
    },
    select: {
      subjectId: true,
      sitemapIncluded: true,
    },
  });

  const seoMap = new Map(seoMetadataList.map((s) => [s.subjectId, s.sitemapIncluded]));

  return products.map((product) => ({
    slug: product.slug,
    updatedAt: product.updatedAt,
    // default: true — a published product with no SeoMetadata must appear in the sitemap
    sitemapIncluded: seoMap.get(product.id) ?? true,
  }));
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

export async function getPublishedBlogPostBySlug(slug: string): Promise<CatalogBlogDetail | null> {
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
      storeId: true,
      slug: true,
      name: true,
      marketingHook: true,
      shortDescription: true,
      description: true,
      isStandalone: true,
      primaryImage: {
        select: {
          storageKey: true,
          altText: true,
        },
      },
      // Filtre isActive: true aligné sur le filtre variant-level (ProductVariantPrice).
      // Note : productCategories non fetché en V1 — non requis par la fiche storefront.
      prices: {
        where: { isActive: true, archivedAt: null },
        orderBy: { createdAt: "asc" as const },
        take: 1,
        select: {
          amount: true,
          compareAtAmount: true,
        },
      },
      variants: {
        where: {
          // Storefront : seules les variantes publiées (ACTIVE) sont exposées.
          // Admin (preview) : archivedAt: null seul — DRAFT/INACTIVE inclus intentionnellement
          // pour que la preview reflète l'état réel du produit avant publication.
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
              storageKey: true,
              altText: true,
            },
          },
          // Disponibilité V1 : calculée depuis l'inventaire (onHandQuantity - reservedQuantity).
          // AvailabilityRecord.isSellable (domaine availability) non utilisé en V1 —
          // à intégrer quand le domaine availability sera alimenté.
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
          // optionValues non fetché en V1 — colorName/colorHex toujours null.
          // À câbler quand les options de variante seront affichées.
        },
      },
      relatedFrom: {
        where: {
          targetProduct: {
            status: "ACTIVE",
            archivedAt: null,
          },
        },
        orderBy: { sortOrder: "asc" },
        select: {
          type: true,
          targetProduct: {
            select: {
              id: true,
              slug: true,
              name: true,
              shortDescription: true,
              primaryImage: {
                select: {
                  storageKey: true,
                  altText: true,
                },
              },
            },
          },
        },
      },
      characteristics: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          label: true,
          value: true,
        },
      },
    },
  });

  if (product === null) {
    return null;
  }

  const seoMetadata = await db.seoMetadata.findFirst({
    where: {
      storeId: product.storeId,
      subjectType: "PRODUCT",
      subjectId: product.id,
      archivedAt: null,
    },
    select: {
      metaTitle: true,
      metaDescription: true,
      indexingMode: true,
      canonicalPath: true,
      openGraphTitle: true,
      openGraphDescription: true,
      openGraphImage: {
        select: {
          storageKey: true,
        },
      },
      twitterTitle: true,
      twitterDescription: true,
      twitterImage: {
        select: {
          storageKey: true,
        },
      },
    },
  });

  const productLevelPrice = product.prices[0] ?? null;
  const uploadsPublicPath = getUploadsPublicPath();

  const variants: CatalogVariant[] = product.variants.map((variant) => {
    const variantPrice = variant.prices[0] ?? null;
    const activePrice = variantPrice ?? productLevelPrice;
    // compareAtAmount : hérite du niveau produit si la variante ne le porte pas.
    // Cas fréquent pour les produits importés (WooCommerce) où compareAtAmount
    // n'est renseigné qu'en product_prices mais pas en product_variant_prices.
    const compareAtAmount =
      variantPrice?.compareAtAmount ?? productLevelPrice?.compareAtAmount ?? null;
    const image = variant.primaryImage ? [mapImage(variant.primaryImage, uploadsPublicPath)] : [];

    return {
      id: variant.id,
      sku: variant.sku,
      name: variant.name ?? product.name,
      colorName: null,
      colorHex: null,
      isDefault: variant.isDefault,
      isAvailable: getVariantAvailability(variant),
      price: formatMoney(activePrice?.amount ?? null),
      compareAtPrice: formatMoney(compareAtAmount) || null,
      images: image,
    };
  });

  const images = product.primaryImage ? [mapImage(product.primaryImage, uploadsPublicPath)] : [];
  const isAvailable = variants.some((variant) => variant.isAvailable);

  const ogImageStorageKey = seoMetadata?.openGraphImage?.storageKey ?? null;
  const twitterImageStorageKey = seoMetadata?.twitterImage?.storageKey ?? null;

  const relatedTypeConfig: Record<
    string,
    { type: CatalogRelatedProductGroup["type"]; label: string }
  > = {
    RELATED: { type: "related", label: "À découvrir aussi" },
    CROSS_SELL: { type: "cross_sell", label: "Compléter avec" },
    UP_SELL: { type: "up_sell", label: "Version premium" },
    ACCESSORY: { type: "accessory", label: "Accessoires conseillés" },
    SIMILAR: { type: "similar", label: "Alternative similaire" },
  };

  const relatedTypeOrder = ["RELATED", "CROSS_SELL", "UP_SELL", "ACCESSORY", "SIMILAR"] as const;
  const relatedGroupsMap = new Map<string, CatalogRelatedProduct[]>();

  for (const rel of product.relatedFrom) {
    const config = relatedTypeConfig[rel.type];
    if (!config) continue;
    if (!relatedGroupsMap.has(rel.type)) {
      relatedGroupsMap.set(rel.type, []);
    }
    relatedGroupsMap.get(rel.type)!.push({
      id: rel.targetProduct.id,
      slug: rel.targetProduct.slug,
      name: rel.targetProduct.name,
      shortDescription: rel.targetProduct.shortDescription,
      imageFilePath: rel.targetProduct.primaryImage?.storageKey ?? null,
      imageAltText: rel.targetProduct.primaryImage?.altText ?? null,
    });
  }

  const relatedProductGroups: CatalogRelatedProductGroup[] = relatedTypeOrder
    .filter((t) => relatedGroupsMap.has(t))
    .map((t) => ({
      type: relatedTypeConfig[t]!.type,
      label: relatedTypeConfig[t]!.label,
      products: relatedGroupsMap.get(t)!,
    }));

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    marketingHook: product.marketingHook,
    shortDescription: product.shortDescription,
    description: product.description,
    seoTitle: seoMetadata?.metaTitle ?? null,
    seoDescription: seoMetadata?.metaDescription ?? null,
    seoIndexingMode: seoMetadata?.indexingMode ?? null,
    seoCanonicalPath: seoMetadata?.canonicalPath ?? null,
    seoOpenGraphTitle: seoMetadata?.openGraphTitle ?? null,
    seoOpenGraphDescription: seoMetadata?.openGraphDescription ?? null,
    seoOpenGraphImageUrl: ogImageStorageKey
      ? `${uploadsPublicPath}/${ogImageStorageKey.replace(/^\/+/, "")}`
      : null,
    seoTwitterTitle: seoMetadata?.twitterTitle ?? null,
    seoTwitterDescription: seoMetadata?.twitterDescription ?? null,
    seoTwitterImageUrl: twitterImageStorageKey
      ? `${uploadsPublicPath}/${twitterImageStorageKey.replace(/^\/+/, "")}`
      : null,
    productType: product.isStandalone ? "simple" : "variable",
    isAvailable,
    images,
    variants,
    relatedProductGroups,
    characteristics: product.characteristics.map((c) => ({
      id: c.id,
      label: c.label,
      value: c.value,
    })),
  };
}
