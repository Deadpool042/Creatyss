"use client";

import { useActionState, useEffect } from "react";
import { Languages, PencilLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminFormActions } from "@/components/admin/forms/admin-form-actions";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { toast } from "@/components/shared";
import { cn } from "@/lib/utils";
import {
  setProductTranslationsAction,
  type ProductTranslationsFormState,
} from "@/features/admin/products/actions/set-product-translations.action";
import type { ProductTranslationFieldState } from "@/features/admin/products/queries/list-product-translations.query";

const INITIAL: ProductTranslationsFormState = { status: "idle", message: "" };

type ProductTranslationsFormProps = Readonly<{
  productId: string;
  targetLocaleName: string;
  fields: readonly ProductTranslationFieldState[];
}>;

/**
 * Section traductions de l'éditeur produit (généralisation `LocalizedValue`,
 * sujet dynamique `product`). Formulaire indépendant du formulaire général
 * du produit : les champs vides retombent sur la valeur source (locale par
 * défaut).
 */
export function ProductTranslationsForm({
  productId,
  targetLocaleName,
  fields,
}: ProductTranslationsFormProps) {
  const [state, action, isPending] = useActionState(setProductTranslationsAction, INITIAL);

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    else if (state.status === "error") toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="productId" value={productId} />

      {fields.map((field) => {
        const isTranslated = field.translatedValue !== null && field.translatedValue.trim() !== "";
        const inputId = `product-translation-${field.fieldName}`;

        return (
          <AdminFormField
            key={field.fieldName}
            label={field.label}
            htmlFor={inputId}
            description={
              <div className="flex flex-wrap items-center gap-2">
                <span>
                  Clé : <code className="font-mono">{field.fieldName}</code>
                </span>
                {isTranslated ? (
                  <Badge
                    variant="outline"
                    className="border-feedback-success-border/60 bg-feedback-success-surface/30 text-feedback-success-foreground"
                  >
                    Traduit
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    Fallback source
                  </Badge>
                )}
              </div>
            }
            className="rounded-2xl border border-surface-border/50 bg-surface-panel/40 p-4"
          >
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="rounded-2xl border border-surface-border/50 bg-surface-subtle/20 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Languages className="size-4 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">Source</p>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {field.sourceValue || "Aucune valeur source."}
                </p>
              </div>

              <div
                className={cn(
                  "rounded-2xl border p-3",
                  isTranslated
                    ? "border-feedback-success-border/40 bg-feedback-success-surface/10"
                    : "border-surface-border/50 bg-surface-panel/20"
                )}
              >
                <div className="mb-2 flex items-center gap-2">
                  <PencilLine className="size-4 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">
                    Traduction ({targetLocaleName})
                  </p>
                </div>
                {field.multiline ? (
                  <Textarea
                    id={inputId}
                    name={field.fieldName}
                    defaultValue={field.translatedValue ?? ""}
                    placeholder={`Traduction (${targetLocaleName})`}
                    rows={4}
                  />
                ) : (
                  <Input
                    id={inputId}
                    name={field.fieldName}
                    defaultValue={field.translatedValue ?? ""}
                    placeholder={`Traduction (${targetLocaleName})`}
                  />
                )}
              </div>
            </div>
          </AdminFormField>
        );
      })}

      <AdminFormActions>
        <p className="text-xs text-muted-foreground">
          Les champs vides utilisent automatiquement la valeur source.
        </p>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement…" : "Enregistrer les traductions"}
        </Button>
      </AdminFormActions>
    </form>
  );
}
