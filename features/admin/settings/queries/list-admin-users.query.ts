import { db } from "@/core/db";

export type AdminUserSummary = {
  id: string;
  email: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  type: string;
  status: "INVITED" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";
  roles: string[];
  lastLoginAt: string | null;
  invitedAt: string | null;
  activatedAt: string | null;
  createdAt: string;
};

export async function listAdminUsers(): Promise<AdminUserSummary[]> {
  const users = await db.user.findMany({
    where: { archivedAt: null },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      email: true,
      displayName: true,
      firstName: true,
      lastName: true,
      type: true,
      status: true,
      lastLoginAt: true,
      invitedAt: true,
      activatedAt: true,
      createdAt: true,
      userRoles: {
        where: { revokedAt: null },
        select: { role: { select: { name: true } } },
      },
    },
  });

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    firstName: u.firstName,
    lastName: u.lastName,
    type: u.type as string,
    status: u.status as AdminUserSummary["status"],
    roles: u.userRoles.map((r) => r.role.name),
    lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
    invitedAt: u.invitedAt?.toISOString() ?? null,
    activatedAt: u.activatedAt?.toISOString() ?? null,
    createdAt: u.createdAt.toISOString(),
  }));
}
