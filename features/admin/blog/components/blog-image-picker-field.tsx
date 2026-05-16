"use client";

import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AdminMediaListItem } from "@/features/admin/media/types/admin-media-list-item.types";

type BlogImagePickerFieldProps = {
  name: string;
  label: string;
  defaultValue: string | null;
  assets: AdminMediaListItem[];
  uploadsPublicPath: string;
};

export function BlogImagePickerField({
  name,
  label,
  defaultValue,
  assets,
  uploadsPublicPath,
}: BlogImagePickerFieldProps) {
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(
    defaultValue ?? null
  );
  const [open, setOpen] = useState(false);

  const basePath = uploadsPublicPath.replace(/\/$/, "");

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>

      <input type="hidden" name={name} value={selectedFilePath ?? ""} />

      <div className="flex items-center gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-surface-subtle">
          {selectedFilePath !== null ? (
            <Image
              src={`${basePath}/${selectedFilePath}`}
              alt={label}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-text-muted-soft">
              Aucune
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                Sélectionner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{label}</DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto">
                {assets.length === 0 ? (
                  <p className="text-sm text-text-muted-soft">
                    Aucun média disponible.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {assets.map((asset) => (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => {
                          setSelectedFilePath(asset.filePath);
                          setOpen(false);
                        }}
                        className="group relative aspect-square overflow-hidden rounded-md border border-border bg-surface-subtle transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        title={asset.originalName}
                      >
                        <Image
                          src={`${basePath}/${asset.filePath}`}
                          alt={asset.originalName}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {selectedFilePath !== null && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-text-muted-soft"
              onClick={() => setSelectedFilePath(null)}
            >
              Retirer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
