"use client";

import { useActionState, type JSX } from "react";

import {
  AdminCheckboxField,
  AdminFormActions,
  AdminFormField,
  AdminFormMessage,
  AdminSelectField,
} from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateCategorySeoAction } from "@/features/admin/categories/actions";
import { CATEGORY_SEO_FORM_COPY } from "@/features/admin/categories/config";

type CategorySeoData = {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalPath: string | null;
  indexingMode: "INDEX_FOLLOW" | "INDEX_NOFOLLOW" | "NOINDEX_FOLLOW" | "NOINDEX_NOFOLLOW";
  sitemapIncluded: boolean;
  openGraphTitle: string | null;
  openGraphDescription: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
};

type CategorySeoFormProps = Readonly<{
  categoryId: string;
  categoryName: string;
  seo: CategorySeoData;
}>;

const initialState = {
  status: "idle" as const,
  message: "",
};

export function CategorySeoForm({
  categoryId,
  categoryName,
  seo,
}: CategorySeoFormProps): JSX.Element {
  const [state, formAction, pending] = useActionState(updateCategorySeoAction, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <input name="categoryId" type="hidden" value={categoryId} />

      <AdminFormMessage
        tone={state.status === "error" ? "error" : "success"}
        message={state.status === "idle" ? null : state.message}
      />

      <AdminFormField htmlFor="cat-seo-title" label={CATEGORY_SEO_FORM_COPY.titleLabel}>
        <Input
          defaultValue={seo.metaTitle ?? ""}
          id="cat-seo-title"
          maxLength={255}
          name="title"
          placeholder={categoryName}
          type="text"
        />
      </AdminFormField>

      <AdminFormField htmlFor="cat-seo-description" label={CATEGORY_SEO_FORM_COPY.descriptionLabel}>
        <Textarea
          defaultValue={seo.metaDescription ?? ""}
          id="cat-seo-description"
          maxLength={320}
          name="description"
          placeholder={CATEGORY_SEO_FORM_COPY.descriptionPlaceholder(categoryName)}
          rows={3}
        />
      </AdminFormField>

      <AdminFormField htmlFor="cat-seo-canonical" label={CATEGORY_SEO_FORM_COPY.canonicalPathLabel}>
        <Input
          defaultValue={seo.canonicalPath ?? ""}
          id="cat-seo-canonical"
          name="canonicalPath"
          placeholder={CATEGORY_SEO_FORM_COPY.canonicalPathPlaceholder}
          type="text"
        />
      </AdminFormField>

      <AdminFormField
        htmlFor="cat-seo-indexing"
        label={CATEGORY_SEO_FORM_COPY.indexingModeLabel}
      >
        <AdminSelectField
          defaultValue={seo.indexingMode}
          id="cat-seo-indexing"
          name="indexingMode"
        >
          <option value="INDEX_FOLLOW">{CATEGORY_SEO_FORM_COPY.indexingModeOptions.indexFollow}</option>
          <option value="INDEX_NOFOLLOW">{CATEGORY_SEO_FORM_COPY.indexingModeOptions.indexNoFollow}</option>
          <option value="NOINDEX_FOLLOW">{CATEGORY_SEO_FORM_COPY.indexingModeOptions.noIndexFollow}</option>
          <option value="NOINDEX_NOFOLLOW">{CATEGORY_SEO_FORM_COPY.indexingModeOptions.noIndexNoFollow}</option>
        </AdminSelectField>
      </AdminFormField>

      <input name="sitemapIncluded" type="hidden" value="false" />
      <AdminCheckboxField
        label={CATEGORY_SEO_FORM_COPY.sitemapIncludedLabel}
        inputProps={{
          defaultChecked: seo.sitemapIncluded,
          name: "sitemapIncluded",
          value: "true",
        }}
      />

      <AdminFormField htmlFor="cat-og-title" label={CATEGORY_SEO_FORM_COPY.openGraphTitleLabel}>
        <Input
          defaultValue={seo.openGraphTitle ?? ""}
          id="cat-og-title"
          maxLength={255}
          name="openGraphTitle"
          type="text"
        />
      </AdminFormField>

      <AdminFormField
        htmlFor="cat-og-description"
        label={CATEGORY_SEO_FORM_COPY.openGraphDescriptionLabel}
      >
        <Textarea
          defaultValue={seo.openGraphDescription ?? ""}
          id="cat-og-description"
          maxLength={320}
          name="openGraphDescription"
          rows={2}
        />
      </AdminFormField>

      <AdminFormField htmlFor="cat-tw-title" label={CATEGORY_SEO_FORM_COPY.twitterTitleLabel}>
        <Input
          defaultValue={seo.twitterTitle ?? ""}
          id="cat-tw-title"
          maxLength={255}
          name="twitterTitle"
          type="text"
        />
      </AdminFormField>

      <AdminFormField
        htmlFor="cat-tw-description"
        label={CATEGORY_SEO_FORM_COPY.twitterDescriptionLabel}
      >
        <Textarea
          defaultValue={seo.twitterDescription ?? ""}
          id="cat-tw-description"
          maxLength={320}
          name="twitterDescription"
          rows={2}
        />
      </AdminFormField>

      <AdminFormActions>
        <Button type="submit" disabled={pending}>
          {pending ? CATEGORY_SEO_FORM_COPY.submitPendingLabel : CATEGORY_SEO_FORM_COPY.submitLabel}
        </Button>
      </AdminFormActions>
    </form>
  );
}
