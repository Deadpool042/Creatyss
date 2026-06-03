import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { notFound } from "next/navigation";
import { Notice } from "@/components/shared/feedback";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { listAdminMediaAssets } from "@/features/admin/media";
import {
  ADMIN_CATEGORIES_LIST_PATH,
  CategoryEditorPanel,
  getAdminCategoryDetail,
  updateCategoryAction,
} from "@/features/admin/categories";
import {
  CATEGORY_EDIT_PAGE_COPY,
  CATEGORY_NAVIGATION_COPY,
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
      title={CATEGORY_EDIT_PAGE_COPY.title}
      navigation={{ label: CATEGORY_NAVIGATION_COPY.backLabel, href: ADMIN_CATEGORIES_LIST_PATH }}
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Catalogue", href: "/admin/catalog" },
        { label: "Catégories", href: ADMIN_CATEGORIES_LIST_PATH },
        { label: "Édition" },
      ]}
      contentPreset="full-width"
      scrollMode="area"
      contentClassName="space-y-4 md:space-y-6"
      header={
        <AdminPageHeader
          className="hidden px-4 pt-1 md:px-5 lg:block lg:px-6"
          compact
          eyebrow={CATEGORY_EDIT_PAGE_COPY.eyebrow}
          title={CATEGORY_EDIT_PAGE_COPY.title}
          description={CATEGORY_EDIT_PAGE_COPY.description}
        />
      }
    >
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
    </AdminPageShell>
  );
}
