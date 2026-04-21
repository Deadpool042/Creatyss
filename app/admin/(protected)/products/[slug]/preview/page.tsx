/**
 * Aperçu storefront admin — route volontaire, non publique.
 *
 * Affiche la fiche produit telle qu'elle apparaîtrait en vitrine publique,
 * sans tunnel d'achat (pas de panier, pas de formulaire addToCart).
 * Accessible uniquement depuis l'interface d'administration.
 *
 * Lot : PREV-2
 */
import Image from "next/image";
import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { Notice } from "@/components/shared/notice";
import { Badge } from "@/components/ui/badge";
import { getUploadsPublicPath } from "@/core/uploads";
import {
  getProductAvailabilityLabel,
  getVariantAvailabilityLabel,
  getVariantDefaultBadgeLabel,
} from "@/entities/product/product-public-presentation";
import {
  getAdminProductPreviewBySlug,
  type AdminProductPreview,
} from "@/features/admin/products/preview";
import { ProductRelatedSection } from "@/features/storefront/catalog/product-related-section";

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

  // Needed for ProductRelatedSection — imageFilePath is still a raw storageKey
  // in AdminProductPreviewRelatedProduct (not a resolved URL).
  const uploadsPublicPath = getUploadsPublicPath();

  const primaryImage = product.images[0] ?? null;
  const isSimpleProduct = product.productType === "simple";
  const singleVariant =
    isSimpleProduct && product.variants.length === 1 ? product.variants[0] : null;
  // For variable products, show the default (first ordered) variant price in the hero
  const heroVariant = singleVariant ?? product.variants[0] ?? null;

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
      <div className="mx-auto grid max-w-6xl gap-10 pb-6">
        {/* ------------------------------------------------------------------ */}
        {/* Bandeau statut admin                                                 */}
        {/* ------------------------------------------------------------------ */}
        {product.status !== "active" ? (
          <Notice tone="note">{getStatusNoticeMessage(product.status)}</Notice>
        ) : null}

        {/* ------------------------------------------------------------------ */}
        {/* Fiche principale — hero storefront                                  */}
        {/* ------------------------------------------------------------------ */}
        <section className="w-full overflow-hidden rounded-xl border border-shell-border bg-shell-surface shadow-soft">
          <div className="grid min-[900px]:grid-cols-[minmax(0,1fr)_minmax(22rem,0.85fr)]">
            {/* Image principale — padded pour objet-contain propre */}
            <div className="border-b border-surface-border bg-media-surface min-[900px]:border-b-0 min-[900px]:border-r">
              {primaryImage ? (
                <div className="aspect-square w-full p-6">
                  <div className="relative h-full w-full">
                    <Image
                      alt={primaryImage.altText ?? product.name}
                      className="object-contain"
                      fill
                      loading="lazy"
                      sizes="(min-width: 900px) 50vw, 100vw"
                      src={primaryImage.url}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid aspect-square place-items-center text-center text-sm text-media-foreground">
                  Aucune image.
                </div>
              )}
            </div>

            {/* Infos produit — nom, prix, meta */}
            <aside className="grid content-start gap-6 p-8 min-[700px]:p-10">
              {/* Nom + description courte */}
              <div className="grid gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{isSimpleProduct ? "Simple" : "Variable"}</Badge>
                </div>
                <h1 className="m-0 text-2xl font-bold leading-snug">{product.name}</h1>
                {product.shortDescription ? (
                  <div
                    className="prose prose-sm max-w-none leading-relaxed text-muted-foreground dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                  />
                ) : null}
              </div>

              {/* Prix — produit simple : prix exact ; variable : prix du premier variant */}
              {heroVariant ? (
                <div className="grid gap-1 border-b border-surface-border pb-6">
                  {!isSimpleProduct ? (
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Dès
                    </p>
                  ) : null}
                  <p className="text-3xl font-bold leading-tight tracking-tight">
                    {heroVariant.price || "—"}
                  </p>
                  {heroVariant.compareAtPrice ? (
                    <p className="text-sm text-muted-foreground line-through">
                      {heroVariant.compareAtPrice}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {/* Meta */}
              <div className="grid gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Disponibilité
                  </p>
                  <Badge variant="outline">
                    <span className={product.isAvailable ? "text-emerald-700" : "text-destructive"}>
                      {getProductAvailabilityLabel(product.isAvailable)}
                    </span>
                  </Badge>
                </div>

                {singleVariant?.sku ? (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      SKU
                    </p>
                    <p className="text-sm">{singleVariant.sku}</p>
                  </div>
                ) : null}

                <div className="grid gap-1 border-t border-surface-border pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Référence de page
                  </p>
                  <p className="break-all font-mono text-sm text-muted-foreground">
                    {product.slug}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Description — section dédiée, pleine largeur                        */}
        {/* ------------------------------------------------------------------ */}
        {product.description ? (
          <section className="w-full rounded-xl border border-shell-border bg-shell-surface p-8 shadow-soft min-[700px]:p-10">
            <div className="mb-6 grid gap-2">
              <p className="text-sm font-bold uppercase tracking-widest text-brand">Description</p>
              <h2 className="m-0">À propos de ce produit</h2>
            </div>
            <div
              className="prose prose-sm dark:prose-invert max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </section>
        ) : null}

        {/* ------------------------------------------------------------------ */}
        {/* Offre / déclinaisons — sans tunnel d'achat                          */}
        {/* ------------------------------------------------------------------ */}
        <section className="w-full rounded-xl border border-shell-border bg-shell-surface p-8 shadow-soft min-[700px]:p-10">
          <div className="mb-8 grid gap-2">
            <p className="text-sm font-bold uppercase tracking-widest text-brand">
              {isSimpleProduct ? "Informations de vente" : "Déclinaisons"}
            </p>
            <h2 className="m-0">
              {isSimpleProduct ? "Informations de vente" : "Déclinaisons du produit"}
            </h2>
          </div>

          {isSimpleProduct ? (
            singleVariant ? (
              <article className="grid gap-5 rounded-lg border border-surface-border bg-surface-panel-soft p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3>{singleVariant.name}</h3>
                  <Badge variant="outline">
                    <span
                      className={
                        singleVariant.isAvailable ? "text-emerald-700" : "text-destructive"
                      }
                    >
                      {getVariantAvailabilityLabel(singleVariant.isAvailable)}
                    </span>
                  </Badge>
                </div>

                {singleVariant.sku ? (
                  <div className="grid gap-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      SKU
                    </p>
                    <p className="font-mono leading-relaxed">{singleVariant.sku}</p>
                  </div>
                ) : null}

                {singleVariant.images[0] ? (
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-media-surface p-4">
                    <div className="relative h-full w-full">
                      <Image
                        alt={singleVariant.images[0].altText ?? singleVariant.name}
                        className="object-contain"
                        fill
                        loading="lazy"
                        src={singleVariant.images[0].url}
                      />
                    </div>
                  </div>
                ) : null}
              </article>
            ) : (
              <div className="rounded-lg border border-surface-border bg-surface-panel-soft p-6">
                <p className="leading-relaxed text-muted-foreground">
                  Aucune offre disponible pour ce produit simple.
                </p>
              </div>
            )
          ) : product.variants.length > 0 ? (
            <>
              {/* Résumé de disponibilité */}
              <div className="mb-6 flex flex-wrap gap-3">
                <Badge variant="secondary">
                  {product.variants.length} déclinaison{product.variants.length > 1 ? "s" : ""}
                </Badge>
                <Badge variant="outline">
                  <span className={product.isAvailable ? "text-emerald-700" : "text-destructive"}>
                    {product.variants.filter((v) => v.isAvailable).length} disponible
                    {product.variants.filter((v) => v.isAvailable).length > 1 ? "s" : ""}
                  </span>
                </Badge>
              </div>

              <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
                {product.variants.map((variant) => {
                  const variantImage = variant.images[0] ?? null;
                  const defaultBadgeLabel = getVariantDefaultBadgeLabel(variant.isDefault);

                  return (
                    <article
                      className="grid gap-5 rounded-lg border border-surface-border bg-surface-panel-soft p-6"
                      key={variant.id}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="text-base font-semibold">{variant.name}</h3>
                        <div className="flex flex-wrap items-center gap-2">
                          {defaultBadgeLabel ? (
                            <Badge variant="secondary">{defaultBadgeLabel}</Badge>
                          ) : null}
                          <Badge variant="outline">
                            <span
                              className={
                                variant.isAvailable ? "text-emerald-700" : "text-destructive"
                              }
                            >
                              {getVariantAvailabilityLabel(variant.isAvailable)}
                            </span>
                          </Badge>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <div className="flex items-baseline gap-2">
                          <p className="text-xl font-bold leading-tight">{variant.price || "—"}</p>
                          {variant.compareAtPrice ? (
                            <p className="text-sm text-muted-foreground line-through">
                              {variant.compareAtPrice}
                            </p>
                          ) : null}
                        </div>

                        {variant.sku ? (
                          <p className="font-mono text-sm text-muted-foreground">{variant.sku}</p>
                        ) : null}
                      </div>

                      {variantImage ? (
                        <div className="aspect-square w-full overflow-hidden rounded-lg bg-media-surface p-3">
                          <div className="relative h-full w-full">
                            <Image
                              alt={variantImage.altText ?? variant.name}
                              className="object-contain"
                              fill
                              loading="lazy"
                              src={variantImage.url}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid aspect-square place-items-center rounded-lg bg-media-surface p-4 text-center text-sm text-media-foreground">
                          Aucun visuel.
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-surface-border bg-surface-panel-soft p-6">
              <p className="leading-relaxed text-muted-foreground">
                Aucune déclinaison disponible pour ce produit.
              </p>
            </div>
          )}
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Produits liés                                                        */}
        {/* ------------------------------------------------------------------ */}
        {product.relatedProductGroups.some((g) => g.products.length > 0) ? (
          <section className="w-full rounded-xl border border-shell-border bg-shell-surface p-8 shadow-soft min-[700px]:p-10">
            <div className="mb-8 grid gap-2">
              <p className="text-sm font-bold uppercase tracking-widest text-brand">
                Produits liés
              </p>
              <h2 className="m-0">Produits associés</h2>
            </div>
            {/*
             * ProductRelatedSection attend CatalogRelatedProductGroup[] et uploadsPublicPath.
             * AdminProductPreviewRelatedProductGroup est structurellement identique à
             * CatalogRelatedProductGroup — TypeScript les accepte par compatibilité de forme.
             * imageFilePath dans les produits liés est encore un storageKey brut
             * (non résolu dans la query PREV-1) → on passe getUploadsPublicPath().
             */}
            <ProductRelatedSection
              groups={product.relatedProductGroups}
              uploadsPublicPath={uploadsPublicPath}
            />
          </section>
        ) : null}
      </div>
    </AdminPageShell>
  );
}
