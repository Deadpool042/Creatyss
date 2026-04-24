"use client";

import { Fragment, useActionState, useMemo, useState, type JSX } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  productCharacteristicsFormInitialState,
  type AdminProductCharacteristicItem,
  type ProductCharacteristicsFormAction,
} from "@/features/admin/products/editor/types/product-characteristics-form.types";

type EditableCharacteristic = {
  key: string;
  id: string | null;
  label: string;
  value: string;
};

type ProductCharacteristicsTabProps = {
  action: ProductCharacteristicsFormAction;
  productId: string;
  initialCharacteristics: AdminProductCharacteristicItem[];
};

type ProductCharacteristicsTabInnerProps = ProductCharacteristicsTabProps & {
  onReset: () => void;
};

const MAX_CHARACTERISTICS = 20;
const SUGGESTED_CHARACTERISTIC_LABELS = [
  "Matière",
  "Dimensions",
  "Fermeture",
  "Porté",
  "Poches",
  "Entretien",
] as const;

function buildInitialRows(items: AdminProductCharacteristicItem[]): EditableCharacteristic[] {
  return [...items]
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((item) => ({
      key: item.id,
      id: item.id,
      label: item.label,
      value: item.value,
    }));
}

function moveRow(
  rows: readonly EditableCharacteristic[],
  index: number,
  direction: "up" | "down"
): EditableCharacteristic[] {
  const nextIndex = direction === "up" ? index - 1 : index + 1;

  if (nextIndex < 0 || nextIndex >= rows.length) {
    return [...rows];
  }

  const nextRows = [...rows];
  [nextRows[index], nextRows[nextIndex]] = [nextRows[nextIndex]!, nextRows[index]!];
  return nextRows;
}

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
  const initialRows = useMemo(
    () => buildInitialRows(initialCharacteristics),
    [initialCharacteristics]
  );
  const [rows, setRows] = useState<EditableCharacteristic[]>(initialRows);
  const [draftLabel, setDraftLabel] = useState("");
  const [draftValue, setDraftValue] = useState("");
  const [nextLocalRowId, setNextLocalRowId] = useState(initialRows.length);
  const hasReachedLimit = rows.length >= MAX_CHARACTERISTICS;
  const canAddRow = !hasReachedLimit;

  function appendRow(input: { label: string; value: string }): void {
    if (hasReachedLimit) {
      return;
    }

    setRows((current) => [
      ...current,
      {
        key: `new-characteristic-${nextLocalRowId}`,
        id: null,
        label: input.label,
        value: input.value,
      },
    ]);
    setNextLocalRowId((current) => current + 1);
  }

  function handleAddRow(): void {
    if (!canAddRow) {
      return;
    }

    appendRow({ label: draftLabel.trim(), value: draftValue.trim() });
    setDraftLabel("");
    setDraftValue("");
  }

  function handleAddSuggestion(label: string): void {
    appendRow({ label, value: "" });
  }

  function handleRemoveRow(index: number): void {
    setRows((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function handleUpdateRow(
    index: number,
    field: keyof Pick<EditableCharacteristic, "label" | "value">,
    value: string
  ): void {
    setRows((current) =>
      current.map((row, currentIndex) =>
        currentIndex === index ? { ...row, [field]: value } : row
      )
    );
  }

  function handleResetLocal(): void {
    setRows(initialRows);
    setDraftLabel("");
    setDraftValue("");
    onReset();
  }

  return (
    <form action={formAction} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <input type="hidden" name="productId" value={productId} />

      {rows.map((row, index) => (
        <Fragment key={row.key}>
          {row.id !== null ? <input type="hidden" name={`characteristicId:${index}`} value={row.id} /> : null}
          <input type="hidden" name={`characteristicLabel:${index}`} value={row.label} />
          <input type="hidden" name={`characteristicValue:${index}`} value={row.value} />
        </Fragment>
      ))}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(7rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-14">
        <div className="w-full space-y-6 px-4 py-4 md:space-y-7 md:px-6 md:py-6 lg:mx-auto lg:max-w-4xl lg:px-5 xl:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:py-3">
          <AdminFormMessage
            tone={state.status === "error" ? "error" : "success"}
            message={state.status !== "idle" ? state.message : null}
          />

          <AdminFormSection
            title="Caractéristiques produit"
            description="Renseignez les informations utiles pour la fiche produit : matière, dimensions, fermeture, composition, entretien, etc."
          >
            <div className="space-y-3 rounded-xl border border-surface-border bg-surface-panel-soft px-4 py-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium text-foreground">Ajouter une caractéristique</p>
                <p className="text-xs leading-5 text-muted-foreground">
                  Utilisez un libellé court et une valeur claire. Les caractéristiques seront
                  affichées dans cet ordre sur la fiche produit.
                </p>
                <p className="text-xs leading-5 text-muted-foreground">
                  Vous pouvez aussi ajouter une ligne vide puis compléter dans la liste.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
                <AdminFormField label="Libellé">
                  {(controlProps) => (
                    <Input
                      {...controlProps}
                      value={draftLabel}
                      onChange={(event) => setDraftLabel(event.target.value)}
                      placeholder="Ex : Matière"
                      maxLength={80}
                      className="h-9"
                    />
                  )}
                </AdminFormField>
                <AdminFormField label="Valeur">
                  {(controlProps) => (
                    <Input
                      {...controlProps}
                      value={draftValue}
                      onChange={(event) => setDraftValue(event.target.value)}
                      placeholder="Ex : Toile enduite imperméable"
                      maxLength={220}
                      className="h-9"
                    />
                  )}
                </AdminFormField>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddRow}
                  disabled={!canAddRow}
                  className="h-9 gap-1.5 md:self-end"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Ajouter
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs text-muted-foreground">Suggestions :</p>
                {SUGGESTED_CHARACTERISTIC_LABELS.map((label) => (
                  <Button
                    key={label}
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="h-7 rounded-full border border-surface-border px-3 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => handleAddSuggestion(label)}
                    disabled={hasReachedLimit}
                  >
                    + {label}
                  </Button>
                ))}
              </div>

              {hasReachedLimit ? (
                <p className="text-xs leading-5 text-muted-foreground">
                  Limite atteinte : 20 caractéristiques maximum.
                </p>
              ) : null}
            </div>

            {state.fieldErrors.characteristics ? (
              <p className="rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 py-2 text-xs leading-5 text-feedback-error-foreground">
                {state.fieldErrors.characteristics}
              </p>
            ) : null}

            {rows.length === 0 ? (
              <div className="rounded-xl border border-dashed border-surface-border bg-surface-subtle px-4 py-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Aucune caractéristique enregistrée.</p>
                <p className="mt-1 leading-6">
                  Ajoutez vos premières caractéristiques pour enrichir la fiche produit.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {rows.map((row, index) => (
                  <div
                    key={row.key}
                    className="space-y-3 rounded-xl border border-surface-border bg-card px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Ordre {index + 1}
                      </p>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setRows((current) => moveRow(current, index, "up"))}
                          disabled={index === 0}
                          aria-label={`Monter la caractéristique ${index + 1}`}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setRows((current) => moveRow(current, index, "down"))}
                          disabled={index === rows.length - 1}
                          aria-label={`Descendre la caractéristique ${index + 1}`}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveRow(index)}
                          aria-label={`Supprimer la caractéristique ${index + 1}`}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <AdminFormField label="Libellé" error={state.rowErrors[index]?.label}>
                        {(controlProps) => (
                          <Input
                            {...controlProps}
                            value={row.label}
                            onChange={(event) =>
                              handleUpdateRow(index, "label", event.target.value)
                            }
                            placeholder="Ex : Matière"
                            maxLength={80}
                            className="h-9"
                          />
                        )}
                      </AdminFormField>
                      <AdminFormField
                        label="Valeur"
                        error={state.rowErrors[index]?.value}
                      >
                        {(controlProps) => (
                          <Input
                            {...controlProps}
                            value={row.value}
                            onChange={(event) =>
                              handleUpdateRow(index, "value", event.target.value)
                            }
                            placeholder="Ex : Cuir pleine fleur"
                            maxLength={220}
                            className="h-9"
                          />
                        )}
                      </AdminFormField>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminFormSection>
        </div>
      </div>

      <AdminFormFooter
        actionsClassName="w-full justify-between gap-2 sm:w-auto sm:justify-end"
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
          onClick={handleResetLocal}
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
