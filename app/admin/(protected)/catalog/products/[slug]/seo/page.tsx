import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import {
  deleteProductAction,
  requestProductSeoSuggestionAction,
  updateProductSeoAction,
} from "@/features/admin/products/editor/actions";
import { readAdminProductEditorBySlug } from "@/features/admin/products/editor/queries";
import { ProductSeoTab } from "@/features/admin/products/components/editor/product-seo-tab";
import { ProductTranslationsForm } from "@/features/admin/products/components/editor/product-translations-form";
import { setProductSeoTranslationsAction } from "@/features/admin/products/actions/set-product-seo-translations.action";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-topbar-menus";
import { getProductModulePageShellProps } from "@/features/admin/products/components/shared/product-module-page-shell";
import { listSeoSuggestionHistory } from "@/features/ai-assistance/queries";
import { listProductSeoTranslations } from "@/features/admin/products/queries/list-product-seo-translations.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";

export const dynamic = "force-dynamic";

export default async function ProductDetailSeoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [
    editor,
    aiSuggestionEnabled,
    aiSuggestionHistoryEnabled,
    aiSuggestionAutomationEnabled,
    multilingualEnabled,
  ] = await Promise.all([
    readAdminProductEditorBySlug(slug),
    meetsFeatureLevel("ai.core", "basic"),
    meetsFeatureLevel("ai.core", "advanced"),
    meetsFeatureLevel("ai.core", "automation"),
    meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual"),
  ]);

  if (editor === null) {
    notFound();
  }

  const aiSuggestionHistory = aiSuggestionHistoryEnabled
    ? await listSeoSuggestionHistory({
        subjectType: "PRODUCT",
        subjectId: editor.product.id,
      })
    : [];

  const seoTranslationsState = multilingualEnabled
    ? await listProductSeoTranslations({ productId: editor.product.id })
    : null;

  return (
    <AdminPageShell
      {...getProductModulePageShellProps({
        product: editor.product,
        topbarAction: (
          <ProductEditorTopbarMenu
            productId={editor.product.id}
            productSlug={editor.product.slug}
            isArchived={editor.product.isArchived}
            onDelete={deleteProductAction}
          />
        ),
      })}
    >
      <ProductSeoTab
        action={updateProductSeoAction}
        aiSuggestionAction={requestProductSeoSuggestionAction}
        aiSuggestionEnabled={aiSuggestionEnabled}
        aiSuggestionAutomationEnabled={aiSuggestionAutomationEnabled}
        aiSuggestionHistory={aiSuggestionHistory}
        aiSuggestionHistoryEnabled={aiSuggestionHistoryEnabled}
        product={editor}
      />

      {seoTranslationsState !== null && seoTranslationsState.hasTargetLocale && (
        <div className="mx-auto w-full max-w-7xl px-4 pb-6 md:px-6 xl:px-0">
          <AdminFormSection
            eyebrow="Localisation"
            title={`Traductions SEO (${seoTranslationsState.targetLocaleName})`}
          >
            <ProductTranslationsForm
              productId={editor.product.id}
              targetLocaleName={seoTranslationsState.targetLocaleName}
              fields={seoTranslationsState.fields}
              action={setProductSeoTranslationsAction}
            />
          </AdminFormSection>
        </div>
      )}
    </AdminPageShell>
  );
}
