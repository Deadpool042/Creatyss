import type { Prisma } from "@prisma/client";

const roleAssignmentSelect = {
  id: true,
  assignedAt: true,
  role: {
    select: {
      id: true,
      code: true,
      name: true,
      scopeType: true,
    },
  },
} as const satisfies Prisma.UserRoleSelect;

export const userAccountSelect = {
  id: true,
  storeId: true,
  email: true,
  firstName: true,
  lastName: true,
  displayName: true,
  status: true,
  lastSeenAt: true,
  invitedAt: true,
  activatedAt: true,
  suspendedAt: true,
  disabledAt: true,
  createdAt: true,
  updatedAt: true,
  directUserRoles: {
    orderBy: [{ assignedAt: "desc" }],
    select: roleAssignmentSelect,
  },
} as const satisfies Prisma.UserSelect;

export type UserAccountRow = Prisma.UserGetPayload<{
  select: typeof userAccountSelect;
}>;

export type UserRoleAssignmentRow = Prisma.UserRoleGetPayload<{
  select: typeof roleAssignmentSelect;
}>;
