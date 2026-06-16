import "server-only";

export {
  CustomerDetailForm,
  CustomerListFilters,
  CustomerMobileFiltersDrawer,
  createCustomerTableDesktopColumns,
  CustomerTable,
} from "./components";

export { updateAdminCustomerAction } from "./actions";
export { getAdminCustomerDetail, listAdminCustomers } from "./queries";

export type {
  AdminCustomerSummary,
  AdminCustomersFilter,
  AdminCustomersListResult,
} from "./types";

export { CustomersListPage } from "./routes";
export {
  ADMIN_EDITABLE_CUSTOMER_STATUSES,
  ADMIN_CUSTOMER_NAME_MAX_LENGTH,
  ADMIN_CUSTOMER_NOTES_MAX_LENGTH,
  ADMIN_CUSTOMER_PHONE_MAX_LENGTH,
  updateAdminCustomerSchema,
  type AdminEditableCustomerStatus,
  type UpdateAdminCustomerFormState,
  type UpdateAdminCustomerInput,
} from "./schemas";

export {
  ADMIN_CUSTOMERS_LIST_PATH,
  getAdminCustomerRouteKey,
  getAdminCustomerDetailPath,
  parseAdminCustomerRouteKey,
} from "./shared";
