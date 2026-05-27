"use client";

import { AdminHierarchicalCheckboxFilter } from "./admin-hierarchical-checkbox-filter";

type AdminConfigHierarchicalCheckboxFilterProps<TItem> = Readonly<{
  items: TItem[];
  selected: string[];
  emptyLabel: string;
  onChange: (next: string[]) => void;
  getId: (item: TItem) => string;
  getLabel: (item: TItem) => string;
  getParentId: (item: TItem) => string | null;
  getValue: (item: TItem) => string;
}>;

export function AdminConfigHierarchicalCheckboxFilter<TItem>({
  items,
  selected,
  emptyLabel,
  onChange,
  getId,
  getLabel,
  getParentId,
  getValue,
}: AdminConfigHierarchicalCheckboxFilterProps<TItem>) {
  return (
    <AdminHierarchicalCheckboxFilter
      items={items.map((item) => ({
        id: getId(item),
        label: getLabel(item),
        parentId: getParentId(item),
        value: getValue(item),
      }))}
      selected={selected}
      emptyLabel={emptyLabel}
      onChange={onChange}
    />
  );
}
