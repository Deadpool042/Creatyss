import type { MediaTxClient } from "../types/tx";

export async function deleteMediaAssetInTx(
  tx: MediaTxClient,
  mediaAssetId: string
): Promise<number> {
  const deleted = await tx.mediaAsset.deleteMany({
    where: {
      id: mediaAssetId,
    },
  });

  return deleted.count;
}
