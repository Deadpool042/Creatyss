import { prisma } from "@/db/prisma-client";
import { userAccountSelect, type UserAccountRow } from "@db-users/types/rows";

export async function listUserAccountRows(storeId?: string | null): Promise<UserAccountRow[]> {
  const args: {
    where?: {
      storeId: string | null;
    };
    orderBy: Array<{ updatedAt: "desc" } | { email: "asc" }>;
    select: typeof userAccountSelect;
  } = {
    orderBy: [{ updatedAt: "desc" }, { email: "asc" }],
    select: userAccountSelect,
  };

  if (storeId !== undefined) {
    args.where = {
      storeId,
    };
  }

  return prisma.user.findMany(args);
}

export async function findUserAccountRowById(id: string): Promise<UserAccountRow | null> {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: userAccountSelect,
  });
}

export async function findUserAccountRowByEmail(email: string): Promise<UserAccountRow | null> {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: userAccountSelect,
  });
}
