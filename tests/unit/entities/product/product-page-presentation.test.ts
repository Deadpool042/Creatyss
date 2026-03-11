import { describe, expect, it } from "vitest";
import {
  getProductAvailabilityLabel,
  getProductPageStatusSummary,
  getVariantAvailabilityLabel,
  getVariantAvailabilityMessage,
  getVariantDefaultBadgeLabel
} from "@/entities/product/product-page-presentation";

describe("product-page-presentation", () => {
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

  it("retourne une synthese claire pour un produit disponible", () => {
    expect(
      getProductPageStatusSummary({
        totalVariantCount: 2,
        availableVariantCount: 1
      })
    ).toEqual({
      title: "Produit disponible",
      description: "1 declinaison disponible sur 2.",
      nextStep: "Choisissez une declinaison disponible ci-dessous."
    });
  });

  it("retourne une synthese claire pour un produit temporairement indisponible", () => {
    expect(
      getProductPageStatusSummary({
        totalVariantCount: 2,
        availableVariantCount: 0
      })
    ).toEqual({
      title: "Produit temporairement indisponible",
      description:
        "Les declinaisons publiees sont visibles, mais aucune n'est disponible actuellement.",
      nextStep: "Consultez les declinaisons pour verifier leurs informations."
    });
  });

  it("retourne une synthese claire quand aucune declinaison publique n'existe", () => {
    expect(
      getProductPageStatusSummary({
        totalVariantCount: 0,
        availableVariantCount: 0
      })
    ).toEqual({
      title: "Produit sans declinaison publique",
      description: "Aucune declinaison vendable n'est visible pour le moment.",
      nextStep: "Revenez plus tard pour consulter les prochaines declinaisons."
    });
  });

  it("retourne un message discret pour une declinaison indisponible et un badge pour la declinaison par defaut", () => {
    expect(getVariantAvailabilityMessage(true)).toBe(
      "Selectionnez une quantite puis ajoutez cette declinaison au panier."
    );
    expect(getVariantAvailabilityMessage(false)).toBe(
      "Cette declinaison est temporairement indisponible. Choisissez une autre declinaison pour continuer."
    );
    expect(getVariantDefaultBadgeLabel(true)).toBe("Par defaut");
    expect(getVariantDefaultBadgeLabel(false)).toBeNull();
  });
});
