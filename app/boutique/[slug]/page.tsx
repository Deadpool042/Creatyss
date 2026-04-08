import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notice } from "@/components/shared/notice";
import { getPublishedProductBySlug } from "@/db/repositories/catalog/catalog.repository";
import { addToCartAction } from "@/features/cart";
import {
  getOfferAvailabilityMessage,
  getProductAvailabilityLabel,
  getProductOfferSectionPresentation,
  getProductPageStatusSummary,
  getSimpleOfferCardTitle,
  getVariantAvailabilityLabel,
  getVariantDefaultBadgeLabel,
} from "@/entities/product/product-public-presentation";
import { getUploadsPublicPath } from "@/lib/uploads";

export const dynamic = "force-dynamic";

type ProductPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    cart_error?: string | string[];
    cart_status?: string | string[];
  }>;
}>;

type ProductMetadataSource = NonNullable<Awaited<ReturnType<typeof getPublishedProductBySlug>>>;

function getCartStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "added":
      return "Article ajouté au panier.";
    default:
      return null;
  }
}

function getCartErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_variant":
      return "La déclinaison demandée est introuvable.";
    case "missing_quantity":
    case "invalid_quantity":
      return "Renseignez une quantité entière supérieure ou égale à 1.";
    case "variant_unavailable":
      return "Cette déclinaison n'est pas disponible actuellement.";
    case "insufficient_stock":
      return "Le stock disponible est insuffisant pour cette quantité.";
    case "save_failed":
      return "Le panier n'a pas pu être mis à jour.";
    default:
      return null;
  }
}

function getProductMetadataDescription(product: ProductMetadataSource): string {
  return (
    product.seoDescription ?? product.shortDescription ?? product.description ?? "Produit Creatyss."
  );
}

function getImageUrl(uploadsPublicPath: string, filePath: string): string {
  return `${uploadsPublicPath}/${filePath.replace(/^\/+/, "")}`;
}

function getDisplayImage<TImage extends { isPrimary: boolean }>(
  images: readonly TImage[]
): TImage | null {
  return images.find((image) => image.isPrimary) ?? images[0] ?? null;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (product === null) {
    return {
      title: "Produit Creatyss",
      description: "Produit Creatyss.",
    };
  }

  return {
    title: product.seoTitle ?? product.name,
    description: getProductMetadataDescription(product),
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const cartStatusParam = Array.isArray(resolvedSearchParams.cart_status)
    ? resolvedSearchParams.cart_status[0]
    : resolvedSearchParams.cart_status;
  const cartErrorParam = Array.isArray(resolvedSearchParams.cart_error)
    ? resolvedSearchParams.cart_error[0]
    : resolvedSearchParams.cart_error;
  const cartStatusMessage = getCartStatusMessage(cartStatusParam);
  const cartErrorMessage = getCartErrorMessage(cartErrorParam);
  const product = await getPublishedProductBySlug(slug);

  if (product === null) {
    notFound();
  }

  const uploadsPublicPath = getUploadsPublicPath();
  const availableVariantCount = product.variants.filter((variant) => variant.isAvailable).length;
  const productStatusSummary = getProductPageStatusSummary({
    productType: product.productType,
    totalVariantCount: product.variants.length,
    availableVariantCount,
  });
  const offerSectionPresentation = getProductOfferSectionPresentation(product.productType);
  const isSimpleProduct = product.productType === "simple";
  const singleOffer = isSimpleProduct && product.variants.length === 1 ? product.variants[0] : null;
  const productDisplayImage = getDisplayImage(product.images);
  const singleOfferDisplayImage = singleOffer ? getDisplayImage(singleOffer.images) : null;

  return (
    <div className="grid gap-10">
      <section className="w-full rounded-xl border border-shell-border bg-shell-surface p-8 shadow-soft min-[700px]:p-10">
        <div className="mb-8 grid gap-2">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">Produit</p>
          <h1 className="m-0">{product.name}</h1>
          {product.shortDescription ? (
            <p className="leading-relaxed text-muted-foreground">{product.shortDescription}</p>
          ) : null}
        </div>

        {cartStatusMessage ? (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-600/20 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-800">
            <span>{cartStatusMessage}</span>
            <Link
              className="font-medium underline-offset-4 transition-colors hover:underline"
              href="/panier"
            >
              Voir le panier
            </Link>
          </div>
        ) : null}
        {cartErrorMessage ? <Notice tone="alert">{cartErrorMessage}</Notice> : null}

        <div className="grid gap-6 min-[900px]:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] min-[900px]:items-start">
          <div className="grid gap-4 rounded-lg border border-surface-border bg-surface-panel p-6">
            {productDisplayImage ? (
              <figure className="overflow-hidden rounded-lg bg-media-surface min-h-56">
                <Image
                  alt={productDisplayImage.altText ?? product.name}
                  className="block w-full object-cover"
                  loading="lazy"
                  src={getImageUrl(uploadsPublicPath, productDisplayImage.filePath)}
                  width={800}
                  height={600}
                />
              </figure>
            ) : (
              <div className="grid place-items-center min-h-64 rounded-lg bg-media-surface p-4 text-center text-media-foreground">
                Aucun visuel principal.
              </div>
            )}
          </div>

          <aside className="grid gap-5 rounded-lg border border-surface-border bg-surface-panel p-6">
            <div className="grid gap-3 border-b border-surface-border pb-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Disponibilité du produit
                </p>
                <Badge variant="outline">
                  <span className={product.isAvailable ? "text-emerald-700" : "text-destructive"}>
                    {getProductAvailabilityLabel(product.isAvailable)}
                  </span>
                </Badge>
              </div>

              <h2>{productStatusSummary.title}</h2>
              <p className="leading-relaxed">{productStatusSummary.description}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {productStatusSummary.nextStep}
              </p>

              {isSimpleProduct ? (
                <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
                  <div className="grid gap-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Type de produit
                    </p>
                    <p className="leading-relaxed">Produit simple</p>
                  </div>

                  <div className="grid gap-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Informations de vente
                    </p>
                    <p className="leading-relaxed">
                      {singleOffer ? singleOffer.name : "Indisponible"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
                  <div className="grid gap-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Déclinaisons disponibles
                    </p>
                    <p className="leading-relaxed">{availableVariantCount}</p>
                  </div>

                  <div className="grid gap-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Déclinaisons publiées
                    </p>
                    <p className="leading-relaxed">{product.variants.length}</p>
                  </div>
                </div>
              )}
            </div>

            {product.description ? (
              <div className="grid gap-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Description
                </p>
                <p className="leading-relaxed">{product.description}</p>
              </div>
            ) : null}

            <div className="grid gap-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Référence de page
              </p>
              <p className="leading-relaxed">{product.slug}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="w-full rounded-xl border border-shell-border bg-shell-surface p-8 shadow-soft min-[700px]:p-10">
        <div className="mb-8 grid gap-2">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            {offerSectionPresentation.eyebrow}
          </p>
          <h2 className="m-0">{offerSectionPresentation.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {offerSectionPresentation.description}
          </p>
        </div>

        {isSimpleProduct ? (
          singleOffer ? (
            <article className="grid gap-5 rounded-lg border border-surface-border bg-surface-panel-soft p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid gap-1">
                  <h3>{getSimpleOfferCardTitle()}</h3>
                  <p className="text-sm text-muted-foreground">
                    {singleOffer.name}
                    {singleOffer.colorName ? ` · ${singleOffer.colorName}` : ""}
                    {singleOffer.colorHex ? ` · ${singleOffer.colorHex}` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    <span
                      className={singleOffer.isAvailable ? "text-emerald-700" : "text-destructive"}
                    >
                      {getProductAvailabilityLabel(singleOffer.isAvailable)}
                    </span>
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Prix
                  </p>
                  <p className="text-2xl font-bold leading-tight">{singleOffer.price}</p>
                  {singleOffer.compareAtPrice ? (
                    <p className="text-sm text-muted-foreground">
                      Prix avant réduction : {singleOffer.compareAtPrice}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Ajout au panier
                  </p>
                  <p
                    className={
                      singleOffer.isAvailable ? "leading-relaxed" : "text-sm text-muted-foreground"
                    }
                  >
                    {getOfferAvailabilityMessage({
                      productType: product.productType,
                      isAvailable: singleOffer.isAvailable,
                    })}
                  </p>
                </div>

                {singleOffer.isAvailable ? (
                  <form action={addToCartAction} className="grid gap-4">
                    <input name="productSlug" type="hidden" value={product.slug} />
                    <input name="variantId" type="hidden" value={singleOffer.id} />

                    <div className="grid gap-2 max-w-[10rem]">
                      <Label htmlFor={`quantity-${singleOffer.id}`}>Quantité</Label>
                      <Input
                        defaultValue="1"
                        id={`quantity-${singleOffer.id}`}
                        min="1"
                        name="quantity"
                        required
                        step="1"
                        type="number"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button type="submit">Ajouter au panier</Button>
                    </div>
                  </form>
                ) : null}
              </div>

              <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
                <div className="grid gap-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    SKU
                  </p>
                  <p className="leading-relaxed">{singleOffer.sku}</p>
                </div>

                <div className="grid gap-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Couleur
                  </p>
                  <p className="leading-relaxed">
                    {singleOffer.colorName}
                    {singleOffer.colorHex ? ` · ${singleOffer.colorHex}` : ""}
                  </p>
                </div>
              </div>

              {singleOfferDisplayImage ? (
                <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
                  <figure
                    className="overflow-hidden rounded-lg bg-media-surface min-h-40"
                    key={singleOfferDisplayImage.id}
                  >
                    <Image
                      alt={singleOfferDisplayImage.altText ?? singleOffer.name}
                      className="block w-full object-cover"
                      loading="lazy"
                      src={getImageUrl(uploadsPublicPath, singleOfferDisplayImage.filePath)}
                      width={600}
                      height={450}
                    />
                  </figure>
                </div>
              ) : (
                <div className="grid place-items-center min-h-56 rounded-lg bg-media-surface p-4 text-center text-media-foreground">
                  Aucun visuel pour ce produit.
                </div>
              )}
            </article>
          ) : (
            <div className="grid gap-4 rounded-lg border border-surface-border bg-surface-panel-soft p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-brand">
                {offerSectionPresentation.emptyEyebrow}
              </p>
              <h2>{offerSectionPresentation.emptyTitle}</h2>
              <p className="leading-relaxed text-muted-foreground">
                {offerSectionPresentation.emptyDescription}
              </p>
            </div>
          )
        ) : product.variants.length > 0 ? (
          <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
            {product.variants.map((variant) => {
              const variantDisplayImage = getDisplayImage(variant.images);

              return (
                <article
                  className="grid gap-5 rounded-lg border border-surface-border bg-surface-panel-soft p-6"
                  key={variant.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="grid gap-1">
                      <h3>{variant.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {variant.colorName}
                        {variant.colorHex ? ` · ${variant.colorHex}` : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {getVariantDefaultBadgeLabel(variant.isDefault) ? (
                        <Badge variant="secondary">
                          {getVariantDefaultBadgeLabel(variant.isDefault)}
                        </Badge>
                      ) : null}
                      <Badge variant="outline">
                        <span
                          className={variant.isAvailable ? "text-emerald-700" : "text-destructive"}
                        >
                          {getVariantAvailabilityLabel(variant.isAvailable)}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Prix
                      </p>
                      <p className="text-2xl font-bold leading-tight">{variant.price}</p>
                      {variant.compareAtPrice ? (
                        <p className="text-sm text-muted-foreground">
                          Prix avant réduction : {variant.compareAtPrice}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Ajout au panier
                      </p>
                      <p
                        className={
                          variant.isAvailable ? "leading-relaxed" : "text-sm text-muted-foreground"
                        }
                      >
                        {getOfferAvailabilityMessage({
                          productType: product.productType,
                          isAvailable: variant.isAvailable,
                        })}
                      </p>
                    </div>

                    {variant.isAvailable ? (
                      <form action={addToCartAction} className="grid gap-4">
                        <input name="productSlug" type="hidden" value={product.slug} />
                        <input name="variantId" type="hidden" value={variant.id} />

                        <div className="grid gap-2 max-w-[10rem]">
                          <Label htmlFor={`quantity-${variant.id}`}>Quantité</Label>
                          <Input
                            defaultValue="1"
                            id={`quantity-${variant.id}`}
                            min="1"
                            name="quantity"
                            required
                            step="1"
                            type="number"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button type="submit">Ajouter au panier</Button>
                        </div>
                      </form>
                    ) : null}
                  </div>

                  <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
                    <div className="grid gap-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        SKU
                      </p>
                      <p className="leading-relaxed">{variant.sku}</p>
                    </div>

                    <div className="grid gap-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Couleur
                      </p>
                      <p className="leading-relaxed">
                        {variant.colorName}
                        {variant.colorHex ? ` · ${variant.colorHex}` : ""}
                      </p>
                    </div>
                  </div>

                  {variantDisplayImage ? (
                    <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
                      <figure
                        className="overflow-hidden rounded-lg bg-media-surface min-h-40"
                        key={variantDisplayImage.id}
                      >
                        <Image
                          alt={variantDisplayImage.altText ?? variant.name}
                          className="block w-full object-cover"
                          loading="lazy"
                          src={getImageUrl(uploadsPublicPath, variantDisplayImage.filePath)}
                          width={600}
                          height={450}
                        />
                      </figure>
                    </div>
                  ) : (
                    <div className="grid place-items-center min-h-56 rounded-lg bg-media-surface p-4 text-center text-media-foreground">
                      Aucun visuel pour cette déclinaison.
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-4 rounded-lg border border-surface-border bg-surface-panel-soft p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-brand">
              {offerSectionPresentation.emptyEyebrow}
            </p>
            <h2>{offerSectionPresentation.emptyTitle}</h2>
            <p className="leading-relaxed text-muted-foreground">
              {offerSectionPresentation.emptyDescription}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
