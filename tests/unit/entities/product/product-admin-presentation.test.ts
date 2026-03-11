import { describe, expect, it } from "vitest";
import { getAdminProductPresentation } from "@/entities/product/product-admin-presentation";

describe("getAdminProductPresentation", () => {
  it("returns singular sellable-offer labels for simple products", () => {
    const presentation = getAdminProductPresentation("simple", 0);

    expect(presentation.typeLabel).toBe("Simple");
    expect(presentation.sellableCountLabel).toBe("Aucune offre vendable");
    expect(presentation.sectionTitle).toBe("Offre vendable");
    expect(presentation.createActionLabel).toBe("Definir l'offre vendable");
    expect(presentation.saveActionLabel).toBe("Enregistrer l'offre vendable");
    expect(presentation.emptyTitle).toContain("offre vendable");
  });

  it("keeps plural declinaison wording for variable products", () => {
    const presentation = getAdminProductPresentation("variable", 2);

    expect(presentation.typeLabel).toBe("Variable");
    expect(presentation.sellableCountLabel).toBe("2 variantes");
    expect(presentation.sectionTitle).toBe("Produits vendables");
    expect(presentation.createActionLabel).toBe("Ajouter une declinaison");
    expect(presentation.saveActionLabel).toBe("Enregistrer la declinaison");
  });
});
