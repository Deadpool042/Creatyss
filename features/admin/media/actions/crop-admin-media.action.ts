"use server";

import { refresh } from "next/cache";
import { z } from "zod";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import {
  cropAdminMedia,
  MediaCropError,
} from "@/features/admin/media/services/crop-admin-media.service";

const cropFractionSchema = z.number().min(0).max(1);

const cropAdminMediaSchema = z
  .object({
    assetId: z.string().min(1),
    region: z.object({
      x: cropFractionSchema,
      y: cropFractionSchema,
      width: cropFractionSchema,
      height: cropFractionSchema,
    }),
  })
  .refine(
    (input) =>
      input.region.x + input.region.width <= 1.0001 &&
      input.region.y + input.region.height <= 1.0001,
    { message: "Crop region out of bounds." }
  );

export type CropAdminMediaActionInput = z.infer<typeof cropAdminMediaSchema>;

export type CropAdminMediaActionResult = {
  status: "success" | "error";
  message: string;
};

const CROP_ERROR_MESSAGES: Record<MediaCropError["code"], string> = {
  asset_not_found: "Média introuvable.",
  not_an_image: "Seules les images peuvent être recadrées.",
  file_unreadable: "Le fichier source est illisible.",
  invalid_region: "La zone de recadrage est invalide.",
  write_failed: "L'écriture de l'image recadrée a échoué.",
};

export async function cropAdminMediaAction(
  input: CropAdminMediaActionInput
): Promise<CropAdminMediaActionResult> {
  await requireAuthenticatedAdmin();

  const parsed = cropAdminMediaSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Paramètres de recadrage invalides.",
    };
  }

  try {
    await cropAdminMedia({
      assetId: parsed.data.assetId,
      region: parsed.data.region,
    });

    refresh();

    return {
      status: "success",
      message: "Image recadrée.",
    };
  } catch (error) {
    if (error instanceof MediaCropError) {
      return { status: "error", message: CROP_ERROR_MESSAGES[error.code] };
    }

    console.error("[media] cropAdminMediaAction failed:", error);

    return {
      status: "error",
      message: "Le recadrage a échoué.",
    };
  }
}
