import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  AdminUserRepositoryError,
  type AdminUserDetail,
  type AdminUserSummary,
  type CreateAdminUserInput,
  type UpdateAdminUserInput,
} from "./admin-user.types";
import { mapAdminUserDetail, mapAdminUserSummary } from "./helpers/mappers";
import {
  assertValidAdminUserId,
  normalizeUserEmail,
  parseCreateAdminUserInput,
  parseUpdateAdminUserInput,
} from "./helpers/validation";
import {
  findAdminUserRowByEmail,
  findAdminUserRowById,
  listAdminUserRows,
} from "./queries/admin-user.queries";

function mapPrismaAdminUserError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new AdminUserRepositoryError(
      "admin_user_email_conflict",
      "Un utilisateur admin avec cet email existe déjà."
    );
  }

  throw error;
}

export async function listAdminUsers(): Promise<AdminUserSummary[]> {
  const rows = await listAdminUserRows();
  return rows.map(mapAdminUserSummary);
}

export async function findAdminUserById(id: string): Promise<AdminUserDetail | null> {
  assertValidAdminUserId(id);

  const row = await findAdminUserRowById(id);

  if (!row) {
    return null;
  }

  return mapAdminUserDetail(row);
}

export async function findAdminUserByEmail(email: string): Promise<AdminUserDetail | null> {
  const normalizedEmail = normalizeUserEmail(email);
  const row = await findAdminUserRowByEmail(normalizedEmail);

  if (!row) {
    return null;
  }

  return mapAdminUserDetail(row);
}

export async function createAdminUser(input: CreateAdminUserInput): Promise<AdminUserDetail> {
  const parsedInput = parseCreateAdminUserInput(input);
  const normalizedEmail = normalizeUserEmail(parsedInput.email);

  try {
    const created = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: parsedInput.passwordHash,
        firstName: parsedInput.firstName ?? null,
        lastName: parsedInput.lastName ?? null,
        displayName: parsedInput.displayName ?? null,
        role: "admin",
        status: parsedInput.status ?? "active",
      },
      select: {
        id: true,
      },
    });

    const row = await findAdminUserRowById(created.id);

    if (!row) {
      throw new AdminUserRepositoryError("admin_user_not_found", "Utilisateur admin introuvable.");
    }

    return mapAdminUserDetail(row);
  } catch (error) {
    mapPrismaAdminUserError(error);
  }
}

export async function updateAdminUser(
  input: UpdateAdminUserInput
): Promise<AdminUserDetail | null> {
  const parsedInput = parseUpdateAdminUserInput(input);
  const data: {
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
    status?: "active" | "disabled";
  } = {
    firstName: parsedInput.firstName ?? null,
    lastName: parsedInput.lastName ?? null,
    displayName: parsedInput.displayName ?? null,
  };
  if (parsedInput.status !== undefined) {
    data.status = parsedInput.status;
  }

  try {
    const updated = await prisma.user.updateMany({
      where: {
        id: parsedInput.id,
        role: "admin",
      },
      data,
    });

    if (updated.count === 0) {
      return null;
    }

    const row = await findAdminUserRowById(parsedInput.id);

    if (!row) {
      return null;
    }

    return mapAdminUserDetail(row);
  } catch (error) {
    mapPrismaAdminUserError(error);
  }
}

export async function disableAdminUser(id: string): Promise<boolean> {
  assertValidAdminUserId(id);

  const updated = await prisma.user.updateMany({
    where: {
      id,
      role: "admin",
    },
    data: {
      status: "disabled",
    },
  });

  return updated.count > 0;
}
