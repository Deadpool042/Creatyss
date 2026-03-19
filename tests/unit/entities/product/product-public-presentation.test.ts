import { describe, expect, it } from "vitest";
import {
  getOfferAvailabilityMessage,
  getProductAvailabilityLabel,
  getProductOfferSectionPresentation,
  getProductPageStatusSummary,
  getSimpleOfferCardTitle,
  getVariantAvailabilityLabel,
  getVariantDefaultBadgeLabel,
} from "@/entities/product/product-public-presentation";

describe("product-public-presentation", () => {
  it("retourne des libellés lisibles pour la disponibilité produit et déclinaison", () => {
    expect(getProductAvailabilityLabel(true)).toBe("Disponible");
    expect(getProductAvailabilityLabel(false)).toBe("Temporairement indisponible");
    expect(getVariantAvailabilityLabel(true)).toBe("Disponible");
    expect(getVariantAvailabilityLabel(false)).toBe("Temporairement indisponible");
  });

  it("retourne une synthèse claire pour un produit avec déclinaisons disponible", () => {
    expect(
      getProductPageStatusSummary({
        productType: "variable",
        totalVariantCount: 2,
        availableVariantCount: 1,
      })
    ).toEqual({
      title: "Produit disponible",
      description: "1 déclinaison disponible sur 2.",
      nextStep: "Choisissez une déclinaison disponible ci-dessous.",
    });
  });

  it("retourne une synthèse claire pour un produit simple disponible", () => {
    expect(
      getProductPageStatusSummary({
        productType: "simple",
        totalVariantCount: 1,
        availableVariantCount: 1,
      })
    ).toEqual({
      title: "Produit disponible",
      description: "Ce produit est disponible à l'achat.",
      nextStep: "Choisissez la quantité puis ajoutez ce produit au panier.",
    });
  });

  it("retourne une synthèse neutre pour un produit simple incohérent", () => {
    expect(
      getProductPageStatusSummary({
        productType: "simple",
        totalVariantCount: 2,
        availableVariantCount: 1,
      })
    ).toEqual({
      title: "Offre indisponible pour le moment",
      description: "Ce produit simple n'est pas disponible pour le moment.",
      nextStep: "Revenez plus tard pour vérifier sa disponibilité.",
    });
  });

  it("retourne les libellés de section cohérents pour un produit simple", () => {
    const presentation = getProductOfferSectionPresentation("simple");

    expect(presentation.eyebrow).toBe("Informations de vente");
    expect(presentation.title).toBe("Informations de vente");
    expect(presentation.emptyEyebrow).toBe("Informations de vente");
    expect(presentation.emptyTitle).toBe("Ce produit simple n'est pas disponible pour le moment");
    expect(presentation.description).toContain("prix");
    expect(presentation.description).toContain("disponibilité");
    expect(presentation.description).toContain("panier");
    expect(presentation.emptyDescription).toContain("informations de vente");
  });

  it("retourne les libellés de section cohérents pour un produit avec déclinaisons", () => {
    const presentation = getProductOfferSectionPresentation("variable");

    expect(presentation.eyebrow).toBe("Déclinaisons");
    expect(presentation.title).toBe("Choisir une déclinaison");
    expect(presentation.emptyEyebrow).toBe("Aucune déclinaison");
    expect(presentation.emptyTitle).toBe("Ce produit n'a pas encore de déclinaison disponible");
    expect(presentation.description).toContain("déclinaisons");
    expect(presentation.description).toContain("panier");
    expect(presentation.emptyDescription).toContain("déclinaisons");
  });

  it("retourne des messages d'achat utiles pour simple et produit avec déclinaisons", () => {
    expect(getSimpleOfferCardTitle()).toBe("Produit simple");
    expect(getOfferAvailabilityMessage({ productType: "simple", isAvailable: true })).toBe(
      "Choisissez la quantité puis ajoutez ce produit au panier."
    );
    expect(getOfferAvailabilityMessage({ productType: "simple", isAvailable: false })).toBe(
      "Ce produit n'est pas disponible pour le moment."
    );
    expect(
      getOfferAvailabilityMessage({
        productType: "variable",
        isAvailable: true,
      })
    ).toBe("Sélectionnez une quantité puis ajoutez cette déclinaison au panier.");
    expect(
      getOfferAvailabilityMessage({
        productType: "variable",
        isAvailable: false,
      })
    ).toBe(
      "Cette déclinaison est temporairement indisponible. Choisissez une autre déclinaison pour continuer."
    );
    expect(getVariantDefaultBadgeLabel(true)).toBe("Par défaut");
    expect(getVariantDefaultBadgeLabel(false)).toBeNull();
  });
});
