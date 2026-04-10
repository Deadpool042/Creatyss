const UPLOADS_PUBLIC_PATH = "/uploads";
export const PLACEHOLDER_FILENAME = "creatyss.webp";

export function getMediaImagePlaceholderUrl(): string {
  return `${UPLOADS_PUBLIC_PATH}/${PLACEHOLDER_FILENAME}`;
}
