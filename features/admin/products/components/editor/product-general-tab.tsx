"use client";

import { useActionState, useMemo, useState, type JSX } from "react";

import { useAutoSlug } from "@/entities/shared/slug/hooks/use-auto-slug";
import { getProductStructurePresentation } from "@/entities/product";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminRichTextEditor } from "@/components/admin/forms/admin-rich-text-editor";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import {
  type AdminProductEditorData,
  productGeneralFormInitialState,
  type ProductGeneralFormAction,
} from "@/features/admin/products/editor/types";

type ProductGeneralTabProps = {
  action: ProductGeneralFormAction;
  product: AdminProductEditorData;
  productTypeOptions?: Array<{
    id: string;
    code: string;
    name: string;
    slug: string;
    isActive: boolean;
  }>;
};

type ProductGeneralTabInnerProps = ProductGeneralTabProps & {
  onReset: () => void;
};

type ProductStatusValue = "draft" | "active" | "inactive" | "archived";
type IsFeaturedValue = "true" | "false";

function getProductTypeLabel(option: { code: string; name: string; slug: string }): string {
  const normalizedCode = option.code.trim().toLowerCase();
  const normalizedName = option.name.trim().toLowerCase();
  const normalizedSlug = option.slug.trim().toLowerCase();

  if (normalizedCode === "simple") {
    return "Produit simple";
  }

  if (normalizedCode === "variable") {
    return "Produit à variantes";
  }

  if (
    normalizedCode.includes("woo") ||
    normalizedSlug.includes("woo") ||
    normalizedName.includes("woo") ||
    normalizedCode.includes("import") ||
    normalizedSlug.includes("import") ||
    normalizedName.includes("import")
  ) {
    return "Import catalogue historique";
  }

  return option.name;
}

function SectionEyebrow({ children }: { children: string }): JSX.Element {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </p>
  );
}

function ProductGeneralTabInner({
  action,
  product,
  productTypeOptions = [],
  onReset,
}: ProductGeneralTabInnerProps): JSX.Element {
  const [state, formAction, pending] = useActionState(action, productGeneralFormInitialState);

  const {
    sourceValue: nameValue,
    slugValue,
    setSourceValue: setNameValue,
    setSlugValue,
  } = useAutoSlug({
    initialSourceValue: product.product.name,
    initialSlugValue: product.product.slug,
  });

  const [skuRoot, setSkuRoot] = useState(product.product.skuRoot ?? "");
  const [marketingHook, setMarketingHook] = useState(product.product.marketingHook ?? "");
  const [productTypeId, setProductTypeId] = useState(product.product.productTypeId ?? "__none__");
  const [status, setStatus] = useState<ProductStatusValue>(product.product.status);
  const [isFeatured, setIsFeatured] = useState<IsFeaturedValue>(
    product.product.isFeatured ? "true" : "false"
  );

  function handleStatusChange(value: string): void {
    if (value === "draft" || value === "active" || value === "inactive" || value === "archived") {
      setStatus(value);
    }
  }

  function handleIsFeaturedChange(value: string): void {
    if (value === "true" || value === "false") {
      setIsFeatured(value);
    }
  }

  const primaryImageSummary = useMemo(() => {
    if (product.product.primaryImageId === null) {
      return "Aucune image principale définie.";
    }

    if (product.product.primaryImageAltText) {
      return `Image actuelle : ${product.product.primaryImageAltText}`;
    }

    return "Une image principale est déjà définie.";
  }, [product.product.primaryImageAltText, product.product.primaryImageId]);

  return (
    <form action={formAction} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(7rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-14">
        <input type="hidden" name="productId" value={product.product.id} />

        <div className="w-full space-y-6 px-4 py-4 md:space-y-7 md:px-6 md:py-6 lg:mx-auto lg:max-w-4xl lg:px-5 xl:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:py-3">
          <AdminFormMessage
            tone="error"
            message={state.status === "error" ? state.message : null}
          />
          <AdminFormMessage
            tone="success"
            message={state.status === "success" ? state.message : null}
          />

          <Card className="rounded-[1.4rem] border border-surface-border-strong bg-surface-panel shadow-raised py-0">
            <CardHeader className="rounded-t-[1.4rem] border-b border-surface-border bg-surface-panel-soft px-5 py-5 md:px-6">
              <div className="space-y-1.5">
                <SectionEyebrow>Identité</SectionEyebrow>
                <CardTitle className="text-lg">Identité produit</CardTitle>
                <CardDescription className="leading-6 text-foreground/70">
                  Renseignez les attributs structurants qui identifient ce produit dans le
                  catalogue.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 px-5 py-5 md:px-6 md:py-6">
              <AdminFormField
                label="Nom du produit"
                htmlFor="edit-name"
                required
                error={state.fieldErrors.name}
              >
                <Input
                  id="edit-name"
                  name="name"
                  value={nameValue}
                  onChange={(event) => setNameValue(event.target.value)}
                  className="text-sm"
                />
              </AdminFormField>

              <AdminFormField
                label="Slug"
                htmlFor="edit-slug"
                required
                hint="Généré automatiquement depuis le nom. Vous pouvez le modifier."
                error={state.fieldErrors.slug}
              >
                <Input
                  id="edit-slug"
                  name="slug"
                  value={slugValue}
                  onChange={(event) => setSlugValue(event.target.value)}
                  className="font-mono text-sm"
                />
              </AdminFormField>

              <div className="grid gap-4 md:grid-cols-2">
                <AdminFormField
                  label="Référence produit (SKU)"
                  htmlFor="edit-sku-root"
                  hint="Identifiant interne utilisé pour gérer les stocks. Pour un produit à variantes, chaque déclinaison génère automatiquement son propre code à partir de cette base."
                  error={state.fieldErrors.skuRoot}
                >
                  <Input
                    id="edit-sku-root"
                    name="skuRoot"
                    value={skuRoot}
                    onChange={(event) => setSkuRoot(event.target.value)}
                    className="text-sm"
                  />
                </AdminFormField>

                <AdminFormField
                  label="Famille produit"
                  htmlFor="edit-product-type"
                  hint="Classe le produit dans une famille catalogue."
                  error={state.fieldErrors.productTypeId}
                >
                  <input type="hidden" name="productTypeId" value={productTypeId} />

                  <Select value={productTypeId} onValueChange={setProductTypeId}>
                    <SelectTrigger id="edit-product-type" className="w-full text-sm">
                      <SelectValue placeholder="Non renseignée" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Non renseignée</SelectItem>
                      {productTypeOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {getProductTypeLabel(option)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AdminFormField>
              </div>

              <div className="rounded-2xl border border-surface-border bg-surface-panel-soft px-4 py-3 text-sm shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Structure du produit
                </p>
                <p className="mt-2 font-medium text-foreground">
                  {getProductStructurePresentation(product.product.isStandalone).label}
                </p>
                <p className="mt-1 leading-6 text-muted-foreground">
                  Indique si le produit est vendu seul ou avec plusieurs déclinaisons.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.35rem] border border-surface-border bg-card shadow-card py-0">
            <CardHeader className="rounded-t-[1.35rem] border-b border-surface-border bg-muted/30 px-5 py-4 md:px-6">
              <div className="space-y-1.5">
                <SectionEyebrow>Contenus</SectionEyebrow>
                <CardTitle>Contenus éditoriaux</CardTitle>
                <CardDescription className="leading-6">
                  Rédigez le résumé et la description complète du produit.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 px-5 py-5 md:px-6 md:py-6">
              <AdminFormField
                label="Accroche commerciale"
                htmlFor="edit-marketing-hook"
                hint="Phrase courte affichée en haut de la fiche produit pour mettre le produit en valeur."
                error={state.fieldErrors.marketingHook}
              >
                <Input
                  id="edit-marketing-hook"
                  name="marketingHook"
                  value={marketingHook}
                  onChange={(event) => setMarketingHook(event.target.value)}
                  placeholder="Ex. Un sac artisanal pensé pour illuminer le quotidien."
                  className="text-sm"
                />
              </AdminFormField>
              <AdminRichTextEditor
                name="shortDescription"
                label="Résumé"
                preset="full"
                initialValue={product.product.shortDescription ?? ""}
                {...(state.fieldErrors.shortDescription
                  ? { error: state.fieldErrors.shortDescription }
                  : {})}
              />
              <AdminRichTextEditor
                name="description"
                label="Description détaillée"
                preset="full"
                initialValue={product.product.description ?? ""}
                {...(state.fieldErrors.description ? { error: state.fieldErrors.description } : {})}
              />
            </CardContent>
          </Card>

          <Card className="rounded-[1.35rem] border border-surface-border bg-card shadow-card py-0">
            <CardHeader className="rounded-t-[1.35rem] border-b border-surface-border bg-muted/30 px-5 py-4 md:px-6">
              <div className="space-y-1.5">
                <SectionEyebrow>Publication</SectionEyebrow>
                <CardTitle>Publication et visibilité</CardTitle>
                <CardDescription className="leading-6">
                  Contrôlez la mise en ligne du produit et sa mise en avant.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 px-5 py-5 md:grid-cols-2 md:px-6 md:py-6">
              <AdminFormField
                label="Statut"
                htmlFor="edit-status"
                hint="Brouillon : non visible. Actif : publié sur la boutique. Inactif : retiré temporairement. Archivé : retiré définitivement."
                error={state.fieldErrors.status}
              >
                <input type="hidden" name="status" value={status} />

                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger id="edit-status" className="w-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </AdminFormField>

              <AdminFormField
                label="Mise en avant"
                htmlFor="edit-is-featured"
                error={state.fieldErrors.isFeatured}
              >
                <input type="hidden" name="isFeatured" value={isFeatured} />

                <Select value={isFeatured} onValueChange={handleIsFeaturedChange}>
                  <SelectTrigger id="edit-is-featured" className="w-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Produit standard</SelectItem>
                    <SelectItem value="true">Produit mis en avant</SelectItem>
                  </SelectContent>
                </Select>
              </AdminFormField>

              <div className="rounded-2xl border border-surface-border bg-surface-panel-soft px-4 py-3 text-sm shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Image principale
                </p>
                <p className="mt-2 font-medium text-foreground">{primaryImageSummary}</p>
                <p className="mt-1 leading-6 text-muted-foreground">
                  Gérez ce choix depuis l’onglet Médias.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdminFormFooter
        actionsClassName="w-full justify-between gap-2 sm:w-auto sm:justify-end "
        className={[
          "bottom-[calc(3.5rem+env(safe-area-inset-bottom))]",
          "[@media(max-height:480px)]:bottom-[calc(2.75rem+env(safe-area-inset-bottom))]",
          "lg:bottom-0",
        ].join(" ")}
        overlay
      >
        <Button
          variant="ghost"
          type="button"
          size="xs"
          className="h-8 rounded-full px-4 text-muted-foreground hover:text-foreground lg:h-9"
          onClick={onReset}
        >
          Réinitialiser
        </Button>

        <Button
          type="submit"
          variant="outline"
          size="xs"
          className="h-8 w-fit rounded-full border-shell-border px-4 text-foreground shadow-none sm:flex-none lg:h-9"
          disabled={pending}
        >
          {pending ? "Mise à jour…" : "Enregistrer"}
        </Button>
      </AdminFormFooter>
    </form>
  );
}

export function ProductGeneralTab(props: ProductGeneralTabProps): JSX.Element {
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  const resetKey = [
    props.product.product.id,
    props.product.product.name,
    props.product.product.slug,
    props.product.product.skuRoot ?? "",
    props.product.product.marketingHook ?? "",
    props.product.product.productTypeId ?? "__none__",
    props.product.product.status,
    props.product.product.isFeatured ? "true" : "false",
  ].join(":");

  return (
    <ProductGeneralTabInner
      key={`${resetKey}:${formInstanceKey}`}
      {...props}
      onReset={() => setFormInstanceKey((current) => current + 1)}
    />
  );
}
