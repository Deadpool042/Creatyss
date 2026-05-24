"use client";

import { cn } from "@/lib/utils";
import { AdminSelectFilterControl } from "./admin-select-filter-control";

type AdminHierarchicalSelectFilterOption = {
  value: string;
  label: string;
};

type AdminHierarchicalSelectFilterProps = {
  parentOptions: AdminHierarchicalSelectFilterOption[];
  childOptions: AdminHierarchicalSelectFilterOption[];
  selectedParentValue: string;
  selectedChildValue: string;
  parentAllLabel: string;
  childAllLabel: string;
  onParentChange: (value: string) => void;
  onChildChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
  emptyChildClassName?: string;
};

export function AdminHierarchicalSelectFilter({
  parentOptions,
  childOptions,
  selectedParentValue,
  selectedChildValue,
  parentAllLabel,
  childAllLabel,
  onParentChange,
  onChildChange,
  className,
  triggerClassName,
  emptyChildClassName,
}: AdminHierarchicalSelectFilterProps) {
  const hasChildOptions = childOptions.length > 0;

  return (
    <div className={cn("grid gap-3 xl:grid-cols-2", className)}>
      <AdminSelectFilterControl
        value={selectedParentValue}
        onValueChange={onParentChange}
        options={[{ value: "all", label: parentAllLabel }, ...parentOptions]}
        placeholder={parentAllLabel}
        triggerClassName={cn("text-sm", triggerClassName)}
      />

      {hasChildOptions ? (
        <AdminSelectFilterControl
          value={selectedChildValue}
          onValueChange={onChildChange}
          options={[{ value: "all", label: childAllLabel }, ...childOptions]}
          placeholder={childAllLabel}
          triggerClassName={cn("text-sm", triggerClassName)}
        />
      ) : (
        <div className={emptyChildClassName ?? "hidden xl:block"} />
      )}
    </div>
  );
}
