type RawInputValue = FormDataEntryValue | string | null | undefined;

type BlogPostImageSelection =
  | { kind: "clear" }
  | { kind: "keep_current"; filePath: string }
  | { kind: "media_asset"; mediaAssetId: string };

export type BlogPostStatus = "draft" | "published";

export type ValidatedBlogPostInput = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: BlogPostStatus;
  primaryImage: BlogPostImageSelection;
  coverImage: BlogPostImageSelection;
};

export type BlogPostInputErrorCode =
  | "missing_title"
  | "missing_slug"
  | "invalid_slug"
  | "invalid_status"
  | "invalid_primary_image"
  | "invalid_cover_image";

type BlogPostInputSource = {
  title: RawInputValue;
  slug: RawInputValue;
  excerpt: RawInputValue;
  content: RawInputValue;
  seoTitle: RawInputValue;
  seoDescription: RawInputValue;
  status: RawInputValue;
  currentPrimaryImagePath: RawInputValue;
  primaryImageMediaAssetId: RawInputValue;
  currentCoverImagePath: RawInputValue;
  coverImageMediaAssetId: RawInputValue;
};

export type BlogPostInputValidationResult =
  | { ok: true; data: ValidatedBlogPostInput }
  | { ok: false; code: BlogPostInputErrorCode };

function readTrimmedString(value: RawInputValue): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeOptionalText(value: RawInputValue): string | null {
  return readTrimmedString(value);
}

export function normalizeBlogPostSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isBlogPostStatus(value: string | null): value is BlogPostStatus {
  return value === "draft" || value === "published";
}

function validateImageSelection(params: {
  currentFilePath: RawInputValue;
  mediaAssetId: RawInputValue;
  invalidCode: BlogPostInputErrorCode;
}):
  | { ok: true; data: BlogPostImageSelection }
  | { ok: false; code: BlogPostInputErrorCode } {
  const currentFilePath = normalizeOptionalText(params.currentFilePath);
  const selection = readTrimmedString(params.mediaAssetId);

  if (selection === null) {
    return { ok: true, data: { kind: "clear" } };
  }

  if (selection === "__keep_current__") {
    if (currentFilePath === null) {
      return { ok: false, code: params.invalidCode };
    }

    return {
      ok: true,
      data: {
        kind: "keep_current",
        filePath: currentFilePath,
      },
    };
  }

  return {
    ok: true,
    data: {
      kind: "media_asset",
      mediaAssetId: selection,
    },
  };
}

export function validateBlogPostInput(
  input: BlogPostInputSource
): BlogPostInputValidationResult {
  const title = readTrimmedString(input.title);

  if (title === null) {
    return { ok: false, code: "missing_title" };
  }

  const rawSlug = readTrimmedString(input.slug);

  if (rawSlug === null) {
    return { ok: false, code: "missing_slug" };
  }

  const slug = normalizeBlogPostSlug(rawSlug);

  if (slug.length === 0) {
    return { ok: false, code: "invalid_slug" };
  }

  const status = readTrimmedString(input.status);

  if (!isBlogPostStatus(status)) {
    return { ok: false, code: "invalid_status" };
  }

  const primaryImage = validateImageSelection({
    currentFilePath: input.currentPrimaryImagePath,
    mediaAssetId: input.primaryImageMediaAssetId,
    invalidCode: "invalid_primary_image",
  });

  if (!primaryImage.ok) {
    return primaryImage;
  }

  const coverImage = validateImageSelection({
    currentFilePath: input.currentCoverImagePath,
    mediaAssetId: input.coverImageMediaAssetId,
    invalidCode: "invalid_cover_image",
  });

  if (!coverImage.ok) {
    return coverImage;
  }

  return {
    ok: true,
    data: {
      title,
      slug,
      excerpt: normalizeOptionalText(input.excerpt),
      content: normalizeOptionalText(input.content),
      seoTitle: normalizeOptionalText(input.seoTitle),
      seoDescription: normalizeOptionalText(input.seoDescription),
      status,
      primaryImage: primaryImage.data,
      coverImage: coverImage.data,
    },
  };
}
