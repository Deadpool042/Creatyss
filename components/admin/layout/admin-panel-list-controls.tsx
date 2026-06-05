"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { buildAdminFilterHref } from "./admin-build-filter-href";

export type AdminPanelListControlStatusOption = Readonly<{
  value: string;
  label: string;
}>;

type AdminPanelListControlsProps = Readonly<{
  listPath: string;
  searchPlaceholder: string;
  statusOptions: readonly AdminPanelListControlStatusOption[];
  allStatusLabel?: string;
  density?: "default" | "compact";
  filterAriaLabel?: string;
  searchInputClassName?: string;
  selectTriggerSize?: "sm" | "default";
}>;

export function AdminPanelListControls({
  listPath,
  searchPlaceholder,
  statusOptions,
  allStatusLabel = "Tous les statuts",
  density = "default",
  filterAriaLabel = "Filtrer la liste",
  searchInputClassName,
  selectTriggerSize = "default",
}: AdminPanelListControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "";
  const isCompact = density === "compact";
  const rootClassName = isCompact ? "flex flex-col gap-1.5 " : "grid gap-2";
  const inputClassName = cn(isCompact && "h-8 text-sm", searchInputClassName);
  const resolvedSelectTriggerSize = isCompact ? "sm" : selectTriggerSize;
  const selectTriggerClassName = isCompact ? "h-8 w-full text-sm" : "w-full";
  const activeFiltersCount = currentStatus ? 1 : 0;
  const mobileToolbarInputClassName = cn(
    "h-10 rounded-xl border-control-border/80 bg-surface-panel/80 px-3.5 text-sm shadow-control placeholder:text-text-muted-soft hover:border-control-border-strong hover:bg-control-surface-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/40 md:h-8 md:rounded-xl md:px-3",
    searchInputClassName
  );

  function applyStatusFilter(value: string) {
    handleStatusChange(value);
    setMobileFiltersOpen(false);
  }

  function handleStatusChange(value: string) {
    const nextStatus = value === "all" ? null : value;
    const params: { search?: string; status?: string } = {};
    if (currentSearch) params.search = currentSearch;
    if (nextStatus) params.status = nextStatus;
    const nextUrl = buildAdminFilterHref(listPath, params);
    router.replace(nextUrl, { scroll: false });
  }

  function renderFilterTrigger() {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="relative size-10 rounded-xl border-control-border/80 bg-surface-panel/80 text-foreground shadow-control hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:ring-focus-ring/40 md:size-8"
        aria-label={filterAriaLabel}
      >
        <SlidersHorizontal className="size-4" />
        {activeFiltersCount > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full border border-shell-surface bg-shell-surface px-1.5 py-0.5 text-[10px] font-semibold text-foreground shadow-sm">
            {activeFiltersCount}
          </span>
        ) : null}
        <span className="sr-only">{filterAriaLabel}</span>
      </Button>
    );
  }

  function renderFilterOptions(onValueChange: (value: string) => void) {
    return (
      <>
        <DropdownMenuRadioGroup value={currentStatus || "all"} onValueChange={onValueChange}>
          <DropdownMenuRadioItem value="all">{allStatusLabel}</DropdownMenuRadioItem>
          {statusOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </>
    );
  }

  if (isCompact) {
    return (
      <div className="flex items-center gap-2 p-2">
        <form action={listPath} method="GET" className="min-w-0 flex-1">
          <Input
            name="search"
            defaultValue={currentSearch}
            placeholder={searchPlaceholder}
            className={mobileToolbarInputClassName}
          />
          {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
        </form>

        <div className="md:hidden">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>{renderFilterTrigger()}</SheetTrigger>
            <SheetContent
              side="bottom"
              showCloseButton={false}
              className="rounded-t-[1.75rem] border-t border-surface-border/70 bg-shell-surface/98 px-0 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-0 shadow-2xl supports-backdrop-filter:bg-shell-surface/92 supports-backdrop-filter:backdrop-blur-xl"
            >
              <SheetHeader className="gap-1 border-b border-surface-border/60 px-4 pb-3 pt-4 text-left">
                <SheetTitle>Filtres</SheetTitle>
                <SheetDescription>Affinez la liste sans réduire l’espace utile.</SheetDescription>
              </SheetHeader>

              <div className="px-4 py-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted-strong">
                    Statut
                  </p>
                  {activeFiltersCount > 0 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-full px-3 text-xs"
                      onClick={() => applyStatusFilter("all")}
                    >
                      Réinitialiser
                    </Button>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <button
                    type="button"
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition-colors",
                      !currentStatus
                        ? "border-control-border-strong bg-control-surface-selected text-foreground"
                        : "border-control-border/70 bg-surface-panel/70 text-text-muted-strong hover:bg-control-surface-hover"
                    )}
                    onClick={() => applyStatusFilter("all")}
                  >
                    <span>{allStatusLabel}</span>
                    {!currentStatus ? (
                      <span className="text-[11px] font-medium text-text-muted-strong">Actif</span>
                    ) : null}
                  </button>

                  {statusOptions.map((option) => {
                    const isActive = currentStatus === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={cn(
                          "flex min-h-11 w-full items-center justify-between rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition-colors",
                          isActive
                            ? "border-control-border-strong bg-control-surface-selected text-foreground"
                            : "border-control-border/70 bg-surface-panel/70 text-text-muted-strong hover:bg-control-surface-hover"
                        )}
                        onClick={() => applyStatusFilter(option.value)}
                      >
                        <span>{option.label}</span>
                        {isActive ? (
                          <span className="text-[11px] font-medium text-text-muted-strong">
                            Actif
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>{renderFilterTrigger()}</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
              <DropdownMenuLabel>Statut</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {renderFilterOptions(handleStatusChange)}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div className={rootClassName}>
      <form action={listPath} method="GET">
        <Input
          name="search"
          defaultValue={currentSearch}
          placeholder={searchPlaceholder}
          className={inputClassName}
        />
        {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
      </form>
      <Select value={currentStatus || "all"} onValueChange={handleStatusChange}>
        <SelectTrigger size={resolvedSelectTriggerSize} className={selectTriggerClassName}>
          <SelectValue placeholder={allStatusLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{allStatusLabel}</SelectItem>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
