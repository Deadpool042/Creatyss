export const CATEGORY_FORM_ACTIONS_COPY = {
  createCategoryLabel: "Créer la catégorie",
  saveCategoryInfoLabel: "Enregistrer les informations",
} as const;

export const CATEGORY_LIST_ACTIONS_COPY = {
  viewResultsLabel: "Voir les résultats",
  mobileFiltersLabel: "Filtres",
  mobileFiltersWithCountSeparator: " · ",
  foundSingularSuffix: "catégorie trouvée",
  foundPluralSuffix: "catégories trouvées",
} as const;

export const CATEGORY_RESULTS_COUNT_COPY = {
  results: (count: number) => `${count} ${count === 1 ? "catégorie trouvée" : "catégories trouvées"}`,
  resultsShort: (count: number) => `${count} cat.`,
} as const;

export const CATEGORY_ARCHIVE_ACTIONS_COPY = {
  archiveSuccessSuffix: "archivée",
  archiveErrorTitle: "Échec de l'archivage",
} as const;

export const CATEGORY_CREATE_MENU_COPY = {
  triggerLabel: "Nouveau",
  createCategoryLabel: "Créer une catégorie",
} as const;
