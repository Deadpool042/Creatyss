"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProductStatus } from "@/prisma-generated/client";
import type { z } from "zod";

import { db } from "@/core/db";
import type {
  ProductGeneralFormState,
  ProductGeneralFormValues,
} from "@/features/admin/products/editor/types";
import { updateProductGeneralSchema } from "@/features/admin/products/editor/schemas";

function mapFormDataToValues(formData: FormData): ProductGeneralFormValues {
  return {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? "draft") as ProductGeneralFormValues["status"],
    isFeatured: String(formData.get("isFeatured") ?? "false") === "true",
  };
}

function buildFieldErrors(input: {
  id?: string | undefined;
  name?: string | undefined;
  slug?: string | undefined;
  shortDescription?: string | undefined;
  description?: string | undefined;
  status?: string | undefined;
  isFeatured?: string | undefined;
}): ProductGeneralFormState["fieldErrors"] {
  const fieldErrors: ProductGeneralFormState["fieldErrors"] = {};

  if (input.id) fieldErrors.id = input.id;
  if (input.name) fieldErrors.name = input.name;
  if (input.slug) fieldErrors.slug = input.slug;
  if (input.shortDescription) fieldErrors.shortDescription = input.shortDescription;
  if (input.description) fieldErrors.description = input.description;
  if (input.status) fieldErrors.status = input.status;
  if (input.isFeatured) fieldErrors.isFeatured = input.isFeatured;

  return fieldErrors;
}

function getFirstIssueMessage(
  issues: readonly z.core.$ZodIssue[],
  fieldName: keyof ProductGeneralFormValues
): string | undefined {
  const issue = issues.find((entry) => entry.path[0] === fieldName);
  return issue?.message;
}

function mapAdminStatusToProductStatus(status: ProductGeneralFormValues["status"]): ProductStatus {
  if (status === "published") {
    return ProductStatus.ACTIVE;
  }

  if (status === "archived") {
    return ProductStatus.ARCHIVED;
  }

  return ProductStatus.DRAFT;
}

export async function updateProductGeneralAction(
  _previousState: ProductGeneralFormState,
  formData: FormData
): Promise<ProductGeneralFormState> {
  const rawValues = mapFormDataToValues(formData);
  const parsed = updateProductGeneralSchema.safeParse({
    ...rawValues,
    isFeatured: rawValues.isFeatured ? "true" : "false",
  });

  if (!parsed.success) {
    const issues = parsed.error.issues;

    return {
      status: "error",
      message: "Le formulaire contient des erreurs.",
      fieldErrors: buildFieldErrors({
        id: getFirstIssueMessage(issues, "id"),
        name: getFirstIssueMessage(issues, "name"),
        slug: getFirstIssueMessage(issues, "slug"),
        shortDescription: getFirstIssueMessage(issues, "shortDescription"),
        description: getFirstIssueMessage(issues, "description"),
        status: getFirstIssueMessage(issues, "status"),
        isFeatured: getFirstIssueMessage(issues, "isFeatured"),
      }),
    };
  }

  const existingProduct = await db.product.findUnique({
    where: {
      id: parsed.data.id,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!existingProduct) {
    return {
      status: "error",
      message: "Le produit demandé est introuvable.",
      fieldErrors: buildFieldErrors({
        id: "Produit introuvable.",
      }),
    };
  }

  const slugOwner = await db.product.findFirst({
    where: {
      slug: parsed.data.slug,
    },
    select: {
      id: true,
    },
  });

  if (slugOwner && slugOwner.id !== parsed.data.id) {
    return {
      status: "error",
      message: "Le slug est déjà utilisé.",
      fieldErrors: buildFieldErrors({
        slug: "Choisis un autre slug.",
      }),
    };
  }

  const updatedProduct = await db.product.update({
    where: {
      id: parsed.data.id,
    },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      shortDescription: parsed.data.shortDescription || null,
      description: parsed.data.description || null,
      status: mapAdminStatusToProductStatus(parsed.data.status),
      isFeatured: parsed.data.isFeatured,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  const previousEditorPath = `/admin/products/${existingProduct.slug}/edit`;
  const nextEditorPath = `/admin/products/${updatedProduct.slug}/edit`;

  revalidatePath("/admin/products");
  revalidatePath(previousEditorPath);
  revalidatePath(nextEditorPath);

  if (existingProduct.slug !== updatedProduct.slug) {
    redirect(nextEditorPath);
  }

  return {
    status: "success",
    message: "Les informations générales du produit ont été enregistrées.",
    fieldErrors: {},
  };
}
