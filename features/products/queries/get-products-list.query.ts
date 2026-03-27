import { mapProductToListItemDTO } from "../mappers";
import { findManyProducts } from "../repository";
import type { ProductListItemDTO } from "../types";

export async function getProductsList(): Promise<ProductListItemDTO[]> {
  const products = await findManyProducts();

  return products.map(mapProductToListItemDTO);
}
