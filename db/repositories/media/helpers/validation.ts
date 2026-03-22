import { z } from "zod";
import {
  AdminMediaRepositoryError,
  type CreateAdminMediaAssetInput,
  type UpdateAdminMediaAssetInput,
} from "../admin-media.types";
import { MediaRepositoryError } from "../media.types";

const idSchema = z.string().trim().min(1);
const storageKeySchema = z.string().trim().min(1);
const originalNameSchema = z.string().trim().min(1);
const mimeTypeSchema = z.string().trim().min(1);
const byteSizeSchema = z.bigint().positive();
const nullablePositiveIntSchema = z.number().int().positive().nullable();
const uploadedByUserIdSchema = z.string().trim().min(1);

const createAdminMediaAssetInputSchema = z.object({
  storageKey: storageKeySchema,
  originalName: originalNameSchema,
  mimeType: mimeTypeSchema,
  byteSize: byteSizeSchema,
  width: nullablePositiveIntSchema.optional(),
  height: nullablePositiveIntSchema.optional(),
  altText: z.string().trim().nullable().optional(),
  checksumSha256: z.string().trim().nullable().optional(),
  uploadedByUserId: uploadedByUserIdSchema.nullable().optional(),
});

const updateAdminMediaAssetInputSchema = z.object({
  id: idSchema,
  altText: z.string().trim().nullable().optional(),
});

export function assertValidMediaId(id: string): void {
  const result = idSchema.safeParse(id);

  if (!result.success) {
    throw new MediaRepositoryError("media_not_found", "Média introuvable.");
  }
}

export function normalizeMediaStorageKey(value: string): string {
  return value.trim();
}

export function parseCreateAdminMediaAssetInput(
  input: CreateAdminMediaAssetInput
): CreateAdminMediaAssetInput {
  const result = createAdminMediaAssetInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "storageKey":
        throw new AdminMediaRepositoryError(
          "media_storage_key_invalid",
          "La clé de stockage du média est invalide."
        );
      case "originalName":
        throw new AdminMediaRepositoryError(
          "media_original_name_invalid",
          "Le nom original du média est invalide."
        );
      case "mimeType":
        throw new AdminMediaRepositoryError(
          "media_mime_type_invalid",
          "Le type MIME du média est invalide."
        );
      case "byteSize":
        throw new AdminMediaRepositoryError(
          "media_byte_size_invalid",
          "La taille du média est invalide."
        );
      case "width":
      case "height":
        throw new AdminMediaRepositoryError(
          "media_dimensions_invalid",
          "Les dimensions du média sont invalides."
        );
      case "uploadedByUserId":
        throw new AdminMediaRepositoryError(
          "media_uploaded_by_user_invalid",
          "L'utilisateur lié au média est invalide."
        );
      default:
        throw new AdminMediaRepositoryError(
          "media_storage_key_invalid",
          "Les données du média sont invalides."
        );
    }
  }

  const data = result.data;
  const parsed: CreateAdminMediaAssetInput = {
    storageKey: data.storageKey,
    originalName: data.originalName,
    mimeType: data.mimeType,
    byteSize: data.byteSize,
  };

  if (data.width !== undefined) parsed.width = data.width;
  if (data.height !== undefined) parsed.height = data.height;
  if (data.altText !== undefined) parsed.altText = data.altText;
  if (data.checksumSha256 !== undefined) {
    parsed.checksumSha256 = data.checksumSha256;
  }
  if (data.uploadedByUserId !== undefined) {
    parsed.uploadedByUserId = data.uploadedByUserId;
  }

  return parsed;
}

export function parseUpdateAdminMediaAssetInput(
  input: UpdateAdminMediaAssetInput
): UpdateAdminMediaAssetInput {
  const result = updateAdminMediaAssetInputSchema.safeParse(input);

  if (!result.success) {
    throw new AdminMediaRepositoryError("media_not_found", "Média introuvable.");
  }

  const data = result.data;
  const parsed: UpdateAdminMediaAssetInput = {
    id: data.id,
  };

  if (data.altText !== undefined) {
    parsed.altText = data.altText;
  }

  return parsed;
}
