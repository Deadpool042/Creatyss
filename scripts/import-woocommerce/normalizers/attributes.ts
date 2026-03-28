import type { WooVariation } from "../schemas";
import { slugify } from "./slug";

export function buildVariationDisplayName(
  productName: string,
  variation: WooVariation,
  index: number
): string {
  const attributes = (variation.attributes ?? [])
    .map((attribute) => attribute.option.trim())
    .filter((value) => value.length > 0);

  if (attributes.length > 0) {
    return `${productName} - ${attributes.join(" / ")}`;
  }

  if (variation.sku.trim().length > 0) {
    return `${productName} - ${variation.sku.trim()}`;
  }

  return `${productName} - Déclinaison ${index + 1}`;
}

export function buildVariationSlug(variation: WooVariation): string | null {
  const attributes = (variation.attributes ?? [])
    .map((attribute) => slugify(attribute.option))
    .filter((value) => value.length > 0);

  if (attributes.length === 0) {
    return null;
  }

  return attributes.join("-");
}
