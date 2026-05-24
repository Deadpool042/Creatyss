import type {
  ProductFilterFeaturedOption,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductListView,
  ProductSortOption,
  ProductTableStatus,
  ProductTableStatusFilter,
} from "@/features/admin/products/list/types/product-table.types";

// ─── Server-side filter valid values ─────────────────────────────────────────

export const PRODUCT_FILTER_VALID_VALUES = {
  statuses: ["active", "draft", "inactive"] satisfies ProductTableStatus[],
  featured: ["all", "featured", "standard"] satisfies ProductFilterFeaturedOption[],
  sorts: ["updated-desc", "updated-asc", "name-asc", "name-desc"] satisfies ProductSortOption[],
  perPage: [12, 24, 48, 96],
  perPageDefault: 24,
} as const;

// ─── Filter options ──────────────────────────────────────────────────────────

export const PRODUCT_STATUS_OPTIONS: { value: ProductTableStatusFilter; label: string }[] = [
  { value: "all", label: "Tous les statuts" },
  { value: "active", label: "Actif" },
  { value: "inactive", label: "Inactif" },
  { value: "draft", label: "Brouillon" },
  { value: "archived", label: "Archivé" },
];

export const PRODUCT_STATUS_LABELS: Record<ProductTableStatus, string> = {
  active: "Actif",
  inactive: "Inactif",
  draft: "Brouillon",
  archived: "Archivé",
};

export const PRODUCT_FEATURED_OPTIONS: { value: ProductFilterFeaturedOption; label: string }[] = [
  { value: "all", label: "Tous les produits" },
  { value: "featured", label: "Mis en avant" },
  { value: "standard", label: "Standard" },
];

export const PRODUCT_IMAGE_OPTIONS: { value: ProductFilterImageOption; label: string }[] = [
  { value: "all", label: "Toutes les images" },
  { value: "with-image", label: "Avec image" },
  { value: "without-image", label: "Sans image" },
];

export const PRODUCT_VARIANT_OPTIONS: { value: ProductFilterVariantOption; label: string }[] = [
  { value: "all", label: "Tous les produits" },
  { value: "single", label: "Simple" },
  { value: "multiple", label: "Multi-variantes" },
];

export const PRODUCT_STOCK_OPTIONS: { value: ProductFilterStockOption; label: string }[] = [
  { value: "all", label: "Toutes les disponibilités" },
  { value: "in-stock", label: "En stock" },
  { value: "out-of-stock", label: "Rupture" },
];

export const PRODUCT_SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: "updated-desc", label: "Plus récents" },
  { value: "updated-asc", label: "Plus anciens" },
  { value: "name-asc", label: "Nom A → Z" },
  { value: "name-desc", label: "Nom Z → A" },
];

// ─── Toolbar copy ─────────────────────────────────────────────────────────────

// export const PRODUCT_LIST_PAGE_COPY = {
//   eyebrow: "Catalogue",
//   title: "Produits",
//   titleTrash: "Corbeille produits",
//   description: "Pilotage du catalogue.",
//   descriptionTrash: "Produits archivés, restaurables plus tard.",
//   navHomeLabel: "Accueil",
//   navProductsLabel: "Produits",
// } as const;

// ─── Toolbar copy ─────────────────────────────────────────────────────────────

export const PRODUCT_LIST_COPY = {
  searchPlaceholder: "Rechercher un produit…",
  searchPlaceholderMobile: "Rechercher…",
  filtersTitle: "Filtres produits",
  filterStatutLabel: "Statut",
  filterCategoryLabel: "Catégorie",
  filterCategoryAllLabel: "Toutes les catégories",
  filterSubcategoryAllLabel: "Toutes les sous-catégories",
  filterAdvancedLabel: "Avancés",
  filterAdvancedFeaturedLabel: "Mise en avant",
  filterAdvancedImagesLabel: "Images",
  filterAdvancedVariantsLabel: "Variantes",
  filterAdvancedStockLabel: "Disponibilité",
  filterAdvancedDescription: "Mise en avant, images, variantes, disponibilité",
  filterAdvancedSummary: "Afficher",
  filterAdvancedActiveSummary: (count: number) => `${count} actif${count > 1 ? "s" : ""}`,
  mobileFiltersTitle: "Filtres produits",
  mobileFiltersTitleActive: (count: number) => `Filtres produits · ${count}`,
  mobileFiltersLabel: "Filtres",
  mobileFiltersActiveLabel: (count: number) => `Filtres · ${count}`,
  mobileFiltersAriaActive: (count: number) =>
    `${count} filtre${count > 1 ? "s" : ""} actif${count > 1 ? "s" : ""}`,
  mobileFiltersAriaOpen: "Ouvrir les filtres",
  mobileFiltersActiveSection: "Filtres actifs",
  activeFiltersResetLabel: "Réinitialiser",
  mobileFiltersDescription: (count: number) =>
    `${count} filtre${count > 1 ? "s" : ""} actif${count > 1 ? "s" : ""}.`,
  mobileFiltersDescriptionEmpty: "Affiner la liste.",
  mobileFiltersReset: "Réinitialiser",
  mobileFiltersApply: "Appliquer",
  viewActiveLabel: "Actifs",
  viewTrashLabel: "Corbeille",
} as const;

export const PRODUCT_LIST_VIEW_OPTIONS: {
  value: ProductListView;
  label: string;
  href: string;
}[] = [
  { value: "active", label: PRODUCT_LIST_COPY.viewActiveLabel, href: "/admin/products" },
  { value: "trash", label: PRODUCT_LIST_COPY.viewTrashLabel, href: "/admin/products?view=trash" },
];

export const PRODUCT_LIST_ACTIONS_COPY = {
  viewResultsLabel: "Voir les résultats",
  mobileFiltersLabel: "Filtres",
  mobileFiltersWithCountSeparator: " · ",
} as const;

// ─── Selection copy ───────────────────────────────────────────────────────────

export const PRODUCT_SELECTION_COPY = {
  selectedDesktop: (count: number) =>
    `${count} produit${count > 1 ? "s" : ""} sélectionné${count > 1 ? "s" : ""}`,
  clearSelectionDesktop: "Effacer la sélection",
  clearSelectionMobile: "Effacer",
  selectPageAriaLabel: "Sélectionner les produits de la page",
  selectVisibleAriaLabel: "Sélectionner les produits affichés",
} as const;

// ─── Bulk actions copy ────────────────────────────────────────────────────────

export const PRODUCT_BULK_ACTIONS_COPY = {
  setDraft: "Brouillon",
  setActive: "Activer",
  setInactive: "Désactiver",
  setFeatured: "Mettre en avant",
  unsetFeatured: "Retirer la mise en avant",
  archive: "Corbeille",
  restore: "Restaurer",
  hardDelete: "Supprimer définitivement",
} as const;

// ─── Results count copy ───────────────────────────────────────────────────────

export const PRODUCT_RESULTS_COUNT_COPY = {
  results: (count: number) => `${count} résultat${count !== 1 ? "s" : ""}`,
  resultsShort: (count: number) => `${count} res.`,
} as const;

// ─── Table copy ───────────────────────────────────────────────────────────────

export const PRODUCT_TABLE_COPY = {
  columns: {
    product: "Produit",
    featuredAria: "Mise en avant",
    status: "Statut",
    stock: "Disponibilité",
    price: "Prix",
    category: "Catégorie",
    updatedAt: "Modifié le",
  },
  emptyTrash: "Aucun produit dans la corbeille.",
  emptyFiltered: "Aucun produit trouvé.",
  mobileEndOfList: "Fin de la liste",
  paginationCountLabel: (count: number) => `${count} produit${count !== 1 ? "s" : ""}`,
} as const;

export const PRODUCT_LIST_EMPTY_STATE_COPY = {
  filtered: {
    eyebrow: "Aucun résultat",
    title: "Aucun produit ne correspond",
    description: "Essayez de modifier la recherche ou les filtres.",
    resetLabel: "Réinitialiser les filtres",
  },
  initial: {
    active: {
      eyebrow: "Aucun produit",
      title: "Le catalogue ne contient pas encore de produit",
      description: "Créez un premier produit pour commencer.",
      ctaLabel: "Créer un produit",
    },
    trash: {
      eyebrow: "Corbeille vide",
      title: "Aucun produit dans la corbeille",
      description: "Les produits archivés apparaîtront ici.",
      ctaLabel: "Voir les produits actifs",
    },
  },
} as const;

// ─── Stock badge copy ─────────────────────────────────────────────────────────

export const PRODUCT_STOCK_BADGE_COPY = {
  inStockLabel: "En stock",
  inStockShort: "Stock",
  lowStockLabel: "Stock faible",
  lowStockShort: "Faible",
  outOfStock: "Rupture",
  unknown: "Stock inconnu",
  withQuantityFull: (label: string, qty: number) => `${label} · ${qty}`,
  withQuantityShort: (label: string, qty: number) => `${label} ${qty}`,
} as const;

// ─── Row actions copy ─────────────────────────────────────────────────────────

export const PRODUCT_ROW_ACTIONS_COPY = {
  edit: "Modifier",
  preview: "Voir la fiche",
  menuAriaLabel: (name: string) => `Ouvrir les actions du produit ${name}`,
  archive: "Mettre à la corbeille",
  archivePending: "Déplacement…",
  archiveTitle: "Mettre ce produit à la corbeille ?",
  restore: "Restaurer",
  restorePending: "Restauration…",
  restoreTitle: "Restaurer ce produit ?",
  permanentDelete: "Supprimer définitivement",
  permanentDeletePending: "Suppression…",
  permanentDeleteTitle: "Supprimer définitivement ce produit ?",
  cancel: "Annuler",
  productLabel: "Produit concerné :",
  permanentDeleteWarning: "Cette suppression est définitive et ne pourra pas être annulée.",
  archiveDescriptionPrefix: "Cette action retirera",
  archiveDescriptionSuffix: "du catalogue actif.",
  restoreDescriptionPrefix: "Cette action replacera",
  restoreDescriptionSuffix: "dans le catalogue actif.",
  permanentDeleteDescriptionPrefix: "Cette action est irréversible.",
  permanentDeleteDescriptionSuffix: "sera supprimé définitivement du catalogue.",
} as const;

// ─── Bulk delete dialog copy ──────────────────────────────────────────────────

export const PRODUCT_BULK_DELETE_DIALOG_COPY = {
  title: "Supprimer définitivement la sélection ?",
  description:
    "Cette action est irréversible. Les produits sélectionnés seront supprimés définitivement du catalogue.",
  warning: "Cette suppression est définitive et ne pourra pas être annulée.",
  cancel: "Annuler",
  confirm: "Supprimer définitivement",
  pending: "Suppression…",
} as const;

// ─── Card badges copy ─────────────────────────────────────────────────────────

export const PRODUCT_CARD_BADGES_COPY = {
  variantSingle: "Simple",
  variantCountShort: (n: number) => `${n} var.`,
  variantCountFull: (n: number) => `${n} variante${n > 1 ? "s" : ""}`,
} as const;

// ─── Card actions copy ────────────────────────────────────────────────────────

export const PRODUCT_CARD_ACTIONS_COPY = {
  menuAriaLabel: (name: string) => `Actions pour ${name}`,
  preview: "Aperçu",
  edit: "Modifier",
} as const;

export const PRODUCT_CARD_COPY = {
  selectionAriaLabel: (name: string) => `Sélectionner ${name}`,
  selectionLabel: "Sélectionner",
  priceTileLabel: "Prix",
  categoryTileLabel: "Catégorie",
  imageFallbackLabel: (name: string) => `Aucun visuel pour ${name}`,
} as const;
