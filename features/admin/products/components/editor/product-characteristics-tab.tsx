"use client";

import { useActionState, useState, type JSX } from "react";
import { Plus, Trash2 } from "lucide-react";

import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  productCharacteristicsFormInitialState,
  type AdminProductCharacteristicItem,
  type ProductCharacteristicsFormAction,
} from "@/features/admin/products/editor/types/product-characteristics-form.types";

type EditableCharacteristic = {
  /** Existing id or null for new rows */
  id: string | null;
  label: string;
  value: string;
  sortOrder: number;
};

type ProductCharacteristicsTabProps = {
  action: ProductCharacteristicsFormAction;
  productId: string;
  initialCharacteristics: AdminProductCharacteristicItem[];
};

function buildInitialRows(items: AdminProductCharacteristicItem[]): EditableCharacteristic[] {
  if (items.length === 0) {
    return [];
  }
  return items.map((item) => ({
    id: item.id,
    label: item.label,
    value: item.value,
    sortOrder: item.sortOrder,
  }));
}

export function ProductCharacteristicsTab({
  action,
  productId,
  initialCharacteristics,
}: ProductCharacteristicsTabProps): JSX.Element {
  const [state, formAction, pending] = useActionState(
    action,
    productCharacteristicsFormInitialState
  );
  const [rows, setRows] = useState<EditableCharacteristic[]>(() =>
    buildInitialRows(initialCharacteristics)
  );

  function addRow(): void {
    setRows((prev) => [...prev, { id: null, label: "", value: "", sortOrder: prev.length }]);
  }

  function removeRow(index: number): void {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRow(
    index: number,
    field: keyof Pick<EditableCharacteristic, "label" | "value">,
    value: string
  ): void {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  return (
    <form action={formAction} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <input type="hidden" name="productId" value={productId} />

      {/* Hidden fields for each row */}
      {rows.map((row, index) => (
        <span key={index}>
          {row.id !== null ? (
            <input type="hidden" name={`characteristicId:${index}`} value={row.id} />
          ) : null}
          <input type="hidden" name={`characteristicLabel:${index}`} value={row.label} />
          <input type="hidden" name={`characteristicValue:${index}`} value={row.value} />
          <input
            type="hidden"
            name={`characteristicSortOrder:${index}`}
            value={String(row.sortOrder)}
          />
        </span>
      ))}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <AdminFormSection
          title="Caractéristiques produit"
          description="Informations structurées sur le produit : matière, dimensions, fermeture, etc. Affichées sur la fiche produit en vitrine."
        >
          <div className="grid gap-3">
            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune caractéristique définie. Cliquez sur «&nbsp;Ajouter&nbsp;» pour commencer.
              </p>
            ) : (
              <div className="grid gap-2">
                {/* Header */}
                <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 px-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Libellé
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Valeur
                  </span>
                  <span className="sr-only">Actions</span>
                </div>

                {rows.map((row, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
                    <div>
                      <Label htmlFor={`char-label-${index}`} className="sr-only">
                        Libellé {index + 1}
                      </Label>
                      <Input
                        id={`char-label-${index}`}
                        value={row.label}
                        onChange={(e) => updateRow(index, "label", e.target.value)}
                        placeholder="ex: Matière"
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`char-value-${index}`} className="sr-only">
                        Valeur {index + 1}
                      </Label>
                      <Input
                        id={`char-value-${index}`}
                        value={row.value}
                        onChange={(e) => updateRow(index, "value", e.target.value)}
                        placeholder="ex: 100% cuir végétal"
                        className="h-9"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(index)}
                      aria-label={`Supprimer la ligne ${index + 1}`}
                      className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRow}
              className="mt-1 w-fit gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Ajouter une caractéristique
            </Button>
          </div>
        </AdminFormSection>
      </div>

      <AdminFormMessage
        tone={state.status === "error" ? "error" : "success"}
        message={state.status !== "idle" ? state.message : null}
      />
      <AdminFormFooter>
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
