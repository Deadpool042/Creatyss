import { z } from "zod";

function formText(min = 1) {
  return z.preprocess(
    v => (typeof v === "string" ? v.trim() : ""),
    z.string().min(min)
  );
}

function formOptionalText() {
  return z.preprocess(
    v => (typeof v === "string" && v.trim().length > 0 ? v.trim() : null),
    z.string().nullable()
  );
}

function formEnum<T extends string>(values: readonly [T, ...T[]]) {
  return z.preprocess(
    v => (typeof v === "string" ? v.trim() : ""),
    z.enum(values)
  );
}

export const BlogPostFormSchema = z.object({
  title: formText(),
  slug: formText(),
  excerpt: formOptionalText(),
  content: formOptionalText(),
  seoTitle: formOptionalText(),
  seoDescription: formOptionalText(),
  status: formEnum(["draft", "published"] as const),
  // Champs cover image : présents tels quels, résolution via parseCoverImageSelection
  coverImageMediaAssetId: formOptionalText(),
  currentCoverImagePath: formOptionalText()
});

export type BlogPostFormInput = z.infer<typeof BlogPostFormSchema>;

// --- Cover image resolution ---

export type CoverImageSelection =
  | { kind: "clear" }
  | { kind: "keep_current"; filePath: string }
  | { kind: "media_asset"; mediaAssetId: string };

/**
 * Résout les champs bruts du formulaire en une sélection d'image de couverture typée.
 * Remplace la logique de validateCoverImageSelection de entities/blog/blog-post-input.ts.
 *
 * Logique :
 * - null / vide → clear (pas d'image)
 * - "__keep_current__" + currentPath présent → keep_current
 * - "__keep_current__" + currentPath absent → invalide
 * - id numérique → media_asset
 * - autre valeur → invalide
 */
export function parseCoverImageSelection(
  coverImageMediaAssetId: string | null,
  currentCoverImagePath: string | null
): { ok: true; data: CoverImageSelection } | { ok: false } {
  if (coverImageMediaAssetId === null) {
    return { ok: true, data: { kind: "clear" } };
  }

  if (coverImageMediaAssetId === "__keep_current__") {
    if (currentCoverImagePath === null) {
      return { ok: false };
    }
    return {
      ok: true,
      data: { kind: "keep_current", filePath: currentCoverImagePath }
    };
  }

  if (!/^[0-9]+$/.test(coverImageMediaAssetId)) {
    return { ok: false };
  }

  return {
    ok: true,
    data: { kind: "media_asset", mediaAssetId: coverImageMediaAssetId }
  };
}
