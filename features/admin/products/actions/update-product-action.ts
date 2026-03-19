"use server";

import { redirect } from "next/navigation";
import {
  findAdminProductPublishContext,
  updateAdminProduct,
} from "@/db/repositories/products/admin-product.repository";
import { AdminProductRepositoryError } from "@/db/repositories/products/admin-product.types";
import { normalizeProductSlug } from "@/entities/product/product-input";
import { getProductPublishability } from "@/entities/product/product-publishability";
import { normalizeNumericIdFromForm } from "@/features/admin/products/actions/action-helpers";

import { ProductFormSchema } from "../schemas/product-form-schema";

function mapProductFormError(field: PropertyKey | undefined): string {
  switch (field) {
    case "name":
      return "missing_name";
    case "slug":
      return "missing_slug";
    case "status":
      return "invalid_status";
    case "productType":
      return "invalid_product_type";
    case "categoryIds":
      return "invalid_category_ids";
    default:
      return "save_failed";
  }
}

export async function updateProductAction(formData: FormData): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  const parsed = ProductFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    status: formData.get("status"),
    productType: formData.get("productType"),
    isFeatured: formData.get("isFeatured"),
    categoryIds: formData.getAll("categoryIds"),
  });

  if (!parsed.success) {
    const code = mapProductFormError(parsed.error.issues[0]?.path[0]);
    redirect(`/admin/products/${productId}?product_error=${code}`);
  }

  const slug = normalizeProductSlug(parsed.data.slug);

  if (slug.length === 0) {
    redirect(`/admin/products/${productId}?product_error=invalid_slug`);
  }

  if (parsed.data.status === "published") {
    const context = await findAdminProductPublishContext(productId);

    if (context !== null) {
      const publishability = getProductPublishability(
        parsed.data.productType,
        context.variantCount
      );

      if (!publishability.ok) {
        redirect(`/admin/products/${productId}?product_error=${publishability.code}`);
      }
    }
  }

  try {
    const product = await updateAdminProduct({
      id: productId,
      ...parsed.data,
      slug,
    });

    if (product === null) {
      redirect("/admin/products?error=missing_product");
    }
  } catch (error) {
    if (error instanceof AdminProductRepositoryError && error.code === "slug_taken") {
      redirect(`/admin/products/${productId}?product_error=slug_taken`);
    }

    if (error instanceof AdminProductRepositoryError && error.code === "category_missing") {
      redirect(`/admin/products/${productId}?product_error=invalid_category_ids`);
    }

    if (
      error instanceof AdminProductRepositoryError &&
      error.code === "simple_product_requires_single_variant"
    ) {
      redirect(`/admin/products/${productId}?product_error=simple_product_requires_single_variant`);
    }

    console.error(error);
    redirect(`/admin/products/${productId}?product_error=save_failed`);
  }

  redirect(`/admin/products/${productId}?product_status=updated`);
}
