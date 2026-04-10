import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

export type AdminDataTableActiveFilterItem = {
  key: string;
  label: string;
  onRemove: () => void;
};

type AdminDataTableActiveFiltersProps = {
  items: AdminDataTableActiveFilterItem[];
  onClearAll?: () => void;
};

export function AdminDataTableActiveFilters({
  items,
  onClearAll,
}: AdminDataTableActiveFiltersProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={item.onRemove}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-surface-border bg-surface-panel-soft px-3 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-interactive-hover hover:text-foreground focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50"
        >
          <span className="truncate">{item.label}</span>
          <X className="h-3.5 w-3.5" />
        </button>
      ))}

      {onClearAll ? (
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={onClearAll}
          className="h-8 rounded-full px-3 text-xs text-muted-foreground"
        >
          Tout effacer
        </Button>
      ) : null}
    </div>
  );
}
