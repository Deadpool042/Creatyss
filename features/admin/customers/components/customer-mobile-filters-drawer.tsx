"use client";

import type { JSX } from "react";

import { AdminFilterField } from "@/components/admin/tables/filters/admin-filter-field";
import { AdminSelectFilterControl } from "@/components/admin/tables/filters/admin-select-filter-control";
import type { AdminDataTableActiveFilterItem } from "@/components/admin/tables/filters/panel/admin-data-table-active-filters";
import { AdminDataTableFiltersDrawer } from "@/components/admin/tables/filters/panel/admin-data-table-filters-drawer";
import {
  CUSTOMER_SORT_LABEL_OPTIONS,
  CUSTOMER_STATUS_FILTER_OPTIONS,
  type CustomerSortOption,
  type CustomerStatusFilterValue,
} from "@/entities/customer";

type CustomerMobileFiltersDrawerProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: CustomerStatusFilterValue;
  sort: CustomerSortOption;
  hasActiveFilters: boolean;
  activeFilterItems: AdminDataTableActiveFilterItem[];
  onStatusChange: (value: CustomerStatusFilterValue) => void;
  onSortChange: (value: CustomerSortOption) => void;
  onReset: () => void;
}>;

const MOBILE_SELECT_TRIGGER_CLASS_NAME =
  "h-10 rounded-xl bg-card text-sm [@media(max-height:480px)]:h-9";

export function CustomerMobileFiltersDrawer({
  open,
  onOpenChange,
  status,
  sort,
  hasActiveFilters,
  activeFilterItems,
  onStatusChange,
  onSortChange,
  onReset,
}: CustomerMobileFiltersDrawerProps): JSX.Element {
  return (
    <AdminDataTableFiltersDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Filtres clients"
      description="Affinez la liste avec le statut et l'ordre de tri."
      resetLabel="Réinitialiser"
      applyLabel="Voir les résultats"
      resetDisabled={!hasActiveFilters}
      stackedFooter
      onReset={() => {
        onReset();
        onOpenChange(false);
      }}
      onApply={() => onOpenChange(false)}
      activeFiltersTitle="Filtres actifs"
      activeFilterItems={activeFilterItems}
      clearActiveFiltersLabel="Effacer les filtres"
      onClearActiveFilters={onReset}
      contentClassName="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-5">
        <AdminFilterField label="Statut">
          <AdminSelectFilterControl
            value={status}
            onValueChange={onStatusChange}
            options={[...CUSTOMER_STATUS_FILTER_OPTIONS]}
            triggerClassName={MOBILE_SELECT_TRIGGER_CLASS_NAME}
          />
        </AdminFilterField>

        <AdminFilterField label="Tri">
          <AdminSelectFilterControl
            value={sort}
            onValueChange={onSortChange}
            options={[...CUSTOMER_SORT_LABEL_OPTIONS]}
            triggerClassName={MOBILE_SELECT_TRIGGER_CLASS_NAME}
          />
        </AdminFilterField>
      </div>
    </AdminDataTableFiltersDrawer>
  );
}
