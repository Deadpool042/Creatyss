"use server";

import { redirect } from "next/navigation";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { MediaUploadError, uploadAdminMedia } from "@/features/admin/media";
import { archiveAdminMedia } from "@/features/admin/media/services/archive-admin-media.service";

import { buildMediaLibraryHref, parsePositiveInt } from "./admin-media-library-helpers";

export async function archiveMediaAction(formData: FormData) {
  await requireAuthenticatedAdmin();

  const assetId = formData.get("assetId");
  const page = parsePositiveInt(formData.get("page"));

  if (typeof assetId === "string" && assetId.trim().length > 0) {
    await archiveAdminMedia({ assetId: assetId.trim() });
  }

  redirect(buildMediaLibraryHref({ page, status: "archived" }));
}

export async function uploadMediaAction(formData: FormData) {
  await requireAuthenticatedAdmin();

  try {
    const asset = await uploadAdminMedia({
      file: formData.get("file"),
    });

    redirect(buildMediaLibraryHref({ assetId: asset.id, status: "uploaded" }));
  } catch (error) {
    const errorCode = error instanceof MediaUploadError ? error.code : "upload_failed";
    redirect(buildMediaLibraryHref({ error: errorCode }));
  }
}
