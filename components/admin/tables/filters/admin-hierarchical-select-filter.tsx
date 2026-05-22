"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
      <Select value={selectedParentValue} onValueChange={onParentChange}>
        <SelectTrigger className={cn("w-full text-sm", triggerClassName)}>
          <SelectValue placeholder={parentAllLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{parentAllLabel}</SelectItem>
          {parentOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasChildOptions ? (
        <Select value={selectedChildValue} onValueChange={onChildChange}>
          <SelectTrigger className={cn("w-full text-sm", triggerClassName)}>
            <SelectValue placeholder={childAllLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{childAllLabel}</SelectItem>
            {childOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className={emptyChildClassName ?? "hidden xl:block"} />
      )}
    </div>
  );
}
