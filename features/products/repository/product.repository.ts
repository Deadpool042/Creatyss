import { db } from "@/core/db";
import type { Prisma, Product } from "@prisma-generated/client";

type ProductCreateData = Prisma.ProductUncheckedCreateInput;
type ProductUpdateData = Prisma.ProductUncheckedUpdateInput;

export async function findManyProducts(): Promise<Product[]> {
  return db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findProductById(id: string): Promise<Product | null> {
  return db.product.findUnique({
    where: { id },
  });
}

export async function findProductBySlug(storeId: string, slug: string): Promise<Product | null> {
  return db.product.findUnique({
    where: {
      storeId_slug: {
        storeId,
        slug,
      },
    },
  });
}

export async function createProduct(data: ProductCreateData): Promise<Product> {
  return db.product.create({
    data,
  });
}

export async function updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
  return db.product.update({
    where: { id },
    data,
  });
}
