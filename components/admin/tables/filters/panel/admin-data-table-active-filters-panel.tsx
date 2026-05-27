import {
  AdminDataTableActiveFilters,
  type AdminDataTableActiveFilterItem,
} from "./admin-data-table-active-filters";

type AdminDataTableActiveFiltersPanelProps = {
  title: string;
  items: AdminDataTableActiveFilterItem[];
  count?: number;
  onClearAll?: () => void;
  clearLabel?: string;
};

export function AdminDataTableActiveFiltersPanel({
  title,
  items,
  count = items.length,
  onClearAll,
  clearLabel,
}: AdminDataTableActiveFiltersPanelProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-surface-border bg-surface-panel-soft p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </p>

        <span className="rounded-full border border-surface-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {count}
        </span>
      </div>

      <AdminDataTableActiveFilters
        items={items}
        {...(onClearAll ? { onClearAll } : {})}
        {...(clearLabel ? { clearLabel } : {})}
      />
    </div>
  );
}
