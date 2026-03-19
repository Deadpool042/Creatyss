import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";

export const publishedProductSummarySelect = Prisma.validator<Prisma.productsSelect>()({
  id: true,
  name: true,
  slug: true,
  short_description: true,
  description: true,
  product_type: true,
  simple_sku: true,
  simple_price: true,
  simple_compare_at_price: true,
  simple_stock_quantity: true,
  is_featured: true,
  seo_title: true,
  seo_description: true,
  created_at: true,
  updated_at: true,
});

export type PublishedProductSummaryRecord = Prisma.productsGetPayload<{
  select: typeof publishedProductSummarySelect;
}>;

export async function listRecentPublishedProductRows(limit: number) {
  return prisma.products.findMany({
    where: { status: "published" },
    orderBy: [{ created_at: "desc" }],
    take: limit,
    select: publishedProductSummarySelect,
  });
}
