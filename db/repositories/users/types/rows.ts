import type { Prisma } from "@prisma/client";

export const userListSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  displayName: true,
  role: true,
  status: true,
  emailVerifiedAt: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const userDetailSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  displayName: true,
  role: true,
  status: true,
  emailVerifiedAt: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type UserListRow = Prisma.UserGetPayload<{
  select: typeof userListSelect;
}>;

export type UserDetailRow = Prisma.UserGetPayload<{
  select: typeof userDetailSelect;
}>;
