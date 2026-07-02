import { getCustomerFullName } from "@/entities/customer";
import { slugifyLabel } from "@/entities/shared/slug";

export const ADMIN_CUSTOMERS_LIST_PATH = "/admin/commerce/customers";
export const ADMIN_CUSTOMERS_SETTINGS_PATH = "/admin/commerce/customers/settings";

type AdminCustomerRouteInput = Readonly<{
  id: string;
  email: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
}>;

function getCustomerRouteLabel(customer: AdminCustomerRouteInput): string {
  const fullName = getCustomerFullName(customer)?.trim();
  const emailLocalPart = customer.email.split("@")[0]?.trim();
  const rawLabel = fullName && fullName.length > 0 ? fullName : emailLocalPart || "client";
  const slug = slugifyLabel(rawLabel);

  return slug.length > 0 ? slug : "client";
}

export function getAdminCustomerRouteKey(customer: AdminCustomerRouteInput): string {
  return `${getCustomerRouteLabel(customer)}~${customer.id}`;
}

export function parseAdminCustomerRouteKey(routeKey: string): string {
  const normalizedRouteKey = routeKey.trim();
  const separatorIndex = normalizedRouteKey.lastIndexOf("~");

  if (separatorIndex === -1) {
    return normalizedRouteKey;
  }

  return normalizedRouteKey.slice(separatorIndex + 1);
}

export function getAdminCustomerDetailPath(customer: AdminCustomerRouteInput): string {
  return `${ADMIN_CUSTOMERS_LIST_PATH}/${getAdminCustomerRouteKey(customer)}`;
}
