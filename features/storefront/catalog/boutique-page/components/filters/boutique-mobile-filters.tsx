"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Settings2Icon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useBoutiqueFilterState } from "@/features/storefront/catalog/boutique-page/hooks/use-boutique-filter-state";
import { buildCategoryGroups } from "@/features/storefront/catalog/boutique-page/model/category-group.utils";
import { eurosInputToCents } from "@/features/storefront/catalog/boutique-page/model/price-input-utils";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";
import { cn } from "@/lib/utils";

type BoutiqueMobileFiltersProps = {
  model: BoutiquePageViewModel;
  label?: string;
  className?: string;
  triggerTestId?: string;
};

type BoutiqueFilterOptionProps = {
  inputId: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  type: "radio" | "checkbox";
  indicator?: "dot" | "square";
  helperText?: string;
};

function BoutiqueFilterOption({
  inputId,
  name,
  value,
  label,
  checked,
  onChange,
  type,
  indicator = "dot",
  helperText,
}: BoutiqueFilterOptionProps) {
  const inputFieldId = `${inputId}-field`;

  return (
    <label
      id={inputId}
      htmlFor={inputFieldId}
      tabIndex={0}
      onClick={(event) => {
        event.preventDefault();
        onChange();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onChange();
        }
      }}
      className="group grid w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-0.5 rounded-lg p-1.5 text-sm text-text-muted-strong transition-colors hover:bg-surface-panel/20 hover:text-foreground active:bg-surface-panel/30 focus-within:bg-surface-panel/20 focus-within:outline-none data-[checked=true]:text-foreground"
      data-checked={checked ? "true" : "false"}
    >
      <input
        id={inputFieldId}
        checked={checked}
        className="sr-only"
        name={name}
        onChange={onChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onChange();
          }
        }}
        type={type}
        value={value}
      />

      <span
        aria-hidden="true"
        className={cn(
          "flex h-3.5 w-3.5 shrink-0 mt-0.5 items-center justify-center border shadow-control transition group-focus-within:ring-2 group-focus-within:ring-focus-ring/50",
          indicator === "square" ? "rounded-sm" : "rounded-full",
          checked
            ? indicator === "square"
              ? "border-brand bg-brand"
              : "border-brand"
            : "border-control-border"
        )}
      >
        {checked && indicator === "dot" ? (
          <span className="size-1.5 rounded-full bg-brand" />
        ) : null}
        {checked && indicator === "square" ? (
          <Check className="size-2.5 stroke-3 text-white" />
        ) : null}
      </span>

      <span
        className={cn(
          "pr-1 text-sm leading-[1.35]",
          checked ? "font-medium text-foreground" : "text-text-muted-strong"
        )}
      >
        {label}
      </span>

      {helperText ? (
        <span className="col-start-2 m-0 text-[0.6875rem] leading-[1.35] text-text-muted-strong">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}

export function BoutiqueMobileFilters({
  model,
  label = "Filtres",
  className,
  triggerTestId,
}: BoutiqueMobileFiltersProps) {
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const {
    selectedCategorySlugs,
    selectedAvailability,
    selectedMinPriceEuros,
    selectedMaxPriceEuros,
    toggleCategory,
    setSelectedAvailability,
    setSelectedMinPriceEuros,
    setSelectedMaxPriceEuros,
    resultCount,
    countFetchFailed,
    buildApplyHref,
    resetState,
  } = useBoutiqueFilterState({ model });

  const resultLabel = countFetchFailed
    ? "Voir les résultats"
    : `Voir ${resultCount} résultat${resultCount > 1 ? "s" : ""}`;

  const submitCurrentFilters = () => {
    setIsOpen(false);
    router.push(buildApplyHref());
  };

  return (
    <Drawer direction="bottom" modal open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button type="button" className={className} data-testid={triggerTestId}>
          <Settings2Icon aria-hidden="true" />
          {label}
        </button>
      </DrawerTrigger>

      <DrawerContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          closeButtonRef.current?.focus();
        }}
        className="h-full rounded-t-2xl border-brand bg-surface-floating/92 shadow-floating p-0 backdrop-blur-xl"
      >
        <DrawerHeader className="flex items-center justify-between border-b border-shell-border/70 px-4 py-3">
          <div className="grid gap-0.5">
            <DrawerTitle>Filtres</DrawerTitle>
            <DrawerDescription className="sr-only">
              Filtrez les produits par catégorie, disponibilité et tarif.
            </DrawerDescription>
          </div>

          <DrawerClose asChild>
            <Button
              ref={closeButtonRef}
              aria-label="Fermer les filtres"
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <form
          action="/boutique"
          method="get"
          onSubmit={(event) => {
            event.preventDefault();
            submitCurrentFilters();
          }}
          className="grid gap-3 overflow-y-auto px-4 pt-[0.65rem] pb-3"
        >
          <input type="hidden" name="q" value={model.searchQuery} />
          <input type="hidden" name="sort" value={model.selectedSort} />

          <fieldset className="grid gap-1.5">
            <legend className="m-0 text-xs font-semibold tracking-[0.08em] uppercase text-text-muted-strong">
              Catégories
            </legend>

            <div className="grid max-h-[clamp(7.25rem,24dvh,11rem)] grid-cols-1 gap-0.5 overflow-y-auto px-1 py-0.5">
              <BoutiqueFilterOption
                inputId="boutique-filter-category-all"
                name="category-all"
                value=""
                label="Tous les produits"
                checked={selectedCategorySlugs.length === 0}
                onChange={() => toggleCategory("", [])}
                type="radio"
                indicator="dot"
              />

              {buildCategoryGroups(model.filterCategories).map(({ parent, children }) => (
                <div key={parent.id}>
                  <BoutiqueFilterOption
                    inputId={`boutique-filter-category-${parent.slug}`}
                    name="category"
                    value={parent.slug}
                    label={parent.name}
                    checked={selectedCategorySlugs.includes(parent.slug)}
                    onChange={() =>
                      toggleCategory(
                        parent.slug,
                        children.map((c) => c.slug)
                      )
                    }
                    type="checkbox"
                    indicator="square"
                  />
                  {children.length > 0 ? (
                    <div className="pl-5">
                      {children.map((child) => (
                        <BoutiqueFilterOption
                          key={child.id}
                          inputId={`boutique-filter-category-${child.slug}`}
                          name="category"
                          value={child.slug}
                          label={child.name}
                          checked={selectedCategorySlugs.includes(child.slug)}
                          onChange={() => toggleCategory(child.slug, [], parent.slug)}
                          type="checkbox"
                          indicator="square"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <p className="-mt-[0.05rem] text-[0.6875rem] leading-[1.3] text-text-muted-strong">
              Disponibilité et prix se règlent plus bas.
            </p>
          </fieldset>

          <fieldset className="grid gap-1.5 border-t border-shell-border/60 pt-[0.65rem]">
            <legend className="m-0 text-xs font-semibold tracking-[0.08em] uppercase text-text-muted-strong">
              Disponibilité
            </legend>

            <p className="m-0 text-[0.6875rem] leading-[1.35] text-text-muted-strong">
              Choisissez un seul statut de disponibilité.
            </p>

            <div role="radiogroup" aria-label="Disponibilité" className="grid gap-0.5">
              <BoutiqueFilterOption
                inputId="boutique-filter-availability-all"
                name="availability-selection"
                value=""
                label="Toutes les disponibilités"
                checked={selectedAvailability === ""}
                onChange={() => setSelectedAvailability("")}
                type="radio"
                indicator="dot"
              />

              {model.availabilityOptions.map((option) => (
                <BoutiqueFilterOption
                  key={option.id}
                  inputId={`boutique-filter-availability-${option.id}`}
                  name="availability-selection"
                  value={option.id}
                  label={option.label}
                  checked={selectedAvailability === option.id}
                  onChange={() => setSelectedAvailability(option.id)}
                  type="radio"
                  indicator="dot"
                />
              ))}
            </div>
          </fieldset>

          <section className="grid gap-1.5 border-t border-shell-border/60 pt-[0.65rem]">
            <p className="m-0 text-xs font-semibold tracking-[0.08em] uppercase text-text-muted-strong">
              Prix
            </p>
            <p className="m-0 text-[0.6875rem] leading-[1.35] text-text-muted-strong">
              Montants en euros (entiers)
            </p>

            <div className="grid grid-cols-2 gap-2">
              <label
                className="grid gap-1 text-xs text-text-muted-strong"
                htmlFor="boutique-filter-min-price"
              >
                Prix minimum
                <input
                  id="boutique-filter-min-price"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex : 50"
                  value={selectedMinPriceEuros}
                  onChange={(event) => setSelectedMinPriceEuros(event.currentTarget.value)}
                  className="h-9 rounded-lg border border-control-border bg-control-surface px-2.5 text-sm text-foreground shadow-control outline-none transition-all hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50"
                />
              </label>

              <label
                className="grid gap-1 text-xs text-text-muted-strong"
                htmlFor="boutique-filter-max-price"
              >
                Prix maximum
                <input
                  id="boutique-filter-max-price"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex : 200"
                  value={selectedMaxPriceEuros}
                  onChange={(event) => setSelectedMaxPriceEuros(event.currentTarget.value)}
                  className="h-9 rounded-lg border border-control-border bg-control-surface px-2.5 text-sm text-foreground shadow-control outline-none transition-all hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50"
                />
              </label>
            </div>

            {selectedMinPriceEuros.trim() !== "" || selectedMaxPriceEuros.trim() !== "" ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedMinPriceEuros("");
                  setSelectedMaxPriceEuros("");
                }}
                className="w-fit text-[0.6875rem] text-text-muted-soft underline-offset-2 transition-colors hover:text-foreground hover:underline"
              >
                Effacer le prix
              </button>
            ) : null}
          </section>

          {selectedAvailability !== "" ? (
            <input type="hidden" name="availability" value={selectedAvailability} />
          ) : null}

          {(() => {
            const minCents = eurosInputToCents(selectedMinPriceEuros);
            const maxCents = eurosInputToCents(selectedMaxPriceEuros);
            const safeMin =
              minCents !== null && maxCents !== null && minCents > maxCents ? maxCents : minCents;
            const safeMax =
              minCents !== null && maxCents !== null && minCents > maxCents ? minCents : maxCents;
            return (
              <>
                {safeMin !== null ? (
                  <input type="hidden" name="minPrice" value={String(safeMin)} />
                ) : null}
                {safeMax !== null ? (
                  <input type="hidden" name="maxPrice" value={String(safeMax)} />
                ) : null}
              </>
            );
          })()}

          <div className="sticky bottom-0 z-10 grid gap-1.5 border-t border-shell-border/70 bg-surface-floating/96 pt-2 pb-3 backdrop-blur-md">
            <span aria-live="polite" aria-atomic="true" className="sr-only">
              {resultLabel}
            </span>
            <Button type="submit" className="h-10">
              {resultLabel}
            </Button>

            <button
              type="button"
              onClick={() => {
                resetState();
                requestAnimationFrame(() => {
                  setIsOpen(false);
                  router.push(model.resetHref);
                });
              }}
              className="inline-flex h-8 items-center justify-center text-xs text-text-muted-strong underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
