import { describe, expect, it } from "vitest";

import { getBlogPostPublishability } from "@/entities/blog/blog-post-publishability";

describe("getBlogPostPublishability", () => {
  it("rejette un article sans contenu", () => {
    expect(getBlogPostPublishability({ content: null })).toEqual({
      ok: false,
      code: "cannot_publish_missing_content",
    });
  });

  it("rejette un article avec contenu vide ou blanc", () => {
    expect(getBlogPostPublishability({ content: "   " })).toEqual({
      ok: false,
      code: "cannot_publish_missing_content",
    });
  });

  it("accepte un article avec contenu", () => {
    expect(getBlogPostPublishability({ content: "Contenu éditorial prêt à publier" })).toEqual({
      ok: true,
    });
  });
});
