import { mapProductToDetailsDTO } from "@features/products/mappers";
import { findProductById } from "@features/products/repository";
import type { ProductDetailsDTO } from "@features/products/types";

export async function getProductDetails(id: string): Promise<ProductDetailsDTO | null> {
  const product = await findProductById(id);

  if (!product) {
    return null;
  }

  return mapProductToDetailsDTO(product);
}
