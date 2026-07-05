import { Prisma } from "@/prisma-generated/client";

import { db } from "@/core/db";

type UpdateAdminMediaMetadataInput = {
  assetId: string;
  slug: string | null;
  title: string | null;
  altText: string | null;
  caption: string | null;
  description: string | null;
};

export class UpdateAdminMediaMetadataError extends Error {
  code: "asset_not_found" | "slug_conflict";

  constructor(code: UpdateAdminMediaMetadataError["code"]) {
    super(code);
    this.code = code;
    this.name = "UpdateAdminMediaMetadataError";
  }
}

export async function updateAdminMediaMetadata(
  input: UpdateAdminMediaMetadataInput
): Promise<void> {
  try {
    const updated = await db.mediaAsset.updateMany({
      where: {
        id: input.assetId,
      },
      data: {
        slug: normalizeNullable(input.slug),
        title: normalizeNullable(input.title),
        altText: normalizeNullable(input.altText),
        caption: normalizeNullable(input.caption),
        description: normalizeNullable(input.description),
      },
    });

    if (updated.count === 0) {
      throw new UpdateAdminMediaMetadataError("asset_not_found");
    }
  } catch (error) {
    if (error instanceof UpdateAdminMediaMetadataError) {
      throw error;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new UpdateAdminMediaMetadataError("slug_conflict");
    }

    throw error;
  }
}

function normalizeNullable(value: string | null): string | null {
  if (value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
