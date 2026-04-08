"use server";

import { revalidatePath } from "next/cache";
import { SeoSubjectType } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { updateProductSeoSchema } from "@/features/admin/products/editor/schemas";
import type {
  ProductSeoFormState,
  ProductSeoFormValues,
} from "@/features/admin/products/editor/types";

function mapFormDataToValues(formData: FormData): ProductSeoFormValues {
  return {
    id: String(formData.get("id") ?? ""),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
  };
}

function buildFieldErrors(input: {
  id?: string | undefined;
  seoTitle?: string | undefined;
  seoDescription?: string | undefined;
}): ProductSeoFormState["fieldErrors"] {
  const fieldErrors: ProductSeoFormState["fieldErrors"] = {};

  if (input.id) {
    fieldErrors.id = input.id;
  }

  if (input.seoTitle) {
    fieldErrors.seoTitle = input.seoTitle;
  }

  if (input.seoDescription) {
    fieldErrors.seoDescription = input.seoDescription;
  }

  return fieldErrors;
}

export async function updateProductSeoAction(
  _previousState: ProductSeoFormState,
  formData: FormData
): Promise<ProductSeoFormState> {
  const rawValues = mapFormDataToValues(formData);
  const parsed = updateProductSeoSchema.safeParse(rawValues);

  if (!parsed.success) {
    const issues = parsed.error.issues;

    return {
      status: "error",
      message: "Le formulaire SEO contient des erreurs.",
      fieldErrors: buildFieldErrors({
        id: issues.find((issue) => issue.path[0] === "id")?.message,
        seoTitle: issues.find((issue) => issue.path[0] === "seoTitle")?.message,
        seoDescription: issues.find((issue) => issue.path[0] === "seoDescription")?.message,
      }),
    };
  }

  const product = await db.product.findUnique({
    where: {
      id: parsed.data.id,
    },
    select: {
      id: true,
      slug: true,
      storeId: true,
    },
  });

  if (!product) {
    return {
      status: "error",
      message: "Le produit demandé est introuvable.",
      fieldErrors: buildFieldErrors({
        id: "Produit introuvable.",
      }),
    };
  }

  const metaTitle = parsed.data.seoTitle.trim().length > 0 ? parsed.data.seoTitle.trim() : null;

  const metaDescription =
    parsed.data.seoDescription.trim().length > 0 ? parsed.data.seoDescription.trim() : null;

  await db.seoMetadata.upsert({
    where: {
      storeId_subjectType_subjectId: {
        storeId: product.storeId,
        subjectType: SeoSubjectType.PRODUCT,
        subjectId: product.id,
      },
    },
    update: {
      metaTitle,
      metaDescription,
    },
    create: {
      storeId: product.storeId,
      subjectType: SeoSubjectType.PRODUCT,
      subjectId: product.id,
      metaTitle,
      metaDescription,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${product.slug}/edit`);

  return {
    status: "success",
    message: "Les informations SEO ont été enregistrées.",
    fieldErrors: {},
  };
}
