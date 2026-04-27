export type CatalogImage = {
  src: string;
  alt: string | null;
};

export function buildCatalogImageUrl(storageKey: string, uploadsPublicPath: string): string {
  return `${uploadsPublicPath}/${storageKey.replace(/^\/+/, "")}`;
}

export function mapCatalogImage(
  input: { storageKey: string; altText: string | null },
  uploadsPublicPath: string
): CatalogImage {
  return {
    src: buildCatalogImageUrl(input.storageKey, uploadsPublicPath),
    alt: input.altText,
  };
}

export function dedupeCatalogImages<T extends { src: string }>(images: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const image of images) {
    if (seen.has(image.src)) {
      continue;
    }

    seen.add(image.src);
    result.push(image);
  }

  return result;
}
