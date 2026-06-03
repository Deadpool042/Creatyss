import { db } from "@/core/db";

export type AdminFeatureFlagSummary = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  scopeType: "GLOBAL" | "STORE" | "USER";
  isEnabledByDefault: boolean;
  overridesCount: number;
  updatedAt: string;
};

export async function listAdminFeatureFlags(): Promise<AdminFeatureFlagSummary[]> {
  const flags = await db.featureFlag.findMany({
    where: { archivedAt: null },
    orderBy: [{ status: "asc" }, { code: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      status: true,
      scopeType: true,
      isEnabledByDefault: true,
      updatedAt: true,
      _count: { select: { overrides: true } },
    },
  });

  return flags.map((f) => ({
    id: f.id,
    code: f.code,
    name: f.name,
    description: f.description,
    status: f.status as AdminFeatureFlagSummary["status"],
    scopeType: f.scopeType as AdminFeatureFlagSummary["scopeType"],
    isEnabledByDefault: f.isEnabledByDefault,
    overridesCount: f._count.overrides,
    updatedAt: f.updatedAt.toISOString(),
  }));
}
