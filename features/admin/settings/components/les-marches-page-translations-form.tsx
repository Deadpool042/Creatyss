"use client";

import {
  setLesMarchesPageTranslationsAction,
  type LesMarchesPageTranslationsFormState,
} from "@/features/admin/settings/actions/set-les-marches-page-translations.action";
import { ContentPageTranslationsForm } from "@/features/admin/settings/components/content-page-translations-form";
import type { LesMarchesPageTranslationFieldState } from "@/features/admin/settings/queries/list-les-marches-page-translations.query";

type Props = {
  targetLocaleName: string;
  fields: readonly LesMarchesPageTranslationFieldState[];
};

export function LesMarchesPageTranslationsForm({ targetLocaleName, fields }: Props) {
  return (
    <ContentPageTranslationsForm
      action={setLesMarchesPageTranslationsAction as (
        prevState: LesMarchesPageTranslationsFormState,
        formData: FormData
      ) => Promise<LesMarchesPageTranslationsFormState>}
      targetLocaleName={targetLocaleName}
      fields={fields}
    />
  );
}
