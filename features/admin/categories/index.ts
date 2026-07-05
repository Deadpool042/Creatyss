import "server-only";

// Components
export { CategoriesPanelList } from "./components/list/categories-panel-list";
export { CategoryCreateTopbarMenu } from "./components/create/category-create-topbar-menu";
export { CategoryArchivedPanel } from "./components/edit/category-archived-panel";
export { CategoryDetailSummary } from "./components/edit/category-detail-summary";
export { CategoryEditorPanel } from "./components/edit/category-editor-panel";
export { CategorySeoForm } from "./components/edit/category-seo-form";
export { CategoryImageForm } from "./components/edit/category-image-form";
export { CategoryArchiveButton } from "./components/edit/category-archive-button";
export { CategoryRestoreButton } from "./components/edit/category-restore-button";
export { CategoryParentField } from "./components/shared/category-parent-field";

// List hooks/types
export { useCategoryFilters, type CategoryFiltersState } from "./list";

// Queries
export { getAdminCategoryDetail, listAdminCategories, listCategoriesForPicker } from "./queries";
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
export { categorySeoFormSchema, type CategorySeoFormSchema } from "./schemas";

// Config
export {
  CATEGORY_ARCHIVED_NOTICE_COPY,
  CATEGORY_ARCHIVE_DIALOG_COPY,
  CATEGORY_ARCHIVE_SECTION_COPY,
  CATEGORY_CREATE_GENERAL_SECTION_COPY,
  CATEGORY_FIELD_COPY,
  CATEGORY_GENERAL_SECTION_COPY,
  CATEGORY_IMAGE_SECTION_COPY,
  CATEGORY_MEDIA_EMPTY_STATE_COPY,
  CATEGORY_RESTORE_SECTION_COPY,
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
export {
  ADMIN_CATEGORIES_DETAIL_CONTENT_CLASS,
  ADMIN_CATEGORIES_DETAIL_CONSTRAIN_CONTENT,
  ADMIN_CATEGORIES_DETAIL_OVERVIEW_CONTENT_WIDTH,
} from "./shared/admin-categories-detail-layout";

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
