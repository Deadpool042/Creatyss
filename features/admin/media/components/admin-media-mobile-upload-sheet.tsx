"use client";

import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { MediaLibrarySearchParams } from "./admin-media-library-helpers";
import { AdminMediaUploadForm } from "./admin-media-upload-form";

type AdminMediaMobileUploadSheetProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchState?: Pick<
    MediaLibrarySearchParams,
    "format" | "perPage" | "q" | "sort" | "usage" | "view"
  > | undefined;
}>;

export function AdminMediaMobileUploadSheet({
  open,
  onOpenChange,
  searchState,
}: AdminMediaMobileUploadSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <Button type="button" size="icon-sm" className="rounded-full sm:hidden" onClick={() => onOpenChange(true)}>
        <Upload className="size-4" />
        <span className="sr-only">Importer un média</span>
      </Button>

      <SheetContent side="bottom" className="max-h-[85dvh] rounded-t-[1.75rem] p-0 sm:hidden">
        <SheetHeader className="gap-1 border-b border-surface-border/60 px-4 pb-3 pt-5 text-left">
          <SheetTitle>Importer un média</SheetTitle>
          <SheetDescription>Ajoute une image locale à la bibliothèque sans quitter la grille.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 px-4 py-4">
          <AdminMediaUploadForm searchState={searchState} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
