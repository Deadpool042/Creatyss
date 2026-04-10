import { describe, expect, it } from "vitest";
import { validateBlogPostInput } from "@/entities/blog/blog-post-input";

describe("validateBlogPostInput", () => {
  it("valide une entrée complète", () => {
    const result = validateBlogPostInput({
      title: "Titre",
      slug: "titre",
      excerpt: "Résumé",
      content: "Contenu",
      seoTitle: "SEO titre",
      seoDescription: "SEO description",
      status: "draft",
      currentPrimaryImagePath: null,
      primaryImageMediaAssetId: "media_primary",
      currentCoverImagePath: null,
      coverImageMediaAssetId: "media_cover",
    });

    expect(result.ok).toBe(true);
  });

  it("accepte des images courantes existantes", () => {
    const result = validateBlogPostInput({
      title: "Titre",
      slug: "titre",
      excerpt: "Résumé",
      content: "Contenu",
      seoTitle: "SEO titre",
      seoDescription: "SEO description",
      status: "draft",
      currentPrimaryImagePath: "/uploads/primary.webp",
      primaryImageMediaAssetId: "media_primary",
      currentCoverImagePath: "/uploads/cover.webp",
      coverImageMediaAssetId: "media_cover",
    });

    expect(result.ok).toBe(true);
  });

  it("accepte les champs optionnels nuls", () => {
    const result = validateBlogPostInput({
      title: "Titre",
      slug: "titre",
      excerpt: null,
      content: null,
      seoTitle: null,
      seoDescription: null,
      status: "draft",
      currentPrimaryImagePath: "/uploads/primary.webp",
      primaryImageMediaAssetId: "media_primary",
      currentCoverImagePath: "/uploads/cover.webp",
      coverImageMediaAssetId: "media_cover",
    });

    expect(result.ok).toBe(true);
  });

  it("accepte sans images courantes", () => {
    const result = validateBlogPostInput({
      title: "Titre",
      slug: "titre",
      excerpt: null,
      content: null,
      seoTitle: null,
      seoDescription: null,
      status: "draft",
      currentPrimaryImagePath: null,
      primaryImageMediaAssetId: "media_primary",
      currentCoverImagePath: null,
      coverImageMediaAssetId: "media_cover",
    });

    expect(result.ok).toBe(true);
  });
});
