// Components
export {
  CategoryTable,
  CategoryTableDesktop,
  CategoryTableMobile,
  CategoryTableRowActions,
  CategorieCreateTopbarMenu,
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

// Queries
export { getAdminCategoryDetail } from "./queries";
export { listAdminCategories } from "./list/queries/list-admin-categories.query";

// Services
export {
  createAdminCategory,
  updateAdminCategory,
  updateCategorySeo,
  archiveAdminCategory,
  archiveAdminCategories,
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
  type AdminCategoryDetail,
  type AdminCategoryServiceErrorCode,
  type AdminCategorySummary,
} from "./types";

// Actions
export {
  createCategoryAction,
  updateCategoryAction,
  updateCategorySeoAction,
  archiveCategoryRedirectAction,
  archiveCategoryAction,
  bulkArchiveCategoriesAction,
  setCategoryImageAction,
  deleteCategoryImageAction,
} from "./actions";
