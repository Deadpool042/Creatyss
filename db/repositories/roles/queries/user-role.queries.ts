import { prisma } from "@/db/prisma-client";
import { userRoleAssignmentSelect, type UserRoleAssignmentRow } from "@db-roles/types/rows";

export async function listUserRoleAssignmentRowsByUserId(
  userId: string
): Promise<UserRoleAssignmentRow[]> {
  return prisma.userRole.findMany({
    where: {
      userId,
    },
    orderBy: [{ assignedAt: "desc" }],
    select: userRoleAssignmentSelect,
  });
}

export async function findUserRoleAssignmentRow(
  userId: string,
  roleId: string
): Promise<UserRoleAssignmentRow | null> {
  return prisma.userRole.findUnique({
    where: {
      userId_roleId: {
        userId,
        roleId,
      },
    },
    select: userRoleAssignmentSelect,
  });
}
