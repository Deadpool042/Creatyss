import { db } from "@/core/db";

type ArchiveAdminMediaInput = {
  assetId: string;
};

export async function archiveAdminMedia(input: ArchiveAdminMediaInput): Promise<void> {
  await db.mediaAsset.update({
    where: { id: input.assetId },
    data: { archivedAt: new Date() },
  });
}
