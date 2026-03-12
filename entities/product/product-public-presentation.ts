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
  return `${count} déclinaison${count > 1 ? "s" : ""}`;
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
          "Ce produit simple n'est pas disponible pour le moment.",
        nextStep: "Revenez plus tard pour vérifier sa disponibilité."
      };
    }

    if (input.availableVariantCount === 0) {
      return {
        title: "Produit temporairement indisponible",
        description: "Cette offre unique n'est pas disponible actuellement.",
        nextStep: "Revenez plus tard pour vérifier sa disponibilité."
      };
    }

    return {
      title: "Produit disponible",
      description: "Ce produit est disponible à l'achat.",
      nextStep: "Choisissez la quantité puis ajoutez ce produit au panier."
    };
  }

  if (input.totalVariantCount === 0) {
    return {
      title: "Produit sans déclinaison disponible",
      description: "Aucune déclinaison n'est visible pour le moment.",
      nextStep: "Revenez plus tard pour consulter les prochaines déclinaisons."
    };
  }

  if (input.availableVariantCount === 0) {
    return {
      title: "Produit temporairement indisponible",
      description:
        "Les déclinaisons publiées sont visibles, mais aucune n'est disponible actuellement.",
      nextStep: "Consultez les déclinaisons pour vérifier leurs informations."
    };
  }

  return {
    title: "Produit disponible",
    description: `${formatVariantCount(input.availableVariantCount)} disponible${input.availableVariantCount > 1 ? "s" : ""} sur ${input.totalVariantCount}.`,
    nextStep: "Choisissez une déclinaison disponible ci-dessous."
  };
}

export function getProductOfferSectionPresentation(
  productType: ProductType
): ProductPublicSectionPresentation {
  if (productType === "simple") {
    return {
      eyebrow: "Informations de vente",
      title: "Informations de vente",
      description:
        "Consultez le prix, la disponibilité et la quantité avant d'ajouter ce produit au panier.",
      emptyEyebrow: "Informations de vente",
      emptyTitle: "Ce produit simple n'est pas disponible pour le moment",
      emptyDescription:
        "Les informations de vente ne sont pas disponibles actuellement."
    };
  }

  return {
      eyebrow: "Déclinaisons",
      title: "Choisir une déclinaison",
      description:
        "Comparez les déclinaisons disponibles avant d'ajouter celle qui vous convient au panier.",
      emptyEyebrow: "Aucune déclinaison",
      emptyTitle: "Ce produit n'a pas encore de déclinaison disponible",
      emptyDescription:
        "Les déclinaisons apparaîtront ici lorsqu'elles seront disponibles."
  };
}

export function getSimpleOfferCardTitle(): string {
  return "Produit simple";
}

export function getOfferAvailabilityMessage(input: {
  productType: ProductType;
  isAvailable: boolean;
}): string {
  if (input.productType === "simple") {
    if (input.isAvailable) {
      return "Choisissez la quantité puis ajoutez ce produit au panier.";
    }

    return "Ce produit n'est pas disponible pour le moment.";
  }

  if (input.isAvailable) {
    return "Sélectionnez une quantité puis ajoutez cette déclinaison au panier.";
  }

  return "Cette déclinaison est temporairement indisponible. Choisissez une autre déclinaison pour continuer.";
}

export function getVariantDefaultBadgeLabel(isDefault: boolean): string | null {
  return isDefault ? "Par défaut" : null;
}
