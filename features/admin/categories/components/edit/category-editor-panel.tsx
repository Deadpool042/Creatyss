import Link from "next/link";

import { AdminCheckboxField } from "@/components/admin/forms/admin-checkbox-field";
import { AdminFormActions } from "@/components/admin/forms/admin-form-actions";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdminMediaListItem } from "@/features/admin/media";
import {
  CATEGORY_ARCHIVE_SECTION_COPY,
  CATEGORY_FIELD_COPY,
  CATEGORY_FORM_ACTIONS_COPY,
  CATEGORY_GENERAL_SECTION_COPY,
  CATEGORY_IMAGE_SECTION_COPY,
  CATEGORY_MEDIA_EMPTY_STATE_COPY,
  CATEGORY_SEO_SECTION_COPY,
} from "../../config";
import type { AdminCategoryDetail } from "../../types";
import { CategoryArchiveButton } from "./category-archive-button";
import { CategoryImageForm } from "./category-image-form";
import { CategorySeoForm } from "./category-seo-form";

type CategoryEditorPanelProps = {
  category: AdminCategoryDetail;
  routeSlug: string;
  mediaAssets: AdminMediaListItem[];
  updateAction: (formData: FormData) => Promise<void>;
};

export function CategoryEditorPanel({
  category,
  routeSlug,
  mediaAssets,
  updateAction,
}: CategoryEditorPanelProps) {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(19rem,0.92fr)] xl:items-start">
      <div className="space-y-10">
        <AdminFormSection
          eyebrow={CATEGORY_GENERAL_SECTION_COPY.eyebrow}
          title={CATEGORY_GENERAL_SECTION_COPY.title}
          description={CATEGORY_GENERAL_SECTION_COPY.description}
          contentClassName="space-y-4"
        >
          <form action={updateAction} className="grid gap-5">
            <input name="categoryId" type="hidden" value={category.id} />
            <input name="routeSlug" type="hidden" value={routeSlug} />
            <input name="sortOrder" type="hidden" value={String(category.sortOrder)} />
            <input name="parentId" type="hidden" value={category.parentId ?? ""} />
            <input name="primaryImageId" type="hidden" value={category.primaryImageId ?? ""} />

            <AdminFormField htmlFor="cat-name" label={CATEGORY_FIELD_COPY.nameLabel}>
              <Input defaultValue={category.name} id="cat-name" name="name" required type="text" />
            </AdminFormField>

            <AdminFormField
              htmlFor="cat-slug"
              label={CATEGORY_FIELD_COPY.slugLabel}
              hint={CATEGORY_FIELD_COPY.slugHint}
            >
              <Input defaultValue={category.slug} id="cat-slug" name="slug" required type="text" />
            </AdminFormField>

            <AdminFormField htmlFor="cat-description" label={CATEGORY_FIELD_COPY.descriptionLabel}>
              <Textarea
                defaultValue={category.description ?? ""}
                id="cat-description"
                name="description"
                rows={5}
              />
            </AdminFormField>

            <AdminCheckboxField
              label={CATEGORY_FIELD_COPY.featuredLabel}
              inputProps={{
                defaultChecked: category.isFeatured,
                name: "isFeatured",
                value: "on",
              }}
            />

            <AdminFormActions>
              <Button type="submit">{CATEGORY_FORM_ACTIONS_COPY.saveCategoryInfoLabel}</Button>
            </AdminFormActions>
          </form>
        </AdminFormSection>

        <div className="h-px bg-surface-border/55" />

        <AdminFormSection
          eyebrow={CATEGORY_SEO_SECTION_COPY.eyebrow}
          title={CATEGORY_SEO_SECTION_COPY.title}
          description={CATEGORY_SEO_SECTION_COPY.description}
          contentClassName="space-y-4"
        >
          <CategorySeoForm categoryId={category.id} categoryName={category.name} seo={category.seo} />
        </AdminFormSection>
      </div>

      <div className="space-y-6 xl:sticky xl:top-10 2xl:top-12">
        <AdminFormSection
          eyebrow={CATEGORY_IMAGE_SECTION_COPY.eyebrow}
          title={CATEGORY_IMAGE_SECTION_COPY.title}
          description={CATEGORY_IMAGE_SECTION_COPY.description}
          contentClassName="space-y-4"
        >
          {mediaAssets.length > 0 ? (
            <CategoryImageForm
              categoryId={category.id}
              categoryName={category.name}
              primaryImageId={category.primaryImageId}
              primaryImageUrl={category.primaryImageUrl}
              mediaAssets={mediaAssets}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {CATEGORY_MEDIA_EMPTY_STATE_COPY.body}{" "}
              <Link
                className="underline underline-offset-4 hover:text-foreground"
                href={CATEGORY_MEDIA_EMPTY_STATE_COPY.linkHref}
              >
                {CATEGORY_MEDIA_EMPTY_STATE_COPY.linkLabel}
              </Link>
            </p>
          )}
        </AdminFormSection>

        <AdminFormSection
          eyebrow={CATEGORY_ARCHIVE_SECTION_COPY.eyebrow}
          title={CATEGORY_ARCHIVE_SECTION_COPY.title}
          description={CATEGORY_ARCHIVE_SECTION_COPY.description}
          contentClassName="space-y-3"
        >
          <CategoryArchiveButton categoryId={category.id} categoryName={category.name} />
        </AdminFormSection>
      </div>
    </div>
  );
}
