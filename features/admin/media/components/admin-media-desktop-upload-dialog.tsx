"use client";

import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { MediaLibrarySearchParams } from "./admin-media-library-helpers";
import { AdminMediaUploadForm } from "./admin-media-upload-form";

type AdminMediaDesktopUploadDialogProps = Readonly<{
  searchState?: Pick<
    MediaLibrarySearchParams,
    "format" | "perPage" | "q" | "sort" | "usage" | "view"
  > | undefined;
}>;

export function AdminMediaDesktopUploadDialog({
  searchState,
}: AdminMediaDesktopUploadDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size="sm" className="hidden sm:inline-flex sm:min-w-40">
          <Upload className="size-4" />
          Importer
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="gap-1 border-b border-surface-border/60 px-5 pb-4 pt-5">
          <DialogTitle>Importer un média</DialogTitle>
          <DialogDescription>
            Ajoute une image locale à la bibliothèque sans quitter la page.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 px-5 py-5">
          <AdminMediaUploadForm searchState={searchState} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
