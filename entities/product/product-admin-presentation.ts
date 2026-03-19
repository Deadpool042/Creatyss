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
      typeLabel: "Produit simple",
      sellableCountLabel:
        variantCount === 0 ? "Informations de vente à compléter" : "Informations de vente prêtes",
      sectionEyebrow: "Produit simple",
      sectionTitle: "Informations de vente",
      sectionDescription:
        "Un produit simple se gère directement via sa référence, son prix, son stock et ses images.",
      saleFieldsetLegend: "Informations de vente",
      createActionLabel: "Définir les informations de vente",
      saveActionLabel: "Enregistrer les informations de vente",
      deleteActionLabel: "Supprimer les informations de vente",
      itemKicker: "Produit simple",
      imagesEyebrow: "Images",
      emptyEyebrow: "Informations de vente",
      emptyTitle: "Les informations de vente ne sont pas encore complètes",
      emptyDescription:
        "Renseignez la référence, le prix et le stock pour finaliser ce produit simple.",
    };
  }

  return {
    typeLabel: "Produit avec déclinaisons",
    sellableCountLabel: `${variantCount} déclinaison${variantCount > 1 ? "s" : ""}`,
    sectionEyebrow: "Déclinaisons",
    sectionTitle: "Déclinaisons",
    sectionDescription:
      "Chaque déclinaison regroupe sa référence, son prix, son statut, son stock et ses informations associées.",
    saleFieldsetLegend: "Informations de vente de la déclinaison",
    createActionLabel: "Ajouter une déclinaison",
    saveActionLabel: "Enregistrer la déclinaison",
    deleteActionLabel: "Supprimer la déclinaison",
    itemKicker: "Déclinaison",
    imagesEyebrow: "Images de la déclinaison",
    emptyEyebrow: "Aucune déclinaison",
    emptyTitle: "Ce produit n'a pas encore de déclinaison",
    emptyDescription:
      "Ajoutez une première déclinaison pour renseigner sa référence, son prix, son statut et son stock.",
  };
}
