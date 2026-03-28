"use server";

import { revalidatePath } from "next/cache";
import { ProductStatus } from "@prisma-generated/client";
import type { z } from "zod";

import { db } from "@core/db";
import { createProductSchema } from "../schemas/create-product.schema";
import type {
  CreateProductActionState,
  CreateProductFormValues,
} from "../types/create-product.types";
import { redirect } from "next/navigation";

function mapFormDataToValues(formData: FormData): CreateProductFormValues {
  return {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    status: String(formData.get("status") ?? "draft") as CreateProductFormValues["status"],
  };
}

function buildFieldErrors(input: {
  name?: string | undefined;
  slug?: string | undefined;
  shortDescription?: string | undefined;
  status?: string | undefined;
}): CreateProductActionState["fieldErrors"] {
  const fieldErrors: CreateProductActionState["fieldErrors"] = {};

  if (input.name) {
    fieldErrors.name = input.name;
  }

  if (input.slug) {
    fieldErrors.slug = input.slug;
  }

  if (input.shortDescription) {
    fieldErrors.shortDescription = input.shortDescription;
  }

  if (input.status) {
    fieldErrors.status = input.status;
  }

  return fieldErrors;
}

function getFirstIssueMessage(
  issues: readonly z.ZodIssue[],
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
        shortDescription: getFirstIssueMessage(issues, "shortDescription"),
        status: getFirstIssueMessage(issues, "status"),
      }),
    };
  }

  const existingProduct = await db.product.findFirst({
    where: {
      slug: parsed.data.slug,
    },
    select: {
      id: true,
    },
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

  const store = await db.store.findFirst({
    select: {
      id: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!store) {
    return {
      status: "error",
      message: "Aucune boutique n'est configurée.",
      fieldErrors: {},
    };
  }

  await db.product.create({
    data: {
      slug: parsed.data.slug,
      name: parsed.data.name,
      shortDescription: parsed.data.shortDescription || null,
      status: parsed.data.status === "published" ? ProductStatus.ACTIVE : ProductStatus.DRAFT,
      isFeatured: false,
      isStandalone: false,
      store: {
        connect: {
          id: store.id,
        },
      },
    },
  });

  revalidatePath("/admin/products");
  redirect(`/admin/products/${parsed.data.slug}`);
}
