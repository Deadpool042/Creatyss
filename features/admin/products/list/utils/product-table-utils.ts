export function parsePriceValue(priceValue?: number): number {
  return typeof priceValue === "number" ? priceValue : Number.POSITIVE_INFINITY;
}

export function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
