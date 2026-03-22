import type { UserRoleOption } from "../role.types";

export async function listUserRoleOptions(): Promise<UserRoleOption[]> {
  return [
    { value: "admin", label: "Admin" },
    { value: "customer", label: "Customer" },
  ];
}
