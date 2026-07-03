"use client";

import {
  setAProposPageTranslationsAction,
  type AProposPageTranslationsFormState,
} from "@/features/admin/settings/actions/set-a-propos-page-translations.action";
import { ContentPageTranslationsForm } from "@/features/admin/settings/components/content-page-translations-form";
import type { AProposPageTranslationFieldState } from "@/features/admin/settings/queries/list-a-propos-page-translations.query";

type Props = {
  targetLocaleName: string;
  fields: readonly AProposPageTranslationFieldState[];
};

export function AProposPageTranslationsForm({ targetLocaleName, fields }: Props) {
  return (
    <ContentPageTranslationsForm
      action={setAProposPageTranslationsAction as (
        prevState: AProposPageTranslationsFormState,
        formData: FormData
      ) => Promise<AProposPageTranslationsFormState>}
      targetLocaleName={targetLocaleName}
      fields={fields}
    />
  );
}
