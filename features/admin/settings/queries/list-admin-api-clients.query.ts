import { db } from "@/core/db";

export type AdminApiClientSummary = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "REVOKED" | "ARCHIVED";
  clientId: string;
  lastUsedAt: string | null;
  activatedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

export async function listAdminApiClients(): Promise<AdminApiClientSummary[]> {
  const clients = await db.apiClient.findMany({
    where: { archivedAt: null },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      status: true,
      clientId: true,
      lastUsedAt: true,
      activatedAt: true,
      revokedAt: true,
      createdAt: true,
    },
  });

  return clients.map((c) => ({
    id: c.id,
    code: c.code,
    name: c.name,
    description: c.description,
    status: c.status as AdminApiClientSummary["status"],
    clientId: c.clientId,
    lastUsedAt: c.lastUsedAt?.toISOString() ?? null,
    activatedAt: c.activatedAt?.toISOString() ?? null,
    revokedAt: c.revokedAt?.toISOString() ?? null,
    createdAt: c.createdAt.toISOString(),
  }));
}
