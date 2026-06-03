"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import type { z } from "zod";

import type {
  CreateProductActionState,
  CreateProductFormValues,
} from "@/features/admin/products/create/create-product.types";
import { createProductSchema } from "@/features/admin/products/create/create-product.schema";
import {
  CreateProductServiceError,
  ensureAdminCreatableProductTypes,
  createProduct,
} from "@/features/admin/products/create/create-product.service";
import { buildAdminProductEditPath } from "@/features/admin/products/navigation";

function mapFormDataToValues(formData: FormData): {
  name: string;
  slug: string;
} {
  return {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
  };
}

function buildFieldErrors(input: {
  name?: string | undefined;
  slug?: string | undefined;
}): CreateProductActionState["fieldErrors"] {
  const fieldErrors: CreateProductActionState["fieldErrors"] = {};

  if (input.name) fieldErrors.name = input.name;
  if (input.slug) fieldErrors.slug = input.slug;

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
      }),
    };
  }

  const { storeId, productTypes } = await ensureAdminCreatableProductTypes();
  const productType = productTypes.find((item) => item.code === parsed.data.productTypeCode);

  if (!productType) {
    return {
      status: "error",
      message: "Type de produit introuvable.",
      fieldErrors: {},
    };
  }

  const isStandalone = parsed.data.productTypeCode === "simple";

  try {
    await createProduct({
      slug: parsed.data.slug,
      name: parsed.data.name,
      storeId,
      productTypeId: productType.id,
      isStandalone,
    });
  } catch (error: unknown) {
    if (error instanceof CreateProductServiceError && error.code === "slug_taken") {
      return {
        status: "error",
        message: "Le slug est déjà utilisé.",
        fieldErrors: buildFieldErrors({
          slug: "Choisis un autre slug.",
        }),
      };
    }

    throw error;
  }

  refresh();
  redirect(buildAdminProductEditPath(parsed.data.slug));
}
