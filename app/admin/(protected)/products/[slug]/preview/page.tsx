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
import { type OfferVariant } from "@/features/storefront/catalog/product-offers-section";
import { ProductPageTemplate } from "@/features/storefront/catalog/product-page-template";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PreviewPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AdminProductPreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  const product = await getAdminProductPreviewBySlug(slug);

  if (product === null) {
    notFound();
  }

  const primaryImage = product.images[0] ?? null;
  const isSimpleProduct = product.productType === "simple";
  const singleVariant =
    isSimpleProduct && product.variants.length === 1 ? product.variants[0] : null;
  const availableVariantCount = product.variants.filter((v) => v.isAvailable).length;

  const variantsNormalized: OfferVariant[] = product.variants.map((variant) => {
    const variantImage = variant.images[0] ?? null;
    return {
      id: variant.id,
      name: variant.name,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      isAvailable: variant.isAvailable,
      isDefault: variant.isDefault,
      sku: variant.sku,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      displayImage: variantImage
        ? { src: variantImage.src, alt: variantImage.alt ?? variant.name }
        : null,
    };
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
        primaryImage={primaryImage}
        variants={variantsNormalized}
        // AdminProductPreviewRelatedProductGroup est structurellement identique à
        // ProductPageRelatedGroup — TypeScript les accepte par compatibilité de forme.
        // imageFilePath contient un storageKey brut (non résolu dans la query admin) ;
        // l'URL est résolue dans le template via getUploadsPublicPath().
        relatedProductGroups={product.relatedProductGroups}
        characteristics={product.characteristics}
        statusBanner={
          product.status !== "active" ? (
            <Notice tone="note">{getStatusNoticeMessage(product.status)}</Notice>
          ) : undefined
        }
        heroCta={
          isSimpleProduct && singleVariant != null && singleVariant.isAvailable ? (
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
          !isSimpleProduct ? (
            <div className="mb-6 flex flex-wrap gap-3">
              <Badge variant="secondary">
                {product.variants.length} déclinaison{product.variants.length > 1 ? "s" : ""}
              </Badge>
              <Badge variant="outline">
                <span className={product.isAvailable ? "text-emerald-700" : "text-destructive"}>
                  {availableVariantCount} disponible{availableVariantCount > 1 ? "s" : ""}
                </span>
              </Badge>
            </div>
          ) : undefined
        }
        renderVariantCta={(_variant) => (
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
