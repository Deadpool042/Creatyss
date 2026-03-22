export type MediaAssetSummary = {
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

export type MediaAssetDetail = MediaAssetSummary;

export type MediaRepositoryErrorCode = "media_not_found" | "media_storage_key_invalid";

export class MediaRepositoryError extends Error {
  readonly code: MediaRepositoryErrorCode;

  constructor(code: MediaRepositoryErrorCode, message: string) {
    super(message);
    this.name = "MediaRepositoryError";
    this.code = code;
  }
}
