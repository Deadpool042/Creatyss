import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import {
  deleteProductAction,
  requestProductSeoSuggestionAction,
  updateProductSeoAction,
} from "@/features/admin/products/editor/actions";
import { readAdminProductEditorBySlug } from "@/features/admin/products/editor/queries";
import { ProductSeoTab } from "@/features/admin/products/components/editor/product-seo-tab";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-topbar-menus";
import { getProductModulePageShellProps } from "@/features/admin/products/components/shared/product-module-page-shell";
import { listSeoSuggestionHistory } from "@/features/ai-assistance/queries";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export const dynamic = "force-dynamic";

export default async function ProductDetailSeoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [editor, aiSuggestionEnabled, aiSuggestionHistoryEnabled, aiSuggestionAutomationEnabled] =
    await Promise.all([
      readAdminProductEditorBySlug(slug),
      meetsFeatureLevel("ai.core", "basic"),
      meetsFeatureLevel("ai.core", "advanced"),
      meetsFeatureLevel("ai.core", "automation"),
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
    </AdminPageShell>
  );
}
