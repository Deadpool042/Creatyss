"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { ProductStatus } from "@/prisma-generated/client";
import type { z } from "zod";

import { db } from "@/core/db";

import type {
  CreateProductActionState,
  CreateProductFormValues,
} from "@/features/admin/products/create/types/create-product.types";
import { createProductSchema } from "@/features/admin/products/create/schemas";
import { ensureAdminCreatableProductTypes } from "@/features/admin/products/create/services/ensure-admin-creatable-product-types.service";

function mapFormDataToValues(formData: FormData): {
  name: string;
  slug: string;
  productTypeCode: string;
} {
  return {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    productTypeCode: String(formData.get("productTypeCode") ?? ""),
  };
}

function buildFieldErrors(input: {
  name?: string | undefined;
  slug?: string | undefined;
  productTypeCode?: string | undefined;
}): CreateProductActionState["fieldErrors"] {
  const fieldErrors: CreateProductActionState["fieldErrors"] = {};

  if (input.name) fieldErrors.name = input.name;
  if (input.slug) fieldErrors.slug = input.slug;
  if (input.productTypeCode) fieldErrors.productTypeCode = input.productTypeCode;

  return fieldErrors;
}

function getFirstIssueMessage(
  issues: readonly z.core.$ZodIssue[],
  fieldName: keyof CreateProductFormValues
): string | undefined {
  const issue = issues.find((entry) => entry.path[0] === fieldName);
  return issue?.message;
}

export async function createProductAction(
  _previousState: CreateProductActionState,
  formData: FormData
): Promise<CreateProductActionState> {
  const rawValues = mapFormDataToValues(formData);
  const parsed = createProductSchema.safeParse(rawValues);

  if (!parsed.success) {
    const issues = parsed.error.issues;

    return {
      status: "error",
      message: "Le formulaire contient des erreurs.",
      fieldErrors: buildFieldErrors({
        name: getFirstIssueMessage(issues, "name"),
        slug: getFirstIssueMessage(issues, "slug"),
        productTypeCode: getFirstIssueMessage(issues, "productTypeCode"),
      }),
    };
  }

  const existingProduct = await db.product.findFirst({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });

  if (existingProduct) {
    return {
      status: "error",
      message: "Le slug est déjà utilisé.",
      fieldErrors: buildFieldErrors({
        slug: "Choisis un autre slug.",
      }),
    };
  }

  const { storeId, productTypes } = await ensureAdminCreatableProductTypes();
  const productType = productTypes.find((item) => item.code === parsed.data.productTypeCode);

  if (!productType) {
    return {
      status: "error",
      message: "Type de produit introuvable.",
      fieldErrors: buildFieldErrors({
        productTypeCode: "Choisis un type valide.",
      }),
    };
  }

  const isStandalone = parsed.data.productTypeCode === "simple";

  await db.product.create({
    data: {
      slug: parsed.data.slug,
      name: parsed.data.name,
      status: ProductStatus.DRAFT,
      isFeatured: false,
      isStandalone,
      productType: { connect: { id: productType.id } },
      store: { connect: { id: storeId } },
    },
  });

  refresh();
  redirect(`/admin/products/${parsed.data.slug}/edit`);
}
