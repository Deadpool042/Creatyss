import type sharp from "sharp";

export const WOOCOMMERCE_MEDIA_ROOT = "imports/woocommerce";
export const DEFAULT_UPLOADS_DIR = "public/uploads";
export const WOO_PER_PAGE = 100;

export const WEBP_OPTIONS: sharp.WebpOptions = {
  quality: 85,
  effort: 4,
};
