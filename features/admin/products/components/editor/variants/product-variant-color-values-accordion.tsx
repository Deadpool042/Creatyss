"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition, type JSX } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/shared";
import { AdminFormMessage } from "@/components/admin/forms";
import type {
  archiveProductOptionColorValueAction,
  createProductOptionColorValueAction,
  updateProductOptionColorValueAction,
} from "@/features/admin/products/editor/actions";
import type { AdminProductOptionItem } from "@/features/admin/products/editor/types";
import {
  isColorAxisOption,
  isValidColorHex,
  normalizeHexInput,
  toPickerValue,
} from "./color-utils";

type CreateProductOptionColorValueAction = typeof createProductOptionColorValueAction;
type UpdateProductOptionColorValueAction = typeof updateProductOptionColorValueAction;
type ArchiveProductOptionColorValueAction = typeof archiveProductOptionColorValueAction;

type MessageState = {
  status: "success" | "error";
  message: string;
} | null;

type ColorRowDraft = {
  label: string;
  colorHex: string;
};

type ProductVariantColorValuesAccordionProps = Readonly<{
  productId: string;
  productOptions?: AdminProductOptionItem[];
  createOptionColorValueAction?: CreateProductOptionColorValueAction;
  updateOptionColorValueAction?: UpdateProductOptionColorValueAction;
  archiveOptionColorValueAction?: ArchiveProductOptionColorValueAction;
}>;

export function ProductVariantColorValuesAccordion({
  productId,
  productOptions = [],
  createOptionColorValueAction,
  updateOptionColorValueAction,
  archiveOptionColorValueAction,
}: ProductVariantColorValuesAccordionProps): JSX.Element {
  const [messageState, setMessageState] = useState<MessageState>(null);
  const [rowDrafts, setRowDrafts] = useState<Record<string, ColorRowDraft>>({});
  const [newColorLabelByOptionId, setNewColorLabelByOptionId] = useState<Record<string, string>>(
    {}
  );
  const [newColorHexByOptionId, setNewColorHexByOptionId] = useState<Record<string, string>>({});
  const [isColorPending, startColorTransition] = useTransition();

  const colorOptions = useMemo(
    () => productOptions.filter((option) => option.isVariantAxis && isColorAxisOption(option)),
    [productOptions]
  );

  const colorValueSummary = useMemo(() => {
    const values = colorOptions.flatMap((option) =>
      option.values.map((value) => ({
        id: value.id,
        colorHex: value.colorHex,
      }))
    );
    const totalCount = values.length;
    const previewHexes = values
      .map((value) => value.colorHex?.trim().toUpperCase() ?? "")
      .filter((hex, index, list) => isValidColorHex(hex) && list.indexOf(hex) === index)
      .slice(0, 6);

    return { totalCount, previewHexes };
  }, [colorOptions]);

  function handleUpdateColorValue(optionValueId: string): void {
    if (!updateOptionColorValueAction) {
      return;
    }

    const draft = rowDrafts[optionValueId];
    if (!draft) {
      return;
    }

    startColorTransition(async () => {
      const result = await updateOptionColorValueAction({
        productId,
        optionValueId,
        label: draft.label,
        colorHex: draft.colorHex.trim().length > 0 ? draft.colorHex : null,
      });

      setMessageState(result);
      if (result.status === "success") {
        toast.success(result.message);
      }
    });
  }

  function handleArchiveColorValue(optionValueId: string): void {
    if (!archiveOptionColorValueAction) {
      return;
    }

    startColorTransition(async () => {
      const result = await archiveOptionColorValueAction({
        productId,
        optionValueId,
      });

      setMessageState(result);
      if (result.status === "success") {
        toast.success(result.message);
      }
    });
  }

  function handleCreateColorValue(optionId: string): void {
    if (!createOptionColorValueAction) {
      return;
    }

    const label = (newColorLabelByOptionId[optionId] ?? "").trim();
    const colorHexRaw = (newColorHexByOptionId[optionId] ?? "").trim();

    startColorTransition(async () => {
      const result = await createOptionColorValueAction({
        productId,
        optionId,
        label,
        colorHex: colorHexRaw.length > 0 ? colorHexRaw : null,
      });

      setMessageState(result);
      if (result.status === "success") {
        toast.success(result.message);
        setNewColorLabelByOptionId((prev) => ({ ...prev, [optionId]: "" }));
        setNewColorHexByOptionId((prev) => ({ ...prev, [optionId]: "" }));
      }
    });
  }

  return (
    <section className="rounded-[1.35rem] border border-surface-border bg-card shadow-card">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="color-values" className="border-b-0">
          <AccordionTrigger className="rounded-none px-4 py-3.5 hover:no-underline md:px-5 md:py-4">
            <div className="min-w-0 space-y-1 text-left">
              <p className="text-sm font-medium text-foreground">
                Valeurs couleur · {colorValueSummary.totalCount}
              </p>
              <p className="text-xs text-muted-foreground">Valeurs partagées entre variantes</p>
              {colorValueSummary.previewHexes.length > 0 ? (
                <div className="flex items-center gap-1 pt-0.5">
                  {colorValueSummary.previewHexes.map((hex) => (
                    <span
                      key={hex}
                      aria-hidden="true"
                      className="h-3.5 w-3.5 rounded-full border border-surface-border"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                  {colorValueSummary.totalCount > colorValueSummary.previewHexes.length ? (
                    <span className="pl-1 text-[11px] text-muted-foreground">
                      +{colorValueSummary.totalCount - colorValueSummary.previewHexes.length}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </AccordionTrigger>

          <AccordionContent className="h-fit border-t border-surface-border px-4 pb-4 pt-4 md:px-5 md:pb-5 md:pt-5">
            {messageState?.message ? (
              <AdminFormMessage
                tone={messageState.status === "error" ? "error" : "success"}
                message={messageState.message}
              />
            ) : null}

            <div className="space-y-5">
              {colorOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune option couleur active pour ce type produit.
                </p>
              ) : (
                colorOptions.map((option) => (
                  <section
                    key={option.id}
                    className="space-y-3 rounded-2xl border border-surface-border bg-surface-panel-soft p-3.5 md:p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{option.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Gérez le libellé et la couleur hex des valeurs disponibles.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {option.values.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Aucune valeur couleur active.
                        </p>
                      ) : (
                        option.values.map((value) => {
                          const draft = rowDrafts[value.id] ?? {
                            label: value.label ?? value.value,
                            colorHex: value.colorHex ?? "",
                          };
                          const normalizedHex = normalizeHexInput(draft.colorHex);
                          const isHexValid =
                            normalizedHex.length === 0 || isValidColorHex(normalizedHex);

                          return (
                            <div
                              key={value.id}
                              className="grid gap-2.5 rounded-xl border border-surface-border bg-background/70 p-3 md:grid-cols-[minmax(0,1fr)_8.5rem_7.5rem_auto] md:items-end"
                            >
                              <label className="grid gap-1 text-xs text-muted-foreground">
                                Libellé
                                <Input
                                  value={draft.label}
                                  onChange={(event) =>
                                    setRowDrafts((prev) => ({
                                      ...prev,
                                      [value.id]: {
                                        ...draft,
                                        label: event.target.value,
                                      },
                                    }))
                                  }
                                  className="h-9 text-sm"
                                />
                              </label>

                              <label className="grid gap-1 text-xs text-muted-foreground">
                                Couleur
                                <Input
                                  type="color"
                                  value={toPickerValue(normalizedHex)}
                                  onChange={(event) =>
                                    setRowDrafts((prev) => ({
                                      ...prev,
                                      [value.id]: {
                                        ...draft,
                                        colorHex: event.target.value.toUpperCase(),
                                      },
                                    }))
                                  }
                                  className="h-9 w-full p-1"
                                />
                              </label>

                              <label className="grid gap-1 text-xs text-muted-foreground">
                                Hex
                                <Input
                                  value={draft.colorHex}
                                  onChange={(event) =>
                                    setRowDrafts((prev) => ({
                                      ...prev,
                                      [value.id]: {
                                        ...draft,
                                        colorHex: normalizeHexInput(event.target.value),
                                      },
                                    }))
                                  }
                                  className="h-9 font-mono text-sm"
                                />
                              </label>

                              <div className="flex items-center gap-2 md:justify-end">
                                <span
                                  aria-hidden="true"
                                  className="h-4 w-4 rounded-full border border-surface-border"
                                  style={{
                                    backgroundColor: isValidColorHex(normalizedHex)
                                      ? normalizedHex
                                      : "transparent",
                                  }}
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  disabled={
                                    isColorPending ||
                                    !isHexValid ||
                                    draft.label.trim().length === 0 ||
                                    !updateOptionColorValueAction
                                  }
                                  onClick={() => handleUpdateColorValue(value.id)}
                                >
                                  Enregistrer
                                </Button>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  disabled={isColorPending || !archiveOptionColorValueAction}
                                  onClick={() => handleArchiveColorValue(value.id)}
                                  aria-label="Supprimer la couleur"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              {!isHexValid ? (
                                <p className="md:col-span-4 text-xs text-destructive">
                                  Code invalide: utilisez #RGB ou #RRGGBB.
                                </p>
                              ) : null}
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="grid gap-2.5 rounded-xl border border-dashed border-surface-border bg-background/70 p-3 md:grid-cols-[minmax(0,1fr)_8.5rem_auto] md:items-end">
                      <label className="grid gap-1 text-xs text-muted-foreground">
                        Nouvelle couleur (libellé)
                        <Input
                          value={newColorLabelByOptionId[option.id] ?? ""}
                          onChange={(event) =>
                            setNewColorLabelByOptionId((prev) => ({
                              ...prev,
                              [option.id]: event.target.value,
                            }))
                          }
                          placeholder="Ex. Cognac"
                          className="h-9 text-sm"
                        />
                      </label>

                      <label className="grid gap-1 text-xs text-muted-foreground">
                        Hex
                        <Input
                          value={newColorHexByOptionId[option.id] ?? ""}
                          onChange={(event) =>
                            setNewColorHexByOptionId((prev) => ({
                              ...prev,
                              [option.id]: normalizeHexInput(event.target.value),
                            }))
                          }
                          placeholder="#8B4513"
                          className="h-9 font-mono text-sm"
                        />
                      </label>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isColorPending || !createOptionColorValueAction}
                          onClick={() => handleCreateColorValue(option.id)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </section>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
