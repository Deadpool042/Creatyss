import { mapProductToListItemDTO } from "@/features/products/mappers";
import { findManyProducts } from "@/features/products/repository";
import type { ProductListItemDTO } from "@/features/products/types";

export async function getProductsList(): Promise<ProductListItemDTO[]> {
  const products = await findManyProducts();

  return products.map(mapProductToListItemDTO);
}
