import type { UserRole, UserStatus } from "./user.types";

export type AdminUserSummary = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminUserDetail = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAdminUserInput = {
  email: string;
  passwordHash: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  status?: UserStatus;
};

export type UpdateAdminUserInput = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  status?: UserStatus;
};

export type AdminUserRepositoryErrorCode =
  | "admin_user_not_found"
  | "admin_user_email_invalid"
  | "admin_user_password_invalid"
  | "admin_user_profile_invalid"
  | "admin_user_email_conflict";

export class AdminUserRepositoryError extends Error {
  readonly code: AdminUserRepositoryErrorCode;

  constructor(code: AdminUserRepositoryErrorCode, message: string) {
    super(message);
    this.name = "AdminUserRepositoryError";
    this.code = code;
  }
}
