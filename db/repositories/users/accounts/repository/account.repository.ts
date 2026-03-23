import { mapUserAccountDetail, mapUserAccountSummary } from "@db-users/helpers/mappers";
import { normalizeUserEmail } from "@db-users/helpers/validation";
import {
  findUserAccountRowByEmail,
  findUserAccountRowById,
  listUserAccountRows,
} from "@db-users/queries/user-account.queries";
import type { UserAccountDetail, UserAccountSummary } from "@db-users/accounts/types/account.types";

export async function listUserAccounts(storeId?: string | null): Promise<UserAccountSummary[]> {
  const rows = await listUserAccountRows(storeId);
  return rows.map(mapUserAccountSummary);
}

export async function findUserAccountById(id: string): Promise<UserAccountDetail | null> {
  const row = await findUserAccountRowById(id);
  return row ? mapUserAccountDetail(row) : null;
}

export async function findUserAccountByEmail(email: string): Promise<UserAccountDetail | null> {
  const row = await findUserAccountRowByEmail(normalizeUserEmail(email));
  return row ? mapUserAccountDetail(row) : null;
}
