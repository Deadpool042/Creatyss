import "server-only";

import { db } from "@/core/db";
import {
  LES_MARCHES_PAGE_COPY_FIELDS,
  LES_MARCHES_PAGE_COPY_SUBJECT_ID,
  LES_MARCHES_PAGE_COPY_SUBJECT_TYPE,
  getLesMarchesPageCopyFrValue,
} from "@/entities/localization/les-marches-page-copy-fields";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type LesMarchesPageTranslationFieldState = {
  fieldName: string;
  label: string;
  group: string;
  multiline: boolean;
  sourceValue: string;
  translatedValue: string | null;
};

export type LesMarchesPageTranslationsTargetLocale = {
  id: string;
  code: string;
  name: string;
};

export type LesMarchesPageTranslationsState =
  | { hasTargetLocale: false }
  | {
      hasTargetLocale: true;
      targetLocale: LesMarchesPageTranslationsTargetLocale;
      fields: LesMarchesPageTranslationFieldState[];
    };

const NO_TARGET_LOCALE_STATE: LesMarchesPageTranslationsState = {
  hasTargetLocale: false,
};

export async function listLesMarchesPageTranslations(): Promise<LesMarchesPageTranslationsState> {
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
      subjectType: LES_MARCHES_PAGE_COPY_SUBJECT_TYPE,
      subjectId: LES_MARCHES_PAGE_COPY_SUBJECT_ID,
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

  const fields: LesMarchesPageTranslationFieldState[] =
    LES_MARCHES_PAGE_COPY_FIELDS.map((field) => ({
      fieldName: field.fieldName,
      label: field.label,
      group: field.group,
      multiline: field.multiline ?? false,
      sourceValue: getLesMarchesPageCopyFrValue(field.fieldName) ?? "",
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
