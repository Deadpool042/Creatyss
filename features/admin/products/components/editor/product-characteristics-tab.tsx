"use client";

import { useActionState, useState, type JSX } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductSectionEyebrow } from "@/features/admin/products/components/shared/product-section-eyebrow";
import {
  productCharacteristicsFormInitialState,
  type AdminProductEditorCharacteristic,
  type ProductCharacteristicsFormAction,
} from "@/features/admin/products/editor/types";
import { PRODUCT_CHARACTERISTICS_TAB_COPY } from "@/features/admin/products/config/product-editor.config";
import { PRODUCT_EDITOR_TAB_LAYOUT_CLASSNAME } from "@/features/admin/products/components/shared/product-module-page-shell";

const MAX_CHARACTERISTICS = 20;

type CharacteristicRow = {
  label: string;
  value: string;
};

type ProductCharacteristicsTabProps = {
  action: ProductCharacteristicsFormAction;
  productId: string;
  initialCharacteristics: AdminProductEditorCharacteristic[];
};

type ProductCharacteristicsSectionIntroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

function ProductCharacteristicsSectionIntro({
  eyebrow,
  title,
  description,
}: ProductCharacteristicsSectionIntroProps): JSX.Element {
  return (
    <div className="grid gap-1.5">
      <ProductSectionEyebrow>{eyebrow}</ProductSectionEyebrow>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function mapInitialCharacteristics(
  characteristics: AdminProductEditorCharacteristic[]
): CharacteristicRow[] {
  return [...characteristics]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({ label: c.label, value: c.value }));
}

type ProductCharacteristicsTabInnerProps = ProductCharacteristicsTabProps & {
  onReset: () => void;
};

function ProductCharacteristicsTabInner({
  action,
  productId,
  initialCharacteristics,
  onReset,
}: ProductCharacteristicsTabInnerProps): JSX.Element {
  const [state, formAction, pending] = useActionState(
    action,
    productCharacteristicsFormInitialState
  );

  const [rows, setRows] = useState<CharacteristicRow[]>(
    mapInitialCharacteristics(initialCharacteristics)
  );
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");

  const limitReached = rows.length >= MAX_CHARACTERISTICS;

  function handleMoveUp(index: number): void {
    if (index <= 0) return;
    setRows((current) => {
      const next = [...current];
      [next[index - 1], next[index]] = [next[index]!, next[index - 1]!];
      return next;
    });
  }

  function handleMoveDown(index: number): void {
    setRows((current) => {
      if (index >= current.length - 1) return current;
      const next = [...current];
      [next[index], next[index + 1]] = [next[index + 1]!, next[index]!];
      return next;
    });
  }

  function handleRemove(index: number): void {
    setRows((current) => current.filter((_, i) => i !== index));
  }

  function handleAdd(): void {
    const trimmedLabel = newLabel.trim();
    const trimmedValue = newValue.trim();
    if (trimmedLabel.length === 0 || trimmedValue.length === 0 || limitReached) return;
    setRows((current) => [...current, { label: trimmedLabel, value: trimmedValue }]);
    setNewLabel("");
    setNewValue("");
  }

  function handleRowLabelChange(index: number, value: string): void {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, label: value } : row)));
  }

  function handleRowValueChange(index: number, value: string): void {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, value } : row)));
  }

  function handleReset(): void {
    setRows(mapInitialCharacteristics(initialCharacteristics));
    setNewLabel("");
    setNewValue("");
    onReset();
  }

  return (
    <form action={formAction} className="relative">
      <input type="hidden" name="productId" value={productId} />

      {rows.map((row, index) => (
        <input
          key={`characteristicLabel:${index}`}
          type="hidden"
          name={`characteristicLabel:${index}`}
          value={row.label}
        />
      ))}
      {rows.map((row, index) => (
        <input
          key={`characteristicValue:${index}`}
          type="hidden"
          name={`characteristicValue:${index}`}
          value={row.value}
        />
      ))}

      <div className="pb-[calc(7rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-14">
        <div className={PRODUCT_EDITOR_TAB_LAYOUT_CLASSNAME}>
          <div className="min-w-0 space-y-5 md:space-y-6">
            <AdminFormMessage
              tone={state.status === "error" ? "error" : "success"}
              message={state.status !== "idle" ? state.message : null}
            />

            {state.fieldErrors.characteristics ? (
              <p className="rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 py-2 text-sm text-feedback-error-foreground">
                {state.fieldErrors.characteristics}
              </p>
            ) : null}

            <div className="divide-y divide-surface-border/40">
              <section className="grid gap-6 py-6 first:pt-0">
                <ProductCharacteristicsSectionIntro
                  eyebrow="Attributs produit"
                  title={PRODUCT_CHARACTERISTICS_TAB_COPY.sectionTitle}
                  description={PRODUCT_CHARACTERISTICS_TAB_COPY.sectionDescription}
                />

                {rows.length === 0 ? (
                  <div className="grid gap-2 rounded-xl border border-dashed border-surface-border bg-surface-panel-soft px-4 py-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      {PRODUCT_CHARACTERISTICS_TAB_COPY.emptyTitle}
                    </p>
                    <p className="leading-6">{PRODUCT_CHARACTERISTICS_TAB_COPY.emptyDescription}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rows.map((row, index) => {
                      const rowError = state.rowErrors[index];

                      return (
                        <div
                          key={index}
                          className="grid gap-3 border-t border-surface-border pt-4 first:border-t-0 first:pt-0"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-muted-foreground">
                              {PRODUCT_CHARACTERISTICS_TAB_COPY.rowOrderLabel(index)}
                            </span>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label={PRODUCT_CHARACTERISTICS_TAB_COPY.moveUpAriaLabel(index)}
                                disabled={index === 0}
                                onClick={() => handleMoveUp(index)}
                                className="h-7 w-7"
                              >
                                <ChevronUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label={PRODUCT_CHARACTERISTICS_TAB_COPY.moveDownAriaLabel(
                                  index
                                )}
                                disabled={index === rows.length - 1}
                                onClick={() => handleMoveDown(index)}
                                className="h-7 w-7"
                              >
                                <ChevronDown className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label={PRODUCT_CHARACTERISTICS_TAB_COPY.deleteAriaLabel(index)}
                                onClick={() => handleRemove(index)}
                                className="h-7 w-7"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                              <Label className="text-sm">
                                {PRODUCT_CHARACTERISTICS_TAB_COPY.labelFieldLabel}
                              </Label>
                              <Input
                                value={row.label}
                                onChange={(e) => handleRowLabelChange(index, e.target.value)}
                                placeholder={PRODUCT_CHARACTERISTICS_TAB_COPY.labelPlaceholder}
                                className="text-sm"
                              />
                              {rowError?.label ? (
                                <p className="text-xs text-feedback-error-foreground">
                                  {rowError.label}
                                </p>
                              ) : null}
                            </div>
                            <div className="grid gap-1.5">
                              <Label className="text-sm">
                                {PRODUCT_CHARACTERISTICS_TAB_COPY.valueFieldLabel}
                              </Label>
                              <Input
                                value={row.value}
                                onChange={(e) => handleRowValueChange(index, e.target.value)}
                                placeholder={PRODUCT_CHARACTERISTICS_TAB_COPY.valuePlaceholderEdit}
                                className="text-sm"
                              />
                              {rowError?.value ? (
                                <p className="text-xs text-feedback-error-foreground">
                                  {rowError.value}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="grid gap-6 py-6">
                <ProductCharacteristicsSectionIntro
                  eyebrow="Nouvelle caractéristique"
                  title={PRODUCT_CHARACTERISTICS_TAB_COPY.addTitle}
                />

                {limitReached ? (
                  <p className="rounded-lg border border-feedback-warning-border bg-feedback-warning-surface px-3 py-2 text-sm text-feedback-warning-foreground">
                    {PRODUCT_CHARACTERISTICS_TAB_COPY.limitReached}
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                    <div className="grid gap-1.5">
                      <Label className="text-sm">
                        {PRODUCT_CHARACTERISTICS_TAB_COPY.labelFieldLabel}
                      </Label>
                      <Input
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder={PRODUCT_CHARACTERISTICS_TAB_COPY.labelPlaceholder}
                        className="text-sm"
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-sm">
                        {PRODUCT_CHARACTERISTICS_TAB_COPY.valueFieldLabel}
                      </Label>
                      <Input
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder={PRODUCT_CHARACTERISTICS_TAB_COPY.valuePlaceholder}
                        className="text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAdd}
                        disabled={newLabel.trim().length === 0 || newValue.trim().length === 0}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {PRODUCT_CHARACTERISTICS_TAB_COPY.addButton}
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>

          <aside className="min-w-0 xl:sticky xl:top-6">
            <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/80">
              <section className="grid gap-4 px-5 py-5">
                <ProductCharacteristicsSectionIntro eyebrow="Repères" title="Conseils" />

                <div className="divide-y divide-surface-border">
                  <div className="grid gap-1.5 py-3 first:pt-0">
                    <ProductSectionEyebrow className="tracking-[0.14em]">
                      Contenu
                    </ProductSectionEyebrow>
                    <p className="text-sm font-medium text-foreground">Factuel et précis</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Renseignez uniquement des données objectives : matière, poids, dimensions,
                      composition, fermeture…
                    </p>
                  </div>

                  <div className="grid gap-1.5 py-3">
                    <ProductSectionEyebrow className="tracking-[0.14em]">
                      Ordre
                    </ProductSectionEyebrow>
                    <p className="text-sm font-medium text-foreground">
                      Du plus important au plus secondaire
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Les premières caractéristiques sont les plus visibles sur la fiche produit.
                    </p>
                  </div>

                  <div className="grid gap-1.5 py-3 last:pb-0">
                    <ProductSectionEyebrow className="tracking-[0.14em]">
                      Limite
                    </ProductSectionEyebrow>
                    <p className="text-sm font-medium text-foreground">
                      {rows.length} / {MAX_CHARACTERISTICS}
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Maximum 20 caractéristiques par produit.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>

      <AdminFormFooter
        actionsClassName="w-full justify-between gap-2 sm:w-auto sm:justify-end"
        overlay
      >
        <Button
          variant="ghost"
          type="button"
          size="xs"
          className="h-8 rounded-full px-4 text-muted-foreground hover:text-foreground lg:h-9"
          onClick={handleReset}
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

export function ProductCharacteristicsTab(props: ProductCharacteristicsTabProps): JSX.Element {
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  return (
    <ProductCharacteristicsTabInner
      key={formInstanceKey}
      {...props}
      onReset={() => setFormInstanceKey((current) => current + 1)}
    />
  );
}
