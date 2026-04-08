"use client";

import { Search } from "lucide-react";
import type { JSX } from "react";

import { AdminSearchInput } from "@/components/admin/tables/admin-search-input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type ProductSearchSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  triggerClassName?: string;
};

export function ProductSearchSheet({
  open,
  onOpenChange,
  value,
  onChange,
  triggerClassName,
}: ProductSearchSheetProps): JSX.Element {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onOpenChange(true)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 text-[11px] sm:px-3 sm:text-xs [@media(max-height:480px)]:gap-1 [@media(max-height:480px)]:px-2 [@media(max-height:480px)]:text-[10px]",
          triggerClassName
        )}
        aria-label="Rechercher un produit"
      >
        <Search className="h-4 w-4" />
        <span>Recherche</span>
      </Button>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="top" className="flex flex-col gap-4 border-b p-0 sm:max-w-none">
          <SheetHeader className="border-b px-4 py-4 text-left">
            <SheetTitle>Rechercher un produit</SheetTitle>
          </SheetHeader>

          <div className="px-4 pb-4">
            <AdminSearchInput
              value={value}
              onChange={onChange}
              placeholder="Rechercher un produit…"
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
