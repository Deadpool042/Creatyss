"use server";

import {
  type CreateProductInput,
  createProductInputSchema,
  type ProductDetailsDTO,
} from "@/features/products/types";
import { generateProductSlug } from "@/features/products/helpers";
import { createProduct, findProductBySlug } from "@/features/products/repository";
import { mapProductToDetailsDTO } from "@/features/products/mappers";

export async function createProductService(input: CreateProductInput): Promise<ProductDetailsDTO> {
  const parsedInput = createProductInputSchema.parse(input);

  const slug = parsedInput.slug
    ? generateProductSlug(parsedInput.slug)
    : generateProductSlug(parsedInput.name);

  const existingProduct = await findProductBySlug(parsedInput.storeId, slug);

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
