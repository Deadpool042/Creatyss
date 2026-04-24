import { withTransaction } from "@/core/db";
import { Prisma } from "@/prisma-generated/client";
import {
  assertMediaAssetExists,
  assertProductExists,
  assertProductIsVariable,
  assertVariantAxisCombinationIsUnique,
  assertVariantOptionValuesAreValid,
  ensureDefaultVariantExists,
  mapEditorVariantStatusToPrismaStatus,
} from "./shared";
import { AdminProductEditorServiceError } from "./shared/error";

type CreateProductVariantServiceInput = {
  productId: string;
  sku: string;
  slug: string | null;
  name: string | null;
  primaryImageId: string | null;
  status: "draft" | "active" | "inactive" | "archived";
  isDefault: boolean;
  sortOrder: number;
  barcode: string | null;
  externalReference: string | null;
  weightGrams: number | null;
  widthMm: number | null;
  heightMm: number | null;
  depthMm: number | null;
  optionValueIds: string[];
};

export async function createProductVariant(
  input: CreateProductVariantServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    const product = await assertProductExists(tx, input.productId);
    assertProductIsVariable(product);
    await assertVariantOptionValuesAreValid(tx, input.productId, input.optionValueIds);
    await assertVariantAxisCombinationIsUnique(tx, {
      productId: input.productId,
      optionValueIds: input.optionValueIds,
      excludeVariantId: null,
    });

    if (input.primaryImageId !== null) {
      await assertMediaAssetExists(tx, input.primaryImageId);
    }

    const hasDefaultAlready = await tx.productVariant.findFirst({
      where: {
        productId: input.productId,
        archivedAt: null,
        isDefault: true,
      },
      select: { id: true },
    });

    const shouldBeDefault = input.isDefault || hasDefaultAlready === null;

    if (shouldBeDefault) {
      await tx.productVariant.updateMany({
        where: {
          productId: input.productId,
          archivedAt: null,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    let created: { id: string };
    try {
      created = await tx.productVariant.create({
        data: {
          productId: input.productId,
          sku: input.sku,
          slug: input.slug,
          name: input.name,
          primaryImageId: input.primaryImageId,
          status: mapEditorVariantStatusToPrismaStatus(input.status),
          isDefault: shouldBeDefault,
          sortOrder: input.sortOrder,
          barcode: input.barcode,
          externalReference: input.externalReference,
          weightGrams: input.weightGrams,
          widthMm: input.widthMm,
          heightMm: input.heightMm,
          depthMm: input.depthMm,
          publishedAt: input.status === "active" ? new Date() : null,
        },
        select: {
          id: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const meta = error.meta;
        const targetRaw =
          meta && typeof meta === "object" ? (meta as Record<string, unknown>).target : null;
        const target =
          typeof targetRaw === "string"
            ? targetRaw
            : Array.isArray(targetRaw)
              ? targetRaw.filter((item) => typeof item === "string").join(",")
              : "";

        if (target.includes("sku")) {
          throw new AdminProductEditorServiceError("variant_sku_taken");
        }

        if (target.includes("slug")) {
          throw new AdminProductEditorServiceError("variant_slug_taken");
        }
      }

      throw error;
    }

    if (input.optionValueIds.length > 0) {
      await tx.productVariantOptionValue.createMany({
        data: input.optionValueIds.map((optionValueId) => ({
          variantId: created.id,
          optionValueId,
        })),
        skipDuplicates: true,
      });
    }

    await ensureDefaultVariantExists(tx, { productId: input.productId });

    return created;
  });
}
