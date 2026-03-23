export type UserAccountStatus = "invited" | "active" | "suspended" | "disabled" | "archived";
export type UserAccountRoleScope = "platform" | "store";

export type UserAccountRoleAssignment = {
  id: string;
  roleId: string;
  roleCode: string;
  roleName: string;
  scopeType: UserAccountRoleScope;
  assignedAt: Date;
};

export type UserAccountSummary = {
  id: string;
  storeId: string | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  status: UserAccountStatus;
  lastSeenAt: Date | null;
  roleCodes: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type UserAccountDetail = UserAccountSummary & {
  invitedAt: Date | null;
  activatedAt: Date | null;
  suspendedAt: Date | null;
  disabledAt: Date | null;
  roleAssignments: UserAccountRoleAssignment[];
};

export class UserAccountRepositoryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "UserAccountRepositoryError";
    this.code = code;
  }
}
