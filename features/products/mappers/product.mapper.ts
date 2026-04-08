import type { Product } from "@/prisma-generated/client";

import { productDetailsDTOSchema, productListItemDTOSchema } from "../types";

function toIsoString(value: Date): string {
  return value.toISOString();
}

export function mapProductToListItemDTO(product: Product) {
  return productListItemDTOSchema.parse({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    createdAt: toIsoString(product.createdAt),
    updatedAt: toIsoString(product.updatedAt),
  });
}

export function mapProductToDetailsDTO(product: Product) {
  return productDetailsDTOSchema.parse({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    createdAt: toIsoString(product.createdAt),
    updatedAt: toIsoString(product.updatedAt),
  });
}
