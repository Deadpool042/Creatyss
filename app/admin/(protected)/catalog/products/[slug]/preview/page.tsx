/**
 * Aperçu storefront admin — route volontaire, non publique.
 *
 * Affiche la fiche produit telle qu'elle apparaîtrait en vitrine publique,
 * sans tunnel d'achat (pas de panier, pas de formulaire addToCart).
 * Accessible uniquement depuis l'interface d'administration.
 *
 * Lot : PREV-2
 */
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { Notice } from "@/components/shared/feedback";
import { Button } from "@/components/ui/button";
import {
  ADMIN_PRODUCTS_LIST_PATH,
  buildAdminProductEditPath,
} from "@/features/admin/products/navigation";
import {
  getAdminProductPreviewBySlug,
  type AdminProductPreview,
} from "@/features/admin/products/preview";
import { ProductPageTemplate } from "@/features/storefront/catalog/product-page/components/product-page-template";
import { buildProductPageViewModel } from "@/features/storefront/catalog/product-page/composition/build-product-page-view-model";

export const dynamic = "force-dynamic";

type PreviewPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

function getStatusNoticeMessage(status: Exclude<AdminProductPreview["status"], "active">): string {
  switch (status) {
    case "draft":
      return "Ce produit est en brouillon — il n'est pas visible publiquement.";
    case "inactive":
      return "Ce produit est inactif — il n'est pas visible publiquement.";
    case "archived":
      return "Ce produit est archivé — il n'est pas visible publiquement.";
  }
}

export default async function ProductDetailPreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  const product = await getAdminProductPreviewBySlug(slug);

  if (product === null) {
    notFound();
  }

  const viewModel = buildProductPageViewModel({
    productType: product.productType,
    images: product.images.map((image) => ({
      src: image.src,
      alt: image.alt ?? null,
    })),
    variants: product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      isAvailable: variant.isAvailable,
      isDefault: variant.isDefault,
      sku: variant.sku,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      images: variant.images.map((image) => ({
        src: image.src,
        alt: image.alt ?? null,
      })),
      barcode: null,
      externalReference: null,
      weightGrams: null,
      widthMm: null,
      heightMm: null,
      depthMm: null,
      optionValues: [],
    })),
  });

  return (
    <AdminPageShell
      title={product.name}
      navigation={{
        label: "Retour à l'éditeur",
        href: buildAdminProductEditPath(product.slug),
      }}
      scrollMode="area"
      contentPreset="full-width"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Catalogue", href: "/admin/catalog/overview" },
        { label: "Produits", href: ADMIN_PRODUCTS_LIST_PATH },
        { label: product.name, href: buildAdminProductEditPath(product.slug) },
        { label: "Aperçu" },
      ]}
      header={
        <AdminPageHeader
          className="hidden lg:block"
          compact
          eyebrow="Aperçu produit"
          title={product.name}
        />
      }
      contentClassName="pb-0 lg:pb-4"
    >
      <ProductPageTemplate
        productName={product.name}
        marketingHook={product.marketingHook}
        shortDescription={product.shortDescription}
        description={product.description}
        careInstructions={product.careInstructions}
        shippingReturnsPolicy={product.shippingReturnsPolicy}
        productType={product.productType}
        isAvailable={product.isAvailable}
        images={viewModel.productImages}
        variants={viewModel.variantsNormalized}
        relatedProductGroups={product.relatedProductGroups}
        characteristics={product.characteristics}
        technicalSpecs={viewModel.technicalSpecs}
        statusBanner={
          product.status !== "active" ? (
            <Notice tone="note">{getStatusNoticeMessage(product.status)}</Notice>
          ) : undefined
        }
        heroCta={
          viewModel.isSimpleProduct &&
          viewModel.singleOffer != null &&
          viewModel.singleOffer.isAvailable ? (
            <Button disabled variant="outline">
              Ajouter au panier — disponible en boutique
            </Button>
          ) : undefined
        }
        disableCart={true}
        heroAsideExtra={
          <div className="grid gap-1 border-t border-surface-border pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Référence de page
            </p>
            <p className="break-all font-mono text-sm text-muted-foreground">{product.slug}</p>
          </div>
        }
      />
    </AdminPageShell>
  );
}
