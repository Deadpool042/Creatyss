import sharp from "sharp";
import { WEBP_OPTIONS } from "../constants";

export type TransformedImage = {
  data: Buffer;
  mimeType: "image/webp";
  extension: "webp";
  widthPx: number | null;
  heightPx: number | null;
  sizeBytes: number;
};

export async function transformImageToWebp(source: Buffer): Promise<TransformedImage> {
  const { data, info } = await sharp(source)
    .webp(WEBP_OPTIONS)
    .toBuffer({ resolveWithObject: true });

  return {
    data,
    mimeType: "image/webp",
    extension: "webp",
    widthPx: info.width ?? null,
    heightPx: info.height ?? null,
    sizeBytes: data.length,
  };
}
