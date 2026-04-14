"use client";

import { type JSX, useActionState, useState } from "react";

import { useAutoSlug } from "@/entities/shared/slug/hooks/use-auto-slug";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormShell } from "@/components/admin/forms/admin-form-shell";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  initialCreateProductActionState,
  type CreateProductActionState,
  type AdminCreatableProductTypeCode,
} from "@/features/admin/products/create/types";

export type ProductCreateFormAction = (
  prevState: CreateProductActionState,
  formData: FormData
) => Promise<CreateProductActionState>;

type ProductTypeOption = {
  code: AdminCreatableProductTypeCode;
  name: string;
};

type ProductCreateFormProps = {
  action: ProductCreateFormAction;
  productTypeOptions?: ProductTypeOption[];
};

type ProductCreatePanelInnerProps = {
  action: ProductCreateFormAction;
  productTypeOptions?: ProductTypeOption[];
  onReset: () => void;
};

function SectionEyebrow({ children }: { children: string }): JSX.Element {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:text-[11px]">
      {children}
    </p>
  );
}

function getProductTypeLabel(option: ProductTypeOption): string {
  if (option.code === "simple") {
    return "Produit simple";
  }

  if (option.code === "variable") {
    return "Produit à variantes";
  }

  return option.name;
}

function ProductCreatePanelInner({
  action,
  productTypeOptions = [],
  onReset,
}: ProductCreatePanelInnerProps): JSX.Element {
  const [state, formAction, pending] = useActionState(action, initialCreateProductActionState);
  const [step, setStep] = useState<1 | 2>(1);
  const [productTypeCode, setProductTypeCode] = useState("");

  const {
    sourceValue: nameValue,
    slugValue,
    setSourceValue: setNameValue,
    setSlugValue,
  } = useAutoSlug({
    initialSourceValue: "",
    initialSlugValue: "",
  });

  function handleReset(): void {
    setStep(1);
    setProductTypeCode("");
    onReset();
  }

  function handleNext(): void {
    if (nameValue.trim().length > 0 && slugValue.trim().length > 0) {
      setStep(2);
    }
  }

  return (
    <form action={formAction} className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <AdminFormShell
        title="Nouveau produit"
        description={
          step === 1 ? "Donnez un nom à votre produit." : "Choisissez le type de produit."
        }
        footer={
          step === 1 ? (
            <>
              <Button
                variant="ghost"
                type="button"
                size="xs"
                className="h-8 rounded-full px-3 sm:h-9 sm:px-4"
                onClick={handleReset}
              >
                Réinitialiser
              </Button>
              <Button
                type="button"
                size="xs"
                className="h-8 rounded-full px-3 sm:h-9 sm:px-4"
                onClick={handleNext}
                disabled={nameValue.trim().length === 0 || slugValue.trim().length === 0}
              >
                Suivant
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                type="button"
                size="xs"
                className="h-8 rounded-full px-3 sm:h-9 sm:px-4"
                onClick={() => setStep(1)}
              >
                Retour
              </Button>
              <Button
                type="submit"
                size="xs"
                className="h-8 rounded-full px-3 sm:h-9 sm:px-4"
                disabled={pending || productTypeCode.length === 0}
              >
                {pending ? "Création…" : "Créer le produit"}
              </Button>
            </>
          )
        }
      >
        <div className="rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-2.5 sm:rounded-xl sm:px-4 sm:py-3">
          <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px] sm:mb-2 sm:text-xs">
            <span className="font-medium text-foreground/80">Progression</span>
            <span className="text-muted-foreground">Étape {step} sur 2</span>
          </div>
          <Progress value={step === 1 ? 50 : 100} className="h-1.5" />
        </div>

        <AdminFormMessage
          tone={state.status === "success" ? "success" : "error"}
          message={state.status !== "idle" ? state.message : null}
        />

        {step === 1 ? (
          <Card className="rounded-xl border border-surface-border-strong bg-surface-panel shadow-raised py-0 sm:rounded-[1.35rem]">
            <CardHeader className="rounded-t-xl border-b border-surface-border bg-surface-panel-soft px-4 py-3 sm:rounded-t-[1.35rem] sm:px-5 sm:py-4">
              <div className="space-y-1.5">
                <SectionEyebrow>Identité</SectionEyebrow>
                <CardTitle className="text-base sm:text-lg">Identité produit</CardTitle>
                <CardDescription className="text-sm leading-6 text-foreground/70">
                  Donnez un nom au produit. Le slug est généré automatiquement et reste modifiable.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="grid gap-4 px-4 py-4 sm:gap-5 sm:px-5 sm:py-5">
              <AdminFormField
                label="Nom"
                htmlFor="new-name"
                required
                error={state.fieldErrors.name}
              >
                <Input
                  id="new-name"
                  name="name"
                  value={nameValue}
                  onChange={(event) => setNameValue(event.target.value)}
                  placeholder="Ex. Trousse en cuir"
                  className="text-sm"
                />
              </AdminFormField>

              <AdminFormField
                label="Slug"
                htmlFor="new-slug"
                required
                hint="Généré automatiquement depuis le nom. Vous pouvez le modifier."
                error={state.fieldErrors.slug}
              >
                <Input
                  id="new-slug"
                  name="slug"
                  value={slugValue}
                  onChange={(event) => setSlugValue(event.target.value)}
                  placeholder="trousse-cuir"
                  className="font-mono text-sm"
                />
              </AdminFormField>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-xl border border-surface-border-strong bg-surface-panel shadow-raised py-0 sm:rounded-[1.35rem]">
            <CardHeader className="rounded-t-xl border-b border-surface-border bg-surface-panel-soft px-4 py-3 sm:rounded-t-[1.35rem] sm:px-5 sm:py-4">
              <div className="space-y-1.5">
                <SectionEyebrow>Structure</SectionEyebrow>
                <CardTitle className="text-base sm:text-lg">Type de produit</CardTitle>
                <CardDescription className="text-sm leading-6 text-foreground/70">
                  Choisissez la structure de départ du produit. Vous pourrez ensuite compléter le
                  reste dans l’éditeur.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="grid gap-4 px-4 py-4 sm:gap-5 sm:px-5 sm:py-5">
              <input type="hidden" name="name" value={nameValue} />
              <input type="hidden" name="slug" value={slugValue} />

              <AdminFormField
                label="Type de produit"
                htmlFor="new-product-type"
                required
                error={state.fieldErrors.productTypeCode}
              >
                <Select
                  name="productTypeCode"
                  value={productTypeCode}
                  onValueChange={setProductTypeCode}
                >
                  <SelectTrigger id="new-product-type" className="text-sm">
                    <SelectValue placeholder="Choisir un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypeOptions.map((option) => (
                      <SelectItem key={option.code} value={option.code}>
                        {getProductTypeLabel(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AdminFormField>
            </CardContent>
          </Card>
        )}
      </AdminFormShell>
    </form>
  );
}

export function ProductCreatePanel({
  action,
  productTypeOptions = [],
}: ProductCreateFormProps): JSX.Element {
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  return (
    <div className="min-h-0 flex-1">
      <ProductCreatePanelInner
        key={formInstanceKey}
        action={action}
        productTypeOptions={productTypeOptions}
        onReset={() => setFormInstanceKey((current) => current + 1)}
      />
    </div>
  );
}
