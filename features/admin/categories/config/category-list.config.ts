import {
  CATEGORY_LIFECYCLE_STATUS_LABELS,
  CATEGORY_LIFECYCLE_STATUS_VALUES,
} from "@/entities/category/category-status";
import type { AdminCategoryStatus } from "@/features/admin/categories/types";
import type { CategoryFeaturedFilter, CategorySortOption } from "@/features/admin/categories/list";

export const CATEGORY_FILTER_VALID_VALUES = {
  statuses: CATEGORY_LIFECYCLE_STATUS_VALUES satisfies readonly AdminCategoryStatus[],
  featured: ["featured", "not-featured"] satisfies readonly CategoryFeaturedFilter[],
  sorts: ["name-asc", "name-desc", "updated-asc", "updated-desc"] satisfies readonly CategorySortOption[],
  perPage: [5, 10, 25, 50],
  perPageDefault: 10,
} as const;

export const CATEGORY_STATUS_OPTIONS: { value: AdminCategoryStatus; label: string }[] = [
  ...CATEGORY_LIFECYCLE_STATUS_VALUES.map((value) => ({
    value,
    label: CATEGORY_LIFECYCLE_STATUS_LABELS[value],
  })),
];

export const CATEGORY_FEATURED_OPTIONS: { value: CategoryFeaturedFilter; label: string }[] = [
  { value: "featured", label: "Mis en avant" },
  { value: "not-featured", label: "Non mis en avant" },
];

export const CATEGORY_STATUS_LABELS: Record<AdminCategoryStatus, string> = {
  ...CATEGORY_LIFECYCLE_STATUS_LABELS,
};

export const CATEGORY_LIST_COPY = {
  searchPlaceholder: "Rechercher…",
  filtersTitle: "Filtres",
  filterCategoriesLabel: "Catégories",
  filterStatusLabel: "Statut",
  filterFeaturedLabel: "Mise en avant",
  filterCategoriesEmptyLabel: "Aucune catégorie disponible",
  resetFiltersLabel: "Réinitialiser les filtres",
  mobileFiltersActiveSection: "Filtres actifs",
  clearSelectionAriaLabel: "Désélectionner tout",
  activeFiltersResetLabel: "Réinitialiser",
  selectAllAriaLabel: "Tout sélectionner",
  rowSelectAriaPrefix: "Sélectionner",
  rowEditAriaPrefix: "Modifier",
  imageFallbackLabel: (name: string) => `Aucun visuel pour ${name}`,
  rowActionsAriaPrefix: "Ouvrir les actions de la catégorie",
  tableAriaLabel: "Liste des catégories",
  tableEndLabel: "Fin de la liste",
  featuredBadgeLabel: "Mise en avant",
  categoriesCountSuffixSingular: "catégorie",
  categoriesCountSuffixPlural: "catégories",
  bulkSelectionCountLabel: (count: number) =>
    `${count} ${count > 1 ? "sélectionnées" : "sélectionnée"}`,
  bulkArchiveAriaLabel: (count: number) => `Archiver ${count} catégorie${count > 1 ? "s" : ""}`,
  bulkArchivePendingLabel: "Archivage…",
  bulkArchiveLabel: (count: number) => `Archiver${count > 1 ? ` (${count})` : ""}`,
} as const;

export const CATEGORY_LIST_EMPTY_STATE_COPY = {
  filtered: {
    eyebrow: "Aucun résultat",
    title: "Aucune catégorie ne correspond",
    description: "Essayez de modifier la recherche ou les filtres.",
  },
  initial: {
    eyebrow: "Aucune catégorie",
    title: "Le catalogue ne contient pas encore de catégorie",
    description: "Créez une première catégorie pour structurer le catalogue.",
    ctaLabel: "Créer une catégorie",
  },
} as const;

export const CATEGORY_ROW_ACTIONS_COPY = {
  menuLabelPrefix: CATEGORY_LIST_COPY.rowActionsAriaPrefix,
  editLabel: "Modifier",
  archiveLabel: "Archiver",
  archivePendingLabel: "Archivage…",
  restoreLabel: "Restaurer",
  restorePendingLabel: "Restauration…",
  hardDeleteLabel: "Supprimer définitivement",
  hardDeleteDialogTitle: (categoryName: string) => `Supprimer définitivement "${categoryName}" ?`,
  hardDeleteDialogDescription:
    "Cette action est irréversible. La catégorie et toutes ses données associées seront définitivement supprimées.",
} as const;

export const CATEGORY_TABLE_COPY = {
  columns: {
    image: "Image",
    category: "Catégorie",
    status: "Statut",
    featuredAria: "Mise en avant",
    products: "Produits",
    children: "Sous-cat.",
    sortOrder: "Ordre",
    updatedAt: "Modifiée le",
  },
  mobile: {
    productsLabel: "Produits",
    childrenLabel: "Sous-catégories",
  },
} as const;
