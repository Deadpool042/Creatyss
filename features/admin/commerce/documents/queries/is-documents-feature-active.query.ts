import "server-only";

import { db } from "@/core/db";

const DOCUMENTS_FEATURE_FLAG_CODE = "commerce.documents";

export async function isDocumentsFeatureActive(): Promise<boolean> {
  const flag = await db.featureFlag.findFirst({
    where: {
      code: DOCUMENTS_FEATURE_FLAG_CODE,
      archivedAt: null,
    },
    select: {
      status: true,
      isEnabledByDefault: true,
    },
  });

  if (flag === null) {
    return false;
  }

  return flag.status === "ACTIVE" && flag.isEnabledByDefault;
}
