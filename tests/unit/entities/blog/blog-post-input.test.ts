import { describe, expect, it } from "vitest";
import { normalizeBlogPostSlug, validateBlogPostInput } from "@/entities/blog/blog-post-input";

describe("normalizeBlogPostSlug", () => {
  it("normalise le slug article", () => {
    expect(normalizeBlogPostSlug("  Journal / Édition Été  ")).toBe("journal-edition-ete");
  });
});

describe("validateBlogPostInput", () => {
  it("valide un article nominal avec image de couverture issue d'un media", () => {
    const result = validateBlogPostInput({
      title: "  Journal atelier  ",
      slug: "  Journal / Édition Été  ",
      excerpt: "  Extrait  ",
      content: "  Contenu long  ",
      seoTitle: "  SEO title  ",
      seoDescription: "  SEO description  ",
      status: "published",
      currentCoverImagePath: null,
      coverImageMediaAssetId: "42",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        title: "Journal atelier",
        slug: "journal-edition-ete",
        excerpt: "Extrait",
        content: "Contenu long",
        seoTitle: "SEO title",
        seoDescription: "SEO description",
        status: "published",
        coverImage: {
          kind: "media_asset",
          mediaAssetId: "42",
        },
      },
    });
  });

  it("conserve explicitement l'image actuelle quand demande", () => {
    const result = validateBlogPostInput({
      title: "Article",
      slug: "article",
      excerpt: "",
      content: "",
      seoTitle: "",
      seoDescription: "",
      status: "draft",
      currentCoverImagePath: "blog/cover.jpg",
      coverImageMediaAssetId: "__keep_current__",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        title: "Article",
        slug: "article",
        excerpt: null,
        content: null,
        seoTitle: null,
        seoDescription: null,
        status: "draft",
        coverImage: {
          kind: "keep_current",
          filePath: "blog/cover.jpg",
        },
      },
    });
  });

  it("rejette la conservation d'image si aucun chemin actuel n'existe", () => {
    expect(
      validateBlogPostInput({
        title: "Article",
        slug: "article",
        excerpt: null,
        content: null,
        seoTitle: null,
        seoDescription: null,
        status: "draft",
        currentCoverImagePath: "",
        coverImageMediaAssetId: "__keep_current__",
      })
    ).toEqual({
      ok: false,
      code: "invalid_cover_image",
    });
  });

  it("rejette un statut invalide", () => {
    expect(
      validateBlogPostInput({
        title: "Article",
        slug: "article",
        excerpt: null,
        content: null,
        seoTitle: null,
        seoDescription: null,
        status: "scheduled",
        currentCoverImagePath: null,
        coverImageMediaAssetId: "",
      })
    ).toEqual({
      ok: false,
      code: "invalid_status",
    });
  });
});
