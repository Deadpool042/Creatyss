import { prisma } from "@/db/prisma-client";
import type {
  AdminUser,
  AdminUserWithPassword,
  CreateAdminUserInput,
} from "./admin-users.types";

function mapPrismaAdminUser(row: {
  id: bigint;
  email: string;
  display_name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}): AdminUser {
  return {
    id: row.id.toString(),
    email: row.email,
    displayName: row.display_name,
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function findAdminUserByEmail(email: string): Promise<AdminUserWithPassword | null> {
  const row = await prisma.admin_users.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });

  if (row === null) {
    return null;
  }

  return {
    ...mapPrismaAdminUser(row),
    passwordHash: row.password_hash,
  };
}

export async function findAdminUserById(id: string): Promise<AdminUser | null> {
  const row = await prisma.admin_users.findUnique({
    where: { id: BigInt(id) },
  });

  return row !== null ? mapPrismaAdminUser(row) : null;
}

export async function createAdminUser(input: CreateAdminUserInput): Promise<AdminUser> {
  const row = await prisma.admin_users.create({
    data: {
      email: input.email,
      password_hash: input.passwordHash,
      display_name: input.displayName,
    },
  });

  return mapPrismaAdminUser(row);
}
