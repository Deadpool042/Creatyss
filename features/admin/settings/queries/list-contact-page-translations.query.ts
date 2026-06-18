import "server-only";

import { db } from "@/core/db";
import {
  CONTACT_PAGE_COPY_FIELDS,
  CONTACT_PAGE_COPY_SUBJECT_ID,
  CONTACT_PAGE_COPY_SUBJECT_TYPE,
  getContactPageCopyFrValue,
} from "@/entities/localization/contact-page-copy-fields";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type ContactPageTranslationFieldState = {
  fieldName: string;
  label: string;
  group: string;
  multiline: boolean;
  sourceValue: string;
  translatedValue: string | null;
};

export type ContactPageTranslationsTargetLocale = {
  id: string;
  code: string;
  name: string;
};

export type ContactPageTranslationsState =
  | { hasTargetLocale: false }
  | {
      hasTargetLocale: true;
      targetLocale: ContactPageTranslationsTargetLocale;
      fields: ContactPageTranslationFieldState[];
    };

const NO_TARGET_LOCALE_STATE: ContactPageTranslationsState = {
  hasTargetLocale: false,
};

export async function listContactPageTranslations(): Promise<ContactPageTranslationsState> {
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
      subjectType: CONTACT_PAGE_COPY_SUBJECT_TYPE,
      subjectId: CONTACT_PAGE_COPY_SUBJECT_ID,
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

  const fields: ContactPageTranslationFieldState[] =
    CONTACT_PAGE_COPY_FIELDS.map((field) => ({
      fieldName: field.fieldName,
      label: field.label,
      group: field.group,
      multiline: field.multiline ?? false,
      sourceValue: getContactPageCopyFrValue(field.fieldName) ?? "",
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
