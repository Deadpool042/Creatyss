"use client";

import { type JSX, useActionState, useState } from "react";

import { useAutoSlug } from "@/entities/shared/slug/hooks/use-auto-slug";
import { AdminFormField, AdminFormMessage, AdminFormShell } from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  initialCreateProductActionState,
  type CreateProductActionState,
} from "@/features/admin/products/create/create-product.types";
import {
  PRODUCT_CREATE_PAGE_COPY,
  PRODUCT_CREATE_PANEL_COPY,
  PRODUCT_FORM_ACTIONS_COPY,
} from "@/features/admin/products/config";
import { ProductSectionEyebrow } from "@/features/admin/products/components/shared";

export type ProductCreateFormAction = (
  prevState: CreateProductActionState,
  formData: FormData
) => Promise<CreateProductActionState>;

type ProductCreateFormProps = {
  action: ProductCreateFormAction;
};

type ProductCreatePanelInnerProps = {
  action: ProductCreateFormAction;
  onReset: () => void;
};

function ProductCreatePanelInner({ action, onReset }: ProductCreatePanelInnerProps): JSX.Element {
  const [state, formAction, pending] = useActionState(action, initialCreateProductActionState);

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
    onReset();
  }

  return (
    <form action={formAction} className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <AdminFormShell
        title={PRODUCT_CREATE_PAGE_COPY.title}
        description={PRODUCT_CREATE_PANEL_COPY.description}
        footer={
          <>
            <Button
              variant="ghost"
              type="button"
              size="xs"
              className="h-8 rounded-full px-3 sm:h-9 sm:px-4"
              onClick={handleReset}
            >
              {PRODUCT_FORM_ACTIONS_COPY.reset}
            </Button>
            <Button
              type="submit"
              size="xs"
              className="h-8 rounded-full px-3 sm:h-9 sm:px-4"
              disabled={pending || nameValue.trim().length === 0 || slugValue.trim().length === 0}
            >
              {pending ? PRODUCT_CREATE_PANEL_COPY.createPending : PRODUCT_CREATE_PANEL_COPY.createButton}
            </Button>
          </>
        }
      >
        <AdminFormMessage
          tone={state.status === "success" ? "success" : "error"}
          message={state.status !== "idle" ? state.message : null}
        />

        <Card className="rounded-xl border border-surface-border-strong bg-surface-panel shadow-raised py-0 sm:rounded-[1.35rem]">
          <CardHeader className="rounded-t-xl border-b border-surface-border bg-surface-panel-soft px-4 py-3 sm:rounded-t-[1.35rem] sm:px-5 sm:py-4">
            <div className="space-y-1.5">
              <ProductSectionEyebrow className="text-[10px] sm:text-[11px]">
                {PRODUCT_CREATE_PANEL_COPY.identityEyebrow}
              </ProductSectionEyebrow>
              <CardTitle className="text-base sm:text-lg">{PRODUCT_CREATE_PANEL_COPY.identityTitle}</CardTitle>
              <CardDescription className="text-sm leading-6 text-foreground/70">
                {PRODUCT_CREATE_PANEL_COPY.identityCardDescription}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4 px-4 py-4 sm:gap-5 sm:px-5 sm:py-5">
            <AdminFormField
              label={PRODUCT_CREATE_PANEL_COPY.nameLabel}
              htmlFor="new-name"
              required
              error={state.fieldErrors.name}
            >
              <Input
                id="new-name"
                name="name"
                value={nameValue}
                onChange={(event) => setNameValue(event.target.value)}
                placeholder={PRODUCT_CREATE_PANEL_COPY.namePlaceholder}
                className="text-sm"
              />
            </AdminFormField>

            <AdminFormField
              label={PRODUCT_CREATE_PANEL_COPY.slugLabel}
              htmlFor="new-slug"
              required
              hint={PRODUCT_CREATE_PANEL_COPY.identitySlugHint}
              error={state.fieldErrors.slug}
            >
              <Input
                id="new-slug"
                name="slug"
                value={slugValue}
                onChange={(event) => setSlugValue(event.target.value)}
                placeholder={PRODUCT_CREATE_PANEL_COPY.slugPlaceholder}
                className="font-mono text-sm"
              />
            </AdminFormField>
          </CardContent>
        </Card>
      </AdminFormShell>
    </form>
  );
}

export function ProductCreatePanel({
  action,
}: ProductCreateFormProps): JSX.Element {
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  return (
    <div className="min-h-0 flex-1">
      <ProductCreatePanelInner
        key={formInstanceKey}
        action={action}
        onReset={() => setFormInstanceKey((current) => current + 1)}
      />
    </div>
  );
}
