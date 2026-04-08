export type AttachableMediaAssetItem = {
  id: string;
  publicUrl: string;
  altText: string | null;
  originalFilename: string | null;
  createdAt: string;
};

export type AttachableMediaAssetsData = {
  productId: string;
  items: AttachableMediaAssetItem[];
};
