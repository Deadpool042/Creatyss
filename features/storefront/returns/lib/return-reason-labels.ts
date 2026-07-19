import {
  RETURN_REASON_CATEGORY_VALUES,
  type ReturnReasonCategory,
} from "@/features/commerce/returns/domain/return-eligibility.types";

/**
 * Libellés FR des motifs de retour storefront. `Record<ReturnReasonCategory,
 * string>` force l'exhaustivité à la compilation : si le domaine ajoute une
 * catégorie, ce fichier ne compile plus tant qu'un libellé n'est pas fourni.
 */
export const RETURN_REASON_CATEGORY_LABELS: Record<ReturnReasonCategory, string> = {
  WITHDRAWAL: "Je change d'avis",
  PRODUCT_DEFECT: "Le produit est défectueux",
  TRANSPORT_DAMAGE: "Le produit est arrivé endommagé",
  WRONG_ITEM_RECEIVED: "Ce n'est pas l'article commandé",
  MISSING_ITEM: "Un article manque",
  OTHER: "Autre motif",
};

/** Options prêtes pour un `<select>`, dans l'ordre canonique du domaine. */
export const RETURN_REASON_CATEGORY_OPTIONS: ReadonlyArray<{
  value: ReturnReasonCategory;
  label: string;
}> = RETURN_REASON_CATEGORY_VALUES.map((value) => ({
  value,
  label: RETURN_REASON_CATEGORY_LABELS[value],
}));
