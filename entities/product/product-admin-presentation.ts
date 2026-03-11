import { type ProductType } from "./product-input";

export type ProductAdminPresentation = {
  typeLabel: string;
  sellableCountLabel: string;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  saleFieldsetLegend: string;
  createActionLabel: string;
  saveActionLabel: string;
  deleteActionLabel: string;
  itemKicker: string;
  imagesEyebrow: string;
  emptyEyebrow: string;
  emptyTitle: string;
  emptyDescription: string;
};

export function getAdminProductPresentation(
  productType: ProductType,
  variantCount: number
): ProductAdminPresentation {
  if (productType === "simple") {
    return {
      typeLabel: "Simple",
      sellableCountLabel:
        variantCount === 0
          ? "Aucune offre vendable"
          : `${variantCount} offre vendable`,
      sectionEyebrow: "Produit simple",
      sectionTitle: "Offre vendable",
      sectionDescription:
        "Un produit simple repose sur une seule offre vendable. Renseignez son SKU, son prix, son stock et ses informations de variante ci-dessous.",
      saleFieldsetLegend: "Informations de l'offre vendable",
      createActionLabel: "Definir l'offre vendable",
      saveActionLabel: "Enregistrer l'offre vendable",
      deleteActionLabel: "Supprimer l'offre vendable",
      itemKicker: "Offre vendable",
      imagesEyebrow: "Images de l'offre vendable",
      emptyEyebrow: "Aucune offre vendable",
      emptyTitle: "Ce produit simple n'a pas encore d'offre vendable",
      emptyDescription:
        "Definissez l'offre vendable unique pour pouvoir renseigner son SKU, son prix et son stock."
    };
  }

  return {
    typeLabel: "Variable",
    sellableCountLabel: `${variantCount} declinaison${variantCount > 1 ? "s" : ""}`,
    sectionEyebrow: "Declinaisons",
    sectionTitle: "Declinaisons",
    sectionDescription:
      "Chaque declinaison regroupe son SKU, son prix, son statut, son stock et ses informations de variante.",
    saleFieldsetLegend: "Informations de la declinaison",
    createActionLabel: "Ajouter une declinaison",
    saveActionLabel: "Enregistrer la declinaison",
    deleteActionLabel: "Supprimer la declinaison",
    itemKicker: "Declinaison",
    imagesEyebrow: "Images de la declinaison",
    emptyEyebrow: "Aucune variante",
    emptyTitle: "Ce produit n'a pas encore de declinaison",
    emptyDescription:
      "Ajoutez une premiere declinaison pour renseigner son SKU, son prix, son statut et son stock."
  };
}
