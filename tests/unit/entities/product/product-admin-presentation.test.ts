import { describe, expect, it } from "vitest";
import { getAdminProductPresentation } from "@/entities/product/product-admin-presentation";

describe("getAdminProductPresentation", () => {
  it("retourne le vocabulaire V6 pour un produit simple", () => {
    const presentation = getAdminProductPresentation("simple", 0);

    expect(presentation.typeLabel).toBe("Produit simple");
    expect(presentation.sellableCountLabel).toBe(
      "Informations de vente à compléter"
    );
    expect(presentation.sectionTitle).toBe("Informations de vente");
    expect(presentation.createActionLabel).toBe(
      "Définir les informations de vente"
    );
    expect(presentation.saveActionLabel).toBe(
      "Enregistrer les informations de vente"
    );
    expect(presentation.emptyTitle).toBe(
      "Les informations de vente ne sont pas encore complètes"
    );
  });

  it("retourne le vocabulaire V6 pour un produit avec déclinaisons", () => {
    const presentation = getAdminProductPresentation("variable", 2);

    expect(presentation.typeLabel).toBe("Produit avec déclinaisons");
    expect(presentation.sellableCountLabel).toBe("2 déclinaisons");
    expect(presentation.sectionTitle).toBe("Déclinaisons");
    expect(presentation.createActionLabel).toBe("Ajouter une déclinaison");
    expect(presentation.saveActionLabel).toBe("Enregistrer la déclinaison");
  });
});
