import { prisma } from "@/db/prisma-client";
import {
  mapPrismaProductImage,
  mapPrismaProductVariant,
  groupVariantImagesByVariantId,
  getVariantSimpleOfferFields,
  resolvePublishedSimpleOffer,
  getPublishedProductAvailability,
} from "../catalog.mappers";
import {
  primaryProductImageSelect,
  selectPrimaryProductImage,
} from "../helpers/primary-image";
import { mapPublishedProductSummaryRecord } from "../helpers/product-summary";
import { publishedProductSummarySelect } from "./recent-products.queries";
import { getNativeSimpleOfferFields } from "./catalog-listing.queries";

import { Prisma } from "@prisma/client";
import type { PublishedProductDetail } from "../types/outputs";

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

function toPublishedProductType(value: string): "simple" | "variable" {
  return value as "simple" | "variable";
}

export async function getPublishedProductDetailBySlug(
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
