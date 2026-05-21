import { notFound } from "next/navigation";
import { Notice } from "@/components/shared/feedback";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { getAdminCategoryDetail } from "@/features/admin/categories/queries";
import { listAdminMediaAssets } from "@/features/admin/media";
import {
  CategoryEditorPanel,
  updateCategoryAction,
} from "@/features/admin/categories";
import {
  CATEGORY_EDIT_PAGE_COPY,
  CATEGORY_NAVIGATION_COPY,
  getCategoryEditFormErrorMessage,
  getCategoryEditFormStatusMessage,
} from "@/features/admin/categories/config";
import {
  ADMIN_CATEGORIES_LIST_PATH,
} from "@/features/admin/categories/shared/admin-categories-routes";
import { FullWidthPageFrame } from "@/components/shared/layout/full-width-page-frame";
import { FullWidthStack } from "@/components/shared/layout/full-width-stack";

export const dynamic = "force-dynamic";

type EditAdminCategoryPageProps = Readonly<{
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    status?: string | string[];
    error?: string | string[];
    image_error?: string | string[];
    image_status?: string | string[];
  }>;
}>;

function readSingleSearchParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditAdminCategoryPage({
  params,
  searchParams,
}: EditAdminCategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const successMessage = getCategoryEditFormStatusMessage(
    readSingleSearchParam(resolvedSearchParams.status)
  );
  const errorMessage = getCategoryEditFormErrorMessage(
    readSingleSearchParam(resolvedSearchParams.error)
  );

  const [category, mediaAssets] = await Promise.all([
    getAdminCategoryDetail({ slug }),
    listAdminMediaAssets(),
  ]);

  if (category === null) {
    notFound();
  }

  async function handleUpdateCategory(formData: FormData): Promise<void> {
    "use server";
    await updateCategoryAction(formData);
  }
  return (
    <AdminPageShell
      headerVisibility="desktop"
      pageTitleNavigation={{ label: CATEGORY_NAVIGATION_COPY.backLabel, href: ADMIN_CATEGORIES_LIST_PATH }}
      description={CATEGORY_EDIT_PAGE_COPY.description}
      eyebrow={CATEGORY_EDIT_PAGE_COPY.eyebrow}
      title={CATEGORY_EDIT_PAGE_COPY.title}
      scrollMode="area"
    >
      <FullWidthPageFrame>
        <FullWidthStack>
          <div className="space-y-3">
            {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}
            {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}
          </div>

          <CategoryEditorPanel
            category={category}
            routeSlug={slug}
            mediaAssets={mediaAssets}
            updateAction={handleUpdateCategory}
          />
        </FullWidthStack>
      </FullWidthPageFrame>
    </AdminPageShell>
  );
}
