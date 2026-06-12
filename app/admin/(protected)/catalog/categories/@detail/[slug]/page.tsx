import { AdminSplitDetailPaneShell } from "@/components/admin/layout/admin-split-detail-pane-shell";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { notFound } from "next/navigation";
import { Notice } from "@/components/shared/feedback";
import { listAdminMediaAssets } from "@/features/admin/media";
import {
  ADMIN_CATEGORIES_DETAIL_CONTENT_CLASS,
  ADMIN_CATEGORIES_DETAIL_CONSTRAIN_CONTENT,
  CategoryArchivedPanel,
  CategoryEditorPanel,
  getAdminCategoryDetail,
  listCategoriesForPicker,
  updateCategoryAction,
} from "@/features/admin/categories";
import {
  CATEGORY_EDIT_PAGE_COPY,
  getCategoryEditFormErrorMessage,
  getCategoryEditFormStatusMessage,
} from "@/features/admin/categories/config";
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

  const category = await getAdminCategoryDetail({ slug });

  if (category === null) {
    notFound();
  }

  if (category.status === "archived") {
    return (
      <AdminSplitDetailPaneShell
        constrainContent={ADMIN_CATEGORIES_DETAIL_CONSTRAIN_CONTENT}
        contentClassName={ADMIN_CATEGORIES_DETAIL_CONTENT_CLASS}
      >
        <AdminPageHeader
          compact
          eyebrow={CATEGORY_EDIT_PAGE_COPY.eyebrow}
          title={CATEGORY_EDIT_PAGE_COPY.title}
          description={CATEGORY_EDIT_PAGE_COPY.description}
        />

        <div className="space-y-3">
          {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}
          {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}
        </div>

        <CategoryArchivedPanel category={category} />
      </AdminSplitDetailPaneShell>
    );
  }

  const [mediaAssets, parentOptions] = await Promise.all([
    listAdminMediaAssets(),
    listCategoriesForPicker(),
  ]);

  async function handleUpdateCategory(formData: FormData): Promise<void> {
    "use server";
    await updateCategoryAction(formData);
  }
  return (
    <AdminSplitDetailPaneShell
      constrainContent={ADMIN_CATEGORIES_DETAIL_CONSTRAIN_CONTENT}
      contentClassName={ADMIN_CATEGORIES_DETAIL_CONTENT_CLASS}
    >
      <AdminPageHeader
        compact
        eyebrow={CATEGORY_EDIT_PAGE_COPY.eyebrow}
        title={CATEGORY_EDIT_PAGE_COPY.title}
        description={CATEGORY_EDIT_PAGE_COPY.description}
      />

      <div className="space-y-3">
        {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}
        {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}
      </div>

      <CategoryEditorPanel
        category={category}
        routeSlug={slug}
        mediaAssets={mediaAssets}
        parentOptions={parentOptions}
        updateAction={handleUpdateCategory}
      />
    </AdminSplitDetailPaneShell>
  );
}
