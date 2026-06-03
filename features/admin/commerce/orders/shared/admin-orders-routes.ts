export const ADMIN_ORDERS_LIST_PATH = "/admin/commerce/orders";

export function getAdminOrderDetailPath(orderId: string): string {
  return `${ADMIN_ORDERS_LIST_PATH}/${orderId}`;
}
