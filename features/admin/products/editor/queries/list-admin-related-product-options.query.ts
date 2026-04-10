import { db } from "@/core/db";

type ListAdminRelatedProductOptionsInput = {
  excludeProductId?: string;
};

export async function listAdminRelatedProductOptions(
  input: ListAdminRelatedProductOptionsInput = {}
) {
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

  return products.map((product) => ({
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
