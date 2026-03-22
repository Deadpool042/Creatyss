import { prisma } from "@/db/prisma-client";
import type { UpdateUserProfileInput, UserDetail, UserSummary } from "./user.types";
import { mapUserDetail, mapUserSummary } from "./helpers/mappers";
import {
  assertValidUserId,
  normalizeUserEmail,
  parseUpdateUserProfileInput,
} from "./helpers/validation";
import { findUserRowByEmail, findUserRowById, listUserRows } from "./queries/user.queries";

export async function listUsers(): Promise<UserSummary[]> {
  const rows = await listUserRows();
  return rows.map(mapUserSummary);
}

export async function findUserById(id: string): Promise<UserDetail | null> {
  assertValidUserId(id);

  const row = await findUserRowById(id);

  if (!row) {
    return null;
  }

  return mapUserDetail(row);
}

export async function findUserByEmail(email: string): Promise<UserDetail | null> {
  const normalizedEmail = normalizeUserEmail(email);
  const row = await findUserRowByEmail(normalizedEmail);

  if (!row) {
    return null;
  }

  return mapUserDetail(row);
}

export async function updateUserProfile(input: UpdateUserProfileInput): Promise<UserDetail | null> {
  const parsedInput = parseUpdateUserProfileInput(input);

  const updated = await prisma.user.updateMany({
    where: {
      id: parsedInput.id,
    },
    data: {
      firstName: parsedInput.firstName ?? null,
      lastName: parsedInput.lastName ?? null,
      displayName: parsedInput.displayName ?? null,
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findUserRowById(parsedInput.id);

  if (!row) {
    return null;
  }

  return mapUserDetail(row);
}
