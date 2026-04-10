type RawInputValue = FormDataEntryValue | string | null | undefined;

export type ProductMediaReferenceSubjectType = "product" | "product_variant";

export type ProductMediaReferenceRole = "gallery" | "thumbnail" | "other";

export type ValidatedAdminProductMediaReferenceInput = {
  mediaAssetId: string;
  subjectType: ProductMediaReferenceSubjectType;
  subjectId: string;
  role: ProductMediaReferenceRole;
  sortOrder: number;
  isPrimary: boolean;
};

export type AdminProductMediaReferenceInputErrorCode =
  | "missing_media_asset"
  | "invalid_subject_type"
  | "missing_subject_id"
  | "invalid_role"
  | "invalid_sort_order";

type AdminProductMediaReferenceInputSource = {
  mediaAssetId: RawInputValue;
  subjectType: RawInputValue;
  subjectId: RawInputValue;
  role: RawInputValue;
  sortOrder: RawInputValue;
  isPrimary: RawInputValue;
};

export type AdminProductMediaReferenceInputValidationResult =
  | { ok: true; data: ValidatedAdminProductMediaReferenceInput }
  | { ok: false; code: AdminProductMediaReferenceInputErrorCode };

function readTrimmedString(value: RawInputValue): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function parseNonNegativeInteger(value: RawInputValue): number | null {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null) {
    return null;
  }

  if (!/^\d+$/.test(normalizedValue)) {
    return null;
  }

  return Number(normalizedValue);
}

function normalizeBoolean(value: RawInputValue): boolean {
  return value === "on" || value === "true" || value === "1";
}

function isSubjectType(value: string | null): value is ProductMediaReferenceSubjectType {
  return value === "product" || value === "product_variant";
}

function isRole(value: string | null): value is ProductMediaReferenceRole {
  return value === "gallery" || value === "thumbnail" || value === "other";
}

export function validateAdminProductMediaReferenceInput(
  input: AdminProductMediaReferenceInputSource
): AdminProductMediaReferenceInputValidationResult {
  const mediaAssetId = readTrimmedString(input.mediaAssetId);

  if (mediaAssetId === null) {
    return { ok: false, code: "missing_media_asset" };
  }

  const subjectType = readTrimmedString(input.subjectType);

  if (!isSubjectType(subjectType)) {
    return { ok: false, code: "invalid_subject_type" };
  }

  const subjectId = readTrimmedString(input.subjectId);

  if (subjectId === null) {
    return { ok: false, code: "missing_subject_id" };
  }

  const role = readTrimmedString(input.role);

  if (!isRole(role)) {
    return { ok: false, code: "invalid_role" };
  }

  const sortOrder = parseNonNegativeInteger(input.sortOrder);

  if (sortOrder === null) {
    return { ok: false, code: "invalid_sort_order" };
  }

  return {
    ok: true,
    data: {
      mediaAssetId,
      subjectType,
      subjectId,
      role,
      sortOrder,
      isPrimary: normalizeBoolean(input.isPrimary),
    },
  };
}
