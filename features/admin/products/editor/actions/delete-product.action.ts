//features/admin/products/editor/actions/delete-product.action.ts
"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { deleteProductSchema } from "@/features/admin/products/editor/schemas/delete-product.schema";
import type {
  DeleteProductInput,
  DeleteProductResult,
} from "@/features/admin/products/editor/types/product-delete.types";

export async function deleteProductAction(input: DeleteProductInput): Promise<DeleteProductResult> {
  const parsed = deleteProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Paramètres invalides pour la suppression du produit.",
    };
  }

  const { productId } = parsed.data;

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
    },
  });

  if (!product) {
    return {
      status: "error",
      message: "Le produit demandé est introuvable.",
    };
  }

  await db.product.delete({
    where: {
      id: productId,
    },
  });

  revalidatePath("/admin/products");

  return {
    status: "success",
    message: "Produit supprimé avec succès.",
  };
}
