import { prisma } from "@/db/prisma-client";
import { userDetailSelect, userListSelect } from "../types/rows";

export async function listAdminUserRows() {
  return prisma.user.findMany({
    where: {
      role: "admin",
    },
    orderBy: [{ createdAt: "desc" }],
    select: userListSelect,
  });
}

export async function findAdminUserRowById(id: string) {
  return prisma.user.findFirst({
    where: {
      id,
      role: "admin",
    },
    select: userDetailSelect,
  });
}

export async function findAdminUserRowByEmail(email: string) {
  return prisma.user.findFirst({
    where: {
      email,
      role: "admin",
    },
    select: userDetailSelect,
  });
}
