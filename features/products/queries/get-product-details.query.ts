import { mapProductToDetailsDTO } from "../mappers";
import { findProductById } from "../repository";
import type { ProductDetailsDTO } from "../types";

export async function getProductDetails(id: string): Promise<ProductDetailsDTO | null> {
  const product = await findProductById(id);

  if (!product) {
    return null;
  }

  return mapProductToDetailsDTO(product);
}
