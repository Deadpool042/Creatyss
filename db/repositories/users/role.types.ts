import type { UserRole } from "./user.types";

export type AvailableUserRole = UserRole;

export type UserRoleOption = {
  value: AvailableUserRole;
  label: string;
};
