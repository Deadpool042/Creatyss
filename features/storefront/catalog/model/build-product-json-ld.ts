import { buildSeoDescription, pickSeoText } from "@/entities/product/seo-text";

type ProductJsonLdSource = {
  slug: string;
  name: string;
  seoDescription: string | null;
  shortDescription: string | null;
  description: string | null;
  images: Array<{ src: string }>;
};

export type ProductJsonLd = {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description: string;
  url: string;
  image?: string;
};

function toAbsoluteUrl(input: string, base: string): string {
  try {
    return new URL(input, base).toString();
  } catch {
    return input;
  }
}

export function buildProductJsonLd(input: {
  product: ProductJsonLdSource;
  appUrl: string;
}): ProductJsonLd {
  const { product, appUrl } = input;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pickSeoText(product.name) ?? product.name,
    description: buildSeoDescription({
      candidates: [product.seoDescription, product.shortDescription, product.description],
      defaultValue: "Produit Creatyss.",
      maxLength: 500,
    }),
    url: `${appUrl}/boutique/${product.slug}`,
    ...(product.images[0] && {
      image: toAbsoluteUrl(product.images[0].src, appUrl),
    }),
  };
}
