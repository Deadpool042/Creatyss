import { db } from "@/core/db";

type ListAdminRelatedProductOptionsInput = {
  excludeProductId?: string;
};

export type AdminRelatedProductOptionStatus = "draft" | "active" | "inactive" | "archived";

export type AdminRelatedProductOption = {
  id: string;
  name: string;
  slug: string;
  status: AdminRelatedProductOptionStatus;
};

export async function listAdminRelatedProductOptions(
  input: ListAdminRelatedProductOptionsInput
): Promise<AdminRelatedProductOption[]> {
  const products = await db.product.findMany({
    where: {
      archivedAt: null,
      ...(input.excludeProductId
        ? {
            id: {
              not: input.excludeProductId,
            },
          }
        : {}),
    },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
    },
  });

  return products.map<AdminRelatedProductOption>((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug ?? "",
    status:
      product.status === "ACTIVE"
        ? "active"
        : product.status === "INACTIVE"
          ? "inactive"
          : product.status === "ARCHIVED"
            ? "archived"
            : "draft",
  }));
}
