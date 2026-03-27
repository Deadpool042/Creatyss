"use server";

import {
  type CreateProductInput,
  createProductInputSchema,
  type ProductDetailsDTO,
} from "../types";
import { generateProductSlug } from "../helpers";
import { createProduct, findProductBySlug } from "../repository";
import { mapProductToDetailsDTO } from "../mappers";

export async function createProductService(input: CreateProductInput): Promise<ProductDetailsDTO> {
  const parsedInput = createProductInputSchema.parse(input);

  const slug = parsedInput.slug
    ? generateProductSlug(parsedInput.slug)
    : generateProductSlug(parsedInput.name);

  const existingProduct = await findProductBySlug(slug);

  if (existingProduct) {
    throw new Error("A product with this slug already exists.");
  }

  const product = await createProduct({
    storeId: parsedInput.storeId,
    name: parsedInput.name,
    slug,
    description: parsedInput.description ?? null,
  });

  return mapProductToDetailsDTO(product);
}
