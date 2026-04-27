/**
 * Query admin dédiée à la preview produit.
 *
 * Différences clés vs getPublishedProductBySlug (storefront) :
 * - Pas de filtre `status: "ACTIVE"` sur le produit principal.
 * - `archivedAt: null` conservé sur le produit.
 * - `status` du produit remonté dans le retour (forme admin lowercase).
 * - Variantes : filtre `archivedAt: null` uniquement (DRAFT inclus) pour que la
 *   preview admin reflète les données réelles même avant publication.
 * - Prix : lecture depuis `ProductPrice` (product-level) en fallback — les prix sont
 *   écrits par `updateProductPrices` sur `ProductPrice`, pas sur `ProductVariantPrice`.
 * - Images : retournées sous forme d'URL résolue (getUploadsPublicPath) plutôt que
 *   de storageKey brut.
 */
import { db } from "@/core/db";
import { getUploadsPublicPath } from "@/core/uploads";
import { mapAdminProductStatus } from "@/features/admin/products/mappers";
import type { AdminProductLifecycleStatus } from "@/features/admin/products/types";
import type { SeoIndexingMode } from "@/entities/seo";
import {
  buildCatalogImageUrl,
  dedupeCatalogImages,
} from "@/features/storefront/catalog/helpers/catalog-images";
import { formatCatalogMoney } from "@/features/storefront/catalog/helpers/catalog-pricing";
import { getCatalogVariantAvailability } from "@/features/storefront/catalog/helpers/catalog-availability";
import {
  CATALOG_RELATED_TYPE_CONFIG,
  CATALOG_RELATED_TYPE_ORDER,
  type CatalogRelatedTypeKey,
} from "@/features/storefront/catalog/helpers/related-product-groups";

// ---------------------------------------------------------------------------
// Types exportés — utilisés par PREV-2 (page preview)
// ---------------------------------------------------------------------------

export type AdminProductPreviewCharacteristic = {
  id: string;
  label: string;
  value: string;
};

export type AdminProductPreviewImage = {
  src: string;
  alt: string | null;
};

export type AdminProductPreviewVariant = {
  id: string;
  sku: string;
  name: string;
  isDefault: boolean;
  isAvailable: boolean;
  price: string;
  compareAtPrice: string | null;
  images: AdminProductPreviewImage[];
  colorName: string | null;
  colorHex: string | null;
};

export type AdminProductPreviewRelatedProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  imageFilePath: string | null;
  imageAltText: string | null;
};

export type AdminProductPreviewRelatedProductGroup = {
  type: "related" | "cross_sell" | "up_sell" | "accessory" | "similar";
  label: string;
  products: AdminProductPreviewRelatedProduct[];
};

export type AdminProductPreview = {
  id: string;
  slug: string;
  name: string;
  marketingHook: string | null;
  shortDescription: string | null;
  description: string | null;
  status: AdminProductLifecycleStatus;
  productType: "simple" | "variable";
  isAvailable: boolean;
  images: AdminProductPreviewImage[];
  variants: AdminProductPreviewVariant[];
  relatedProductGroups: AdminProductPreviewRelatedProductGroup[];
  characteristics: AdminProductPreviewCharacteristic[];
  seoTitle: string | null;
  seoDescription: string | null;
  seoIndexingMode: SeoIndexingMode | null;
  seoCanonicalPath: string | null;
  seoOpenGraphTitle: string | null;
  seoOpenGraphDescription: string | null;
  seoOpenGraphImageUrl: string | null;
  seoTwitterTitle: string | null;
  seoTwitterDescription: string | null;
  seoTwitterImageUrl: string | null;
};

// ---------------------------------------------------------------------------
// Query principale
// ---------------------------------------------------------------------------

export async function getAdminProductPreviewBySlug(
  slug: string
): Promise<AdminProductPreview | null> {
  const product = await db.product.findFirst({
    where: {
      slug,
      // Pas de filtre status: "ACTIVE" — la preview admin doit afficher DRAFT et INACTIVE aussi.
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
      status: true,
      isStandalone: true,
      primaryImage: {
        select: {
          id: true,
          storageKey: true,
          altText: true,
        },
      },
      // Prix produit-level (ProductPrice) — source canonique V1.
      // Filtre isActive: true aligné sur le filtre variant-level (ProductVariantPrice).
      // Note : productCategories non fetché en V1 — non requis par la preview admin.
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

  const [seoMetadata, galleryImageReferences] = await Promise.all([
    db.seoMetadata.findFirst({
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
    }),
    db.mediaReference.findMany({
      where: {
        subjectType: "PRODUCT",
        subjectId: product.id,
        role: "GALLERY",
        isActive: true,
        archivedAt: null,
        asset: {
          archivedAt: null,
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        asset: {
          select: {
            storageKey: true,
            altText: true,
          },
        },
      },
    }),
  ]);

  const uploadsPublicPath = getUploadsPublicPath();

  const primaryImage: AdminProductPreviewImage[] = product.primaryImage
    ? [
        {
          src: buildCatalogImageUrl(product.primaryImage.storageKey, uploadsPublicPath),
          alt: product.primaryImage.altText,
        },
      ]
    : [];
  const galleryImages: AdminProductPreviewImage[] = galleryImageReferences.map((reference) => ({
    src: buildCatalogImageUrl(reference.asset.storageKey, uploadsPublicPath),
    alt: reference.asset.altText,
  }));
  const images = dedupeCatalogImages([...primaryImage, ...galleryImages]);

  const productLevelPrice = product.prices[0] ?? null;

  const variants: AdminProductPreviewVariant[] = product.variants.map((variant) => {
    const variantPrice = variant.prices[0] ?? null;
    const activePrice = variantPrice ?? productLevelPrice;
    // compareAtAmount : hérite du niveau produit si la variante ne le porte pas.
    // Cas fréquent pour les produits importés où compareAtAmount n'est renseigné
    // qu'en product_prices mais pas en product_variant_prices.
    const compareAtAmount =
      variantPrice?.compareAtAmount ?? productLevelPrice?.compareAtAmount ?? null;
    const variantImages: AdminProductPreviewImage[] = variant.primaryImage
      ? [
          {
            src: buildCatalogImageUrl(variant.primaryImage.storageKey, uploadsPublicPath),
            alt: variant.primaryImage.altText,
          },
        ]
      : [];

    return {
      id: variant.id,
      sku: variant.sku,
      name: variant.name ?? product.name,
      colorName: null,
      colorHex: null,
      isDefault: variant.isDefault,
      isAvailable: getCatalogVariantAvailability(variant),
      price: formatCatalogMoney(activePrice?.amount ?? null),
      compareAtPrice: formatCatalogMoney(compareAtAmount) || null,
      images: variantImages,
    };
  });

  const isAvailable = variants.some((variant) => variant.isAvailable);

  const relatedGroupsMap = new Map<CatalogRelatedTypeKey, AdminProductPreviewRelatedProduct[]>();

  for (const rel of product.relatedFrom) {
    const key = rel.type as CatalogRelatedTypeKey;
    if (!(key in CATALOG_RELATED_TYPE_CONFIG)) continue;
    if (!relatedGroupsMap.has(key)) {
      relatedGroupsMap.set(key, []);
    }
    relatedGroupsMap.get(key)!.push({
      id: rel.targetProduct.id,
      slug: rel.targetProduct.slug,
      name: rel.targetProduct.name,
      shortDescription: rel.targetProduct.shortDescription,
      imageFilePath: rel.targetProduct.primaryImage?.storageKey ?? null,
      imageAltText: rel.targetProduct.primaryImage?.altText ?? null,
    });
  }

  const relatedProductGroups: AdminProductPreviewRelatedProductGroup[] = CATALOG_RELATED_TYPE_ORDER.filter(
    (t) => relatedGroupsMap.has(t)
  ).map((t) => ({
    type: CATALOG_RELATED_TYPE_CONFIG[t]!.type,
    label: CATALOG_RELATED_TYPE_CONFIG[t]!.label,
    products: relatedGroupsMap.get(t)!,
  }));

  const ogImageStorageKey = seoMetadata?.openGraphImage?.storageKey ?? null;
  const twitterImageStorageKey = seoMetadata?.twitterImage?.storageKey ?? null;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    marketingHook: product.marketingHook,
    shortDescription: product.shortDescription,
    description: product.description,
    status: mapAdminProductStatus(product.status),
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
    seoTitle: seoMetadata?.metaTitle ?? null,
    seoDescription: seoMetadata?.metaDescription ?? null,
    seoIndexingMode: (seoMetadata?.indexingMode as SeoIndexingMode) ?? null,
    seoCanonicalPath: seoMetadata?.canonicalPath ?? null,
    seoOpenGraphTitle: seoMetadata?.openGraphTitle ?? null,
    seoOpenGraphDescription: seoMetadata?.openGraphDescription ?? null,
    seoOpenGraphImageUrl: ogImageStorageKey
      ? buildCatalogImageUrl(ogImageStorageKey, uploadsPublicPath)
      : null,
    seoTwitterTitle: seoMetadata?.twitterTitle ?? null,
    seoTwitterDescription: seoMetadata?.twitterDescription ?? null,
    seoTwitterImageUrl: twitterImageStorageKey
      ? buildCatalogImageUrl(twitterImageStorageKey, uploadsPublicPath)
      : null,
  };
}
