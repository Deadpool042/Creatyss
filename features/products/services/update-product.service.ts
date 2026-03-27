"use server";

import {
  type ProductDetailsDTO,
  type UpdateProductInput,
  updateProductInputSchema,
} from "@features/products/types";
import { generateProductSlug } from "@features/products/helpers";
import { findProductById, findProductBySlug, updateProduct } from "@features/products/repository";
import { mapProductToDetailsDTO } from "@features/products/mappers";

export async function updateProductService(input: UpdateProductInput): Promise<ProductDetailsDTO> {
  const parsedInput = updateProductInputSchema.parse(input);

  const existingProduct = await findProductById(parsedInput.id);

  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  const slug = parsedInput.slug
    ? generateProductSlug(parsedInput.slug)
    : generateProductSlug(parsedInput.name);

  const conflictingProduct = await findProductBySlug(existingProduct.storeId, slug);

  if (conflictingProduct && conflictingProduct.id !== parsedInput.id) {
    throw new Error("A product with this slug already exists.");
  }

  const product = await updateProduct(parsedInput.id, {
    name: parsedInput.name,
    slug,
    description: parsedInput.description ?? null,
  });

  return mapProductToDetailsDTO(product);
}
