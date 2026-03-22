import type { UserRoleOption } from "./role.types";
import { listUserRoleOptions } from "./queries/role.queries";

export async function listAvailableRoles(): Promise<UserRoleOption[]> {
  return listUserRoleOptions();
}
