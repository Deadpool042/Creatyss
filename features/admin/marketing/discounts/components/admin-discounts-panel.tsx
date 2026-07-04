"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

import { AdminConfigDataTableToolbar } from "@/components/admin/tables/admin-config-data-table-toolbar";
import { AdminSelectFilterControl } from "@/components/admin/tables/filters/admin-select-filter-control";
import { Button } from "@/components/ui/button";
import type { AdminDiscountSummary } from "@/features/admin/marketing/discounts/types/admin-discount.types";

import { AdminDiscountCreateSheet } from "./admin-discount-create-sheet";
import { AdminDiscountsList } from "./admin-discounts-list";

const STATUS_FILTER_ALL = "all";

const STATUS_FILTER_OPTIONS = [
  { value: STATUS_FILTER_ALL, label: "Tous les statuts" },
  { value: "ACTIVE", label: "Actif" },
  { value: "INACTIVE", label: "Inactif" },
  { value: "DRAFT", label: "Brouillon" },
  { value: "ARCHIVED", label: "Archivé" },
] as const;

type StatusFilterValue = (typeof STATUS_FILTER_OPTIONS)[number]["value"];

type AdminDiscountsPanelProps = Readonly<{
  discounts: ReadonlyArray<AdminDiscountSummary>;
  automationEnabled: boolean;
  rulesEnabled: boolean;
  products: ReadonlyArray<{ id: string; name: string; slug: string }>;
  variants: ReadonlyArray<{
    id: string;
    productName: string;
    variantName: string | null;
    sku: string;
  }>;
  categories: ReadonlyArray<{ id: string; name: string; slug: string }>;
  errorMessage: string | null;
}>;

function getSearchableTypeLabel(discount: AdminDiscountSummary): string {
  switch (discount.type) {
    case "FREE_SHIPPING":
      return "livraison offerte";
    case "FIXED_AMOUNT":
      return "montant fixe";
    case "PERCENTAGE":
    default:
      return "pourcentage";
  }
}

function matchesDiscountSearch(discount: AdminDiscountSummary, query: string): boolean {
  const haystack = [
    discount.code,
    discount.name,
    getSearchableTypeLabel(discount),
    discount.isAutomatic ? "automatique" : "code manuel",
  ];

  return haystack.some((value) => value.toLocaleLowerCase("fr-FR").includes(query));
}

export function AdminDiscountsPanel({
  discounts,
  automationEnabled,
  rulesEnabled,
  products,
  variants,
  categories,
  errorMessage,
}: AdminDiscountsPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const created = searchParams.get("discount_created");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilterValue>(STATUS_FILTER_ALL);
  const [sheetOpen, setSheetOpen] = useState(errorMessage !== null);

  // La création redirige avec ?discount_created / ?discount_error : les client
  // components survivent à cette navigation, l'état d'ouverture doit donc se
  // resynchroniser sur ces signaux — pendant le rendu, pas dans un effet.
  const [prevCreated, setPrevCreated] = useState(created);
  if (created !== prevCreated) {
    setPrevCreated(created);
    if (created !== null) {
      setSheetOpen(false);
    }
  }

  const [prevError, setPrevError] = useState(errorMessage);
  if (errorMessage !== prevError) {
    setPrevError(errorMessage);
    if (errorMessage !== null) {
      setSheetOpen(true);
    }
  }

  function handleSheetOpenChange(next: boolean) {
    setSheetOpen(next);
    // Purge les signaux de la soumission précédente pour qu'une nouvelle
    // soumission produise un changement d'URL détectable, même à l'identique.
    if (next && (created !== null || errorMessage !== null)) {
      router.replace(pathname);
    }
  }

  const createLabel = automationEnabled ? "Nouvelle remise" : "Nouveau code promo";
  const createTrigger = (
    <Button
      type="button"
      size="sm"
      className="h-8 shrink-0 gap-1.5"
      aria-haspopup="dialog"
      aria-expanded={sheetOpen}
      onClick={() => handleSheetOpenChange(true)}
    >
      <Plus className="size-3.5" />
      <span className="hidden sm:inline">{createLabel}</span>
      <span className="sm:hidden">Nouvelle</span>
    </Button>
  );

  const normalizedQuery = search.trim().toLocaleLowerCase("fr-FR");
  const isFiltered = normalizedQuery.length > 0 || status !== STATUS_FILTER_ALL;

  const filteredDiscounts = useMemo(
    () =>
      discounts.filter(
        (discount) =>
          (status === STATUS_FILTER_ALL || discount.status === status) &&
          (normalizedQuery.length === 0 || matchesDiscountSearch(discount, normalizedQuery))
      ),
    [discounts, normalizedQuery, status]
  );

  return (
    <div className="flex flex-col gap-3">
      <AdminConfigDataTableToolbar
        search={search}
        onSearchChange={setSearch}
        mobileSearchPlaceholder="Rechercher une remise…"
        desktopSearchPlaceholder="Rechercher une remise…"
        mobileControls={
          <AdminSelectFilterControl
            value={status}
            onValueChange={(value) => setStatus(value)}
            options={[...STATUS_FILTER_OPTIONS]}
            triggerClassName="h-9 w-32 shrink-0 text-xs text-foreground/65"
          />
        }
        mobileTrailing={createTrigger}
        desktopFilters={
          <AdminSelectFilterControl
            value={status}
            onValueChange={(value) => setStatus(value)}
            options={[...STATUS_FILTER_OPTIONS]}
            triggerClassName="h-8 w-40 text-xs text-foreground/65"
          />
        }
        desktopTrailing={createTrigger}
        resultsCount={filteredDiscounts.length}
        resultsFullLabel={(count) => `${count} remise${count > 1 ? "s" : ""}`}
        resultsShortLabel={(count) => `${count} remise${count > 1 ? "s" : ""}`}
      />

      <AdminDiscountsList
        discounts={filteredDiscounts}
        {...(isFiltered ? { emptyMessage: "Aucune remise ne correspond à la recherche." } : {})}
      />

      <AdminDiscountCreateSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        automationEnabled={automationEnabled}
        rulesEnabled={rulesEnabled}
        products={products}
        variants={variants}
        categories={categories}
        errorMessage={errorMessage}
      />
    </div>
  );
}
