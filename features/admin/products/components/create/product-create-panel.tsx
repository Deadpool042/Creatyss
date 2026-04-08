"use client";

import { type JSX, useActionState, useState } from "react";

import { useAutoSlug } from "@/entities/shared/slug/hooks/use-auto-slug";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminFormShell } from "@/components/admin/forms/admin-form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";

export type ProductCreateFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<"name" | "slug" | "shortDescription" | "status", string>>;
};

export const productCreateFormInitialState: ProductCreateFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductCreateFormAction = (
  prevState: ProductCreateFormState,
  formData: FormData
) => Promise<ProductCreateFormState>;

type ProductCreateFormProps = {
  action: ProductCreateFormAction;
};

type ProductCreatePanelInnerProps = {
  action: ProductCreateFormAction;
  onReset: () => void;
};

function ProductCreatePanelInner({ action, onReset }: ProductCreatePanelInnerProps): JSX.Element {
  const [state, formAction, pending] = useActionState(action, productCreateFormInitialState);

  const {
    sourceValue: nameValue,
    slugValue,
    setSourceValue: setNameValue,
    setSlugValue,
  } = useAutoSlug({
    initialSourceValue: "",
    initialSlugValue: "",
  });

  return (
    <form action={formAction} className="h-full">
      <AdminFormShell
        backHref="/admin/products"
        backLabel="Retour"
        title="Nouveau produit"
        description="Ajouter un produit au catalogue"
        footer={
          <>
            <Button variant="ghost" type="button" size="sm" onClick={onReset}>
              Réinitialiser
            </Button>

            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Création…" : "Créer le produit"}
            </Button>
          </>
        }
      >
        <AdminFormMessage tone="error" message={state.status === "error" ? state.message : null} />

        <AdminFormSection
          title="Informations générales"
          description="Renseigne les informations minimales nécessaires pour créer le produit."
        >
          <AdminFormField
            label="Nom du produit"
            htmlFor="new-name"
            required
            error={state.fieldErrors.name}
          >
            <Input
              id="new-name"
              name="name"
              value={nameValue}
              onChange={(event) => setNameValue(event.target.value)}
              placeholder="Ex. Chemise en lin blanc"
              className="text-sm"
            />
          </AdminFormField>

          <AdminFormField
            label="Slug"
            htmlFor="new-slug"
            required
            hint="Généré automatiquement depuis le nom. Tu peux le modifier."
            error={state.fieldErrors.slug}
          >
            <Input
              id="new-slug"
              name="slug"
              value={slugValue}
              onChange={(event) => setSlugValue(event.target.value)}
              placeholder="chemise-lin-blanc"
              className="font-mono text-sm"
            />
          </AdminFormField>

          <AdminFormField
            label="Courte description"
            htmlFor="new-short-description"
            error={state.fieldErrors.shortDescription}
          >
            <Textarea
              id="new-short-description"
              name="shortDescription"
              placeholder="Une phrase qui résume ce produit..."
              rows={3}
              className="resize-none text-sm"
            />
          </AdminFormField>
        </AdminFormSection>

        <AdminFormSection
          title="Publication"
          description="Définis le statut initial du produit avant sa mise en ligne."
        >
          <AdminFormField
            label="Statut initial"
            htmlFor="new-status"
            error={state.fieldErrors.status}
          >
            <Select name="status" defaultValue="draft">
              <SelectTrigger id="new-status" className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Brouillon — visible uniquement par les admins</SelectItem>
                <SelectItem value="published">Publié — visible sur la boutique</SelectItem>
              </SelectContent>
            </Select>
          </AdminFormField>
        </AdminFormSection>
      </AdminFormShell>
    </form>
  );
}

export function ProductCreatePanel({ action }: ProductCreateFormProps): JSX.Element {
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  return (
    <ProductCreatePanelInner
      key={formInstanceKey}
      action={action}
      onReset={() => setFormInstanceKey((current) => current + 1)}
    />
  );
}
