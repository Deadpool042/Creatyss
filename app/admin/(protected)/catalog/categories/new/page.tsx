import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/shared/feedback";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import {
  AdminCheckboxField,
  AdminFormActions,
  AdminFormField,
  AdminFormSection,
} from "@/components/admin/forms";
import { FullWidthPageFrame } from "@/components/shared/layout/full-width-page-frame";
import { FullWidthStack } from "@/components/shared/layout/full-width-stack";
import { ADMIN_CATEGORIES_LIST_PATH, createCategoryAction } from "@/features/admin/categories";
import {
  CATEGORY_CREATE_GENERAL_SECTION_COPY,
  CATEGORY_FIELD_COPY,
  CATEGORY_FORM_ACTIONS_COPY,
  CATEGORY_NAVIGATION_COPY,
  CATEGORY_NEW_PAGE_COPY,
  getCategoryNewFormErrorMessage,
} from "@/features/admin/categories/config";

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
    <AdminPageShell
      pageTitleNavigation={{ label: CATEGORY_NAVIGATION_COPY.backLabel, href: ADMIN_CATEGORIES_LIST_PATH }}
      description={CATEGORY_NEW_PAGE_COPY.description}
      eyebrow={CATEGORY_NEW_PAGE_COPY.eyebrow}
      title={CATEGORY_NEW_PAGE_COPY.title}
      scrollMode="area"
      headerVisibility="desktop"
    >
      <FullWidthPageFrame>
        <FullWidthStack>
          {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

          <AdminFormSection
        eyebrow={CATEGORY_CREATE_GENERAL_SECTION_COPY.eyebrow}
        title={CATEGORY_CREATE_GENERAL_SECTION_COPY.title}
        description={CATEGORY_CREATE_GENERAL_SECTION_COPY.description}
        contentClassName="rounded-3xl border border-surface-border bg-card p-5 shadow-card sm:p-6"
      >
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
      </AdminFormSection>
        </FullWidthStack>
      </FullWidthPageFrame>
    </AdminPageShell>
  );
}
