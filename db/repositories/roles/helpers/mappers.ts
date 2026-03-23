import type {
  RoleDefinitionDetail,
  RoleScopeType,
  RoleStatus,
} from "@db-roles/definitions";
import type { UserRoleAssignment } from "@db-roles/assignments";
import type { RoleDefinitionRow, UserRoleAssignmentRow } from "@db-roles/types/rows";

export function mapRoleStatusToPrisma(
  status: RoleStatus
): "ACTIVE" | "DISABLED" | "ARCHIVED" {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "disabled":
      return "DISABLED";
    case "archived":
      return "ARCHIVED";
  }
}

export function mapRoleScopeTypeToPrisma(
  scopeType: RoleScopeType
): "PLATFORM" | "STORE" {
  return scopeType === "platform" ? "PLATFORM" : "STORE";
}

function mapRoleStatus(status: "ACTIVE" | "DISABLED" | "ARCHIVED"): RoleStatus {
  switch (status) {
    case "ACTIVE":
      return "active";
    case "DISABLED":
      return "disabled";
    case "ARCHIVED":
      return "archived";
  }
}

function mapRoleScopeType(scopeType: "PLATFORM" | "STORE"): RoleScopeType {
  return scopeType === "PLATFORM" ? "platform" : "store";
}

export function mapRoleDefinition(row: RoleDefinitionRow): RoleDefinitionDetail {
  return {
    id: row.id,
    storeId: row.storeId,
    code: row.code,
    name: row.name,
    description: row.description,
    scopeType: mapRoleScopeType(row.scopeType),
    status: mapRoleStatus(row.status),
    isSystemRole: row.isSystemRole,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapUserRoleAssignment(row: UserRoleAssignmentRow): UserRoleAssignment {
  return {
    id: row.id,
    userId: row.userId,
    roleId: row.role.id,
    roleCode: row.role.code,
    roleName: row.role.name,
    roleScopeType: mapRoleScopeType(row.role.scopeType),
    assignedAt: row.assignedAt,
    assignedById: row.assignedById,
    assignedByEmail: row.assignedBy?.email ?? null,
  };
}
