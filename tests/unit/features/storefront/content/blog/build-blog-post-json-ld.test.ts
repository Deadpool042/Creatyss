import { describe, expect, it } from "vitest";

import { buildBlogPostJsonLd } from "@/features/storefront/content/blog/model/build-blog-post-json-ld";

const basePost = {
  slug: "atelier-couture",
  title: "L'atelier couture",
  seoDescription: null,
  excerpt: null,
  content: null,
  authorName: null,
  publishedAt: null,
  updatedAt: null,
  imageUrl: null,
};

const appUrl = "https://creatyss.example";
const jsonLdDefaultDescription = "Article de test.";

describe("buildBlogPostJsonLd", () => {
  it("génère le JSON-LD minimal sans author, image, datePublished ni dateModified quand absents", () => {
    const jsonLd = buildBlogPostJsonLd({
      post: basePost,
      appUrl,
      jsonLdDefaultDescription,
    });

    expect(jsonLd).toEqual({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "L'atelier couture",
      description: "Article de test.",
      url: "https://creatyss.example/blog/atelier-couture",
    });
    expect(jsonLd).not.toHaveProperty("author");
    expect(jsonLd).not.toHaveProperty("image");
  });

  it("inclut author uniquement si authorName est défini et non vide", () => {
    const jsonLd = buildBlogPostJsonLd({
      post: { ...basePost, authorName: "  " },
      appUrl,
      jsonLdDefaultDescription,
    });

    expect(jsonLd).not.toHaveProperty("author");

    const jsonLdWithAuthor = buildBlogPostJsonLd({
      post: { ...basePost, authorName: "Camille" },
      appUrl,
      jsonLdDefaultDescription,
    });

    expect(jsonLdWithAuthor.author).toEqual({ "@type": "Person", name: "Camille" });
  });

  it("convertit l'image en URL absolue et l'omet si elle est invalide", () => {
    const jsonLd = buildBlogPostJsonLd({
      post: { ...basePost, imageUrl: "/uploads/cover.jpg" },
      appUrl,
      jsonLdDefaultDescription,
    });

    expect(jsonLd.image).toBe("https://creatyss.example/uploads/cover.jpg");
  });

  it("inclut datePublished et dateModified quand fournis", () => {
    const jsonLd = buildBlogPostJsonLd({
      post: {
        ...basePost,
        publishedAt: "2026-01-10T00:00:00.000Z",
        updatedAt: "2026-02-01T00:00:00.000Z",
      },
      appUrl,
      jsonLdDefaultDescription,
    });

    expect(jsonLd.datePublished).toBe("2026-01-10T00:00:00.000Z");
    expect(jsonLd.dateModified).toBe("2026-02-01T00:00:00.000Z");
  });

  it("utilise la cascade excerpt/content pour la description quand seoDescription est absent", () => {
    const jsonLd = buildBlogPostJsonLd({
      post: { ...basePost, excerpt: "Résumé de l'article" },
      appUrl,
      jsonLdDefaultDescription,
    });

    expect(jsonLd.description).toBe("Résumé de l'article.");
  });
});
