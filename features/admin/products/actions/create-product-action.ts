"use server";

import { redirect } from "next/navigation";
import {
  AdminProductRepositoryError,
  createAdminProduct,
} from "@/db/repositories/admin-product.repository";

import { ProductFormSchema } from "../schemas/product-form-schema";
import { normalizeProductSlug } from "@/entities/product/product-input";

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

export async function createProductAction(formData: FormData): Promise<void> {
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
    redirect(`/admin/products/new?error=${code}`);
  }

  const slug = normalizeProductSlug(parsed.data.slug);

  if (slug.length === 0) {
    redirect("/admin/products/new?error=invalid_slug");
  }

  let createdProductId: string | null = null;

  try {
    const product = await createAdminProduct({ ...parsed.data, slug });
    createdProductId = product.id;
  } catch (error) {
    if (error instanceof AdminProductRepositoryError && error.code === "slug_taken") {
      redirect("/admin/products/new?error=slug_taken");
    }

    if (error instanceof AdminProductRepositoryError && error.code === "category_missing") {
      redirect("/admin/products/new?error=invalid_category_ids");
    }

    console.error(error);
    redirect("/admin/products/new?error=save_failed");
  }

  if (createdProductId === null) {
    redirect("/admin/products/new?error=save_failed");
  }

  redirect(`/admin/products/${createdProductId}?product_status=created`);
}
