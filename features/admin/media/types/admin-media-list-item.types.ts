export type AdminMediaListItem = {
  id: string;
  originalName: string;
  filePath: string;
  previewUrl: string | null;
  mimeType: string;
  createdAt: string;
  byteSize: number | null;
  imageWidth: number | null;
  imageHeight: number | null;
};
