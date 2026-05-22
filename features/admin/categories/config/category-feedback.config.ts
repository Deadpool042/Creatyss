export const CATEGORY_FORM_ERROR_MESSAGES: Record<string, string> = {
  missing_name: "Nom requis.",
  missing_slug: "Slug requis.",
  invalid_slug: "Slug invalide.",
  category_slug_taken: "Une catégorie utilise déjà cette adresse.",
  invalid_parent_assignment: "Une catégorie ne peut pas être sa propre catégorie parente.",
  parent_category_missing: "La catégorie parente sélectionnée est introuvable.",
  media_asset_missing: "Le média sélectionné est introuvable.",
  store_missing: "Aucune boutique disponible. Veuillez d'abord créer une boutique.",
};

export const CATEGORY_NEW_FORM_ERROR_MESSAGES: Record<string, string> = {
  ...CATEGORY_FORM_ERROR_MESSAGES,
  save_failed: "La catégorie n'a pas pu être créée.",
};

export const CATEGORY_EDIT_FORM_ERROR_MESSAGES: Record<string, string> = {
  ...CATEGORY_FORM_ERROR_MESSAGES,
  save_failed: "La catégorie n'a pas pu être enregistrée.",
};

export const CATEGORY_EDIT_FORM_STATUS_MESSAGES: Record<string, string> = {
  updated: "Catégorie mise à jour avec succès.",
};

export const CATEGORY_LIST_FEEDBACK_COPY = {
  bulkArchiveSuccessSingular: "Catégorie archivée",
  bulkArchiveSuccessPluralSuffix: "catégories archivées",
  bulkArchiveErrorTitle: "Échec de l'archivage",
  errorDescription: "Une erreur est survenue. Veuillez réessayer.",
  archiveSuccessSuffix: "archivée",
  restoreSuccessSuffix: "restaurée en brouillon",
  hardDeleteSuccessSuffix: "supprimée définitivement",
  restoreErrorTitle: "Échec de la restauration",
  hardDeleteErrorTitle: "Échec de la suppression",
} as const;

export function getCategoryNewFormErrorMessage(error: string | undefined): string | null {
  if (!error) return null;
  return CATEGORY_NEW_FORM_ERROR_MESSAGES[error] ?? null;
}

export function getCategoryEditFormErrorMessage(error: string | undefined): string | null {
  if (!error) return null;
  return CATEGORY_EDIT_FORM_ERROR_MESSAGES[error] ?? null;
}

export function getCategoryEditFormStatusMessage(status: string | undefined): string | null {
  if (!status) return null;
  return CATEGORY_EDIT_FORM_STATUS_MESSAGES[status] ?? null;
}
