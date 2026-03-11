export type ProductPageStatusSummary = {
  title: string;
  description: string;
  nextStep: string;
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
  totalVariantCount: number;
  availableVariantCount: number;
}): ProductPageStatusSummary {
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

export function getVariantAvailabilityMessage(isAvailable: boolean): string {
  if (isAvailable) {
    return "Selectionnez une quantite puis ajoutez cette declinaison au panier.";
  }

  return "Cette declinaison est temporairement indisponible. Choisissez une autre declinaison pour continuer.";
}

export function getVariantDefaultBadgeLabel(isDefault: boolean): string | null {
  return isDefault ? "Par defaut" : null;
}
