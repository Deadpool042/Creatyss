"use client";

import { Search } from "lucide-react";
import type { JSX } from "react";

import { AdminSearchInput } from "@/components/admin/tables";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PRODUCT_SEARCH_SHEET_COPY } from "@/features/admin/products/config";
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
  const hasActiveSearch = value.trim().length > 0;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onOpenChange(true)}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs [@media(max-height:480px)]:h-8 [@media(max-height:480px)]:gap-1 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:text-[11px]",
          hasActiveSearch &&
            "border-surface-border-strong bg-interactive-selected text-foreground hover:bg-interactive-selected",
          triggerClassName
        )}
        aria-label={PRODUCT_SEARCH_SHEET_COPY.triggerAriaLabel}
      >
        <Search className="h-4 w-4" />
        <span className="[@media(max-height:480px)]:hidden">{PRODUCT_SEARCH_SHEET_COPY.triggerLabel}</span>
        <span className="hidden [@media(max-height:480px)]:inline">{PRODUCT_SEARCH_SHEET_COPY.triggerCompactLabel}</span>
      </Button>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="top"
          className="flex max-h-[72svh] flex-col gap-3 border-b p-0 sm:max-w-none [@media(max-height:480px)]:max-h-[82svh]"
        >
          <SheetHeader className="border-b px-4 py-3 text-left [@media(max-height:480px)]:py-2.5">
            <SheetTitle>{PRODUCT_SEARCH_SHEET_COPY.title}</SheetTitle>
          </SheetHeader>

          <div className="px-4 pb-4">
            <AdminSearchInput
              value={value}
              onChange={onChange}
              placeholder={PRODUCT_SEARCH_SHEET_COPY.placeholder}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
