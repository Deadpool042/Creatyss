import { getMediaImagePlaceholderUrl } from "./placeholders";

export function hasRealImage(imageUrl?: string | null): boolean {
  return Boolean(imageUrl && imageUrl.trim().length > 0);
}

export function resolveImageUrl(imageUrl?: string | null): string {
  if (!imageUrl || imageUrl.trim().length === 0) {
    return getMediaImagePlaceholderUrl();
  }

  return imageUrl.trim();
}
