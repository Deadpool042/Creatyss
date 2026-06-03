import { db } from "@/core/db";

export type AdminStoreDomain = {
  id: string;
  host: string;
  type: string;
  isEnabled: boolean;
  isCanonical: boolean;
  createdAt: string;
};

export type AdminStoreConfig = {
  id: string;
  code: string;
  slug: string;
  name: string;
  status: "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";
  isProduction: boolean;
  activatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  domains: AdminStoreDomain[];
};

export async function getAdminStoreConfig(): Promise<AdminStoreConfig | null> {
  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      code: true,
      slug: true,
      name: true,
      status: true,
      isProduction: true,
      activatedAt: true,
      createdAt: true,
      updatedAt: true,
      domains: {
        where: { disabledAt: null },
        orderBy: [{ type: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          host: true,
          type: true,
          isEnabled: true,
          isCanonical: true,
          createdAt: true,
        },
      },
    },
  });

  if (!store) return null;

  return {
    ...store,
    status: store.status as AdminStoreConfig["status"],
    activatedAt: store.activatedAt?.toISOString() ?? null,
    createdAt: store.createdAt.toISOString(),
    updatedAt: store.updatedAt.toISOString(),
    domains: store.domains.map((d) => ({
      ...d,
      type: d.type as string,
      createdAt: d.createdAt.toISOString(),
    })),
  };
}
