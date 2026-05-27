import type { ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type AdminDataTableFiltersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AdminDataTableFiltersSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: AdminDataTableFiltersSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={[
          "flex flex-col bg-background p-0",
          "max-h-[82svh] supports-[height:100dvh]:max-h-[82dvh]",
          "[@media(max-height:480px)]:max-h-[92svh]",
          "[@media(max-height:480px)]:supports-[height:100dvh]:max-h-[92dvh]",
        ].join(" ")}
      >
        <SheetHeader className="shrink-0 border-b border-shell-border px-4 py-3 text-left [@media(max-height:480px)]:py-2.5">
          <SheetTitle className="text-base font-semibold tracking-tight">{title}</SheetTitle>
          {description ? (
            <SheetDescription className="text-sm leading-6 text-muted-foreground [@media(max-height:480px)]:hidden">
              {description}
            </SheetDescription>
          ) : null}
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 [@media(max-height:480px)]:py-3">
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t border-shell-border bg-background px-4 py-3 [@media(max-height:480px)]:py-2.5">
            {footer}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
