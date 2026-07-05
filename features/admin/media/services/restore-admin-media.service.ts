import { db } from "@/core/db";

type RestoreAdminMediaInput = {
  assetId: string;
};

export async function restoreAdminMedia(input: RestoreAdminMediaInput): Promise<void> {
  await db.mediaAsset.updateMany({
    where: {
      id: input.assetId,
      archivedAt: {
        not: null,
      },
    },
    data: {
      archivedAt: null,
    },
  });
}
