import { db } from "@core/db";

export type AuthenticatedAdmin = {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
};

export async function findAdminUserById(adminId: string): Promise<AuthenticatedAdmin | null> {
  const user = await db.user.findUnique({
    where: {
      id: adminId,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName ?? "",
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
