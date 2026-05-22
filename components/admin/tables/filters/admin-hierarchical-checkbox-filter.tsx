"use client";

import { Checkbox } from "@/components/ui/checkbox";

export type AdminHierarchicalCheckboxFilterItem = {
  id: string;
  label: string;
  parentId: string | null;
  value: string;
};

type AdminHierarchicalCheckboxFilterProps = {
  items: AdminHierarchicalCheckboxFilterItem[];
  selected: string[];
  emptyLabel: string;
  onChange: (next: string[]) => void;
};

export function AdminHierarchicalCheckboxFilter({
  items,
  selected,
  emptyLabel,
  onChange,
}: AdminHierarchicalCheckboxFilterProps) {
  const roots = items.filter((item) => item.parentId === null);
  const childrenByParentId: Record<string, AdminHierarchicalCheckboxFilterItem[]> = {};

  for (const item of items) {
    if (item.parentId) {
      (childrenByParentId[item.parentId] ??= []).push(item);
    }
  }

  const orphans = roots.filter((root) => !childrenByParentId[root.id]);
  const parents = roots.filter((root) => childrenByParentId[root.id]);

  function toggle(value: string) {
    onChange(
      selected.includes(value)
        ? selected.filter((selectedValue) => selectedValue !== value)
        : [...selected, value],
    );
  }

  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      {parents.map((parent) => (
        <div key={parent.id}>
          <label className="flex cursor-pointer items-center gap-2.5 rounded px-1 py-1.5 text-sm font-medium hover:bg-muted/50">
            <Checkbox checked={selected.includes(parent.value)} onCheckedChange={() => toggle(parent.value)} />
            {parent.label}
          </label>
          {childrenByParentId[parent.id]?.map((child) => (
            <label
              key={child.id}
              className="flex cursor-pointer items-center gap-2.5 rounded py-1.5 pl-7 pr-1 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <Checkbox checked={selected.includes(child.value)} onCheckedChange={() => toggle(child.value)} />
              <span className="mr-0.5 text-[0.7rem] text-brand/60">›</span>
              {child.label}
            </label>
          ))}
        </div>
      ))}
      {orphans.length > 0 && parents.length > 0 ? (
        <div className="my-1 border-t border-surface-border" />
      ) : null}
      {orphans.map((item) => (
        <label
          key={item.id}
          className="flex cursor-pointer items-center gap-2.5 rounded px-1 py-1.5 text-sm hover:bg-muted/50"
        >
          <Checkbox checked={selected.includes(item.value)} onCheckedChange={() => toggle(item.value)} />
          {item.label}
        </label>
      ))}
    </div>
  );
}
