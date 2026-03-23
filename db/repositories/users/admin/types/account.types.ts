import type { UserAccountDetail, UserAccountStatus, UserAccountSummary } from "@db-users/accounts";

export type AdminUserAccountSummary = UserAccountSummary;
export type AdminUserAccountDetail = UserAccountDetail;

export type CreateAdminUserAccountInput = {
  storeId?: string | null;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  status?: UserAccountStatus;
};

export type UpdateAdminUserAccountInput = {
  id: string;
  storeId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
};

export class AdminUserAccountRepositoryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AdminUserAccountRepositoryError";
    this.code = code;
  }
}
