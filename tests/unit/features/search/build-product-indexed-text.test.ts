import { describe, expect, it } from "vitest";

import { buildProductIndexedText } from "@/features/search/services/sync-product-search-document.service";

describe("buildProductIndexedText", () => {
  it("double le nom pour la pondération et concatène les champs texte", () => {
    const text = buildProductIndexedText({
      name: "Bougie lavande",
      marketingHook: "Parfum de Provence",
      shortDescription: "Bougie artisanale",
      description: "Cire de soja et huile essentielle.",
    });

    expect(text).toBe(
      [
        "Bougie lavande",
        "Bougie lavande",
        "Parfum de Provence",
        "Bougie artisanale",
        "Cire de soja et huile essentielle.",
      ].join("\n")
    );
  });

  it("ignore les champs null ou vides", () => {
    const text = buildProductIndexedText({
      name: "Savon",
      marketingHook: null,
      shortDescription: "   ",
      description: null,
    });

    expect(text).toBe("Savon\nSavon");
  });
});
