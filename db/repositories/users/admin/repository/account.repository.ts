import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  mapUserAccountDetail,
  mapUserAccountStatusToPrisma,
  mapUserLifecycleDatesForStatus,
} from "@db-users/helpers/mappers";
import {
  normalizeUserEmail,
  parseCreateAdminUserAccountInput,
  parseUpdateAdminUserAccountInput,
} from "@db-users/helpers/validation";
import { findUserAccountRowById } from "@db-users/queries/user-account.queries";
import {
  AdminUserAccountRepositoryError,
  type AdminUserAccountDetail,
  type CreateAdminUserAccountInput,
  type UpdateAdminUserAccountInput,
} from "@db-users/admin";
import type { UserAccountStatus } from "@db-users/accounts";

function mapUserWriteError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new AdminUserAccountRepositoryError(
      "user_email_conflict",
      "Un compte avec cet email existe déjà."
    );
  }

  throw error;
}

export async function createAdminUserAccount(
  input: CreateAdminUserAccountInput
): Promise<AdminUserAccountDetail> {
  const parsedInput = parseCreateAdminUserAccountInput(input);
  const lifecycleDates = mapUserLifecycleDatesForStatus(parsedInput.status, new Date());

  try {
    const created = await prisma.user.create({
      data: {
        storeId: parsedInput.storeId ?? null,
        email: normalizeUserEmail(parsedInput.email),
        firstName: parsedInput.firstName ?? null,
        lastName: parsedInput.lastName ?? null,
        displayName: parsedInput.displayName ?? null,
        status: mapUserAccountStatusToPrisma(parsedInput.status),
        ...lifecycleDates,
      },
      select: {
        id: true,
      },
    });

    const row = await findUserAccountRowById(created.id);

    if (!row) {
      throw new AdminUserAccountRepositoryError("user_not_found", "Compte utilisateur introuvable.");
    }

    return mapUserAccountDetail(row);
  } catch (error) {
    mapUserWriteError(error);
  }
}

export async function updateAdminUserAccount(
  input: UpdateAdminUserAccountInput
): Promise<AdminUserAccountDetail | null> {
  const parsedInput = parseUpdateAdminUserAccountInput(input);
  const data: Prisma.UserUncheckedUpdateManyInput = {};

  if (parsedInput.storeId !== undefined) {
    data.storeId = parsedInput.storeId;
  }

  if (parsedInput.firstName !== undefined) {
    data.firstName = parsedInput.firstName;
  }

  if (parsedInput.lastName !== undefined) {
    data.lastName = parsedInput.lastName;
  }

  if (parsedInput.displayName !== undefined) {
    data.displayName = parsedInput.displayName;
  }

  const updated = await prisma.user.updateMany({
    where: {
      id: parsedInput.id,
    },
    data,
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findUserAccountRowById(parsedInput.id);
  return row ? mapUserAccountDetail(row) : null;
}

export async function changeAdminUserAccountStatus(
  id: string,
  status: UserAccountStatus
): Promise<AdminUserAccountDetail | null> {
  const updated = await prisma.user.updateMany({
    where: {
      id: id.trim(),
    },
    data: {
      status: mapUserAccountStatusToPrisma(status),
      ...mapUserLifecycleDatesForStatus(status, new Date()),
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findUserAccountRowById(id.trim());
  return row ? mapUserAccountDetail(row) : null;
}
