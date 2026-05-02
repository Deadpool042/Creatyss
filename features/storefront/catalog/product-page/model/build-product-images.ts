type ProductPageImage = {
  src: string;
  alt: string | null;
};

function normalizeImage(image: ProductPageImage): ProductPageImage | null {
  const normalizedSrc = image.src.trim();

  if (normalizedSrc.length === 0) {
    return null;
  }

  return {
    src: normalizedSrc,
    alt: image.alt ?? null,
  };
}

export function buildProductImages(input: {
  baseImages: ProductPageImage[];
  referenceVariant: { images: ProductPageImage[] } | null;
}): ProductPageImage[] {
  const seen = new Set<string>();
  const prioritizedCandidates: ProductPageImage[] = [
    ...(input.referenceVariant?.images ?? []),
    ...input.baseImages,
  ];
  const result: ProductPageImage[] = [];

  for (const candidate of prioritizedCandidates) {
    const normalized = normalizeImage(candidate);

    if (normalized === null || seen.has(normalized.src)) {
      continue;
    }

    seen.add(normalized.src);
    result.push(normalized);
  }

  return result;
}
