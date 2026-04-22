"use client";

import { useActionState, useMemo, useState, type JSX } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  productRelatedProductsFormInitialState,
  type AdminProductEditorData,
  type AdminRelatedProductEditorType,
  type ProductRelatedProductsFormAction,
} from "@/features/admin/products/editor/public";

export type RelatedProductOption = {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "active" | "inactive" | "archived";
};

type ProductRelatedProductsTabProps = {
  action: ProductRelatedProductsFormAction;
  product: AdminProductEditorData;
  relatedProductOptions: RelatedProductOption[];
};

type EditableRelatedProduct = {
  targetProductId: string;
  targetProductName: string;
  targetProductSlug: string;
  type: AdminRelatedProductEditorType;
  sortOrder: string;
};

const relatedTypeLabels: Record<AdminRelatedProductEditorType, string> = {
  related: "À découvrir aussi",
  cross_sell: "Compléter avec",
  up_sell: "Version premium",
  accessory: "Accessoire",
  similar: "Alternative similaire",
};

const relatedTypeTooltips: Record<AdminRelatedProductEditorType, string> = {
  related: "Produit que le client pourrait aussi aimer.",
  cross_sell:
    "Produit qui complète naturellement cet article (ex : housse pour un appareil photo).",
  up_sell: "Version plus complète ou haut de gamme de ce produit.",
  accessory: "Accessoire conçu pour fonctionner avec ce produit.",
  similar: "Produit comparable, utile si celui-ci est indisponible.",
};

const relatedTypeOptions: readonly AdminRelatedProductEditorType[] = [
  "related",
  "cross_sell",
  "up_sell",
  "accessory",
  "similar",
];

const productStatusLabels: Record<RelatedProductOption["status"], string> = {
  draft: "Brouillon",
  active: "Actif",
  inactive: "Inactif",
  archived: "Archivé",
};

const productStatusWarnings: Partial<Record<RelatedProductOption["status"], string>> = {
  draft: "Ce produit est en brouillon — il ne sera pas visible par les clients.",
  inactive: "Ce produit est inactif — il ne sera pas visible par les clients.",
  archived: "Ce produit est archivé — cette association ne sera pas exploitable en vitrine.",
};

function parseNonNegativeInteger(value: string): number {
  const normalized = value.trim();

  if (!/^\d+$/.test(normalized)) {
    return 0;
  }

  return Number(normalized);
}

function mapEditorRelatedProducts(
  product: AdminProductEditorData["product"]
): EditableRelatedProduct[] {
  return product.relatedProducts
    .map((link) => ({
      targetProductId: link.targetProductId,
      targetProductName: link.targetProductName,
      targetProductSlug: link.targetProductSlug,
      type: link.type,
      sortOrder: String(link.sortOrder),
    }))
    .sort(
      (left, right) =>
        parseNonNegativeInteger(left.sortOrder) - parseNonNegativeInteger(right.sortOrder)
    );
}

function nextSortOrder(links: readonly EditableRelatedProduct[]): string {
  if (links.length === 0) {
    return "0";
  }

  const maxSortOrder = links.reduce(
    (current, link) => Math.max(current, parseNonNegativeInteger(link.sortOrder)),
    0
  );

  return String(maxSortOrder + 1);
}

export function ProductRelatedProductsTab({
  action,
  product,
  relatedProductOptions,
}: ProductRelatedProductsTabProps): JSX.Element {
  const [state, formAction, pending] = useActionState(
    action,
    productRelatedProductsFormInitialState
  );

  const initialLinks = mapEditorRelatedProducts(product.product);

  const [links, setLinks] = useState<EditableRelatedProduct[]>(initialLinks);
  const [newType, setNewType] = useState<AdminRelatedProductEditorType>("related");
  const [newSortOrder, setNewSortOrder] = useState<string>(nextSortOrder(initialLinks));
  const [newTargetProductId, setNewTargetProductId] = useState<string>("");

  const optionsById = useMemo(
    () => new Map(relatedProductOptions.map((option) => [option.id, option])),
    [relatedProductOptions]
  );

  const linkedTargetIds = useMemo(
    () => new Set(links.map((link) => link.targetProductId)),
    [links]
  );

  const addableOptions = useMemo(
    () => relatedProductOptions.filter((option) => !linkedTargetIds.has(option.id)),
    [relatedProductOptions, linkedTargetIds]
  );

  const hasInvalidSortOrder = useMemo(
    () => links.some((link) => !/^\d+$/.test(link.sortOrder.trim())),
    [links]
  );

  const resolvedNewTargetProductId =
    newTargetProductId.length > 0 &&
    addableOptions.some((option) => option.id === newTargetProductId)
      ? newTargetProductId
      : (addableOptions[0]?.id ?? "");

  function handleUpdateType(
    targetProductId: string,
    nextType: AdminRelatedProductEditorType
  ): void {
    setLinks((current) =>
      current.map((link) =>
        link.targetProductId === targetProductId ? { ...link, type: nextType } : link
      )
    );
  }

  function handleUpdateSortOrder(targetProductId: string, nextSortOrderValue: string): void {
    if (nextSortOrderValue.length > 0 && !/^\d+$/.test(nextSortOrderValue)) {
      return;
    }

    setLinks((current) =>
      current.map((link) =>
        link.targetProductId === targetProductId ? { ...link, sortOrder: nextSortOrderValue } : link
      )
    );
  }

  function handleRemove(targetProductId: string): void {
    setLinks((current) => current.filter((link) => link.targetProductId !== targetProductId));
  }

  function handleMoveUp(index: number): void {
    if (index <= 0) return;
    setLinks((current) => {
      const next = [...current];
      const prevSortOrder = next[index - 1]!.sortOrder;
      const currSortOrder = next[index]!.sortOrder;
      next[index - 1] = { ...next[index - 1]!, sortOrder: currSortOrder };
      next[index] = { ...next[index]!, sortOrder: prevSortOrder };
      [next[index - 1], next[index]] = [next[index]!, next[index - 1]!];
      return next;
    });
  }

  function handleMoveDown(index: number): void {
    setLinks((current) => {
      if (index >= current.length - 1) return current;
      const next = [...current];
      const nextSortOrderVal = next[index + 1]!.sortOrder;
      const currSortOrder = next[index]!.sortOrder;
      next[index + 1] = { ...next[index + 1]!, sortOrder: currSortOrder };
      next[index] = { ...next[index]!, sortOrder: nextSortOrderVal };
      [next[index], next[index + 1]] = [next[index + 1]!, next[index]!];
      return next;
    });
  }

  function handleAdd(): void {
    if (
      resolvedNewTargetProductId.length === 0 ||
      linkedTargetIds.has(resolvedNewTargetProductId)
    ) {
      return;
    }

    const targetOption = optionsById.get(resolvedNewTargetProductId);

    if (!targetOption) {
      return;
    }

    const normalizedSortOrder = /^\d+$/.test(newSortOrder.trim())
      ? newSortOrder.trim()
      : nextSortOrder(links);

    setLinks((current) => [
      ...current,
      {
        targetProductId: targetOption.id,
        targetProductName: targetOption.name,
        targetProductSlug: targetOption.slug,
        type: newType,
        sortOrder: normalizedSortOrder,
      },
    ]);

    setNewSortOrder(String(parseNonNegativeInteger(normalizedSortOrder) + 1));
  }

  function handleReset(): void {
    setLinks(initialLinks);
    setNewType("related");
    setNewSortOrder(nextSortOrder(initialLinks));
    setNewTargetProductId("");
  }

  return (
    <form action={formAction} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <input type="hidden" name="productId" value={product.product.id} />

      {links.map((link) => (
        <input
          key={`related-product-id:${link.targetProductId}`}
          type="hidden"
          name="relatedProductIds"
          value={link.targetProductId}
        />
      ))}
      {links.map((link) => (
        <input
          key={`related-product-type:${link.targetProductId}`}
          type="hidden"
          name={`relatedProductType:${link.targetProductId}`}
          value={link.type}
        />
      ))}
      {links.map((link) => (
        <input
          key={`related-product-sort-order:${link.targetProductId}`}
          type="hidden"
          name={`relatedProductSortOrder:${link.targetProductId}`}
          value={link.sortOrder}
        />
      ))}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(7rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-14">
        <div className="w-full space-y-6 px-4 py-4 md:space-y-7 md:px-6 md:py-6 lg:mx-auto lg:max-w-4xl lg:px-5 xl:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:py-3">
          <AdminFormMessage
            tone={state.status === "error" ? "error" : "success"}
            message={state.status !== "idle" ? state.message : null}
          />

          <AdminFormSection
            title="Relations enregistrées"
            description="Ces associations suggèrent d’autres produits aux clients lors de la navigation ou de l’achat."
          >
            {links.length === 0 ? (
              <p className="rounded-xl border border-dashed border-surface-border bg-surface-panel-soft px-4 py-3 text-sm text-muted-foreground">
                Aucune relation enregistrée pour ce produit.
              </p>
            ) : (
              <div className="space-y-3">
                {links.map((link, index) => {
                  const productOption = optionsById.get(link.targetProductId);
                  const productStatus = productOption
                    ? productStatusLabels[productOption.status]
                    : null;
                  const statusWarning = productOption
                    ? (productStatusWarnings[productOption.status] ?? null)
                    : null;

                  return (
                    <div
                      key={link.targetProductId}
                      className="space-y-3 rounded-xl border border-surface-border bg-card p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {link.targetProductName}
                        </p>
                        <Badge variant="outline">{relatedTypeLabels[link.type]}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        /{link.targetProductSlug}
                        {productOption && productOption.status !== "active"
                          ? ` · ${productStatus}`
                          : ""}
                      </p>

                      {statusWarning !== null ? (
                        <p className="flex items-start gap-1.5 rounded-lg border border-feedback-warning-border bg-feedback-warning-surface px-3 py-2 text-xs leading-5 text-feedback-warning-foreground">
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {statusWarning}
                        </p>
                      ) : null}

                      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
                        <TooltipProvider>
                          <Tooltip>
                            <AdminFormField label="Type de relation">
                              <Select
                                value={link.type}
                                onValueChange={(value) =>
                                  handleUpdateType(
                                    link.targetProductId,
                                    value as AdminRelatedProductEditorType
                                  )
                                }
                              >
                                <TooltipTrigger asChild>
                                  <SelectTrigger className="text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                </TooltipTrigger>
                                <SelectContent>
                                  {relatedTypeOptions.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {relatedTypeLabels[type]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </AdminFormField>
                            <TooltipContent side="top">
                              {relatedTypeTooltips[link.type]}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <div className="flex items-end gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label="Monter"
                            disabled={index === 0}
                            onClick={() => handleMoveUp(index)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label="Descendre"
                            disabled={index === links.length - 1}
                            onClick={() => handleMoveDown(index)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleRemove(link.targetProductId)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Retirer
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AdminFormSection>

          <AdminFormSection
            title="Ajouter une relation"
            description="Choisissez un produit et la façon dont il est lié à cet article."
          >
            <div
              data-testid="product-related-add-section"
              className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_140px_auto]"
            >
              <AdminFormField
                label="Produit à lier"
                hint="Seuls les produits non encore associés à cet article sont proposés."
              >
                <Select value={resolvedNewTargetProductId} onValueChange={setNewTargetProductId}>
                  <SelectTrigger className="text-sm">
                    <SelectValue
                      placeholder={
                        addableOptions.length > 0
                          ? "Sélectionner un produit"
                          : "Tous les produits disponibles sont déjà liés"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {addableOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div className="flex flex-col gap-0.5 py-0.5">
                          <span className="font-medium leading-tight">{option.name}</span>
                          <span className="text-xs leading-tight text-muted-foreground">
                            /{option.slug}
                            {option.status !== "active"
                              ? ` · ${productStatusLabels[option.status]}`
                              : ""}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AdminFormField>

              <TooltipProvider>
                <Tooltip>
                  <AdminFormField label="Type de relation">
                    <Select
                      value={newType}
                      onValueChange={(value) => setNewType(value as AdminRelatedProductEditorType)}
                    >
                      <TooltipTrigger asChild>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                      </TooltipTrigger>
                      <SelectContent>
                        {relatedTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {relatedTypeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AdminFormField>
                  <TooltipContent side="top">{relatedTypeTooltips[newType]}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <AdminFormField
                label="Ordre d’affichage"
                hint="Position dans la liste des suggestions (0 = en premier)."
              >
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={newSortOrder}
                  onChange={(event) => {
                    if (event.target.value.length > 0 && !/^\d+$/.test(event.target.value)) {
                      return;
                    }
                    setNewSortOrder(event.target.value);
                  }}
                  className="text-sm font-mono"
                />
              </AdminFormField>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAdd}
                  disabled={resolvedNewTargetProductId.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </div>
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
          onClick={handleReset}
        >
          Réinitialiser
        </Button>

        <Button
          type="submit"
          variant="outline"
          size="xs"
          className="h-8 w-fit rounded-full border-shell-border px-4 text-foreground shadow-none sm:flex-none lg:h-9"
          disabled={pending || hasInvalidSortOrder}
        >
          {pending ? "Mise à jour…" : "Enregistrer"}
        </Button>
      </AdminFormFooter>
    </form>
  );
}
