import { z } from "zod";

function formText(min = 1) {
  return z.preprocess((v) => (typeof v === "string" ? v.trim() : ""), z.string().min(min));
}

function formOptionalText() {
  return z.preprocess(
    (v) => (typeof v === "string" && v.trim().length > 0 ? v.trim() : null),
    z.string().nullable()
  );
}

function formEnum<T extends string>(values: readonly [T, ...T[]]) {
  return z.preprocess((v) => (typeof v === "string" ? v.trim() : ""), z.enum(values));
}

export const BlogPostFormSchema = z.object({
  title: formText(),
  slug: formText(),
  excerpt: formOptionalText(),
  content: formOptionalText(),
  seoTitle: formOptionalText(),
  seoDescription: formOptionalText(),
  status: formEnum(["draft", "published"] as const),
  primaryImageMediaAssetId: formOptionalText(),
  currentPrimaryImagePath: formOptionalText(),
  coverImageMediaAssetId: formOptionalText(),
  currentCoverImagePath: formOptionalText(),
});

export type BlogPostFormInput = z.infer<typeof BlogPostFormSchema>;

export type ImageSelection =
  | { kind: "clear" }
  | { kind: "keep_current"; filePath: string }
  | { kind: "media_asset"; mediaAssetId: string };

export function parseImageSelection(
  mediaAssetId: string | null,
  currentFilePath: string | null
): { ok: true; data: ImageSelection } | { ok: false } {
  if (mediaAssetId === null) {
    return { ok: true, data: { kind: "clear" } };
  }

  if (mediaAssetId === "__keep_current__") {
    if (currentFilePath === null) {
      return { ok: false };
    }

    return {
      ok: true,
      data: { kind: "keep_current", filePath: currentFilePath },
    };
  }

  if (mediaAssetId.trim().length === 0) {
    return { ok: false };
  }

  return {
    ok: true,
    data: { kind: "media_asset", mediaAssetId },
  };
}
