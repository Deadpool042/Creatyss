export type UserRole = "admin" | "customer";

export type UserStatus = "active" | "disabled";

export type UserSummary = {
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

export type UserDetail = {
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

export type UpdateUserProfileInput = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
};

export type UserRepositoryErrorCode =
  | "user_not_found"
  | "user_email_invalid"
  | "user_profile_invalid";

export class UserRepositoryError extends Error {
  readonly code: UserRepositoryErrorCode;

  constructor(code: UserRepositoryErrorCode, message: string) {
    super(message);
    this.name = "UserRepositoryError";
    this.code = code;
  }
}
