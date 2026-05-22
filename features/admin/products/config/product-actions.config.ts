export const PRODUCT_FORM_ACTIONS_COPY = {
  createProductLabel: "Créer le produit",
  saveProductInfoLabel: "Enregistrer les informations",
} as const;

export const PRODUCT_LIST_ACTIONS_COPY = {
  viewResultsLabel: "Voir les résultats",
  mobileFiltersLabel: "Filtres",
  mobileFiltersWithCountSeparator: " · ",
  foundSingularSuffix: "produit trouvé",
  foundPluralSuffix: "produits trouvés",
} as const;

export const PRODUCT_RESULTS_COUNT_COPY = {
  results: (count: number) => `${count} ${count === 1 ? "produit trouvé" : "produits trouvés"}`,
  resultsShort: (count: number) => `${count} prod.`,
} as const;

export const PRODUCT_ARCHIVE_ACTIONS_COPY = {
  archiveSuccessSuffix: "archivé",
  archiveErrorTitle: "Échec de l'archivage",
} as const;

export const PRODUCT_CREATE_MENU_COPY = {
  triggerLabel: "Nouveau",
  createProductLabel: "Créer un produit",
} as const;
