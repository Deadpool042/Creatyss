"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type AdminMediaSelectedSheetProps = Readonly<{
  closeHref: string;
  description: string;
  title: string;
  children: ReactNode;
}>;

export function AdminMediaSelectedSheet({
  closeHref,
  description,
  title,
  children,
}: AdminMediaSelectedSheetProps) {
  const router = useRouter();

  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) {
          router.replace(closeHref, { scroll: false });
        }
      }}
    >
      <SheetContent
        side="bottom"
        className="h-[92dvh] rounded-t-[1.75rem] border-t border-surface-border/70 bg-[color:color-mix(in_srgb,var(--shell-surface)_90%,white_10%)] p-0 shadow-floating xl:hidden"
      >
        <SheetHeader className="gap-1 border-b border-surface-border/60 px-4 pb-3 pt-5 text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
