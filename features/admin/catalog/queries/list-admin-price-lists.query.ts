import { db } from "@/core/db";

export type AdminPriceListSummary = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  currencyCode: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  isDefault: boolean;
  startsAt: string | null;
  endsAt: string | null;
  productPricesCount: number;
  variantPricesCount: number;
  updatedAt: string;
};

export async function listAdminPriceLists(): Promise<AdminPriceListSummary[]> {
  const lists = await db.priceList.findMany({
    where: { archivedAt: null },
    orderBy: [{ isDefault: "desc" }, { status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      currencyCode: true,
      status: true,
      isDefault: true,
      startsAt: true,
      endsAt: true,
      updatedAt: true,
      _count: {
        select: {
          productPrices: true,
          variantPrices: true,
        },
      },
    },
  });

  return lists.map((l) => ({
    id: l.id,
    code: l.code,
    name: l.name,
    description: l.description,
    currencyCode: l.currencyCode as string,
    status: l.status as AdminPriceListSummary["status"],
    isDefault: l.isDefault,
    startsAt: l.startsAt?.toISOString() ?? null,
    endsAt: l.endsAt?.toISOString() ?? null,
    productPricesCount: l._count.productPrices,
    variantPricesCount: l._count.variantPrices,
    updatedAt: l.updatedAt.toISOString(),
  }));
}
