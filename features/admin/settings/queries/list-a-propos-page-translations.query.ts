import "server-only";

import { db } from "@/core/db";
import {
  A_PROPOS_PAGE_COPY_FIELDS,
  A_PROPOS_PAGE_COPY_SUBJECT_ID,
  A_PROPOS_PAGE_COPY_SUBJECT_TYPE,
  getAProposPageCopyFrValue,
} from "@/entities/localization/a-propos-page-copy-fields";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type AProposPageTranslationFieldState = {
  fieldName: string;
  label: string;
  group: string;
  multiline: boolean;
  sourceValue: string;
  translatedValue: string | null;
};

export type AProposPageTranslationsTargetLocale = {
  id: string;
  code: string;
  name: string;
};

export type AProposPageTranslationsState =
  | { hasTargetLocale: false }
  | {
      hasTargetLocale: true;
      targetLocale: AProposPageTranslationsTargetLocale;
      fields: AProposPageTranslationFieldState[];
    };

const NO_TARGET_LOCALE_STATE: AProposPageTranslationsState = {
  hasTargetLocale: false,
};

export async function listAProposPageTranslations(): Promise<AProposPageTranslationsState> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return NO_TARGET_LOCALE_STATE;
  }

  const targetLocale = await db.localizationLocale.findFirst({
    where: {
      storeId,
      archivedAt: null,
      status: "ACTIVE",
      isDefault: false,
    },
    orderBy: {
      code: "asc",
    },
    select: {
      id: true,
      code: true,
      name: true,
    },
  });

  if (targetLocale === null) {
    return NO_TARGET_LOCALE_STATE;
  }

  const existingValues = await db.localizedValue.findMany({
    where: {
      storeId,
      subjectType: A_PROPOS_PAGE_COPY_SUBJECT_TYPE,
      subjectId: A_PROPOS_PAGE_COPY_SUBJECT_ID,
      localeId: targetLocale.id,
      archivedAt: null,
    },
    select: {
      fieldName: true,
      valueText: true,
    },
  });

  const valuesByField = new Map(
    existingValues.map((value) => [value.fieldName, value.valueText])
  );

  const fields: AProposPageTranslationFieldState[] =
    A_PROPOS_PAGE_COPY_FIELDS.map((field) => ({
      fieldName: field.fieldName,
      label: field.label,
      group: field.group,
      multiline: field.multiline ?? false,
      sourceValue: getAProposPageCopyFrValue(field.fieldName) ?? "",
      translatedValue: valuesByField.get(field.fieldName) ?? null,
    }));

  return {
    hasTargetLocale: true,
    targetLocale: {
      id: targetLocale.id,
      code: targetLocale.code,
      name: targetLocale.name,
    },
    fields,
  };
}
