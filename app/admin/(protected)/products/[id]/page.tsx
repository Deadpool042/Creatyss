import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/shared/notice";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { listAdminMediaAssets } from "@/db/admin-media";
import { listAdminCategories } from "@/db/repositories/admin-category.repository";
import { findAdminProductById } from "@/db/repositories/admin-product.repository";
import { getProductPublishability } from "@/entities/product/product-publishability";
import { listAdminProductImages } from "@/db/repositories/admin-product-image.repository";
import { listAdminProductVariants } from "@/db/repositories/admin-product-variant.repository";
import { getAdminProductPresentation } from "@/entities/product/product-admin-presentation";
import { getUploadsPublicPath } from "@/lib/uploads";
import {
  findMediaAssetByFilePath,
  getDeleteErrorMessage,
  getDetailSellableCountLabel,
  getImageErrorMessage,
  getImageStatusMessage,
  getPrimaryImageState,
  getProductErrorMessage,
  getProductStatusLabel,
  getProductStatusMessage,
  getSimpleOfferErrorMessage,
  getSimpleOfferFormDefaults,
  getSimpleOfferStatusMessage,
  getVariantErrorMessage,
  getVariantStatusMessage,
  groupVariantImages,
  readProductDetailSearchParam
} from "@/features/admin/products/lib";
import {
  ProductDangerZoneSection,
  ProductDetailHeaderSection,
  ProductGeneralSection,
  ProductImagesSection,
  ProductSalesSection
} from "@/features/admin/products/components";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function ProductDetailPage({
  params,
  searchParams
}: ProductDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const product = await findAdminProductById(id);

  if (product === null) {
    notFound();
  }

  const [categories, variants, images, mediaAssets] = await Promise.all([
    listAdminCategories(),
    listAdminProductVariants(product.id),
    listAdminProductImages(product.id),
    listAdminMediaAssets()
  ]);

  const uploadsPublicPath = getUploadsPublicPath();
  const parentImages = images.filter(image => image.variantId === null);
  const variantImagesById = groupVariantImages(images);
  const productPrimaryImageState = getPrimaryImageState(parentImages);
  const currentProductPrimaryMediaAsset = findMediaAssetByFilePath(
    mediaAssets,
    productPrimaryImageState.displayImage?.filePath ?? null
  );
  const imageScope = readProductDetailSearchParam(
    resolvedSearchParams,
    "image_scope"
  );
  const productPresentation = getAdminProductPresentation(
    product.productType,
    variants.length
  );
  const isSimpleProduct = product.productType === "simple";
  const detailSellableCountLabel = getDetailSellableCountLabel({
    productType: product.productType,
    variantCount: variants.length,
    simpleOffer: product.simpleOffer,
    fallbackLabel: productPresentation.sellableCountLabel
  });
  const salesState = {
    isSimpleProduct,
    showSimpleOfferForm: isSimpleProduct && variants.length <= 1,
    showLegacyVariantCompatibilityBlock: isSimpleProduct && variants.length > 0,
    showVariantCreateForm: !isSimpleProduct,
    simpleProductHasNoLegacyVariant: isSimpleProduct && variants.length === 0,
    simpleProductHasSingleLegacyVariant:
      isSimpleProduct && variants.length === 1,
    simpleProductHasInconsistentVariantCount:
      isSimpleProduct && variants.length > 1,
    simpleOfferFormDefaults: isSimpleProduct
      ? getSimpleOfferFormDefaults(product)
      : null,
    simpleOfferStatusMessage: getSimpleOfferStatusMessage(
      readProductDetailSearchParam(resolvedSearchParams, "simple_offer_status")
    ),
    simpleOfferErrorMessage: getSimpleOfferErrorMessage(
      readProductDetailSearchParam(resolvedSearchParams, "simple_offer_error")
    ),
    variantStatusMessage: getVariantStatusMessage(
      readProductDetailSearchParam(resolvedSearchParams, "variant_status")
    ),
    variantErrorMessage: getVariantErrorMessage(
      readProductDetailSearchParam(resolvedSearchParams, "variant_error")
    ),
    variantImageMessage:
      imageScope === "variant"
        ? {
            status: getImageStatusMessage(
              readProductDetailSearchParam(resolvedSearchParams, "image_status")
            ),
            error: getImageErrorMessage(
              readProductDetailSearchParam(resolvedSearchParams, "image_error")
            )
          }
        : {
            status: null,
            error: null
          }
  };

  return (
    <AdminPageShell
      actions={
        <Button
          asChild
          size="sm"
          variant="outline">
          <Link href="/admin/products">Retour à la liste</Link>
        </Button>
      }
      description="Commencez par les informations générales, puis complétez les informations de vente ou les déclinaisons selon le type du produit."
      eyebrow="Produits"
      title="Modifier le produit">
      <ProductDetailHeaderSection
        summary={{
          statusLabel: getProductStatusLabel(product.status),
          typeLabel: productPresentation.typeLabel,
          featuredLabel: product.isFeatured ? "Mis en avant" : "Standard",
          categoryLabel: `${product.categories.length} catégorie${product.categories.length > 1 ? "s" : ""}`,
          sellableLabel: detailSellableCountLabel
        }}
      />

      {product.status === "draft" &&
      !getProductPublishability(product.productType, variants.length).ok ? (
        <Notice tone="alert">
          {getProductErrorMessage("simple_product_incoherent_variants")}
        </Notice>
      ) : null}

      <ProductGeneralSection
        categories={categories}
        errorMessage={getProductErrorMessage(
          readProductDetailSearchParam(resolvedSearchParams, "product_error")
        )}
        product={product}
        statusMessage={getProductStatusMessage(
          readProductDetailSearchParam(resolvedSearchParams, "product_status")
        )}
      />

      <ProductImagesSection
        currentProductPrimaryMediaAssetId={
          currentProductPrimaryMediaAsset?.id ?? ""
        }
        mediaAssets={mediaAssets}
        parentImages={parentImages}
        productId={product.id}
        productImageMessage={
          imageScope !== "variant"
            ? {
                status: getImageStatusMessage(
                  readProductDetailSearchParam(
                    resolvedSearchParams,
                    "image_status"
                  )
                ),
                error: getImageErrorMessage(
                  readProductDetailSearchParam(
                    resolvedSearchParams,
                    "image_error"
                  )
                )
              }
            : {
                status: null,
                error: null
              }
        }
        productPrimaryImageState={productPrimaryImageState}
        uploadsPublicPath={uploadsPublicPath}
      />

      <ProductSalesSection
        mediaAssets={mediaAssets}
        product={product}
        productPresentation={productPresentation}
        salesState={salesState}
        uploadsPublicPath={uploadsPublicPath}
        variantImagesById={variantImagesById}
        variants={variants}
      />

      <ProductDangerZoneSection
        deleteErrorMessage={getDeleteErrorMessage(
          readProductDetailSearchParam(resolvedSearchParams, "delete_error")
        )}
        productId={product.id}
      />
    </AdminPageShell>
  );
}
