import { prisma } from "@/db/prisma-client";
import { isRepresentativeImageCandidateBetter } from "../helpers/sort";

type AdminCategoryRepresentativeImage = {
  filePath: string;
  altText: string | null;
};

type RepresentativeImageCandidate = {
  productId: bigint;
  createdAt: Date;
  representativeImage: AdminCategoryRepresentativeImage;
};

export async function loadRepresentativeImagesByCategoryIds(
  categoryIds: readonly string[]
): Promise<Map<string, AdminCategoryRepresentativeImage | null>> {
  const representativeImagesByCategoryId = new Map<string, AdminCategoryRepresentativeImage | null>();

  if (categoryIds.length === 0) {
    return representativeImagesByCategoryId;
  }

  const categoryIdValues = categoryIds.map((categoryId) => BigInt(categoryId));

  const productLinks = await prisma.product_categories.findMany({
    where: { category_id: { in: categoryIdValues } },
    select: { category_id: true, product_id: true },
  });

  if (productLinks.length === 0) {
    for (const categoryId of categoryIds) {
      representativeImagesByCategoryId.set(categoryId, null);
    }

    return representativeImagesByCategoryId;
  }

  const productIds = [...new Set(productLinks.map((link) => link.product_id.toString()))].map(
    (productId) => BigInt(productId)
  );

  const publishedProducts = await prisma.products.findMany({
    where: {
      id: { in: productIds },
      status: "published",
    },
    select: { id: true, created_at: true },
  });

  if (publishedProducts.length === 0) {
    for (const categoryId of categoryIds) {
      representativeImagesByCategoryId.set(categoryId, null);
    }

    return representativeImagesByCategoryId;
  }

  const publishedProductIds = publishedProducts.map((product) => product.id);
  const primaryProductImages = await prisma.product_images.findMany({
    where: {
      product_id: { in: publishedProductIds },
      is_primary: true,
      variant_id: null,
    },
    select: { product_id: true, file_path: true, alt_text: true },
  });

  const imageByProductId = new Map<string, AdminCategoryRepresentativeImage>();

  for (const image of primaryProductImages) {
    imageByProductId.set(image.product_id.toString(), {
      filePath: image.file_path,
      altText: image.alt_text,
    });
  }

  const candidateByProductId = new Map<string, RepresentativeImageCandidate>();

  for (const product of publishedProducts) {
    const representativeImage = imageByProductId.get(product.id.toString());

    if (representativeImage === undefined) {
      continue;
    }

    candidateByProductId.set(product.id.toString(), {
      productId: product.id,
      createdAt: product.created_at,
      representativeImage,
    });
  }

  const bestCandidateByCategoryId = new Map<string, RepresentativeImageCandidate>();

  for (const link of productLinks) {
    const categoryId = link.category_id.toString();
    const candidate = candidateByProductId.get(link.product_id.toString());

    if (candidate === undefined) {
      continue;
    }

    const current = bestCandidateByCategoryId.get(categoryId);

    if (
      current === undefined ||
      isRepresentativeImageCandidateBetter(candidate, current)
    ) {
      bestCandidateByCategoryId.set(categoryId, candidate);
    }
  }

  for (const categoryId of categoryIds) {
    representativeImagesByCategoryId.set(
      categoryId,
      bestCandidateByCategoryId.get(categoryId)?.representativeImage ?? null
    );
  }

  return representativeImagesByCategoryId;
}
