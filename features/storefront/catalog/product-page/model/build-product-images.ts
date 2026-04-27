type ProductPageImage = {
  src: string;
  alt: string | null;
};

export function buildProductImages(input: {
  baseImages: ProductPageImage[];
  referenceVariant: { images: ProductPageImage[] } | null;
}): ProductPageImage[] {
  const seen = new Set<string>();

  return input.baseImages.filter((image) => {
    const key = image.src.trim();

    if (key.length === 0 || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
