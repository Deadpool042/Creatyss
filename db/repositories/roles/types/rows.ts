import type { Prisma } from "@prisma/client";

export const roleDefinitionSelect = {
  id: true,
  storeId: true,
  code: true,
  name: true,
  description: true,
  scopeType: true,
  status: true,
  isSystemRole: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.RoleSelect;

export const userRoleAssignmentSelect = {
  id: true,
  userId: true,
  roleId: true,
  assignedById: true,
  assignedAt: true,
  role: {
    select: {
      id: true,
      code: true,
      name: true,
      scopeType: true,
    },
  },
  assignedBy: {
    select: {
      id: true,
      email: true,
    },
  },
} as const satisfies Prisma.UserRoleSelect;

export type RoleDefinitionRow = Prisma.RoleGetPayload<{
  select: typeof roleDefinitionSelect;
}>;

export type UserRoleAssignmentRow = Prisma.UserRoleGetPayload<{
  select: typeof userRoleAssignmentSelect;
}>;
