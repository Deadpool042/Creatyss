//features/admin/products/editor/actions/update-product-variant.action.ts
"use server";

import { revalidatePath } from "next/cache";
import {
  MediaReferenceRole,
  MediaReferenceSubjectType,
  ProductStatus,
} from "@/prisma-generated/client";

import { db, withTransaction } from "@/core/db";
import { updateProductVariantSchema } from "@/features/admin/products/editor/schemas";
import type {
  ProductVariantFormState,
  ProductVariantFormValues,
} from "@/features/admin/products/editor/types/product-variants.types";

function mapFormDataToValues(formData: FormData): ProductVariantFormValues {
  return {
    id: String(formData.get("id") ?? ""),
    productId: String(formData.get("productId") ?? ""),
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    sku: String(formData.get("sku") ?? ""),
    status: String(formData.get("status") ?? "draft") as ProductVariantFormValues["status"],
    isDefault: String(formData.get("isDefault") ?? "false") === "true",
    sortOrder: String(formData.get("sortOrder") ?? "0"),
    priceListId: String(formData.get("priceListId") ?? ""),
    amount: String(formData.get("amount") ?? ""),
    compareAtAmount: String(formData.get("compareAtAmount") ?? ""),
    primaryImageId: String(formData.get("primaryImageId") ?? ""),
  };
}

function buildFieldErrors(input: {
  id?: string | undefined;
  productId?: string | undefined;
  name?: string | undefined;
  slug?: string | undefined;
  sku?: string | undefined;
  status?: string | undefined;
  isDefault?: string | undefined;
  sortOrder?: string | undefined;
  priceListId?: string | undefined;
  amount?: string | undefined;
  compareAtAmount?: string | undefined;
  primaryImageId?: string | undefined;
}): ProductVariantFormState["fieldErrors"] {
  const fieldErrors: ProductVariantFormState["fieldErrors"] = {};

  if (input.id) fieldErrors.id = input.id;
  if (input.productId) fieldErrors.productId = input.productId;
  if (input.name) fieldErrors.name = input.name;
  if (input.slug) fieldErrors.slug = input.slug;
  if (input.sku) fieldErrors.sku = input.sku;
  if (input.status) fieldErrors.status = input.status;
  if (input.isDefault) fieldErrors.isDefault = input.isDefault;
  if (input.sortOrder) fieldErrors.sortOrder = input.sortOrder;
  if (input.priceListId) fieldErrors.priceListId = input.priceListId;
  if (input.amount) fieldErrors.amount = input.amount;
  if (input.compareAtAmount) fieldErrors.compareAtAmount = input.compareAtAmount;
  if (input.primaryImageId) fieldErrors.primaryImageId = input.primaryImageId;

  return fieldErrors;
}

function parseNullableDecimal(value: string): string | null {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export async function updateProductVariantAction(
  _previousState: ProductVariantFormState,
  formData: FormData
): Promise<ProductVariantFormState> {
  const rawValues = mapFormDataToValues(formData);

  const parsed = updateProductVariantSchema.safeParse({
    ...rawValues,
    isDefault: rawValues.isDefault ? "true" : "false",
  });

  if (!parsed.success) {
    const issues = parsed.error.issues;

    return {
      status: "error",
      message: "Le formulaire variante contient des erreurs.",
      fieldErrors: buildFieldErrors({
        id: issues.find((issue) => issue.path[0] === "id")?.message,
        productId: issues.find((issue) => issue.path[0] === "productId")?.message,
        name: issues.find((issue) => issue.path[0] === "name")?.message,
        slug: issues.find((issue) => issue.path[0] === "slug")?.message,
        sku: issues.find((issue) => issue.path[0] === "sku")?.message,
        status: issues.find((issue) => issue.path[0] === "status")?.message,
        isDefault: issues.find((issue) => issue.path[0] === "isDefault")?.message,
        sortOrder: issues.find((issue) => issue.path[0] === "sortOrder")?.message,
        priceListId: issues.find((issue) => issue.path[0] === "priceListId")?.message,
        amount: issues.find((issue) => issue.path[0] === "amount")?.message,
        compareAtAmount: issues.find((issue) => issue.path[0] === "compareAtAmount")?.message,
        primaryImageId: issues.find((issue) => issue.path[0] === "primaryImageId")?.message,
      }),
    };
  }

  const existingVariant = await db.productVariant.findUnique({
    where: {
      id: parsed.data.id,
    },
    select: {
      id: true,
      productId: true,
      product: {
        select: {
          id: true,
          slug: true,
        },
      },
    },
  });

  if (!existingVariant || existingVariant.productId !== parsed.data.productId) {
    return {
      status: "error",
      message: "La variante demandée est introuvable.",
      fieldErrors: buildFieldErrors({
        id: "Variante introuvable.",
      }),
    };
  }

  const priceList = await db.priceList.findUnique({
    where: {
      id: parsed.data.priceListId,
    },
    select: {
      id: true,
    },
  });

  if (!priceList) {
    return {
      status: "error",
      message: "La tarification demandée est introuvable.",
      fieldErrors: buildFieldErrors({
        priceListId: "Tarification requise.",
      }),
    };
  }

  const existingSku = await db.productVariant.findFirst({
    where: {
      productId: parsed.data.productId,
      sku: parsed.data.sku.trim(),
      NOT: {
        id: parsed.data.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingSku) {
    return {
      status: "error",
      message: "Ce SKU est déjà utilisé pour ce produit.",
      fieldErrors: buildFieldErrors({
        sku: "Choisis un autre SKU.",
      }),
    };
  }

  const normalizedSlug = parsed.data.slug.trim();
  const normalizedName = parsed.data.name.trim();
  const normalizedPrimaryImageId = parsed.data.primaryImageId.trim();
  const isDefault = parsed.data.isDefault === "true";

  await withTransaction(async (tx) => {
    if (isDefault) {
      await tx.productVariant.updateMany({
        where: {
          productId: parsed.data.productId,
          isDefault: true,
          NOT: {
            id: parsed.data.id,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    await tx.productVariant.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        slug: normalizedSlug.length > 0 ? normalizedSlug : null,
        name: normalizedName.length > 0 ? normalizedName : null,
        sku: parsed.data.sku.trim(),
        status: parsed.data.status === "published" ? ProductStatus.ACTIVE : ProductStatus.DRAFT,
        sortOrder: Number(parsed.data.sortOrder),
        primaryImageId: normalizedPrimaryImageId.length > 0 ? normalizedPrimaryImageId : null,
      },
    });

    const existingPrice = await tx.productVariantPrice.findFirst({
      where: {
        variantId: parsed.data.id,
        priceListId: parsed.data.priceListId,
      },
      select: {
        id: true,
      },
    });

    if (existingPrice) {
      await tx.productVariantPrice.update({
        where: {
          id: existingPrice.id,
        },
        data: {
          amount: parsed.data.amount.trim(),
          compareAtAmount: parseNullableDecimal(parsed.data.compareAtAmount),
          isActive: true,
        },
      });
    } else {
      await tx.productVariantPrice.create({
        data: {
          variantId: parsed.data.id,
          priceListId: parsed.data.priceListId,
          amount: parsed.data.amount.trim(),
          compareAtAmount: parseNullableDecimal(parsed.data.compareAtAmount),
          isActive: true,
        },
      });
    }

    if (isDefault && normalizedPrimaryImageId.length > 0) {
      const productImageReference = await tx.mediaReference.findFirst({
        where: {
          subjectType: MediaReferenceSubjectType.PRODUCT,
          subjectId: parsed.data.productId,
          assetId: normalizedPrimaryImageId,
        },
        select: {
          id: true,
          assetId: true,
        },
      });

      if (productImageReference) {
        await tx.mediaReference.updateMany({
          where: {
            subjectType: MediaReferenceSubjectType.PRODUCT,
            subjectId: parsed.data.productId,
          },
          data: {
            isPrimary: false,
            role: MediaReferenceRole.GALLERY,
          },
        });

        await tx.mediaReference.update({
          where: {
            id: productImageReference.id,
          },
          data: {
            isPrimary: true,
            role: MediaReferenceRole.PRIMARY,
          },
        });

        await tx.product.update({
          where: {
            id: parsed.data.productId,
          },
          data: {
            primaryImageId: productImageReference.assetId,
          },
        });
      }
    }
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${existingVariant.product.slug}/edit`);

  return {
    status: "success",
    message: "La variante a été mise à jour.",
    fieldErrors: {},
  };
}
