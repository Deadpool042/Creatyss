import { db } from "@/core/db";
import type { AdminProductOptionItem } from "@/features/admin/products/editor/types/product-variants.types";

export async function readAdminProductTypeWithOptions(
  productTypeId: string
): Promise<AdminProductOptionItem[]> {
  const options = await db.productOption.findMany({
    where: {
      productTypeId,
      isActive: true,
      archivedAt: null,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      sortOrder: true,
      isVariantAxis: true,
      values: {
        where: { isActive: true, archivedAt: null },
        orderBy: [{ sortOrder: "asc" }, { value: "asc" }],
        select: {
          id: true,
          code: true,
          value: true,
          label: true,
          sortOrder: true,
        },
      },
    },
  });

  return options.map((opt) => ({
    id: opt.id,
    code: opt.code,
    name: opt.name,
    sortOrder: opt.sortOrder,
    isVariantAxis: opt.isVariantAxis,
    values: opt.values.map((v) => ({
      id: v.id,
      code: v.code,
      value: v.value,
      label: v.label,
      sortOrder: v.sortOrder,
    })),
  }));
}
