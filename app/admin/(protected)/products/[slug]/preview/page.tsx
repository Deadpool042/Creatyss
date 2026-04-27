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

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { Notice } from "@/components/shared/notice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAdminProductPreviewBySlug,
  type AdminProductPreview,
} from "@/features/admin/products/preview";
import { ProductPageTemplate } from "@/features/storefront/catalog/product-page/components/product-page-template";
import { buildProductPageViewModel } from "@/features/storefront/catalog/product-page/composition/build-product-page-view-model";
import { type OfferVariant } from "@/features/storefront/catalog/types/product-offer-variant.types";

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

export default async function AdminProductPreviewPage({ params }: PreviewPageProps) {
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
      headerVisibility="desktop"
      headerDensity="compact"
      eyebrow="Aperçu produit"
      navigation={{
        label: "Retour à l'éditeur",
        href: `/admin/products/${product.slug}/edit`,
      }}
      breadcrumbs={[
        { label: "Accueil", href: "/admin" },
        { label: "Produits", href: "/admin/products" },
        {
          label: product.name,
          href: `/admin/products/${product.slug}/edit`,
        },
        { label: "Aperçu" },
      ]}
      scrollMode="area"
      viewportClassName="!h-full"
      contentClassName="px-3 pt-14 pb-0 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:pt-12 [@media(max-height:480px)]:pb-0 lg:px-6 lg:pb-4 lg:pt-0"
    >
      <ProductPageTemplate
        productName={product.name}
        marketingHook={product.marketingHook}
        shortDescription={product.shortDescription}
        description={product.description}
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
        heroAsideExtra={
          <div className="grid gap-1 border-t border-surface-border pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Référence de page
            </p>
            <p className="break-all font-mono text-sm text-muted-foreground">{product.slug}</p>
          </div>
        }
        offersSummaryContent={
          !viewModel.isSimpleProduct && viewModel.variantSummary ? (
            <div className="mb-6 flex flex-wrap gap-3">
              <Badge variant="secondary">
                {viewModel.variantSummary.total} déclinaison
                {viewModel.variantSummary.total > 1 ? "s" : ""}
              </Badge>
              <Badge variant="outline">
                <span className={product.isAvailable ? "text-emerald-700" : "text-destructive"}>
                  {viewModel.variantSummary.available} disponible
                  {viewModel.variantSummary.available > 1 ? "s" : ""}
                </span>
              </Badge>
            </div>
          ) : undefined
        }
        renderVariantCta={(_variant: OfferVariant) => (
          <div className="border-t border-surface-border pt-4">
            <Button disabled variant="outline">
              Ajouter au panier — disponible en boutique
            </Button>
          </div>
        )}
      />
    </AdminPageShell>
  );
}
