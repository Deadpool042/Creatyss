import { db } from "@/core/db";

export async function listAdminProductCategoryOptions(storeId: string) {
  const categories = await db.category.findMany({
    where: {
      storeId,
      archivedAt: null,
    },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      parent: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    parentId: category.parent?.id ?? null,
    parentName: category.parent?.name ?? null,
  }));
}
