import { db } from "@/core/db";

/**
 * État actif de la feature `commerce.taxation` pour un store donné (contexte
 * checkout, sans session admin). Résolution simple : flag ACTIVE + activé par
 * défaut. Tant que la feature est inactive, le checkout conserve une TVA à 0.
 */
export async function isTaxationActive(storeId: string): Promise<boolean> {
  const flag = await db.featureFlag.findFirst({
    where: {
      code: "commerce.taxation",
      archivedAt: null,
      OR: [{ storeId }, { storeId: null }],
    },
    select: { status: true, isEnabledByDefault: true },
  });

  return flag !== null && flag.status === "ACTIVE" && flag.isEnabledByDefault;
}
