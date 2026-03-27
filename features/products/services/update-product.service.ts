"use server";

import {
  type ProductDetailsDTO,
  type UpdateProductInput,
  updateProductInputSchema,
} from "../types";
import { generateProductSlug } from "../helpers";
import { findProductById, findProductBySlug, updateProduct } from "../repository";
import { mapProductToDetailsDTO } from "../mappers";

export async function updateProductService(input: UpdateProductInput): Promise<ProductDetailsDTO> {
  const parsedInput = updateProductInputSchema.parse(input);

  const existingProduct = await findProductById(parsedInput.id);

  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  const slug = parsedInput.slug
    ? generateProductSlug(parsedInput.slug)
    : generateProductSlug(parsedInput.name);

  const conflictingProduct = await findProductBySlug(slug);

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
