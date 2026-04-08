"use server";

import { revalidatePath } from "next/cache";

import { db, withTransaction } from "@/core/db";
import { updateProductCategoriesSchema } from "@/features/admin/products/editor/schemas";
import type {
  ProductCategoriesFormState,
  ProductCategoriesFormValues,
} from "@/features/admin/products/editor/types";

function mapFormDataToValues(formData: FormData): ProductCategoriesFormValues {
  return {
    id: String(formData.get("id") ?? "").trim(),
    categoryIds: formData
      .getAll("categoryIds")
      .map((value) => String(value).trim())
      .filter((value) => value.length > 0),
    primaryCategoryId: String(formData.get("primaryCategoryId") ?? "").trim(),
  };
}

function buildFieldErrors(input: {
  id?: string;
  categoryIds?: string;
  primaryCategoryId?: string;
}): ProductCategoriesFormState["fieldErrors"] {
  const fieldErrors: ProductCategoriesFormState["fieldErrors"] = {};

  if (input.id) fieldErrors.id = input.id;
  if (input.categoryIds) fieldErrors.categoryIds = input.categoryIds;
  if (input.primaryCategoryId) fieldErrors.primaryCategoryId = input.primaryCategoryId;

  return fieldErrors;
}

export async function updateProductCategoriesAction(
  _previousState: ProductCategoriesFormState,
  formData: FormData
): Promise<ProductCategoriesFormState> {
  const rawValues = mapFormDataToValues(formData);
  const parsed = updateProductCategoriesSchema.safeParse(rawValues);

  if (!parsed.success) {
    const issues = parsed.error.issues;
    const idError = issues.find((issue) => issue.path[0] === "id")?.message;
    const categoryIdsError = issues.find((issue) => issue.path[0] === "categoryIds")?.message;
    const primaryCategoryIdError = issues.find(
      (issue) => issue.path[0] === "primaryCategoryId"
    )?.message;

    return {
      status: "error",
      message: "Le formulaire catégories contient des erreurs.",
      fieldErrors: buildFieldErrors({
        ...(idError ? { id: idError } : {}),
        ...(categoryIdsError ? { categoryIds: categoryIdsError } : {}),
        ...(primaryCategoryIdError ? { primaryCategoryId: primaryCategoryIdError } : {}),
      }),
    };
  }

  const { id, categoryIds, primaryCategoryId } = parsed.data;

  const existingProduct = await db.product.findUnique({
    where: {
      id,
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

  const existingCategories = await db.category.findMany({
    where: {
      id: {
        in: categoryIds,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingCategories.length !== categoryIds.length) {
    return {
      status: "error",
      message: "Une ou plusieurs catégories sélectionnées sont invalides.",
      fieldErrors: buildFieldErrors({
        categoryIds: "Sélection de catégories invalide.",
      }),
    };
  }

  if (primaryCategoryId.length > 0 && !categoryIds.includes(primaryCategoryId)) {
    return {
      status: "error",
      message: "La catégorie principale doit faire partie des catégories sélectionnées.",
      fieldErrors: buildFieldErrors({
        primaryCategoryId: "Choisis une catégorie principale parmi les catégories liées.",
      }),
    };
  }

  await withTransaction(async (tx) => {
    await tx.productCategory.deleteMany({
      where: {
        productId: id,
      },
    });

    if (categoryIds.length > 0) {
      const resolvedPrimaryCategoryId =
        primaryCategoryId.length > 0 ? primaryCategoryId : categoryIds[0];

      await tx.productCategory.createMany({
        data: categoryIds.map((categoryId, index) => ({
          productId: id,
          categoryId,
          isPrimary: categoryId === resolvedPrimaryCategoryId,
          sortOrder: index,
        })),
      });
    }
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${existingProduct.slug}/edit`);

  return {
    status: "success",
    message: "Les catégories du produit ont été enregistrées.",
    fieldErrors: {},
  };
}
