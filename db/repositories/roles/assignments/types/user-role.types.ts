import type { RoleScopeType } from "@db-roles/definitions";

export type UserRoleAssignment = {
  id: string;
  userId: string;
  roleId: string;
  roleCode: string;
  roleName: string;
  roleScopeType: RoleScopeType;
  assignedAt: Date;
  assignedById: string | null;
  assignedByEmail: string | null;
};

export type AssignUserRoleInput = {
  userId: string;
  roleId: string;
  assignedById?: string | null;
};

export type UnassignUserRoleInput = {
  userId: string;
  roleId: string;
};
