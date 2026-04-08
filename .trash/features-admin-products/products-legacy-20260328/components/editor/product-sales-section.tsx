import { Notice } from "@/components/shared/notice";
import { SectionIntro } from "@/components/shared/section-intro";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type AdminMediaAsset,
  type AdminProductDetail,
  type AdminProductImage,
  type AdminProductVariant,
} from "@/features/admin/products/types/product-detail-types";
import { type ProductAdminPresentation } from "@/entities/product/product-admin-presentation";
import {
  createProductVariantAction,
  updateSimpleProductOfferAction,
} from "@/features/admin/products/actions";
import { getAvailabilityLabel } from "@/features/admin/products/mappers/product-detail-mappers";
import { ProductVariantCard } from "./product-variant-card";

const nativeSelectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50";

const fieldsetClassName = "grid gap-4 rounded-xl border border-border/60 bg-muted/10 p-4";

const legendClassName =
  "px-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground";

const checkboxInputClassName =
  "mt-1 size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

export type ProductSalesState = Readonly<{
  isSimpleProduct: boolean;
  showSimpleOfferForm: boolean;
  showLegacyVariantCompatibilityBlock: boolean;
  showVariantCreateForm: boolean;
  simpleProductHasNoLegacyVariant: boolean;
  simpleProductHasSingleLegacyVariant: boolean;
  simpleProductHasInconsistentVariantCount: boolean;
  simpleOfferFormDefaults: {
    sku: string;
    price: string;
    compareAtPrice: string;
    stockQuantity: string;
  } | null;
  simpleOfferStatusMessage: string | null;
  simpleOfferErrorMessage: string | null;
  variantStatusMessage: string | null;
  variantErrorMessage: string | null;
  variantImageMessage: {
    error: string | null;
    status: string | null;
  };
}>;

type ProductSalesSectionProps = Readonly<{
  mediaAssets: AdminMediaAsset[];
  product: Pick<AdminProductDetail, "id" | "simpleOffer">;
  productPresentation: ProductAdminPresentation;
  salesState: ProductSalesState;
  uploadsPublicPath: string;
  variantImagesById: ReadonlyMap<string, AdminProductImage[]>;
  variants: AdminProductVariant[];
}>;

function renderSimpleProductNotes(
  product: Pick<AdminProductDetail, "simpleOffer">,
  salesState: ProductSalesState
) {
  return (
    <>
      {salesState.simpleOfferStatusMessage ? (
        <Notice tone="success">{salesState.simpleOfferStatusMessage}</Notice>
      ) : null}
      {salesState.simpleOfferErrorMessage ? (
        <Notice tone="alert">{salesState.simpleOfferErrorMessage}</Notice>
      ) : null}
      {salesState.simpleProductHasInconsistentVariantCount ? (
        <Notice tone="alert">
          Plusieurs déclinaisons sont encore associées à ce produit simple. Corrigez d&apos;abord
          cet état dans les données existantes avant de modifier les informations de vente.
        </Notice>
      ) : null}
      {salesState.showSimpleOfferForm && product.simpleOffer ? (
        <Notice tone="note">
          Disponibilité actuelle : {getAvailabilityLabel(product.simpleOffer.isAvailable)}
        </Notice>
      ) : null}
      {salesState.showSimpleOfferForm && salesState.simpleProductHasNoLegacyVariant ? (
        <Notice tone="note">
          Vous pouvez enregistrer les informations de vente ici. Pour le moment, l&apos;affichage
          public de ce produit reste limité tant qu&apos;aucune déclinaison existante n&apos;est
          associée.
        </Notice>
      ) : null}
      {salesState.showSimpleOfferForm && salesState.simpleProductHasSingleLegacyVariant ? (
        <Notice tone="note">
          Les informations commerciales saisies ici restent synchronisées avec l&apos;unique
          déclinaison déjà enregistrée. Les autres réglages de cette déclinaison restent disponibles
          plus bas sur la page.
        </Notice>
      ) : null}
    </>
  );
}

function renderSimpleOfferForm(productId: string, salesState: ProductSalesState) {
  if (!salesState.showSimpleOfferForm || salesState.simpleOfferFormDefaults === null) {
    return null;
  }

  const skuId = `simple-offer-sku-${productId}`;
  const priceId = `simple-offer-price-${productId}`;
  const compareAtPriceId = `simple-offer-compare-at-price-${productId}`;
  const stockQuantityId = `simple-offer-stock-quantity-${productId}`;

  return (
    <form action={updateSimpleProductOfferAction} className="space-y-4">
      <input name="productId" type="hidden" value={productId} />

      <fieldset className={fieldsetClassName}>
        <legend className={legendClassName}>Informations de vente</legend>

        <div className="grid gap-4 md:grid-cols-2">
          <AdminFormField htmlFor={skuId} label="SKU">
            <Input
              defaultValue={salesState.simpleOfferFormDefaults.sku}
              id={skuId}
              name="sku"
              required
              type="text"
            />
          </AdminFormField>

          <AdminFormField htmlFor={priceId} label="Prix">
            <Input
              defaultValue={salesState.simpleOfferFormDefaults.price}
              id={priceId}
              inputMode="decimal"
              name="price"
              required
              type="text"
            />
          </AdminFormField>

          <AdminFormField htmlFor={compareAtPriceId} label="Prix avant réduction">
            <Input
              defaultValue={salesState.simpleOfferFormDefaults.compareAtPrice}
              id={compareAtPriceId}
              inputMode="decimal"
              name="compareAtPrice"
              type="text"
            />
          </AdminFormField>

          <AdminFormField htmlFor={stockQuantityId} label="Stock disponible">
            <Input
              defaultValue={salesState.simpleOfferFormDefaults.stockQuantity}
              id={stockQuantityId}
              min="0"
              name="stockQuantity"
              required
              step="1"
              type="number"
            />
          </AdminFormField>
        </div>
      </fieldset>

      <AdminFormActions>
        <Button className="w-full sm:w-fit" type="submit">
          Enregistrer les informations de vente
        </Button>
      </AdminFormActions>
    </form>
  );
}

function renderVariantCreateForm(
  productId: string,
  productPresentation: ProductAdminPresentation,
  shouldRender: boolean
) {
  if (!shouldRender) {
    return null;
  }

  const skuId = `new-variant-sku-${productId}`;
  const priceId = `new-variant-price-${productId}`;
  const compareAtPriceId = `new-variant-compare-at-price-${productId}`;
  const statusId = `new-variant-status-${productId}`;
  const stockQuantityId = `new-variant-stock-quantity-${productId}`;
  const nameId = `new-variant-name-${productId}`;
  const colorNameId = `new-variant-color-name-${productId}`;
  const colorHexId = `new-variant-color-hex-${productId}`;

  return (
    <form action={createProductVariantAction} className="space-y-4">
      <input name="productId" type="hidden" value={productId} />

      <fieldset className={fieldsetClassName}>
        <legend className={legendClassName}>{productPresentation.saleFieldsetLegend}</legend>

        <div className="grid gap-4 md:grid-cols-2">
          <AdminFormField htmlFor={skuId} label="SKU">
            <Input id={skuId} name="sku" required type="text" />
          </AdminFormField>

          <AdminFormField htmlFor={priceId} label="Prix">
            <Input id={priceId} inputMode="decimal" name="price" required type="text" />
          </AdminFormField>

          <AdminFormField htmlFor={compareAtPriceId} label="Prix avant réduction">
            <Input id={compareAtPriceId} inputMode="decimal" name="compareAtPrice" type="text" />
          </AdminFormField>

          <AdminFormField htmlFor={statusId} label="Statut">
            <select
              className={nativeSelectClassName}
              defaultValue="draft"
              id={statusId}
              name="status"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </AdminFormField>

          <AdminFormField htmlFor={stockQuantityId} label="Stock disponible">
            <Input
              defaultValue="0"
              id={stockQuantityId}
              min="0"
              name="stockQuantity"
              required
              step="1"
              type="number"
            />
          </AdminFormField>
        </div>
      </fieldset>

      <fieldset className={fieldsetClassName}>
        <legend className={legendClassName}>Informations de la déclinaison</legend>

        <div className="grid gap-4 md:grid-cols-2">
          <AdminFormField htmlFor={nameId} label="Nom de la déclinaison">
            <Input id={nameId} name="name" required type="text" />
          </AdminFormField>

          <AdminFormField htmlFor={colorNameId} label="Nom de couleur">
            <Input id={colorNameId} name="colorName" required type="text" />
          </AdminFormField>

          <AdminFormField htmlFor={colorHexId} label="Code couleur">
            <Input id={colorHexId} name="colorHex" placeholder="#C19A6B" type="text" />
          </AdminFormField>
        </div>

        <label className="flex items-start gap-3 text-sm leading-6 text-foreground">
          <input className={checkboxInputClassName} name="isDefault" type="checkbox" value="on" />
          <span>Définir comme déclinaison par défaut</span>
        </label>
      </fieldset>

      <AdminFormActions>
        <Button className="w-full sm:w-fit" type="submit">
          {productPresentation.createActionLabel}
        </Button>
      </AdminFormActions>
    </form>
  );
}

export function ProductSalesSection({
  mediaAssets,
  product,
  productPresentation,
  salesState,
  uploadsPublicPath,
  variantImagesById,
  variants,
}: ProductSalesSectionProps) {
  const variantCards = variants.length > 0 && (
    <div className="grid gap-4">
      {variants.map((variant) => (
        <ProductVariantCard
          isSimpleProduct={salesState.isSimpleProduct}
          mediaAssets={mediaAssets}
          productId={product.id}
          productPresentation={productPresentation}
          uploadsPublicPath={uploadsPublicPath}
          key={variant.id}
          variant={variant}
          variantImages={variantImagesById.get(variant.id) ?? []}
        />
      ))}
    </div>
  );

  return (
    <section className="space-y-4">
      <AdminFormSection
        contentClassName="gap-6"
        description={
          salesState.isSimpleProduct
            ? "Complétez ici la référence, le prix, le Prix avant réduction et le stock du produit simple."
            : productPresentation.sectionDescription
        }
        eyebrow={salesState.isSimpleProduct ? "Produit simple" : productPresentation.sectionEyebrow}
        title={
          salesState.isSimpleProduct ? "Informations de vente" : productPresentation.sectionTitle
        }
      >
        {salesState.isSimpleProduct ? (
          <>
            {renderSimpleProductNotes(product, salesState)}
            {renderSimpleOfferForm(product.id, salesState)}

            {salesState.showLegacyVariantCompatibilityBlock ? (
              <div className=" space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4">
                <SectionIntro
                  className="grid gap-2"
                  description="Ce bloc rassemble les données déjà enregistrées. Utilisez-le seulement pour vérifier l'existant ou terminer une correction manuelle."
                  eyebrow="Données existantes"
                  title={variants.length > 1 ? "Déclinaisons existantes" : "Déclinaison existante"}
                  titleAs="h3"
                />

                {salesState.variantStatusMessage ? (
                  <Notice tone="success">{salesState.variantStatusMessage}</Notice>
                ) : null}
                {salesState.variantErrorMessage ? (
                  <Notice tone="alert">{salesState.variantErrorMessage}</Notice>
                ) : null}
                {salesState.variantImageMessage.status ? (
                  <Notice tone="success">{salesState.variantImageMessage.status}</Notice>
                ) : null}
                {salesState.variantImageMessage.error ? (
                  <Notice tone="alert">{salesState.variantImageMessage.error}</Notice>
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          <>
            {salesState.variantStatusMessage ? (
              <Notice tone="success">{salesState.variantStatusMessage}</Notice>
            ) : null}
            {salesState.variantErrorMessage ? (
              <Notice tone="alert">{salesState.variantErrorMessage}</Notice>
            ) : null}
            {salesState.variantImageMessage.status ? (
              <Notice tone="success">{salesState.variantImageMessage.status}</Notice>
            ) : null}
            {salesState.variantImageMessage.error ? (
              <Notice tone="alert">{salesState.variantImageMessage.error}</Notice>
            ) : null}

            <Notice tone="note">Gérez ici les déclinaisons et leurs informations de vente.</Notice>

            {renderVariantCreateForm(
              product.id,
              productPresentation,
              salesState.showVariantCreateForm
            )}
          </>
        )}

        {variantCards}

        {!salesState.isSimpleProduct && variants.length === 0 ? (
          <AdminEmptyState
            description={productPresentation.emptyDescription}
            eyebrow={productPresentation.emptyEyebrow}
            title={productPresentation.emptyTitle}
          />
        ) : null}
      </AdminFormSection>
    </section>
  );
}
