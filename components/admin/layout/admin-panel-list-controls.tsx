"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  searchInputClassName?: string;
  selectTriggerSize?: "sm" | "default";
}>;

export function AdminPanelListControls({
  listPath,
  searchPlaceholder,
  statusOptions,
  allStatusLabel = "Tous les statuts",
  searchInputClassName,
  selectTriggerSize = "default",
}: AdminPanelListControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "";

  function handleStatusChange(value: string) {
    const nextStatus = value === "all" ? null : value;
    const params: { search?: string; status?: string } = {};
    if (currentSearch) params.search = currentSearch;
    if (nextStatus) params.status = nextStatus;
    const nextUrl = buildAdminFilterHref(listPath, params);
    router.replace(nextUrl, { scroll: false });
  }

  return (
    <div className="grid gap-2">
      <form action={listPath} method="GET">
        <Input
          name="search"
          defaultValue={currentSearch}
          placeholder={searchPlaceholder}
          className={searchInputClassName}
        />
        {currentStatus && (
          <input type="hidden" name="status" value={currentStatus} />
        )}
      </form>
      <Select value={currentStatus || "all"} onValueChange={handleStatusChange}>
        <SelectTrigger size={selectTriggerSize} className="w-full">
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
