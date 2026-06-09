export const ADMIN_ORDERS_DETAIL_CONTENT_CLASS = "gap-4";
export const ADMIN_ORDERS_DETAIL_SECTION_CLASS = "admin-split-detail-pane-fluid";
export const ADMIN_ORDERS_DETAIL_OVERVIEW_CONTENT_WIDTH = "fluid" as const;

export function buildAdminOrdersDetailSectionClassName(extraClassName?: string): string {
  return [ADMIN_ORDERS_DETAIL_SECTION_CLASS, extraClassName].filter(Boolean).join(" ");
}
