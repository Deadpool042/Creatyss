import { buildSeoDescription, pickSeoText } from "@/entities/product/seo-text";

type BlogPostJsonLdSource = {
  slug: string;
  title: string;
  seoDescription: string | null;
  excerpt: string | null;
  content: string | null;
  authorName: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  imageUrl: string | null;
};

export type BlogPostJsonLd = {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: { "@type": "Person"; name: string };
  image?: string;
};

function toAbsoluteUrl(input: string, base: string): string | null {
  try {
    return new URL(input, base).toString();
  } catch {
    return null;
  }
}

export function buildBlogPostJsonLd(input: {
  post: BlogPostJsonLdSource;
  appUrl: string;
  jsonLdDefaultDescription: string;
}): BlogPostJsonLd {
  const { post, appUrl, jsonLdDefaultDescription } = input;

  const description = buildSeoDescription({
    candidates: [post.seoDescription, post.excerpt, post.content],
    defaultValue: jsonLdDefaultDescription,
    maxLength: 500,
  });

  const authorName = pickSeoText(post.authorName);
  const imageUrl = post.imageUrl ? toAbsoluteUrl(post.imageUrl, appUrl) : null;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: pickSeoText(post.title) ?? post.title,
    description,
    url: `${appUrl}/blog/${post.slug}`,
    ...(post.publishedAt !== null && { datePublished: post.publishedAt }),
    ...(post.updatedAt !== null && { dateModified: post.updatedAt }),
    ...(authorName !== null && { author: { "@type": "Person", name: authorName } }),
    ...(imageUrl !== null && { image: imageUrl }),
  };
}
