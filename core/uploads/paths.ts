//core/uploads/paths.ts
import path from "node:path";
import { randomUUID } from "node:crypto";

import { getUploadsDirectory, getUploadsPublicPath } from "./runtime";

function sanitizeSegment(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildProductUploadRelativeDirectory(productSlug: string): string {
  const safeSlug = sanitizeSegment(productSlug) || "product";
  return path.join("products", safeSlug);
}

export function buildImageFilename(input: { baseName?: string | null }): string {
  const safeBaseName = sanitizeSegment(input.baseName ?? "") || "image";
  return `${Date.now()}-${safeBaseName}-${randomUUID().slice(0, 8)}.webp`;
}

export function buildUploadStoragePath(input: {
  relativeDirectory: string;
  filename: string;
}): string {
  return path.join(getUploadsDirectory(), input.relativeDirectory, input.filename);
}

export function buildUploadPublicUrl(input: {
  relativeDirectory: string;
  filename: string;
}): string {
  const publicBasePath = getUploadsPublicPath().replace(/\/$/, "");
  const relativePath = path.join(input.relativeDirectory, input.filename).replaceAll("\\", "/");

  return `${publicBasePath}/${relativePath}`;
}

export function buildStorageKeyFromPublicUrl(publicUrl: string): string {
  const normalized = publicUrl.trim().replace(/^\/+/, "");
  const uploadsPath = getUploadsPublicPath().replace(/^\/+/, "").replace(/\/+$/, "");

  if (normalized.startsWith(`${uploadsPath}/`)) {
    return normalized.slice(uploadsPath.length + 1);
  }

  return normalized;
}
