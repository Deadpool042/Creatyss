import "server-only";

// Components
export {
  CategoryTable,
  CategoryTableDesktop,
  CategoryTableMobile,
  CategoryTableRowActions,
  CategoryCreateTopbarMenu,
  CategoryEditorPanel,
  CategorySeoForm,
  CategoryImageForm,
  CategoryArchiveButton,
} from "./components";

// Context
export {
  CategoriesTableProvider,
  useCategoriesTableContext,
} from "./context/categories-data-provider";

// List hooks/types
export {
  useCategoryFilters,
  type CategoryFiltersState,
} from "./list";

// Queries
export {
  getAdminCategoryDetail,
  listAdminCategories,
  listCategoriesForPicker,
} from "./queries";
export type {
  CategoryFeaturedFilter,
  CategoryListFilters,
  CategoryListResult,
  CategoryPickerItem,
  CategorySortOption,
  CategoryStatusCounts,
} from "./list";

// Services
export {
  createAdminCategory,
  updateAdminCategory,
  updateCategorySeo,
  archiveAdminCategory,
  archiveAdminCategories,
  restoreAdminCategory,
  hardDeleteAdminCategory,
  setAdminCategoryImage,
  deleteAdminCategoryImage,
} from "./services";

// Schemas
export {
  categorySeoFormSchema,
  type CategorySeoFormSchema,
} from "./schemas";

// Config
export {
  CATEGORY_ARCHIVE_DIALOG_COPY,
  CATEGORY_ARCHIVE_SECTION_COPY,
  CATEGORY_CREATE_GENERAL_SECTION_COPY,
  CATEGORY_FIELD_COPY,
  CATEGORY_GENERAL_SECTION_COPY,
  CATEGORY_IMAGE_SECTION_COPY,
  CATEGORY_MEDIA_EMPTY_STATE_COPY,
  CATEGORY_SEO_SECTION_COPY,
} from "./config";

// Types
export {
  AdminCategoryServiceError,
  type AdminCategoryCardItem,
  type AdminCategoryDetail,
  type AdminCategoryServiceErrorCode,
  type AdminCategoryStatus,
  type AdminCategorySummary,
} from "./types";

// Shared routes
export {
  ADMIN_CATEGORIES_LIST_PATH,
  ADMIN_CATEGORIES_NEW_PATH,
  getAdminCategoryDetailPath,
} from "./shared/admin-categories-routes";

// Actions
export {
  createCategoryAction,
  updateCategoryAction,
  updateCategorySeoAction,
  archiveCategoryRedirectAction,
  archiveCategoryAction,
  bulkArchiveCategoriesAction,
  restoreCategoryAction,
  hardDeleteCategoryAction,
  setCategoryImageAction,
  deleteCategoryImageAction,
} from "./actions";
