import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminSplitDetailPaneShell } from "@/components/admin/layout/admin-split-detail-pane-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/shared/feedback";
import { AdminCheckboxField } from "@/components/admin/forms/admin-checkbox-field";
import { AdminFormActions } from "@/components/admin/forms/admin-form-actions";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-section-card";
import {
  CATEGORY_CREATE_GENERAL_SECTION_COPY,
  CATEGORY_FIELD_COPY,
  CATEGORY_FORM_ACTIONS_COPY,
  CATEGORY_NEW_PAGE_COPY,
  getCategoryNewFormErrorMessage,
} from "@/features/admin/categories/config";
import {
  ADMIN_CATEGORIES_DETAIL_CONTENT_CLASS,
  ADMIN_CATEGORIES_DETAIL_CONSTRAIN_CONTENT,
  createCategoryAction,
} from "@/features/admin/categories";

export const dynamic = "force-dynamic";

type NewAdminCategoryPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
  }>;
}>;

export default async function NewAdminCategoryPage({ searchParams }: NewAdminCategoryPageProps) {
  const resolvedSearchParams = await searchParams;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const errorMessage = getCategoryNewFormErrorMessage(errorParam);

  async function handleCreateCategory(formData: FormData): Promise<void> {
    "use server";
    await createCategoryAction(formData);
  }

  return (
    <AdminSplitDetailPaneShell
      constrainContent={ADMIN_CATEGORIES_DETAIL_CONSTRAIN_CONTENT}
      contentClassName={ADMIN_CATEGORIES_DETAIL_CONTENT_CLASS}
    >
      <AdminPageHeader
        compact
        eyebrow={CATEGORY_NEW_PAGE_COPY.eyebrow}
        title={CATEGORY_NEW_PAGE_COPY.title}
        description={CATEGORY_NEW_PAGE_COPY.description}
      />

      <div className="space-y-4">
        {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

        <AdminSplitDetailSectionCard>
          <AdminSplitDetailSectionHeader
            eyebrow={CATEGORY_CREATE_GENERAL_SECTION_COPY.eyebrow}
            title={CATEGORY_CREATE_GENERAL_SECTION_COPY.title}
            description={CATEGORY_CREATE_GENERAL_SECTION_COPY.description}
          />
          <form action={handleCreateCategory} className="grid gap-5">
            <AdminFormField htmlFor="cat-name" label={CATEGORY_FIELD_COPY.nameLabel}>
              <Input id="cat-name" name="name" required type="text" />
            </AdminFormField>

            <AdminFormField
              htmlFor="cat-slug"
              label={CATEGORY_FIELD_COPY.slugLabel}
              hint={CATEGORY_FIELD_COPY.slugHint}
            >
              <Input id="cat-slug" name="slug" required type="text" />
            </AdminFormField>

            <AdminFormField htmlFor="cat-description" label={CATEGORY_FIELD_COPY.descriptionLabel}>
              <Textarea id="cat-description" name="description" rows={5} />
            </AdminFormField>

            <AdminCheckboxField
              label={CATEGORY_FIELD_COPY.featuredLabel}
              inputProps={{ name: "isFeatured", value: "on" }}
              className="border-0 bg-transparent px-0 py-0"
            />

            <input type="hidden" name="sortOrder" value="0" />
            <input type="hidden" name="parentId" value="" />
            <input type="hidden" name="primaryImageId" value="" />

            <AdminFormActions>
              <Button type="submit">{CATEGORY_FORM_ACTIONS_COPY.createCategoryLabel}</Button>
            </AdminFormActions>
          </form>
        </AdminSplitDetailSectionCard>
      </div>
    </AdminSplitDetailPaneShell>
  );
}
