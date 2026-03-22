export type AdminMediaAssetSummary = {
  id: string;
  storageKey: string;
  originalName: string;
  mimeType: string;
  byteSize: bigint;
  width: number | null;
  height: number | null;
  altText: string | null;
  checksumSha256: string | null;
  uploadedByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminMediaAssetDetail = AdminMediaAssetSummary;

export type CreateAdminMediaAssetInput = {
  storageKey: string;
  originalName: string;
  mimeType: string;
  byteSize: bigint;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  checksumSha256?: string | null;
  uploadedByUserId?: string | null;
};

export type UpdateAdminMediaAssetInput = {
  id: string;
  altText?: string | null;
};

export type AdminMediaRepositoryErrorCode =
  | "media_not_found"
  | "media_storage_key_invalid"
  | "media_original_name_invalid"
  | "media_mime_type_invalid"
  | "media_byte_size_invalid"
  | "media_dimensions_invalid"
  | "media_uploaded_by_user_invalid"
  | "media_storage_key_conflict"
  | "media_checksum_conflict";

export class AdminMediaRepositoryError extends Error {
  readonly code: AdminMediaRepositoryErrorCode;

  constructor(code: AdminMediaRepositoryErrorCode, message: string) {
    super(message);
    this.name = "AdminMediaRepositoryError";
    this.code = code;
  }
}
