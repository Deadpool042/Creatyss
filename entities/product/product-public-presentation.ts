import { type ProductType } from "./product-input";

export type ProductPublicStatusSummary = {
  title: string;
  description: string;
  nextStep: string;
};

export type ProductPublicSectionPresentation = {
  eyebrow: string;
  title: string;
  description: string;
  emptyEyebrow: string;
  emptyTitle: string;
  emptyDescription: string;
};

function formatVariantCount(count: number): string {
  return `${count} declinaison${count > 1 ? "s" : ""}`;
}

export function getProductAvailabilityLabel(isAvailable: boolean): string {
  return isAvailable ? "Disponible" : "Temporairement indisponible";
}

export function getVariantAvailabilityLabel(isAvailable: boolean): string {
  return getProductAvailabilityLabel(isAvailable);
}

export function getProductPageStatusSummary(input: {
  productType: ProductType;
  totalVariantCount: number;
  availableVariantCount: number;
}): ProductPublicStatusSummary {
  if (input.productType === "simple") {
    if (input.totalVariantCount !== 1) {
      return {
        title: "Offre indisponible pour le moment",
        description:
          "Ce produit simple n'est pas accessible dans une configuration vendable unique pour le moment.",
        nextStep: "Revenez plus tard pour verifier sa disponibilite."
      };
    }

    if (input.availableVariantCount === 0) {
      return {
        title: "Produit temporairement indisponible",
        description: "Cette offre unique n'est pas disponible actuellement.",
        nextStep: "Revenez plus tard pour verifier sa disponibilite."
      };
    }

    return {
      title: "Produit disponible",
      description: "Cette offre unique est disponible a l'achat.",
      nextStep: "Choisissez la quantite puis ajoutez le produit au panier."
    };
  }

  if (input.totalVariantCount === 0) {
    return {
      title: "Produit sans declinaison publique",
      description: "Aucune declinaison vendable n'est visible pour le moment.",
      nextStep: "Revenez plus tard pour consulter les prochaines declinaisons."
    };
  }

  if (input.availableVariantCount === 0) {
    return {
      title: "Produit temporairement indisponible",
      description:
        "Les declinaisons publiees sont visibles, mais aucune n'est disponible actuellement.",
      nextStep: "Consultez les declinaisons pour verifier leurs informations."
    };
  }

  return {
    title: "Produit disponible",
    description: `${formatVariantCount(input.availableVariantCount)} disponible${input.availableVariantCount > 1 ? "s" : ""} sur ${input.totalVariantCount}.`,
    nextStep: "Choisissez une declinaison disponible ci-dessous."
  };
}

export function getProductOfferSectionPresentation(
  productType: ProductType
): ProductPublicSectionPresentation {
  if (productType === "simple") {
    return {
      eyebrow: "Offre",
      title: "Offre vendable",
      description:
        "Ce produit simple se presente comme une offre vendable unique.",
      emptyEyebrow: "Offre indisponible",
      emptyTitle: "Ce produit simple n'est pas disponible pour le moment",
      emptyDescription:
        "L'offre vendable unique n'est pas accessible actuellement."
    };
  }

  return {
    eyebrow: "Declinaisons",
    title: "Choisir une declinaison",
    description:
      "Verifiez le prix, la disponibilite et les visuels de chaque declinaison avant l'ajout au panier.",
    emptyEyebrow: "Aucune declinaison",
    emptyTitle: "Ce produit n'a pas encore de declinaison publique",
    emptyDescription:
      "Les declinaisons vendables apparaitront ici lorsqu'elles seront disponibles."
  };
}

export function getSimpleOfferCardTitle(): string {
  return "Offre vendable";
}

export function getOfferAvailabilityMessage(input: {
  productType: ProductType;
  isAvailable: boolean;
}): string {
  if (input.productType === "simple") {
    if (input.isAvailable) {
      return "Choisissez la quantite puis ajoutez le produit au panier.";
    }

    return "Cette offre est temporairement indisponible.";
  }

  if (input.isAvailable) {
    return "Selectionnez une quantite puis ajoutez cette declinaison au panier.";
  }

  return "Cette declinaison est temporairement indisponible. Choisissez une autre declinaison pour continuer.";
}

export function getVariantDefaultBadgeLabel(isDefault: boolean): string | null {
  return isDefault ? "Par defaut" : null;
}
