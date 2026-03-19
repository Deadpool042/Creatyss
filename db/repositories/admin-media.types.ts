export type AdminMediaAsset = {
  id: string;
  filePath: string;
  originalName: string;
  mimeType: string;
  byteSize: string;
  imageWidth: number | null;
  imageHeight: number | null;
  uploadedByAdminUserId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateAdminMediaAssetInput = {
  filePath: string;
  originalName: string;
  mimeType: string;
  byteSize: string;
  imageWidth: number | null;
  imageHeight: number | null;
  uploadedByAdminUserId: string | null;
};
