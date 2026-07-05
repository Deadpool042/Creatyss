import { unlink } from "node:fs/promises";
import path from "node:path";

import { withTransaction } from "@/core/db";
import { getUploadsDirectory } from "@/core/uploads";

type DeleteAdminMediaPermanentlyInput = {
  assetId: string;
};

export class DeleteAdminMediaPermanentlyError extends Error {
  code: "asset_not_found" | "asset_not_archived";

  constructor(code: DeleteAdminMediaPermanentlyError["code"]) {
    super(code);
    this.code = code;
    this.name = "DeleteAdminMediaPermanentlyError";
  }
}

export async function deleteAdminMediaPermanently(
  input: DeleteAdminMediaPermanentlyInput
): Promise<void> {
  const fileKeys = await withTransaction(async (tx) => {
    const asset = await tx.mediaAsset.findUnique({
      where: { id: input.assetId },
      select: {
        id: true,
        archivedAt: true,
        storageKey: true,
        variants: {
          select: {
            storageKey: true,
          },
        },
      },
    });

    if (asset === null) {
      throw new DeleteAdminMediaPermanentlyError("asset_not_found");
    }

    if (asset.archivedAt === null) {
      throw new DeleteAdminMediaPermanentlyError("asset_not_archived");
    }

    await tx.mediaAsset.delete({
      where: {
        id: asset.id,
      },
    });

    return [asset.storageKey, ...asset.variants.map((variant) => variant.storageKey)];
  });

  const uploadsDirectory = getUploadsDirectory();
  await Promise.all(
    fileKeys.map((storageKey) =>
      unlink(path.join(uploadsDirectory, storageKey)).catch(() => undefined)
    )
  );
}
