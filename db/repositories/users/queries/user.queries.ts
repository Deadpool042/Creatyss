import { prisma } from "@/db/prisma-client";
import { userDetailSelect, userListSelect } from "../types/rows";

export async function findUserRowById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: userDetailSelect,
  });
}

export async function findUserRowByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: userDetailSelect,
  });
}

export async function listUserRows() {
  return prisma.user.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: userListSelect,
  });
}
