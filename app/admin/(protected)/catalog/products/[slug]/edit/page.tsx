import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";
import {
  deleteProductAction,
  updateProductGeneralAction,
} from "@/features/admin/products/editor/actions";
import {
  listAdminProductTypeOptions,
  readAdminProductEditorBySlug,
} from "@/features/admin/products/editor/queries";
import {
  DeleteProductButton,
  ProductArchivedActions,
  ProductArchivedBanner,
} from "@/features/admin/products/components/editor/product-archived-actions";
import { ProductGeneralTab } from "@/features/admin/products/components/editor/product-general-tab";
import { ProductTranslationsForm } from "@/features/admin/products/components/editor/product-translations-form";
import { setProductTranslationsAction } from "@/features/admin/products/actions/set-product-translations.action";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-topbar-menus";
import { ProductSectionEyebrow } from "@/features/admin/products/components/shared/product-section-eyebrow";
import {
  getProductModulePageShellProps,
  PRODUCT_MODULE_PAGE_CONTENT_CLASSNAME,
} from "@/features/admin/products/components/shared/product-module-page-shell";
import {
  PRODUCT_CREATE_PAGE_COPY,
  PRODUCT_EDITOR_NAV_COPY,
  PRODUCT_EDITOR_PAGE_COPY,
} from "@/features/admin/products/config";
import { listProductTranslations } from "@/features/admin/products/queries/list-product-translations.query";
import {
  ADMIN_PRODUCTS_CREATE_PATH,
  buildAdminProductBreadcrumbs,
  ADMIN_PRODUCTS_LIST_PATH,
  ADMIN_PRODUCTS_TRASH_PATH,
} from "@/features/admin/products/navigation";

export const dynamic = "force-dynamic";

type ProductArchivedStateProps = {
  product: {
    id: string;
    slug: string;
    name: string;
  };
};

function ProductEditorNotFoundState() {
  return (
    <AdminPageShell
      title={PRODUCT_EDITOR_PAGE_COPY.notFoundMessage}
      navigation={{ label: PRODUCT_EDITOR_NAV_COPY.navLabel, href: ADMIN_PRODUCTS_LIST_PATH }}
      contentPreset="detail"
      contentClassName="lg:pb-6"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Catalogue", href: "/admin/catalog/overview" },
        { label: "Produits", href: ADMIN_PRODUCTS_LIST_PATH },
      ]}
      header={
        <AdminPageHeader
          className="hidden lg:block"
          compact
          hideDescriptionOnMobile
          eyebrow={PRODUCT_EDITOR_NAV_COPY.eyebrow}
          title={PRODUCT_EDITOR_PAGE_COPY.notFoundMessage}
          description="Ce produit n'existe plus ou son adresse a changé."
        />
      }
    >
      <div className="mx-auto max-w-4xl px-4 md:px-6 xl:px-0">
        <div className="grid gap-6 rounded-[1.85rem] border border-surface-border bg-card px-6 py-7 shadow-card md:px-8">
          <div className="grid gap-1.5">
            <ProductSectionEyebrow>Produit introuvable</ProductSectionEyebrow>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {PRODUCT_EDITOR_PAGE_COPY.notFoundMessage}
            </p>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {PRODUCT_EDITOR_PAGE_COPY.notFoundBack}
            </p>
          </div>

          <div>
            <Button variant="outline" size="sm" className="rounded-full px-5" asChild>
              <Link className="inline-flex items-center gap-2" href={ADMIN_PRODUCTS_LIST_PATH}>
                Retour à la liste des produits
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}

function ProductArchivedState({ product }: ProductArchivedStateProps) {
  return (
    <AdminPageShell
      title={product.name}
      navigation={{ label: PRODUCT_EDITOR_NAV_COPY.navLabel, href: ADMIN_PRODUCTS_LIST_PATH }}
      topbarAction={
        <ProductEditorTopbarMenu productId={product.id} productSlug={product.slug} isArchived />
      }
      scrollBehavior="page"
      contentPreset="detail"
      contentClassName="lg:pb-6"
      breadcrumbs={buildAdminProductBreadcrumbs(product.name)}
      header={
        <AdminPageHeader
          className="hidden lg:block"
          compact
          hideDescriptionOnMobile
          eyebrow={PRODUCT_EDITOR_NAV_COPY.eyebrow}
          title={product.name}
          description={PRODUCT_EDITOR_PAGE_COPY.archivedDescription}
          actions={
            <div className="hidden lg:flex lg:items-center lg:gap-2">
              <ProductArchivedActions productSlug={product.slug} />
            </div>
          }
        />
      }
    >
      <div className={PRODUCT_MODULE_PAGE_CONTENT_CLASSNAME}>
        <ProductArchivedBanner />

        <div className="mx-auto grid max-w-5xl gap-6 px-4 md:px-6 xl:grid-cols-[minmax(0,1fr)_19rem] xl:items-start xl:px-0">
          <section className="overflow-hidden rounded-[1.85rem] border border-surface-border bg-card px-6 py-7 shadow-card md:px-8">
            <div className="grid gap-1.5">
              <ProductSectionEyebrow>Produit archivé</ProductSectionEyebrow>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {PRODUCT_EDITOR_PAGE_COPY.archivedBodyTitle}
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {PRODUCT_EDITOR_PAGE_COPY.archivedBodySubtitle}
              </p>
            </div>

            <div className="mt-6">
              <Button asChild variant="outline" size="sm" className="rounded-full px-5">
                <Link href={ADMIN_PRODUCTS_TRASH_PATH}>
                  {PRODUCT_EDITOR_PAGE_COPY.archivedBackToTrash}
                </Link>
              </Button>
            </div>
          </section>

          <aside className="xl:sticky xl:top-6">
            <div className="overflow-hidden rounded-[1.5rem] border border-surface-border bg-surface-panel shadow-soft">
              <div className="grid gap-4 px-5 py-5">
                <ProductSectionEyebrow>Actions</ProductSectionEyebrow>
                <p className="text-sm leading-6 text-muted-foreground">
                  Restaurez le produit ou laissez-le dans la corbeille avant de reprendre son
                  édition.
                </p>
                <div className="lg:hidden">
                  <ProductArchivedActions productSlug={product.slug} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AdminPageShell>
  );
}

export default async function ProductDetailEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const editor = await readAdminProductEditorBySlug(slug);

  if (!editor) {
    return <ProductEditorNotFoundState />;
  }

  if (editor.product.isArchived) {
    return <ProductArchivedState product={editor.product} />;
  }

  const [productTypeOptions, multilingualEnabled] = await Promise.all([
    listAdminProductTypeOptions({ storeId: editor.product.storeId }),
    meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual"),
  ]);

  const translationsState = multilingualEnabled
    ? await listProductTranslations({ productId: editor.product.id })
    : null;

  return (
    <AdminPageShell
      {...getProductModulePageShellProps({
        product: editor.product,
        topbarAction: (
          <ProductEditorTopbarMenu
            productId={editor.product.id}
            productSlug={editor.product.slug}
            onDelete={deleteProductAction}
          />
        ),
        headerActions: (
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            <DeleteProductButton productId={editor.product.id} onDelete={deleteProductAction} />
            <Button asChild size="sm" className="lg:min-w-40">
              <Link href={ADMIN_PRODUCTS_CREATE_PATH}>
                {PRODUCT_CREATE_PAGE_COPY.newProductButton}
              </Link>
            </Button>
          </div>
        ),
      })}
      header={undefined}
    >
      <ProductGeneralTab
        action={updateProductGeneralAction}
        product={editor}
        productTypeOptions={productTypeOptions}
      />

      {translationsState !== null && translationsState.hasTargetLocale && (
        <div className="mx-auto w-full max-w-7xl px-4 pb-6 md:px-6 xl:px-0">
          <AdminFormSection
            eyebrow="Localisation"
            title={`Traductions (${translationsState.targetLocaleName})`}
          >
            <ProductTranslationsForm
              productId={editor.product.id}
              targetLocaleName={translationsState.targetLocaleName}
              fields={translationsState.fields}
              action={setProductTranslationsAction}
            />
          </AdminFormSection>
        </div>
      )}
    </AdminPageShell>
  );
}
