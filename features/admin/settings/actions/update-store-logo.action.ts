"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  uploadAdminMedia,
  MediaUploadError,
} from "@/features/admin/media/services/upload-admin-media.service";

export type StoreLogoActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export async function uploadStoreLogoAction(
  _prevState: StoreLogoActionState,
  formData: FormData
): Promise<StoreLogoActionState> {
  await requireAdminCapability("admin.settings.general.write");

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return { status: "error", message: "Boutique introuvable." };
  }

  try {
    const asset = await uploadAdminMedia({ file: formData.get("file") });

    await db.mediaAsset.update({
      where: { id: asset.id },
      data: { storeId },
    });

    await db.store.update({
      where: { id: storeId },
      data: { logoImageId: asset.id },
    });
  } catch (error) {
    if (error instanceof MediaUploadError) {
      const messages: Record<MediaUploadError["code"], string> = {
        missing_file: "Aucun fichier fourni.",
        empty_file: "Le fichier est vide.",
        file_too_large: "Le fichier dépasse 10 Mo.",
        unsupported_file: "Format non supporté (JPEG, PNG, WebP, AVIF uniquement).",
        write_failed: "Erreur lors de l'écriture du fichier.",
        database_insert_failed: "Erreur lors de l'enregistrement en base.",
      };
      return { status: "error", message: messages[error.code] };
    }
    return { status: "error", message: "Erreur inattendue. Réessayez." };
  }

  revalidatePath("/admin/settings/general");
  return { status: "success", message: "Logo mis à jour." };
}

export async function removeStoreLogoAction(
  _prevState: StoreLogoActionState,
  _formData: FormData
): Promise<StoreLogoActionState> {
  await requireAdminCapability("admin.settings.general.write");

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return { status: "error", message: "Boutique introuvable." };
  }

  await db.store.update({
    where: { id: storeId },
    data: { logoImageId: null },
  });

  revalidatePath("/admin/settings/general");
  return { status: "success", message: "Logo retiré." };
}
