import type {
  UserAccountDetail,
  UserAccountRoleAssignment,
  UserAccountRoleScope,
  UserAccountStatus,
  UserAccountSummary,
} from "@db-users/accounts";
import type { UserAccountRow, UserRoleAssignmentRow } from "@db-users/types/rows";

export function mapUserAccountStatusToPrisma(
  status: UserAccountStatus
): "INVITED" | "ACTIVE" | "SUSPENDED" | "DISABLED" | "ARCHIVED" {
  switch (status) {
    case "invited":
      return "INVITED";
    case "active":
      return "ACTIVE";
    case "suspended":
      return "SUSPENDED";
    case "disabled":
      return "DISABLED";
    case "archived":
      return "ARCHIVED";
  }
}

function mapUserAccountStatus(
  status: "INVITED" | "ACTIVE" | "SUSPENDED" | "DISABLED" | "ARCHIVED"
): UserAccountStatus {
  switch (status) {
    case "INVITED":
      return "invited";
    case "ACTIVE":
      return "active";
    case "SUSPENDED":
      return "suspended";
    case "DISABLED":
      return "disabled";
    case "ARCHIVED":
      return "archived";
  }
}

function mapRoleScopeType(scopeType: "PLATFORM" | "STORE"): UserAccountRoleScope {
  return scopeType === "PLATFORM" ? "platform" : "store";
}

function mapUserRoleAssignment(row: UserRoleAssignmentRow): UserAccountRoleAssignment {
  return {
    id: row.id,
    roleId: row.role.id,
    roleCode: row.role.code,
    roleName: row.role.name,
    scopeType: mapRoleScopeType(row.role.scopeType),
    assignedAt: row.assignedAt,
  };
}

export function mapUserLifecycleDatesForStatus(status: UserAccountStatus, now: Date) {
  switch (status) {
    case "invited":
      return {
        invitedAt: now,
      };
    case "active":
      return {
        activatedAt: now,
      };
    case "suspended":
      return {
        suspendedAt: now,
      };
    case "disabled":
      return {
        disabledAt: now,
      };
    case "archived":
      return {};
  }
}

export function mapUserAccountSummary(row: UserAccountRow): UserAccountSummary {
  const roleAssignments = row.directUserRoles.map(mapUserRoleAssignment);

  return {
    id: row.id,
    storeId: row.storeId,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    displayName: row.displayName,
    status: mapUserAccountStatus(row.status),
    lastSeenAt: row.lastSeenAt,
    roleCodes: roleAssignments.map((assignment) => assignment.roleCode),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapUserAccountDetail(row: UserAccountRow): UserAccountDetail {
  const roleAssignments = row.directUserRoles.map(mapUserRoleAssignment);

  return {
    ...mapUserAccountSummary(row),
    invitedAt: row.invitedAt,
    activatedAt: row.activatedAt,
    suspendedAt: row.suspendedAt,
    disabledAt: row.disabledAt,
    roleAssignments,
  };
}
