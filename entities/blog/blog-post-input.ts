type RawInputValue = FormDataEntryValue | string | null | undefined;

type BlogPostCoverImageSelection =
  | {
      kind: "clear";
    }
  | {
      kind: "keep_current";
      filePath: string;
    }
  | {
      kind: "media_asset";
      mediaAssetId: string;
    };

export type BlogPostStatus = "draft" | "published";

export type ValidatedBlogPostInput = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: BlogPostStatus;
  coverImage: BlogPostCoverImageSelection;
};

export type BlogPostInputErrorCode =
  | "missing_title"
  | "missing_slug"
  | "invalid_slug"
  | "invalid_status"
  | "invalid_cover_image";

type BlogPostInputSource = {
  title: RawInputValue;
  slug: RawInputValue;
  excerpt: RawInputValue;
  content: RawInputValue;
  seoTitle: RawInputValue;
  seoDescription: RawInputValue;
  status: RawInputValue;
  currentCoverImagePath: RawInputValue;
  coverImageMediaAssetId: RawInputValue;
};

export type BlogPostInputValidationResult =
  | {
      ok: true;
      data: ValidatedBlogPostInput;
    }
  | {
      ok: false;
      code: BlogPostInputErrorCode;
    };

function readTrimmedString(value: RawInputValue): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

function normalizeOptionalText(value: RawInputValue): string | null {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || normalizedValue.length === 0) {
    return null;
  }

  return normalizedValue;
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

function validateCoverImageSelection(
  currentCoverImagePath: RawInputValue,
  coverImageMediaAssetId: RawInputValue
):
  | {
      ok: true;
      data: BlogPostCoverImageSelection;
    }
  | {
      ok: false;
      code: BlogPostInputErrorCode;
    } {
  const currentPath = normalizeOptionalText(currentCoverImagePath);
  const selection = readTrimmedString(coverImageMediaAssetId);

  if (selection === null || selection.length === 0) {
    return {
      ok: true,
      data: {
        kind: "clear"
      }
    };
  }

  if (selection === "__keep_current__") {
    if (currentPath === null) {
      return {
        ok: false,
        code: "invalid_cover_image"
      };
    }

    return {
      ok: true,
      data: {
        kind: "keep_current",
        filePath: currentPath
      }
    };
  }

  if (!/^[0-9]+$/.test(selection)) {
    return {
      ok: false,
      code: "invalid_cover_image"
    };
  }

  return {
    ok: true,
    data: {
      kind: "media_asset",
      mediaAssetId: selection
    }
  };
}

export function validateBlogPostInput(
  input: BlogPostInputSource
): BlogPostInputValidationResult {
  const title = readTrimmedString(input.title);

  if (title === null || title.length === 0) {
    return {
      ok: false,
      code: "missing_title"
    };
  }

  const rawSlug = readTrimmedString(input.slug);

  if (rawSlug === null || rawSlug.length === 0) {
    return {
      ok: false,
      code: "missing_slug"
    };
  }

  const normalizedSlug = normalizeBlogPostSlug(rawSlug);

  if (normalizedSlug.length === 0) {
    return {
      ok: false,
      code: "invalid_slug"
    };
  }

  const status = readTrimmedString(input.status);

  if (!isBlogPostStatus(status)) {
    return {
      ok: false,
      code: "invalid_status"
    };
  }

  const coverImageValidation = validateCoverImageSelection(
    input.currentCoverImagePath,
    input.coverImageMediaAssetId
  );

  if (!coverImageValidation.ok) {
    return coverImageValidation;
  }

  return {
    ok: true,
    data: {
      title,
      slug: normalizedSlug,
      excerpt: normalizeOptionalText(input.excerpt),
      content: normalizeOptionalText(input.content),
      seoTitle: normalizeOptionalText(input.seoTitle),
      seoDescription: normalizeOptionalText(input.seoDescription),
      status,
      coverImage: coverImageValidation.data
    }
  };
}
