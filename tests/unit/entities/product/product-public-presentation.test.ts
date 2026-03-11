import { describe, expect, it } from "vitest";
import {
  getOfferAvailabilityMessage,
  getProductAvailabilityLabel,
  getProductOfferSectionPresentation,
  getProductPageStatusSummary,
  getSimpleOfferCardTitle,
  getVariantAvailabilityLabel,
  getVariantDefaultBadgeLabel
} from "@/entities/product/product-public-presentation";

describe("product-public-presentation", () => {
  it("retourne des libelles lisibles pour la disponibilite produit et declinaison", () => {
    expect(getProductAvailabilityLabel(true)).toBe("Disponible");
    expect(getProductAvailabilityLabel(false)).toBe(
      "Temporairement indisponible"
    );
    expect(getVariantAvailabilityLabel(true)).toBe("Disponible");
    expect(getVariantAvailabilityLabel(false)).toBe(
      "Temporairement indisponible"
    );
  });

  it("retourne une synthese claire pour un produit variable disponible", () => {
    expect(
      getProductPageStatusSummary({
        productType: "variable",
        totalVariantCount: 2,
        availableVariantCount: 1
      })
    ).toEqual({
      title: "Produit disponible",
      description: "1 declinaison disponible sur 2.",
      nextStep: "Choisissez une declinaison disponible ci-dessous."
    });
  });

  it("retourne une synthese claire pour un produit simple disponible", () => {
    expect(
      getProductPageStatusSummary({
        productType: "simple",
        totalVariantCount: 1,
        availableVariantCount: 1
      })
    ).toEqual({
      title: "Produit disponible",
      description: "Cette offre unique est disponible a l'achat.",
      nextStep: "Choisissez la quantite puis ajoutez le produit au panier."
    });
  });

  it("retourne une synthese neutre pour un produit simple incoherent", () => {
    expect(
      getProductPageStatusSummary({
        productType: "simple",
        totalVariantCount: 2,
        availableVariantCount: 1
      })
    ).toEqual({
      title: "Offre indisponible pour le moment",
      description:
        "Ce produit simple n'est pas accessible dans une configuration vendable unique pour le moment.",
      nextStep: "Revenez plus tard pour verifier sa disponibilite."
    });
  });

  it("retourne des libelles de section coherents selon le type", () => {
    expect(getProductOfferSectionPresentation("simple")).toEqual({
      eyebrow: "Offre",
      title: "Offre vendable",
      description:
        "Ce produit simple se presente comme une offre vendable unique.",
      emptyEyebrow: "Offre indisponible",
      emptyTitle: "Ce produit simple n'est pas disponible pour le moment",
      emptyDescription:
        "L'offre vendable unique n'est pas accessible actuellement."
    });

    expect(getProductOfferSectionPresentation("variable")).toEqual({
      eyebrow: "Declinaisons",
      title: "Choisir une declinaison",
      description:
        "Verifiez le prix, la disponibilite et les visuels de chaque declinaison avant l'ajout au panier.",
      emptyEyebrow: "Aucune declinaison",
      emptyTitle: "Ce produit n'a pas encore de declinaison publique",
      emptyDescription:
        "Les declinaisons apparaitront ici lorsqu'elles seront disponibles."
    });
  });

  it("retourne des messages d'achat utiles pour simple et variable", () => {
    expect(getSimpleOfferCardTitle()).toBe("Offre vendable");
    expect(
      getOfferAvailabilityMessage({ productType: "simple", isAvailable: true })
    ).toBe("Choisissez la quantite puis ajoutez le produit au panier.");
    expect(
      getOfferAvailabilityMessage({ productType: "simple", isAvailable: false })
    ).toBe("Cette offre est temporairement indisponible.");
    expect(
      getOfferAvailabilityMessage({
        productType: "variable",
        isAvailable: true
      })
    ).toBe(
      "Selectionnez une quantite puis ajoutez cette declinaison au panier."
    );
    expect(
      getOfferAvailabilityMessage({
        productType: "variable",
        isAvailable: false
      })
    ).toBe(
      "Cette declinaison est temporairement indisponible. Choisissez une autre declinaison pour continuer."
    );
    expect(getVariantDefaultBadgeLabel(true)).toBe("Par defaut");
    expect(getVariantDefaultBadgeLabel(false)).toBeNull();
  });
});
