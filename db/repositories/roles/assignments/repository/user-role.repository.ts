import { prisma } from "@/db/prisma-client";
import { mapUserRoleAssignment } from "@db-roles/helpers/mappers";
import { parseAssignUserRoleInput, parseUnassignUserRoleInput } from "@db-roles/helpers/validation";
import {
  findUserRoleAssignmentRow,
  listUserRoleAssignmentRowsByUserId,
} from "@db-roles/queries/user-role.queries";
import type {
  AssignUserRoleInput,
  UnassignUserRoleInput,
  UserRoleAssignment,
} from "@db-roles/assignments/types/user-role.types";

export async function listUserRoleAssignments(userId: string): Promise<UserRoleAssignment[]> {
  const rows = await listUserRoleAssignmentRowsByUserId(userId.trim());
  return rows.map(mapUserRoleAssignment);
}

export async function assignUserRole(input: AssignUserRoleInput): Promise<UserRoleAssignment> {
  const parsedInput = parseAssignUserRoleInput(input);

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: parsedInput.userId,
        roleId: parsedInput.roleId,
      },
    },
    update: {
      assignedById: parsedInput.assignedById ?? null,
    },
    create: {
      userId: parsedInput.userId,
      roleId: parsedInput.roleId,
      assignedById: parsedInput.assignedById ?? null,
    },
    select: {
      id: true,
    },
  });

  const row = await findUserRoleAssignmentRow(parsedInput.userId, parsedInput.roleId);

  if (!row) {
    throw new Error("User role assignment not found after upsert.");
  }

  return mapUserRoleAssignment(row);
}

export async function unassignUserRole(input: UnassignUserRoleInput): Promise<boolean> {
  const parsedInput = parseUnassignUserRoleInput(input);
  const deleted = await prisma.userRole.deleteMany({
    where: {
      userId: parsedInput.userId,
      roleId: parsedInput.roleId,
    },
  });

  return deleted.count > 0;
}
